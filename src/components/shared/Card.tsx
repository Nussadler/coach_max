import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    active?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', active, ...props }) => {
    return (
        <div
            className={`${styles.card} ${active ? styles.active : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};
