var VSHADER = 'vShared',
    FSHADER = 'fShared';

var naturalSpin = 3;
var dragging = false;

function Coordinate(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}
function Rotation(x, y, z, xy, xz, yz) {
  Coordinate.apply(this, arguments);
  this.xy = xy;
  this.xz = xz;
  this.yz = yz;
}

// @params Cordinate, Scalar, Coordinate
function MorningStar(position, scale, rotation) {
  this.handle = new Rectangle(
    position,
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0));
  this.chain = new Rectangle(
    new Coordinate(0, -scale, 0),
    new Coordinate(scale / 10, scale / 2.5, scale / 10),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, -scale / 2.5, 0));
  this.ball = new Icosahedron(
    new Coordinate(0, -scale * 0.6, 0),
    new Coordinate(scale / 5, scale / 5, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0));
}

MorningStar.prototype.draw = function(gl, modelMatrix, u_ModelMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.handle.position.x, this.handle.position.y, this.handle.position.z),
    new Coordinate(this.handle.scale.x, this.handle.scale.y, this.handle.scale.z),
    new Rotation(this.handle.rotation.x, this.handle.rotation.y, this.handle.rotation.z,
      this.handle.rotation.xy, this.handle.rotation.xz, this.handle.rotation.yz),
    new Coordinate(this.handle.origin.x, this.handle.origin.y, this.handle.origin.z));

  undoScale(this.handle, modelMatrix);

  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.chain.position.x, this.chain.position.y, this.chain.position.z),
    new Coordinate(this.chain.scale.x, this.chain.scale.y, this.chain.scale.z),
    new Rotation(this.chain.rotation.x, this.chain.rotation.y, this.chain.rotation.z,
      this.chain.rotation.xy, this.chain.rotation.xz, this.chain.rotation.yz),
    new Coordinate(this.chain.origin.x, this.chain.origin.y, this.chain.origin.z));

  undoScale(this.chain, modelMatrix);

  drawSpike(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.ball.position.x, this.ball.position.y, this.ball.position.z),
    new Coordinate(this.ball.scale.x, this.ball.scale.y, this.ball.scale.z),
    new Rotation(this.ball.rotation.x, this.ball.rotation.y, this.ball.rotation.z,
      this.ball.rotation.xy, this.ball.rotation.xz, this.ball.rotation.yz),
    new Coordinate(this.ball.origin.x, this.ball.origin.y, this.ball.origin.z));
}

function Joint(position, scale, rotation) {
  this.out = new Rectangle(
    position,
    new Coordinate(scale, scale / 5, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0));
  this.join = new Rectangle(
    new Coordinate(scale / 1.25, 0, 0),
    new Coordinate(scale / 2, scale / 2, scale / 2),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0));
  this.bend = new Rectangle(
    new Coordinate(0, scale / 1.25, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale / 1.25, 0));
  this.join2 = new Rectangle(
    new Coordinate(0, scale * 1.5, 0),
    new Coordinate(scale / 2, scale / 2, scale / 2),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0));
  this.bend2 = new Rectangle(
    new Coordinate(0, scale / 1.25, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z + 270, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale / 1.25, 0));
  this.end = new MultiPyramid(
    new Coordinate(0, scale * 1.5, 0),
    new Coordinate(scale, scale, scale),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale * 1.5, 0));
}

