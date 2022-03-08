class Label {
  constructor(xx, yy) {
    this.x = xx;
    this.y = yy;
    this.scale = 1;
    this.id = newID();
    this.jax = null;
    this.setText("label");
  }

  setText(newText) {
    let self = this;
    // Disable relevant stylebar buttons

    // Render the latex
    MathJax.texReset();
    let options = MathJax.getMetricsFor($("#drawingArea")[0]);
    options.display = true;
    MathJax.tex2svgPromise(newText, options).then(function (node) {
      // Draw the text to the canvas
      self.jax = node;
      MathJax.startup.document.clear();
      MathJax.startup.document.updateDocument();
    }).catch(function (err) {
      //
      //  If there was an error, make the label be !!!
      //
      self.setText("!!!");
    }).then(function () {
      //
      //  Error or not, re-enable the display and render buttons
      //
        // console.log("from promise: ", labels[0].jax.children[0]);
      updateStyleBar();
      drawScreen();
    });
  }
}
