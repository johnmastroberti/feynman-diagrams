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
  const isHit = function(e) {
    // Break coordinates into component along edge and
    // in perpendicular direction
    // eVec points from v1 to v2
    const v1 = vertices.find(v => v.id == e.v1); // v1 and v2 are the vertex IDs
    const v2 = vertices.find(v => v.id == e.v2);
    if (v1 === undefined || v2 === undefined) return false;
    // console.log("v1: ", v1);
    // console.log("v2: ", v2);
    const eVec = {x: v2.x-v1.x, y: v2.y-v1.y};
    const eLen = Math.sqrt(eVec.x**2 + eVec.y**2);
    const eUnitVec = {x: eVec.x/eLen, y: eVec.y/eLen};

    const relCoords = {x: coords.x-v1.x, y: coords.y-v1.y};
    const cLen2 = relCoords.x**2 + relCoords.y**2;

    const proj = relCoords.x*eUnitVec.x + relCoords.y*eUnitVec.y;
    const perp = Math.sqrt(cLen2 - proj**2);

    // console.log("eVec: ", eVec);
    // console.log("eLen: ", eLen);
    // console.log("eUnitVec: ", eUnitVec);
    // 
    // console.log("relCoords: ", relCoords);
    // console.log("cLen2: ", cLen2);
    // console.log("proj: ", proj);
    // console.log("perp: ", perp);

    const hit = proj >= 0 && proj <= eLen && perp <= e.selectWidth;
    // console.log("Edge", e, "is selected:", hit);
    return hit;
  };
  return edges.findIndex(isHit);
}

function clamp(x, minx, maxx) {
  if (x < minx) return minx;
  if (x > maxx) return maxx;
  return x;
}

function changeSelection(id) {
  globalSelectedID = id;
  updateStyleBar();
  drawScreen();
}
