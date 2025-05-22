'use client';

import React from 'react';
import styles from './style.module.scss';

interface FeaturesGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    className?: string;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ children, columns = 4, className = '', }) => {
    return (
        <div className={`${styles.grid} ${styles[`columns-${columns}`]} ${className}`}>
            {children}
        </div>
    );
};

export default FeaturesGrid;