class Vec {
  constructor(xx, yy) {
    this.x = xx;
    this.y = yy;
  }

  copy() {
    return new Vec(this.x, this.y);
  }

  len2() {
    return this.x*this.x + this.y*this.y;
  }

  len() {
    return Math.sqrt(this.len2());
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  scale(factor) {
    this.x *= factor;
    this.y *= factor;
    return this;
  }

  rotate(theta) {
    const ox = this.x, oy = this.y;
    const c = Math.cos(theta), s = Math.sin(theta);
    this.x = c * ox - s * oy;
    this.y = s * ox + c * oy;
    return this;
  }

  unit() {
    return new Vec(this.x/this.len(), this.y/this.len());
  }

  perp() {
    let v = this.copy();
    v.rotate(Math.PI/2);
    return v;
  }

  unitPerp() {
    return this.unit().perp();
  }
}

function toVec(pt) {
  return new Vec(pt.x, pt.y);
}

function verticesToVec(v1, v2) {
  return new Vec(v2.x - v1.x, v2.y - v1.y);
}
