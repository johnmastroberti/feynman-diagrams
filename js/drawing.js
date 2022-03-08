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


  const svg = lab.jax.children[0];
  svg.id = "label" + lab.id;
  // console.log(lab.jax);
  console.log(svg);
  $("#footerDiv").append(svg);
  $("#footerDiv").append(lab.jax);

  // ctx.strokeRect(lab.x, lab.y, lab.svgTag.width, lab.svgTag.height);
  ctx.drawImage(svg, lab.x, lab.y);
}
