'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

interface ProductHeroProps {
    title: string;
    subtitle?: string;
    className?: string;
}

const ProductHero: React.FC<ProductHeroProps> = ({ title, subtitle, className = '', }) => {
    return (
        <div className={`${styles.hero} ${className}`}>
            <motion.div className={styles.content} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <motion.h1 className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p className={styles.subtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
                        {subtitle}
                    </motion.p>
                )}
            </motion.div>
        </div >
    );
};

export default ProductHero;