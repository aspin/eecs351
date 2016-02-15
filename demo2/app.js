var VSHADER = 'vShared',
    FSHADER = 'fShared';

var SPIN_CONSTANT = 0.5;
var dragging = false,
    swingLeft = true;

function main() {
  loadShaders(function(sources) {
    var canvas = document.getElementById('webgl'),
        gl = initWebGL(canvas, sources),
        vertices = getVertices();

    var modelMatrix = new Matrix4(),
        viewMatrix = new Matrix4(),
        projMatrix = new Matrix4(),
        normalMatrix = new Matrix4();

    var matrices = bindVariables(gl, vertices),
        u_MvpMatrix = matrices[0],
        u_NormalMatrix = matrices[1];

    var shapes = [];
    shapes.push(new MorningStar(
      new Coordinate(0.8, 0.8, 0.1),
      0.3,
      new Rotation(-0.3, -0.3, -0.3, 0, 0, 0)
    ));
    shapes.push(new Joint(
      new Coordinate(-0.8, -0.8, 0.1),
      0.2,
      new Rotation(0, 0, 0, 0, 0, 0)
    ));
    shapes.push(new GroundGrid());
    shapes.push(new Axes());

    var eye = new Eye(
      new Coordinate(3.0, 2.0, 1.5),
      new Coordinate(0.0, 0.0, 0.0),
      new Coordinate(0.0, 0.0, 1.0)
    );

    setupMouseHandlers(gl, canvas, shapes);
    setupKeyboardHandlers(gl, canvas, shapes, eye);

    var animate = function() {
      // Autostretch
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
      //gl.viewport(0, 0, canvas.width, canvas.height);

      updateShapes(shapes);
      draw(gl, canvas, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_MvpMatrix, u_NormalMatrix, shapes, eye);
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
  //sources[FSHADER] = 'precisionV mediump float;\nvarying vec4 v_Color;\nvoid main() {\ngl_FragColor = v_Color;\n}\n';
  //sources[VSHADER] = 'attribute vec4 a_Position;\nuniform mat4 u_ModelMatrix;\nattribute vec4 a_Color;\nvarying vec4 v_Color;\nvoid main() {\ngl_Position = u_ModelMatrix * a_Position;\ngl_PointSize = 10.0;\nv_Color = a_Color;\n}\n ';
  //callback(sources);
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

  var u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  if (!u_LightDirection) {
    throw 'Failed to get u_LightDirection';
  }
  var lightDirection = new Vector3([0.0, 0.0, 1.0]);
  lightDirection.normalize();
  gl.uniform3fv(u_LightDirection, lightDirection.elements);
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
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, size * 9, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Color < 0) {
    throw 'Failed to get a_Color';
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 9, size * 3);
  gl.enableVertexAttribArray(a_Color);

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    throw 'Failed to get a_Normal';
  }
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, size * 9, size * 6);
  gl.enableVertexAttribArray(a_Normal);

  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');

  return [ u_MvpMatrix, u_NormalMatrix ];
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
    var vertices = getVertices();
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var size = vertices.BYTES_PER_ELEMENT;
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, size * 9, size * 3);
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

function setupKeyboardHandlers(gl, canvas, shapes, eye) {
  var morningStar = shapes[0],
      joint = shapes[1];

  window.onkeypress = function (event) {
    switch (event.keyCode) {
      case 119: // w, for up
        //joint.out.position.y += 0.01;
        eye.position.z += 0.05;
        break;
      case 97: // a, for left
        //joint.out.position.x -= 0.01;
        eye.position.x -= 0.05;
        break;
      case 100: // d, for right
        //joint.out.position.x += 0.01;
        eye.position.x += 0.05;
        break;
      case 115: // s, for down
        //joint.out.position.y -= 0.01;
        eye.position.z -= 0.05;
        break;
      case 105: // i, for camera up
        eye.looking.z += 0.01;
        break;
      case 106: //j, for camera left
        eye.looking.x -= 0.01;
        break;
      case 107: // k, for camera down
        eye.looking.z -= 0.01;
        break;
      case 108: // l, for camera right
        eye.looking.x += 0.01;
        break;
      default:
        console.log(event.keyCode);
        break;
    }
  }
}

function draw(gl, canvas, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_MvpMatrix, u_NormalMatrix, shapes, eye) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  viewMatrix.setLookAt(eye.position.x, eye.position.y, eye.position.z,
                       eye.looking.x, eye.looking.y, eye.looking.z,
                       eye.up.x, eye.up.y, eye.up.z);
  var aspectRatio = canvas.width / canvas.height / 2;

  gl.viewport(0, 0, canvas.width / 2, canvas.height);
  projMatrix.setPerspective(40, aspectRatio, 1, 100);
  for(var i in shapes) {
    shapes[i].draw(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_MvpMatrix, u_NormalMatrix);
  }

  gl.viewport(canvas.width / 2, 0, canvas.width / 2,  canvas.height);
  projMatrix.setOrtho(-1 * aspectRatio, aspectRatio, -1, 1, 0, 1000);

  for(var i in shapes) {
    shapes[i].draw(gl, modelMatrix, viewMatrix, projMatrix, normalMatrix, u_MvpMatrix, u_NormalMatrix);
  }
}

function updateShapes(shapes) {
  if (!dragging) {
    var morningStar = shapes[0];
    var joint = shapes[1];

    //morningStar.slider.rotation.x += 4;
    //morningStar.slider.rotation.y += 0.1;
    //morningStar.handle.rotation.x -= SPIN_CONSTANT;
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

    //joint.out.rotation.z -= 1;
    //joint.out.rotation.y -= 1;
    //joint.bend.rotation.y -= 1;
    //joint.bend2.rotation.x -= 1;
    joint.end.rotation.x -= 3;
  }
}

