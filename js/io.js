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

function exportTEX() {}

function exportJSON() {
  const appState = {
    vertices: vertices,
    edges: edges,
    labels: labels,
    nextID: _nextID,
  };

  const text = JSON.stringify(appState);
  const blob = new Blob([text], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  downloadData("diagram.json", url);
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
