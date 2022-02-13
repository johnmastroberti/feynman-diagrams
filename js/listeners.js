function newVertexListener(evt) {
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  vertices.push(new Vertex(coords.x, coords.y));
  drawScreen();
}

function moveVertexListener(evt) {
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  const selectedIx = selectedVertexIx(coords);
  if (selectedIx == -1) return;

  canvas.removeEventListener("mousedown", moveVertexListener, false);

  function dragHandler(devt) {
    const dcoords = mouseEventToCanvasCoords(canvas, devt);
    const r = vertices[selectedIx].r;
    vertices[selectedIx].x = clamp(dcoords.x, r, canvas.width-r);
    vertices[selectedIx].y = clamp(dcoords.y, r, canvas.height-r);
    drawScreen();
  }

  function upHandler(e) {
    canvas.removeEventListener("mousemove", dragHandler, false);
    canvas.removeEventListener("mouseup", upHandler, false);
    canvas.addEventListener("mousedown", moveVertexListener, false);
  }
  canvas.addEventListener("mousemove", dragHandler, false);
  canvas.addEventListener("mouseup", upHandler, false);
}

function deleteVertexListener(evt) {
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  const selectedIx = selectedVertexIx(coords);
  if (selectedIx == -1) return;
  vertices.splice(selectedIx, 1);
  drawScreen();
}

