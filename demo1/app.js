var VSHADER = 'vShared',
    FSHADER = 'fShared';

var naturalSpin = 3;
var dragging = false;

function main() {
  loadShaders(function(sources) {
    var canvas = document.getElementById('webgl'),
        gl = initWebGL(canvas, sources),
        vertices = getVertices(),
        count = vertices.length / 7,
        modelMatrix = new Matrix4(),
        u_ModelMatrix = bindVariables(gl, vertices),
        angles = { x: 0.0, y: 0.0 };

    setupMouseHandlers(canvas, angles);

    var animate = function() {
      updateMatrices(gl, modelMatrix, u_ModelMatrix, angles);
      draw(gl, count);
      requestAnimationFrame(animate, canvas);
    }
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
  }

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

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  return u_ModelMatrix;
}

function setupMouseHandlers(canvas, angles) {
  var lastX = -1,
      lastY = -1;

  var baseX = angles.x,
      baseY = angles.y

  canvas.onmousedown = function(event) {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    baseX = angles.x;
    baseY = angles.y;
  }

  canvas.onmouseup = function(event) {
    dragging = false;
  }

  canvas.onmousemove = function(event) {
    var dx, dy,
        x = event.clientX,
        y = event.clientY;
    if (dragging) {
      dx = x - lastX;
      dy = y - lastY;
      angles.x = baseX + dx;
      angles.y = baseY + dy;
    }
  }
}

function draw(gl, count) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, count);
}

function updateMatrices(gl, modelMatrix, u_ModelMatrix, angles) {
  modelMatrix.setTranslate(0.0, 0.0, 0.0);
  modelMatrix.scale(1, 1, -1);
  modelMatrix.scale(0.3, 0.3, 0.3);
  if (!dragging) {
    angles.x = angles.x + naturalSpin % 360;
    angles.y = angles.y + naturalSpin % 360;
  }
  modelMatrix.rotate(angles.x, 0, 1, 0);
  modelMatrix.rotate(angles.y, 1, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
}

function getVertices() {
  return new Float32Array([
    // x
     1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
     1.0,  1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    1.0, 0.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    1.0, 0.0, 0.0,
     1.0, -1.0,  1.0, 1.0,    1.0, 0.0, 0.0,
     1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 0.0,
    // y
    -1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 0.0,
    -1.0,  1.0,  1.0, 1.0,    0.0, 1.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    0.0, 1.0, 0.0,
     1.0,  1.0,  1.0, 1.0,    0.0, 1.0, 0.0,
     1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 0.0,
    -1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 0.0,
    // z
    -1.0,  1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
     1.0,  1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
    -1.0,  1.0,  1.0, 1.0,    0.0, 0.0, 1.0,
    // -x
    -1.0, -1.0,  1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0,  1.0,  1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0,  1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0,  1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0, -1.0, -1.0, 1.0,    1.0, 1.0, 0.0,
    -1.0, -1.0,  1.0, 1.0,    1.0, 1.0, 0.0,
     // -y
     1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 1.0,
     1.0, -1.0,  1.0, 1.0,    1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    1.0, 0.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,    1.0, 0.0, 1.0,
    -1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 1.0,
     1.0, -1.0, -1.0, 1.0,    1.0, 0.0, 1.0,
     // -z
     1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
     1.0, -1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
    -1.0, -1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
    -1.0, -1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
    -1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
     1.0,  1.0, -1.0, 1.0,    0.0, 1.0, 1.0,
  ]);
}
