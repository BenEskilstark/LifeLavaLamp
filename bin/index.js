'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var React = require('react');
var ReactDOM = require('react-dom');
var useState = React.useState,
    useEffect = React.useEffect,
    useMemo = React.useMemo;


var config = {
  gridWidth: 50,
  gridHeight: 70,
  msPerTick: 100,
  liveMin: 2, // if alive, must have at least this many live neighbors to stay alive
  liveMax: 3, // if alive, must have at most this many live neighbors to stay alive
  deadMin: 3, // if dead, must have at least this many live neighbors to become alive
  deadMax: 3, // if dead, must have at most this many live neighbors to become alive
  noiseRate: 0.4,
  backgroundColor: 'black',
  decayRate: 0.01
};

function App() {
  var _document$getElementB = document.getElementById('container').getBoundingClientRect(),
      width = _document$getElementB.width,
      height = _document$getElementB.height;

  var _useState = useState(initGrid(config.gridWidth, config.gridHeight)),
      _useState2 = _slicedToArray(_useState, 2),
      grid = _useState2[0],
      setGrid = _useState2[1];

  useEffect(function () {
    var interval = setInterval(function () {
      setGrid(function (grid) {
        return advanceGrid(grid);
      });
    }, config.msPerTick);
    return function () {
      return clearInterval(interval);
    };
  }, []);

  var cells = [];
  for (var x = 0; x < config.gridWidth; x++) {
    for (var y = 0; y < config.gridHeight; y++) {
      cells.push(React.createElement(Cell, {
        key: 'cell_' + x + '_' + y,
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
      onClick: function onClick(ev) {
        var cellWidth = width / config.gridWidth;
        var cellHeight = height / config.gridHeight;
        var gridX = Math.floor(ev.clientX / cellWidth);
        var gridY = Math.floor(ev.clientY / cellHeight);
        grid[gridX][gridY] = 1;
      }
    },
    cells
  );
}

function Cell(props) {
  var x = props.x,
      y = props.y,
      alive = props.alive;

  var _document$getElementB2 = document.getElementById('container').getBoundingClientRect(),
      width = _document$getElementB2.width,
      height = _document$getElementB2.height;

  var gridWidth = config.gridWidth,
      gridHeight = config.gridHeight;


  var cellWidth = width / gridWidth;
  var cellHeight = height / gridHeight;
  var backgroundColor = 'rgba(255, 0, 0, ' + alive + ')';
  return React.createElement('div', {
    style: {
      position: 'absolute',
      backgroundColor: backgroundColor,
      top: cellHeight * y,
      left: cellWidth * x,
      width: cellWidth,
      height: cellHeight
    }
  });
}

function advanceGrid(grid) {
  var width = grid.length;
  var height = grid[0].length;
  var nextGrid = [];
  for (var x = 0; x < width; x++) {
    var nextCol = [];
    for (var y = 0; y < height; y++) {
      var alive = grid[x][y];
      var numAliveNeighbors = getNumAliveNeighbors(grid, x, y);
      var nextAlive = alive;
      if (alive == 1) {
        nextAlive = numAliveNeighbors < config.liveMin || numAliveNeighbors > config.liveMax ? alive - config.decayRate : 1;
      } else {
        nextAlive = numAliveNeighbors < config.deadMin || numAliveNeighbors > config.deadMax ? alive - config.decayRate : 1;
      }
      // Noise
      if (y == height - 1 && Math.random() < config.noiseRate || y == height - 2 && Math.random() < config.noiseRate / 2) {
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
      sum += grid[x + i][y + j] == 1 ? 1 : 0;
    }
  }
  return sum;
}

ReactDOM.render(React.createElement(App, null), document.getElementById('container'));