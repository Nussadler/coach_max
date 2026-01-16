import React, { useState } from "react";

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>;
  error?: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onLogin(email, password);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
      <div style={{ background: "white", padding: 40, borderRadius: 16, boxShadow: "0 8px 32px rgba(44,62,80,0.12)", minWidth: 340, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h2 style={{ marginBottom: 24, fontWeight: 700, color: "#2c3e50" }}>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18, width: "100%" }}>
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #c3cfe2",
              fontSize: 16,
              outline: "none",
              background: "#f5f7fa"
            }}
          />
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #c3cfe2",
              fontSize: 16,
              outline: "none",
              background: "#f5f7fa"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px 0",
              borderRadius: 8,
              border: "none",
              background: "#2c3e50",
              color: "white",
              fontWeight: 700,
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(44,62,80,0.08)"
            }}
          >
            Login
          </button>
        </form>
        {error && <div style={{ color: "#e74c3c", marginTop: 16 }}>{error}</div>}
      </div>
      <div style={{ marginTop: 32, color: "#7f8c8d", fontSize: 14 }}>
        <span>Halbmarathon Trainingsplan Coach OS</span>
      </div>
    </div>
  );
};

export default Login;
