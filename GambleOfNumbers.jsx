Here's the full code:
import { useState, useEffect, useRef } from "react";

const PLAYERS = ["P1", "P2", "P3", "P4", "P5"];
const COLORS = ["#e63946", "#f4a261", "#2a9d8f", "#457b9d", "#a8dadc"];
const PLAYER_NAMES = ["Player 1", "Player 2", "Player 3", "Player 4", "Player 5"];

const OPS = [" ÷ ", " × ", " + ", " − "];

function evaluate(nums) {
  // formula: a / b * c + d - e
  const [a, b, c, d, e] = nums;
  if (b === 0) return null;
  return (a / b) * c + d - e;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const FONT = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Mono:wght@400;500&display=swap');
`;

const css = `
  ${FONT}

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0a;
    font-family: 'DM Mono', monospace;
    color: #e8d5a3;
  }

  .root {
    min-height: 100vh;
    background: radial-gradient(ellipse at 50% 0%, #1a1200 0%, #0a0a0a 70%);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 16px 64px;
    position: relative;
    overflow: hidden;
  }

  .root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle at 20% 80%, rgba(180,140,30,0.04) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(180,140,30,0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  .grain {
    position: fixed;
    inset: 0;
    opacity: 0.025;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  .header {
    text-align: center;
    margin-bottom: 40px;
  }

  .title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2.2rem, 6vw, 3.8rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #c9a84c;
    line-height: 1;
    text-shadow: 0 0 60px rgba(201,168,76,0.3);
  }

  .subtitle {
    font-size: 0.7rem;
    letter-spacing: 0.35em;
    color: #6b5c33;
    margin-top: 8px;
    text-transform: uppercase;
  }

  .divider {
    width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #c9a84c, transparent);
    margin: 16px auto 0;
  }

  .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: 16px;
    padding: 28px;
    width: 100%;
    max-width: 560px;
    position: relative;
  }

  .card-label {
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: #6b5c33;
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .players-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .player-input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 10px;
    padding: 10px 14px;
    transition: border-color 0.2s;
  }

  .player-input-row:focus-within {
    border-color: rgba(201,168,76,0.4);
  }

  .player-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .player-label {
    font-size: 0.7rem;
    color: #8a7a55;
    white-space: nowrap;
    min-width: 52px;
  }

  .player-number-input {
    background: none;
    border: none;
    outline: none;
    color: #e8d5a3;
    font-family: 'DM Mono', monospace;
    font-size: 1rem;
    width: 100%;
    text-align: right;
  }

  .player-number-input::placeholder {
    color: #3a3020;
  }

  .formula-hint {
    margin-top: 24px;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(201,168,76,0.08);
    border-radius: 10px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 1rem;
    color: #4a3e22;
    letter-spacing: 0.05em;
  }

  .formula-slot {
    width: 28px;
    height: 28px;
    border: 1px dashed #3a3020;
    border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    color: #3a3020;
  }

  .btn-deal {
    margin-top: 28px;
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #c9a84c 0%, #a07c28 100%);
    border: none;
    border-radius: 12px;
    color: #0a0a0a;
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-deal:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(201,168,76,0.3);
  }

  .btn-deal:active { transform: translateY(0); }

  .btn-deal:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .result-section {
    width: 100%;
    max-width: 560px;
    margin-top: 24px;
    animation: fadeUp 0.5s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .formula-reveal {
    background: rgba(0,0,0,0.5);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    margin-bottom: 16px;
  }

  .formula-reveal-label {
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: #6b5c33;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .formula-tokens {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: clamp(1rem, 3vw, 1.3rem);
    line-height: 1.8;
  }

  .formula-token {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
  }

  .formula-token-value {
    font-size: 1.2em;
    font-weight: 500;
    animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  .formula-token-sub {
    font-size: 0.55em;
    color: #6b5c33;
    letter-spacing: 0.08em;
  }

  .op-token {
    color: #6b5c33;
    padding: 0 2px;
    font-size: 1.1em;
  }

  @keyframes popIn {
    from { opacity: 0; transform: scale(0.5); }
    to   { opacity: 1; transform: scale(1); }
  }

  .equals-row {
    margin-top: 18px;
    border-top: 1px solid rgba(201,168,76,0.1);
    padding-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .equals-sign { color: #6b5c33; font-size: 1.4rem; }

  .result-value {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: #c9a84c;
    text-shadow: 0 0 30px rgba(201,168,76,0.4);
    animation: glowPulse 1.5s ease infinite alternate;
  }

  @keyframes glowPulse {
    from { text-shadow: 0 0 20px rgba(201,168,76,0.3); }
    to   { text-shadow: 0 0 50px rgba(201,168,76,0.6); }
  }

  .leaderboard {
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(201,168,76,0.12);
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .lb-header {
    padding: 14px 20px;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #6b5c33;
    border-bottom: 1px solid rgba(201,168,76,0.08);
    display: grid;
    grid-template-columns: 32px 1fr 80px 80px;
    gap: 8px;
  }

  .lb-row {
    display: grid;
    grid-template-columns: 32px 1fr 80px 80px;
    gap: 8px;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    align-items: center;
    animation: fadeUp 0.4s ease both;
  }

  .lb-row:last-child { border-bottom: none; }
  .lb-row.winner { background: rgba(201,168,76,0.08); }

  .lb-rank { font-size: 0.75rem; color: #4a3e22; }
  .lb-rank.gold { color: #c9a84c; font-weight: 700; }

  .lb-player {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.8rem;
  }

  .lb-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  .lb-input { text-align: right; font-size: 0.85rem; color: #c9a84c; }
  .lb-diff  { text-align: right; font-size: 0.75rem; color: #6b5c33; }
  .lb-diff.best { color: #2a9d8f; }

  .winner-banner {
    background: linear-gradient(135deg, rgba(201,168,76,0.15) 0%, rgba(160,124,40,0.08) 100%);
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 14px;
    padding: 24px;
    text-align: center;
    animation: winnerPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
  }

  @keyframes winnerPop {
    from { opacity: 0; transform: scale(0.8); }
    to   { opacity: 1; transform: scale(1); }
  }

  .winner-crown { font-size: 2.5rem; line-height: 1; margin-bottom: 8px; }
  .winner-title { font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: #6b5c33; margin-bottom: 6px; }
  .winner-name  { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 900; color: #c9a84c; }
  .winner-detail { font-size: 0.7rem; color: #6b5c33; margin-top: 6px; }

  .btn-reset {
    margin-top: 28px;
    width: 100%;
    max-width: 560px;
    padding: 14px;
    background: transparent;
    border: 1px solid rgba(201,168,76,0.25);
    border-radius: 12px;
    color: #8a7a55;
    font-family: 'DM Mono', monospace;
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-reset:hover { border-color: rgba(201,168,76,0.5); color: #c9a84c; }

  .error-msg { margin-top: 10px; font-size: 0.72rem; color: #e63946; text-align: center; letter-spacing: 0.05em; }
`;

export default function GambleOfNumbers() {
  const [inputs, setInputs] = useState(["", "", "", "", ""]);
  const [result, setResult] = useState(null);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState("input");

  const setInput = (i, val) => {
    const next = [...inputs];
    next[i] = val;
    setInputs(next);
    setError("");
  };

  const deal = () => {
    const parsed = inputs.map(v => parseFloat(v));
    if (parsed.some(v => isNaN(v))) {
      setError("All 5 players must enter a number before dealing.");
      return;
    }
    const shuffled = shuffle([0, 1, 2, 3, 4]);
    const nums = shuffled.map(pi => parsed[pi]);
    const r = evaluate(nums);
    if (r === null) {
      setError("Division by zero occurred. Please change some inputs and try again.");
      return;
    }
    setOrder(shuffled);
    setResult(r);
    setPhase("result");
    setError("");
  };

  const reset = () => {
    setInputs(["", "", "", "", ""]);
    setResult(null);
    setOrder(null);
    setPhase("input");
    setError("");
  };

  let leaderboard = null;
  if (result !== null && order !== null) {
    const parsed = inputs.map(v => parseFloat(v));
    leaderboard = PLAYERS.map((p, i) => ({
      index: i,
      name: PLAYER_NAMES[i],
      value: parsed[i],
      diff: Math.abs(parsed[i] - result),
      color: COLORS[i],
    })).sort((a, b) => a.diff - b.diff);
  }

  return (
    <>
      <style>{css}</style>
      <div className="root">
        <div className="grain" />

        <div className="header">
          <h1 className="title">Gamble of Numbers</h1>
          <p className="subtitle">A Game of Chance & Calculation</p>
          <div className="divider" />
        </div>

        {phase === "input" && (
          <div className="card">
            <div className="card-label">⟡ Enter Player Numbers</div>
            <div className="players-grid">
              {PLAYERS.map((p, i) => (
                <div key={p} className="player-input-row">
                  <div className="player-dot" style={{ background: COLORS[i] }} />
                  <span className="player-label">{PLAYER_NAMES[i]}</span>
                  <input
                    className="player-number-input"
                    type="number"
                    placeholder="0"
                    value={inputs[i]}
                    onChange={e => setInput(i, e.target.value)}
                    onKeyDown={e => e.key === "Enter" && deal()}
                  />
                </div>
              ))}
            </div>

            <div className="formula-hint">
              <span className="formula-slot">?</span>
              <span className="op-token"> ÷ </span>
              <span className="formula-slot">?</span>
              <span className="op-token"> × </span>
              <span className="formula-slot">?</span>
              <span className="op-token"> + </span>
              <span className="formula-slot">?</span>
              <span className="op-token"> − </span>
              <span className="formula-slot">?</span>
            </div>

            {error && <p className="error-msg">⚠ {error}</p>}

            <button className="btn-deal" onClick={deal}>
              🎲 &nbsp; Deal the Formula
            </button>
          </div>
        )}

        {phase === "result" && order && leaderboard && (
          <div className="result-section">
            <div className="formula-reveal">
              <div className="formula-reveal-label">⟡ The Formula Drawn</div>
              <div className="formula-tokens">
                {order.map((pi, pos) => (
                  <>
                    <div className="formula-token" key={pos} style={{ animationDelay: `${pos * 0.12}s` }}>
                      <span className="formula-token-value" style={{ color: COLORS[pi], animationDelay: `${pos * 0.12}s` }}>
                        {parseFloat(inputs[pi])}
                      </span>
                      <span className="formula-token-sub">{PLAYERS[pi]}</span>
                    </div>
                    {pos < 4 && <span className="op-token" key={`op-${pos}`}>{OPS[pos]}</span>}
                  </>
                ))}
              </div>
              <div className="equals-row">
                <span className="equals-sign">=</span>
                <span className="result-value">{result.toFixed(4)}</span>
              </div>
            </div>

            <div className="leaderboard">
              <div className="lb-header">
                <span>#</span><span>Player</span>
                <span style={{ textAlign: "right" }}>Input</span>
                <span style={{ textAlign: "right" }}>Δ Diff</span>
              </div>
              {leaderboard.map((row, rank) => (
                <div key={row.index} className={`lb-row${rank === 0 ? " winner" : ""}`} style={{ animationDelay: `${rank * 0.07}s` }}>
                  <span className={`lb-rank${rank === 0 ? " gold" : ""}`}>{rank === 0 ? "★" : rank + 1}</span>
                  <span className="lb-player">
                    <span className="lb-dot" style={{ background: row.color }} />
                    {row.name}
                  </span>
                  <span className="lb-input">{row.value}</span>
                  <span className={`lb-diff${rank === 0 ? " best" : ""}`}>{row.diff.toFixed(4)}</span>
                </div>
              ))}
            </div>

            <div className="winner-banner">
              <div className="winner-crown">👑</div>
              <div className="winner-title">Winner</div>
              <div className="winner-name" style={{ color: COLORS[leaderboard[0].index] }}>
                {leaderboard[0].name}
              </div>
              <div className="winner-detail">
                Input {leaderboard[0].value} — closest to {result.toFixed(4)} by a margin of {leaderboard[0].diff.toFixed(4)}
              </div>
            </div>
          </div>
        )}

        {phase === "result" && (
          <button className="btn-reset" onClick={reset}>↺ &nbsp; Play Again</button>
        )}
      </div>
    </>
  );
}