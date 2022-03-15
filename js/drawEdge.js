function drawEdge(ctx, e) {
  const varr = e.getVertices();
  const v1 = varr[0],
    v2 = varr[1];
  if (!v1 || !v2) {
    edges.splice(edges.indexOf(e), 1);
    return;
  }

  if (e.id == globalSelectedID) ctx.strokeStyle = "#00ff00";
  else ctx.strokeStyle = "#000000";
  ctx.lineWidth = "3";

  if (e.momentumArrow) drawMomentumArrow(ctx, e);

  switch (e.type) {
    case "Dashed":
      drawEdgeDashed(ctx, e);
      break;
    case "Ghost":
      drawEdgeGhost(ctx, e);
      break;
    case "Photon":
      drawEdgePhoton(ctx, e);
      break;
    case "Gluon":
      drawEdgeGluon(ctx, e);
      break;
    case "Fermion":
    case "Anti-Fermion":
      drawEdgeFermion(ctx, e);
      break;
    case "Double":
      drawEdgeDouble(ctx, e);
      break;
    case "Solid":
    default:
      drawEdgeSolid(ctx, e);
  }
}

function drawEdgeGenericDashed(ctx, e, dashes) {
  const v = e.getVertices();
  drawEdgeGenericDashedVerts(ctx, v[0], v[1], dashes, e.curve);
}

function drawEdgeGenericDashedVerts(ctx, v1, v2, dashes, curve) {
  ctx.setLineDash(dashes);
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  if (curve) {
    let v1tov2 = verticesToVec(v1, v2);
    const r = v1tov2.len() / 2;
    const theta = v1tov2.angle() + Math.PI; // ctx.arc() takes the angle going clockwise
    const center = toVec(v1).add(v1tov2.scale(0.5));
    ctx.arc(center.x, center.y, r, theta, theta + Math.PI);
  } else ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
  ctx.setLineDash([]);
}

// function drawEdgeGenericDashedVertsCurve(ctx, v1, v2, dashes) {
//   ctx.setLineDash(dashes);
//   ctx.beginPath();
//   ctx.moveTo(v1.x, v1.y);
//   ctx.arcTo(v1.x, v1.y, v2.x, v2.y, verticesToVec(v1, v2).len()/2);
//   ctx.stroke();
//   ctx.setLineDash([]);
// }

function drawEdgeSolid(ctx, e) {
  drawEdgeGenericDashed(ctx, e, []);
}

function drawEdgeDashed(ctx, e) {
  drawEdgeGenericDashed(ctx, e, [10, 10]);
}

function drawEdgeGhost(ctx, e) {
  drawEdgeGenericDashed(ctx, e, [3, 3]);
}

function drawEdgeDouble(ctx, e) {
  const varr = e.getVertices();
  const v1 = varr[0],
    v2 = varr[1];
  const eVec = verticesToVec(v1, v2);
  const perpa = eVec.unitPerp().scale(5);
  const perpb = perpa.copy().scale(-1);
  const v1a = toVec(v1).add(perpa);
  const v2a = toVec(v2).add(perpa);
  const v1b = toVec(v1).add(perpb);
  const v2b = toVec(v2).add(perpb);
  drawEdgeGenericDashedVerts(ctx, v1a, v2a, []);
  drawEdgeGenericDashedVerts(ctx, v1b, v2b, []);
}

