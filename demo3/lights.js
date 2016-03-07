
function Light(gl) {
  this.gl = gl;

  this.u_LightPos = gl.getUniformLocation(gl.program, 'light.u_LightPos');
  this.u_LightAmb = gl.getUniformLocation(gl.program, 'light.u_LightAmb');
  this.u_LightDiff = gl.getUniformLocation(gl.program, 'light.u_LightDiff');
  this.u_LightSpec = gl.getUniformLocation(gl.program, 'light.u_LightSpec');

  this.u_Ke = gl.getUniformLocation(gl.program, 'light.u_Ke');
  this.u_Ka = gl.getUniformLocation(gl.program, 'light.u_Ka');
  this.u_Kd = gl.getUniformLocation(gl.program, 'light.u_Kd');
  this.u_Ks = gl.getUniformLocation(gl.program, 'light.u_Ks');
  this.u_Kshiny = gl.getUniformLocation(gl.program, 'light.u_Kshiny');

  debugger;
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

Light.prototype.initLights = function(options) {
  this.lightPos.set(options.pos);
  this.lightAmb.set(options.amb);
  this.lightDiff.set(options.diff);
  this.lightSpec.set(options.spec);

  this.matl_Ke.set(options.ke);
  this.matl_Ka.set(options.ka);
  this.matl_Kd.set(options.kd);
  this.matl_Ks.set(options.ks);
  this.matl_Kshiny = options.kshiny;

  this.gl.uniform3fv(this.u_LightPos, this.lightPos);
  this.gl.uniform3fv(this.u_LightAmb, this.lightAmb);
  this.gl.uniform3fv(this.u_LightDiff, this.lightDiff);
  this.gl.uniform3fv(this.u_LightSpec, this.lightSpec);

  this.gl.uniform3fv(this.u_Ke, this.matl_Ke);
  this.gl.uniform3fv(this.u_Ka, this.matl_Ka);
  this.gl.uniform3fv(this.u_Kd, this.matl_Kd);
  this.gl.uniform3fv(this.u_Ks, this.matl_Ks);
  this.gl.uniform1i(this.u_Kshiny, this.matl_Kshiny);
};