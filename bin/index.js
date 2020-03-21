'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var ReactDOM = require('react-dom');
var useState = React.useState,
    useEffect = React.useEffect,
    useMemo = React.useMemo;


var greenConfig = {
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
  onClick: function onClick(ev) {
    var cellWidth = width / config.gridWidth;
    var cellHeight = height / config.gridHeight;
    var gridX = Math.floor(ev.clientX / cellWidth);
    var gridY = Math.floor(ev.clientY / cellHeight);
    grid[gridX][gridY] = 1;
  },
  noiseFn: function noiseFn(x, y, width, height, noiseRate, nextAlive) {
    if (y == 0 && Math.random() < noiseRate
    // y == 2 && Math.random() < noiseRate / 2
    ) {
        return 1;
      }
    return nextAlive;
  }
};

var redConfig = {
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
  onClick: function onClick(ev) {
    var cellWidth = width / config.gridWidth;
    var cellHeight = height / config.gridHeight;
    var gridX = Math.floor(ev.clientX / cellWidth);
    var gridY = Math.floor(ev.clientY / cellHeight);
    grid[gridX][gridY] = 1;
  },
  noiseFn: function noiseFn(x, y, width, height, noiseRate, nextAlive) {
    if (y == height - 1 && Math.random() < noiseRate || y == height - 2 && Math.random() < noiseRate / 2) {
      return 1;
    }
    return nextAlive;
  }
};

function App(props) {
  // const {config} = props;
  var _document$getElementB = document.getElementById('container').getBoundingClientRect(),
      width = _document$getElementB.width,
      height = _document$getElementB.height;

  var _useState = useState(function () {
    return _extends({}, props.config, {
      gridWidth: width > height ? props.config.gridHeight : props.config.gridWidth,
      gridHeight: width > height ? props.config.gridWidth : props.config.gridHeight
    });
  }),
      _useState2 = _slicedToArray(_useState, 2),
      config = _useState2[0],
      setConfig = _useState2[1];

  var _useState3 = useState(initGrid(config.gridWidth, config.gridHeight)),
      _useState4 = _slicedToArray(_useState3, 2),
      grid = _useState4[0],
      setGrid = _useState4[1];

  useEffect(function () {
    var interval = setInterval(function () {
      setGrid(function (grid) {
        return advanceGrid(grid, config);
      });
    }, config.msPerTick);
    return function () {
      return clearInterval(interval);
    };
  }, [config.gridWidth]);

  var cells = [];
  for (var x = 0; x < config.gridWidth; x++) {
    for (var y = 0; y < config.gridHeight; y++) {
      cells.push(React.createElement(Cell, {
        key: 'cell_' + x + '_' + y,
        config: config,
        x: x, y: y, alive: grid[x][y]
      }));
    }
  }

  return React.createElement(
    'div',
    {
      style: {
        width: width,
        height: height,
        backgroundColor: config.backgroundColor,
        position: 'relative'
      },
      onClick: config.onClick
    },
    cells
  );
}

function Cell(props) {
  var x = props.x,
      y = props.y,
      alive = props.alive,
      config = props.config;

  var _document$getElementB2 = document.getElementById('container').getBoundingClientRect(),
      width = _document$getElementB2.width,
      height = _document$getElementB2.height;

  var gridWidth = config.gridWidth,
      gridHeight = config.gridHeight,
      cellColor = config.cellColor;


  var cellWidth = width / gridWidth;
  var cellHeight = height / gridHeight;
  // const backgroundColor = 'rgba(255, 0, 0, ' + alive + ')';
  var color = cellColor;
  if (alive > 50) {
    color = "#D2691E";
  }
  return React.createElement('div', {
    style: {
      position: 'absolute',
      backgroundColor: color,
      top: cellHeight * y,
      left: cellWidth * x,
      width: cellWidth,
      height: cellHeight,
      opacity: alive
    }
  });
}

function advanceGrid(grid, config) {
  // const width = grid.length;
  // const height = grid[0].length;
  var width = config.gridWidth;
  var height = config.gridHeight;
  var nextGrid = [];
  for (var x = 0; x < width; x++) {
    var nextCol = [];
    for (var y = 0; y < height; y++) {
      var alive = grid[x][y];
      var numAliveNeighbors = getNumAliveNeighbors(grid, x, y);
      var nextAlive = alive;
      if (alive >= 1 && alive <= 250) {
        var liveMax = alive < 50 ? config.liveMax : config.liveMax + 3;
        nextAlive = numAliveNeighbors < config.liveMin || numAliveNeighbors > config.liveMax ? Math.min(alive - config.decayRate, 0.99) : alive + 1;
      } else {
        nextAlive = numAliveNeighbors < config.deadMin || numAliveNeighbors > config.deadMax ? Math.min(0.99, alive - config.decayRate) : 1;
      }
      // Noise
      nextAlive = config.noiseFn(x, y, width, height, config.noiseRate, nextAlive);
      nextCol.push(Math.max(0, nextAlive));
    }
    nextGrid.push(nextCol);
  }

  return nextGrid;
}

function initGrid(width, height) {
  var grid = [];
  for (var x = 0; x < width; x++) {
    var col = [];
    for (var y = 0; y < height; y++) {
      col.push(0);
    }
    grid.push(col);
  }
  return grid;
}

function getNumAliveNeighbors(grid, x, y) {
  var sum = 0;
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      if (i == 0 && j == 0) continue;
      if (x + i >= grid.length || y + j >= grid[x].length) continue;
      if (x + i < 0 || y + j < 0) continue;
      // sum += grid[x + i][y + j] == 1 ? 1 : 0;
      var val = grid[x + i][y + j];
      if (val > 1) {
        val = 1;
      }
      sum += val;
    }
  }
  return sum;
}

ReactDOM.render(React.createElement(App, { config: greenConfig }), document.getElementById('container'));