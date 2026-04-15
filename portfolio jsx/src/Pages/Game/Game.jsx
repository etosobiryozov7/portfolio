import React, { useEffect, useMemo, useRef, useState } from "react";

const BOARD_W = 1000;
const BOARD_H = 560;
const PLAYER_SIZE = 34;
const MAX_LIVES = 3;
const CRYSTAL_COUNT = 4;

const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const uid = () => `${Date.now()}-${Math.random()}`;

const createCrystal = () => ({
  id: uid(),
  x: rand(70, BOARD_W - 70),
  y: rand(70, BOARD_H - 70),
  size: rand(22, 30),
});

const createEnemy = (level = 1) => {
  const speed = rand(1.6 + level * 0.2, 2.5 + level * 0.3);
  const angle = rand(0, Math.PI * 2);

  return {
    id: uid(),
    x: rand(80, BOARD_W - 80),
    y: rand(80, BOARD_H - 80),
    size: rand(34, 48),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
  };
};

const createCrystals = () =>
  Array.from({ length: CRYSTAL_COUNT }, () => createCrystal());

const createEnemies = (level = 1) =>
  Array.from({ length: Math.min(3 + level, 9) }, () => createEnemy(level));

const isColliding = (player, playerSize, target, targetSize) => {
  const dx = player.x - target.x;
  const dy = player.y - target.y;
  const distance = Math.hypot(dx, dy);
  return distance < (playerSize + targetSize) / 2;
};