Joint.prototype.draw = function(gl, modelMatrix, u_ModelMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.out.position.x, this.out.position.y, this.out.position.z),
    new Coordinate(this.out.scale.x, this.out.scale.y, this.out.scale.z),
    new Rotation(this.out.rotation.x, this.out.rotation.y, this.out.rotation.z,
      this.out.rotation.xy, this.out.rotation.xz, this.out.rotation.yz),
    new Coordinate(this.out.origin.x, this.out.origin.y, this.out.origin.z));

  undoScale(this.out, modelMatrix);
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.join.position.x, this.join.position.y, this.join.position.z),
    new Coordinate(this.join.scale.x, this.join.scale.y, this.join.scale.z),
    new Rotation(this.join.rotation.x, this.join.rotation.y, this.join.rotation.z,
      this.join.rotation.xy, this.join.rotation.xz, this.join.rotation.yz),
    new Coordinate(this.join.origin.x, this.join.origin.y, this.join.origin.z));

  undoScale(this.join, modelMatrix);
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.bend.position.x, this.bend.position.y, this.bend.position.z),
    new Coordinate(this.bend.scale.x, this.bend.scale.y, this.bend.scale.z),
    new Rotation(this.bend.rotation.x, this.bend.rotation.y, this.bend.rotation.z,
      this.bend.rotation.xy, this.bend.rotation.xz, this.bend.rotation.yz),
    new Coordinate(this.bend.origin.x, this.bend.origin.y, this.bend.origin.z));

  undoScale(this.bend, modelMatrix);
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.join2.position.x, this.join2.position.y, this.join2.position.z),
    new Coordinate(this.join2.scale.x, this.join2.scale.y, this.join2.scale.z),
    new Rotation(this.join2.rotation.x, this.join2.rotation.y, this.join2.rotation.z,
      this.join2.rotation.xy, this.join2.rotation.xz, this.join2.rotation.yz),
    new Coordinate(this.join2.origin.x, this.join2.origin.y, this.join2.origin.z));

  undoScale(this.join2, modelMatrix);
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.bend2.position.x, this.bend2.position.y, this.bend2.position.z),
    new Coordinate(this.bend2.scale.x, this.bend2.scale.y, this.bend2.scale.z),
    new Rotation(this.bend2.rotation.x, this.bend2.rotation.y, this.bend2.rotation.z,
      this.bend2.rotation.xy, this.bend2.rotation.xz, this.bend2.rotation.yz),
    new Coordinate(this.bend2.origin.x, this.bend2.origin.y, this.bend2.origin.z));

  undoScale(this.bend2, modelMatrix);
  drawMultiPyramid(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.end.position.x, this.end.position.y, this.end.position.z),
    new Coordinate(this.end.scale.x, this.end.scale.y, this.end.scale.z),
    new Rotation(this.end.rotation.x, this.end.rotation.y, this.end.rotation.z,
      this.end.rotation.xy, this.end.rotation.xz, this.end.rotation.yz),
    new Coordinate(this.end.origin.x, this.end.origin.y, this.end.origin.z));
}

function undoScale(property, modelMatrix) {
  modelMatrix.scale(1 / property.scale.x, 1 / property.scale.y, 1 / property.scale.z);
}

function Rectangle(position, scale, rotation, origin) {
  this.position = position;
  this.scale = scale;
  this.rotation = rotation;
  this.origin = origin;
}

function Icosahedron(position, scale, rotation, origin) {
  this.position = position;
  this.scale = scale;
  this.rotation = rotation;
  this.origin = origin;
}

function MultiPyramid(position, scale, rotation, origin) {
  this.position = position;
  this.scale = scale;
  this.rotation = rotation;
  this.origin = origin;
}

function main() {
  loadShaders(function(sources) {
    var canvas = document.getElementById('webgl'),
        gl = initWebGL(canvas, sources),
        vertices = getVertices(),
        count = vertices.length / 7,
        modelMatrix = new Matrix4(),
        u_ModelMatrix = bindVariables(gl, vertices);

    var shapes = [];
    shapes.push(new MorningStar(
      new Coordinate(0.4, 0.4, 0.0),
      0.5,
      new Rotation(-0.3, -0.3, -0.3, 0, 0, 0)
    ));
    shapes.push(new Joint(
      new Coordinate(-0.5, -0.5, 0.0),
      0.3,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));

    setupMouseHandlers(canvas, shapes);
    setupKeyboardHandlers(canvas, shapes);
    document.getElementById('reset').onclick = function() {
      spinConstant = 0.5;
    }

    var animate = function() {
      updateShapes(shapes);
      draw(gl, modelMatrix, u_ModelMatrix, shapes);
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

  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  return u_ModelMatrix;
}

var spinConstant = 0.5
function setupMouseHandlers(canvas, shapes) {
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
  }

  canvas.onmouseup = function(event) {
    dragging = false;
    spinConstant += 0.1;
  }

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
  }
}

function setupKeyboardHandlers(canvas, shapes) {
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

function drawThing(gl, modelMatrix, u_ModelMatrix, start, count) {
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, start, count);
}

function drawRectangle(gl, modelMatrix, u_ModelMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, location, scale, rotation, origin);
  drawThing(gl, modelMatrix, u_ModelMatrix, 0, 36);
  return modelMatrix;
}

