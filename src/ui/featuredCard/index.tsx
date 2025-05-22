'use client';

import React from 'react';
import styles from './style.module.scss';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className = '', }) => {
    return (
        <div className={`${styles.featureCard} ${className}`}>
            <div className={styles.icon}>{icon}</div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
};

export default FeatureCard;