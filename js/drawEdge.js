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

  if (e.momentumArrow)
    drawMomentumArrow(ctx, v1, v2, e.reverseMomentum, e.swapMomentumSide);

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

function drawArrowHead(ctx, coords, angle, size) {
  // Draws an arrow head pointing in the specified direction
  let p1 = coords.copy(), p2 = coords.copy();
  let vecUp = new Vec(1,0), vecDown = new Vec(1,0);
  vecUp.rotate(angle + 3*Math.PI/4).scale(size);
  vecDown.rotate(angle - 3*Math.PI/4).scale(size);
  
  p1.add(vecUp);
  p2.add(vecDown);

  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.moveTo(coords.x, coords.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawEdgeFermion(ctx, v1, v2) {
  drawEdgeSolid(ctx, v1, v2);

  // Compute arrow points
  const arrowSize = 15;
  const eVec = verticesToVec(v1, v2);
  const mid = eVec.copy().scale(0.5).add(v1);
  drawArrowHead(ctx, mid, eVec.angle(), arrowSize);
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

function drawMomentumArrow(ctx, v1, v2, reverseArrow, swapSide) {
  // Draw an arrow parallel to the edge

  // Calculate arrow endpoints
  const k = swapSide ? -1 : 1;
  const eVec = verticesToVec(v1, v2);
  const arrowVec = eVec.copy().scale(0.6);
  const perp = eVec.unitPerp().scale(k*20);
  let v1vec = toVec(v1);
  v1vec.add(perp).add(eVec.unit().scale(0.2*eVec.len()));
  let v2vec = toVec(v1);
  v2vec.add(perp).add(eVec.unit().scale(0.8*eVec.len()));

  // Draw the arrow
  const arrowSize = 15;
  drawEdgeSolid(ctx, v1vec, v2vec);
  if (reverseArrow)
    drawArrowHead(ctx, v1vec, eVec.angle()+Math.PI, arrowSize);
  else
    drawArrowHead(ctx, v2vec, eVec.angle(), arrowSize);
}
