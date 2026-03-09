import React from 'react';
import type { WorkoutType } from '../../types';
import styles from './Badge.module.css';

interface BadgeProps {
    type: WorkoutType;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, className = '' }) => {
    return (
        <span className={`${styles.badge} ${styles[type.toLowerCase()]} ${className}`}>
            {type}
        </span>
    );
};
