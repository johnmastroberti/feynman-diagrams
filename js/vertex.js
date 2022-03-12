const vertexTypes = ["Normal", "Blob", "1PI", "Insertion", "Counterterm"];

class Vertex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 25;
    this.type = vertexTypes[0];
    this.id = newID();
  }

  drawRadius() {
    switch (this.type) {
      case "Blob":
      case "1PI":
        return 2*this.r;
      case "Insertion":
      case "Counterterm":
        return 0.5*this.r;
      default:
        return this.r;
    }
  }
}

function snapVerticesToGrid() {
  if (!globalSnapToGrid) return;
  let canvas = document.getElementById("drawingArea");
  const W = canvas.width;
  const H = canvas.height;
  const dW = W / globalGrid.cols;
  const dH = H / globalGrid.rows;

  for (let vIndex in vertices) {
    vertices[vIndex].x = dW * (Math.floor(vertices[vIndex].x/dW) + 0.5);
    vertices[vIndex].y = dH * (Math.floor(vertices[vIndex].y/dH) + 0.5);
  }
}

