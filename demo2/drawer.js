function Drawer() {
  this.vertices = {};
  this.normals = {};
  this.triangles = {};
  this.colors = {};
}

Drawer.prototype.addVertex = function(id, x, y, z) {
  this.vertices[id] = [x, y, z];
};

Drawer.prototype.addTriangle = function(id, p1, p2, p3) {
  this.triangles[id] = [this.vertices[p1], this.vertices[p2], this.vertices[p3]];
};

Drawer.prototype.addNormal = function(id, x, y, z) {
  this.normals[id] = [x, y, z];
};

Drawer.prototype.addColor = function(id, r, g, b) {
  this.colors[id] = [r, g, b];
};

Drawer.prototype.computeNormal = function(triangleSet) {
  return this.normals[triangleSet] || [0.0, 0.0, 1.0];
};

Drawer.prototype.getRandomColors = function(count) {
  var colors = [];
  for(var i = 0; i < count; i++) {
    colors.push(this.getRandomColor());
  }
  return colors;
};

Drawer.prototype.getRandomColor = function() {
  return [Math.random(), Math.random(), Math.random()];
};

// triangleOrder = [1, 2, 0, 3, 4, ...]
Drawer.prototype.exportTriangles = function(triangleSet) {
  var self = this,
      output = [];
  for(var i in triangleSet) {
    var normal = self.normals[triangleSet[i]] || [0.0, 0.0, 1.0];
    self.triangles[triangleSet[i]].forEach(function(point) {
      var concater = point.concat(self.getRandomColor()).concat(normal);
      output = output.concat(concater);
    });
  }
  return new Float32Array(output);
};
