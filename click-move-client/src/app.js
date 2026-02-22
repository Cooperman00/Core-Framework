import { findPath } from './pathfinding.js';

const tileSize = 32;
const cols = 24;
const rows = 16;
const obstacleChance = 0.2;

const palette = {
  floor: '#1e293b',
  wall: '#475569',
  wallEdge: '#64748b',
  grid: '#334155',
  path: '#f59e0b',
  player: '#22c55e',
  target: '#60a5fa',
};

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const statusText = document.querySelector('#status');

const state = {
  grid: [],
  player: { x: 1, y: 1 },
  target: null,
  path: [],
  pathIndex: 0,
  showGrid: true,
};

function randomWalkablePoint() {
  while (true) {
    const point = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
    if (state.grid[point.y][point.x] === 0) {
      return point;
    }
  }
}

function generateGrid() {
  state.grid = Array.from({ length: rows }, (_, y) =>
    Array.from({ length: cols }, (_, x) => {
      const isBorder = x === 0 || y === 0 || x === cols - 1 || y === rows - 1;
      if (isBorder) {
        return 1;
      }
      return Math.random() < obstacleChance ? 1 : 0;
    })
  );

  state.player = randomWalkablePoint();
  state.target = null;
  state.path = [];
  state.pathIndex = 0;
  statusText.textContent = 'Map regenerated.';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const pixelX = x * tileSize;
      const pixelY = y * tileSize;

      if (state.grid[y][x] === 1) {
        ctx.fillStyle = palette.wall;
        ctx.fillRect(pixelX, pixelY, tileSize, tileSize);
        ctx.strokeStyle = palette.wallEdge;
        ctx.strokeRect(pixelX + 2, pixelY + 2, tileSize - 4, tileSize - 4);
      } else {
        ctx.fillStyle = palette.floor;
        ctx.fillRect(pixelX, pixelY, tileSize, tileSize);
      }

      if (state.showGrid) {
        ctx.strokeStyle = palette.grid;
        ctx.lineWidth = 1;
        ctx.strokeRect(pixelX, pixelY, tileSize, tileSize);
      }
    }
  }

  if (state.path.length > 0) {
    for (let i = state.pathIndex; i < state.path.length; i += 1) {
      const node = state.path[i];
      ctx.fillStyle = palette.path;
      ctx.globalAlpha = 0.45;
      ctx.fillRect(node.x * tileSize + 8, node.y * tileSize + 8, tileSize - 16, tileSize - 16);
      ctx.globalAlpha = 1;
    }
  }

  if (state.target) {
    ctx.fillStyle = palette.target;
    ctx.beginPath();
    ctx.arc(
      state.target.x * tileSize + tileSize / 2,
      state.target.y * tileSize + tileSize / 2,
      tileSize / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = palette.player;
  ctx.beginPath();
  ctx.arc(
    state.player.x * tileSize + tileSize / 2,
    state.player.y * tileSize + tileSize / 2,
    tileSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function tick() {
  if (state.pathIndex < state.path.length) {
    const next = state.path[state.pathIndex];
    state.player = { ...next };
    state.pathIndex += 1;

    if (state.pathIndex >= state.path.length) {
      statusText.textContent = `Arrived at (${state.player.x}, ${state.player.y}).`;
    }
  }

  draw();
  requestAnimationFrame(tick);
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * cols);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * rows);

  if (x < 0 || y < 0 || x >= cols || y >= rows) {
    return;
  }

  if (state.grid[y][x] === 1) {
    statusText.textContent = 'Blocked tile selected. Choose a walkable tile.';
    return;
  }

  const path = findPath(state.grid, state.player, { x, y });
  if (!path || path.length <= 1) {
    statusText.textContent = 'No route found.';
    return;
  }

  state.target = { x, y };
  state.path = path.slice(1);
  state.pathIndex = 0;
  statusText.textContent = `Path found: ${state.path.length} steps.`;
}

canvas.addEventListener('click', handleClick);
document.querySelector('#regen').addEventListener('click', generateGrid);
document.querySelector('#toggle-grid').addEventListener('click', () => {
  state.showGrid = !state.showGrid;
});

generateGrid();
requestAnimationFrame(tick);
