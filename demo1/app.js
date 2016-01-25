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
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz));
  this.chain = new Rectangle(
    new Coordinate(position.x, position.y - scale, position.z),
    new Coordinate(scale / 10, scale / 2.5, scale / 10),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz));
  this.ball = new Icosahedron(
    new Coordinate(position.x, position.y - scale * 1.6, position.z),
    new Coordinate(scale / 5, scale / 5, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz));
}

MorningStar.prototype.draw = function(gl, modelMatrix, u_ModelMatrix) {
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.handle.position.x, this.handle.position.y, this.handle.position.z),
    new Coordinate(this.handle.scale.x, this.handle.scale.y, this.handle.scale.z),
    new Rotation(this.handle.rotation.x, this.handle.rotation.y, this.handle.rotation.z,
      this.handle.rotation.xy, this.handle.rotation.xz, this.handle.rotation.yz));
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.chain.position.x, this.chain.position.y, this.chain.position.z),
    new Coordinate(this.chain.scale.x, this.chain.scale.y, this.chain.scale.z),
    new Rotation(this.chain.rotation.x, this.chain.rotation.y, this.chain.rotation.z,
      this.chain.rotation.xy, this.chain.rotation.xz, this.chain.rotation.yz));
  drawSpike(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.ball.position.x, this.ball.position.y, this.ball.position.z),
    new Coordinate(this.ball.scale.x, this.ball.scale.y, this.ball.scale.z),
    new Rotation(this.ball.rotation.x, this.ball.rotation.y, this.ball.rotation.z,
      this.ball.rotation.xy, this.ball.rotation.xz, this.ball.rotation.yz));
}

function Joint(position, scale, rotation) {
  this.out = new Rectangle(
    position,
    new Coordinate(scale, scale / 5, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz));
  this.bend = new Rectangle(
    new Coordinate(position.x + scale, position.y + (scale / 1.25), position.z),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz));
}

Joint.prototype.draw = function(gl, modelMatrix, u_ModelMatrix) {
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.bend.position.x, this.bend.position.y, this.bend.position.z),
    new Coordinate(this.bend.scale.x, this.bend.scale.y, this.bend.scale.z),
    new Rotation(this.bend.rotation.x, this.bend.rotation.y, this.bend.rotation.z,
      this.bend.rotation.xy, this.bend.rotation.xz, this.bend.rotation.yz));
  drawRectangle(gl, modelMatrix, u_ModelMatrix,
    new Coordinate(this.out.position.x, this.out.position.y, this.out.position.z),
    new Coordinate(this.out.scale.x, this.out.scale.y, this.out.scale.z),
    new Rotation(this.out.rotation.x, this.out.rotation.y, this.out.rotation.z,
      this.out.rotation.xy, this.out.rotation.xz, this.out.rotation.yz));
}

function Rectangle(position, scale, rotation) {
  this.position = position;
  this.scale = scale;
  this.rotation = rotation;
}

function Icosahedron(position, scale, rotation) {
  this.position = position;
  this.scale = scale;
  this.rotation = rotation;
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
    // setupKeyboardHandles(canvas, shapes);

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

function setupMouseHandlers(canvas, shapes) {
  var lastX = -1,
      lastY = -1;

  // var baseX = angles.x,
  //     baseY = angles.y

  canvas.onmousedown = function(event) {
    dragging = true;
    // lastX = event.clientX;
    // lastY = event.clientY;
    // baseX = angles.x;
    // baseY = angles.y;
  }

  canvas.onmouseup = function(event) {
    dragging = false;
  }

  canvas.onmousemove = function(event) {
    // var dx, dy,
    //     x = event.clientX,
    //     y = event.clientY;
    // if (dragging) {
    //   dx = x - lastX;
    //   dy = y - lastY;
    //   angles.x = baseX + dx;
    //   angles.y = baseY + dy;
    // }
  }
}

function draw(gl, modelMatrix, u_ModelMatrix, shapes) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  for(var i in shapes) {
    shapes[i].draw(gl, modelMatrix, u_ModelMatrix);
  }
}

