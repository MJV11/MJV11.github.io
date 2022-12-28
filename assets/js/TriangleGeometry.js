(function () {

  var sample = window.sample || {};
  window.sample = sample;

  // create an array for attributes
  var logoVertices = [];    // logo logoVertices
  var identicalTriangles = [];   // shape logoVertices
  var triangleIndices = []; // triangle Indices
  var cubeIndices = []; // cube Indices
  var centerTriangles = []; // subtract this to center all cubes
  var cubeRandoms = []; // triangleIndices
  var ringIndices = [];     // ring triangleIndices
  var triangleRandoms = [];    // Random values ​​used for vertex calculation etc.
  var scale = -1.4;

  /**
   * Unique Geoemtry class that extends THREE.BufferGeometry
   * @param { number } numVertices - number of logoVertices (number of triangles)
   */
  sample.TriangleGeometry = function (numVertices) {
    THREE.BufferGeometry.call(this);
    this.numVertices = numVertices;
    this.init();
  }

  function map(value, inputMin, inputMax, outputMin, outputMax, clamp = false) {
    if (clamp == true) {
      if (value < inputMin) return outputMin;
      if (value > inputMax) return outputMax;
    }

    p = (outputMax - outputMin) / (inputMax - inputMin);
    return ((value - inputMin) * p) + outputMin;
  }

  sample.TriangleGeometry.prototype = Object.create(THREE.BufferGeometry.prototype, { value: { constructor: THREE.BufferGeometry } });


  function makeMV() {
    // 4 layers deep
    for (z = -2; z < 2; z++) {
      // M
      createHugeRectangle(8, 3, -14, 10, z); // top left - M - 24 cubes - 288 triangles
      createHugeRectangle(8, 3, -5, 10, z); // top left - M - 24 cubes - 288 triangles
      createHugeRectangle(3, 16, -14, -7, z); // left bar | M - 96 cubes - 1152 triangles
      createHugeRectangle(3, 16, 0, -7, z); // right bar | M - 96 cubes - 1152 triangles
      createHugeRectangle(3, 5, -7, 4, z); // middle bar | M - 15 cubes -- 180 triangles

      // V
      createHugeRectangle(3, 16, 4, -3, z); // left bar | V - 96 cubes - 1152 triangles
      createHugeRectangle(3, 16, 11, -3, z); // right bar | V - 96 cubes - 1152 triangles
      createHugeRectangle(6, 3, 6, -7, z); // bottom bar - V - 18 cubes - 216 triangles

      // underlines
      createHugeRectangle(10, 3, 4, -11, z); // bar - V - 30 cubes - 360 triangles
      createHugeRectangle(17, 3, -14, -11, z); // bar - M  - 51 cubes - 612 triangles
      // 6412 trianglesx 3 layers deep
    }
  }

  function createHugeRectangle(length, height, startL, startH, z) {
    const first = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l) * scale);
      logoVertices.push((h + startH) * scale);
      logoVertices.push(z * scale);
    } // back top left
    const second =function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l + 1) * scale);
      logoVertices.push((h + startH) * scale);
      logoVertices.push(z * scale);
    } // back top right
    const third = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l) * scale);
      logoVertices.push((h + startH - 1) * scale);
      logoVertices.push(z * scale);
    } // back bottom left
    const fourth = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l + 1) * scale);
      logoVertices.push((h + startH - 1) * scale);
      logoVertices.push(z * scale);
    } // back bottom right
    const fifth = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l) * scale);
      logoVertices.push((h + startH) * scale);
      logoVertices.push((z + 1) * scale);
    } // front top left
    const sixth = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l + 1) * scale);
      logoVertices.push((h + startH) * scale);
      logoVertices.push((z + 1) * scale);
    } // front top right
    const seventh = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l) * scale);
      logoVertices.push((h + startH - 1) * scale);
      logoVertices.push((z + 1) * scale);
    } // front bottom left
    const eighth = function(startL, l, startH, h, z, scale) {
      logoVertices.push((startL + l + 1) * scale);
      logoVertices.push((h + startH - 1) * scale);
      logoVertices.push((z + 1) * scale);
    }  // front bottom right

    for (l = 0; l < length; l++) {
      for (h = 0; h < height; h++) {
        if (h === height - 1 || h === 0 || z === -2 || z === 1 || l === length - 1 || l === 0) {
          //triangle 1 - back facing, left top
          first(startL, l, startH, h, z, scale);
          third(startL, l, startH, h, z, scale);
          second(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 2 - back facing, right bottom
          third(startL, l, startH, h, z, scale);
          fourth(startL, l, startH, h, z, scale);
          second(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 3 - top, left top
          first(startL, l, startH, h, z, scale);
          fifth(startL, l, startH, h, z, scale);
          second(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 4 - top, bottom right
          fifth(startL, l, startH, h, z, scale);
          sixth(startL, l, startH, h, z, scale);
          second(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 5 - front facing, left top
          fifth(startL, l, startH, h, z, scale);
          seventh(startL, l, startH, h, z, scale);
          sixth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 6 - front facing, right bottom
          seventh(startL, l, startH, h, z, scale);
          eighth(startL, l, startH, h, z, scale);
          sixth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 7 - bottom facing, left top
          third(startL, l, startH, h, z, scale);
          seventh(startL, l, startH, h, z, scale);
          fourth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 8 - bottom facing, right bottom
          seventh(startL, l, startH, h, z, scale);
          eighth(startL, l, startH, h, z, scale);
          fourth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 9 - left facing, left top
          first(startL, l, startH, h, z, scale);
          third(startL, l, startH, h, z, scale);
          fifth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 10 - left facing, right bottom
          third(startL, l, startH, h, z, scale);
          seventh(startL, l, startH, h, z, scale);
          fifth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 11 - right facing, left top
          second(startL, l, startH, h, z, scale);
          fourth(startL, l, startH, h, z, scale);
          sixth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

          //triangle 12 - right facing, right bottom
          fourth(startL, l, startH, h, z, scale);
          eighth(startL, l, startH, h, z, scale);
          sixth(startL, l, startH, h, z, scale);
          addCenters(startH, startL, h, l, z);

        }
      }
    }
  }

  function addCenters(startH, startL, h, l, z) {
    for (i = 0; i < 3; i++) {
      triangleIndices.push(triangleIndices.length);
      cubeIndices.push(Math.trunc(cubeIndices.length / 36));
      centerTriangles.push((startL + l + .5) * scale);
      centerTriangles.push((startH + h + .5) * scale);
      centerTriangles.push((z + .5) * scale);
    }
  }
  /**
   * Initialize
   */
  sample.TriangleGeometry.prototype.init = function () {
    makeMV();

    // generate squares as many as this.numVertices
    for (var i = 0; i < triangleIndices.length; i++) {


      // random value for use with GLSL
      var randomValue = [
        map(Math.random(), 0, 1, -1, 1),
        map(Math.random(), 0, 1, -1, 1),
        map(Math.random(), 0, 1, -1, 1),
      ];


      // generate vertex data
      identicalTriangles.push(0);
      identicalTriangles.push(0);
      identicalTriangles.push(1 + .5 * Math.random());

      identicalTriangles.push(1.5 + Math.random() - .5);  // x (direction they go up)
      identicalTriangles.push(0);  // y (direction they go right)
      identicalTriangles.push(1 + .5 * Math.random());

      identicalTriangles.push(0);
      identicalTriangles.push(1.5 + Math.random() - .5);
      identicalTriangles.push(1 + .5 * Math.random());

      /** // Push the index to generate polygons 
      var indexOffset = i * 3; // * 2;

      triangleIndices.push(indexOffset + 0); // top left　na
      triangleIndices.push(indexOffset + 1); // bottom left　na
      triangleIndices.push(indexOffset + 2); // upper right　na
      */

      ringIndices.push(i); // need for ring generation for animation 2

      triangleRandoms.push(randomValue[0]);   // Random values ​​used in GLSL (three because vec3)
      triangleRandoms.push(randomValue[1]);   // Random values ​​used in GLSL (three because vec3)
      triangleRandoms.push(randomValue[2]);   // Random values ​​used in GLSL (three because vec3)

      ringIndices.push(i); // need for ring generation for animation 2

      triangleRandoms.push(randomValue[0]);   // Random values ​​used in GLSL (three because vec3)
      triangleRandoms.push(randomValue[1]);   // Random values ​​used in GLSL (three because vec3)
      triangleRandoms.push(randomValue[2]);   // Random values ​​used in GLSL (three because vec3)

      ringIndices.push(i); // need for ring generation for animation 2

      triangleRandoms.push(randomValue[0]);   
      triangleRandoms.push(randomValue[1]);   
      triangleRandoms.push(randomValue[2]);   

    }

    for (var i = 0; i < triangleIndices.length/24; i++) {
      var randomValue = [
        map(Math.random(), 0, 1, -1, 1),
        map(Math.random(), 0, 1, -1, 1),
        map(Math.random(), 0, 1, -1, 1),
      ];
      for (var j = 0; j < 72; j++) {
        cubeRandoms.push(randomValue[0]);   
        cubeRandoms.push(randomValue[1]);   
        cubeRandoms.push(randomValue[2]);
        //cubeIndices.push(i)  
      }
      
    }

    console.log(cubeIndices.length, ringIndices.length, triangleIndices.length, centerTriangles.length/3);

    // attributes
    this.addAttribute('position', new THREE.BufferAttribute(new Float32Array(logoVertices), 3));  // vec3 // the shape of the instanced buffer geometry
    this.addAttribute('identicalTriangles', new THREE.BufferAttribute(new Float32Array(identicalTriangles), 3));  // vec3 // the shape of the instanced buffer geometry
    this.addAttribute('triangleRandoms', new THREE.BufferAttribute(new Float32Array(triangleRandoms), 3));  // vec3 // the random places triangles go
    this.addAttribute('cubeRandoms', new THREE.BufferAttribute(new Float32Array(cubeRandoms), 3));  // vec3 // the random places cubes goes
    this.addAttribute('centerTriangles', new THREE.BufferAttribute(new Float32Array(centerTriangles), 3));  // vec3 // triangle centers
    this.addAttribute('triangleIndex', new THREE.BufferAttribute(new Uint16Array(triangleIndices), 1));  // index
    this.addAttribute('ringVIndex', new THREE.BufferAttribute(new Float32Array(ringIndices), 1));  // float
    this.addAttribute('cubeIndex', new THREE.BufferAttribute(new Float32Array(cubeIndices), 1));  // float
    // normals (also an attribute)
    this.computeVertexNormals();
  }
})();




