function initStyleBar() {
  createStyleTools();
  createStyleCanvas();
  updateStyleElement();
  createStyleExport();
}

function updateStyleElement() {
  clearStyleElement();
  if (globalSelectedID === -1) return;
  const vIndex = vertices.findIndex((v) => v.id == globalSelectedID);
  if (vIndex != -1) return updateStyleBarVertex(vIndex);

  const eIndex = edges.findIndex((e) => e.id == globalSelectedID);
  if (eIndex != -1) return updateStyleBarEdge(eIndex);

  const lIndex = labels.findIndex((l) => l.id == globalSelectedID);
  if (lIndex != -1) return updateStyleBarLabel(lIndex);

  console.log("Unexpectedly failed to locate object with globalSelectedId");
}

function clearStyleElement() {
  $("#styleElement").html("");
}

function createStyleTools() {
  const divID = "#styleTools";
  createStyleHeading(divID, "Tools");
  const buttons = [
    imgButton(
      "vertexbtn",
      "Add Vertex",
      "/img/tools/vertex.png",
      false,
      newVertexButton
    ),
    imgButton(
      "edgebtn",
      "Add Edge",
      "/img/tools/edge.png",
      false,
      newEdgeButton
    ),
    imgButton(
      "labelbtn",
      "Add Label",
      "/img/tools/label.png",
      false,
      newLabelButton
    ),
    imgButton(
      "moveselbtn",
      "Move/Select",
      "/img/tools/move.png",
      false,
      moveSelectButton
    ),
  ];

  createButtonGroup(divID, "toolButtonGroup", buttons);
}

function createStyleCanvas() {
  const divID = "#styleCanvas";
  createStyleHeading(divID, "Canvas Settings");

  createCheckButtonGroup(divID, "canvasSettings", [
    {
      id: "verboseDrawingBtn",
      text: "Show all vertices and label outlines",
      callback: function () {
        globalVerboseDrawing = !globalVerboseDrawing;
        drawScreen();
      },
      checked: globalVerboseDrawing,
    },
    {
      id: "snapGridBtn",
      text: "Snap to grid",
      callback: function () {
        globalSnapToGrid = !globalSnapToGrid;
        drawScreen();
      },
      checked: globalSnapToGrid,
    },
  ]);
}

function createStyleExport() {
  const divID = "#styleExport";
  createStyleHeading(divID, "Import/Export");

  const displayNames = {
    epng: "Export PNG",
    etex: "Export TeX",
    ejson: "Export JSON",
    ijson: "Import JSON",
  };
  const callbacks = {
    epng: exportPNG,
    etex: exportTEX,
    ejson: exportJSON,
    ijson: importJSON,
  };
  const ioButton = (name) =>
    imgButton(
      "IO" + name,
      displayNames[name],
      "/img/io/" + name + ".png",
      false,
      callbacks[name]
    );

  const buttons = ["epng", "etex", "ejson", "ijson"].map(ioButton);
  createButtonGroup("#styleExport", "ioButtons", buttons);
}

function updateStyleBarVertex(vIndex) {
  const divID = "#styleElement";
  createStyleHeading(divID, "Vertex Options");
  const v = vertices[vIndex];

  const vertexCB = function (vtype) {
    return function () {
      vertices[vIndex].type = vtype;
      drawScreen();
    };
  };
  const simpleIB = function (name) {
    const lower = name.toLowerCase();
    return imgButton(
      "VT" + lower,
      name,
      "/img/vertex/" + lower + ".png",
      false,
      vertexCB(name)
    );
  };
  const buttons = vertexTypes.map((x) => simpleIB(x));
  createButtonGroup("#styleElement", "vertexType", buttons);
  $("#VT" + v.type.toLowerCase()).addClass("IBselected");

  createStyleButton(divID, "deleteVertex", "Delete Vertex", function () {
    vertices.splice(vIndex, 1);
    changeSelection(-1);
  });
}

