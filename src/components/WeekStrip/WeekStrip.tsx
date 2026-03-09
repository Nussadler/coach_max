import React, { useMemo, useRef, useEffect } from 'react';
import styles from './WeekStrip.module.css';

interface WeekStripProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
    datesWithWorkouts: string[];
}

export const WeekStrip: React.FC<WeekStripProps> = ({
    selectedDate,
    onSelectDate,
    datesWithWorkouts
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Generate weeks: 2 past, current, 6 future (Total 9 weeks)
    const weeks = useMemo(() => {
        const weeksArray = [];
        const today = new Date();
        // Get Monday of current week
        const currentMonday = new Date(today);
        const dayOfWeek = (today.getDay() + 6) % 7; // Mon=0, Sun=6
        currentMonday.setDate(today.getDate() - dayOfWeek);
        currentMonday.setHours(0, 0, 0, 0);

        // Start 2 weeks back
        const startDate = new Date(currentMonday);
        startDate.setDate(startDate.getDate() - 14);

        for (let w = 0; w < 9; w++) { // 9 weeks total
            const weekDays = [];
            for (let d = 0; d < 7; d++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + (w * 7) + d);
                weekDays.push(date);
            }
            weeksArray.push(weekDays);
        }
        return weeksArray;
    }, []);

    // Format helpers
    const getDayName = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    const getDayNum = (date: Date) => date.getDate();
    // Fix: Use local YYYY-MM-DD instead of toISOString (which is UTC)
    const toDateStr = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        // Scroll to selected date on mount
        if (scrollRef.current) {
            // Find week index of selected date
            // We compare strings directly now
            let targetWeekIndex = -1;
            weeks.forEach((week, index) => {
                const sStr = toDateStr(week[0]);
                const eStr = toDateStr(week[6]);
                if (selectedDate >= sStr && selectedDate <= eStr) {
                    targetWeekIndex = index;
                }
            });

            if (targetWeekIndex >= 0) {
                const container = scrollRef.current;
                const weekWidth = container.clientWidth; // Assuming 1 week = 100%
                container.scrollTo({ left: targetWeekIndex * weekWidth, behavior: 'instant' });
            }
        }
    }, []); // Run once on mount.

    return (
        <div className={styles.container} ref={scrollRef}>
            <div className={styles.strip}>
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className={styles.week}>
                        {week.map((date) => {
                            const dateStr = toDateStr(date);
                            const isSelected = selectedDate === dateStr;
                            const hasWorkout = datesWithWorkouts.includes(dateStr);
                            const isToday = toDateStr(new Date()) === dateStr;

                            return (
                                <button
                                    key={dateStr}
                                    className={`${styles.day} ${isSelected ? styles.selected : ''} ${isToday ? styles.today : ''}`}
                                    onClick={() => onSelectDate(dateStr)}
                                >
                                    <span className={styles.dayName}>{getDayName(date)}</span>
                                    <span className={styles.dayNum}>{getDayNum(date)}</span>
                                    {hasWorkout && <div className={styles.dot} />}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
