"use client";

import EditorSidebar from "@/components/editor/EditorSidebar";
import { ToastContainer } from "@/components/ui/Toast";
import { ArrowLeft, Monitor, Smartphone, ExternalLink } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TemplateData, defaultTemplateData } from "@/types/template";
import Link from 'next/link';

export default function EditorPage() {
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
    const [data, setData] = useState<TemplateData>(defaultTemplateData);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const activeImageField = useRef<string | null>(null);

    const handleDataChange = <K extends keyof TemplateData>(field: K, value: TemplateData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));

        // Sync with iframe
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_DATA',
                payload: { ...data, [field]: value }
            }, '*');
        }
    };

    // Handle messages from iframe (EditableText updates, Image clicks)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // In prod verify origin
            if (!event.data) return;

            if (event.data.type === 'UPDATE_DATA') {
                const { field, value } = event.data;
                if (field && value !== undefined) {
                    setData(prev => ({ ...prev, [field]: value }));
                }
            }

            if (event.data.type === 'REQUEST_IMAGE_CHANGE') {
                const { field } = event.data;
                activeImageField.current = field;
                fileInputRef.current?.click();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // Sync data with iframe whenever it changes
    useEffect(() => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_DATA', payload: data }, '*');
        }
    }, [data]);

    // Forward highlight messages to iframe
    useEffect(() => {
        const handleHighlightMessage = (event: MessageEvent) => {
            if (event.data?.type === 'HIGHLIGHT') {
                iframeRef.current?.contentWindow?.postMessage(event.data, '*');
            }
        };

        window.addEventListener('message', handleHighlightMessage);
        return () => window.removeEventListener('message', handleHighlightMessage);
    }, []);

    const handleIframeLoad = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_DATA', payload: data }, '*');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeImageField.current) {
            const imageUrl = URL.createObjectURL(file);
            // Handle nested fields
            const field = activeImageField.current;
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                const currentParent = data[parent as keyof TemplateData];
                if (typeof currentParent === 'object' && currentParent !== null) {
                    setData(prev => ({
                        ...prev,
                        [parent]: { ...currentParent, [child]: imageUrl }
                    }));
                }
            } else {
                setData(prev => ({ ...prev, [field]: imageUrl }));
            }
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="flex h-screen bg-[#F7F5F0] overflow-hidden font-sans">
            {/* Toast Container for notifications */}
            <ToastContainer />

            {/* Hidden File Input for Image Uploads */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* LEFT SIDEBAR - EDITOR */}
            <div className="w-[400px] flex-shrink-0 bg-[#F7F5F0] border-r border-[#DCD3C5] z-20 shadow-xl relative">
                <EditorSidebar data={data} onChange={handleDataChange} />

                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#E5E0D6] text-[#6B7A6C] transition-colors"
                    title="Voltar ao Dashboard"
                >
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* RIGHT AREA - PREVIEW */}
            <div className="flex-1 flex flex-col h-full relative bg-[#E5E0D6]/30">

                {/* Toolbar */}
                <div className="h-14 bg-white/80 border-b border-[#DCD3C5] flex items-center justify-center gap-4 px-6 z-10 backdrop-blur-sm">
                    <div className="flex items-center bg-[#F7F5F0] rounded-lg p-1 border border-[#DCD3C5]">
                        <button
                            onClick={() => setViewMode("desktop")}
                            className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-[#2A3B2E]' : 'text-[#6B7A6C] hover:text-[#2A3B2E]'}`}
                        >
                            <Monitor size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("mobile")}
                            className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-[#2A3B2E]' : 'text-[#6B7A6C] hover:text-[#2A3B2E]'}`}
                        >
                            <Smartphone size={18} />
                        </button>
                    </div>

                    <div className="absolute right-6 flex items-center gap-2">
                        <Link href="/preview/template1" target="_blank" className="text-xs font-medium text-[#6B7A6C] hover:text-[#C19B58] flex items-center gap-1 transition-colors">
                            Ver ao vivo <ExternalLink size={12} />
                        </Link>
                    </div>
                </div>

                {/* Preview Container */}
                <div className="flex-1 overflow-hidden flex items-center justify-center p-8 bg-noise">
                    <div
                        className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden origin-center ${viewMode === 'mobile'
                            ? 'w-[375px] h-[812px] rounded-[3rem] border-[8px] border-[#2A3B2E] ring-4 ring-[#C19B58]/20 shadow-[#2A3B2E]/20'
                            : 'w-full h-full rounded-lg border border-[#DCD3C5]'
                            }`}
                    >
                        <iframe
                            ref={iframeRef}
                            src="/preview/template1"
                            className="w-full h-full bg-white"
                            onLoad={handleIframeLoad}
                            title="Preview do Site"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
