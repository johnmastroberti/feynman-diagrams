var _nextID = 0;
function newID() {
  _nextID++;
  return _nextID;
}

function mouseEventToCanvasCoords(canvas, evt) {
  let bRect = canvas.getBoundingClientRect();
  let mx = (evt.clientX - bRect.left) * (canvas.width / bRect.width);
  let my = (evt.clientY - bRect.top) * (canvas.height / bRect.height);
  return { x: mx, y: my };
}

function selectedVertexIx(coords) {
  const isHit = function (v) {
    const dx = v.x - coords.x;
    const dy = v.y - coords.y;
    const R = v.drawRadius();
    return dx * dx + dy * dy <= R * R;
  };
  return vertices.findIndex(isHit);
}

function selectedEdgeIx(coords) {
  const isHit = function (e) {
    const eVec = e.toVec();
    let rCoords = e.getRelativeCoordsOf(coords);
    if (!e.curve) {
      return (
        rCoords.x > 0 &&
        rCoords.x < eVec.len() &&
        Math.abs(rCoords.y) < e.selectWidth
      );
    } else {
      rCoords.x -= eVec.len() / 2;
      const ang = rCoords.angle();
      return (
        ang > 0 &&
        ang < Math.PI &&
        Math.abs(rCoords.len() - eVec.len() / 2) < e.selectWidth
      );
    }
  };
  return edges.findIndex(isHit);
}

function selectedLabelIx(coords) {
  const isHit = function (lab) {
    const dx = coords.x - lab.x;
    const dy = coords.y - lab.y;
    return dx > -5 && dy > -5 && dx < lab.w + 5 && dy < lab.h + 5;
  };
  return labels.findIndex(isHit);
}

function determineSelection(coords) {
  // Checks if the coords hit a vertex, edge, or label
  let ixx = selectedVertexIx(coords);
  if (ixx != -1) return { type: "vertex", ix: ixx };
  ixx = selectedEdgeIx(coords);
  if (ixx != -1) return { type: "edge", ix: ixx };
  ixx = selectedLabelIx(coords);
  if (ixx != -1) return { type: "label", ix: ixx };
  return { type: "none", ix: -1 };
}

function clamp(x, minx, maxx) {
  if (x < minx) return minx;
  if (x > maxx) return maxx;
  return x;
}

function changeSelection(id) {
  globalSelectedID = id;
  updateStyleElement();
  drawScreen();
}

function makeAllElementsProper() {
  for (let i in vertices) vertices[i] = makeProperVertex(vertices[i]);
  for (let i in edges) edges[i] = makeProperEdge(edges[i]);
  for (let i in labels) labels[i] = makeProperLabel(labels[i]);
}
