(function() {

  var sample = window.sample || {};
  window.sample = sample;

  var ID = Math.round(6 * Math.random() + 2);

  /**
   * Main visual class
   * @param { number } numVertices - number of Vertices (number of squares)
   */
  sample.MainVisualWithDatGUI = function (numVertices) {

    // number of vertices = number of squares
    this.numVertices = numVertices || 10000;

    // animation applicability
    // There are 3 animations defined in the vertex shader
    // value to switch between them
    this.animationValue0 = 1;
    this.animationValue1 = 0;
    this.animationValue2 = 0;
    this.animationValue3 = 0;
    this.animationValue4 = 0;
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
   * Initialize
   */
  sample.MainVisualWithDatGUI.prototype.init = function() {
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
    this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 10, 1000);
    this.camera.position.set(0, 0, 100);

    // controls
    // Unless this.renderer.domElement is specified as the second argument, dat.gui's GUI cannot be operated properly
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

    // window resize event
    this.$window.on('resize', function(e) {
      // execute resize method
      self.resize();
    });

    // Initialize Triangles that extends THREE.Mesh
    // When the asynchronous processing ends, fire the resize event and start the animation
    this.initTriangles();
    // Resize the canvas size by firing the resize event
    self.$window.trigger('resize');

    // start animation
    self.start();
  }

  /**
   * Initialize triangles
   */
  sample.MainVisualWithDatGUI.prototype.initTriangles = function() {
    var self = this;
    // Triangles instantiation
    self.Triangles = new sample.Triangles(
      self.numVertices,
    );

    self.scene.add(self.Triangles);

    // Generate GUI for dat.gui
    self.createDatGUIBox();

    document.addEventListener('mousemove', function(e){
      let scale = 0.0005;
      orbit.rotateY( e.movementX * scale );
      orbit.rotateX( e.movementY * scale ); 
      orbit.rotation.z = 0; //this is important to keep the camera level..
    })
    
    //the camera rotation pivot
    orbit = new THREE.Object3D();
    orbit.rotation.order = "YXZ"; //this is important to keep level, so Z should be the last axis to rotate in order...
    orbit.position = (0, 0, 0);
    self.scene.add(orbit);
    
    //offset the camera and add it to the pivot
    orbit.add(self.camera);

    return self.Triangles;
  }

  /**
   * start animation
   */
  sample.MainVisualWithDatGUI.prototype.start = function() {
    var self = this;

    var enterFrameHandler = function() {
      requestAnimationFrame(enterFrameHandler);
      self.update();
    };

    enterFrameHandler();
    //this.rotateAnimations(4)
  }

  /**
   * Runs inside the animation loop
   */
  sample.MainVisualWithDatGUI.prototype.update = function() {
    this.controls.update();
    this.Triangles.update(this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize processing
   * @param { jQuery.Event } e - jQuery event object
   */
  sample.MainVisualWithDatGUI.prototype.resize = function() {
    this.width = this.$window.width();
    this.height = this.$window.height();

    // Perform resizing of TrackballControls
    this.controls.handleResize();

    // update camera settings
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    // Update WebGLRenderer settings
    this.renderer.setSize(this.width, this.height);
  }


  sample.MainVisualWithDatGUI.prototype.createDatGUIBox = function() {
    var self = this;

    // dat.gui
    var gui = new dat.GUI()

    // Place a button to animate the value
    // Clicking each will call the animation1, animation2, animation3 methods
    gui.add(this, 'animation0');
    gui.add(this, 'animation1');
    gui.add(this, 'animation2');
    gui.add(this, 'animation3');
    gui.add(this, 'animation4');
    gui.add(this, 'animation5');
    gui.add(this, 'animation6');
    gui.add(this, 'animation7');
    gui.add(this, 'animation8');
    gui.add(this, 'animation9');
    gui.add(this, 'animation10');
  }
  sample.MainVisualWithDatGUI.prototype.animation0 = function() {
    this.animate(0);
  }
  sample.MainVisualWithDatGUI.prototype.animation1 = function() {
    this.animate(1);
  }
  sample.MainVisualWithDatGUI.prototype.animation2 = function() {
    this.animate(2);
  }
  sample.MainVisualWithDatGUI.prototype.animation3 = function() {
    this.animate(3);
  }
  sample.MainVisualWithDatGUI.prototype.animation4 = function() {
    this.animate(4);
  }
  sample.MainVisualWithDatGUI.prototype.animation5 = function() {
    this.animate(5);
  }
  sample.MainVisualWithDatGUI.prototype.animation6 = function() {
    this.animate(6);
  }
  sample.MainVisualWithDatGUI.prototype.animation7 = function() {
    this.animate(7);
  }
  sample.MainVisualWithDatGUI.prototype.animation8 = function() {
    this.animate(8);
  }  
  sample.MainVisualWithDatGUI.prototype.animation9 = function() {
    this.animate(9);
  }
  sample.MainVisualWithDatGUI.prototype.animation10 = function() {
    this.animate(10);
  }

  /**
   * Change animationValue
   * @param {number} index - 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8? (animationValue)
   */
  sample.MainVisualWithDatGUI.prototype.animate = function(index) {
    if (this.animateTween) {
      this.animateTween.kill();
    }

    var self = this;

    this.animateTween = TweenMax.to(this, 2.5, {
      overwrite: false, 
      ease: Linear.easeNone,
      animationValue0: (index == 0) ? 1 : 0,
      animationValue1: (index == 1) ? 1 : 0,
      animationValue2: (index == 2) ? 1 : 0,
      animationValue3: (index == 3) ? 1 : 0,
      animationValue4: (index == 4) ? 1 : 0,
      animationValue5: (index == 5) ? 1 : 0,
      animationValue6: (index == 6) ? 1 : 0,
      animationValue7: (index == 7) ? 1 : 0,
      animationValue8: (index == 8) ? 1 : 0,
      animationValue9: (index == 9) ? 1 : 0,
      animationValue10: (index == 10) ? 1 : 0,
      onUpdate: function () {
        self.Triangles.setUniform('animationValue0', self.animationValue0);
        self.Triangles.setUniform('animationValue1', self.animationValue1);
        self.Triangles.setUniform('animationValue2', self.animationValue2);
        self.Triangles.setUniform('animationValue3', self.animationValue3);
        self.Triangles.setUniform('animationValue4', self.animationValue4);
        self.Triangles.setUniform('animationValue5', self.animationValue5);
        self.Triangles.setUniform('animationValue6', self.animationValue6);
        self.Triangles.setUniform('animationValue7', self.animationValue7);
        self.Triangles.setUniform('animationValue8', self.animationValue8);
        self.Triangles.setUniform('animationValue9', self.animationValue9);
        self.Triangles.setUniform('animationValue10', self.animationValue10);
      }
    });
  }

  sample.MainVisualWithDatGUI.prototype.animation = function(i) {
    this.animate(i);
  }

  sample.MainVisualWithDatGUI.prototype.changeID = function() {
    var self = this;

    () => self.animation(5);
    setTimeout(self.changeID, 1000)
    switch (ID) {
      case 7:
        self.animation(ID);
        break;
      case 2:
        self.animation(ID);
        break;
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
      default:
        self.animation(4);
        break;
    }

    ID = Math.round(6 * Math.random() + 2);
  }

})();