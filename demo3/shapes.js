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

function Eye(position, looking, up) {
  this.position = position;
  this.looking = looking;
  this.up = up;
}

function GroundGrid() {
  this.start = 210;
  this.size = 6;
}

GroundGrid.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, light) {
  modelMatrix.setTranslate(0, 0, 0);
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  light.setMaterial(new Material(MATL_SILVER_SHINY));
  injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix);
  gl.drawArrays(gl.TRIANGLES, this.start, this.size);
};

function Cube(position, scale, rotation) {
  this.cube = new Rectangle(position,
    new Coordinate(scale, scale, scale), rotation, new Coordinate(0, 0, 0),
    new Material(MATL_BRASS)
  );
}

Cube.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  this.cube.draw.apply(this.cube, arguments);
};

function LonelyPyramid(position, scale, rotation) {
  this.pyramid = new Pyramid(position,
    new Coordinate(scale, scale, scale), rotation, new Coordinate(0, 0, 0), new Material(MATL_RED_PLASTIC));
}

LonelyPyramid.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  this.pyramid.draw.apply(this.pyramid, arguments);
};

function House(position, scale, rotation) {
  this.base = new Rectangle(position,
    new Coordinate(scale, scale, scale), rotation, new Coordinate(0, 0, 0),
    new Material(MATL_EMERALD)
  );
  this.roof = new Pyramid(
    new Coordinate(0, 0, scale * 0.9),
    new Coordinate(scale * 1.5, scale * 1.5, scale * 1.5),
    rotation, new Coordinate(0, 0, 0),
    new Material(MATL_RUBY)
  );
}

House.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  this.base.draw.apply(this.base, arguments);
  undoScale(this.base, modelMatrix);
  this.roof.draw.apply(this.roof, arguments);
};

// @params Cordinate, Scalar, Coordinate
function MorningStar(position, scale, rotation) {
  this.slider = new Rectangle(
    position,
    new Coordinate(scale, scale / 5, scale / 3),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0), new Material(MATL_OBSIDIAN));
  this.handle = new Rectangle(
    new Coordinate(0, -scale, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, -scale, 0), new Material(MATL_CHROME));
  this.chain = new Rectangle(
    new Coordinate(0, -scale, 0),
    new Coordinate(scale / 10, scale / 2.5, scale / 10),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, -scale / 2.5, 0), new Material(MATL_OBSIDIAN));
  this.ball = new Sphere(
    new Coordinate(0, -scale * 0.6, 0),
    new Coordinate(scale / 5, scale / 5, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0), new Material(MATL_GOLD_SHINY));
}

MorningStar.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  this.slider.draw.apply(this.slider, arguments);
  undoScale(this.slider, modelMatrix);
  this.handle.draw.apply(this.handle, arguments);
  undoScale(this.handle, modelMatrix);
  this.chain.draw.apply(this.chain, arguments);
  undoScale(this.chain, modelMatrix);
  this.ball.draw.apply(this.ball, arguments);
};

function Joint(position, scale, rotation) {
  this.out = new Rectangle(
    position,
    new Coordinate(scale, scale / 5, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0), new Material(MATL_BLU_PLASTIC));
  this.join = new Rectangle(
    new Coordinate(scale / 1.25, 0, 0),
    new Coordinate(scale / 2, scale / 2, scale / 2),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0), new Material(MATL_EMERALD));
  this.bend = new Rectangle(
    new Coordinate(0, scale / 1.25, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale / 1.25, 0), new Material(MATL_BLU_PLASTIC));
  this.join2 = new Rectangle(
    new Coordinate(0, scale * 1.5, 0),
    new Coordinate(scale / 2, scale / 2, scale / 2),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0), new Material(MATL_EMERALD));
  this.bend2 = new Rectangle(
    new Coordinate(0, scale / 1.25, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z + 270, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale / 1.25, 0), new Material(MATL_BLU_PLASTIC));
  this.join3 = new Rectangle(
    new Coordinate(0, scale * 1.5, 0),
    new Coordinate(scale / 2, scale / 2, scale / 2),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0), new Material(MATL_EMERALD));
  this.bend3 = new Rectangle(
    new Coordinate(0, scale / 1.25, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z + 90, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale / 1.25, 0), new Material(MATL_BLU_PLASTIC));
  this.end = new MultiPyramid(
    new Coordinate(0, scale * 1.5, 0),
    new Coordinate(scale, scale, scale),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, scale * 1.5, 0), new Material(MATL_TURQUOISE));
}

