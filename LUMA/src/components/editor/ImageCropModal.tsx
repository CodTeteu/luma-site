"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface ImageCropModalProps {
    isOpen: boolean;
    imageUrl: string;
    aspectRatio: number;
    onConfirm: (croppedImageUrl: string) => void;
    onCancel: () => void;
}

/**
 * Create a cropped image from the original
 */
async function getCroppedImage(imageSrc: string, pixelCrop: Area): Promise<string> {
    const image = new Image();
    image.crossOrigin = "anonymous";

    return new Promise((resolve, reject) => {
        image.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Could not get canvas context"));
                return;
            }

            canvas.width = pixelCrop.width;
            canvas.height = pixelCrop.height;

            ctx.drawImage(
                image,
                pixelCrop.x,
                pixelCrop.y,
                pixelCrop.width,
                pixelCrop.height,
                0,
                0,
                pixelCrop.width,
                pixelCrop.height
            );

            canvas.toBlob((blob) => {
                if (!blob) {
                    reject(new Error("Canvas is empty"));
                    return;
                }
                const croppedImageUrl = URL.createObjectURL(blob);
                resolve(croppedImageUrl);
            }, "image/jpeg", 0.9);
        };

        image.onerror = () => reject(new Error("Failed to load image"));
        image.src = imageSrc;
    });
}

/**
 * Image cropping modal with react-easy-crop
 */
export default function ImageCropModal({
    isOpen,
    imageUrl,
    aspectRatio,
    onConfirm,
    onCancel,
}: ImageCropModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return;

        setIsProcessing(true);
        try {
            const croppedImage = await getCroppedImage(imageUrl, croppedAreaPixels);
            onConfirm(croppedImage);
        } catch (error) {
            console.error("Error cropping image:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
        onCancel();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-[#F7F5F0] rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-[#DCD3C5]">
                            <h3 className="text-lg font-medium text-[#2A3B2E] font-[family-name:var(--font-heading)]">
                                Recortar Imagem
                            </h3>
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-full hover:bg-[#E5E0D6] text-[#6B7A6C] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cropper Area */}
                        <div className="relative h-[400px] bg-stone-900">
                            <Cropper
                                image={imageUrl}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={aspectRatio}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                classes={{
                                    containerClassName: "rounded-none",
                                    cropAreaClassName: "border-2 border-[#C19B58]",
                                }}
                            />
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t border-[#DCD3C5] space-y-4">
                            {/* Zoom Control */}
                            <div className="flex items-center gap-4">
                                <ZoomOut size={16} className="text-[#6B7A6C]" />
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 h-1 bg-[#DCD3C5] rounded-full appearance-none cursor-pointer accent-[#C19B58]"
                                />
                                <ZoomIn size={16} className="text-[#6B7A6C]" />

                                <button
                                    onClick={() => setRotation((r) => (r + 90) % 360)}
                                    className="p-2 rounded-lg hover:bg-[#E5E0D6] text-[#6B7A6C] transition-colors ml-4"
                                    title="Girar 90°"
                                >
                                    <RotateCw size={18} />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 text-sm font-medium text-[#6B7A6C] hover:text-[#2A3B2E] transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={isProcessing}
                                    className="px-6 py-2 bg-[#C19B58] text-white rounded-lg text-sm font-medium hover:bg-[#b08d4b] transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isProcessing ? (
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Check size={16} />
                                    )}
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
