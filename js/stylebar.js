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
}

function createStylePtag(text) {
  let tag = document.createElement('p');
  tag.innerHTML = text;
  document.getElementById("styleOptions").appendChild(tag);
} 

function setStyleTitle(title) {
  document.getElementById("styleBarTitle").innerHTML = title;
}
