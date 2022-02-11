function drawScreen(ctx, vertices, edges) {
  for (v of vertices)
    drawVertex(ctx, v);
  for (e of edges)
    drawEdge(ctx, e);
}

function drawVertex(ctx, v) {
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(v.x, v.y, v.r, 0, 2*Math.PI, false);
  ctx.closePath();
  ctx.fill();
}
