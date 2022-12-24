(function () {

  var sample = window.sample || {};
  window.sample = sample;

  var ID = 9;
  var old = 9;


  /**
   * Main visual class
   * @param { number } numVertices - number of Vertices (number of squares)
   */
  sample.MainVisual = function (numVertices) {

    // number of vertices = number of squares
    this.numVertices = numVertices || 10000;

    // animation applicability
    // There are 3 animations defined in the vertex shader
    // value to switch between them
    this.animationValue1 = 0;
    this.animationValue2 = 0;
    this.animationValue3 = 0;
    this.animationValue4 = 0;
    this.animationValue5 = 0;
    this.animationValue6 = 0;
    this.animationValue7 = 0;
    this.animationValue8 = 0;
    this.animationValue9 = 1;

    // initialize
    this.init();
  }

  /**
   * Initialize
   */
  sample.MainVisual.prototype.init = function () {
    var self = this;

    this.$window = $(window);

    // get div#main
    this.$mainVisual = $('#main');

    // webGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.$mainVisual.find('canvas').get(0),   // #contents on HTML > #main > specify HTMLElement of canvas
      alpha: true,
      antialias: true
    });

    // High resolution display support (2x is max)
    var pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(pixelRatio);

    // scene
    this.scene = new THREE.Scene();

    // camera
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 1, 1000);
    this.camera.position.set(0, 0, 100);

    // window resize event
    this.$window.on('resize', function (e) {
      // execute resize method
      self.resize();
    });

    // Initialize Triangles, which extends THREE.Mesh
    // When the asynchronous processing ends, fire the resize event and start the animation
    this.initTriangles()
    // Resize the canvas size by firing the resize event
    self.$window.trigger('resize');


    // rotate animations
    // done like this to escape incorrect binding
    setInterval(() => self.changeID(), 8000);

    // start animation
    self.start();

  }

  /**
   * Initialize triangles
   */
  sample.MainVisual.prototype.initTriangles = function () {
    var self = this;
    // Triangles instantiation
    self.Triangles = new sample.Triangles(
      self.numVertices,
    );

    self.scene.add(self.Triangles);

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
   * start animation
   */
  sample.MainVisual.prototype.start = function () {
    var self = this;

    var enterFrameHandler = function () {
      requestAnimationFrame(enterFrameHandler);
      self.update();
    };

    enterFrameHandler();
    //this.rotateAnimations(4)
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

    // Update WebGLRenderer settings
    this.renderer.setSize(this.width, this.height);
  }

  /**
   * Change animationValue
   * @param {number} index - 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8? (animationValue)
   */
  sample.MainVisual.prototype.animate = function (index) {
    if (this.animateTween) {
      this.animateTween.kill();
    }

    var self = this;

    this.animateTween = TweenMax.to(this, 3, {
      overwrite: false,
      value: 10,
      ease: Linear.easeNone,
      animationValue1: (index == 1) ? 1 : 0,
      animationValue2: (index == 2) ? 1 : 0,
      animationValue3: (index == 3) ? 1 : 0,
      animationValue4: (index == 4) ? 1 : 0,
      animationValue5: (index == 5) ? 1 : 0,
      animationValue6: (index == 6) ? 1 : 0,
      animationValue7: (index == 7) ? 1 : 0,
      animationValue8: (index == 8) ? 1 : 0,
      animationValue9: (index == 9) ? 1 : 0,
      onUpdate: function () {
        self.Triangles.setUniform('animationValue1', self.animationValue1);
        self.Triangles.setUniform('animationValue2', self.animationValue2);
        self.Triangles.setUniform('animationValue3', self.animationValue3);
        self.Triangles.setUniform('animationValue4', self.animationValue4);
        self.Triangles.setUniform('animationValue5', self.animationValue5);
        self.Triangles.setUniform('animationValue6', self.animationValue6);
        self.Triangles.setUniform('animationValue7', self.animationValue7);
        self.Triangles.setUniform('animationValue8', self.animationValue8);
        self.Triangles.setUniform('animationValue9', self.animationValue9);
      }
    });
  }

  sample.MainVisual.prototype.animation = function (i) {
    this.animate(i);
  }

  sample.MainVisual.prototype.changeID = function () {
    var self = this;
    if (ID == 9) {
      do {
        ID = Math.round(6 * Math.random() + 2.6);
      } while (ID == old);
      self.animation(9);
    } else {
      switch (ID) {
        case 3:
          self.animation(ID);
          break;
        case 4:
          self.animation(ID);
          break;
        case 5:
          self.animation(ID);
          break;
        case 6:
          self.animation(ID);
          break;
        case 7:
          self.animation(ID);
          break;
        case 8:
          self.animation(ID);
          break;
        default:
          self.animation(8);
          break;
      }
      old = ID;
      ID = 9;    
    }
  }

})();