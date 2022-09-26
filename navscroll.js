// nav bar color change on scroll---------------------------------------
window.onscroll = () => {
    const nav = document.querySelector('#main-nav');
    if(this.scrollY <= 200) nav.className = ''; else nav.className = 'scroll';
};

// nav bar color sets properly on reload if <= 200 ---------------------
$(document).ready(function () {
  const nav = document.querySelector('#main-nav');
  if(this.scrollY >= 200) nav.className = 'scroll'; else nav.className = '';
});

// scroll on reload ----------------------------------------------------
$(document).ready(function () {
  if (window.location.hash) {
    var initial_nav = window.location.hash;
    if ($(initial_nav).length) {
      var scrollto = $(initial_nav).offset().top - scrolltoOffset;
      $('html, body').animate({
        scrollTop: scrollto
      }, 1500, 'easeInOutExpo');
    }
  }
});



