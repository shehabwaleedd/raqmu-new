'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    alignment?: 'left' | 'center' | 'right';
    className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    eyebrow,
    title,
    subtitle,
    alignment = 'left',
    className = '',
}) => {
    const alignmentClasses = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    };

    return (
        <motion.div className={`font-helvetica ${alignmentClasses[alignment]} ${className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {eyebrow && (
                <div className="border-2px border-black bg-white px-4 py-2 inline-block mb-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-black">{eyebrow}</div>
                </div>
            )}
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-wider text-black leading-none mb-6">
                {title}
            </h1>
            
            {subtitle && (
                <div className="border-l-4 border-black pl-6 max-w-3xl">
                    <p className="text-lg font-medium text-gray-800 leading-relaxed">
                        {subtitle}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default SectionHeader;