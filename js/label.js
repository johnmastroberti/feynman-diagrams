class Label {
  constructor(xx, yy) {
    this.x = xx;
    this.y = yy;
    this.scale = 2;
    this.id = newID();
    // this.jax = null;
    this.img = null;
    this.setText("p^\\mu");
  }

  setText(newText) {
    this.text = newText;
    let self = this;
    // Disable relevant stylebar buttons

    // Render the latex
    MathJax.texReset();
    let options = MathJax.getMetricsFor($("#drawingArea")[0]);
    options.display = true;
    const wrapper = MathJax.tex2svg(newText, options);
    const svg = wrapper.getElementsByTagName("svg")[0].outerHTML;
    let output = { svg: "", img: "" };
    this.img = new Image();
    this.img.src =
      "data:image/svg+xml;base64," +
      window.btoa(unescape(encodeURIComponent(svg)));
    this.img.onload = function () {
      self.w = self.scale * self.img.width;
      self.h = self.scale * self.img.height;
      drawScreen();
    };
    // MathJax.tex2svgPromise(newText, options).then(function (node) {
    //   // Draw the text to the canvas
    //   self.jax = node;
    //   MathJax.startup.document.clear();
    //   MathJax.startup.document.updateDocument();
    // }).catch(function (err) {
    //   //
    //   //  If there was an error, make the label be !!!
    //   //
    //   self.setText("!!!");
    // }).then(function () {
    //   //
    //   //  Error or not, re-enable the display and render buttons
    //   //
    //     // console.log("from promise: ", labels[0].jax.children[0]);
    //   updateStyleBar();
    //   drawScreen();
    // });
  }
}

function makeProperLabel(l) {
  let a = new Label(l.x, l.y);
  a.scale = l.scale;
  a.setText(l.text);
  return a;
}
