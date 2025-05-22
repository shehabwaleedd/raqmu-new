'use client';

import React from 'react';
import styles from './style.module.scss';

interface ProductGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ children, columns = 4, gap = 'md', className = '', }) => {
    return (
        <div className={`${styles.grid} ${styles[`columns-${columns}`]} ${styles[`gap-${gap}`]} ${className}`}>
            {children}
        </div>
    );
};

export default ProductGrid;