function updateStyleBar() {
  clearStyleBar();
  if (globalSelectedID == -1) return;

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

function clearStyleBar() {
  setStyleTitle("Selected Object: None");
  $("#styleOptions").html("");
}

function updateStyleBarVertex(vIndex) {
  setStyleTitle("Selected Object: Vertex");
  createStylePtag("X: " + vertices[vIndex].x);
  createStylePtag("Y: " + vertices[vIndex].y);
  createStylePtag("Radius: " + vertices[vIndex].r);
  createStylePtag("ID: " + vertices[vIndex].id);
}


function updateStyleBarEdge(eIndex) {
  setStyleTitle("Selected Object: Edge");
  const e = edges[eIndex];
  createStylePtag("v1: " + e.v1);
  createStylePtag("v2: " + e.v2);

  createStyleSelector("type", "Type:", edgeTypes, e.type, 
    function () {
      edges[eIndex].type = $("#SBtype").val();
      drawScreen();
    });

  const checkboxes = [{ prop: 'momentumArrow', label: 'Momentum Arrow '},
                      { prop: 'reverseMomentum', label: 'Reverse Arrow '},
                      { prop: 'swapMomentumSide', label: 'Swap Arrow to Other Side '}];
  for (const item of checkboxes)
    createStyleCheckBox(item.prop, item.label, 
      edges[eIndex][item.prop],
      function() {
        edges[eIndex][item.prop] = $("#SB" + item.prop)[0].checked;
        drawScreen();
      });

  createStylePtag("ID: " + e.id);
}


function updateStyleBarLabel(labIndex) {
  setStyleTitle("Selected Object: Label");
  createStylePtag("X: " + labels[labIndex].x);
  createStylePtag("Y: " + labels[labIndex].y);
  createStylePtag("Scale: " + labels[labIndex].scale);
  createStylePtag("Text: " + labels[labIndex].text);
  createStyleTextBox("text", "Text:", labels[labIndex].text,
    function () {
      labels[labIndex].setText($("#SBtext").val());
    });
  createStylePtag("ID: " + labels[labIndex].id);
}

function createStylePtag(text) {
  const tag = $("<p></p>").text(text);
  $("#styleOptions").append(tag);
} 

function setStyleTitle(title) {
  $("#styleBarTitle").text(title);
}

function createStyleTextBox(name, text, currentValue, callback) {
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

  $("#styleOptions").append(labelTag, inputTag, buttonTag, br);

  inputTag.value = currentValue;
  buttonTag.onclick = callback;
} 

function createStyleCheckBox(name, text, currentValue, callback) {
  name = "SB" + name;
  let inputTag = document.createElement('input');
  inputTag.type = "checkbox";
  inputTag.name = name;
  inputTag.id = name;
  let labelTag = document.createElement('label');
  labelTag.for = name;
  labelTag.innerHTML = text;
  const br = document.createElement('br');

  $("#styleOptions").append(labelTag, inputTag, br);

  inputTag.checked = currentValue;
  inputTag.onclick = callback;
} 

function createStyleSelector(name, text, values, currentValue, callback) {
  name = "SB" + name;
  let selectTag = document.createElement('select');
  selectTag.name = name;
  selectTag.id = name;
  let labelTag = document.createElement('label');
  labelTag.for = name;
  labelTag.innerHTML = text;
  const br = document.createElement('br');

  $("#styleOptions").append(labelTag, selectTag, br);

  for (val of values) {
    let oTag = document.createElement('option');
    oTag.innerHTML = val;
    oTag.value = val;
    selectTag.appendChild(oTag);
  }
  selectTag.value = currentValue;

  selectTag.onclick = callback;
} 
