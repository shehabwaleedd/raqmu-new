'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TransitionLink from '@/animation/transitionLink';
import styles from './style.module.scss';

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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
    const card = (
        <motion.div className={`${styles.card} ${styles[variant]} ${styles[aspectRatio]} ${className}`} whileHover={variant === 'product' || variant === 'simple' ? { y: -8 } : {}} transition={{ duration: 0.3 }}>
            {imageSrc && (
                <div className={styles.imageWrapper}>
                    <Image src={imageSrc} alt={imageAlt || title} fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.image} />
                </div>
            )}

            <div className={styles.content}>
                {variant === 'feature' && (
                    <div className={styles.icon}>
                        {actionIcon}
                    </div>
                )}

                <h3 className={styles.title}>{title}</h3>

                {description && (
                    <div className={styles.description}>
                        {typeof description === 'string' ? <p>{description}</p> : description}
                    </div>
                )}

                {rating && (
                    <div className={styles.rating}>
                        <span className={styles.stars}>{'★'.repeat(Math.floor(rating))}</span>
                        <span className={styles.ratingValue}>{rating}</span>
                    </div>
                )}

                {price && (
                    <div className={styles.price}>{price}</div>
                )}

                {features && features.length > 0 && (
                    <ul className={styles.features}>
                        {features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                )}

                {href && actionText && variant !== 'feature' && (
                    <div className={styles.action}>
                        {actionText}
                        {actionIcon && <span className={styles.actionIcon}>{actionIcon}</span>}
                    </div>
                )}
            </div>
        </motion.div>
    );

    if (href) {
        return (
            <TransitionLink href={href} className={styles.cardLink}>
                {card}
            </TransitionLink>
        );
    }

    return card;
};

export default Card;