function drawSpike(gl, modelMatrix, u_ModelMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, location, scale, rotation, origin);
  drawThing(gl, modelMatrix, u_ModelMatrix, 36, 60);
}

function drawMultiPyramid(gl, modelMatrix, u_ModelMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, location, scale, rotation, origin);
  drawThing(gl, modelMatrix, u_ModelMatrix, 96, 72);
}

var extend = true;
var swingLeft = true;
function updateShapes(shapes) {
  if (!dragging) {
    var morningStar = shapes[0];
    var joint = shapes[1];

    morningStar.handle.rotation.x -= spinConstant;
    morningStar.ball.rotation.x -= 2;
    // morningStar.chain.rotation.x -= spinConstant;
    // morningStar.ball.rotation.x -= spinConstant;

    if (swingLeft) {
      morningStar.handle.rotation.z -= spinConstant;
      morningStar.chain.rotation.z -= spinConstant + 0.1;
      morningStar.ball.rotation.z -= spinConstant + 0.1;
      swingLeft = morningStar.handle.rotation.z > -40;
    } else {
      morningStar.handle.rotation.z += spinConstant;
      morningStar.chain.rotation.z += spinConstant + 0.1;
      morningStar.ball.rotation.z += spinConstant + 0.1;
      swingLeft = morningStar.handle.rotation.z > 40;
    }

    joint.out.rotation.z -= 1;
    joint.out.rotation.y -= 1;
    joint.bend.rotation.y -= 1;
    joint.bend2.rotation.x -= 1;
    joint.end.rotation.x -= 3;
  }
}

