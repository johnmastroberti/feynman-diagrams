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

function moveVertexButton() {
  genericButton("Move Vertex", "mousedown", moveVertexListener);
}
  
function deleteVertexButton() {
  genericButton("Delete Vertex", "mousedown", deleteVertexListener);
}


function newEdgeButton() {
  genericButton("Add Edge", "mousedown", newEdgeListener);
}
