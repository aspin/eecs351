
function Light(gl) {
  this.gl = gl;

  this.worldLightOn = true;
  this.headlightOn = true;
  this.usePhongShading = true;
  this.usePhongLighting = true;

  this.u_worldOn = gl.getUniformLocation(gl.program, 'u_worldOn');
  this.u_headOn = gl.getUniformLocation(gl.program, 'u_headOn');
  this.u_usePhongShading = gl.getUniformLocation(gl.program, 'u_usePhongShading');
  this.u_usePhongLighting = gl.getUniformLocation(gl.program, 'u_usePhongLight');

  this.u_LightPos = gl.getUniformLocation(gl.program, 'light.u_LightPos');
  this.u_LightAmb = gl.getUniformLocation(gl.program, 'light.u_LightAmb');
  this.u_LightDiff = gl.getUniformLocation(gl.program, 'light.u_LightDiff');
  this.u_LightSpec = gl.getUniformLocation(gl.program, 'light.u_LightSpec');

  this.u_Ke = gl.getUniformLocation(gl.program, 'light.u_Ke');
  this.u_Ka = gl.getUniformLocation(gl.program, 'light.u_Ka');
  this.u_Kd = gl.getUniformLocation(gl.program, 'light.u_Kd');
  this.u_Ks = gl.getUniformLocation(gl.program, 'light.u_Ks');
  this.u_Kshiny = gl.getUniformLocation(gl.program, 'light.u_Kshiny');

  if (!(this.u_LightPos && this.u_LightAmb && this.u_LightDiff && this.u_LightSpec &&
    this.u_Ke && this.u_Ka && this.u_Kd && this.u_Ks && this.u_Kshiny)) {
    throw 'Failed to setup light storage locations';
  }

  this.lightPos = new Float32Array(3);
  this.lightAmb = new Float32Array(3);
  this.lightDiff = new Float32Array(3);
  this.lightSpec = new Float32Array(3);

  this.matl_Ke = new Float32Array(3);
  this.matl_Ka = new Float32Array(3);
  this.matl_Kd = new Float32Array(3);
  this.matl_Ks = new Float32Array(3);
  this.matl_Kshiny = false;
}

Light.prototype.setLights = function(options) {
  this.lightPos = new Vector3(options.pos);
  this.lightAmb.set(options.amb);
  this.lightDiff.set(options.diff);
  this.lightSpec.set(options.spec);

  this.matl_Ke.set(options.ke);
  this.matl_Ka.set(options.ka);
  this.matl_Kd.set(options.kd);
  this.matl_Ks.set(options.ks);
  this.matl_Kshiny = options.kshiny;

  this.gl.uniform3fv(this.u_LightPos, this.lightPos.elements);
  this.gl.uniform3fv(this.u_LightAmb, this.lightAmb);
  this.gl.uniform3fv(this.u_LightDiff, this.lightDiff);
  this.gl.uniform3fv(this.u_LightSpec, this.lightSpec);
};

Light.prototype.updateLights = function(viewMatrix) {
  var lightPosition = viewMatrix.multiplyVector3(this.lightPos);
  this.gl.uniform3fv(this.u_LightPos, lightPosition.elements);
  this.gl.uniform3fv(this.u_LightAmb, this.lightAmb);
  this.gl.uniform3fv(this.u_LightDiff, this.lightDiff);
  this.gl.uniform3fv(this.u_LightSpec, this.lightSpec);

  this.gl.uniform1i(this.u_worldOn, this.worldLightOn);
  this.gl.uniform1i(this.u_headOn, this.headlightOn);
  this.gl.uniform1i(this.u_usePhongShading, this.usePhongShading);
  this.gl.uniform1i(this.u_usePhongLighting, this.usePhongLighting);
};

Light.prototype.setMaterial = function(material) {
  this.gl.uniform3f(this.u_Ke, material.emissive[0], material.emissive[1], material.emissive[2]);
  this.gl.uniform3f(this.u_Ka, material.ambient[0], material.ambient[1], material.ambient[2]);
  this.gl.uniform3f(this.u_Kd, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
  this.gl.uniform3f(this.u_Ks, material.specular[0], material.specular[1], material.specular[2]);
  this.gl.uniform1i(this.u_Kshiny, material.shiny);
};

Light.prototype.reset = function() {
  this.gl.uniform3fv(this.u_Ke, this.matl_Ke);
  this.gl.uniform3fv(this.u_Ka, this.matl_Ka);
  this.gl.uniform3fv(this.u_Kd, this.matl_Kd);
  this.gl.uniform3fv(this.u_Ks, this.matl_Ks);
  this.gl.uniform1i(this.u_Kshiny, this.matl_Kshiny);
};

function LightGUI(light, draw) {
  var self = this;

  this.light = light;
  this.draw = draw;

  this.lightX = this.light.lightPos.elements[0];
  this.lightY = this.light.lightPos.elements[1];
  this.lightZ = this.light.lightPos.elements[2];
  this.ambientR = this.light.lightAmb[0];
  this.ambientG = this.light.lightAmb[1];
  this.ambientB = this.light.lightAmb[2];
  this.diffuseR = this.light.lightDiff[0];
  this.diffuseG = this.light.lightDiff[1];
  this.diffuseB = this.light.lightDiff[2];
  this.specularR = this.light.lightSpec[0];
  this.specularG = this.light.lightSpec[1];
  this.specularB = this.light.lightSpec[2];

  var gui = new dat.GUI();
  gui.add(self, 'lightX').step(0.2).onChange(function(newValue) {
    self.light.lightPos.elements[0] = newValue;
    self.draw();
  });
  gui.add(self, 'lightY').step(0.2).onChange(function(newValue) {
    self.light.lightPos.elements[1] = newValue;
    self.draw();
  });
  gui.add(self, 'lightZ').step(0.2).onChange(function(newValue) {
    self.light.lightPos.elements[2] = newValue;
    self.draw();
  });
  gui.add(self, 'ambientR', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightAmb[0] = newValue;
    self.draw();
  });
  gui.add(self, 'ambientG', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightAmb[1] = newValue;
    self.draw();
  });
  gui.add(self, 'ambientB', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightAmb[2] = newValue;
    self.draw();
  });
  gui.add(self, 'diffuseR', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightDiff[0] = newValue;
    self.draw();
  });
  gui.add(self, 'diffuseG', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightDiff[1] = newValue;
    self.draw();
  });
  gui.add(self, 'diffuseB', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightDiff[2] = newValue;
    self.draw();
  });
  gui.add(self, 'specularR', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightSpec[0] = newValue;
    self.draw();
  });
  gui.add(self, 'specularG', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightSpec[1] = newValue;
    self.draw();
  });
  gui.add(self, 'specularB', 0, 1).step(0.05).onChange(function(newValue) {
    self.light.lightSpec[2] = newValue;
    self.draw();
  });
}
