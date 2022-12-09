(function() {

  var sample = window.sample || {};
  window.sample = sample;
  var navIsBottom = true;

  // nav bar color change on scroll---------------------------------------
  window.onscroll = () => {
    const nav = document.querySelector('#navbar');
    if (this.scrollY <= 650) {
      if (navIsBottom) {
        nav.className = "navbar"
      } else {
        nav.className = 'navbarscrolltrigger'; 
      }
    } else {
      nav.className = 'scrolled';
    } 
  };

  // change nav on nav nav
  function globalNavTop(isOn) {
    const nav = document.querySelector('#navbar');
    navIsBottom = !isOn;
    if (isOn) {
      nav.className = 'navbarscrolltrigger';
      //document.getElementById("logo").style.display = "normal";
    } else {
      nav.className = 'navbar';
      //document.getElementById("logo").style.display = "none";
    }
  }

  $(function() {
    new sample.MainVisual();
  });

  document.getElementById("navabout").onclick = function() {
    document.getElementById("about").style.display = "flex";
    document.getElementById("works").style.display = "none";
    document.getElementById("scrolldownwords").style.display = "flex";
    document.getElementById("scrolldownarrow").style.display = "flex";
    globalNavTop(true);
  }

  document.getElementById("navmain").onclick = function() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "none";
    document.getElementById("scrolldownwords").style.display = "none";
    document.getElementById("scrolldownarrow").style.display = "none";
    globalNavTop(false);
  }
  
  document.getElementById("logo").onclick = function() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "none";
    document.getElementById("scrolldownwords").style.display = "none";
    document.getElementById("scrolldownarrow").style.display = "none";
    globalNavTop(false);
  }

  document.getElementById("navworks").onclick = function() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "flex";
    document.getElementById("scrolldownwords").style.display = "flex";
    document.getElementById("scrolldownarrow").style.display = "flex";
    globalNavTop(true);
  }

  

})();
