// Typing Script with Cursor @ Max Vink

var TxtRotate = function(el, toRotate, period) {
  
  // typing variables
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 8) || 1800 ; // fully built time period
  this.txt = '';
  this.tick();
  this.isDeleting = false;
  self.blinking = false;
};
  
TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  // typing implementation    
  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
  var that = this;
  var delta = 190 - Math.random() * 100; // typing speed
  
  // delete function implementation
  if (this.isDeleting) { delta /= 2; }
 
  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;

    delta = 500; // deleting speed
  }
 
  setTimeout(function() {
    that.tick();
  }, delta);
};

  
window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS (Replaced with CSS element)
  // var css = document.createElement("style");
  // css.type = "text/css";
  // css.innerHTML = ".txt-rotate > .wrap { border-right: 0.06em solid transparent }"; // typing cursor
  // document.body.appendChild(css);
};