function updateStyleBarEdge(eIndex) {
  const divID = "#styleElement";
  createStyleHeading(divID, "Edge Options");
  const e = edges[eIndex];

  const edgeCB = function (etype) {
    return function () {
      edges[eIndex].type = etype;
      drawScreen();
    };
  };
  const simpleIB = function (name) {
    const lower = name.toLowerCase();
    return imgButton(
      "ET" + lower,
      name,
      "/img/edge/" + lower + ".png",
      true,
      edgeCB(name)
    );
  };
  const buttons = edgeTypes.map((x) => simpleIB(x));
  createButtonGroup("#styleElement", "edgeType", buttons);
  $("#ET" + e.type.toLowerCase()).addClass("IBselected");

  const checkboxes = [
    { prop: "curve", label: "Curve " },
    { prop: "momentumArrow", label: "Momentum Arrow " },
    { prop: "reverseMomentum", label: "Reverse Arrow " },
    { prop: "swapMomentumSide", label: "Swap Arrow to Other Side " },
  ];
  createCheckButtonGroup(
    "#styleElement",
    "edgeOpts",
    checkboxes.map((cb) => ({
      id: "EO" + cb.prop,
      text: cb.label,
      callback: function () {
        edges[eIndex][cb.prop] = $("#EO" + cb.prop).hasClass("selectedCB");
        drawScreen();
      },
    }))
  );

  createStyleButton(divID, "reverse", "Reverse Orientation", function () {
    edges[eIndex].reverseOrientation();
    drawScreen();
  });
  createStyleButton(divID, "deleteEdge", "Delete Edge", function () {
    edges.splice(eIndex, 1);
    changeSelection(-1);
  });
}

function updateStyleBarLabel(labIndex) {
  const divID = "#styleElement";
  createStyleHeading(divID, "Label Options");
  createStyleTextBox(
    divID,
    "text",
    "Text:",
    labels[labIndex].text,
    function () {
      labels[labIndex].setText($("#SBtext").val());
    }
  );
  createStyleButton(divID, "deleteLabel", "Delete Label", function () {
    labels.splice(labIndex, 1);
    changeSelection(-1);
  });
}

function createStylePtag(text) {
  const tag = $("<p></p>").text(text);
  $("#styleOptions").append(tag);
}

function setStyleTitle(title) {
  $("#styleBarTitle").text(title);
}

function createStyleHeading(divID, text) {
  let h1 = document.createElement("h1");
  h1.innerHTML = text;
  $(divID).append(h1);
}

function createStyleTextBox(divID, name, text, currentValue, callback) {
  name = "SB" + name;
  let inputTag = document.createElement("input");
  inputTag.name = name;
  inputTag.id = name;
  let labelTag = document.createElement("label");
  labelTag.for = name;
  labelTag.innerHTML = text;
  let buttonTag = document.createElement("button");
  buttonTag.innerHTML = "Apply";
  const br = document.createElement("br");

  $(divID).append(labelTag, inputTag, buttonTag, br);

  inputTag.value = currentValue;
  buttonTag.onclick = callback;
}

function createStyleCheckBox(divID, name, text, currentValue, callback) {
  name = "SB" + name;
  let inputTag = document.createElement("input");
  inputTag.type = "checkbox";
  inputTag.name = name;
  inputTag.id = name;
  let labelTag = document.createElement("label");
  labelTag.for = name;
  labelTag.innerHTML = text;
  const br = document.createElement("br");

  $(divID).append(inputTag, labelTag, br);

  inputTag.checked = currentValue;
  inputTag.onclick = callback;
}

function createStyleSelector(
  divID,
  name,
  text,
  values,
  currentValue,
  callback
) {
  name = "SB" + name;
  let selectTag = document.createElement("select");
  selectTag.name = name;
  selectTag.id = name;
  let labelTag = document.createElement("label");
  labelTag.for = name;
  labelTag.innerHTML = text;
  const br = document.createElement("br");

  $(divID).append(labelTag, selectTag, br);

  for (val of values) {
    let oTag = document.createElement("option");
    oTag.innerHTML = val;
    oTag.value = val;
    selectTag.appendChild(oTag);
  }
  selectTag.value = currentValue;

  selectTag.onclick = callback;
}

function createStyleButton(divID, name, text, callback) {
  name = "SB" + name;
  let bTag = document.createElement("button");
  bTag.id = name;
  bTag.innerHTML = text;
  bTag.className = "customButton";
  // const br = document.createElement('br');

  $(divID).append(bTag);

  bTag.onclick = callback;
}