function getVertices() {
  var drawUtil = new Drawer();
  drawUtil.addVertex('ftl', -1.0, 1.0, 1.0);
  drawUtil.addVertex('ftr', 1.0, 1.0, 1.0);
  drawUtil.addVertex('fbl', -1.0, -1.0, 1.0);
  drawUtil.addVertex('fbr', 1.0, -1.0, 1.0);
  drawUtil.addVertex('btl', -1.0, 1.0, -1.0);
  drawUtil.addVertex('btr', 1.0, 1.0, -1.0);
  drawUtil.addVertex('bbl', -1.0, -1.0, -1.0);
  drawUtil.addVertex('bbr', 1.0, -1.0, -1.0);

  drawUtil.addTriangle('+x1', 'ftr', 'fbr', 'bbr');
  drawUtil.addTriangle('+x2', 'ftr', 'btr', 'bbr');
  drawUtil.addTriangle('+y1', 'ftr', 'btr', 'btl');
  drawUtil.addTriangle('+y2', 'ftr', 'ftl', 'btl');
  drawUtil.addTriangle('+z1', 'ftl', 'ftr', 'fbr');
  drawUtil.addTriangle('+z2', 'ftl', 'fbl', 'fbr');
  drawUtil.addTriangle('-x1', 'ftl', 'fbl', 'bbl');
  drawUtil.addTriangle('-x2', 'ftl', 'btl', 'bbl');
  drawUtil.addTriangle('-y1', 'fbr', 'bbr', 'bbl');
  drawUtil.addTriangle('-y2', 'fbr', 'fbl', 'bbl');
  drawUtil.addTriangle('-z1', 'btl', 'btr', 'bbr');
  drawUtil.addTriangle('-z2', 'btl', 'bbl', 'bbr');

  var rectangleTris = ['+x1', '+x2', '+y1', '+y2', '+z1', '+z2',
                       '-x1', '-x2', '-y1', '-y2', '-z1', '-z2'];
  // Creating an icosahedron + 1 vertex
  var r52 = (1.0 + Math.sqrt(5.0)) / 2.0;
  drawUtil.addVertex('i0', -1.0, r52, 0);
  drawUtil.addVertex('i1', 1.0, r52, 0);
  drawUtil.addVertex('i2', -1.0, -r52, 0);
  drawUtil.addVertex('i3', 1.0, -r52, 0);
  drawUtil.addVertex('i4', 0, -1, r52);
  drawUtil.addVertex('i5', 0, 1, r52);
  drawUtil.addVertex('i6', 0, -1, -r52);
  drawUtil.addVertex('i7', 0, 1, -r52);
  drawUtil.addVertex('i8', r52, 0, -1);
  drawUtil.addVertex('i9', r52, 0, 1);
  drawUtil.addVertex('i10', -r52, 0, -1);
  drawUtil.addVertex('i11', -r52, 0, 1);

  drawUtil.addTriangle('if0', 'i0', 'i11', 'i5');
  drawUtil.addTriangle('if1', 'i0', 'i5', 'i1');
  drawUtil.addTriangle('if2', 'i0', 'i1', 'i7');
  drawUtil.addTriangle('if3', 'i0', 'i7', 'i10');
  drawUtil.addTriangle('if4', 'i0', 'i10', 'i11');
  drawUtil.addTriangle('if5', 'i1', 'i5', 'i9');
  drawUtil.addTriangle('if6', 'i5', 'i11', 'i4');
  drawUtil.addTriangle('if7', 'i11', 'i10', 'i2');
  drawUtil.addTriangle('if8', 'i10', 'i7', 'i6');
  drawUtil.addTriangle('if9', 'i7', 'i1', 'i8');
  drawUtil.addTriangle('if10', 'i3', 'i9', 'i4');
  drawUtil.addTriangle('if11', 'i3', 'i4', 'i2');
  drawUtil.addTriangle('if12', 'i3', 'i2', 'i6');
  drawUtil.addTriangle('if13', 'i3', 'i6', 'i8');
  drawUtil.addTriangle('if14', 'i3', 'i8', 'i9');
  drawUtil.addTriangle('if15', 'i4', 'i9', 'i5');
  drawUtil.addTriangle('if16', 'i2', 'i4', 'i11');
  drawUtil.addTriangle('if17', 'i6', 'i2', 'i10');
  drawUtil.addTriangle('if18', 'i8', 'i6', 'i7');
  drawUtil.addTriangle('if19', 'i9', 'i8', 'i1');

  var icosaTriangles = [];
  for(var i = 0; i < 20; i++) {
    icosaTriangles.push('if' + i);
  }

  // star
  var r32 = Math.sqrt(3.0) / 2;
  var r36 = r32 / 3;
  drawUtil.addVertex('dp0', 2 * r36, 0, 0);
  drawUtil.addVertex('dp1', -r36, -0.5, -0.5);
  drawUtil.addVertex('dp2', -r36, 0.5, -0.5);
  drawUtil.addVertex('dp3', -r36, -0.5, 0.5);
  drawUtil.addVertex('dp4', -r36, 0.5, 0.5);
  drawUtil.addVertex('dp5', -2 * r36, 0, 0);
  drawUtil.addVertex('dp6', r36, -0.5, -0.5);
  drawUtil.addVertex('dp7', r36, 0.5, -0.5);
  drawUtil.addVertex('dp8', r36, -0.5, 0.5);
  drawUtil.addVertex('dp9', r36, 0.5, 0.5);
  drawUtil.addVertex('dpy0', 0, 2 * r36, 0);
  drawUtil.addVertex('dpy1', -0.5, -r36, -0.5);
  drawUtil.addVertex('dpy2', 0.5, -r36, -0.5);
  drawUtil.addVertex('dpy3', -0.5, -r36, 0.5);
  drawUtil.addVertex('dpy4', 0.5, -r36, 0.5);
  drawUtil.addVertex('dpy5', 0, -2 * r36, 0);
  drawUtil.addVertex('dpy6', -0.5, r36, -0.5);
  drawUtil.addVertex('dpy7', 0.5, -r36, 0.5);
  drawUtil.addVertex('dpy8', -0.5, r36, 0.5);
  drawUtil.addVertex('dpy9', 0.5, r36, 0.5);
  drawUtil.addVertex('dpz0', 0, 0, 2 * r36);
  drawUtil.addVertex('dpz1', -0.5, -0.5, -r36);
  drawUtil.addVertex('dpz2', 0.5, -0.5, -r36);
  drawUtil.addVertex('dpz3', -0.5, 0.5, -r36);
  drawUtil.addVertex('dpz4', 0.5, 0.5, -r36);
  drawUtil.addVertex('dpz5', 0, 0, -2 * r36);
  drawUtil.addVertex('dpz6', -0.5, -0.5, r36);
  drawUtil.addVertex('dpz7', 0.5, 0.5, -r36);
  drawUtil.addVertex('dpz8', -0.5, 0.5, r36);
  drawUtil.addVertex('dpz9', 0.5, 0.5, r36);

  // TODO: tetrahedron, not pyramid
  drawUtil.addTriangle('dpx0', 'dp0', 'dp1', 'dp2');
  drawUtil.addTriangle('dpx1', 'dp0', 'dp2', 'dp3');
  drawUtil.addTriangle('dpx2', 'dp0', 'dp3', 'dp4');
  drawUtil.addTriangle('dpx3', 'dp0', 'dp4', 'dp1');
  // drawUtil.addTriangle('dpx4', 'dp1', 'dp2', 'dp3');
  // drawUtil.addTriangle('dpx5', 'dp3', 'dp4', 'dp1');
  drawUtil.addTriangle('dpx6', 'dp5', 'dp6', 'dp7');
  drawUtil.addTriangle('dpx7', 'dp5', 'dp7', 'dp8');
  drawUtil.addTriangle('dpx8', 'dp5', 'dp8', 'dp9');
  drawUtil.addTriangle('dpx9', 'dp5', 'dp9', 'dp5');
  // drawUtil.addTriangle('dpx10', 'dp6', 'dp7', 'dp8');
  // drawUtil.addTriangle('dpx11', 'dp8', 'dp9', 'dp6');
  drawUtil.addTriangle('dpy0', 'dpy0', 'dpy1', 'dpy2');
  drawUtil.addTriangle('dpy1', 'dpy0', 'dpy2', 'dpy3');
  drawUtil.addTriangle('dpy2', 'dpy0', 'dpy3', 'dpy4');
  drawUtil.addTriangle('dpy3', 'dpy0', 'dpy4', 'dpy1');
  // drawUtil.addTriangle('dpy4', 'dpy1', 'dpy2', 'dpy3');
  // drawUtil.addTriangle('dpy5', 'dpy3', 'dpy4', 'dpy1');
  drawUtil.addTriangle('dpy6', 'dpy5', 'dpy6', 'dpy7');
  drawUtil.addTriangle('dpy7', 'dpy5', 'dpy7', 'dpy8');
  drawUtil.addTriangle('dpy8', 'dpy5', 'dpy8', 'dpy9');
  drawUtil.addTriangle('dpy9', 'dpy5', 'dpy9', 'dpy5');
  // drawUtil.addTriangle('dpy10', 'dpy6', 'dpy7', 'dpy8');
  // drawUtil.addTriangle('dpy11', 'dpy8', 'dpy9', 'dpy6');
  drawUtil.addTriangle('dpz0', 'dpz0', 'dpz1', 'dpz2');
  drawUtil.addTriangle('dpz1', 'dpz0', 'dpz2', 'dpz3');
  drawUtil.addTriangle('dpz2', 'dpz0', 'dpz3', 'dpz4');
  drawUtil.addTriangle('dpz3', 'dpz0', 'dpz4', 'dpz1');
  // drawUtil.addTriangle('dpz4', 'dpz1', 'dpz2', 'dpz3');
  // drawUtil.addTriangle('dpz5', 'dpz3', 'dpz4', 'dpz1');
  drawUtil.addTriangle('dpz6', 'dpz5', 'dpz6', 'dpz7');
  drawUtil.addTriangle('dpz7', 'dpz5', 'dpz7', 'dpz8');
  drawUtil.addTriangle('dpz8', 'dpz5', 'dpz8', 'dpz9');
  drawUtil.addTriangle('dpz9', 'dpz5', 'dpz9', 'dpz5');
  // drawUtil.addTriangle('dpz10', 'dpz6', 'dpz7', 'dpz8');
  // drawUtil.addTriangle('dpz11', 'dpz8', 'dpz9', 'dpz6');

  var doublePTriangles = [];
  for(i = 0; i < 12; i++) {
    if ([4, 5, 10, 11].indexOf(i) === -1) {
      doublePTriangles.push('dpx' + i);
    }
  }
  for(i = 0; i < 12; i++) {
    if ([4, 5, 10, 11].indexOf(i) === -1) {
      doublePTriangles.push('dpy' + i);
    }
  }
  for(i = 0; i < 12; i++) {
    if ([4, 5, 10, 11].indexOf(i) === -1) {
      doublePTriangles.push('dpz' + i);
    }
  }

  var triangles = rectangleTris.concat(icosaTriangles).concat(doublePTriangles);
  return drawUtil.exportTriangles(triangles);
}
