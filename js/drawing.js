function drawScreen() {
  let canvas = document.getElementById("drawingArea");
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (v of vertices) drawVertex(ctx, v);
  for (e of edges) drawEdge(ctx, e);
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

function drawEdge(ctx, e) {
  const v1 = vertices.find(vert => vert.id == e.v1);
  const v2 = vertices.find(vert => vert.id == e.v2);
  if (!v1 || !v2) {
    edges.splice(edges.indexOf(e), 1);
    return;
  }

  if (e.id == globalSelectedID)
    ctx.strokeStyle = "#00ff00";
  else
    ctx.strokeStyle = "#000000";
  ctx.lineWidth = "3";

  switch (e.type) {
    case "Dashed":
      drawEdgeDashed(ctx, v1, v2);
      break;
    case "Ghost":
      drawEdgeGhost(ctx, v1, v2);
      break;
    case "Photon":
      drawEdgePhoton(ctx, v1, v2);
      break;
    case "Fermion":
      drawEdgeFermion(ctx, v1, v2);
      break;
    case "Anti-Fermion":
      drawEdgeFermion(ctx, v2, v1);
      break;
    case "Solid":
    default:
      drawEdgeSolid(ctx, v1, v2);
  }
}

function drawEdgeSolid(ctx, v1, v2) {
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

function drawEdgeGenericDashed(ctx, v1, v2, dashes) {
  ctx.setLineDash(dashes);
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawEdgeDashed(ctx, v1, v2) {
  drawEdgeGenericDashed(ctx, v1, v2, [10,10]);
}

function drawEdgeGhost(ctx, v1, v2) {
  drawEdgeGenericDashed(ctx, v1, v2, [3,3]);
}

function drawEdgeFermion(ctx, v1, v2) {
  drawEdgeSolid(ctx, v1, v2);

  // Compute arrow points
  const arrowSize = 15;
  const eVec = verticesToVec(v1, v2);
  const mid = eVec.copy().scale(0.5).add(v1);
  let dx = eVec.unit().scale(-arrowSize);
  let dy = dx.perp();

  console.log("eVec = ", eVec);
  console.log("dx = ", dx, ", dy = ", dy);

  let p1 = mid.copy(), p2 = mid.copy();
  p1.add(dx).add(dy);
  p2.add(dx).add(dy.scale(-1));

  ctx.beginPath();
  ctx.moveTo(mid.x, mid.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.moveTo(mid.x, mid.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawEdgeGenericCurve(ctx, v1, v2, cFunc) {
  // Draws a curve from v1 to v2 according to cFunc
  // cFunc(t) should return (x,y) and should map t in [0,1]
  // to the desired curve. This function will scale and rotate
  // the curve to connect the two vertices
  // Assumes cFunc(0) = (0,0) and cFunc(1) = (1,0)
  const samples = 100;
  const dt = 1.0/samples;

  // Compute the necessary scale, rotate, and translate
  const edgeVec = verticesToVec(v1, v2);
  const theta = edgeVec.angle();
  const scale = edgeVec.len();
  const transform = function(pt) {
    pt = toVec(pt);
    pt.x *= scale;
    pt.rotate(theta);
    pt.add(v1);
    return pt;
  };

  // Draw the curve with segments
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  for (let i = 1; i<samples; i++) {
    const pt = transform(cFunc(i*dt));
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

function drawEdgePhoton(ctx, v1, v2) {
  drawEdgeGenericCurve(ctx, v1, v2,
    function (t) {
      const xx = t;
      const yy = 20*Math.sin(Math.PI * 20*t);
      const pt = {x: xx, y: yy};
      return pt;
    });
}
