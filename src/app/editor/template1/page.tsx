"use client";

import EditorSidebar from "@/components/editor/EditorSidebar";
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

    const handleDataChange = (field: keyof TemplateData | string, value: any) => {
        setData(prev => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...(prev as any)[parent],
                        [child]: value
                    }
                };
            }
            return { ...prev, [field]: value };
        });
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

    const handleIframeLoad = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_DATA', payload: data }, '*');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && activeImageField.current) {
            const imageUrl = URL.createObjectURL(file);
            handleDataChange(activeImageField.current as keyof TemplateData, imageUrl);
            // Reset input
            e.target.value = '';
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Hidden File Input for Image Uploads */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* LEFT SIDEBAR - EDITOR */}
            <div className="w-[400px] flex-shrink-0 bg-white border-r border-gray-200 z-20 shadow-xl relative">
                <EditorSidebar data={data} onChange={handleDataChange} />

                {/* Back Link */}
                <Link
                    href="/dashboard"
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                    title="Voltar ao Dashboard"
                >
                    <ArrowLeft size={20} />
                </Link>
            </div>

            {/* RIGHT AREA - PREVIEW */}
            <div className="flex-1 flex flex-col h-full relative bg-[#e5e7eb]">

                {/* Toolbar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-4 px-6 z-10">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("desktop")}
                            className={`p-2 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Monitor size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("mobile")}
                            className={`p-2 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <Smartphone size={18} />
                        </button>
                    </div>

                    <div className="absolute right-6 flex items-center gap-2">
                        <a href="/preview/template1" target="_blank" className="text-xs font-medium text-gray-500 hover:text-[var(--gold)] flex items-center gap-1 transition-colors">
                            Ver ao vivo <ExternalLink size={12} />
                        </a>
                    </div>
                </div>

                {/* Preview Container */}
                <div className="flex-1 overflow-hidden flex items-center justify-center p-8">
                    <div
                        className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden origin-center ${viewMode === 'mobile'
                            ? 'w-[375px] h-[812px] rounded-[3rem] border-[10px] border-gray-800 ring-4 ring-gray-900/10'
                            : 'w-full h-full rounded-lg border border-gray-200'
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
