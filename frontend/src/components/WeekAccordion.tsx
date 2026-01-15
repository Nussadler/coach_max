import React, { useState } from "react";

interface WeekAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const WeekAccordion: React.FC<WeekAccordionProps> = ({ title, children, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{ marginBottom: 24, borderRadius: 12, boxShadow: "0 2px 8px #0001", background: "#fff" }}>
      <div
        style={{
          cursor: "pointer",
          fontWeight: 700,
          fontSize: 22,
          padding: "18px 24px",
          borderBottom: open ? "1px solid #eee" : undefined,
          background: open ? "#f5f7fa" : "#f0f0f0",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          userSelect: "none"
        }}
        onClick={() => setOpen((v) => !v)}
      >
        {title} <span style={{ float: "right", fontWeight: 400, fontSize: 18 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && <div style={{ padding: 24 }}>{children}</div>}
    </div>
  );
};