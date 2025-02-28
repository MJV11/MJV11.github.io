(function() {

  //notes for programmatic construction
  // end peieces 3X4X3 (lines thicker than they are tall, gives depth to the shape)
  // gaps x1
  //

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
      document.getElementById("animationBox").style.display = "none";
    } else {
      nav.className = 'navbar';
      document.getElementById("animationBox").style.display = "flex";
    }
  }

  // create graphic
  $(function() {
    new sample.MainVisual();
  });

  // change masthead on nav navigation
  document.getElementById("navabout").onclick = function() {
    document.getElementById("about").style.display = "flex";
    document.getElementById("works").style.display = "none";
    isSectionMain(false);
    displaySection(2);
  }

  document.getElementById("navworks").onclick = function() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "flex";
    displaySection(1);
    isSectionMain(false);
  }

  document.getElementById("navmain").onclick = function() {
    mainMenu();
  }
  
  document.getElementById("logo").onclick = function() {
    mainMenu();
  }

  // encapsulate main menu init
  function mainMenu() {
    document.getElementById("about").style.display = "none";
    document.getElementById("works").style.display = "none";
    isSectionMain(true);
    displaySection(0);
  }

  // encapsulate masthead init
  function isSectionMain(i) {
    if (i) {
      document.getElementById("scrolldownwords").style.display = "none";
      document.getElementById("scrolldownarrow").style.display = "none";
      document.getElementById("masthead-tagline").style.display = "block";
      globalNavTop(false);
    } else {
      document.getElementById("scrolldownwords").style.display = "flex";
      document.getElementById("scrolldownarrow").style.display = "flex";
      document.getElementById("masthead-tagline").style.display = "none";
      globalNavTop(true);
    }
  }

  // display what section
  function displaySection(n) {
    let pageID = ["masthead-name", "masthead-works", "masthead-about"]
    for (i = 0; i < pageID.length; i++) {
      if (i == n) {
        document.getElementById(pageID[i]).style.display = "block";
      } else {
        document.getElementById(pageID[i]).style.display = "none";
      }
    }
  }


})();
