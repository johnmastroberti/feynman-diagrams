function updateStyleBar() {
  clearStyleBar();
  if (globalSelectedID == -1) return;

  const vIndex = vertices.findIndex(v => v.id == globalSelectedID);
  if (vIndex != -1)
    return updateStyleBarVertex(vIndex);

  const eIndex = edges.findIndex(e => e.id == globalSelectedID);
  if (eIndex != -1)
    return updateStyleBarEdge(eIndex);

  console.log("Unexpectedly failed to locate object with globalSelectedId");
}

function clearStyleBar() {
  setStyleTitle("Selected Object: None");
  let so = document.getElementById("styleOptions");
  so.innerHTML = "";
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
  createStylePtag("ID: " + e.id);

  createStyleSelector("type", "Type:", ["Line", "Dashed Line", "Fermion", "Anti-Fermion"], e.type);
}

function createStylePtag(text) {
  let tag = document.createElement('p');
  tag.innerHTML = text;
  document.getElementById("styleOptions").appendChild(tag);
} 

function setStyleTitle(title) {
  document.getElementById("styleBarTitle").innerHTML = title;
}

function createStyleSelector(name, text, values, currentValue, callback) {
  name = "SB" + name;
  let selectTag = document.createElement('select');
  selectTag.name = name;
  selectTag.id = name;
  let labelTag = document.createElement('label');
  labelTag.for = name;
  labelTag.innerHTML = text;

  document.getElementById("styleOptions").appendChild(labelTag);
  document.getElementById("styleOptions").appendChild(selectTag);

  for (val of values) {
    let oTag = document.createElement('option');
    oTag.innerHTML = val;
    oTag.value = val;
    selectTag.appendChild(oTag);
  }
  selectTag.value = currentValue;
} 
