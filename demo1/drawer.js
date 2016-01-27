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
  // var result;
  // var count = 1.0;
  // for (var key in this.colors) {
  //   if (Math.random() < 1.0 / count) {
  //     result = key;
  //   }
  //   count++;
  // }
  // return result;
  return [Math.random(), Math.random(), Math.random()];
}

// triangleOrder = [1, 2, 0, 3, 4, ...]
Drawer.prototype.exportTriangles = function(triangleSet) {
  var self = this,
      output = [];
  for(var i in triangleSet) {
    self.triangles[triangleSet[i]].forEach(function(point) {
      var concater = point.concat(self.getRandomColor());
      output = output.concat(concater);
    });
  }
  return new Float32Array(output);
}
