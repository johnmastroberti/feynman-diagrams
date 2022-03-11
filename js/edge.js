const edgeTypes = ["Solid", "Dashed", "Fermion", "Anti-Fermion", "Photon", "Gluon", "Ghost", "Double"];

class Edge {
  constructor(v1, v2, type) {
    this.v1 = v1;
    this.v2 = v2;
    if (edgeTypes.indexOf(type) != -1)
      this.type = type;
    else
      this.type = edgeTypes[0];
    this.selectWidth = 30;
    this.momentumArrow = false;
    this.reverseMomentum = false;
    this.swapMomentumSide = false;
    this.arrowOffset = 30;
    this.arrowFrac = 0.6;
    this.curve = false;
    this.id = newID();
  }

  getVertices() {
    const self = this;
    const vert1 = vertices.find(v => v.id == self.v1);
    const vert2 = vertices.find(v => v.id == self.v2);
    return [vert1, vert2];
  }

  toVec() {
    const verts = this.getVertices();
    return verticesToVec(verts[0], verts[1]);
  }

  reverseOrientation() {
    const tmp = this.v1;
    this.v1 = this.v2;
    this.v2 = tmp;
  }

  midpoint() {
    const verts = this.getVertices();
    let eVec = verticesToVec(verts[0], verts[1]);
    let mid = toVec(verts[0]).add(eVec.scale(0.5));
    if (this.curve)
      mid.add(eVec.perp().scale(-1));
    return mid;
  } 

  straightMidpoint() {
    // computes the midpoint as if this edge was not curved
    const oldCurve = this.curve;
    this.curve = false;
    const mid = this.midpoint();
    this.curve = oldCurve;
    return mid;
  }

  getRelativeCoordsOf(point) {
    // transforms the given point to coordinates
    // relative to the edge's vector
    // origin is taken at v1, v2 taken along positive
    // x axis
    let rel = toVec(point);
    const verts = this.getVertices();
    rel.sub(verts[0]);
    const eVec = verticesToVec(verts[0], verts[1]);
    rel.rotate(-1*eVec.angle());
    rel.y *= -1; // tbh not sure why this is necessary
    return rel;
  }
}
