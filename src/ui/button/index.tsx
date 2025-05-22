'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TransitionLink from '@/animation/transitionLink';
import styles from './style.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'shop';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    href,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'right',
    onClick,
    className = '',
}) => {
    const buttonClass = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;
    const content = (
        <>
            {icon && iconPosition === 'left' && <span className={styles.iconLeft}>{icon}</span>}
            <span className={styles.label}>{children}</span>
            {icon && iconPosition === 'right' && <span className={styles.iconRight}>{icon}</span>}
        </>
    );

    if (href) {
        return (
            <TransitionLink href={href} className={buttonClass} onClick={onClick}>
                <motion.div className={styles.buttonInner} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {content}
                </motion.div>
            </TransitionLink>
        );
    }

    return (
        <button className={buttonClass} onClick={onClick}>
            <motion.div className={styles.buttonInner} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {content}
            </motion.div>
        </button>
    );
};

export default Button;