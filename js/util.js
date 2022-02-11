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
