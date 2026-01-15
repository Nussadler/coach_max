// src/data/plan.ts
import { Athlete } from "../data/athletes";

export type DayPlan = {
  date: string; // z.B. "19.1.2026"
  weekday: string; // z.B. "Mo"
  run?: string;
  bike?: string;
  strength?: string;
  notes?: string;
  athleteOverrides?: {
    [athleteId: string]: {
      run?: string;
      bike?: string;
      strength?: string;
      notes?: string;
    }
  }
};



export const weeks: { title: string; days: DayPlan[] }[] = [
  {
    title: "Woche 1 – Base",
    days: [
      { date: "19.1.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides" },
      { date: "20.1.2026", weekday: "Di", run: "Run - Threshold\n10’ Warm Up @Z2\n3x8’ @Z4 P: 2’\n10’ Cool Down @Z2" },
      { date: "21.1.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "22.1.2026", weekday: "Do", run: "Run - Easy\n50’ @Z2" },
      { date: "23.1.2026", weekday: "Fr", run: "Run - Long Run\n14km @Z2" },
      {
        date: "24.1.2026",
        weekday: "Sa",
        bike: "Bike - Base\n75’ @BZ2",
        athleteOverrides: { pascal: { run: "Run - Easy\n45’ @Z2" } },
      },
      { date: "25.1.2026", weekday: "So", strength: "Gym - Full Body\nBeine reduziert" },
    ],
  },

  {
    title: "Woche 2 – Base",
    days: [
      { date: "26.1.2026", weekday: "Mo", run: "Rest"},
      {
        date: "27.1.2026",
        weekday: "Di",
        run:
          "Run - VO2Max\n10’ Warm Up @Z2\n3x[\n3’ @ 4:00/km P: 2’\n2’ @ 3:55/km P: 1:30\n1’ @ 3:45/km P: 2:30\n]\n10’ Cool Down @Z2",
        athleteOverrides: { hendrik: { run: "Run - VO2Max\n10’ Warm Up @Z2\n3x[\n3’ @ 4:20/km P: 2’\n2’ @ 4:15/km P: 1:30\n1’ @ 4:00/km P: 2:30\n]\n10’ Cool Down @Z2" } },
      },
      { date: "28.1.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "29.1.2026", weekday: "Do", run: "Run - Easy\n50’ @Z2\n5x20’’ Strides" },
      { date: "30.1.2026", weekday: "Fr", run: "Run - Long Run\n15km @Z2" },
      { date: "31.1.2026", weekday: "Sa", bike: "Bike - Base\n75’–90’ @BZ2",  athleteOverrides: { pascal: { run: "Run - Easy\n60’ @Z2" } }},
      { date: "1.2.2026", weekday: "So", strength: "Gym - Full Body" },
    ],
  },

  {
    title: "Woche 3 – Base",
    days: [
      { date: "2.2.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides" },
      { date: "3.2.2026", weekday: "Di", run: "Run - Threshold\n10’ Warm Up @Z2\n2x12’ @Z4 P: 2’\n10’ Cool Down @Z2" },
      { date: "4.2.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "5.2.2026", weekday: "Do", bike: "Bike - Recovery\n60’ @BZ1", athleteOverrides: { pascal: { run: "Run - Recovery\n30’ @Z1" } } },
      { date: "6.2.2026", weekday: "Fr", run: "Run - Long Run\n16km @Z2" },
      { date: "7.2.2026", weekday: "Sa", bike: "Bike - Base\n75’–90’ @BZ2", athleteOverrides: { pascal: { run: "Run - Easy\n60’ @Z2" } } },
      { date: "8.2.2026", weekday: "So", strength: "Gym - Full Body" },
    ],
  },

  {
    title: "Woche 4 – Base",
    days: [
      { date: "9.2.2026", weekday: "Mo", run: "Rest"},
      {
        date: "10.2.2026",
        weekday: "Di",
        run: "Run - VO2Max\n10’ Warm Up @Z2\n6x800m @3:40–3:50/km P: 2’ Trabpause\n10’ Cool Down @Z2",
      },
      { date: "11.2.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "12.2.2026", weekday: "Do", run: "Run - Easy\n50’ @Z2\n5x20’’ Strides" },
      { date: "13.2.2026", weekday: "Fr", run: "Run - Long Run\n17km @Z2" },
      { date: "14.2.2026", weekday: "Sa", bike: "Bike - Base\n75’ @BZ2", athleteOverrides: { pascal: { run: "Run - Easy\n50’ @Z2" } } },
      { date: "15.2.2026", weekday: "So", strength: "Gym - Full Body" },
    ],
  },

  {
    title: "Woche 5 – Deload",
    days: [
      { date: "16.2.2026", weekday: "Mo", run: "Run - Recovery\n40’ @Z1", notes: "Deload Week" },
      {
        date: "17.2.2026",
        weekday: "Di",
        run: "Run - Easy Threshold\n10’ Warm Up @Z2\n3x6’ @Z4 P: 2’\n10’ Cool Down @Z2",
        notes: "Deload Week",
      },
      { date: "18.2.2026", weekday: "Mi", strength: "Gym - Full Body (50% Volume)", notes: "Deload Week" },
      { date: "19.2.2026", weekday: "Do", run: "Run - Recovery\n45’ @Z1", notes: "Deload Week" },
      { date: "20.2.2026", weekday: "Fr", run: "Run - Long Run\n12km @Z2", notes: "Deload Week" },
      { date: "21.2.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1", notes: "Deload Week" },
      { date: "21.2.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1", notes: "Deload Week", athleteOverrides: { pascal: { run: "Run - Recovery\n30’ @Z1" } } },
      { date: "22.2.2026", weekday: "So", strength: "Gym - Full Body (50% Volume)", notes: "Deload Week" },
    ],
  },

  {
    title: "Woche 6 – 10k build",
    days: [
      { date: "23.2.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides", notes: "Phase 2 - 10k build starts" },
      { date: "24.2.2026", weekday: "Di", run: "Run - Threshold\n10’ Warm Up @Z2\n3x8’ @Z4 P: 2’\n10’ Cool Down @Z2" },
      { date: "25.2.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "26.2.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2" },
      {
        date: "27.2.2026",
        weekday: "Fr",
        run: "Run - 10k specific\n10’ Warm Up @Z2\n4x1200m @4:00/km P: 2:30\n10’ Cool Down @Z2",
      },
        { date: "28.2.2026", weekday: "Sa", bike: "Bike - Base\n60’ @BZ2", athleteOverrides: { pascal: { run: "Run - Easy\n45’ @Z2" } } },
      {
        date: "1.3.2026",
        weekday: "So",
        run: "Run - Long Run\n18km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 7 – 10k build",
    days: [
      { date: "2.3.2026", weekday: "Mo", run: "Rest"},
      {
        date: "3.3.2026",
        weekday: "Di",
        run: "Run - VO2Max\n10’ Warm Up @Z2\n5x1km @3:45–3:55/km P: 3’\n10’ Cool Down @Z2",
      },
      { date: "4.3.2026", weekday: "Mi", strength: "Gym - Full Body (1 Übung Beine)" },
      { date: "5.3.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2\n5x20’’ Strides" },
      {
        date: "6.3.2026",
        weekday: "Fr",
        run: "Run - 10k specific\n10’ Warm Up @Z2\n2x2km @3:50–4:00/km P: 3’\n10’ Cool Down @Z2",
      },
        { date: "7.3.2026", weekday: "Sa", bike: "Bike - Base\n75’ @BZ2", athleteOverrides: { pascal: { run: "Run - Easy\n60’ @Z2" } } },
      {
        date: "8.3.2026",
        weekday: "So",
        run: "Run - Long Run\n19km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 8 – 10k build",
    days: [
      { date: "9.3.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides", notes: "Schlaf ist sehr wichtig in dieser Woche!" },
      { date: "10.3.2026", weekday: "Di", run: "Run - Threshold\n10’ Warm Up @Z2\n3x6’ @Z4 P: 2’\n10’ Cool Down @Z2" },
      { date: "11.3.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "12.3.2026", weekday: "Do", bike: "Bike - Recovery\n60’ @BZ1" },
      {
        date: "13.3.2026",
        weekday: "Fr",
        run: "Run - 10k specific\n10’ Warm Up @Z2\n4x1km @3:55–4:00/km P: 90’’ jog\n10’ Cool Down @Z2",
      },
        { date: "14.3.2026", weekday: "Sa", bike: "Bike - Base\n75’ @BZ2", athleteOverrides: { pascal: { run: "Run - Easy\n60’ @Z2" } } },
      {
        date: "15.3.2026",
        weekday: "So",
        run: "Run - Long Run\n15km @Z2\n3km @4:20–4:25/km",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 9 – 10k build",
    days: [
      { date: "16.3.2026", weekday: "Mo", run: "Rest"},
      {
        date: "17.3.2026",
        weekday: "Di",
        run: "Run - VO2Max\n10’ Warm Up @Z2\n6x800m @3:35–3:45/km P: 2’ Trabpause\n10’ Cool Down @Z2",
        notes: "Sehr toughe Woche; wenn müde: statt dessen 3x6’ @Z4 P: 2’",
      },
      { date: "18.3.2026", weekday: "Mi", strength: "Gym - Full Body (1 Übung Beine)" },
      { date: "19.3.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2\n5x20’’ Strides" },
      {
        date: "20.3.2026",
        weekday: "Fr",
        run: "Run - 10k specific\n10’ Warm Up @Z2\n2x2km @3:50–4:00/km P: 3’\n10’ Cool Down @Z2",
      },
        { date: "21.3.2026", weekday: "Sa", bike: "Bike - Base\n75’–90’ @BZ2", athleteOverrides: { pascal: { run: "Run - Easy\n60’ @Z2" } } },
      {
        date: "22.3.2026",
        weekday: "So",
        run: "Run - Long Run\n16km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 10 – 10k build",
    days: [
      { date: "23.3.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides" },
      { date: "24.3.2026", weekday: "Di", run: "Run - Threshold\n10’ Warm Up @Z2\n4x6’ @Z4 P: 2’\n10’ Cool Down @Z2" },
      { date: "25.3.2026", weekday: "Mi", strength: "Gym - Full Body" },
      { date: "26.3.2026", weekday: "Do", run: "Run - Easy\n40’ @Z2" },
      {
        date: "27.3.2026",
        weekday: "Fr",
        run: "Run - 10k specific\n10’ Warm Up @Z2\n3x2km @4:05–4:15/km P: 3’\n10’ Cool Down @Z2",
      },
        { date: "28.3.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1", athleteOverrides: { pascal: { run: "Run - Recovery\n30’ @Z1" } } },
      {
        date: "29.3.2026",
        weekday: "So",
        run: "Run - Long Run\n20km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 11 – Deload",
    days: [
      { date: "30.3.2026", weekday: "Mo", run: "Rest"},
      {
        date: "31.3.2026",
        weekday: "Di",
        run: "Run - Easy Threshold\n10’ Warm Up @Z2\n3x6’ @4:15–4:25/km P: 2’\n10’ Cool Down @Z2",
        notes: "Deload Week",
      },
      { date: "1.4.2026", weekday: "Mi", strength: "Gym - Full Body (50% Volume)", notes: "Deload Week" },
      { date: "2.4.2026", weekday: "Do", run: "Run - Easy\n40’ @Z2\n5x20’’ Strides", notes: "Deload Week" },
      { date: "3.4.2026", weekday: "Fr", run: "Run - Steady\n8–10km @4:35–4:45/km", notes: "Deload Week" },
      { date: "4.4.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1", notes: "Deload Week" },
      {
        date: "5.4.2026",
        weekday: "So",
        run: "Run - Long Run\n12–13km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
        notes: "Deload Week",
      },
    ],
  },

  {
    title: "Woche 12 – HM Peak",
    days: [
      { date: "6.4.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides", notes: "Phase 3 - HM Peak starts" },
      {
        date: "7.4.2026",
        weekday: "Di",
        run: "Run - HM specific\n10’ Warm Up @Z2\n3x3km @4:12–4:18/km P: 3’\n10’ Cool Down @Z2",
      },
      { date: "8.4.2026", weekday: "Mi", strength: "Gym - Full Body (1 Übung Beine)" },
      { date: "9.4.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2" },
      { date: "10.4.2026", weekday: "Fr", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides" },
      { date: "11.4.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1" },
      {
        date: "12.4.2026",
        weekday: "So",
        run: "Run - Long Run\n10km @Z2\n3x[\n2km @4:15/km\n1km @Z2\n]\n1km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 13 – HM Peak",
    days: [
      { date: "13.4.2026", weekday: "Mo", run: "Rest"},
      {
        date: "14.4.2026",
        weekday: "Di",
        run: "Run - VO2Max\n10’ Warm Up @Z2\n6x800m @3:35–3:45/km P: 2’ Trabpause\n10’ Cool Down @Z2",
      },
      { date: "15.4.2026", weekday: "Mo", run: "Rest"},
      { date: "16.4.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2\n5x20’’ Strides" },
      {
        date: "17.4.2026",
        weekday: "Fr",
        run: "Run - HM specific\n10’ Warm Up @Z2\n2x5km @4:12–4:18/km P: 3–4’\n10’ Cool Down @Z2",
      },
      { date: "18.4.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1" },
      { date: "19.4.2026", weekday: "So", run: "Run - Long Run\n18km @Z2", strength: "Strength - Bodyweight\n2x Max Push Ups\n2x Max Pull Ups" },
    ],
  },

  {
    title: "Woche 14 – 10k Race Week (RBB Lauf)",
    days: [
      { date: "20.4.2026", weekday: "Mo", run: "Run - Recovery\n40’ @Z1\n5x20’’ Strides" },
      {
        date: "21.4.2026",
        weekday: "Di",
        run: "Run - 10k specific\n10’ Warm Up @Z2\n6x400m @3:30–3:40/km P: 200m easy jog\n10’ Cool Down @Z2",
      },
      { date: "22.4.2026", weekday: "Mi", strength: "Gym - Full Body (keine Beine)" },
      { date: "23.4.2026", weekday: "Do", run: "Run - Easy\n30–40’ @Z2" },
      { date: "24.4.2026", weekday: "Fr", run: "Rest oder 20' Shakeout"},
      { date: "25.4.2026", weekday: "Sa", run: "Rest"},
      { date: "26.4.2026", weekday: "So", run: "Race Day - 10k (RBB Lauf)\nZielpace: 3:50–4:00/km" },
    ],
  },

  {
    title: "Woche 15 – Post-Race Recovery",
    days: [
      { date: "27.4.2026", weekday: "Mo", run: "Run - Recovery\n30’ @Z1" },
      { date: "28.4.2026", weekday: "Di", bike: "Bike - Recovery\n30’ @BZ1", notes: "Falls starker Muskelkater: Bike entfallen lassen" },
      { date: "29.4.2026", weekday: "Mi", strength: "Gym - Full Body (50% Volume, keine Beine)" },
      { date: "30.4.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2" },
      { date: "1.5.2026", weekday: "Fr", run: "Run - Threshold\n10’ Warm Up @Z2\n2x6’ @Z4 P: 2’\n10’ Cool Down @Z2" },
      { date: "2.5.2026", weekday: "Sa", bike: "Bike - Base\n75’ @BZ2" },
      {
        date: "3.5.2026",
        weekday: "So",
        run: "Run - Long Run\n20km @Z2",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 16 – HM Peak",
    days: [
      { date: "4.5.2026", weekday: "Mo", run: "Run - Recovery\n40’ @Z1\n5x20’’ Strides" },
      {
        date: "5.5.2026",
        weekday: "Di",
        run: "Run - HM specific\n10’ Warm Up @Z2\n3x4km @4:12–4:18/km P: 4’\n10’ Cool Down @Z2",
      },
      { date: "6.5.2026", weekday: "Mi", strength: "Gym - Full Body (1 Übung Beine)" },
      { date: "7.5.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2" },
      { date: "8.5.2026", weekday: "Fr", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides" },
      { date: "9.5.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1" },
      {
        date: "10.5.2026",
        weekday: "So",
        run: "Run - Long Run\n14km @Z2\n8km @4:15/km",
        strength: "Strength - Bodyweight\n4x Max Push Ups\n4x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 17 – HM Peak",
    days: [
      { date: "11.5.2026", weekday: "Mo", run: "Rest"},
      { date: "12.5.2026", weekday: "Di", run: "Run - Easy\n45’ @Z2\n5x20’’ Strides" },
      { date: "13.5.2026", weekday: "Mi", strength: "Gym - Full Body (1 Übung Beine)" },
      { date: "14.5.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2\n5x20’’ Strides" },
      {
        date: "15.5.2026",
        weekday: "Fr",
        run: "Run - HM specific\n10’ Warm Up @Z2\n2x15’ @4:10–4:18/km P: 3’\n10’ Cool Down @Z2",
      },
      { date: "16.5.2026", weekday: "Sa", bike: "Bike - Base\n75’–90’ @BZ2" },
      {
        date: "17.5.2026",
        weekday: "So",
        run: "Run - Long Run\n22km @Z2",
        strength: "Strength - Bodyweight\n3x Max Push Ups\n3x Max Pull Ups\nCore",
      },
    ],
  },

  {
    title: "Woche 18 – HM Peak",
    days: [
      { date: "18.5.2026", weekday: "Mo", run: "Run - Recovery\n45’ @Z1\n5x20’’ Strides" },
      {
        date: "19.5.2026",
        weekday: "Di",
        run: "Run - Threshold\n10’ Warm Up @Z2\n2x8’ @Z4 P: 2’\n10’ Cool Down @Z2",
        notes: "Alternative: 45’ @Z2 + 5x20’’ Strides",
      },
      { date: "20.5.2026", weekday: "Mi", strength: "Gym - Upper Body" },
      { date: "21.5.2026", weekday: "Do", run: "Run - Easy\n45’ @Z2" },
      {
        date: "22.5.2026",
        weekday: "Fr",
        run: "Run - HM specific\n10’ Warm Up @Z2\n6x2km @4:10–4:15/km P: 90’’\n10’ Cool Down @Z2",
      },
      { date: "23.5.2026", weekday: "Sa", bike: "Bike - Recovery\n60’ @BZ1" },
      { date: "24.5.2026", weekday: "So", run: "Run - Long Run\n18km @Z2" },
    ],
  },

  {
    title: "Woche 19 – Taper",
    days: [
      { date: "25.5.2026", weekday: "Mo", run: "Run - Recovery\n40’ @Z1", notes: "Taper Week" },
      {
        date: "26.5.2026",
        weekday: "Di",
        run: "Run - Race sharpening\n10’ Warm Up @Z2\n3x2km @4:12–4:18/km P: 90’’\n10’ Cool Down @Z2",
        notes: "Taper Week",
      },
      { date: "27.5.2026", weekday: "Mi", notes: "OFF / optional easy mobility\nTaper Week" },
      { date: "28.5.2026", weekday: "Do", run: "Run - Easy\n35’ @Z2", notes: "Taper Week" },
      { date: "29.5.2026", weekday: "Fr", notes: "Mobility\nTaper Week" },
      { date: "30.5.2026", weekday: "Sa", run: "Run - Easy\n30–35’ @Z1", notes: "Taper Week" },
      { date: "31.5.2026", weekday: "So", notes: "Mobility\nTaper Week" },
    ],
  },

  {
    title: "Woche 20 – Race Week",
    days: [
      { date: "1.6.2026", weekday: "Mo", run: "Run - Recovery\n40’ @Z1", notes: "Race Week" },
      {
        date: "2.6.2026",
        weekday: "Di",
        run: "Run - Race sharpening\n10’ Warm Up @Z2\n4x1km @4:12–4:18/km P: 90’’\n10’ Cool Down @Z2",
        notes: "Race Week",
      },
      { date: "3.6.2026", weekday: "Mi", notes: "Mobility\nRace Week" },
      { date: "4.6.2026", weekday: "Do", run: "Run - Easy\n30–35’ @Z1", notes: "Race Week" },
      { date: "5.6.2026", weekday: "Fr", run: "Run - Shakeout\n15–20’ @Z1", notes: "Race Week" },
      { date: "6.6.2026", weekday: "Sa", notes: "OFF & Carbs & Beine hoch – du hast so viel trainiert, du schaffst das!!!\nRace Week" },
      { date: "7.6.2026", weekday: "So", run: "Race Day - HM (Schlösserlauf)\nZielpace: 4:15/km", notes: "Race Week" },
    ],
  },
];

