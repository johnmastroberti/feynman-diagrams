function drawScreen() {
  let canvas = document.getElementById("drawingArea");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (v of vertices) drawVertex(ctx, v);
  for (e of edges) drawEdge(ctx, e);
  for (lab of labels) drawLabel(ctx, lab);
}

function drawVertex(ctx, v) {
  if (!globalVerboseDrawing) return;
  if (v.id == globalSelectedID)
    ctx.fillStyle = "#00ff00";
  else
    ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(v.x, v.y, v.r, 0, 2*Math.PI, false);
  ctx.closePath();
  ctx.fill();
}

function drawLabel(ctx, lab) {
  if (lab.svgTag === null)
    return;

  if (lab.id == globalSelectedID)
    ctx.strokeStyle = "#00ff00";
  else
    ctx.strokeStyle = "#000000";

  if (globalVerboseDrawing)
    ctx.strokeRect(lab.x-5, lab.y-5, lab.w+10, lab.h+10);
  ctx.drawImage(lab.img, lab.x, lab.y, lab.w, lab.h);
}
