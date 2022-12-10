/** assorted files for the main graphic of the site: 

A little explanation for engineers.

The main visual is built with WebGL (three.js). 
The 3D object in the form of the logo was not modeled, but constructed programmatically. 
It's a combination of rectangular parallelepipeds, so it's not that complicated.

However, I didn't use the BoxGeometry, 
and instead added the vertices myself to the InstancedBufferGeometry because I wanted to transform the polygons apart.
And I wanted to move even the disjointed triangles, so I built voxels. 
So the number of vertices is much higher than using BoxGeometry to create the same shape.

After that, I move in units of polygons, move in units of cubes, and move in units of vertices.
All vertex coordinate calculations are done without shaders. This is a technique called GPGPU.

As for how GPGPU controls transforms, all animation patterns are written in the vertex shader. 
The coefficients determine which animations to apply. A simple example is described below.

In the default state, animationParam1 is set to 1 and animationParam2 is set to 0. 
When only pattern 1 is applied, when transforming from pattern 1 to pattern 2, set animationParam1 to 0 and animationParam1 to 1. 
At the same time, the process of gradually changing the By doing so, you can seamlessly transition between the two animation patterns.

Actually, it's much more complicated than this because it includes easing processing, noise, and time difference processing, 
but it's troublesome, so I'll omit it.

*/

(function() {

  var sample = window.sample || {};
  window.sample = sample;

  var ID = Math.round(6 * Math.random() + 2);

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
    this.animationValue1 = 1;
    this.animationValue2 = 0;
    this.animationValue3 = 0;
    this.animationValue4 = 0;
    this.animationValue5 = 0;
    this.animationValue6 = 0;
    this.animationValue7 = 0;
    this.animationValue8 = 0;

    // initialize
    this.init();
  }

  /**
   * Initialize
   */
  sample.MainVisual.prototype.init = function() {
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

    // rotate animations
    setInterval(() => self.changeID(), 15000);

    // start animation
    self.start();
  }

  /**
   * Initialize triangles
   */
  sample.MainVisual.prototype.initTriangles = function() {
    var self = this;
    // Triangles instantiation
    self.Triangles = new sample.Triangles(
      self.numVertices,
    );

    self.scene.add(self.Triangles);

    // Generate GUI for dat.gui
    self.createDatGUIBox();

    return self.Triangles;
  }

  /**
   * start animation
   */
  sample.MainVisual.prototype.start = function() {
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
  sample.MainVisual.prototype.update = function() {
    this.controls.update();
    this.Triangles.update(this.camera);
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Resize processing
   * @param { jQuery.Event } e - jQuery event object
   */
  sample.MainVisual.prototype.resize = function() {
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

  /**
   * dat.gui
   * define controller for dat.gui
   
  sample.MainVisual.prototype.createDatGUIBox = function() {
    var self = this;

    // dat.gui
    var gui = new dat.GUI()

    // Place a button to animate the value
    // Clicking each will call the animation1, animation2, animation3 methods
    gui.add(this, 'animation1');
    gui.add(this, 'animation2');
    gui.add(this, 'animation3');
    gui.add(this, 'animation4');
    gui.add(this, 'animation5');
    gui.add(this, 'animation6');
    gui.add(this, 'animation7');
    gui.add(this, 'animation8');
  }
  
  sample.MainVisual.prototype.animation1 = function() {
    this.animate(1);
  }
  sample.MainVisual.prototype.animation2 = function() {
    this.animate(2);
  }
  sample.MainVisual.prototype.animation3 = function() {
    this.animate(3);
  }
  sample.MainVisual.prototype.animation4 = function() {
    this.animate(4);
  }
  sample.MainVisual.prototype.animation5 = function() {
    this.animate(5);
  }
  sample.MainVisual.prototype.animation6 = function() {
    this.animate(6);
  }
  sample.MainVisual.prototype.animation7 = function() {
    this.animate(7);
  }
  sample.MainVisual.prototype.animation8 = function() {
    this.animate(8);
  }
  */

  /**
   * Change animationValue
   * @param {number} index - 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8? (animationValue)
   */
  sample.MainVisual.prototype.animate = function(index) {
    if (this.animateTween) {
      this.animateTween.kill();
    }

    var self = this;

    this.animateTween = TweenMax.to(this, 2, {
      overwrite: true, 
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
      onUpdate: function () {
        self.Triangles.setUniform('animationValue1', self.animationValue1);
        self.Triangles.setUniform('animationValue2', self.animationValue2);
        self.Triangles.setUniform('animationValue3', self.animationValue3);
        self.Triangles.setUniform('animationValue4', self.animationValue4);
        self.Triangles.setUniform('animationValue5', self.animationValue5);
        self.Triangles.setUniform('animationValue6', self.animationValue6);
        self.Triangles.setUniform('animationValue7', self.animationValue7);
        self.Triangles.setUniform('animationValue8', self.animationValue8);
      }
    });
  }

  sample.MainVisual.prototype.animation = function(i) {
    this.animate(i);
  }

  sample.MainVisual.prototype.changeID = function() {
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

    ID = Math.round(5 * Math.random() + 2);
  }

})();