import React from 'react';
import { CalendarDays, Activity, UserCog } from 'lucide-react';
import styles from './AthleteTabs.module.css';

export type TabType = 'plan' | 'activities' | 'profile';

interface AthleteTabsProps {
    activeTab: TabType;
    onChange: (tab: TabType) => void;
}

export const AthleteTabs: React.FC<AthleteTabsProps> = ({ activeTab, onChange }) => {
    return (
        <nav className={styles.tabsContainer}>
            <button
                className={`${styles.tab} ${activeTab === 'plan' ? styles.active : ''}`}
                onClick={() => onChange('plan')}
            >
                <CalendarDays size={20} />
                <span className={styles.tabLabel}>Plan</span>
            </button>
            <button
                className={`${styles.tab} ${activeTab === 'activities' ? styles.active : ''}`}
                onClick={() => onChange('activities')}
            >
                <Activity size={20} />
                <span className={styles.tabLabel}>Aktivitäten</span>
            </button>
            <button
                className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
                onClick={() => onChange('profile')}
            >
                <UserCog size={20} />
                <span className={styles.tabLabel}>Profil</span>
            </button>
        </nav>
    );
};
