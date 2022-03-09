function clearCanvasListeners() {
  let canvas = document.getElementById("drawingArea");
  let newcanvas = canvas.cloneNode(true);
  canvas.parentNode.replaceChild(newcanvas, canvas);
  drawScreen();
}

function genericButton(stext, event, listener) {
  clearCanvasListeners();
  let canvas = document.getElementById("drawingArea");
  let status = document.getElementById("toolStatus");
  status.innerHTML = "Selected Tool: " + stext;
  canvas.addEventListener(event, listener, false);
}

function newVertexButton() {
  genericButton("Add Vertex", "mousedown", newVertexListener);
}

function moveSelectButton() {
  genericButton("Move/Select", "mousedown", moveSelectListener);
}
  
function deleteButton() {
  genericButton("Delete", "mousedown", deleteListener);
}

function newEdgeButton() {
  genericButton("Add Edge", "mousedown", newEdgeListener);
}

function newLabelButton() {
  genericButton("Add Label", "mousedown", newLabelListener);
}

function toggleVertexDrawing() {
  globalVerboseDrawing = !globalVerboseDrawing;
  drawScreen();
}
