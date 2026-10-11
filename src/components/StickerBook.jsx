import { useState, useRef } from 'react';
import { Image, Trash2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';
import { AVAILABLE_STICKERS } from '../data/stickers';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

const SCENERY_OPTIONS = [
  { id: 'forest', name: '魔法森林 🌲', bg: 'linear-gradient(to bottom, #dbeafe, #bbf7d0, #86efac)' },
  { id: 'space', name: '奇幻太空 🚀', bg: 'linear-gradient(to bottom, #0f172a, #1e1b4b, #311042)' },
  { id: 'sea', name: '蔚蓝深海 🐳', bg: 'linear-gradient(to bottom, #bae6fd, #38bdf8, #0284c7)' }
];

export default function StickerBook({ unlockedStickers = [], onMascotMessage, setMascotStatus }) {
  const [activeScenery, setActiveScenery] = useState('forest');
  const [placedStickers, setPlacedStickers] = useLocalStorageState('ket_placed_stickers', []);
  
  // Dragging states
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const idCounterRef = useRef(0);

  const addStickerToCanvas = (sticker) => {
    playClickSound();
    if (!unlockedStickers.includes(sticker.id)) {
      onMascotMessage(`Oops! This sticker is locked. 快去学习或闯关解锁它吧！`);
      setMascotStatus('wrong');
      return;
    }

    // Spawn sticker in center of canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      idCounterRef.current += 1;
      const newSticker = {
        uniqueId: `${sticker.id}_${placedStickers.length}_${idCounterRef.current}`,
        id: sticker.id,
        icon: sticker.icon,
        name: sticker.name,
        x: rect.width / 2 - 24, // center x
        y: rect.height / 2 - 24, // center y
        scale: 1,
        rotation: 0
      };
      setPlacedStickers(prev => [...prev, newSticker]);
      onMascotMessage(`Spawned ${sticker.icon}! Drag it around to decorate! 拖拽卡片布置你的作品吧！`);
      setMascotStatus('idle');
    }
  };

  // Drag start
  const handleDragStart = (e, uniqueId, currentX, currentY) => {
    e.preventDefault();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    setDraggingId(uniqueId);
    setDragOffset({
      x: clientX - currentX,
      y: clientY - currentY
    });
  };

  // Drag move
  const handleDragMove = (e) => {
    if (!draggingId) return;
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      let newX = clientX - dragOffset.x;
      let newY = clientY - dragOffset.y;

      // Constrain inside canvas
      newX = Math.max(10, Math.min(rect.width - 50, newX));
      newY = Math.max(10, Math.min(rect.height - 50, newY));

      setPlacedStickers(prev => 
        prev.map(s => s.uniqueId === draggingId ? { ...s, x: newX, y: newY } : s)
      );
    }
  };

  // Drag end
  const handleDragEnd = () => {
    setDraggingId(null);
  };

  // Remove sticker from canvas
  const handleRemoveSticker = (uniqueId) => {
    playClickSound();
    setPlacedStickers(prev => prev.filter(s => s.uniqueId !== uniqueId));
  };

  // Clear all placed stickers
  const handleClearCanvas = () => {
    playClickSound();
    setPlacedStickers([]);
  };

  // Rotate/Scale a placed sticker
  const handleModifySticker = (uniqueId, type) => {
    playClickSound();
    setPlacedStickers(prev => 
      prev.map(s => {
        if (s.uniqueId === uniqueId) {
          if (type === 'rotate') {
            return { ...s, rotation: (s.rotation + 45) % 360 };
          } else if (type === 'grow') {
            const nextScale = s.scale >= 2 ? 0.75 : s.scale + 0.25;
            return { ...s, scale: nextScale };
          }
        }
        return s;
      })
    );
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden gap-3 pr-1">
      {/* Overview & Locked stats */}
      <div className="glass-card rounded-2xl p-3 text-center max-w-xl mx-auto w-full shrink-0">
        <h2 className="text-xl font-extrabold text-main mb-0.5" style={{ fontFamily: 'var(--font-heading)', color: 'var(--accent)' }}>
          我的贴纸收集册 ✨
        </h2>
        <p className="text-xs text-muted">
          宝宝已解锁 <strong>{unlockedStickers.length} / {AVAILABLE_STICKERS.length}</strong> 张魔法徽章！点击已解锁的贴纸可以放到下方的画板里进行创作哦。
        </p>
      </div>

      {/* Stickers Showcase */}
      <div className="sticker-showcase-grid overflow-y-auto flex-1 min-h-0 max-w-5xl mx-auto w-full pb-2 pr-1">
        {AVAILABLE_STICKERS.map((sticker) => {
          const isUnlocked = unlockedStickers.includes(sticker.id);
          return (
            <button
              key={sticker.id}
              disabled={!isUnlocked}
              onClick={() => addStickerToCanvas(sticker)}
              className={`sticker-panel-btn py-3 px-2 ${isUnlocked ? 'unlocked' : 'locked'}`}
            >
              <div 
                className="sticker-panel-icon-wrap"
                style={{ 
                  background: isUnlocked ? sticker.color : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                  fontSize: '1.75rem',
                  width: '48px',
                  height: '48px',
                  marginBottom: '6px'
                }}
              >
                {sticker.icon}
              </div>
              <h4 className="text-xs font-bold text-main">{sticker.name}</h4>
              <p className="text-[9px] text-muted mt-0.5 leading-snug text-center flex items-center justify-center" style={{ height: '24px' }}>
                {sticker.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Scenery Selection & Controls */}
      <div className="glass-card rounded-2xl p-4 max-w-4xl mx-auto w-full flex flex-col gap-3 shrink-0">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-main">画板场景：</span>
            <div className="flex gap-1.5">
              {SCENERY_OPTIONS.map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => { playClickSound(); setActiveScenery(scene.id); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all`}
                  style={{ 
                    fontFamily: 'var(--font-heading)',
                    backgroundColor: activeScenery === scene.id ? 'var(--primary)' : 'var(--bg-card)',
                    color: activeScenery === scene.id ? 'var(--text-light)' : 'var(--text-muted)',
                    border: activeScenery === scene.id ? '1px solid var(--primary)' : '1px solid var(--border-card)',
                    cursor: 'pointer'
                  }}
                >
                  {scene.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleClearCanvas} className="btn-bubble danger text-xs py-1.5 px-3.5 shadow-none translate-y-0 hover:translate-y-0">
            <Trash2 size={13} /> 清空创作画板
          </button>
        </div>

        {/* Drag Drop Canvas */}
        <div 
          ref={canvasRef}
          onMouseMove={handleDragMove}
          onTouchMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchEnd={handleDragEnd}
          onMouseLeave={handleDragEnd}
          className="sticker-canvas"
          style={{
            background: SCENERY_OPTIONS.find(s => s.id === activeScenery)?.bg,
            transition: 'background 0.5s ease',
            height: '280px'
          }}
        >
          {placedStickers.length === 0 && (
            <div className="sticker-canvas-empty">
              <Image size={40} className="mb-1 animate-bounce" />
              <p className="font-bold text-base" style={{ fontFamily: 'var(--font-heading)' }}>
                空空如也的魔法画布
              </p>
              <p className="text-[11px] mt-0.5">点击上方解锁的贴纸，把它们召唤并拖动到画板上来装扮场景吧！</p>
            </div>
          )}

          {/* Placed stickers list */}
          {placedStickers.map((sticker) => (
            <div
              key={sticker.uniqueId}
              onMouseDown={(e) => handleDragStart(e, sticker.uniqueId, sticker.x, sticker.y)}
              onTouchStart={(e) => handleDragStart(e, sticker.uniqueId, sticker.x, sticker.y)}
              className={`sticker-placed-item group ${draggingId === sticker.uniqueId ? 'dragging' : ''}`}
              style={{
                left: `${sticker.x}px`,
                top: `${sticker.y}px`,
                transform: `scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                transformOrigin: 'center center',
                touchAction: 'none'
              }}
            >
              {/* Interaction tools floating on hover */}
              <div className="sticker-tools-menu">
                <button 
                  onClick={() => handleModifySticker(sticker.uniqueId, 'grow')}
                  className="sticker-tool-btn" 
                  title="调整大小"
                >
                  🔍
                </button>
                <button 
                  onClick={() => handleModifySticker(sticker.uniqueId, 'rotate')}
                  className="sticker-tool-btn" 
                  title="旋转"
                >
                  🔄
                </button>
                <button 
                  onClick={() => handleRemoveSticker(sticker.uniqueId)}
                  className="sticker-tool-btn" 
                  title="删除"
                >
                  ❌
                </button>
              </div>

              {/* Icon Emoji */}
              <span className="text-4xl select-none pointer-events-none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}>
                {sticker.icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
