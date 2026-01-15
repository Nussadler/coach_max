// src/App.tsx
import React, { useState } from "react";
import { athletes, AthleteId } from "./data/athletes";
import { weeks } from "./data/plan";
import { AthleteSelector } from "./components/AthleteSelector";
import { WeekGrid } from "./components/WeekGrid";
import { WeekAccordion } from "./components/WeekAccordion";

const App: React.FC = () => {
  const [selected, setSelected] = useState<AthleteId>("max");
  const athlete = athletes.find((a) => a.id === selected)!;



  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", background: "#f5f7fa", minHeight: "100vh", padding: 0, margin: 0 }}>
      <header style={{ padding: 32, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontWeight: 800, fontSize: 32 }}>Halbmarathon Trainingsplan</h1>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
        <AthleteSelector athletes={athletes} selected={selected} onSelect={setSelected} />
        {weeks.map((week, idx) => (
          <WeekAccordion
            key={week.title}
            title={week.title}
            defaultOpen={idx === 0}
          >
            <WeekGrid week={week.days} athlete={athlete} />
          </WeekAccordion>
        ))}
      </main>
    </div>
  );
};

export default App;
