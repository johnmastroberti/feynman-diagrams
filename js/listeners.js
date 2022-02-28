function newVertexListener(evt) {
  // Just create a new vertex at the event location
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  vertices.push(new Vertex(coords.x, coords.y));
  drawScreen();
}

function moveSelectListener(evt) {
  // Determine what (if anything) was clicked on
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  // Check vertices first
  let selectedIx = selectedVertexIx(coords);
  if (selectedIx == -1) {
    // Fallback to edges
    selectedIx = selectedEdgeIx(coords);
    if (selectedIx == -1) return;
    globalSelectedID = edges[selectedIx].id;
    updateStyleBar();
    drawScreen();
    return;
  } 
  globalSelectedID = vertices[selectedIx].id;
  updateStyleBar();
  drawScreen();

  function dragVertexHandler(devt) {
    // Move the selected vertex to the event location
    const dcoords = mouseEventToCanvasCoords(canvas, devt);
    const r = vertices[selectedIx].r;
    vertices[selectedIx].x = clamp(dcoords.x, r, canvas.width-r);
    vertices[selectedIx].y = clamp(dcoords.y, r, canvas.height-r);
    drawScreen();
    updateStyleBar();
  }

  function upHandler(e) {
    // Reset handlers
    canvas.removeEventListener("mousemove", dragVertexHandler, false);
    canvas.removeEventListener("mouseup", upHandler, false);
    canvas.addEventListener("mousedown", moveSelectListener, false);
  }

  // Switch to dragging mode
  canvas.removeEventListener("mousedown", moveSelectListener, false);
  canvas.addEventListener("mousemove", dragVertexHandler, false);
  canvas.addEventListener("mouseup", upHandler, false);
}

function deleteVertexListener(evt) {
  // Determine if a vertex was selected, and remove it from the list
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  const selectedIx = selectedVertexIx(coords);
  if (selectedIx == -1) return;
  vertices.splice(selectedIx, 1);
  drawScreen();
}

function findOrMakeVertex(evt) {
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  let selectedIx = selectedVertexIx(coords);
  if (selectedIx != -1) {
    return selectedIx;
  }
  else {
    newVertexListener(evt);
    return vertices.length - 1;
  }
}

function newEdgeListener(evt) {
  // Find the first vertex
  let canvas = document.getElementById("drawingArea");
  const coords1 = mouseEventToCanvasCoords(canvas, evt);
  const ix1 = findOrMakeVertex(evt);
  drawScreen();

  // Add a new handler to find the second vertex and create the edge
  function newEdgeV2Listener(evt2) {
    const ix2 = findOrMakeVertex(evt2);
    edges.push(new Edge(vertices[ix1].id, vertices[ix2].id), "line");
    drawScreen();
    canvas.removeEventListener("mousedown", newEdgeV2Listener, false);
    canvas.addEventListener("mousedown", newEdgeListener, false);
  }

  canvas.removeEventListener("mousedown", newEdgeListener, false);
  canvas.addEventListener("mousedown", newEdgeV2Listener, false);
}
