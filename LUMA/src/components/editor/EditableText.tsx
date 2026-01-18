'use client';

import React from 'react';

interface EditableTextProps {
    value: string;
    field?: string;
    tag?: React.ElementType;
    className?: string;
}

const EditableText: React.FC<EditableTextProps> = ({
    value,
    tag: Tag = 'span',
    className = '',
}) => {
    return <Tag className={className}>{value}</Tag>;
};

export default EditableText;
