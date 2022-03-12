function setVertexDrawingStyles(ctx, v) {
  if (v.id == globalSelectedID) {
    ctx.fillStyle = "#00ff00";
    ctx.strokeStyle = "#00ff00";
  } else {
    ctx.fillStyle = "#000000";
    ctx.strokeStyle = "#000000";
  }
  ctx.lineWidth = "3";
}

function drawVertex(ctx, v) {
  setVertexDrawingStyles(ctx, v);

  switch (v.type) {
    case "Blob":
      return drawVertexBlob(ctx, v);
    case "1PI":
      return drawVertex1PI(ctx, v);
    case "Insertion":
      return drawVertexInsertion(ctx, v);
    case "Counterterm":
      return drawVertexCounterterm(ctx, v);
    case "Normal":
    default:
      return drawVertexNormal(ctx, v);
  }
}

function drawVCircle(ctx, v, r, fill) {
  if (fill) {
    ctx.fillStyle = fill;
  }
  ctx.beginPath();
  ctx.arc(v.x, v.y, r, 0, 2*Math.PI, false);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

function drawVLine(ctx, p1, p2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawVertexNormal(ctx, v) {
  if (!globalVerboseDrawing) return;
  drawVCircle(ctx, v, v.drawRadius());
}

function drawVertexBlob(ctx, v) {
  // circle outline
  const R = v.drawRadius();
  drawVCircle(ctx, v, R, "#ffffff");

  // diagonal lines for shading
  const nLines = 14;
  for (let i = -nLines/2+1; i<nLines/2; i++) {
    const y = 2*(i/nLines) * R;
    const x = Math.sqrt(R*R - y*y);
    let p1 = new Vec(x,y), p2 = new Vec(-x, y);
    p1.rotate(Math.PI/4); p2.rotate(Math.PI/4);
    p1.add(v); p2.add(v);
    drawVLine(ctx, p1, p2)
  }
}

function drawVertex1PI(ctx, v) {
  // circle outline
  const R = v.drawRadius();
  drawVCircle(ctx, v, R, "#ffffff");

  // 1PI text
  setVertexDrawingStyles(ctx, v);
  ctx.font = 2*v.r + "px Serif";
  ctx.textAlign = "center";
  ctx.fillText("1PI", v.x, v.y+10);
}

function drawVertexInsertion(ctx, v) {
  const R = v.drawRadius();
  const dx = R/Math.sqrt(2);
  let p1 = toVec(v), p2 = toVec(v);
  p1.x += dx; p1.y += dx;
  p2.x -= dx; p2.y -= dx;
  drawVLine(ctx, p1, p2);
  p1.y -= 2*dx;
  p2.y += 2*dx;
  drawVLine(ctx, p1, p2);
}

function drawVertexCounterterm(ctx, v) {
  const R = v.drawRadius();
  drawVCircle(ctx, v, R, "#ffffff");
  drawVertexInsertion(ctx, v);
}

