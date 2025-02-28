(function () {

  var sample = window.sample || {};
  window.sample = sample;

  var currentAnimationValue = 1000;
  var currentInterval = 1000;
  var previouslyHovering = false;
  var hovering = false; // flag to track mouse hover state

  /**
   * Main visual class
   * @param { number } numVertices - number of Vertices (number of squares)
   */
  sample.MainVisual = function (numVertices) {

    // number of vertices = number of squares
    this.numVertices = numVertices || 10000;

    // animation applicability
    // There are many animations defined in the vertex shader
    // value to switch between them
    this.animationValue0 = 0;
    this.animationValue1 = 0;
    this.animationValue2 = 0;
    this.animationValue3 = 0;
    this.animationValue4 = 1;
    this.animationValue5 = 0;
    this.animationValue6 = 0;
    this.animationValue7 = 0;
    this.animationValue8 = 0;
    this.animationValue9 = 0;
    this.animationValue10 = 0;

    // initialize
    this.init();
  }

  /**
   * Initialize the Main Visual
   */
  sample.MainVisual.prototype.init = function () {
    var self = this;

    this.$window = $(window);

    // get div#main
    this.$mainVisual = $('#main');

    // webGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$mainVisual.find('canvas').get(0),
      alpha: true,
      antialias: true
    });

    // high resolution display support (2x is max)
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pixelRatio);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, 100);

    // window resize event
    this.$window.on('resize', function (e) {
      self.resize();
    });


    this.initTriangles()
    self.$window.trigger('resize');

    $(document).on('mousemove', function (event) {
      self.checkHover(event);
    });

    setInterval(() => self.changeID(), 100); // check every tenth of a second

    self.start();
  }

  /**
   * Initialize triangles
   */
  sample.MainVisual.prototype.initTriangles = function () {
    var self = this;
    self.Triangles = new sample.Triangles(
      self.numVertices,
    );

    self.Triangles.name = "Triangles"; // for withdrawal later
    self.scene.add(self.Triangles);
    console.log(self.scene.children); // Debug all objects in the scene


    document.addEventListener('mousemove', function (e) {
      let scale = 0.0005;
      orbit.rotateY(e.movementX * scale);
      orbit.rotateX(e.movementY * scale);
      orbit.rotation.z = 0; //this is important to keep the camera level
    })

    //the camera rotation pivot
    orbit = new THREE.Object3D();
    orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order
    orbit.position = (0, 0, 0);
    self.scene.add(orbit);

    //offset the camera and add it to the pivot
    orbit.add(self.camera);

    return self.Triangles;
  }

  /**
   * Start animation
   */
  sample.MainVisual.prototype.start = function () {
    var self = this;

    var enterFrameHandler = function () {
      requestAnimationFrame(enterFrameHandler);
      self.update();
    };

    enterFrameHandler();
  }

  /**
   * Runs inside the animation loop
   */
  sample.MainVisual.prototype.update = function () {
    this.Triangles.update(this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize processing
   * @param { jQuery.Event } e - jQuery event object
   */
  sample.MainVisual.prototype.resize = function () {
    this.width = this.$window.width();
    this.height = this.$window.height();

    // update camera settings
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // update WebGLRenderer settings
    this.renderer.setSize(this.width, this.height);
  }

  /**
   * Am I hovering within the specified bounds?
   * @param {*} event
   */
  sample.MainVisual.prototype.checkHover = function (event) {
    var windowWidth = this.$window.width();
    var windowHeight = this.$window.height();

    var minX = windowWidth * 0.35;  
    var maxX = windowWidth * 0.65;  
    var minY = windowHeight * 0.25; 
    var maxY = windowHeight * 0.75; 

    var mouseX = event.clientX;
    var mouseY = event.clientY;

    hovering = (mouseX > minX && mouseX < maxX && mouseY > minY && mouseY < maxY);
  };

  /**
   * Change animationValue
   * @param {number} index - 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10? (animationValue)
   */
  sample.MainVisual.prototype.animate = function (index) {
    if (this.animateTween) {
      this.animateTween.kill(); // kill any existing animation
    }

    var self = this;

    // transition all animation values to 0 first
    let resetValues = {};
    for (let i = 0; i <= 9; i++) {
      resetValues[`animationValue${i}`] = 0;
    }
    resetValues[`animationValue0`] = 1
    this.animateTween = TweenMax.to(this, 2.5, {
      overwrite: false,
      ease: Power1.easeIn,
      ...resetValues,
      onUpdate: function () {
        for (let i = 0; i <= 9; i++) {
          self.Triangles.setUniform(`animationValue${i}`, self[`animationValue${i}`]);
        }
      },
      onComplete: function () {
        // after transition to 0, start transition to the desired animation index
        let targetValues = {};
        for (let i = 0; i <= 9; i++) {
          targetValues[`animationValue${i}`] = i === index ? 1 : 0;
        }

        TweenMax.to(self, 2.5, {
          overwrite: false,
          ease: Linear.easeNone,
          ...targetValues,
          onUpdate: function () {
            for (let i = 0; i <= 9; i++) {
              self.Triangles.setUniform(`animationValue${i}`, self[`animationValue${i}`]);
            }
          }
        });
      }
    });
  };

  // Function to handle the number tile click or key press
  function setAnimationValue(value) {
    currentAnimationValue = value;
    self.animate(value);
  }

  // Function to handle key press for numbers (1-9)
  function handleKeyPress(event) {
    if (event.key >= '1' && event.key <= '9') {
      const value = parseInt(event.key);
      setAnimationValue(value);
    }
  }

  // Set up event listener for key presses
  document.addEventListener("keydown", handleKeyPress);

/**
 * Handles animation pattern changes
 */
sample.MainVisual.prototype.changeID = function () {
  var self = this;
  var date = new Date();
  var currentSeconds = date.getTime() / 1000; 
  var interval = Math.floor(currentSeconds); 

  if (hovering) {
    if (currentAnimationValue == 0) {
      let canvas = document.getElementById("canvas");
      let x = canvas.clientWidth;
      let y = canvas.clientHeight;
      let scaleFactor = 1 + .1 * (x / y); // scale by aspect ratio
      canvas.style.width = `${x * scaleFactor}px`;
      canvas.style.height = `${y * scaleFactor}px`;
    }
    if (currentInterval < interval - 10 || currentAnimationValue == 0) {
      document.querySelectorAll('.animationValue').forEach(el => el.classList.remove('active'));

      currentInterval = interval;
      do {
        newAnimationValue = Math.floor(Math.random() * (9)) + 1;
      } while (newAnimationValue == currentAnimationValue)
      currentAnimationValue = newAnimationValue;
      self.animate(currentAnimationValue);
      let activeElement = document.querySelector(`.animationValue:nth-child(${currentAnimationValue + 1})`);
      if (activeElement) {
        activeElement.classList.add('active');
      }
    }
    previouslyHovering = true;

  } else {
    if (previouslyHovering) {
      document.querySelectorAll('.animationValue').forEach(el => el.classList.remove('active'));
      let activeElement = document.querySelector(`.animationValue:nth-child(${0 + 1})`);
      if (activeElement) {
        activeElement.classList.add('active');
      }
      
      if (currentAnimationValue != 0) {
        currentAnimationValue = 0;
        self.animate(0);
      }
      document.getElementById("canvas").style.width = "100%";
      document.getElementById("canvas").style.height = "100%";
      previouslyHovering = false;
    }
    else {
      if (!document.querySelector('.animationValue').dataset.listener) {
        document.querySelectorAll('.animationValue').forEach(element => {
          element.dataset.listener = true; // Mark it so we don't add twice
          element.addEventListener('click', function () {
            let value = parseInt(this.textContent.trim(), 10);
            

            document.querySelectorAll('.animationValue').forEach(el => {
              el.classList.remove('active');            
            });

          this.classList.add('active');

          self.animate(value);
          });
        });
      }
      // i want to allow users to click the number and pass that value into self.animate()
    }
    
  }
};

}) ();