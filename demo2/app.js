var VSHADER = 'vShared',
    FSHADER = 'fShared';

var SPIN_CONSTANT = 0.5;
var dragging = false,
    extend = true,
    swingLeft = true;

function main() {
  loadShaders(function(sources) {
    var canvas = document.getElementById('webgl'),
        gl = initWebGL(canvas, sources),
        vertices = getVertices(),
        count = vertices.length / 7;

    var viewMatrix = new Matrix4(),
        modelMatrix = new Matrix4();

    var matrices = bindVariables(gl, vertices);
    var u_ViewMatrix = matrices[0],
        u_ModelMatrix = matrices[1];

    // TEST CODE
    //viewMatrix.setLookAt(0.25, 0.25, 0.25, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    var shapes = [];
    shapes.push(new MorningStar(
      new Coordinate(0.4, 0.4, 0.0),
      0.3,
      new Rotation(-0.3, -0.3, -0.3, 0, 0, 0)
    ));
    shapes.push(new Joint(
      new Coordinate(-0.5, -0.5, 0.0),
      0.2,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));

    setupMouseHandlers(gl, canvas, shapes);
    setupKeyboardHandlers(gl, canvas, shapes);
    document.getElementById('reset').onclick = function() {
      var randomColor = new Drawer().getRandomColor();
      gl.clearColor(randomColor[0], randomColor[1], randomColor[2]);
    };

    var animate = function() {
      // Autostretch
      //canvas.height = window.innerHeight;
      //canvas.width = window.innerWidth;
      //gl.viewport(0, 0, canvas.width, canvas.height);

      updateShapes(shapes);
      draw(gl, modelMatrix, u_ModelMatrix, shapes);
      requestAnimationFrame(animate, canvas);
    };
    animate();
  });
}

function loadShaders(callback) {
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

  // FOR HTML OPEN:
  //var sources = {};
  //sources[FSHADER] = 'precision mediump float;\nvarying vec4 v_Color;\nvoid main() {\ngl_FragColor = v_Color;\n}\n';
  //sources[VSHADER] = 'attribute vec4 a_Position;\nuniform mat4 u_ModelMatrix;\nattribute vec4 a_Color;\nvarying vec4 v_Color;\nvoid main() {\ngl_Position = u_ModelMatrix * a_Position;\ngl_PointSize = 10.0;\nv_Color = a_Color;\n}\n ';
  callback(sources);
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
  vertexBuffer = gl.createBuffer();
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
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, size * 7, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    throw 'Failed to get a_Color';
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 7, size * 4);
  gl.enableVertexAttribArray(a_Color);

  var matrices = [],
      u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
      u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');

  matrices.push(u_ViewMatrix);
  matrices.push(u_ModelMatrix);
  return matrices;
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
    vertices = getVertices();
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 7, size * 4);
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

function setupKeyboardHandlers(gl, canvas, shapes) {
  var morningStar = shapes[0],
      joint = shapes[1];

  window.onkeypress = function (event) {
    console.log(event.keyCode);
    switch (event.keyCode) {
      case 119: // w, for up
        joint.out.position.y += 0.01;
        break;
      case 97: // a, for left
        joint.out.position.x -= 0.01;
        break;
      case 100: // d, for right
        joint.out.position.x += 0.01;
        break;
      case 115: // s, for down
        joint.out.position.y -= 0.01;
        break;
    }
  }
}

function draw(gl, modelMatrix, u_ModelMatrix, shapes) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for(var i in shapes) {
    shapes[i].draw(gl, modelMatrix, u_ModelMatrix);
  }
}

function updateMatrices(modelMatrix, location, scale, rotation, origin) {
  modelMatrix.scale(1, 1, -1);
  modelMatrix.translate(location.x, location.y, location.z);
  modelMatrix.translate(-origin.x, -origin.y, -origin.z);
  modelMatrix.rotate(rotation.x, 0, 1, 0);
  modelMatrix.rotate(rotation.y, 1, 0, 0);
  modelMatrix.rotate(rotation.z, 0, 0, 1);
  modelMatrix.rotate(rotation.xy, 1, 1, 0);
  modelMatrix.rotate(rotation.yz, 1, 0, 1);
  modelMatrix.rotate(rotation.xz, 1, 0, 1);
  modelMatrix.translate(origin.x, origin.y, origin.z);
  modelMatrix.scale(scale.x, scale.y, scale.z);
}

function updateShapes(shapes) {
  if (!dragging) {
    var morningStar = shapes[0];
    var joint = shapes[1];

    morningStar.slider.rotation.x += 4;
    morningStar.slider.rotation.y += 0.1;
    morningStar.handle.rotation.x -= SPIN_CONSTANT;
    morningStar.ball.rotation.x -= 2;

    if (swingLeft) {
      morningStar.handle.rotation.z -= SPIN_CONSTANT;
      morningStar.slider.scale.x += 0.008;
      morningStar.chain.rotation.z -= SPIN_CONSTANT + 0.3;
      swingLeft = morningStar.handle.rotation.z > -40;
    } else {
      morningStar.slider.scale.x -= 0.008;
      morningStar.handle.rotation.z += SPIN_CONSTANT;
      morningStar.chain.rotation.z += SPIN_CONSTANT + 0.3;
      swingLeft = morningStar.handle.rotation.z > 40;
    }

    joint.out.rotation.z -= 1;
    joint.out.rotation.y -= 1;
    joint.bend.rotation.y -= 1;
    joint.bend2.rotation.x -= 1;
    joint.end.rotation.x -= 3;
  }
}

