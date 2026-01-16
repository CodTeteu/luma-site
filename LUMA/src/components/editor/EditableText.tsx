"use client";

import { useEffect, useRef } from "react";

interface EditableTextProps {
    value: string;
    field: string;
    className?: string;
    tag?: "h1" | "h2" | "p" | "span" | "div";
}

export default function EditableText({ value, field, className, tag = "span" }: EditableTextProps) {
    const ref = useRef<HTMLElement>(null);

    const handleBlur = () => {
        if (ref.current) {
            const newValue = ref.current.innerText;
            if (newValue !== value) {
                window.parent.postMessage({
                    type: "UPDATE_DATA",
                    field,
                    value: newValue
                }, "*");
            }
        }
    };

    // Keep manual sync if prop changes from outside (e.g. sidebar input)
    useEffect(() => {
        if (ref.current && ref.current.innerText !== value) {
            ref.current.innerText = value;
        }
    }, [value]);

    const Tag = tag as any;

    return (
        <Tag
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onBlur={handleBlur}
            className={`outline-none focus:ring-2 focus:ring-[var(--gold)]/50 focus:bg-white/10 rounded px-1 transition-all cursor-text empty:before:content-['...'] ${className}`}
        >
            {value}
        </Tag>
    );
}
