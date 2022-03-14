function initStyleBar() {
  createStyleTools();
  createStyleCanvas();
  updateStyleElement();
  createStyleExport();
}

function updateStyleElement() {
  clearStyleElement();
  if (globalSelectedID === -1)
    return;
  const vIndex = vertices.findIndex(v => v.id == globalSelectedID);
  if (vIndex != -1)
    return updateStyleBarVertex(vIndex);

  const eIndex = edges.findIndex(e => e.id == globalSelectedID);
  if (eIndex != -1)
    return updateStyleBarEdge(eIndex);

  const lIndex = labels.findIndex(l => l.id == globalSelectedID);
  if (lIndex != -1)
    return updateStyleBarLabel(lIndex);

  console.log("Unexpectedly failed to locate object with globalSelectedId");
}

function clearStyleElement() {
  $("#styleElement").html("");
}

function createStyleTools() {
  const divID = "#styleTools";
  createStyleHeading(divID, "Tools");
  const buttons = [ imgButton("vertexbtn", "Add Vertex",  "/img/vertex_icon.png", newVertexButton),
                    imgButton("edgebtn",   "Add Edge",    "/img/edge_icon.png", newEdgeButton),
                    imgButton("labelbtn",  "Add Label",   "/img/label_icon.png", newLabelButton),
                    imgButton("moveselbtn","Move/Select", "/img/move_icon.png", moveSelectButton) ];

  createButtonGroup(divID, "toolButtonGroup", buttons);
}

function createStyleCanvas() {
  const divID = "#styleCanvas";
  createStyleHeading(divID, "Canvas Settings");

  createStyleCheckBox(divID, "verboseDrawing", "Show all vertices and label outlines", 
    globalVerboseDrawing,
    function() {
      globalVerboseDrawing = $("#SBverboseDrawing")[0].checked;
      drawScreen();
    });
  createStyleCheckBox(divID, "snapToGrid", "Snap to grid", 
    globalSnapToGrid,
    function() {
      globalSnapToGrid = $("#SBsnapToGrid")[0].checked;
      drawScreen();
    });
}

function createStyleExport() {
  const divID = "#styleExport";
  createStyleHeading(divID, "Import/Export");
}


function updateStyleBarVertex(vIndex) {
  const divID = "#styleElement";
  createStyleHeading(divID, "Vertex Options");
  const v = vertices[vIndex];
  createStyleSelector(divID, "type", "Type:", vertexTypes, v.type, 
    function () {
      vertices[vIndex].type = $("#SBtype").val();
      drawScreen();
    });
}


function updateStyleBarEdge(eIndex) {
  const divID = "#styleElement";
  createStyleHeading(divID, "Edge Options");
  const e = edges[eIndex];

  createStyleSelector(divID, "type", "Type:", edgeTypes, e.type, 
    function () {
      edges[eIndex].type = $("#SBtype").val();
      drawScreen();
    });

  const checkboxes = [{ prop: 'curve', label: 'Curve '},
                      { prop: 'momentumArrow', label: 'Momentum Arrow '},
                      { prop: 'reverseMomentum', label: 'Reverse Arrow '},
                      { prop: 'swapMomentumSide', label: 'Swap Arrow to Other Side '}];
  for (const item of checkboxes)
    createStyleCheckBox(divID, item.prop, item.label, 
      edges[eIndex][item.prop],
      function() {
        edges[eIndex][item.prop] = $("#SB" + item.prop)[0].checked;
        drawScreen();
      });

  createStyleButton(divID, 'reverse', "Reverse Orientation",
    function() {
      edges[eIndex].reverseOrientation();
      drawScreen();
    });
}


function updateStyleBarLabel(labIndex) {
  const divID = "#styleElement";
  createStyleHeading(divID, "Label Options");
  createStyleTextBox(divID, "text", "Text:", labels[labIndex].text,
    function () {
      labels[labIndex].setText($("#SBtext").val());
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
  let h1 = document.createElement('h1');
  h1.innerHTML = text;
  $(divID).append(h1);
}

function createStyleTextBox(divID, name, text, currentValue, callback) {
  name = "SB" + name;
  let inputTag = document.createElement('input');
  inputTag.name = name;
  inputTag.id = name;
  let labelTag = document.createElement('label');
  labelTag.for = name;
  labelTag.innerHTML = text;
  let buttonTag = document.createElement('button');
  buttonTag.innerHTML = "Apply";
  const br = document.createElement('br');

  $(divID).append(labelTag, inputTag, buttonTag, br);

  inputTag.value = currentValue;
  buttonTag.onclick = callback;
} 

function createStyleCheckBox(divID, name, text, currentValue, callback) {
  name = "SB" + name;
  let inputTag = document.createElement('input');
  inputTag.type = "checkbox";
  inputTag.name = name;
  inputTag.id = name;
  let labelTag = document.createElement('label');
  labelTag.for = name;
  labelTag.innerHTML = text;
  const br = document.createElement('br');

  $(divID).append(inputTag, labelTag, br);

  inputTag.checked = currentValue;
  inputTag.onclick = callback;
} 

function createStyleSelector(divID, name, text, values, currentValue, callback) {
  name = "SB" + name;
  let selectTag = document.createElement('select');
  selectTag.name = name;
  selectTag.id = name;
  let labelTag = document.createElement('label');
  labelTag.for = name;
  labelTag.innerHTML = text;
  const br = document.createElement('br');

  $(divID).append(labelTag, selectTag, br);

  for (val of values) {
    let oTag = document.createElement('option');
    oTag.innerHTML = val;
    oTag.value = val;
    selectTag.appendChild(oTag);
  }
  selectTag.value = currentValue;

  selectTag.onclick = callback;
} 

function createStyleButton(divID, name, text, callback) {
  name = "SB" + name;
  let bTag = document.createElement('button');
  bTag.id = name;
  bTag.innerHTML = text;
  // const br = document.createElement('br');

  $(divID).append(bTag);

  bTag.onclick = callback;
} 

