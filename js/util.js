var _nextID = 0;
function newID() {
  _nextID++;
  return _nextID;
}

function mouseEventToCanvasCoords(canvas, evt) {
  let bRect = canvas.getBoundingClientRect();
  let mx = (evt.clientX - bRect.left)*(canvas.width/bRect.width);
  let my = (evt.clientY - bRect.top)*(canvas.height/bRect.height);
  return {x: mx, y: my}
}

function selectedVertexIx(coords) {
  const isHit = function(v) {
    dx = v.x - coords.x;
    dy = v.y - coords.y;
    return dx*dx + dy*dy <= v.r*v.r;
  };
  return vertices.findIndex(isHit);
}

function selectedEdgeIx(coords) {
  return -1; // TODO
}

function clamp(x, minx, maxx) {
  if (x < minx) return minx;
  if (x > maxx) return maxx;
  return x;
}
