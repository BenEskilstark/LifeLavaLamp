
const React = require('react');
const ReactDOM = require('react-dom');
const {useState, useEffect, useMemo} = React;

const greenConfig = {
  gridWidth: 60,
  gridHeight: 85,
  msPerTick: 100,
  liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
  liveMax: 5, // if alive, must have at most this many live neighbors to stay alive
  deadMin: 3, // if dead, must have at least this many live neighbors to become alive
  deadMax: 3, // if dead, must have at most this many live neighbors to become alive
  noiseRate: 0.2,
  backgroundColor: 'black',
  cellColor: '#6B8E23',
  decayRate: 0.06,
  onClick: (ev) => {
    const cellWidth = width / config.gridWidth;
    const cellHeight = height / config.gridHeight;
    const gridX = Math.floor(ev.clientX / cellWidth);
    const gridY = Math.floor(ev.clientY / cellHeight);
    grid[gridX][gridY] = 1;
  },
  noiseFn: (x, y, width, height, noiseRate, nextAlive) => {
    if (
      y == 0 && Math.random() < noiseRate
      // y == 2 && Math.random() < noiseRate / 2
    ) {
      return 1;
    }
    return nextAlive;
  },
};

const redConfig = {
  gridWidth: 50,
  gridHeight: 70,
  msPerTick: 100,
  liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
  liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
  deadMin: 3, // if dead, must have at least this many live neighbors to become alive
  deadMax: 3, // if dead, must have at most this many live neighbors to become alive
  noiseRate: 0.4,
  backgroundColor: 'black',
  cellColor: 'red',
  decayRate: 0.01,
  onClick: (ev) => {
    const cellWidth = width / config.gridWidth;
    const cellHeight = height / config.gridHeight;
    const gridX = Math.floor(ev.clientX / cellWidth);
    const gridY = Math.floor(ev.clientY / cellHeight);
    grid[gridX][gridY] = 1;
  },
  noiseFn: (x, y, width, height, noiseRate, nextAlive) => {
    if (
      y == height - 1 && Math.random() < noiseRate ||
      y == height - 2 && Math.random() < noiseRate / 2
    ) {
      return 1;
    }
    return nextAlive;
  },
};



function App(props) {
  // const {config} = props;
  const {width, height} = document
    .getElementById('container')
    .getBoundingClientRect();

  const [config, setConfig] = useState(() => {
    return {
      ...props.config,
      gridWidth: width > height ? props.config.gridHeight : props.config.gridWidth,
      gridHeight: width > height ? props.config.gridWidth : props.config.gridHeight,
    };
  });

  const [grid, setGrid] = useState(initGrid(config.gridWidth, config.gridHeight));

  useEffect(() => {
    const interval = setInterval(
      () => {
        setGrid(grid => advanceGrid(grid, config));
      },
      config.msPerTick,
    );
    return () => clearInterval(interval);
  }, [config.gridWidth]);

  const cells = [];
  for (let x = 0; x < config.gridWidth; x++) {
    for (let y = 0; y < config.gridHeight; y++) {
      cells.push(<Cell
        key={'cell_' + x + '_' + y}
        config={config}
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
      onClick={config.onClick}
    >
      {cells}
    </div>
  );
}

function Cell(props) {
  const {x, y, alive, config} = props;
  const {width, height} = document
    .getElementById('container')
    .getBoundingClientRect();
  const {gridWidth, gridHeight, cellColor} = config;

  const cellWidth = width / gridWidth;
  const cellHeight = height / gridHeight;
  // const backgroundColor = 'rgba(255, 0, 0, ' + alive + ')';
  let color = cellColor;
  if (alive > 50) {
    color = "#D2691E";
  }
  return (
    <div
      style={{
        position: 'absolute',
        backgroundColor: color,
        top: cellHeight * y,
        left: cellWidth * x,
        width: cellWidth,
        height: cellHeight,
        opacity: alive,
      }}
    >
    </div>
  );
}

function advanceGrid(grid, config) {
  // const width = grid.length;
  // const height = grid[0].length;
  const width = config.gridWidth;
  const height = config.gridHeight;
  const nextGrid = [];
  for (let x = 0; x < width; x++) {
    const nextCol = [];
    for (let y = 0; y < height; y++) {
      const alive = grid[x][y];
      const numAliveNeighbors = getNumAliveNeighbors(grid, x, y);
      let nextAlive = alive;
      if (alive >= 1 && alive <= 250) {
        const liveMax = alive < 50 ? config.liveMax : config.liveMax + 3;
        nextAlive = (
          numAliveNeighbors < config.liveMin ||
          numAliveNeighbors > config.liveMax
        ) ? Math.min(alive - config.decayRate, 0.99) : alive + 1;
      } else {
        nextAlive = (
          numAliveNeighbors < config.deadMin ||
          numAliveNeighbors > config.deadMax
        ) ? Math.min(0.99, alive - config.decayRate) : 1;
      }
      // Noise
      nextAlive = config.noiseFn(
        x, y, width, height,
        config.noiseRate, nextAlive,
      );
      nextCol.push(Math.max(0, nextAlive));
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
      // sum += grid[x + i][y + j] == 1 ? 1 : 0;
      let val = grid[x + i][y + j];
      if (val > 1) {
        val = 1;
      }
      sum += val;
    }
  }
  return sum;
}





ReactDOM.render(
  <App config={greenConfig} />,
  document.getElementById('container'),
);
