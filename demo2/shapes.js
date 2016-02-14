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

function Axes() {
  this.start = 192;
  this.size = 6;
}

Axes.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix);
  gl.drawArrays(gl.LINES, this.start, this.size);
};

function GroundGrid() {
  this.start = 198;
  this.size = 400;
}

GroundGrid.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix) {
  modelMatrix.setTranslate(0, 0, 0);
  injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix);
  gl.drawArrays(gl.LINES, this.start, this.size);
};

// @params Cordinate, Scalar, Coordinate
function MorningStar(position, scale, rotation) {
  this.slider = new Rectangle(
    position,
    new Coordinate(scale, scale / 5, scale / 3),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, 0, 0));
  this.handle = new Rectangle(
    new Coordinate(0, -scale, 0),
    new Coordinate(scale / 5, scale, scale / 5),
    new Rotation(rotation.x, rotation.y, rotation.z, rotation.xy, rotation.xz, rotation.yz),
    new Coordinate(0, -scale, 0));
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

MorningStar.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix) {
  modelMatrix.setTranslate(0, 0, 0);

  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.slider.position.x, this.slider.position.y, this.slider.position.z),
    new Coordinate(this.slider.scale.x, this.slider.scale.y, this.slider.scale.z),
    new Rotation(this.slider.rotation.x, this.slider.rotation.y, this.slider.rotation.z,
      this.slider.rotation.xy, this.slider.rotation.xz, this.slider.rotation.yz),
    new Coordinate(this.slider.origin.x, this.slider.origin.y, this.slider.origin.z));

  undoScale(this.slider, modelMatrix);


  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.handle.position.x, this.handle.position.y, this.handle.position.z),
    new Coordinate(this.handle.scale.x, this.handle.scale.y, this.handle.scale.z),
    new Rotation(this.handle.rotation.x, this.handle.rotation.y, this.handle.rotation.z,
      this.handle.rotation.xy, this.handle.rotation.xz, this.handle.rotation.yz),
    new Coordinate(this.handle.origin.x, this.handle.origin.y, this.handle.origin.z));

  undoScale(this.handle, modelMatrix);

  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.chain.position.x, this.chain.position.y, this.chain.position.z),
    new Coordinate(this.chain.scale.x, this.chain.scale.y, this.chain.scale.z),
    new Rotation(this.chain.rotation.x, this.chain.rotation.y, this.chain.rotation.z,
      this.chain.rotation.xy, this.chain.rotation.xz, this.chain.rotation.yz),
    new Coordinate(this.chain.origin.x, this.chain.origin.y, this.chain.origin.z));

  undoScale(this.chain, modelMatrix);

  drawSpike(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.ball.position.x, this.ball.position.y, this.ball.position.z),
    new Coordinate(this.ball.scale.x, this.ball.scale.y, this.ball.scale.z),
    new Rotation(this.ball.rotation.x, this.ball.rotation.y, this.ball.rotation.z,
      this.ball.rotation.xy, this.ball.rotation.xz, this.ball.rotation.yz),
    new Coordinate(this.ball.origin.x, this.ball.origin.y, this.ball.origin.z));
};

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

Joint.prototype.draw = function(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix) {
  modelMatrix.setTranslate(0, 0, 0);


  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.out.position.x, this.out.position.y, this.out.position.z),
    new Coordinate(this.out.scale.x, this.out.scale.y, this.out.scale.z),
    new Rotation(this.out.rotation.x, this.out.rotation.y, this.out.rotation.z,
      this.out.rotation.xy, this.out.rotation.xz, this.out.rotation.yz),
    new Coordinate(this.out.origin.x, this.out.origin.y, this.out.origin.z));

  undoScale(this.out, modelMatrix);
  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.join.position.x, this.join.position.y, this.join.position.z),
    new Coordinate(this.join.scale.x, this.join.scale.y, this.join.scale.z),
    new Rotation(this.join.rotation.x, this.join.rotation.y, this.join.rotation.z,
      this.join.rotation.xy, this.join.rotation.xz, this.join.rotation.yz),
    new Coordinate(this.join.origin.x, this.join.origin.y, this.join.origin.z));

  undoScale(this.join, modelMatrix);
  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.bend.position.x, this.bend.position.y, this.bend.position.z),
    new Coordinate(this.bend.scale.x, this.bend.scale.y, this.bend.scale.z),
    new Rotation(this.bend.rotation.x, this.bend.rotation.y, this.bend.rotation.z,
      this.bend.rotation.xy, this.bend.rotation.xz, this.bend.rotation.yz),
    new Coordinate(this.bend.origin.x, this.bend.origin.y, this.bend.origin.z));

  undoScale(this.bend, modelMatrix);
  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.join2.position.x, this.join2.position.y, this.join2.position.z),
    new Coordinate(this.join2.scale.x, this.join2.scale.y, this.join2.scale.z),
    new Rotation(this.join2.rotation.x, this.join2.rotation.y, this.join2.rotation.z,
      this.join2.rotation.xy, this.join2.rotation.xz, this.join2.rotation.yz),
    new Coordinate(this.join2.origin.x, this.join2.origin.y, this.join2.origin.z));

  undoScale(this.join2, modelMatrix);
  drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.bend2.position.x, this.bend2.position.y, this.bend2.position.z),
    new Coordinate(this.bend2.scale.x, this.bend2.scale.y, this.bend2.scale.z),
    new Rotation(this.bend2.rotation.x, this.bend2.rotation.y, this.bend2.rotation.z,
      this.bend2.rotation.xy, this.bend2.rotation.xz, this.bend2.rotation.yz),
    new Coordinate(this.bend2.origin.x, this.bend2.origin.y, this.bend2.origin.z));

  undoScale(this.bend2, modelMatrix);
  drawMultiPyramid(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix,
    new Coordinate(this.end.position.x, this.end.position.y, this.end.position.z),
    new Coordinate(this.end.scale.x, this.end.scale.y, this.end.scale.z),
    new Rotation(this.end.rotation.x, this.end.rotation.y, this.end.rotation.z,
      this.end.rotation.xy, this.end.rotation.xz, this.end.rotation.yz),
    new Coordinate(this.end.origin.x, this.end.origin.y, this.end.origin.z));
};

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

function injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix) {
  // cloning projMatrix
  var tempProjMatrix = new Matrix4();
  tempProjMatrix.elements = new Float32Array(projMatrix.elements.slice(0));
  var tempViewMatrix = new Matrix4();
  tempViewMatrix.elements = new Float32Array(viewMatrix.elements.slice(0));
  var mvpMatrix = tempProjMatrix.multiply(tempViewMatrix.multiply(modelMatrix));
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
}

function drawThing(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, start, count) {
  injectMvpMatrix(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix);
  gl.drawArrays(gl.TRIANGLES, start, count);
}

function drawRectangle(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, viewMatrix, projMatrix, location, scale, rotation, origin);
  drawThing(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, 0, 36);
  return modelMatrix;
}

function drawSpike(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, viewMatrix, projMatrix, location, scale, rotation, origin);
  drawThing(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, 36, 60);
}

function drawMultiPyramid(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, location, scale, rotation, origin) {
  updateMatrices(modelMatrix, viewMatrix, projMatrix, location, scale, rotation, origin);
  drawThing(gl, modelMatrix, viewMatrix, projMatrix, u_MvpMatrix, 96, 96);
}

function updateMatrices(modelMatrix, viewMatrix, projMatrix, location, scale, rotation, origin) {
  //modelMatrix.scale(1, 1, -1);
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