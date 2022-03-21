function downloadData(name, dataURL) {
  let link = document.createElement("a");
  link.download = name;
  link.href = dataURL;
  link.onclick = function () {
    let self = this;
    setTimeout(function () {
      window.URL.revokeObjectURL(self.href);
    }, 1500);
  };

  link.click();
  link.remove();
}

function exportPNG() {
  downloadData("diagram.png", $("#drawingArea")[0].toDataURL("image/png"));
}

function exportText(name, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  downloadData(name, url);
}

function exportJSON() {
  const appState = {
    vertices: vertices,
    edges: edges,
    labels: labels,
    nextID: _nextID,
  };

  exportText("diagram.json", JSON.stringify(appState));
}

function loadAppState(appState) {
  console.log("App state: ", appState);
  vertices = appState.vertices;
  edges = appState.edges;
  labels = appState.labels;
  _nextID = appState.nextID;

  makeAllElementsProper();
  moveSelectButton();
}

function importJSON() {
  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".json";

  fileInput.addEventListener("change", (evt) => {
    console.log("entering file input change listener");
    if (evt.target.files.length == 0) return;

    const file = evt.target.files[0];
    console.log("checking file type");
    if (file.type && !(file.type == "application/json")) {
      alert("Please upload a JSON file");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", (evt) => {
      console.log("entering file load listener");
      console.log(evt.target.result);
      loadAppState(JSON.parse(evt.target.result));
      fileInput.remove();
    });
    reader.readAsText(file);
  });

  fileInput.click();
}

function vertexTEX(v) {
  const vertOpts = {
    Normal: "",
    Blob: "[blob]",
    "1PI": "[blob]",
    Insertion: "[crossed dot]",
    Counterterm: "[crossed dot]",
  };
  let opt = vertOpts[v.type];
  if (opt === undefined) opt = "";
  const end = opt != "" ? "{}" : "";
  return `\\vertex${opt} (v${v.id}) at (${v.x / 100}, ${
    (800 - v.y) / 100
  }) ${end};\n`;
}

function edgeTEX(e) {
  const lineTypes = {
    Sold: "plain",
    Dashed: "scalar",
    Fermion: "fermion",
    "Anti-Fermion": "anti fermion",
    Photon: "photon",
    Gluon: "gluon",
    Ghost: "ghost",
    Double: "double",
  };
  let lineOpt = lineTypes[e.type];
  if (lineOpt === undefined) lineOpt = "plain";

  const curveOpt = e.curve ? ", half left" : "";
  const mod1 = e.reverseMomentum ? "r" : "";
  const mod2 = e.swapMomentumSide ? "'" : "";
  const momOpt = e.momentumArrow ? `, ${mod1}momentum${mod2}={}` : "";

  const opts = `[${lineOpt}${curveOpt}${momOpt}]`;

  return `(v${e.v1}) --${opts} (v${e.v2}),\n`;
}

function exportTEX() {
  // header
  let tex = `\\documentclass{standalone}
\\usepackage{amsmath, amssymb, gensymb, tikz}
\\usepackage[compat=1.1.0]{tikz-feynman}
\\usepackage{contour}
\\begin{document}
\\begin{tikzpicture}
\\begin{feynman}\n`;

  // vertices
  for (let v of vertices) tex += vertexTEX(v);

  // edges
  tex += "\\diagram* {\n";
  for (let e of edges) tex += edgeTEX(e);
  tex += "};\n\\end{feynman}\n";

  // labels
  for (let l of labels)
    tex += `\\node (${l.x / 100}, ${(800 - l.y) / 100}) {$${l.text}$};\n`;

  tex += "\\end{tikzpicture}\n\\end{document}";
  exportText("diagram.tex", tex);
}
