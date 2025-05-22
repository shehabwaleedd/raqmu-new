'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    subtitle?: string | React.ReactNode;
    align?: 'left' | 'center' | 'right';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, subtitle, align = 'left', size = 'md', className = '', }) => {
    return (
        <motion.header className={`${styles.header} ${styles[align]} ${styles[size]} ${className}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {eyebrow && (
                <motion.div className={styles.eyebrow} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    {eyebrow}
                </motion.div>
            )}

            <motion.h2 className={styles.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.2 }}>
                {title}
            </motion.h2>

            {subtitle && (
                <motion.div className={styles.subtitle} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.3 }}>
                    {typeof subtitle === 'string' ? <p>{subtitle}</p> : subtitle}
                </motion.div>
            )}
        </motion.header>
    );
};

export default SectionHeader;