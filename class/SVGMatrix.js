const { extendClass } = require('../utils/objectCreationUtils')
const matrix = require('gl-matrix').mat2d

const radians = function (d) {
  return d % 360 * Math.PI / 180
}

class SVGMatrix {
  constructor () {
    this.a = this.d = 1
    this.b = this.c = this.e = this.f = 0
  }

  multiply (m) {
    var r = new SVGMatrix()
    r.a = this.a * m.a + this.c * m.b + this.e * 0
    r.b = this.b * m.a + this.d * m.b + this.f * 0
    r.c = this.a * m.c + this.c * m.d + this.e * 0
    r.d = this.b * m.c + this.d * m.d + this.f * 0
    r.e = this.a * m.e + this.c * m.f + this.e * 1
    r.f = this.b * m.e + this.d * m.f + this.f * 1
    return r
  }
  translate (x=0, y=0) {
    return this.multiply(matrixFactory(1, 0, 0, 1, x, y))
  }
  inverse () {
    var t = matrix.fromValues(this.a, this.b, this.c, this.d, this.e, this.f)
    var r = matrix.create()
    matrix.invert(r, t)
    return matrixFactory(...r)
  }
  toString () {
    return 'SVGMatrix'
  }
  scale (scaleX, scaleY=scaleX) {
    return this.multiply(matrixFactory(scaleX, 0, 0, scaleY, 0, 0))
  }
  rotate (r, x, y) {
    r = r % 360 * Math.PI / 180
    return this.multiply(matrixFactory(
      Math.cos(r),
      Math.sin(r),
      -Math.sin(r),
      Math.cos(r),
      x ? -Math.cos(r) * x + Math.sin(r) * y + x : 0,
      y ? -Math.sin(r) * x - Math.cos(r) * y + y : 0
    ))
  }
  skew (x, y) {
    return this.multiply(matrixFactory(1, Math.tan(radians(y)), Math.tan(radians(x)), 1, 0, 0))
  }
  skewX (x) {
    return this.skew(x, 0)
  }
  skewY (y) {
    return this.skew(0, y)
  }
}

const matrixFactory = function (a, b, c, d, e, f) {
  var r = new SVGMatrix()
  r.a = a
  r.b = b
  r.c = c
  r.d = d
  r.e = e
  r.f = f
  return r
}

extendClass(SVGMatrix, {
  matrixFactory
})

module.exports = SVGMatrix
