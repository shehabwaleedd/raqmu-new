'use client';

import React from 'react';
import { motion } from 'framer-motion';
import styles from './style.module.scss';

interface ProductTabProps {
    tabs: string[];
    activeTab: string;
    onChange: (tab: string) => void;
    className?: string;
}

const ProductTab: React.FC<ProductTabProps> = ({ tabs, activeTab, onChange, className = '', }) => {
    return (
        <div className={`${styles.tabContainer} ${className}`}>
            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`} onClick={() => onChange(tab)}>
                        {tab}
                        {activeTab === tab && (
                            <motion.div className={styles.activeIndicator} layoutId="activeIndicator" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductTab;