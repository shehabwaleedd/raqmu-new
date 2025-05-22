'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TransitionLink from '@/animation/transitionLink';

interface CardProps {
    title: string;
    description?: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    href?: string;
    actionText?: string;
    actionIcon?: React.ReactNode;
    rating?: number;
    price?: string;
    features?: string[];
    variant?: 'product' | 'info' | 'feature' | 'simple';
    aspectRatio?: 'square' | 'landscape' | 'portrait';
    className?: string;
}

const defaultIcon = (
    <span className="text-lg">▸</span>
);

const Card: React.FC<CardProps> = ({
    title,
    description,
    imageSrc,
    imageAlt = '',
    href,
    actionText = 'View Details',
    actionIcon = defaultIcon,
    rating,
    price,
    features,
    variant = 'product',
    aspectRatio = 'landscape',
    className = '',
}) => {
    const getAspectClass = () => {
        switch (aspectRatio) {
            case 'square': return 'aspect-square';
            case 'portrait': return 'aspect-[3/4]';
            case 'landscape': return 'aspect-video';
            default: return 'aspect-video';
        }
    };

    const card = (
        <motion.div className={`border-2px border-black bg-white font-helvetica group h-full flex flex-col ${className}`} whileHover={variant === 'product' || variant === 'simple' ? { y: -4 } : {}} transition={{ duration: 0.3 }}>
            {imageSrc && (
                <div className={`${getAspectClass()} border-b-2px border-black bg-white relative overflow-hidden`}>
                    <Image src={imageSrc} alt={imageAlt || title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    
                    {variant === 'product' && (
                        <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-90 border-b-2px border-black backdrop-blur-sm p-3">
                            <div className="border-2px border-black bg-gray-50 px-2 py-1 inline-block">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">FEATURED</div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                {variant === 'feature' && (
                    <div className="border-2px border-black bg-gray-50 w-12 h-12 flex items-center justify-center mb-4">
                        {actionIcon}
                    </div>
                )}

                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-black mb-4 leading-tight">{title}</h3>

                {description && (
                    <div className="flex-1 mb-4 prose prose-sm max-w-none [&>p]:text-sm [&>p]:font-medium [&>p]:text-gray-800 [&>p]:leading-relaxed [&>p]:mb-3">
                        {typeof description === 'string' ? <p>{description}</p> : description}
                    </div>
                )}

                {rating && (
                    <div className="border-2px border-black bg-gray-50 p-3 mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-yellow-500 text-lg">{'★'.repeat(Math.floor(rating))}</div>
                            <div className="text-sm font-bold text-black">{rating}</div>
                        </div>
                    </div>
                )}

                {price && (
                    <div className="border-2px border-black bg-black text-white p-3 mb-4">
                        <div className="text-lg font-bold uppercase tracking-wider">{price}</div>
                    </div>
                )}

                {features && features.length > 0 && (
                    <div className="border-2px border-black bg-gray-50 p-4 mb-4">
                        <div className="border-b-2px border-black bg-white px-2 py-1 inline-block mb-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-black">FEATURES</div>
                        </div>
                        <ul className="space-y-2">
                            {features.map((feature, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm font-medium text-black">
                                    <div className="w-1 h-1 bg-black flex-shrink-0"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {href && actionText && variant !== 'feature' && (
                    <div className="border-t-2px border-black pt-4 mt-auto">
                        <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 p-3 text-center group-hover:translate-y-[-2px] transform transition-transform duration-200">
                            <div className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider">
                                <span>{actionText}</span>
                                {actionIcon && <span>{actionIcon}</span>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );

    if (href) {
        return (
            <TransitionLink href={href} className="block h-full hover:bg-gray-50 transition-colors duration-200">
                {card}
            </TransitionLink>
        );
    }

    return card;
};

export default Card;