import FitParser from 'fit-file-parser';
import type { ActivityCategory, Lap } from '../types';

export interface ParsedFitData {
    distance: number; // km
    duration: number; // seconds
    pace: number;     // min/km
    avgHr: number;    // bpm
    maxHr: number;    // bpm
    category: ActivityCategory;
    date: string;     // ISO String
    name: string;     // e.g. "Threshold Run - 2026-03-11"
    laps: Lap[];
}

/**
 * Determines a category based on heuristics.
 * VO2Max: avgHr > 170 or pace < 4:00 (for an amateur runner as example)
 * Threshold: avgHr > 160 or pace < 4:30
 * Long Run: duration > 5400s (90 mins) or distance > 15km
 * Easy Run: fallback
 */
function determineCategory(distance: number, duration: number, avgHr: number, pace: number): ActivityCategory {
    if (avgHr >= 170 || pace <= 4.0) return 'VO2Max';
    if (avgHr >= 155 || pace <= 4.5) return 'Threshold';
    if (duration >= 5400 || distance >= 15) return 'Long Run';
    return 'Easy Run';
}

export const parseFitFile = (fileBuffer: ArrayBuffer): Promise<ParsedFitData> => {
    return new Promise((resolve, reject) => {
        // According to fit-file-parser docs we can specify force to true
        // and we might need to convert ArrayBuffer to Buffer or Uint8Array.
        // In browser, fit-file-parser expects an ArrayBuffer or Uint8Array.
        const fitParser = new FitParser({
            force: true,
            speedUnit: 'km/h',
            lengthUnit: 'km',
            temperatureUnit: 'celcius',
            elapsedRecordField: true,
            mode: 'cascade',
        });

        fitParser.parse(fileBuffer, (error: any, data: any) => {
            if (error) {
                return reject(error);
            }

            try {
                // The structure of data depends on the .fit file.
                // With mode: 'cascade', sessions are inside data.activity.sessions
                let session = null;
                if (data.activity && data.activity.sessions && data.activity.sessions.length > 0) {
                    session = data.activity.sessions[0];
                } else if (data.sessions && data.sessions.length > 0) {
                    session = data.sessions[0];
                }

                if (!session) {
                    // Fallback: derive from records if session is missing
                    if (data.records && data.records.length > 0) {
                        const records = data.records;
                        const firstRecord = records[0];
                        const lastRecord = records[records.length - 1];

                        // Sometimes records.distance is in km (due to lengthUnit: 'km' option) 
                        // or meters. We assume the parser config applies.
                        const distance = lastRecord.distance || 0;

                        const startTime = firstRecord.timestamp;
                        const endTime = lastRecord.timestamp;
                        const duration = (endTime && startTime)
                            ? (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000
                            : 0;

                        let sumHr = 0;
                        let maxHr = 0;
                        let hrCount = 0;

                        for (const r of records) {
                            if (r.heart_rate) {
                                sumHr += r.heart_rate;
                                hrCount++;
                                if (r.heart_rate > maxHr) maxHr = r.heart_rate;
                            }
                        }

                        session = {
                            total_distance: distance,
                            total_elapsed_time: duration,
                            avg_heart_rate: hrCount > 0 ? sumHr / hrCount : 0,
                            max_heart_rate: maxHr,
                            start_time: startTime || new Date()
                        };
                    } else {
                        console.error("FIT Data dump for debugging:", data);
                        throw new Error("Keine Session- oder Aufzeichnungsdaten in der FIT-Datei gefunden.");
                    }
                }

                const distanceStr = session.total_distance || session.distance || 0;
                const distance = parseFloat(distanceStr) || 0;

                // duration in seconds
                const durationStr = session.total_timer_time || session.total_elapsed_time || 0;
                const duration = parseFloat(durationStr) || 0;

                // pace: min/km = 60 / speed_in_kmh
                const avgSpeedStr = session.avg_speed || session.enhanced_avg_speed;
                const avgSpeed = parseFloat(avgSpeedStr);
                let pace = 0;
                if (avgSpeed > 0) {
                    // if speed is km/h, pace = 60 / speed. 
                    // However FitParser sometimes returns m/s instead despite config.
                    // Let's assume km/h for now based on options. 
                    pace = 60 / avgSpeed;
                } else if (duration > 0 && distance > 0) {
                    // fallback calculate
                    pace = (duration / 60) / distance;
                }

                const avgHr = parseInt(session.avg_heart_rate) || 0;
                const maxHr = parseInt(session.max_heart_rate) || 0;
                const dateObj = session.start_time ? new Date(session.start_time) : new Date();
                const date = dateObj.toISOString().split('T')[0]; // "YYYY-MM-DD"

                const category = determineCategory(distance, duration, avgHr, pace);
                const name = `${category} - ${date}`;

                // Extract laps from session (cascade mode puts them in session.laps)
                const laps: Lap[] = [];
                const rawLaps = session.laps || [];
                for (let i = 0; i < rawLaps.length; i++) {
                    const lap = rawLaps[i];
                    const lapDistance = parseFloat(lap.total_distance) || 0;
                    const lapDuration = parseFloat(lap.total_timer_time || lap.total_elapsed_time) || 0;
                    let lapPace = 0;
                    const lapSpeed = parseFloat(lap.enhanced_avg_speed || lap.avg_speed) || 0;
                    if (lapSpeed > 0) {
                        lapPace = 60 / lapSpeed;
                    } else if (lapDuration > 0 && lapDistance > 0) {
                        lapPace = (lapDuration / 60) / lapDistance;
                    }

                    laps.push({
                        index: i + 1,
                        distance: lapDistance,
                        duration: lapDuration,
                        pace: lapPace,
                        avgHr: parseInt(lap.avg_heart_rate) || 0,
                        maxHr: parseInt(lap.max_heart_rate) || 0,
                        avgCadence: lap.avg_cadence ? parseInt(lap.avg_cadence) + (lap.avg_fractional_cadence ? parseFloat(lap.avg_fractional_cadence) : 0) : undefined,
                        intensity: lap.intensity || undefined,
                    });
                }

                resolve({
                    distance,
                    duration,
                    pace,
                    avgHr,
                    maxHr,
                    category,
                    date,
                    name,
                    laps,
                });

            } catch (err) {
                reject(err);
            }
        });
    });
};
