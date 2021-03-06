var VSHADER = 'vShared',
    FSHADER = 'fShared';

var dragging = false, moving = true;
var light;

function toggleHeadlight() {
  light.headlightOn = !light.headlightOn;
}

function toggleWorldLight() {
  light.worldLightOn = !light.worldLightOn;
}

function toggleShadingMethod() {
  light.usePhongShading = !light.usePhongShading;
}

function toggleLightingMethod() {
  light.usePhongLighting = !light.usePhongLighting;
}

function toggleMotion() {
  moving = !moving;
}

function main() {
  loadShaders(function(sources) {
    var canvas = document.getElementById('webgl'),
        gl = initWebGL(canvas, sources),
        vertices = getVertices();

    var modelMatrix = new Matrix4(),
        viewMatrix = new Matrix4(),
        projMatrix = new Matrix4(),
        normalMatrix = new Matrix4();

    var matrices = bindVariables(gl, vertices),
        u_ModelMatrix = matrices[0],
        u_MvpMatrix = matrices[1],
        u_NormalMatrix = matrices[2];

    light = new Light(gl);
    light.setLights({
      pos: [0.0, 0.0, 1000.0],
      amb: [1.0, 1.0, 1.0],
      diff: [1.0, 1.0, 1.0],
      spec: [1.0, 1.0, 1.0],
      ke: [1.0, 1.0, 1.0],
      ka: [1.0, 1.0, 1.0],
      kd: [1.0, 1.0, 1.0],
      ks: [1.0, 1.0, 1.0],
      kshiny: 128
    });

    var shapes = [];
    shapes.push(new MorningStar(
      new Coordinate(0.8, 0.8, 0.1),
      0.3,
      new Rotation(-0.3, -0.3, -0.3, 0, 0, 0)
    ));
    shapes.push(new Joint(
      new Coordinate(-0.8, -0.8, 0.1),
      0.2,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));
    shapes.push(new Cube(
      new Coordinate(-0.8, 0.8, 0.1),
      0.1,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));
    shapes.push(new LonelyPyramid(
      new Coordinate(0.8, -1, 0.1),
      0.1,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));
    shapes.push(new House(
      new Coordinate(1.5, 1.5, 0.1),
      0.2,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));
    shapes.push(new GroundGrid());

    var eye = new Eye(
      new Coordinate(7.0, 0.0, 2.0),
      new Coordinate(0.0, 0.0, 0.0),
      new Coordinate(0.0, 0.0, 1.0)
    );

    setupMouseHandlers(gl, canvas, shapes);
    setupKeyboardHandlers(eye);

    var lightGUI = new LightGUI(light, function() {
      draw(gl, canvas, modelMatrix, viewMatrix, projMatrix, normalMatrix,
        u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, shapes, eye, light);
    });

    var animate = function() {
      // Autostretch
      canvas.height = window.innerHeight - 90;
      canvas.width = window.innerWidth;

      updateShapes(shapes);
      draw(gl, canvas, modelMatrix, viewMatrix, projMatrix, normalMatrix,
        u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, shapes, eye, light);
      requestAnimationFrame(animate, canvas);
    };
    animate();
  });
}

function loadShaders(callback) {

  // START: Shaders
  var vShaderSrc = new XMLHttpRequest(),
      fShaderSrc = new XMLHttpRequest();

  var oneCompleted = false;
  var sources = {};
  var initialize = function(shaderName, shaderSource) {
    sources[shaderName] = shaderSource;
    if (oneCompleted) {
      callback(sources);
    } else {
      oneCompleted = true;
    }
  };

  vShaderSrc.open('GET', '/shaders/vshader.esgl');
  fShaderSrc.open('GET', '/shaders/fshader.esgl');
  vShaderSrc.onreadystatechange = function() {
    if (vShaderSrc.readyState === 4 && vShaderSrc.status === 200) {
      initialize(VSHADER, vShaderSrc.responseText);
    }
  };
  fShaderSrc.onreadystatechange = function() {
    if (fShaderSrc.readyState === 4 && fShaderSrc.status === 200) {
      initialize(FSHADER, fShaderSrc.responseText);
    }
  };
  vShaderSrc.send();
  fShaderSrc.send();
  // END: Shaders

  // FOR HTML OPEN:
  //var sources = {};
  //callback(sources);
}

function initWebGL(canvas, sources) {
  var gl = getWebGLContext(canvas);
  if (!gl) {
    throw 'Failed to get rendering context for WebGL';
  }
  if (!initShaders(gl, sources[VSHADER], sources[FSHADER])) {
    throw 'Failed to initialize shaders';
  }
  gl.clearColor(0, 0, 0, 1);
	gl.depthFunc(gl.LESS);
  gl.enable(gl.DEPTH_TEST);
  return gl;
}

function bindVariables(gl, vertices) {
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    throw 'Failed to create buffer';
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  var size = vertices.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    throw 'Failed to get a_Position';
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 9, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    throw 'Failed to get a_Color';
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 9, size * 3);
  gl.enableVertexAttribArray(a_Color);

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    throw 'Failed to get a_Normal';
  }
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, size * 9, size * 6);
  gl.enableVertexAttribArray(a_Normal);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  return [ u_ModelMatrix, u_MvpMatrix, u_NormalMatrix ];
}

