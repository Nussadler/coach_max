// src/data/athletes.ts
export type AthleteId = "pascal" | "max" | "hendrik";

export type Athlete = {
  id: AthleteId;
  displayName: string;
  intensity: Record<string, string>;
};

export const athletes: Athlete[] = [
  {
    id: "pascal",
    displayName: "Pascal",
    intensity: {
      // Run
      Z1: "110–129 bpm",
      Z2: "130–143 bpm",
      Z3: "144–156 bpm",
      Z4: "157–170 bpm",
      Z5: "171+ bpm",
      // Bike
      BZ1: "100–119 bpm",
      BZ2: "120–133 bpm",
      BZ3: "134–146 bpm",
      BZ4: "147–160 bpm",
      BZ5: "161+ bpm"
    }
  },
  {
    id: "max",
    displayName: "Max",
    intensity: {
      // Run
      Z1: "130–147 bpm",
      Z2: "148–162 bpm",
      Z3: "163–177 bpm",
      Z4: "178–192 bpm",
      Z5: "193+ bpm",
      // Bike
      BZ1: "120–137 bpm",
      BZ2: "130–143 bpm",
      BZ3: "144–156 bpm",
      BZ4: "157–170 bpm",
      BZ5: "171+ bpm"
    }
  },
  {
    id: "hendrik",
    displayName: "Hendrik",
    intensity: {
      // Run
      Z1: "120–143 bpm",
      Z2: "144–157 bpm",
      Z3: "158–170 bpm",
      Z4: "171–184 bpm",
      Z5: "185+ bpm",
      // Bike
      BZ1: "105–124 bpm",
      BZ2: "125–138 bpm",
      BZ3: "139–151 bpm",
      BZ4: "152–165 bpm",
      BZ5: "166+ bpm"
    }
  }
];
