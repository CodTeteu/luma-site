"use client";

import { Edit } from "lucide-react";

interface EditableImageProps {
    src: string;
    alt: string;
    field: string;
    className?: string;
}

export default function EditableImage({ src, alt, field, className }: EditableImageProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({
            type: "REQUEST_IMAGE_CHANGE",
            field
        }, "*");
    };

    return (
        <div
            className={`relative group cursor-pointer ${className}`}
            onClick={handleClick}
        >
            <img src={src} alt={alt} className="w-full h-full object-cover" />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 bg-white/90 p-2 rounded-full shadow-lg transition-opacity">
                    <Edit size={20} className="text-gray-700" />
                </div>
            </div>
        </div>
    );
}
