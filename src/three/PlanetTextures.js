import * as THREE from 'three';

/**
 * Gerador procedural de texturas planetárias realistas em alta definição (Canvas 2D -> THREE.CanvasTexture).
 * Garante carregamento imediato, iluminação 3D realista com relevo (bump map) e anéis detalhados.
 */

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function createGlowTexture(innerColor = 'rgba(255, 200, 80, 1)', midColor = 'rgba(255, 110, 20, 0.35)', outerColor = 'rgba(255, 60, 0, 0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, innerColor);
  grad.addColorStop(0.32, midColor);
  grad.addColorStop(1, outerColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

export function createSunTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const rand = seededRandom(101);

  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0, '#ff7700');
  baseGrad.addColorStop(0.25, '#ffaa00');
  baseGrad.addColorStop(0.5, '#ffdd44');
  baseGrad.addColorStop(0.75, '#ffaa00');
  baseGrad.addColorStop(1, '#ff7700');
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // Granulação solar e regiões ativas
  for (let i = 0; i < 1600; i++) {
    const x = rand() * width;
    const y = rand() * height;
    const r = 2 + rand() * 18;
    const bright = rand() > 0.35;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    if (bright) {
      g.addColorStop(0, 'rgba(255, 255, 210, 0.45)');
      g.addColorStop(1, 'rgba(255, 180, 0, 0)');
    } else {
      g.addColorStop(0, 'rgba(180, 50, 0, 0.35)');
      g.addColorStop(1, 'rgba(255, 100, 0, 0)');
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createPlanetTextures(type) {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d');
  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, width, height);

  const rand = seededRandom(type.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 37);

  if (type === 'mercury' || type === 'moon') {
    const base = type === 'mercury' ? '#8c8881' : '#9ea3a8';
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    // Manchas de albedo e bacias de impacto
    for (let i = 0; i < 450; i++) {
      const x = rand() * width;
      const y = rand() * height;
      const r = 4 + rand() * 42;
      const shade = Math.floor(105 + (rand() - 0.5) * 65);
      const grad = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
      grad.addColorStop(0, `rgba(${shade - 20}, ${shade - 22}, ${shade - 25}, 0.55)`);
      grad.addColorStop(0.75, `rgba(${shade + 25}, ${shade + 25}, ${shade + 25}, 0.35)`);
      grad.addColorStop(1, 'rgba(140, 136, 129, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Bump crater
      const bGrad = bumpCtx.createRadialGradient(x, y, r * 0.2, x, y, r);
      bGrad.addColorStop(0, 'rgba(40,40,40,0.7)');
      bGrad.addColorStop(0.85, 'rgba(230,230,230,0.6)');
      bGrad.addColorStop(1, 'rgba(128,128,128,0)');
      bumpCtx.fillStyle = bGrad;
      bumpCtx.beginPath();
      bumpCtx.arc(x, y, r, 0, Math.PI * 2);
      bumpCtx.fill();
    }
  } else if (type === 'venus') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#c28e46');
    grad.addColorStop(0.3, '#e3b66b');
    grad.addColorStop(0.5, '#f0cb85');
    grad.addColorStop(0.7, '#d9a457');
    grad.addColorStop(1, '#b8823b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Bandas atmosféricas em V
    for (let i = 0; i < 180; i++) {
      const y = rand() * height;
      const h = 6 + rand() * 24;
      ctx.fillStyle = rand() > 0.5 ? 'rgba(255, 232, 185, 0.12)' : 'rgba(150, 92, 30, 0.12)';
      ctx.beginPath();
      ctx.ellipse(rand() * width, y, 120 + rand() * 260, h, (rand() - 0.5) * 0.15, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'earth') {
    // Oceano profundo
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, '#0f294a');
    oceanGrad.addColorStop(0.2, '#134074');
    oceanGrad.addColorStop(0.5, '#1d4ed8');
    oceanGrad.addColorStop(0.8, '#134074');
    oceanGrad.addColorStop(1, '#0f294a');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, width, height);

    // Massas continentais estilizadas
    const continents = [
      { x: 210, y: 165, rx: 95, ry: 68, rot: -0.3 },
      { x: 290, y: 330, rx: 55, ry: 95, rot: 0.2 },
      { x: 520, y: 150, rx: 85, ry: 55, rot: 0.1 },
      { x: 545, y: 280, rx: 75, ry: 88, rot: -0.1 },
      { x: 710, y: 175, rx: 145, ry: 82, rot: 0.08 },
      { x: 830, y: 360, rx: 62, ry: 42, rot: -0.2 }
    ];

    continents.forEach((c) => {
      for (let j = 0; j < 28; j++) {
        const ox = c.x + (rand() - 0.5) * c.rx * 1.1;
        const oy = c.y + (rand() - 0.5) * c.ry * 1.1;
        const rx = (0.25 + rand() * 0.55) * c.rx;
        const ry = (0.25 + rand() * 0.55) * c.ry;
        const isDesert = Math.abs(oy - height / 2) < 90 && rand() > 0.55;
        ctx.fillStyle = isDesert ? 'rgba(184, 152, 92, 0.75)' : 'rgba(34, 122, 68, 0.78)';
        ctx.beginPath();
        ctx.ellipse(ox, oy, rx, ry, c.rot + (rand() - 0.5) * 0.6, 0, Math.PI * 2);
        ctx.fill();

        bumpCtx.fillStyle = 'rgba(205, 205, 205, 0.5)';
        bumpCtx.beginPath();
        bumpCtx.ellipse(ox, oy, rx, ry, c.rot, 0, Math.PI * 2);
        bumpCtx.fill();
      }
    });

    // Calotas polares
    ctx.fillStyle = 'rgba(240, 249, 255, 0.92)';
    ctx.fillRect(0, 0, width, 26);
    ctx.fillRect(0, height - 30, width, 30);

    // Nuvens atmosféricas sutis
    for (let i = 0; i < 140; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
      ctx.beginPath();
      ctx.ellipse(rand() * width, rand() * height, 30 + rand() * 110, 4 + rand() * 14, (rand() - 0.5) * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'mars') {
    const marsGrad = ctx.createLinearGradient(0, 0, 0, height);
    marsGrad.addColorStop(0, '#9a3412');
    marsGrad.addColorStop(0.25, '#c2410c');
    marsGrad.addColorStop(0.5, '#d95326');
    marsGrad.addColorStop(0.75, '#b43c12');
    marsGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = marsGrad;
    ctx.fillRect(0, 0, width, height);

    // Regiões escuras basálticas e cânions
    for (let i = 0; i < 220; i++) {
      const x = rand() * width;
      const y = 40 + rand() * (height - 80);
      const rx = 12 + rand() * 85;
      const ry = 6 + rand() * 38;
      ctx.fillStyle = rand() > 0.45 ? 'rgba(92, 28, 12, 0.28)' : 'rgba(245, 148, 92, 0.22)';
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, (rand() - 0.5) * 0.5, 0, Math.PI * 2);
      ctx.fill();

      bumpCtx.fillStyle = rand() > 0.5 ? 'rgba(185,185,185,0.4)' : 'rgba(85,85,85,0.4)';
      bumpCtx.beginPath();
      bumpCtx.ellipse(x, y, rx * 0.7, ry * 0.7, 0, 0, Math.PI * 2);
      bumpCtx.fill();
    }

    // Calotas polares marcianas
    ctx.fillStyle = 'rgba(255, 245, 238, 0.85)';
    ctx.fillRect(0, 0, width, 16);
    ctx.fillRect(0, height - 16, width, 16);
  } else if (type === 'jupiter') {
    const bands = [
      '#785942', '#b88b64', '#d9a875', '#a66238', '#e6cba8',
      '#b86535', '#f2dec2', '#9c552b', '#dbb489', '#c28e60',
      '#e3c39d', '#8c583a', '#cfa47a', '#785942'
    ];
    const bandH = height / bands.length;
    bands.forEach((col, idx) => {
      ctx.fillStyle = col;
      ctx.fillRect(0, idx * bandH, width, bandH + 2);
    });

    // Turbulência entre faixas
    for (let i = 0; i < 320; i++) {
      const y = rand() * height;
      ctx.fillStyle = rand() > 0.5 ? 'rgba(255, 240, 215, 0.18)' : 'rgba(120, 55, 20, 0.18)';
      ctx.beginPath();
      ctx.ellipse(rand() * width, y, 40 + rand() * 140, 3 + rand() * 9, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Grande Mancha Vermelha
    const spotX = width * 0.62;
    const spotY = height * 0.64;
    const spotGrad = ctx.createRadialGradient(spotX, spotY, 6, spotX, spotY, 48);
    spotGrad.addColorStop(0, '#b91c1c');
    spotGrad.addColorStop(0.6, '#dc2626');
    spotGrad.addColorStop(0.85, '#f59e0b');
    spotGrad.addColorStop(1, 'rgba(217, 168, 117, 0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, 54, 30, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (type === 'saturn') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#9c8253');
    grad.addColorStop(0.18, '#cbb07a');
    grad.addColorStop(0.35, '#e5cc94');
    grad.addColorStop(0.5, '#f3dfa8');
    grad.addColorStop(0.65, '#dfc388');
    grad.addColorStop(0.82, '#c7ab73');
    grad.addColorStop(1, '#947a4d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 120; i++) {
      const y = rand() * height;
      ctx.fillStyle = rand() > 0.5 ? 'rgba(255, 248, 220, 0.14)' : 'rgba(140, 108, 58, 0.12)';
      ctx.fillRect(0, y, width, 2 + rand() * 6);
    }
  } else if (type === 'uranus') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#1aa3b8');
    grad.addColorStop(0.3, '#5ce1e6');
    grad.addColorStop(0.5, '#88f4f8');
    grad.addColorStop(0.7, '#5ce1e6');
    grad.addColorStop(1, '#1aa3b8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(0, rand() * height, width, 3 + rand() * 8);
    }
  } else if (type === 'neptune') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#172554');
    grad.addColorStop(0.25, '#1d4ed8');
    grad.addColorStop(0.5, '#2563eb');
    grad.addColorStop(0.75, '#1d4ed8');
    grad.addColorStop(1, '#172554');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Correntes de vento e nuvens de metano altas
    for (let i = 0; i < 95; i++) {
      ctx.fillStyle = rand() > 0.35 ? 'rgba(147, 197, 253, 0.18)' : 'rgba(15, 23, 42, 0.22)';
      ctx.beginPath();
      ctx.ellipse(rand() * width, rand() * height, 50 + rand() * 130, 2 + rand() * 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  return { map, bumpMap };
}

export function createSaturnRingTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  const rings = [
    { r: 0.44, w: 0.05, col: 'rgba(180, 155, 115, 0.35)' },
    { r: 0.52, w: 0.09, col: 'rgba(235, 212, 165, 0.78)' },
    { r: 0.62, w: 0.08, col: 'rgba(245, 226, 182, 0.88)' },
    // Divisão de Cassini (gap escuro)
    { r: 0.71, w: 0.025, col: 'rgba(20, 20, 30, 0.08)' },
    { r: 0.78, w: 0.09, col: 'rgba(215, 190, 145, 0.68)' },
    { r: 0.88, w: 0.04, col: 'rgba(190, 168, 128, 0.42)' }
  ];

  rings.forEach((ring) => {
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r * (size / 2), 0, Math.PI * 2);
    ctx.strokeStyle = ring.col;
    ctx.lineWidth = ring.w * (size / 2);
    ctx.stroke();
  });

  // Micro-anéis concêntricos
  for (let r = 110; r < 238; r += 2.5) {
    if (r > 176 && r < 186) continue; // Cassini gap
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 5 === 0 ? 'rgba(255, 245, 220, 0.22)' : 'rgba(90, 75, 50, 0.14)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  return new THREE.CanvasTexture(canvas);
}
