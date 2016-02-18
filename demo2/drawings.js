function getVertices() {
  var drawUtil = new Drawer();
  var i;
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

  drawUtil.addNormal('+x1', 1.0, 0.0, 0.0);
  drawUtil.addNormal('+x2', 1.0, 0.0, 0.0);
  drawUtil.addNormal('+y1', 0.0, 1.0, 0.0);
  drawUtil.addNormal('+y2', 0.0, 1.0, 0.0);
  drawUtil.addNormal('+z1', 0.0, 0.0, 1.0);
  drawUtil.addNormal('+z2', 0.0, 0.0, 1.0);
  drawUtil.addNormal('-x1', -1.0, 0.0, 0.0);
  drawUtil.addNormal('-x2', -1.0, 0.0, 0.0);
  drawUtil.addNormal('-y1', 0.0, -1.0, 0.0);
  drawUtil.addNormal('-y2', 0.0, -1.0, 0.0);
  drawUtil.addNormal('-z1', 0.0, 0.0, -1.0);
  drawUtil.addNormal('-z2', 0.0, 0.0, -1.0);

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
  for(i = 0; i < 20; i++) {
    icosaTriangles.push('if' + i);
  }

  // star

  drawUtil.addVertex('o', 0, 0, 0.3);
  drawUtil.addVertex('+sx', 1, 0, 0.3);
  drawUtil.addVertex('-sx', -1, 0, 0.3);
  drawUtil.addVertex('+sy', 0, 1, 0.3);
  drawUtil.addVertex('-sy', 0, -1, 0.3);
  drawUtil.addVertex('s+x+y', 0.3, 0.3, 0.3);
  drawUtil.addVertex('s+x-y', 0.3, -0.3, 0.3);
  drawUtil.addVertex('s-x+y', -0.3, 0.3, 0.3);
  drawUtil.addVertex('s-x-y', -0.3, -0.3, 0.3);
  drawUtil.addVertex('ob', 0, 0, -0.3);
  drawUtil.addVertex('+sbx', 1, 0, -0.3);
  drawUtil.addVertex('-sbx', -1, 0, -0.3);
  drawUtil.addVertex('+sby', 0, 1, -0.3);
  drawUtil.addVertex('-sby', 0, -1, -0.3);
  drawUtil.addVertex('sb+x+y', 0.3, 0.3, -0.3);
  drawUtil.addVertex('sb+x-y', 0.3, -0.3, -0.3);
  drawUtil.addVertex('sb-x+y', -0.3, 0.3, -0.3);
  drawUtil.addVertex('sb-x-y', -0.3, -0.3, -0.3);

  drawUtil.addTriangle('sf0', 'o', '+sx', 's+x+y');
  drawUtil.addTriangle('sf1', 'o', '+sx', 's+x-y');
  drawUtil.addTriangle('sf2', 'o', '-sx', 's-x+y');
  drawUtil.addTriangle('sf3', 'o', '-sx', 's-x-y');
  drawUtil.addTriangle('sf4', 'o', '+sy', 's+x+y');
  drawUtil.addTriangle('sf5', 'o', '+sy', 's-x+y');
  drawUtil.addTriangle('sf6', 'o', '-sy', 's+x-y');
  drawUtil.addTriangle('sf7', 'o', '-sy', 's-x-y');
  for (i = 0; i < 8; i++) {
    drawUtil.addNormal('sf' + i, 0.0, 0.0, 1.0);
  }
  drawUtil.addTriangle('sb0', 'ob', '+sbx', 'sb+x+y');
  drawUtil.addTriangle('sb1', 'ob', '+sbx', 'sb+x-y');
  drawUtil.addTriangle('sb2', 'ob', '-sbx', 'sb-x+y');
  drawUtil.addTriangle('sb3', 'ob', '-sbx', 'sb-x-y');
  drawUtil.addTriangle('sb4', 'ob', '+sby', 'sb+x+y');
  drawUtil.addTriangle('sb5', 'ob', '+sby', 'sb-x+y');
  drawUtil.addTriangle('sb6', 'ob', '-sby', 'sb+x-y');
  drawUtil.addTriangle('sb7', 'ob', '-sby', 'sb-x-y');
  for (i = 0; i < 8; i++) {
    drawUtil.addNormal('sb' + i, 0.0, 0.0, -1.0);
  }
  drawUtil.addTriangle('se0', '+sx', 's+x+y', 'sb+x+y');
  drawUtil.addNormal('se0', 0.394, 0.919, 0.0);
  drawUtil.addTriangle('se1', '+sx', '+sbx', 'sb+x+y');
  drawUtil.addNormal('se1', 0.394, 0.919, 0.0);
  drawUtil.addTriangle('se2', '+sy', 's+x+y', 'sb+x+y');
  drawUtil.addNormal('se2', 0.919, 0.394, 0.0);
  drawUtil.addTriangle('se3', '+sy', '+sby', 'sb+x+y');
  drawUtil.addNormal('se3', 0.919, 0.394, 0.0);
  drawUtil.addTriangle('se4', '+sy', 's-x+y', 'sb-x+y');
  drawUtil.addNormal('se4', -0.919, 0.394, 0.0);
  drawUtil.addTriangle('se5', '+sy', '+sby', 'sb-x+y');
  drawUtil.addNormal('se5', -0.919, 0.394, 0.0);
  drawUtil.addTriangle('se6', '-sx', 's-x+y', 'sb-x+y');
  drawUtil.addNormal('se6', -0.394, 0.919, 0.0);
  drawUtil.addTriangle('se7', '-sx', '-sbx', 'sb-x+y');
  drawUtil.addNormal('se7', -0.394, 0.919, 0.0);
  drawUtil.addTriangle('se8', '-sx', 's-x-y', 'sb-x-y');
  drawUtil.addNormal('se8', -0.394, -0.919, 0.0);
  drawUtil.addTriangle('se9', '-sx', '-sbx', 'sb-x-y');
  drawUtil.addNormal('se9', -0.394, -0.919, 0.0);
  drawUtil.addTriangle('se10', '-sy', 's-x-y', 'sb-x-y');
  drawUtil.addNormal('se10', -0.919, -0.394, 0.0);
  drawUtil.addTriangle('se11', '-sy', '-sby', 'sb-x-y');
  drawUtil.addNormal('se11', -0.919, -0.394, 0.0);
  drawUtil.addTriangle('se12', '-sy', 's+x-y', 'sb+x-y');
  drawUtil.addNormal('se12', -0.919, 0.394, 0.0);
  drawUtil.addTriangle('se13', '-sy', '-sby', 'sb+x-y');
  drawUtil.addNormal('se13', -0.919, 0.394, 0.0);
  drawUtil.addTriangle('se14', '+sx', 's+x-y', 'sb+x-y');
  drawUtil.addNormal('se14', 0.394, -0.919, 0.0);
  drawUtil.addTriangle('se15', '+sx', '+sbx', 'sb+x-y');
  drawUtil.addNormal('se15', 0.394, -0.919, 0.0);

  var starTriangles = [];
  for(i = 0; i < 8; i++) {
    starTriangles.push('sf' + i);
  }
  for(i = 0; i < 8; i++) {
    starTriangles.push('sb' + i);
  }
  for(i = 0; i < 16; i++) {
    starTriangles.push('se' + i);
  }

  // pyramid
  drawUtil.addVertex('ptop', 0.0, 0.0, 1);
  drawUtil.addVertex('plb', -1.0, -1.0, 0.0);
  drawUtil.addVertex('prb', 1.0, -1.0, 0.0);
  drawUtil.addVertex('plf', -1.0, 1.0, 0.0);
  drawUtil.addVertex('prf', 1.0, 1.0, 0.0);

  drawUtil.addTriangle('ptl', 'ptop', 'plf', 'plb');
  drawUtil.addTriangle('ptb', 'ptop', 'plb', 'prb');
  drawUtil.addTriangle('ptr', 'ptop', 'prf', 'prb');
  drawUtil.addTriangle('ptf', 'ptop', 'plf', 'prf');
  drawUtil.addTriangle('ptbs1', 'plb', 'plf', 'prf');
  drawUtil.addTriangle('ptbs2', 'plb', 'prb', 'prf');

  drawUtil.addNormal('ptl', -1.0, 0, 1.0);
  drawUtil.addNormal('ptb', 0, -1.0, 1.0);
  drawUtil.addNormal('ptr', 1.0, 0, 1.0);
  drawUtil.addNormal('ptf', 0, 1.0, 1.0);
  drawUtil.addNormal('ptbs1', 0.0, 0.0, -1);
  drawUtil.addNormal('ptbs2', 0.0, 0.0, -1);

  var pTriangles = [];
  pTriangles.push('ptl');
  pTriangles.push('ptb');
  pTriangles.push('ptr');
  pTriangles.push('ptf');
  pTriangles.push('ptbs1');
  pTriangles.push('ptbs2');

  var triangles = rectangleTris.concat(icosaTriangles).concat(starTriangles).concat(pTriangles);
  var trianglesArray = drawUtil.exportTriangles(triangles);
  
  var vertex,
      min = -50,
      max = 50;
  var groundVertices = new Float32Array(9 * 2 * 2 * 100); // 100 lines, x and y direction

  // x lines, light from all angles
  for(i = 0; i < 100; i++) {
    vertex = new Float32Array([i + min, min, 0.0, 1.0, 1.0, 0.3, 1.0, 1.0, 1.0,
                               i + min, max, 0.0, 1.0, 1.0, 0.3, 1.0, 1.0, 1.0]);
    groundVertices.set(vertex, i * 18);
  }

  // y lines
  for(i = 0; i < 100; i++) {
    vertex = new Float32Array([min, i + min, 0.0, 0.5, 1.0, 0.5, 1.0, 1.0, 1.0,
                               max, i + min, 0.0, 0.5, 1.0, 0.5, 1.0, 1.0, 1.0]);
    groundVertices.set(vertex, (i + 100) * 18);
  }

  var axesVertices = new Float32Array([
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
    -1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0,
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
    0.0, -1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0,
    0.0, 0.0, -1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0
  ]);

  var finalArray = new Float32Array(trianglesArray.length + axesVertices.length + groundVertices.length);
  finalArray.set(trianglesArray);
  finalArray.set(axesVertices, trianglesArray.length);
  finalArray.set(groundVertices, trianglesArray.length + axesVertices.length);
  return finalArray;
}
