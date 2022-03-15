function imgButton(ID, txt, icn, cb) {
  return { id: ID, text: txt, icon: icn, callback: cb };
}

function createButtonGroup(divID, groupName, buttonDefs) {
  let gID = "SB" + groupName;
  let outerDiv = document.createElement("div");
  outerDiv.className = "imageButtonGroup";
  outerDiv.id = gID;
  gID = "#" + gID;
  $(divID).append(outerDiv);

  for (const b of buttonDefs) {
    let innerDiv = document.createElement("div");
    innerDiv.className = "imageButton";
    innerDiv.id = b.id;
    const iID = "#" + b.id;
    innerDiv.onclick = function () {
      for (let c of outerDiv.children) {
        c.className = "imageButton";
      }
      $(iID).addClass("IBselected");
      b.callback();
    };
    $(gID).append(innerDiv);

    let img = document.createElement("img");
    img.className = "buttonImage";
    img.src = b.icon;
    img.alt = b.text;
    img.draggable = false;
    $(iID).append(img);

    let p = document.createElement("p");
    p.className = "buttonText";
    p.innerHTML = b.text;

    $(iID).append(p);
  }
}