function drawArrowHead(ctx, coords, angle, size) {
  // Draws an arrow head pointing in the specified direction
  let p1 = coords.copy(),
    p2 = coords.copy();
  let vecUp = new Vec(1, 0),
    vecDown = new Vec(1, 0);
  vecUp.rotate(angle + (3 * Math.PI) / 4).scale(size);
  vecDown.rotate(angle - (3 * Math.PI) / 4).scale(size);

  p1.add(vecUp);
  p2.add(vecDown);

  ctx.beginPath();
  ctx.moveTo(coords.x, coords.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.moveTo(coords.x, coords.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}

function drawEdgeFermion(ctx, e) {
  drawEdgeSolid(ctx, e);

  // Compute arrow points
  const arrowSize = 15;
  // const varr = e.getVertices();
  // const v1 = varr[0], v2=varr[1];
  const eVec = e.toVec();
  // const mid = eVec.copy().scale(0.5).add(v1);
  if (e.type == "Fermion")
    drawArrowHead(ctx, e.midpoint(), eVec.angle(), arrowSize);
  else drawArrowHead(ctx, e.midpoint(), eVec.angle() + Math.PI, arrowSize);
}

function drawEdgeGenericCurve(ctx, e, cFunc) {
  // Draws a curve from v1 to v2 according to cFunc
  // cFunc(t) should return (x,y) and should map t in [0,1]
  // to the desired curve. This function will scale and rotate
  // the curve to connect the two vertices
  // Assumes cFunc(0) = (0,0) and cFunc(1) = (1,0)
  if (e.curve) {
    drawEdgeGenericArcCurve(ctx, e, cFunc);
    return;
  }
  const samples = 100;
  const dt = 1.0 / samples;
  const varr = e.getVertices();
  const v1 = varr[0],
    v2 = varr[1];

  // Compute the necessary scale, rotate, and translate
  const edgeVec = verticesToVec(v1, v2);
  const theta = edgeVec.angle();
  const scale = edgeVec.len();
  const transform = function (pt) {
    pt = toVec(pt);
    pt.x *= scale;
    pt.rotate(theta);
    pt.add(v1);
    return pt;
  };

  // Draw the curve with segments
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  for (let i = 1; i < samples; i++) {
    const pt = transform(cFunc(i * dt));
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

function drawEdgeGenericArcCurve(ctx, e, cFunc) {
  // Draws a curve from v1 to v2 according to cFunc,
  // projected onto the semi-circle connecting v1 and v2
  // cFunc(t) should return (x,y) and should map t in [0,1]
  // to the desired curve. This function will scale and rotate
  // the curve to connect the two vertices
  // Assumes cFunc(0) = (0,0) and cFunc(1) = (1,0)
  const samples = 100;
  const dt = 1.0 / samples;

  const varr = e.getVertices();
  const v1 = varr[0],
    v2 = varr[1];
  const eVec = verticesToVec(v1, v2);
  const R = eVec.len() / 2;

  // Compute the necessary scale, rotate, and translate
  const transform = function (pt) {
    const theta = Math.PI * pt.x + Math.PI;
    const r = R + pt.y;
    let vec = polarVec(r, theta);
    vec.rotate(eVec.angle());
    return e.straightMidpoint().add(vec);
  };

  // Draw the curve with segments
  ctx.beginPath();
  ctx.moveTo(v1.x, v1.y);
  for (let i = 1; i < samples; i++) {
    const pt = transform(cFunc(i * dt));
    ctx.lineTo(pt.x, pt.y);
  }
  ctx.lineTo(v2.x, v2.y);
  ctx.stroke();
}

function drawEdgePhoton(ctx, e) {
  drawEdgeGenericCurve(ctx, e, function (t) {
    const xx = t;
    const yy = 15 * Math.sin(Math.PI * 10 * t);
    const pt = { x: xx, y: yy };
    return pt;
  });
}

function drawEdgeGluon(ctx, e) {
  drawEdgeGenericCurve(ctx, e, function (t) {
    const nLoops = 6;
    const pi = Math.PI;
    const amp = 0.05,
      k = pi * (2 * nLoops + 1);
    const xx = (t - amp * Math.sin(k * t + pi / 2) + amp) / (1 + 2 * amp);
    const yy = 200 * amp * Math.cos(k * t + pi / 2);
    const pt = { x: xx, y: yy };
    return pt;
  });
}

function drawMomentumArrow(ctx, e) {
  // Draw an arrow parallel to the edge
  if (e.curve) {
    drawCurvedMomentumArrow(ctx, e);
    return;
  }

  // Calculate arrow endpoints
  const varr = e.getVertices();
  const v1 = varr[0],
    v2 = varr[1];
  const k = e.swapMomentumSide ? -1 : 1;
  const eVec = verticesToVec(v1, v2);
  const arrowVec = eVec.copy().scale(e.arrowFrac);
  const perp = eVec.unitPerp().scale(k * e.arrowOffset);
  let v1vec = toVec(v1);
  const f1 = (1 - e.arrowFrac) / 2,
    f2 = 1 - f1;
  v1vec.add(perp).add(eVec.unit().scale(f1 * eVec.len()));
  let v2vec = toVec(v1);
  v2vec.add(perp).add(eVec.unit().scale(f2 * eVec.len()));

  // Draw the arrow
  const arrowSize = 15;
  drawEdgeGenericDashedVerts(ctx, v1vec, v2vec, []);
  if (e.reverseMomentum)
    drawArrowHead(ctx, v1vec, eVec.angle() + Math.PI, arrowSize);
  else drawArrowHead(ctx, v2vec, eVec.angle(), arrowSize);
}

function drawCurvedMomentumArrow(ctx, e) {
  const eVec = e.toVec();
  const mid = e.midpoint().add(eVec.perp().scale(0.5));
  const eAng = eVec.angle();
  const f1 = e.arrowFrac,
    f2 = (1 - f1) / 2;

  let offset = new Vec(1, 0);
  offset.scale(eVec.len() / 2 + e.arrowOffset);
  offset.rotate(eAng - Math.PI * f2);
  const p1 = mid.copy().add(offset);
  offset.rotate(-Math.PI * f1);
  const p2 = mid.copy().add(offset);

  const ang1 = 2 * Math.PI + eAng - f2 * Math.PI;
  const ang2 = ang1 - f1 * Math.PI;

  ctx.beginPath();
  ctx.arc(mid.x, mid.y, eVec.len() / 2 + e.arrowOffset, ang2, ang1);
  ctx.stroke();

  const arrowSize = 15;
  if (e.reverseMomentum) drawArrowHead(ctx, p2, ang2 - Math.PI / 2, arrowSize);
  else drawArrowHead(ctx, p1, ang1 + Math.PI / 2, arrowSize);
}
