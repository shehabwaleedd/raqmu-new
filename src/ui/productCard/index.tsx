'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import TransitionLink from '@/animation/transitionLink';
import styles from './style.module.scss';

interface ProductCardProps {
    title: string;
    imageSrc: string;
    imageAlt?: string;
    href: string;
    price: string;
    rating?: number;
    features?: string[];
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    title,
    imageSrc,
    imageAlt = '',
    href,
    price,
    rating,
    features,
    className = '',
}) => {
    const card = (
        <motion.div className={`${styles.card} ${className}`} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className={styles.imageWrapper}>
                <Image src={imageSrc} alt={imageAlt || title} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} />
            </div>

            <div className={styles.content}>
                {rating && (
                    <div className={styles.rating}>
                        <span className={styles.stars}>{'★'.repeat(Math.floor(rating))}</span>
                        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
                    </div>
                )}

                <h3 className={styles.title}>{title}</h3>

                {features && features.length > 0 && (
                    <div className={styles.feature}>{features[0]}</div>
                )}

                <div className={styles.price}>{price}</div>
            </div>
        </motion.div>
    );

    return (
        <TransitionLink href={href} className={styles.cardLink}>
            {card}
        </TransitionLink>
    );
};

export default ProductCard;