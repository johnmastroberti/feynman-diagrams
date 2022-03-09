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
    this.id = newID();
  }
}
