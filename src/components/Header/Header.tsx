import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';
import styles from './Header.module.css';

interface HeaderProps {
    title?: string;
    leftAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title = "Coach Max", leftAction }) => {
    const { user, logout, userRole } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get initials from email or name
    const getInitials = () => {
        if (!user) return '?';
        if (user.displayName) return user.displayName.substring(0, 2).toUpperCase();
        if (user.email) return user.email.substring(0, 2).toUpperCase();
        return 'U';
    };

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                {leftAction}
                <h1 className={styles.appTitle}>{title}</h1>
            </div>
            <div className={styles.profileContainer} ref={dropdownRef}>
                <button
                    className={styles.userAvatar}
                    onClick={toggleDropdown}
                    title="Profile & Settings"
                >
                    {getInitials()}
                </button>

                {dropdownOpen && (
                    <div className={styles.dropdown}>
                        <div className={styles.userInfo}>
                            <p className={styles.userEmail}>{user?.email}</p>
                            <span className={styles.roleBadge}>{userRole}</span>
                        </div>
                        <div className={styles.divider}></div>
                        <button className={styles.dropdownItem} onClick={handleLogout}>
                            <LogOut size={16} />
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};
