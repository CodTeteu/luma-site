"use client";

import { useEffect, useState } from 'react';
import Template1 from '@/components/template1/Template1';
import { defaultTemplateData, TemplateData } from '@/types/template';

export default function TemplatePreview() {
    const [data, setData] = useState<TemplateData>(defaultTemplateData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            // In a real app we should check event.origin for security
            if (event.data?.type === 'UPDATE_DATA' && event.data.payload) {
                setData(event.data.payload);
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return <Template1 data={data} />;
}
