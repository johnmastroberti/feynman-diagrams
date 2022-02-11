window.addEventListener("load", runApp, false);

function runApp() {
  let canvas = document.getElementById("drawingArea");
  let drawingContext = canvas.getContext("2d");
  let vertices = [];
  let edges = [];

  canvas.addEventListener("mousedown", newVertex, false);

  drawScreen()

  function newVertex(evt) {
    const coords = mouseEventToCanvasCoords(evt);
    vertices.push(new Vertex(coords.x, coords.y));
    drawScreen();
  }
}