function setupMouseHandlers(gl, canvas, shapes) {
  var lastX = -1,
      lastY = -1;
  var joint = shapes[1];
  var baseX = joint.out.rotation.x,
      baseY = joint.out.rotation.y;

  canvas.onmousedown = function(event) {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    baseX = joint.out.rotation.x;
    baseY = joint.out.rotation.y;
  };

  canvas.onmouseup = function(event) {
    dragging = false;
  };

  canvas.onmousemove = function(event) {
    var dx, dy,
        x = event.clientX,
        y = event.clientY;
    if (dragging) {
      dx = x - lastX;
      dy = y - lastY;
      joint.out.rotation.x = baseX + dx;
      joint.out.rotation.y = baseY + dy;
    }
  };
}


var angle = 0;
var offset = Math.atan(0);
function computePosition(eye, angle) {
  var distance = computeEyeDistance(eye);
  var position = [ eye.position.x - distance * Math.cos(angle + offset),
                   eye.position.y - distance * Math.sin(angle + offset)];
  return position;
};

function computeEyeDistance(eye) {
  var vector = [ eye.position.x - eye.looking.x, eye.position.y - eye.looking.y ];
  var distance = Math.sqrt(Math.pow(vector[0], 2) + Math.pow(vector[1], 2));
  return distance;
}

function computeMovement(eye, scale) {
  var vector = { x: eye.position.x - eye.looking.x,
                 y: eye.position.y - eye.looking.y,
                 z: eye.position.z - eye.looking.z };
  var magnitude = Math.sqrt(
    Math.pow(vector.x, 2) +
    Math.pow(vector.y, 2) +
    Math.pow(vector.z, 2)
  );
  //magnitude += scale;
  vector.x /= magnitude / scale;
  vector.y /= magnitude / scale;
  vector.z /= magnitude / scale;
  return vector;
}

function computeLateralMovement(eye, scale) {
  var vector = { x: eye.position.z - eye.looking.z,
                 y: eye.position.x - eye.looking.x,
                 z: eye.position.y - eye.looking.y };
  var magnitude = Math.sqrt(
    Math.pow(vector.x, 2) +
    Math.pow(vector.y, 2) +
    Math.pow(vector.z, 2)
  );
  //magnitude += scale;
  vector.x /= magnitude / scale;
  vector.y /= magnitude / scale;
  vector.z /= magnitude / scale;
  return vector;
}

function setupKeyboardHandlers(eye) {
  window.onkeypress = function (event) {
    switch (event.keyCode) {
      case 119: // w, for up
        eye.looking.z += 0.06;
        break;
      case 97: // a, for left
        angle = (angle + 0.03) % (2 * Math.PI);
        var newLocation = computePosition(eye, angle);
        eye.looking.x = newLocation[0];
        eye.looking.y = newLocation[1];
        break;
      case 100: // d, for right
        angle = (angle - 0.03) % (2 * Math.PI);
        var newLocation = computePosition(eye, angle);
        eye.looking.x = newLocation[0];
        eye.looking.y = newLocation[1];
        break;
      case 115: // s, for down
        eye.looking.z -= 0.06;
        break;
      case 104: // h, pan left
        var movementVector = computeLateralMovement(eye, 0.5);
        eye.position.x -= movementVector.x;
        eye.position.y -= movementVector.y;
        eye.position.z -= movementVector.z;
        eye.looking.x -= movementVector.x;
        eye.looking.y -= movementVector.y;
        eye.looking.z -= movementVector.z;
        break;
      case 108: // l, pan right
        var movementVector = computeLateralMovement(eye, 0.5);
        eye.position.x += movementVector.x;
        eye.position.y += movementVector.y;
        eye.position.z += movementVector.z;
        eye.looking.x += movementVector.x;
        eye.looking.y += movementVector.y;
        eye.looking.z += movementVector.z;
        break;
      case 106: //j, for moving forward
        var movementVector = computeMovement(eye, 0.5);
        eye.position.x += movementVector.x;
        eye.position.y += movementVector.y;
        eye.position.z += movementVector.z;
        eye.looking.x += movementVector.x;
        eye.looking.y += movementVector.y;
        eye.looking.z += movementVector.z;
        break;
      case 107: // k, for moving backward
        var movementVector = computeMovement(eye, 0.5);
        eye.position.x -= movementVector.x;
        eye.position.y -= movementVector.y;
        eye.position.z -= movementVector.z;
        eye.looking.x -= movementVector.x;
        eye.looking.y -= movementVector.y;
        eye.looking.z -= movementVector.z;
        break;
      default:
        console.log(event.keyCode);
        break;
    }
  }
}

function draw(gl, canvas, modelMatrix, viewMatrix, projMatrix, normalMatrix,
              u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, shapes, eye, light) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  viewMatrix.setLookAt(eye.position.x, eye.position.y, eye.position.z,
                       eye.looking.x, eye.looking.y, eye.looking.z,
                       eye.up.x, eye.up.y, eye.up.z);
  var aspectRatio = canvas.width / canvas.height;

  light.updateLights(viewMatrix);
  gl.viewport(0, 0, canvas.width, canvas.height);
  projMatrix.setPerspective(40, aspectRatio, 1, 100);
  for(var i in shapes) {
    shapes[i].draw(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix,
      u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, light);
  }
}

function updateShapes(shapes) {
  if (!dragging && moving) {
    var morning = shapes[0],
        joint = shapes[1],
        cube = shapes[2],
        pyramid = shapes[3],
        house = shapes[4];

    morning.slider.rotation.x += 1;

    joint.out.rotation.z -= 1;
    joint.end.rotation.x -= 3;

    cube.cube.rotation.x += 3;
    pyramid.pyramid.rotation.z += 5;

    house.base.rotation.z += 1;
  }
}
