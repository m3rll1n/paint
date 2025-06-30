import React, { useRef, useState } from 'react';
import './App.css';

const COLORS = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#FFC0CB', '#8B4513', '#FFFFFF'];
const BRUSH_SIZES = [4, 8, 14, 22, 32];
const BRUSH_EMOJIS = ['🖊️', '🖍️', '🖌️', '✏️', '🪣'];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true);
    const pos = getPos(e);
    setLastPos(pos);
  };

  const endDrawing = () => {
    setDrawing(false);
    setLastPos(null);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    if (lastPos) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    setLastPos(pos);
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'meu-desenho.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="paint-app">
      <h1>Teste Aplicativo TEA <p>Pamela</p><span role="img" aria-label="pincel">🖌️</span></h1>
      <div className="toolbar">
        <div className="colors">
          {COLORS.map((c) => (
            <button
              key={c}
              className={color === c ? 'selected' : ''}
              style={{ background: c }}
              onClick={() => setColor(c)}
              aria-label={`Selecionar cor ${c}`}
            />
          ))}
        </div>
        <div className="brush-sizes">
          {BRUSH_SIZES.map((size, i) => (
            <button
              key={size}
              className={brushSize === size ? 'selected' : ''}
              onClick={() => setBrushSize(size)}
              aria-label={`Selecionar espessura ${size}`}
            >
              <span style={{
                display: 'inline-block',
                background: color,
                borderRadius: '50%',
                width: size,
                height: size,
                marginRight: 6,
                verticalAlign: 'middle',
                border: '2px solid #fff',
                boxShadow: '0 1px 4px #0002'
              }} />
              <span style={{fontSize: 18, marginLeft: 2}}>{BRUSH_EMOJIS[i]}</span>
            </button>
          ))}
        </div>
        <button onClick={clearCanvas} className="clear-btn">🧹 Limpar</button>
        <button onClick={saveImage} className="save-btn">💾 Salvar</button>
      </div>
      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={window.innerWidth < 600 ? 320 : 600}
          height={window.innerWidth < 600 ? 400 : 400}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={endDrawing}
          onTouchCancel={endDrawing}
          onTouchMove={draw}
          className="paint-canvas"
        />
      </div>
      <div style={{marginTop: 16, fontFamily: 'Comic Sans MS, Comic Sans, cursive', color: '#ff7f50', fontSize: 18}}>
        <span role="img" aria-label="estrela">⭐</span> Divirta-se criando sua arte!
      </div>
    </div>
  );
}

export default App;
