function newVertexListener(evt) {
  // Just create a new vertex at the event location
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  vertices.push(new Vertex(coords.x, coords.y));
  drawScreen();
}

function moveVertexListener(evt) {
  // Determine if a vertex was clicked on
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  const selectedIx = selectedVertexIx(coords);
  if (selectedIx == -1) return;

  function dragHandler(devt) {
    // Move the selected vertex to the event location
    const dcoords = mouseEventToCanvasCoords(canvas, devt);
    const r = vertices[selectedIx].r;
    vertices[selectedIx].x = clamp(dcoords.x, r, canvas.width-r);
    vertices[selectedIx].y = clamp(dcoords.y, r, canvas.height-r);
    drawScreen();
  }

  function upHandler(e) {
    // Reset handlers
    canvas.removeEventListener("mousemove", dragHandler, false);
    canvas.removeEventListener("mouseup", upHandler, false);
    canvas.addEventListener("mousedown", moveVertexListener, false);
  }

  // Switch to dragging mode
  canvas.removeEventListener("mousedown", moveVertexListener, false);
  canvas.addEventListener("mousemove", dragHandler, false);
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
    console.log("Found vertex");
    return selectedIx;
  }
  else {
    console.log("Made new vertex");
    newVertexListener(evt);
    return vertices.length - 1;
  }
}

function newEdgeListener(evt) {
  // Find the first vertex
  let canvas = document.getElementById("drawingArea");
  const coords1 = mouseEventToCanvasCoords(canvas, evt);
  const ix1 = findOrMakeVertex(evt);
  console.log("Vertex 1 found");
  drawScreen();

  // Add a new handler to find the second vertex and create the edge
  function newEdgeV2Listener(evt2) {
    const ix2 = findOrMakeVertex(evt2);
    console.log("Vertex 2 found");
    edges.push(new Edge(vertices[ix1].id, vertices[ix2].id), "line");
    drawScreen();
    canvas.removeEventListener("mousedown", newEdgeV2Listener, false);
    canvas.addEventListener("mousedown", newEdgeListener, false);
    console.log("Exiting newEdgeV2Listener()");
  }

  canvas.removeEventListener("mousedown", newEdgeListener, false);
  canvas.addEventListener("mousedown", newEdgeV2Listener, false);
  console.log("Exiting newEdgeListener()");
}