function drawThing(gl, modelMatrix, u_ModelMatrix, location, scale, rotation, start, finish) {
  modelMatrix.setTranslate(location.x, location.y, location.z);
  modelMatrix.scale(1, 1, -1);
  modelMatrix.scale(scale.x, scale.y, scale.z);
  modelMatrix.rotate(rotation.x, 0, 1, 0);
  modelMatrix.rotate(rotation.y, 1, 0, 0);
  modelMatrix.rotate(rotation.z, 0, 0, 1);
  modelMatrix.rotate(rotation.xy, 1, 1, 0);
  modelMatrix.rotate(rotation.yz, 1, 0, 1);
  modelMatrix.rotate(rotation.xz, 1, 0, 1);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.TRIANGLES, start, finish);
}

function drawRectangle(gl, modelMatrix, u_ModelMatrix, location, scale, rotation) {
  drawThing(gl, modelMatrix, u_ModelMatrix, location, scale, rotation, 0, 36);
}

function drawSpike(gl, modelMatrix, u_ModelMatrix, location, scale, rotation) {
  drawThing(gl, modelMatrix, u_ModelMatrix, location, scale, rotation, 36, 60);
}

var extend = true;
function updateShapes(shapes) {
  if (!dragging) {
    var morningStar = shapes[0];
    var joint = shapes[1];
    morningStar.ball.rotation.x += 1;
    morningStar.chain.rotation.x -= 1;
    morningStar.handle.rotation.x += 0.5;
    if (extend) {
      morningStar.chain.scale.y += 0.01;
      morningStar.ball.position.y -= 0.01;
      extend = morningStar.chain.scale.y < 0.6;
    } else {
      morningStar.chain.scale.y -= 0.01;
      morningStar.ball.position.y += 0.01;
      extend = morningStar.chain.scale.y < 0.1
    }

    joint.out.rotation.z -= 1;
  }
}

function Drawer() {
  this.vertices = {};
  this.triangles = {};
  this.colors = {};
}

Drawer.prototype.addVertex = function(id, x, y, z) {
  this.vertices[id] = [x, y, z, 1.0];
};

Drawer.prototype.addTriangle = function(id, p1, p2, p3) {
  this.triangles[id] = [this.vertices[p1], this.vertices[p2], this.vertices[p3]];
}

Drawer.prototype.addColor = function(id, r, g, b) {
  this.colors[id] = [r, g, b];
}

Drawer.prototype.getRandomColors = function(count) {
  var colors = [];
  for(var i = 0; i < count; i++) {
    colors.push(this.getRandomColor());
  }
  return colors;
}

// decaying probability getter
Drawer.prototype.getRandomColor = function() {
  var result;
  var count = 1.0;
  for (var key in this.colors) {
    if (Math.random() < 1.0 / count) {
      result = key;
    }
    count++;
  }
  return result;
}

// triangleOrder = [1, 2, 0, 3, 4, ...]
Drawer.prototype.exportTriangles = function(triangleSet, colorSet) {
  var self = this,
      output = [];
  if (triangleSet.length !== colorSet.length) {
    throw 'Arrays must be of equal length';
  }
  for(var i in triangleSet) {
    self.triangles[triangleSet[i]].forEach(function(point) {
      var concater = point.concat(self.colors[colorSet[i]]);
      output = output.concat(concater);
    });
  }
  return new Float32Array(output);
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

  drawUtil.addColor('red', 1.0, 0.0, 0.0);
  drawUtil.addColor('green', 0.0, 1.0, 0.0);
  drawUtil.addColor('blue', 0.0, 0.0, 1.0);
  drawUtil.addColor('yellow', 1.0, 1.0, 0.0);
  drawUtil.addColor('cyan', 0.0, 1.0, 1.0);
  drawUtil.addColor('magenta', 1.0, 0.0, 1.0);

  var rectangleTris = ['+x1', '+x2', '+y1', '+y2', '+z1', '+z2',
                       '-x1', '-x2', '-y1', '-y2', '-z1', '-z2'];
  var rColors = drawUtil.getRandomColors(rectangleTris.length / 2),
      rectangleColors = [];
  rColors.forEach(function(color) {
    rectangleColors.push(color);
    rectangleColors.push(color);
  });

  // Creating an icosahedron
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
  var icosaColors = drawUtil.getRandomColors(icosaTriangles.length);

  var triangles = rectangleTris.concat(icosaTriangles);
  var colors = rectangleColors.concat(icosaColors);
  return drawUtil.exportTriangles(triangles, colors);
}
