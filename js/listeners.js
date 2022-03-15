function newVertexListener(evt) {
  // Just create a new vertex at the event location
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  vertices.push(new Vertex(coords.x, coords.y));
  changeSelection(vertices[vertices.length - 1].id);
  snapVerticesToGrid();
  drawScreen();
}

function newLabelListener(evt) {
  // Just create a new label at the event location
  let canvas = document.getElementById("drawingArea");
  const coords = mouseEventToCanvasCoords(canvas, evt);
  labels.push(new Label(coords.x, coords.y));
  changeSelection(labels[labels.length - 1].id);
}

function moveSelectListener(evt) {
  // Determine what (if anything) was clicked on
  let canvas = $("#drawingArea")[0];
  const coords = mouseEventToCanvasCoords(canvas, evt);
  const selection = determineSelection(coords);

  let grabOffset = coords;
  switch (selection.type) {
    case "edge":
      changeSelection(edges[selection.ix].id);
      return;
    case "vertex":
      changeSelection(vertices[selection.ix].id);
      grabOffset.x -= vertices[selection.ix].x;
      grabOffset.y -= vertices[selection.ix].y;
      break;
    case "label":
      changeSelection(labels[selection.ix].id);
      grabOffset.x -= labels[selection.ix].x;
      grabOffset.y -= labels[selection.ix].y;
      break;
    case "none":
    default:
      changeSelection(-1);
      return;
  }

  function dragHandler(devt) {
    // Move the selected vertex/label to the event location
    const dcoords = mouseEventToCanvasCoords(canvas, devt);
    if (selection.type == "vertex") {
      const r = vertices[selection.ix].r;
      vertices[selection.ix].x = clamp(
        dcoords.x - grabOffset.x,
        r,
        canvas.width - r
      );
      vertices[selection.ix].y = clamp(
        dcoords.y - grabOffset.y,
        r,
        canvas.height - r
      );
    }
    if (selection.type == "label") {
      const w = labels[selection.ix].img.width;
      const h = labels[selection.ix].img.height;
      labels[selection.ix].x = clamp(
        dcoords.x - grabOffset.x,
        5,
        canvas.width - w - 5
      );
      labels[selection.ix].y = clamp(
        dcoords.y - grabOffset.y,
        5,
        canvas.height - h - 5
      );
    }
    drawScreen();
    updateStyleElement();
  }

  function upHandler(e) {
    // Reset handlers
    canvas.removeEventListener("mousemove", dragHandler, false);
    canvas.removeEventListener("mouseup", upHandler, false);
    canvas.addEventListener("mousedown", moveSelectListener, false);
    snapVerticesToGrid();
    updateStyleElement();
    drawScreen();
  }

  // Switch to dragging mode
  canvas.removeEventListener("mousedown", moveSelectListener, false);
  canvas.addEventListener("mousemove", dragHandler, false);
  canvas.addEventListener("mouseup", upHandler, false);
}

function deleteListener(evt) {
  // Determine if a vertex or label was selected, and remove it from the list
  let canvas = $("#drawingArea")[0];
  const coords = mouseEventToCanvasCoords(canvas, evt);
  const selection = determineSelection(coords);
  switch (selection.type) {
    case "vertex":
      vertices.splice(selection.ix, 1);
      break;
    case "edge":
      edges.splice(selection.ix, 1);
      break;
    case "label":
      labels.splice(selection.ix, 1);
      break;
  }
  drawScreen();
}

function findOrMakeVertex(evt) {
  let canvas = $("#drawingArea")[0];
  const coords = mouseEventToCanvasCoords(canvas, evt);
  let selectedIx = selectedVertexIx(coords);
  if (selectedIx != -1) {
    return selectedIx;
  } else {
    newVertexListener(evt);
    return vertices.length - 1;
  }
}

function newEdgeListener(evt) {
  // Find the first vertex
  let canvas = $("#drawingArea")[0];
  const coords1 = mouseEventToCanvasCoords(canvas, evt);
  const ix1 = findOrMakeVertex(evt);
  drawScreen();

  // Add a new handler to find the second vertex and create the edge
  function newEdgeV2Listener(evt2) {
    const ix2 = findOrMakeVertex(evt2);
    edges.push(new Edge(vertices[ix1].id, vertices[ix2].id));
    changeSelection(edges[edges.length - 1].id);
    drawScreen();
    canvas.removeEventListener("mousedown", newEdgeV2Listener, false);
    canvas.addEventListener("mousedown", newEdgeListener, false);
  }

  canvas.removeEventListener("mousedown", newEdgeListener, false);
  canvas.addEventListener("mousedown", newEdgeV2Listener, false);
}
