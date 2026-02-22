const cardinalSteps = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

function key(point) {
  return `${point.x},${point.y}`;
}

function heuristic(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  while (cameFrom.has(key(current))) {
    current = cameFrom.get(key(current));
    path.push(current);
  }
  return path.reverse();
}

export function findPath(grid, start, goal) {
  if (grid[goal.y]?.[goal.x] === 1 || grid[start.y]?.[start.x] === 1) {
    return null;
  }

  const open = [start];
  const openSet = new Set([key(start)]);
  const cameFrom = new Map();

  const gScore = new Map([[key(start), 0]]);
  const fScore = new Map([[key(start), heuristic(start, goal)]]);

  while (open.length > 0) {
    let currentIndex = 0;
    for (let i = 1; i < open.length; i += 1) {
      if ((fScore.get(key(open[i])) ?? Infinity) < (fScore.get(key(open[currentIndex])) ?? Infinity)) {
        currentIndex = i;
      }
    }

    const current = open[currentIndex];
    if (current.x === goal.x && current.y === goal.y) {
      return reconstructPath(cameFrom, current);
    }

    open.splice(currentIndex, 1);
    openSet.delete(key(current));

    for (const delta of cardinalSteps) {
      const neighbor = { x: current.x + delta.x, y: current.y + delta.y };
      if (
        neighbor.x < 0 ||
        neighbor.y < 0 ||
        neighbor.y >= grid.length ||
        neighbor.x >= grid[0].length ||
        grid[neighbor.y][neighbor.x] === 1
      ) {
        continue;
      }

      const currentG = gScore.get(key(current)) ?? Infinity;
      const tentativeG = currentG + 1;
      const neighborKey = key(neighbor);

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeG);
        fScore.set(neighborKey, tentativeG + heuristic(neighbor, goal));
        if (!openSet.has(neighborKey)) {
          open.push(neighbor);
          openSet.add(neighborKey);
        }
      }
    }
  }

  return null;
}
