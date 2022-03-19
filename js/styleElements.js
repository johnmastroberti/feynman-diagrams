function imgButton(ID, txt, icn, wideIm, cb) {
  return { id: ID, text: txt, icon: icn, wide: wideIm, callback: cb };
}

function createButtonGroup(divID, groupName, buttonDefs) {
  let gID = "SB" + groupName;
  let outerDiv = document.createElement("div");
  outerDiv.className = "buttonGroup";
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
    img.className = b.wide ? "wideButtonImage" : "buttonImage";
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

function createCustomCheckButton(parentID, id, text, callback, defaultChecked) {
  let div = document.createElement("div");
  div.className = "customCheckButton";
  div.id = id;
  div.onclick = function () {
    $("#" + id).toggleClass("selectedCB");
    callback();
  };
  $(parentID).append(div);

  let pIcon = document.createElement("p");
  pIcon.className = "CBicon";
  $("#" + id).append(pIcon);

  let pText = document.createElement("p");
  pText.className = "customCheckButtonText";
  pText.innerHTML = text;
  $("#" + id).append(pText);

  if (defaultChecked) $("#" + id).addClass("selectedCB");
}

function createCheckButtonGroup(parentID, groupName, buttons) {
  let div = document.createElement("div");
  div.className = "buttonGroup";
  div.id = groupName;
  $(parentID).append(div);

  for (const b of buttons)
    createCustomCheckButton(
      "#" + groupName,
      b.id,
      b.text,
      b.callback,
      b.checked
    );
}
