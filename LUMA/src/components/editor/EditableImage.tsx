'use client';

import React from 'react';
import Image from 'next/image';

interface EditableImageProps {
    src: string;
    alt: string;
    field: string;
    className?: string;
}

const EditableImage: React.FC<EditableImageProps> = ({
    src,
    alt,
    className = '',
}) => {
    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            fill
            style={{ objectFit: 'cover' }}
        />
    );
};

export default EditableImage;
