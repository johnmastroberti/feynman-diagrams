function drawScreen() {
  let canvas = document.getElementById("drawingArea");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(ctx);
  for (e of edges) drawEdge(ctx, e);
  for (v of vertices) drawVertex(ctx, v);
  for (lab of labels) drawLabel(ctx, lab);
}

function drawGrid(ctx) {
  if (!globalSnapToGrid) return;

  let canvas = document.getElementById("drawingArea");
  const W = canvas.width;
  const H = canvas.height;
  const dW = W / globalGrid.cols;
  const dH = H / globalGrid.rows;

  ctx.lineWidth = "1";
  ctx.strokeStyle = "#888888";
  ctx.setLineDash([5,5]);
  // draw the rows
  for (let i = 0; i<globalGrid.rows; i++) {
    const y = (i+0.5) * dH;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  // draw the columns
  for (let i = 0; i<globalGrid.cols; i++) {
    const x = (i+0.5) * dW;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  ctx.setLineDash([]);
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
