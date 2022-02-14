function drawScreen() {
  let canvas = document.getElementById("drawingArea");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (v of vertices) drawVertex(ctx, v);
  for (e of edges) drawEdge(ctx, e);
}

function drawVertex(ctx, v) {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(v.x, v.y, v.r, 0, 2*Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

function drawEdge(ctx, e) {
  const v1 = vertices.find(vert => vert.id == e.v1);
  const v2 = vertices.find(vert => vert.id == e.v2);
  if (!v1 || !v2) {
    edges.splice(edges.indexOf(e), 1);
    return;
  }

  ctx.fillStyle = "#000000";
  ctx.lineWidth = "3";
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

