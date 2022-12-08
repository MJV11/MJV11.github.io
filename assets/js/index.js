(function() {

  var sample = window.sample || {};
  window.sample = sample;


  $(function() {
    new sample.MainVisual();
  });

  document.getElementById("navabout").onclick = function() {
    document.getElementById("about").style.display = "flex";
    document.getElementById("works").style.display = "none";
  }

  document.getElementById("navmain").onclick = function() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "none";
  }

  document.getElementById("navworks").onclick = function() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "flex";
  }

})();
