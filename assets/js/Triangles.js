/**
 * A huge thank you to Takumi Hasegawa, 
 * whose creations I sought to emulate as I learned both three.js and javascript
 * by recreating his amazing and awe-inspiring artwork,
 * albeit without the polish of his expertise
 */

(function () {

  var sample = window.sample || {};
  window.sample = sample;

  /**
   * Proprietary 3D object class that extends THREE.Mesh
   * @param {number} numVertices - number of characters (number of squares)
   */
  sample.Triangles = function (numVertices) {
    this.numVertices = numVertices;

    // instantiate a custom geometry object
    geometry = new sample.TriangleGeometry(this.numVertices);

    // RawShaderMaterial generated
    material = new THREE.RawShaderMaterial({
      // Non-character parts are transparent
      transparent: true,

      // draw both sides of the square
      side: THREE.DoubleSide,

      // define uniform variables to pass to shaders
      uniforms: {

        // Elapsed time Add each frame in the update method
        time: { type: '1f', value: 0 },

        // number of characters = number of squares
        numVertices: { type: '1f', value: this.numVertices },

        // animation applicability
        animationValue0: { type: '1f', value: 1 },
        animationValue1: { type: '1f', value: 0 },
        animationValue2: { type: '1f', value: 0 },
        animationValue3: { type: '1f', value: 0 },
        animationValue4: { type: '1f', value: 0 },
        animationValue5: { type: '1f', value: 0 },
        animationValue6: { type: '1f', value: 0 },
        animationValue7: { type: '1f', value: 0 },
        animationValue8: { type: '1f', value: 0 },
        animationValue9: { type: '1f', value: 0 },
        animationValue10: { type: '1f', value: 0 },
      },

      // how the triangles operate
      vertexShader: `
        // uniforms
        uniform mat4 modelMatrix; 
        uniform mat4 viewMatrix;  
        uniform mat4 projectionMatrix;  
        uniform vec3 cameraPosition;  
        uniform mat4 modelViewMatrix;

        // uniforms
        uniform float time;  
        uniform float numVertices;
        uniform float animationValue0;   
        uniform float animationValue1;  
        uniform float animationValue2;  
        uniform float animationValue3;  
        uniform float animationValue4;  
        uniform float animationValue5;  
        uniform float animationValue6;  
        uniform float animationValue7;  
        uniform float animationValue8;  
        uniform float animationValue9;  
        uniform float animationValue10;  

        // TriangleGeometry attributes
        attribute vec3 position;  
        attribute vec3 identicalTriangles;  
        attribute vec3 centerTriangles;  
        attribute vec3 triangleRandoms;  
        attribute vec3 cubeRandoms;  
        attribute vec3 normal;
        attribute float ringVIndex;  
        attribute float triangleIndex;
        attribute float cubeIndex;

        varying vec4 vColor; 

        // doesn't exist, must be defined
        const float PI = 3.1415926535897932384626433832795;

        // rotate vec3s
        vec3 rotateVec3(vec3 v, float angle, vec3 axis){
          vec3 a = normalize(axis);
          float s = sin(angle);
          float c = cos(angle);
          float scale = 1.0 - c;
          mat3 m = mat3(
            a.x * a.x * scale + c,
            a.y * a.x * scale + a.z * s,
            a.z * a.x * scale - a.y * s,
            a.x * a.y * scale - a.z * s,
            a.y * a.y * scale + c,
            a.z * a.y * scale + a.x * s,
            a.x * a.z * scale + a.y * s,
            a.y * a.z * scale - a.x * s,
            a.z * a.z * scale + c
          );
          return m * v;
        }

        float max(float a, float b, float c) {
          return max(a, max(b, c));
        }

        // doesn't exist, must be defined
        float map(float value, float inputMin, float inputMax, float outputMin, float outputMax, bool limit) {
          if(limit == true) {
            if(value < inputMin) return outputMin;
            if(value > inputMax) return outputMax;
          }

          float ratio = (outputMax - outputMin) / (inputMax - inputMin);
          return ((value - inputMin) * ratio) + outputMin;
        }

        // hsv to rgb
        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        float getAlpha(float distance) {
          float x = abs(distance - 400.0) / 500.0;
          return clamp(1.0 - x, 0.0, 1.0);
        }

        // time, scale, offset
        float getRad(float scale, float offset) {
          return map(mod(time * scale + offset, PI * 2.0), 0.0, PI * 2.0, -PI, PI, true);
        }

        float exponentialInOut(float t) {
          return t == 0.0 || t == 1.0
            ? t
            : t < 0.5
              ? +0.5 * pow(2.0, (20.0 * t) - 10.0)
              : -0.5 * pow(2.0, 10.0 - (t * 20.0)) + 1.0;
        }
        
        float getAnimationValue(float animationValue, float randomValue) {
          float p = clamp(-map(randomValue, -1.0, 1.0, 0.0, 0.6, true) + animationValue * 1.5, 0.0, 1.0);
          return exponentialInOut(p);
        }

        // main processing
        void main() {
          vec3 pos = position ;
          vec3 n = normal;
          float rad1, rad2; // speed of rotation, in radians

          float radius = 30.0;


          // ----------------------------------------------------------------------------------------
          // animation 0 - MV main
          // 
          //

          float Tween = exponentialInOut(animationValue0);
          if(Tween > 0.0) {
            rad1 = getRad(-3.0, 0.0);
            rad2 = getRad(5.0, 0.0);
            pos = rotateVec3(pos, Tween * rad1, vec3(1.0, 0, 0));
            pos = rotateVec3(pos, Tween * rad2, vec3(0, 1.0, 0));
            n = rotateVec3(n, Tween * rad1, vec3(1.0, 0, 0));
            n = rotateVec3(n, Tween * rad2, vec3(0, 1.0, 0));
            pos += (Tween * sin(getRad(200.0,  200.0)) * 0.06 * normalize(pos));
          }

          // ----------------------------------------------------------------------------------------
          // animation1 - billboard
          // 
          //
          
          Tween = getAnimationValue(animationValue1, triangleRandoms.x);
          if(Tween > 0.0) {
            pos -= centerTriangles;
            rad1 = getRad(4.0, (triangleRandoms.x + triangleRandoms.y + triangleRandoms.z) * 200.0);
            pos.z += radius + radius * map(sin(rad1), -1.0, 1.0, 0.0, 1.0, true);
            rad1 = getRad(4.0, triangleRandoms.x * 20.0 );
            pos = rotateVec3(pos, rad1, vec3(0.0, 1.0, 0.0));
            rad1 = getRad(4.0, triangleRandoms.y * 20.0);
            pos = rotateVec3(pos, rad1, vec3(0.0,0.0,1.0));
            rad1 = getRad(4.0, triangleRandoms.z * 20.0);
            pos = rotateVec3(pos, rad1, vec3(1.0, 0.0, 0.0));
          }

          // ----------------------------------------------------------------------------------------
          // animation2 -- sphere (small particles)
          // 
          //

          Tween = getAnimationValue(animationValue2, triangleRandoms.x);
          if(Tween > 0.0) {
            pos.z += radius * Tween;
            rad1 = getRad(6.0, triangleRandoms.x * 10.0);
            pos = rotateVec3(pos, rad1, vec3(0.0, 1.0, 0.0));
            rad1 = getRad(6.0, triangleRandoms.y * 10.0);
            pos = rotateVec3(pos, rad1, vec3(1.0, 0.0, 0.0));
            rad1 = getRad(6.0, triangleRandoms.z * 10.0);
            pos = rotateVec3(pos, rad1, vec3(0.0, 0.0, 1.0));
          }

          // ----------------------------------------------------------------------------------------
          // animation3 - rings
          // 
          //

          Tween = getAnimationValue(animationValue3, triangleRandoms.x);
          if(Tween > 0.0) {
            pos = identicalTriangles * Tween;

            float numRings = 8.0;  
            float ringIndex = mod(ringVIndex, numRings);  
            float numVerticesPerRing = numVertices / numRings; 

            float direction = map(mod(ringIndex, 2.0), 0.0, 1.0, -1.0, 1.0, true);

            rad1 = direction * getRad(10.0, PI * 2.0 / numVerticesPerRing * mod((ringVIndex - ringIndex) / numRings, numVerticesPerRing));

            pos.y += map(ringIndex, 0.0, numRings - 1.0, -2.0 * radius, 2.0 * radius, true) * Tween;        
            pos.z += 1.5 * radius;    
          
            pos = rotateVec3(pos, Tween * rad1, vec3(0.0, 1.0, 0.0));       
          }

          // ----------------------------------------------------------------------------------------
          // animation4 - vibrating shards
          // direction taken from @ takumi hasegawa #4
          //

          Tween = getAnimationValue(animationValue4, triangleRandoms.x);
          if(Tween > 0.0) {
            pos -= centerTriangles * Tween;
            if (mod(triangleIndex, 3.0) > 0.0) { 
              pos.z += (Tween * (4.0 * triangleRandoms.z * sin(triangleRandoms.z * 100.0))); // (Tween * initial size of the quill)
              pos = rotateVec3(pos, Tween * getRad(10.0, triangleRandoms.x * 10.0), vec3(1.0, 0, 0));
              pos = rotateVec3(pos, Tween * getRad(10.0, triangleRandoms.y * 10.0), vec3(0, 1.0, 0));
              pos += (Tween * sin(getRad(60.0, triangleRandoms.z * 60.0)) * triangleRandoms.z * 20.0 * normalize(pos)); // (Tween *  speed of size change * maximum height *)
            }
          }

          // ----------------------------------------------------------------------------------------
          // animation 5 - sphere (tangential particles)
          // direction taken from @ takumi hasegawa #5
          // 

          Tween = getAnimationValue(animationValue5, triangleRandoms.x);
          if(Tween > 0.0) {
              pos -= (pos - normalize(pos) * 3.0) * Tween; // 3.0 makes everything bigger
              rad1 = getRad(10.0, triangleRandoms.x * 10.0);
              rad2 = getRad(10.0, triangleRandoms.y * 10.0); // rad relates to the speed of the rotation
              pos = rotateVec3(pos, Tween * rad1, vec3(1.0, 0, 0));
              pos = rotateVec3(pos, Tween * rad2, vec3(0, 1.0, 0));
              n = rotateVec3(n, Tween * rad1, vec3(1.0, 0, 0));
              n = rotateVec3(n, Tween * rad2, vec3(0, 1.0, 0));
              pos = ((Tween * sin(getRad(10.0, triangleRandoms.z * 10.0)) + .5 * triangleRandoms.z) * 20.0 * normalize(pos)); // 30.0 makes everything bigger, first 10 increases speed of oscillation
          }

          // ----------------------------------------------------------------------------------------
          // animation 6 - cube within a cube within a cube (cube cubed)
          // credit @ takumi hasegawa #6
          //

          Tween = getAnimationValue(animationValue6, triangleRandoms.x);
          if(Tween > 0.0) {
            pos -= centerTriangles * Tween;
            rad1 = getRad(30.0, triangleRandoms.x * 10.0);
            rad2 = getRad(30.0, triangleRandoms.y * 10.0);
            pos = rotateVec3(pos, Tween * rad1, vec3(1.0, 0, 0));
            pos = rotateVec3(pos, Tween * rad2, vec3(0, 1.0, 0));
            float tIndex = floor(triangleIndex / 3.0);
            float cubeIndex = mod(mod(tIndex, 7.0), 3.0);
            float size = 8.0 + cubeIndex * 8.0;
            float t = mod(time * 7.0 + triangleRandoms.z * 10.0, 4.0);
            pos.x += (map(t, 0.0, 1.0, -1.0, 1.0, true) * size * Tween - size * Tween);
            pos.y += (map(t, 1.0, 2.0, -1.0, 1.0, true) * size * Tween - size * Tween);
            pos.x -= map(t, 2.0, 3.0, -1.0, 1.0, true) * size * Tween;
            pos.y -= map(t, 3.0, 4.0, -1.0, 1.0, true) * size * Tween;
            pos.z -= size * Tween;
            pos = rotateVec3(pos, Tween * PI * mod(tIndex, 2.0), vec3(1.0, 0.0, 0.0));
            pos = rotateVec3(pos, Tween * PI / 2.0 * mod(tIndex, 3.0), vec3(0.0, 1.0, 0.0));
            pos = rotateVec3(pos, Tween * PI / 2.0 * mod(tIndex, 4.0), vec3(0.0, 0.0, 1.0));
            pos = rotateVec3(pos, Tween * time * 2.0 * (cubeIndex + 1.0), vec3(1.0, 0.0, 0.0));
            pos = rotateVec3(pos, Tween * time * 2.0 * (cubeIndex + 1.0), vec3(0.0, 1.0, 0.0));
          }

          // ----------------------------------------------------------------------------------------
          // animation 7 - spiral
          // credit @ takumi animation # 3
          //

          Tween = getAnimationValue(animationValue7, triangleRandoms.x);
          if(Tween > 0.0) {
            pos = pos - centerTriangles * Tween;
            // spiral creation
            rad1 = getRad(40.0, triangleRandoms.x * 5.0); 
            rad2 = getRad(40.0, triangleRandoms.y * 5.0);
            pos = rotateVec3(pos, Tween * rad1, vec3(1.0, 0, 0)); // rotation speed of the triangles 
            pos = rotateVec3(pos, Tween * rad2, vec3(0, 1.0, 0));
            n = rotateVec3(n, Tween * rad1, vec3(1.0, 0, 0)); // rotate normals
            n = rotateVec3(n, Tween * rad2, vec3(0, 1.0, 0));
            float radius = 120.0 * map(triangleRandoms.y, -1.0, 1.0, 0.02, 1.0, true); //triangleRandoms.y, -.25, 0.25, -.75, 1.0, false); 
            // (inward radius feed, outward radius feed, inward radius limit, outward radius limit)
            float anim2CircleRad = getRad(6.0, triangleRandoms.x * 60.0);
            pos += vec3(
              Tween * 2.0 * radius * cos(anim2CircleRad),
              Tween * 6.0 * sin(getRad(3.0, triangleRandoms.y) * 10.0), // (Tween * amplitutde * sin(getRad(speed of oscillation, triangleRandoms.y) * number of waves))
              Tween * 2.0 * radius * sin(anim2CircleRad)
            );
            pos = rotateVec3(pos, Tween * getRad(4.0, 0.0), vec3(0.3, 1.0, .5 * sin(time)));
            n = rotateVec3(n, Tween * getRad(4.0, 0.0), vec3(0.3, 1.0, sin(time)));
          }

          // ----------------------------------------------------------------------------------------
          // animation 8 - cubes
          // credit @ takumi hasegawa #2
          //

          Tween = getAnimationValue(animationValue8, cubeRandoms.x);
          if(Tween > 0.0) {
            pos = pos - centerTriangles * Tween;
            pos *= (1.0 + Tween);
            rad1 = PI * 2.0 * sin(getRad(1.0, cubeRandoms.x));
            rad2 = PI * 2.0 * sin(getRad(1.0, cubeRandoms.y));
            pos = rotateVec3(pos, Tween * rad1, vec3(1.0, 0, 0));
            pos = rotateVec3(pos, Tween * rad2, vec3(0, 1.0, 0));
            n = rotateVec3(n, Tween * rad1, vec3(1.0, 0, 0));
            n = rotateVec3(n, Tween * rad2, vec3(0, 1.0, 0));
            vec3 cubeCenterTo = cubeRandoms * 100.0;
            pos *= (1.0 + Tween);
            pos += (Tween * cubeCenterTo);
            pos = rotateVec3(pos, Tween * getRad(1.0, 0.0), vec3(0.3, 1.0, 0.2));
            pos += (Tween * sin(getRad(160.0, cubeRandoms.x * 160.0)) * 0.3 * normalize(cubeCenterTo - pos)); 
          }

          // ----------------------------------------------------------------------------------------
          // animation 9 - cosine wave cube
          // 
          //

          Tween = getAnimationValue(animationValue9, cubeRandoms.x);
          if(Tween > 0.0) {
            
            float gridLength = 7.0;
            float centralize = (gridLength - 1.0) / 2.0;
            float cubeID = mod(cubeIndex, gridLength * gridLength * gridLength);
            float rowID = floor(cubeID / gridLength); 
            float zID = mod(rowID, gridLength) - centralize;
            rowID = floor(rowID / gridLength) - centralize;
            float colID = mod(cubeID, gridLength) - centralize;

            float scale = 5.25;
            pos -= centerTriangles * Tween;
            pos *= 2.0 * scale / 3.0 * Tween;


            float intervalx = mod(colID + zID + 2.0 * centralize, 2.0 * gridLength);
            float sx = 1.0 * cos(25.0 * (time + 5.0 * intervalx));
            

            float intervaly = mod(rowID + zID + 2.0 * centralize, 2.0 * gridLength);
            float sy = 1.0 * cos(25.0 * (time + 5.0 * intervaly));
            

            float intervalz = mod(colID + rowID + 2.0 * centralize, 2.0 * gridLength);
            float sz = 1.0 * cos(25.0 * (time + 5.0 * intervalz));
            

            pos.x *= .2 * (scale + sx);
            pos.x += rowID * (scale + sx);
            pos.y *= .2 * (scale + sy);
            pos.y += (colID  - .75) * (scale + sy);
            pos.z *= .2 * (scale + sz);
            pos.z += zID * (scale + sz);

            rad1 = 2.0 * sin(getRad(1.0, 4.0));
            rad2 = 2.0 * sin(getRad(1.0, 5.0));
            pos = rotateVec3(pos, Tween * rad1, vec3(1.0, 0, 0));
            pos = rotateVec3(pos, Tween * rad2, vec3(0, 1.0, 0));
            //n = rotateVec3(n, Tween * rad1, vec3(1.0, 0, 0));
            //n = rotateVec3(n, Tween * rad2, vec3(0, 1.0, 0));            
          }


          // ----------------------------------------------------------------------------------------
          // animation 10 - cubes
          // credit @ takumi hasegawa #2
          //

          Tween = getAnimationValue(animationValue10, cubeRandoms.x);
          if(Tween > 0.0) {
            pos = pos - centerTriangles * Tween;
            pos *= (1.0 + Tween);
            rad1 = PI * 2.0 * sin(getRad(1.0, cubeRandoms.x));
            rad2 = PI * 2.0 * sin(getRad(1.0, cubeRandoms.y));
            n = rotateVec3(n, Tween * rad1, vec3(1.0, 0, 0));
            n = rotateVec3(n, Tween * rad2, vec3(0, 1.0, 0));
            vec3 cubeCenterTo = cubeRandoms * 60.0;
            pos += (Tween * cubeCenterTo);
        
            float cubeID = mod(cubeIndex - mod(cubeIndex, 2.0), 36.0);

            if(cubeID == 0.0) {
              pos.x += 10.0 * max(cubeRandoms.x, cubeRandoms.y, cubeRandoms.z) * sin(25.0 * time);
            } else if(cubeID == 1.0) {
              pos.x -= 10.0 * max(cubeRandoms.x, cubeRandoms.y, cubeRandoms.z) * cos(25.0 * time);
            } else if(cubeID == 2.0) {
              pos.y += 10.0 * max(cubeRandoms.x, cubeRandoms.y, cubeRandoms.z) * sin(25.0 * time);
            } else if(cubeID == 3.0) {
              pos.y -= 10.0 * max(cubeRandoms.x, cubeRandoms.y, cubeRandoms.z) * cos(25.0 * time);
            } else if(cubeID == 4.0) {
              pos.z += 10.0 * max(cubeRandoms.x, cubeRandoms.y, cubeRandoms.z) * sin(25.0 * time);
            } else if(cubeID == 5.0) {
              pos.z -= 10.0 * max(cubeRandoms.x, cubeRandoms.y, cubeRandoms.z) * cos(25.0 * time);
            }


          }


          // ----------------------------------------------------------------------------------------
          // animation11 - rasengan
          // 
          //

          Tween = getAnimationValue(0.0, triangleRandoms.x);
          if(Tween > 0.0) {
            pos = identicalTriangles;
            radius = 19.0;
            
            float numRings = 50.0;  
            float ringID = mod(ringVIndex, numRings);  
            float circleID = floor(ringID / 10.0);
            ringID = mod(ringID, 10.0);
            float numVerticesPerRing = numVertices * 1.0 / numRings; 
    
            float direction = map(mod(ringID, 2.0), 0.0, 1.0, -1.0, 1.0, true);
            rad1 = 2.0 * direction * getRad(10.0, PI * 1.0 / numVerticesPerRing * mod((ringVIndex - ringID) / numRings, numVerticesPerRing));
            
            pos = rotateVec3(pos, rad1, vec3(-sin(ringID), -cos(ringID), -max(sin(circleID), cos(circleID))));

            pos.z += 1.3 * radius * sin(.2 * PI * (ringID + 2.50));        
            radius = radius * sin(.2 * PI * ringID);
            pos.x += 1.3 * radius * cos(.20 * PI * circleID);         
            pos.y += 1.3 * radius * sin(.20 * PI * circleID);
        
            
            pos = rotateVec3(pos, rad1, vec3(cos(ringID), sin(ringID), max(sin(circleID), cos(circleID))));
          }


      
          // Assign projection-transformed coordinates to gl_Position
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

          float len = length(pos);
          vColor = vec4(hsv2rgb(vec3(
            map(sin(getRad(2.0,  1.6 + len * 0.3 * (animationValue5 * 0.2 + animationValue6 * 0.2))), -1.0, 1.0, 0.0, 1.0, true),
            map(cos(getRad(3.0,  2.0 + len * (animationValue8 * 2.0 + animationValue7 * 3.0 + animationValue9 * 1.0))), -1.0, 1.0, 0.3, 0.5, true),
            map(cos(getRad(1.0,  0.3)), -1.0, 1.0, 1.6, 2.0, true) + animationValue4 * 0.2
          )), 10.0);

          // light
          float diffuse = clamp(dot(n, normalize(vec3(1.0, 1.0, 1.0))) , 0.5, 1.0);
          vColor *= vec4(vec3(diffuse), 1.0);
        }`,

      // fragment shader
      fragmentShader: `
        precision mediump float;

        varying vec4 vColor; // color

        // main processing
        void main(){
          gl_FragColor = vColor;
        }`
    });

    // Execute constructor of inherited THREE.Mesh
    THREE.Mesh.call(this, geometry, material);
  }

  sample.Triangles.prototype = Object.create(THREE.Mesh.prototype, { value: { constructor: THREE.Mesh } });

  /**
   * renew
   */
  sample.Triangles.prototype.update = function () {
    // update the elapsed time and pass it to the shader
    this.material.uniforms.time.value += 0.001;
  }

  /**
   * set uniform value
   */
  sample.Triangles.prototype.setUniform = function (uniformKey, value) {
    this.material.uniforms[uniformKey].value = value;
  }


})();