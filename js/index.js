
const React = require('react');
const ReactDOM = require('react-dom');
const {useState, useEffect, useMemo} = React;

const config = {
  gridWidth: 50,
  gridHeight: 70,
  msPerTick: 100,
  liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
  liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
  deadMin: 3, // if dead, must have at least this many live neighbors to become alive
  deadMax: 3, // if dead, must have at most this many live neighbors to become alive
  noiseRate: 0.4,
  backgroundColor: 'black',
  decayRate: 0.01,
};

function App() {
  const {width, height} = document
    .getElementById('container')
    .getBoundingClientRect();

  const [grid, setGrid] = useState(initGrid(config.gridWidth, config.gridHeight));

  useEffect(() => {
    const interval = setInterval(
      () => {
        setGrid(grid => advanceGrid(grid));
      },
      config.msPerTick,
    );
    return () => clearInterval(interval);
  }, []);

  const cells = [];
  for (let x = 0; x < config.gridWidth; x++) {
    for (let y = 0; y < config.gridHeight; y++) {
      cells.push(<Cell
        key={'cell_' + x + '_' + y}
        x={x} y={y} alive={grid[x][y]}
      />);
    }
  }

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: config.backgroundColor,
        position: 'relative',
      }}
      onClick={(ev) => {
        const cellWidth = width / config.gridWidth;
        const cellHeight = height / config.gridHeight;
        const gridX = Math.floor(ev.clientX / cellWidth);
        const gridY = Math.floor(ev.clientY / cellHeight);
        grid[gridX][gridY] = 1;
      }}
    >
      {cells}
    </div>
  );
}

function Cell(props) {
  const {x, y, alive} = props;
  const {width, height} = document
    .getElementById('container')
    .getBoundingClientRect();
  const {gridWidth, gridHeight} = config;

  const cellWidth = width / gridWidth;
  const cellHeight = height / gridHeight;
  const backgroundColor = 'rgba(255, 0, 0, ' + alive + ')';
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor,
        top: cellHeight * y,
        left: cellWidth * x,
        width: cellWidth,
        height: cellHeight,
      }}
    >
    </div>
  );
}

function advanceGrid(grid) {
  const width = grid.length;
  const height = grid[0].length;
  const nextGrid = [];
  for (let x = 0; x < width; x++) {
    const nextCol = [];
    for (let y = 0; y < height; y++) {
      const alive = grid[x][y];
      const numAliveNeighbors = getNumAliveNeighbors(grid, x, y);
      let nextAlive = alive;
      if (alive == 1) {
        nextAlive = (
          numAliveNeighbors < config.liveMin ||
          numAliveNeighbors > config.liveMax
        ) ? alive - config.decayRate : 1;
      } else {
        nextAlive = (
          numAliveNeighbors < config.deadMin ||
          numAliveNeighbors > config.deadMax
        ) ? alive - config.decayRate : 1;
      }
      // Noise
      if (
        y == height - 1 && Math.random() < config.noiseRate ||
        y == height - 2 && Math.random() < config.noiseRate / 2
      ) {
        nextAlive = 1;
      }
      nextAlive = Math.max(0, nextAlive);
      nextCol.push(nextAlive);
    }
    nextGrid.push(nextCol);
  }

  return nextGrid;
}

function initGrid(width, height) {
  const grid = [];
  for (let x = 0; x < width; x++) {
    const col = [];
    for (let y = 0; y < height; y++) {
      col.push(0);
    }
    grid.push(col);
  }
  return grid;
}

function getNumAliveNeighbors(grid, x, y) {
  let sum = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue;
      if (x + i >= grid.length || y + j >= grid[x].length) continue;
      if (x + i < 0 || y + j < 0) continue;
      sum += grid[x + i][y + j] == 1 ? 1 : 0;
    }
  }
  return sum;
}





ReactDOM.render(<App />, document.getElementById('container'));
