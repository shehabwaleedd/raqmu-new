'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

interface FeatureItemProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description, className = '', }) => {
    return (
        <motion.div className={`${styles.feature} ${className}`} whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </motion.div>
    );
};

export default FeatureItem;