Joint.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix) {
  modelMatrix.setTranslate(0, 0, 0);

  this.out.draw.apply(this.out, arguments);
  undoScale(this.out, modelMatrix);
  this.join.draw.apply(this.join, arguments);
  undoScale(this.join, modelMatrix);
  this.bend.draw.apply(this.bend, arguments);
  undoScale(this.bend, modelMatrix);
  this.join2.draw.apply(this.join2, arguments);
  undoScale(this.join2, modelMatrix);
  this.bend2.draw.apply(this.bend2, arguments);
  undoScale(this.bend2, modelMatrix);
  this.join3.draw.apply(this.join3, arguments);
  undoScale(this.join3, modelMatrix);
  this.bend3.draw.apply(this.bend3, arguments);
  undoScale(this.bend3, modelMatrix);
  this.end.draw.apply(this.end, arguments);
  undoScale(this.end, modelMatrix);
};

function undoScale(property, modelMatrix) {
  modelMatrix.scale(1 / property.scale.x, 1 / property.scale.y, 1 / property.scale.z);
}

function Shape(position, scale, rotation, origin, material) {
  this.position = position;
  this.scale = scale;
  this.rotation = rotation;
  this.origin = origin;
  this.material = material;
  this.start = 0;
  this.length = 0;
  this.drawMethod = 'TRIANGLES';
}

Shape.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix,
                                u_ModelMatrix, u_MvpMatrix, u_NormalMatrix, light) {
  updateMatrices(modelMatrix, viewMatrix, projMatrix, normalMatrix,
    new Coordinate(this.scale.x, this.scale.y, this.scale.z),
    new Rotation(this.rotation.x, this.rotation.y, this.rotation.z, this.rotation.xy, this.rotation.xz, this.rotation.yz),
    new Coordinate(this.origin.x, this.origin.y, this.origin.z),
    new Coordinate(this.position.x, this.position.y, this.position.z));
  light.reset();
  if (this.material) {
    light.setMaterial(this.material);
  }
  injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix);
  gl.drawArrays(gl[this.drawMethod], this.start, this.length);
};

function Rectangle() {
  Shape.apply(this, Array.prototype.slice.call(arguments));
  this.start = 0;
  this.length = 36;
}

Rectangle.prototype = new Shape();

function Icosahedron() {
  Shape.apply(this, Array.prototype.slice.call(arguments));
  this.start = 36;
  this.length = 60;
}

Icosahedron.prototype = new Shape();

function MultiPyramid() {
  Shape.apply(this, Array.prototype.slice.call(arguments));
  this.start = 96;
  this.length = 96;
}

MultiPyramid.prototype = new Shape();

function Pyramid() {
  Shape.apply(this, Array.prototype.slice.call(arguments));
  this.start = 192;
  this.length = 18;
}

Pyramid.prototype = new Shape();

function Sphere() {
  Shape.apply(this, Array.prototype.slice.call(arguments));
  this.start = 216;
  this.length = 674;
  this.drawMethod = 'TRIANGLE_STRIP';
}

Sphere.prototype = new Shape();


function injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_ModelMatrix, u_MvpMatrix, u_NormalMatrix) {
  // cloning projMatrix
  var tempProjMatrix = new Matrix4();
  tempProjMatrix.elements = new Float32Array(projMatrix.elements.slice(0));
  var tempViewMatrix = new Matrix4();
  tempViewMatrix.elements = new Float32Array(viewMatrix.elements.slice(0));
  tempViewMatrix.multiply(modelMatrix);
  normalMatrix.setInverseOf(tempViewMatrix);
  normalMatrix.transpose();

  var mvpMatrix = tempProjMatrix.multiply(tempViewMatrix);
  gl.uniformMatrix4fv(u_ModelMatrix, false, tempViewMatrix.elements);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
}

function drawAxes(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_MvpMatrix, u_NormalMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, viewMatrix, projMatrix, normalMatrix, scale, rotation, origin, location);
  injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_MvpMatrix, u_NormalMatrix);
  gl.drawArrays(gl.LINES, 210, 6);
}

function updateMatrices(modelMatrix, viewMatrix, projMatrix, normalMatrix, scale, rotation, origin, location) {
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
