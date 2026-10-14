import { useState, useRef } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { playClickSound, playCorrectSound } from "../utils/audio.js";
import { AVAILABLE_STICKERS, computeUnlockedStickers } from "../data/stickers.js";
import { useLocalStorageState } from "../hooks/useLocalStorageState.js";

const SCENERY_OPTIONS = [
  {
    id: "forest",
    name: "魔法森林 🌲",
    bg: "linear-gradient(to bottom, #dbeafe, #bbf7d0, #86efac)",
  },
  {
    id: "space",
    name: "奇幻太空 🚀",
    bg: "linear-gradient(to bottom, #0f172a, #1e1b4b, #311042)",
  },
  {
    id: "sea",
    name: "蔚蓝深海 🐳",
    bg: "linear-gradient(to bottom, #bae6fd, #38bdf8, #0284c7)",
  },
];

export default function StickerBook({ progress }) {
  const unlockedStickers = computeUnlockedStickers(progress);
  const [activeScenery, setActiveScenery] = useState("forest");
  const [placedStickers, setPlacedStickers] = useLocalStorageState(
    "ket_placed_stickers",
    [],
  );
  const [statusMessage, setStatusMessage] = useState(
    "点击上方已点亮的徽章，就能把贴纸召唤到下方画布里自由拖动装扮哦！",
  );
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const idCounterRef = useRef(0);

  function addStickerToCanvas(sticker) {
    if (!unlockedStickers.includes(sticker.id)) {
      playClickSound();
      setStatusMessage(`“${sticker.name}”尚未解锁：${sticker.desc}。加油去闯关吧！`);
      return;
    }
    playCorrectSound();
    const canvas = canvasRef.current;
    const width = canvas?.clientWidth || 320;
    const height = canvas?.clientHeight || 220;
    idCounterRef.current += 1;
    const offset = ((placedStickers.length + idCounterRef.current) % 5) * 24 - 48;
    const newSticker = {
      uniqueId: `${sticker.id}_${Date.now()}_${idCounterRef.current}`,
      id: sticker.id,
      icon: sticker.icon,
      name: sticker.name,
      x: Math.max(16, Math.min(width - 64, Math.round(width / 2 - 24 + offset))),
      y: Math.max(16, Math.min(height - 64, Math.round(height / 2 - 24 + offset / 2))),
      scale: 1,
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
    setStatusMessage(`已将“${sticker.name} ${sticker.icon}”放入画板！拖动它布置你的场景吧。`);
  }

  function handleDragStart(e, uniqueId, currentX, currentY) {
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    setDraggingId(uniqueId);
    setDragOffset({ x: clientX - currentX, y: clientY - currentY });
  }

  function handleDragMove(e) {
    if (!draggingId) return;
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX === undefined || clientY === undefined) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const newX = Math.max(8, Math.min(rect.width - 52, clientX - dragOffset.x));
    const newY = Math.max(8, Math.min(rect.height - 52, clientY - dragOffset.y));
    setPlacedStickers((prev) =>
      prev.map((s) => (s.uniqueId === draggingId ? { ...s, x: newX, y: newY } : s)),
    );
  }

  function handleDragEnd() {
    setDraggingId(null);
  }

  function handleClearCanvas() {
    playClickSound();
    setPlacedStickers([]);
    setStatusMessage("画板已清空，重新挑选你喜欢的贴纸吧！");
  }

  return (
    <section className="sticker-book-section" aria-label="魔法贴纸收集册">
      <div className="section-heading">
        <div>
          <span className="eyebrow">HAPPY REWARDS · STICKER BOOK</span>
          <h2>
            <Sparkles size={20} /> 我的魔法贴纸屋
          </h2>
        </div>
        <span className="muted">
          已解锁 {unlockedStickers.length} / {AVAILABLE_STICKERS.length} 枚徽章
        </span>
      </div>

      <p className="sticker-status-banner" role="status">
        {statusMessage}
      </p>

      <div className="sticker-badge-grid" role="list" aria-label="贴纸徽章列表">
        {AVAILABLE_STICKERS.map((sticker) => {
          const isUnlocked = unlockedStickers.includes(sticker.id);
          return (
            <button
              type="button"
              key={sticker.id}
              onClick={() => addStickerToCanvas(sticker)}
              className={`sticker-badge-card ${isUnlocked ? "unlocked" : "locked"}`}
              aria-label={`${sticker.name}，${isUnlocked ? "已解锁，点击放入画板" : `未解锁：${sticker.desc}`}`}
            >
              <span
                className="sticker-badge-icon"
                style={{
                  background: isUnlocked
                    ? sticker.color
                    : "linear-gradient(135deg, #d7e0da 0%, #b8c4bc 100%)",
                }}
              >
                {sticker.icon}
              </span>
              <span className="sticker-badge-info">
                <strong>{sticker.name}</strong>
                <small>{sticker.desc}</small>
              </span>
            </button>
          );
        })}
      </div>

      <div className="sticker-canvas-shell">
        <div className="sticker-canvas-toolbar">
          <div className="scenery-buttons" role="group" aria-label="选择画板背景">
            {SCENERY_OPTIONS.map((scene) => (
              <button
                type="button"
                key={scene.id}
                aria-pressed={activeScenery === scene.id}
                onClick={() => {
                  playClickSound();
                  setActiveScenery(scene.id);
                }}
                className={`quiet-button ${activeScenery === scene.id ? "active-scene" : ""}`}
              >
                {scene.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={handleClearCanvas}
            className="quiet-button"
            disabled={!placedStickers.length}
          >
            <Trash2 size={15} /> 清空画板
          </button>
        </div>

        <div
          ref={canvasRef}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd}
          className="sticker-Interactive-canvas"
          style={{
            background: SCENERY_OPTIONS.find((s) => s.id === activeScenery)?.bg,
          }}
          aria-label="贴纸创作画布"
        >
          {placedStickers.length === 0 && (
            <div className="sticker-canvas-placeholder">
              <p>点击上方已点亮的贴纸徽章，召唤它们来装扮你的专属天地！</p>
            </div>
          )}
          {placedStickers.map((sticker) => (
            <div
              key={sticker.uniqueId}
              onMouseDown={(e) => handleDragStart(e, sticker.uniqueId, sticker.x, sticker.y)}
              onTouchStart={(e) => handleDragStart(e, sticker.uniqueId, sticker.x, sticker.y)}
              className="placed-sticker-node"
              style={{
                left: `${sticker.x}px`,
                top: `${sticker.y}px`,
              }}
              title={`${sticker.name}（可拖动）`}
            >
              <span>{sticker.icon}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
