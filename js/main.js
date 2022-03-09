let vertices = [];
let edges = [];
let labels = [];
let globalSelectedID = -1;
let globalVerboseDrawing = true;

function initApp() {
  $("#toggleVerts")[0].checked = true;
  $("#toggleVerts")[0].onchange = toggleVertexDrawing;
  moveSelectButton();
}

window.onload = initApp;
