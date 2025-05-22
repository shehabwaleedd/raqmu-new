'use client';

import React from 'react';
import styles from './style.module.scss';

interface FilterButtonProps {
    label: string;
    active?: boolean;
    onClick: () => void;
    className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, active = false, onClick, className = '', }) => {
    return (
        <button className={`${styles.filterButton} ${active ? styles.active : ''} ${className}`} onClick={onClick}>
            {label}
        </button>
    );
};

export default FilterButton;