let vertices = [];
let edges = [];
let labels = [];
let globalSelectedID = -1;
let globalVerboseDrawing = true;
let globalSnapToGrid = true;
let globalGrid = { rows: 16, cols: 32 };

function initApp() {
  moveSelectButton();
  updateStyleBar();
  drawScreen();
}

window.onload = initApp;
