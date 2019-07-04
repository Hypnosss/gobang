var btnReset = document.getElementById("button1");
var btnRetract = document.getElementById("button2");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const canvasWidth = 800;
const canvasHeight = 800;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
var blackOrWhite, someoneWins;
var grid = [];
var oldRows = [], oldColumns = [];

function init() {
  someoneWins = 0;
  blackOrWhite = 0;
  initChessboard();
  initGrid();
}

function drawLine(x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawCircle(x, y, radius) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  ctx.fill();
}

function initChessboard() {
  ctx.fillStyle = "#fbcf7e";
  ctx.fillRect(0, 0, 800, 800);
  for(let i = 1; i <= 15; i++) {
    drawLine(i * 50, 50, i * 50, 750);
    drawLine(50, i * 50, 750, i * 50);
  }
  ctx.fillStyle = "#000000";
  drawCircle(200,200, 5);
  drawCircle(200,600, 5);
  drawCircle(600,600, 5);
  drawCircle(600,200, 5);
  drawCircle(400,400, 5);
}

function initGrid() {
  for(let i = 0 ; i < 15; i++) {
    grid[i] = [];
    for(let j = 0; j < 15; j++) {
      grid[i][j] = -1;
    }
  }  
}

function playChess(x, y, column, row) {
  if(x <= 25 || x >= 775 || y <= 25 || y >= 775) {
  } else {
    var truex = 50 * column;
    var truey = 50 * row;
  }
  if(grid[row - 1][column - 1] == -1) {
    grid[row - 1][column - 1] = blackOrWhite;
    var gradient = ctx.createLinearGradient(truex + 10, truey + 10, truex - 10, truey - 10);
    if(!blackOrWhite) {
      gradient.addColorStop(0,"#000000");
      gradient.addColorStop(1,"#333333");
      ctx.fillStyle = gradient;
      blackOrWhite = 1;
      drawCircle(truex, truey, 20);
    } else {
      gradient.addColorStop(0,"#cccccc");
      gradient.addColorStop(1,"#ffffff");
      ctx.fillStyle = gradient;
      blackOrWhite = 0;
      drawCircle(truex, truey, 20);
    }
  }
}

function isWin(x, y, grid, n, numbersToWin) {//numbersToWin代表胜利所需连续子数
  var u = 0, d = 0, l = 0, r = 0, ul = 0, ur = 0, dl = 0, dr = 0;
  while (y - u >= 0) {
    if (grid[x][y - u] == grid[x][y]) {
      u++;
    } else {
      break;
    }
  }
  while (y + d <= n - 1) {
    if (grid[x][y + d] == grid[x][y]) {
      d++;
    } else {
      break;
    }
  }
  if (d + u == numbersToWin + 1) {
    return true;
  }

  while (x - l >= 0) {
    if (grid[x - l][y] == grid[x][y]) {
      l++;
    } else {
      break;
    }
  }
  while (x + r <= n - 1) {
    if (grid[x + r][y] == grid[x][y]) {
      r++;
    } else {
      break;
    }
  }
  if (l + r == numbersToWin + 1) {
    return true;
  }

  while(x - ul >= 0 && y - ul >= 0) {
    if(grid[x - ul][y - ul] == grid[x][y]) {
      ul++;
    } else {
      break;
    }
  }
  while(x + dr <= n - 1 && y + dr <= n - 1) {
    if(grid[x + dr][y + dr] == grid[x][y]) {
      dr++;
    } else {
      break;
    }
  }
  if (ul + dr == numbersToWin + 1) {
    return true;
  }

  while(x + ur <= n - 1 && y - ur >= 0) {
    if(grid[x + ur][y - ur] == grid[x][y]) {
      ur++;
    } else {
      break;
    }
  }
  while(x - dl >= 0 && y + dl <= n - 1) {
    if(grid[x - dl][y + dl] == grid[x][y]) {
      dl++;
    } else {
      break;
    }
  }
  if (ur + dl == numbersToWin + 1) {
    return true;
  }

  return false;
}

function retractChess() {
  oldRow = oldRows.pop();
  oldColumn = oldColumns.pop();
  ctx.fillStyle = "#fbcf7e";
  drawCircle(oldColumn*50, oldRow*50, 21);
  ctx.fillStyle = "#000000";
  var x1 = (oldColumn == 1)? (oldColumn * 50) : (oldColumn * 50 - 21);
  var x2 = (oldColumn == 15)? (oldColumn * 50) : (oldColumn * 50 + 21);
  var y = oldRow * 50;
  var y1 = (oldRow == 1) ? (oldRow * 50) : (oldRow * 50 - 21);
  var y2 = (oldRow == 15) ? (oldRow * 50) : (oldRow * 50 + 21);
  var x = oldColumn * 50;
  drawLine(x1, y, x2, y);
  drawLine(x, y1, x, y2);
  if(oldRow + oldColumn == 16 || oldRow == oldColumn) {
    if(oldRow == 4 || oldRow == 8 || oldRow == 12) {
      drawCircle(oldColumn * 50, oldRow * 50, 5);
    }
  }
  grid[oldRow - 1][oldColumn - 1] = -1;
  blackOrWhite = 1 - blackOrWhite;
}

init();

canvas.onclick = function(e) {
  if(!someoneWins) {
    var x = e.offsetX;
    var y = e.offsetY;
    var column = (x % 50 < 25) ? Math.floor(x / 50) : Math.ceil(x / 50);
    var row = (y % 50 < 25) ? Math.floor(y / 50) : Math.ceil(y / 50);
    oldColumns[oldColumns.length] = column;
    oldRows[oldRows.length] = row;
    playChess(x, y, column, row);
    if(isWin(row - 1, column - 1, grid, 15, 5)) {
      console.log(((blackOrWhite?"black":"white") + " wins!!!!"));
      someoneWins = 1;
    }
  }  
}

btnReset.onclick = function() {
  init();
} 

btnRetract.onclick = function() {
  if(!someoneWins && oldRows.length > 0) {
    retractChess();
  }
}