export default function App() {
  const boardRef = useRef(null);
  const playerRef = useRef({ x: BOARD_W / 2, y: BOARD_H / 2 });
  const comboRef = useRef(0);
  const frameRef = useRef(null);
  const hitCooldownRef = useRef(0);

  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(
    Number(localStorage.getItem("neon-hunt-best")) || 0
  );
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(1);
  const [collected, setCollected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [lives, setLives] = useState(MAX_LIVES);

  const [player, setPlayer] = useState({ x: BOARD_W / 2, y: BOARD_H / 2 });
  const [crystals, setCrystals] = useState(createCrystals);
  const [enemies, setEnemies] = useState(createEnemies(1));
  const [hitFlash, setHitFlash] = useState(false);

  const ambientDots = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: rand(2, 96),
        top: rand(4, 94),
        size: rand(70, 180),
        delay: rand(0, 8),
        duration: rand(6, 12),
      })),
    []
  );

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    comboRef.current = combo;
  }, [combo]);

  const finishGame = (finalScore = score) => {
    setRunning(false);
    setPaused(false);

    if (finalScore > bestScore) {
      setBestScore(finalScore);
      localStorage.setItem("neon-hunt-best", String(finalScore));
    }
  };

  const startGame = () => {
    setHasPlayed(true);
    setRunning(true);
    setPaused(false);

    setScore(0);
    setCombo(0);
    setLevel(1);
    setCollected(0);
    setTimeLeft(45);
    setLives(MAX_LIVES);

    const centerPlayer = { x: BOARD_W / 2, y: BOARD_H / 2 };
    setPlayer(centerPlayer);
    playerRef.current = centerPlayer;
    comboRef.current = 0;
    hitCooldownRef.current = 0;

    setCrystals(createCrystals());
    setEnemies(createEnemies(1));
  };

  const togglePause = () => {
    if (!running) return;
    setPaused((prev) => !prev);
  };

  const handleBoardMove = (e) => {
    if (!running || paused || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * BOARD_W;
    const y = ((e.clientY - rect.top) / rect.height) * BOARD_H;

    const nextPlayer = {
      x: clamp(x, PLAYER_SIZE / 2, BOARD_W - PLAYER_SIZE / 2),
      y: clamp(y, PLAYER_SIZE / 2, BOARD_H - PLAYER_SIZE / 2),
    };

    setPlayer(nextPlayer);
    playerRef.current = nextPlayer;
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() === "p") togglePause();
      if (e.key === "Enter" && !running) startGame();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [running]);

  useEffect(() => {
    if (!running || paused) return;

    if (timeLeft <= 0) {
      finishGame();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [running, paused, timeLeft, score, bestScore]);

  useEffect(() => {
    const nextLevel = Math.min(1 + Math.floor(collected / 6), 7);
    if (nextLevel !== level) setLevel(nextLevel);
  }, [collected, level]);

  useEffect(() => {
    if (!running) return;

    setEnemies((prev) => {
      const next = [...prev];
      const targetCount = Math.min(3 + level, 9);

      while (next.length < targetCount) {
        next.push(createEnemy(level));
      }

      return next;
    });
  }, [level, running]);

  useEffect(() => {
    if (!running || paused) return;

    const loop = () => {
      setEnemies((prevEnemies) => {
        const movedEnemies = prevEnemies.map((enemy) => {
          let nextX = enemy.x + enemy.vx;
          let nextY = enemy.y + enemy.vy;
          let nextVx = enemy.vx;
          let nextVy = enemy.vy;

          if (nextX <= enemy.size / 2 || nextX >= BOARD_W - enemy.size / 2) {
            nextVx *= -1;
          }

          if (nextY <= enemy.size / 2 || nextY >= BOARD_H - enemy.size / 2) {
            nextVy *= -1;
          }

          nextX = clamp(nextX, enemy.size / 2, BOARD_W - enemy.size / 2);
          nextY = clamp(nextY, enemy.size / 2, BOARD_H - enemy.size / 2);

          return {
            ...enemy,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
          };
        });

        const now = Date.now();

        if (now > hitCooldownRef.current) {
          const hitEnemy = movedEnemies.some((enemy) =>
            isColliding(playerRef.current, PLAYER_SIZE, enemy, enemy.size)
          );

          if (hitEnemy) {
            hitCooldownRef.current = now + 900;
            comboRef.current = 0;
            setCombo(0);
            setLives((prev) => Math.max(prev - 1, 0));
            setHitFlash(true);

            setTimeout(() => {
              setHitFlash(false);
            }, 180);
          }
        }

        return movedEnemies;
      });

      setCrystals((prevCrystals) => {
        let hits = 0;

        const leftCrystals = prevCrystals.filter((crystal) => {
          const touched = isColliding(
            playerRef.current,
            PLAYER_SIZE,
            crystal,
            crystal.size
          );

          if (touched) hits += 1;
          return !touched;
        });

        if (hits > 0) {
          const oldCombo = comboRef.current;
          const nextCombo = oldCombo + hits;

          comboRef.current = nextCombo;
          setCombo(nextCombo);

          setScore((prev) => prev + hits * 12 + oldCombo * 2);

          setCollected((prev) => {
            const next = prev + hits;

            if (next % 7 === 0) {
              setTimeLeft((time) => time + 3);
            }

            return next;
          });

          while (leftCrystals.length < CRYSTAL_COUNT) {
            leftCrystals.push(createCrystal());
          }
        }

        return leftCrystals;
      });

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [running, paused]);

  useEffect(() => {
    if (running && lives <= 0) {
      finishGame();
    }
  }, [lives, running, score]);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Inter, Arial, sans-serif;
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 20%),
            radial-gradient(circle at bottom right, rgba(255,255,255,0.08), transparent 25%),
            linear-gradient(135deg, #050505, #101010 45%, #080808);
          color: white;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          padding: 28px;
          position: relative;
        }

        .page::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 36px 36px;
          pointer-events: none;
        }

        .shell {
          max-width: 1250px;
          margin: 0 auto;
        }

        .head {
          text-align: center;
          margin-bottom: 22px;
          animation: fadeUp 0.7s ease;
        }

        .tag {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.18em;
          font-size: 12px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
        }

        .title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 0.95;
          margin-bottom: 12px;
          font-weight: 900;
        }

        .subtitle {
          max-width: 760px;
          margin: 0 auto;
          color: rgba(255,255,255,0.72);
          line-height: 1.8;
        }

        .hud {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .card {
          padding: 18px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(12px);
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.22);
        }

        .card span {
          display: block;
          color: rgba(255,255,255,0.65);
          margin-bottom: 10px;
        }

        .card strong {
          font-size: 1.45rem;
        }

        .actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .btn {
          padding: 14px 22px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer;
          font-weight: 800;
          transition: 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-4px);
        }

        .btn.primary {
          background: white;
          color: black;
          box-shadow: 0 18px 40px rgba(0,0,0,0.24);
        }

        .btn.ghost {
          background: rgba(255,255,255,0.06);
          color: white;
          backdrop-filter: blur(12px);
        }

        .arena {
          position: relative;
          height: 560px;
          border-radius: 34px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          background:
            radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 24%),
            radial-gradient(circle at bottom right, rgba(255,255,255,0.06), transparent 28%),
            linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.25));
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
          cursor: crosshair;
          animation: fadeUp 0.9s ease;
        }

        .arena::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 36px 36px;
          opacity: 0.28;
          pointer-events: none;
        }

        .scan {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255,255,255,0.03) 50%,
            transparent 100%
          );
          background-size: 100% 8px;
          opacity: 0.16;
          pointer-events: none;
          z-index: 1;
        }

        .ambient {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 70%);
          filter: blur(12px);
          pointer-events: none;
          z-index: 1;
          animation: floatAmbient ease-in-out infinite;
        }

        .player {
          position: absolute;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: 5;
          background:
            radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.82) 28%, rgba(255,255,255,0.18) 70%, transparent 76%);
          box-shadow:
            0 0 18px rgba(255,255,255,0.75),
            0 0 40px rgba(255,255,255,0.25);
        }

        .player::before {
          content: "";
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.18);
        }

        .player-safe {
          box-shadow:
            0 0 0 8px rgba(255,255,255,0.06),
            0 0 18px rgba(255,255,255,0.9),
            0 0 46px rgba(255,255,255,0.35);
        }

        .crystal {
          position: absolute;
          transform: translate(-50%, -50%) rotate(45deg);
          border-radius: 10px;
          z-index: 4;
          background: linear-gradient(135deg, #ffffff 0%, #8af5ff 35%, #42cfff 100%);
          box-shadow:
            0 0 15px rgba(66, 207, 255, 0.55),
            0 0 30px rgba(66, 207, 255, 0.18);
          animation: crystalSpin 3s linear infinite, crystalPulse 1.3s ease-in-out infinite;
        }

        .crystal::before {
          content: "";
          position: absolute;
          inset: 20%;
          border-radius: 6px;
          background: rgba(255,255,255,0.55);
        }

        .enemy {
          position: absolute;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          z-index: 4;
          background:
            radial-gradient(circle at 35% 35%, #ffffff 0%, #ff8fab 10%, #ff3d71 30%, rgba(255, 31, 91, 0.82) 70%, transparent 78%);
          box-shadow:
            0 0 14px rgba(255,61,113,0.65),
            0 0 34px rgba(255,61,113,0.24);
        }

        .enemy::after {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1px solid rgba(255,61,113,0.14);
        }

        .overlay {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 8;
          background: rgba(5,5,8,0.4);
          backdrop-filter: blur(10px);
        }

        .overlay.pause {
          background: rgba(5,5,8,0.28);
        }

        .overlay-box {
          width: min(520px, calc(100% - 30px));
          padding: 32px;
          border-radius: 28px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 30px 80px rgba(0,0,0,0.35);
          text-align: center;
          backdrop-filter: blur(14px);
        }

        .overlay-box.small {
          width: min(420px, calc(100% - 30px));
        }

        .overlay-mini {
          color: rgba(255,255,255,0.65);
          letter-spacing: 0.22em;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .overlay-box h2 {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .overlay-box p {
          color: rgba(255,255,255,0.72);
          line-height: 1.8;
          margin-bottom: 18px;
        }

        .arena-hit {
          animation: arenaHit 0.22s ease;
        }

        @keyframes crystalSpin {
          from {
            transform: translate(-50%, -50%) rotate(45deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(405deg);
          }
        }

        @keyframes crystalPulse {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.18);
          }
        }

        @keyframes floatAmbient {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.08);
          }
        }

        @keyframes arenaHit {
          0% { transform: translateX(0); }
          30% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 980px) {
          .hud {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .arena {
            height: 460px;
          }
        }

        @media (max-width: 620px) {
          .page {
            padding: 18px;
          }

          .hud {
            grid-template-columns: 1fr;
          }

          .arena {
            height: 340px;
          }

          .title {
            font-size: 2.2rem;
          }

          .overlay-box {
            padding: 24px 18px;
          }

          .overlay-box h2 {
            font-size: 1.6rem;
          }
        }
      `}</style>

      <div className="page">
        <div className="shell">
          <div className="head">
            <p className="tag">MODERN MINI GAME</p>
            <h1 className="title">Neon Hunt</h1>
            <p className="subtitle">
              Oq sharni sichqoncha bilan boshqar. Ko‘k kristallarni yig‘,
              qizil dushmanlardan qoch. Har 6 ta crystal’da level oshadi.
            </p>
          </div>

          <div className="hud">
            <div className="card">
              <span>Score</span>
              <strong>{score}</strong>
            </div>

            <div className="card">
              <span>Best</span>
              <strong>{bestScore}</strong>
            </div>

            <div className="card">
              <span>Level</span>
              <strong>{level}</strong>
            </div>

            <div className="card">
              <span>Combo</span>
              <strong>{combo}</strong>
            </div>

            <div className="card">
              <span>Time / Lives</span>
              <strong>
                {timeLeft}s • {lives}
              </strong>
            </div>
          </div>

          <div className="actions">
            <button className="btn primary" onClick={startGame}>
              {running ? "Restart" : "Start Game"}
            </button>

            <button className="btn ghost" onClick={togglePause}>
              {paused ? "Resume" : "Pause"}
            </button>
          </div>

          <div
            ref={boardRef}
            className={`arena ${hitFlash ? "arena-hit" : ""}`}
            onMouseMove={handleBoardMove}
          >
            <div className="scan" />

            {ambientDots.map((dot) => (
              <span
                key={dot.id}
                className="ambient"
                style={{
                  left: `${dot.left}%`,
                  top: `${dot.top}%`,
                  width: `${dot.size}px`,
                  height: `${dot.size}px`,
                  animationDelay: `${dot.delay}s`,
                  animationDuration: `${dot.duration}s`,
                }}
              />
            ))}

            <div
              className={`player ${
                Date.now() < hitCooldownRef.current ? "player-safe" : ""
              }`}
              style={{
                left: `${(player.x / BOARD_W) * 100}%`,
                top: `${(player.y / BOARD_H) * 100}%`,
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
              }}
            />

            {crystals.map((crystal) => (
              <div
                key={crystal.id}
                className="crystal"
                style={{
                  left: `${(crystal.x / BOARD_W) * 100}%`,
                  top: `${(crystal.y / BOARD_H) * 100}%`,
                  width: `${crystal.size}px`,
                  height: `${crystal.size}px`,
                }}
              />
            ))}

            {enemies.map((enemy) => (
              <div
                key={enemy.id}
                className="enemy"
                style={{
                  left: `${(enemy.x / BOARD_W) * 100}%`,
                  top: `${(enemy.y / BOARD_H) * 100}%`,
                  width: `${enemy.size}px`,
                  height: `${enemy.size}px`,
                }}
              />
            ))}

            {!running && (
              <div className="overlay">
                <div className="overlay-box">
                  <p className="overlay-mini">
                    {hasPlayed ? "ROUND FINISHED" : "WELCOME"}
                  </p>
                  <h2>{hasPlayed ? "Game Over" : "Catch The Light"}</h2>
                  <p>
                    {hasPlayed
                      ? `Sening oxirgi natijang: ${score}. Yana boshlab record yangila.`
                      : "Start tugmasini bos. Sichqoncha bilan boshqar. P tugmasi bilan pause qilsa bo‘ladi."}
                  </p>
                  <button className="btn primary" onClick={startGame}>
                    Play Now
                  </button>
                </div>
              </div>
            )}

            {running && paused && (
              <div className="overlay pause">
                <div className="overlay-box small">
                  <p className="overlay-mini">PAUSED</p>
                  <h2>Continue?</h2>
                  <p>Resume ni bos yoki P tugmasini bos.</p>
                  <button className="btn primary" onClick={togglePause}>
                    Resume Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}