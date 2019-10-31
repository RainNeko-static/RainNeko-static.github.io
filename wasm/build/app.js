/*!
@fileoverview gl-matrix - High performance matrix and vector operations
@author Brandon Jones
@author Colin MacKenzie IV
@version 3.0.0

Copyright (c) 2015-2019, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

const exports = {};

/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}

var common = /*#__PURE__*/ Object.freeze({
  EPSILON: EPSILON,
  get ARRAY_TYPE() {
    return ARRAY_TYPE;
  },
  RANDOM: RANDOM,
  setMatrixArrayType: setMatrixArrayType,
  toRadian: toRadian,
  equals: equals
});

/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */

function create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */

function clone(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */

function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */

function fromValues(m00, m01, m10, m11) {
  var out = new ARRAY_TYPE(4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */

function set(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}
/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */

function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    var a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}
/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */

function invert(out, a) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3]; // Calculate the determinant

  var det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] = a0 * det;
  return out;
}
/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */

function adjoint(out, a) {
  // Caching this value is nessecary if out == a
  var a0 = a[0];
  out[0] = a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a0;
  return out;
}
/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant(a) {
  return a[0] * a[3] - a[2] * a[1];
}
/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */

function multiply(out, a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}
/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function rotate(out, a, rad) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}
/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/

function scale(out, a, v) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var v0 = v[0],
    v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */

function fromRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */

function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str(a) {
  return "mat2(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob(a) {
  return Math.sqrt(
    Math.pow(a[0], 2) +
      Math.pow(a[1], 2) +
      Math.pow(a[2], 2) +
      Math.pow(a[3], 2)
  );
}
/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix
 * @param {mat2} D the diagonal matrix
 * @param {mat2} U the upper triangular matrix
 * @param {mat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2] / a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}
/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$1(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
  );
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */

function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */

function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Alias for {@link mat2.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link mat2.subtract}
 * @function
 */

var sub = subtract;

var mat2 = /*#__PURE__*/ Object.freeze({
  create: create,
  clone: clone,
  copy: copy,
  identity: identity,
  fromValues: fromValues,
  set: set,
  transpose: transpose,
  invert: invert,
  adjoint: adjoint,
  determinant: determinant,
  multiply: multiply,
  rotate: rotate,
  scale: scale,
  fromRotation: fromRotation,
  fromScaling: fromScaling,
  str: str,
  frob: frob,
  LDU: LDU,
  add: add,
  subtract: subtract,
  exactEquals: exactEquals,
  equals: equals$1,
  multiplyScalar: multiplyScalar,
  multiplyScalarAndAdd: multiplyScalarAndAdd,
  mul: mul,
  sub: sub
});

/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */

function create$1() {
  var out = new ARRAY_TYPE(6);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[4] = 0;
    out[5] = 0;
  }

  out[0] = 1;
  out[3] = 1;
  return out;
}
/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */

function clone$1(a) {
  var out = new ARRAY_TYPE(6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */

function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}
/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */

function identity$1(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */

function fromValues$1(a, b, c, d, tx, ty) {
  var out = new ARRAY_TYPE(6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */

function set$1(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}
/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */

function invert$1(out, a) {
  var aa = a[0],
    ab = a[1],
    ac = a[2],
    ad = a[3];
  var atx = a[4],
    aty = a[5];
  var det = aa * ad - ab * ac;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}
/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$1(a) {
  return a[0] * a[3] - a[1] * a[2];
}
/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */

function multiply$1(out, a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}
/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function rotate$1(out, a, rad) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5];
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  out[0] = a0 * c + a2 * s;
  out[1] = a1 * c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/

function scale$1(out, a, v) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5];
  var v0 = v[0],
    v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}
/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/

function translate(out, a, v) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5];
  var v0 = v[0],
    v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */

function fromRotation$1(out, rad) {
  var s = Math.sin(rad),
    c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */

function fromScaling$1(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */

function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}
/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$1(a) {
  return (
    "mat2d(" +
    a[0] +
    ", " +
    a[1] +
    ", " +
    a[2] +
    ", " +
    a[3] +
    ", " +
    a[4] +
    ", " +
    a[5] +
    ")"
  );
}
/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob$1(a) {
  return Math.sqrt(
    Math.pow(a[0], 2) +
      Math.pow(a[1], 2) +
      Math.pow(a[2], 2) +
      Math.pow(a[3], 2) +
      Math.pow(a[4], 2) +
      Math.pow(a[5], 2) +
      1
  );
}
/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */

function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */

function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */

function multiplyScalar$1(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}
/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */

function multiplyScalarAndAdd$1(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$1(a, b) {
  return (
    a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2] &&
    a[3] === b[3] &&
    a[4] === b[4] &&
    a[5] === b[5]
  );
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$2(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5))
  );
}
/**
 * Alias for {@link mat2d.multiply}
 * @function
 */

var mul$1 = multiply$1;
/**
 * Alias for {@link mat2d.subtract}
 * @function
 */

var sub$1 = subtract$1;

var mat2d = /*#__PURE__*/ Object.freeze({
  create: create$1,
  clone: clone$1,
  copy: copy$1,
  identity: identity$1,
  fromValues: fromValues$1,
  set: set$1,
  invert: invert$1,
  determinant: determinant$1,
  multiply: multiply$1,
  rotate: rotate$1,
  scale: scale$1,
  translate: translate,
  fromRotation: fromRotation$1,
  fromScaling: fromScaling$1,
  fromTranslation: fromTranslation,
  str: str$1,
  frob: frob$1,
  add: add$1,
  subtract: subtract$1,
  multiplyScalar: multiplyScalar$1,
  multiplyScalarAndAdd: multiplyScalarAndAdd$1,
  exactEquals: exactEquals$1,
  equals: equals$2,
  mul: mul$1,
  sub: sub$1
});

/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */

function create$2() {
  var out = new ARRAY_TYPE(9);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
  }

  out[0] = 1;
  out[4] = 1;
  out[8] = 1;
  return out;
}
/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */

function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */

function clone$2(a) {
  var out = new ARRAY_TYPE(9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */

function copy$2(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */

function fromValues$2(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  var out = new ARRAY_TYPE(9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */

function set$2(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */

function identity$2(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */

function transpose$1(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
      a02 = a[2],
      a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}
/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */

function invert$2(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2];
  var a10 = a[3],
    a11 = a[4],
    a12 = a[5];
  var a20 = a[6],
    a21 = a[7],
    a22 = a[8];
  var b01 = a22 * a11 - a12 * a21;
  var b11 = -a22 * a10 + a12 * a20;
  var b21 = a21 * a10 - a11 * a20; // Calculate the determinant

  var det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */

function adjoint$1(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2];
  var a10 = a[3],
    a11 = a[4],
    a12 = a[5];
  var a20 = a[6],
    a21 = a[7],
    a22 = a[8];
  out[0] = a11 * a22 - a12 * a21;
  out[1] = a02 * a21 - a01 * a22;
  out[2] = a01 * a12 - a02 * a11;
  out[3] = a12 * a20 - a10 * a22;
  out[4] = a00 * a22 - a02 * a20;
  out[5] = a02 * a10 - a00 * a12;
  out[6] = a10 * a21 - a11 * a20;
  out[7] = a01 * a20 - a00 * a21;
  out[8] = a00 * a11 - a01 * a10;
  return out;
}
/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$2(a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2];
  var a10 = a[3],
    a11 = a[4],
    a12 = a[5];
  var a20 = a[6],
    a21 = a[7],
    a22 = a[8];
  return (
    a00 * (a22 * a11 - a12 * a21) +
    a01 * (-a22 * a10 + a12 * a20) +
    a02 * (a21 * a10 - a11 * a20)
  );
}
/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */

function multiply$2(out, a, b) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2];
  var a10 = a[3],
    a11 = a[4],
    a12 = a[5];
  var a20 = a[6],
    a21 = a[7],
    a22 = a[8];
  var b00 = b[0],
    b01 = b[1],
    b02 = b[2];
  var b10 = b[3],
    b11 = b[4],
    b12 = b[5];
  var b20 = b[6],
    b21 = b[7],
    b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */

function translate$1(out, a, v) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a10 = a[3],
    a11 = a[4],
    a12 = a[5],
    a20 = a[6],
    a21 = a[7],
    a22 = a[8],
    x = v[0],
    y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function rotate$2(out, a, rad) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a10 = a[3],
    a11 = a[4],
    a12 = a[5],
    a20 = a[6],
    a21 = a[7],
    a22 = a[8],
    s = Math.sin(rad),
    c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/

function scale$2(out, a, v) {
  var x = v[0],
    y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */

function fromTranslation$1(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */

function fromRotation$2(out, rad) {
  var s = Math.sin(rad),
    c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = -s;
  out[4] = c;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */

function fromScaling$2(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/

function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;
  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;
  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}
/**
 * Calculates a 3x3 matrix from the given quaternion
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat3} out
 */

function fromQuat(out, q) {
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
/**
 * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {mat4} a Mat4 to derive the normal matrix from
 *
 * @returns {mat3} out
 */

function normalFromMat4(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det =
    b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */

function projection(out, width, height) {
  out[0] = 2 / width;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = -2 / height;
  out[5] = 0;
  out[6] = -1;
  out[7] = 1;
  out[8] = 1;
  return out;
}
/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$2(a) {
  return (
    "mat3(" +
    a[0] +
    ", " +
    a[1] +
    ", " +
    a[2] +
    ", " +
    a[3] +
    ", " +
    a[4] +
    ", " +
    a[5] +
    ", " +
    a[6] +
    ", " +
    a[7] +
    ", " +
    a[8] +
    ")"
  );
}
/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob$2(a) {
  return Math.sqrt(
    Math.pow(a[0], 2) +
      Math.pow(a[1], 2) +
      Math.pow(a[2], 2) +
      Math.pow(a[3], 2) +
      Math.pow(a[4], 2) +
      Math.pow(a[5], 2) +
      Math.pow(a[6], 2) +
      Math.pow(a[7], 2) +
      Math.pow(a[8], 2)
  );
}
/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */

function add$2(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */

function subtract$2(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */

function multiplyScalar$2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}
/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */

function multiplyScalarAndAdd$2(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$2(a, b) {
  return (
    a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2] &&
    a[3] === b[3] &&
    a[4] === b[4] &&
    a[5] === b[5] &&
    a[6] === b[6] &&
    a[7] === b[7] &&
    a[8] === b[8]
  );
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$3(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5],
    a6 = a[6],
    a7 = a[7],
    a8 = a[8];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7],
    b8 = b[8];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
    Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
    Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
    Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8))
  );
}
/**
 * Alias for {@link mat3.multiply}
 * @function
 */

var mul$2 = multiply$2;
/**
 * Alias for {@link mat3.subtract}
 * @function
 */

var sub$2 = subtract$2;

var mat3 = /*#__PURE__*/ Object.freeze({
  create: create$2,
  fromMat4: fromMat4,
  clone: clone$2,
  copy: copy$2,
  fromValues: fromValues$2,
  set: set$2,
  identity: identity$2,
  transpose: transpose$1,
  invert: invert$2,
  adjoint: adjoint$1,
  determinant: determinant$2,
  multiply: multiply$2,
  translate: translate$1,
  rotate: rotate$2,
  scale: scale$2,
  fromTranslation: fromTranslation$1,
  fromRotation: fromRotation$2,
  fromScaling: fromScaling$2,
  fromMat2d: fromMat2d,
  fromQuat: fromQuat,
  normalFromMat4: normalFromMat4,
  projection: projection,
  str: str$2,
  frob: frob$2,
  add: add$2,
  subtract: subtract$2,
  multiplyScalar: multiplyScalar$2,
  multiplyScalarAndAdd: multiplyScalarAndAdd$2,
  exactEquals: exactEquals$2,
  equals: equals$3,
  mul: mul$2,
  sub: sub$2
});

/**
 * 4x4 Matrix<br>Format: column-major, when typed out it looks like row-major<br>The matrices are being post multiplied.
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */

function create$3() {
  var out = new ARRAY_TYPE(16);

  if (ARRAY_TYPE != Float32Array) {
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
  }

  out[0] = 1;
  out[5] = 1;
  out[10] = 1;
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */

function clone$3(a) {
  var out = new ARRAY_TYPE(16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function copy$3(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */

function fromValues$3(
  m00,
  m01,
  m02,
  m03,
  m10,
  m11,
  m12,
  m13,
  m20,
  m21,
  m22,
  m23,
  m30,
  m31,
  m32,
  m33
) {
  var out = new ARRAY_TYPE(16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */

function set$3(
  out,
  m00,
  m01,
  m02,
  m03,
  m10,
  m11,
  m12,
  m13,
  m20,
  m21,
  m22,
  m23,
  m30,
  m31,
  m32,
  m33
) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */

function identity$3(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function transpose$2(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    var a01 = a[1],
      a02 = a[2],
      a03 = a[3];
    var a12 = a[6],
      a13 = a[7];
    var a23 = a[11];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}
/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function invert$3(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  var det =
    b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }

  det = 1.0 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */

function adjoint$2(out, a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  out[0] =
    a11 * (a22 * a33 - a23 * a32) -
    a21 * (a12 * a33 - a13 * a32) +
    a31 * (a12 * a23 - a13 * a22);
  out[1] = -(
    a01 * (a22 * a33 - a23 * a32) -
    a21 * (a02 * a33 - a03 * a32) +
    a31 * (a02 * a23 - a03 * a22)
  );
  out[2] =
    a01 * (a12 * a33 - a13 * a32) -
    a11 * (a02 * a33 - a03 * a32) +
    a31 * (a02 * a13 - a03 * a12);
  out[3] = -(
    a01 * (a12 * a23 - a13 * a22) -
    a11 * (a02 * a23 - a03 * a22) +
    a21 * (a02 * a13 - a03 * a12)
  );
  out[4] = -(
    a10 * (a22 * a33 - a23 * a32) -
    a20 * (a12 * a33 - a13 * a32) +
    a30 * (a12 * a23 - a13 * a22)
  );
  out[5] =
    a00 * (a22 * a33 - a23 * a32) -
    a20 * (a02 * a33 - a03 * a32) +
    a30 * (a02 * a23 - a03 * a22);
  out[6] = -(
    a00 * (a12 * a33 - a13 * a32) -
    a10 * (a02 * a33 - a03 * a32) +
    a30 * (a02 * a13 - a03 * a12)
  );
  out[7] =
    a00 * (a12 * a23 - a13 * a22) -
    a10 * (a02 * a23 - a03 * a22) +
    a20 * (a02 * a13 - a03 * a12);
  out[8] =
    a10 * (a21 * a33 - a23 * a31) -
    a20 * (a11 * a33 - a13 * a31) +
    a30 * (a11 * a23 - a13 * a21);
  out[9] = -(
    a00 * (a21 * a33 - a23 * a31) -
    a20 * (a01 * a33 - a03 * a31) +
    a30 * (a01 * a23 - a03 * a21)
  );
  out[10] =
    a00 * (a11 * a33 - a13 * a31) -
    a10 * (a01 * a33 - a03 * a31) +
    a30 * (a01 * a13 - a03 * a11);
  out[11] = -(
    a00 * (a11 * a23 - a13 * a21) -
    a10 * (a01 * a23 - a03 * a21) +
    a20 * (a01 * a13 - a03 * a11)
  );
  out[12] = -(
    a10 * (a21 * a32 - a22 * a31) -
    a20 * (a11 * a32 - a12 * a31) +
    a30 * (a11 * a22 - a12 * a21)
  );
  out[13] =
    a00 * (a21 * a32 - a22 * a31) -
    a20 * (a01 * a32 - a02 * a31) +
    a30 * (a01 * a22 - a02 * a21);
  out[14] = -(
    a00 * (a11 * a32 - a12 * a31) -
    a10 * (a01 * a32 - a02 * a31) +
    a30 * (a01 * a12 - a02 * a11)
  );
  out[15] =
    a00 * (a11 * a22 - a12 * a21) -
    a10 * (a01 * a22 - a02 * a21) +
    a20 * (a01 * a12 - a02 * a11);
  return out;
}
/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */

function determinant$3(a) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15];
  var b00 = a00 * a11 - a01 * a10;
  var b01 = a00 * a12 - a02 * a10;
  var b02 = a00 * a13 - a03 * a10;
  var b03 = a01 * a12 - a02 * a11;
  var b04 = a01 * a13 - a03 * a11;
  var b05 = a02 * a13 - a03 * a12;
  var b06 = a20 * a31 - a21 * a30;
  var b07 = a20 * a32 - a22 * a30;
  var b08 = a20 * a33 - a23 * a30;
  var b09 = a21 * a32 - a22 * a31;
  var b10 = a21 * a33 - a23 * a31;
  var b11 = a22 * a33 - a23 * a32; // Calculate the determinant

  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function multiply$3(out, a, b) {
  var a00 = a[0],
    a01 = a[1],
    a02 = a[2],
    a03 = a[3];
  var a10 = a[4],
    a11 = a[5],
    a12 = a[6],
    a13 = a[7];
  var a20 = a[8],
    a21 = a[9],
    a22 = a[10],
    a23 = a[11];
  var a30 = a[12],
    a31 = a[13],
    a32 = a[14],
    a33 = a[15]; // Cache only the current line of the second matrix

  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */

function translate$2(out, a, v) {
  var x = v[0],
    y = v[1],
    z = v[2];
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}
/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/

function scale$3(out, a, v) {
  var x = v[0],
    y = v[1],
    z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function rotate$3(out, a, rad, axis) {
  var x = axis[0],
    y = axis[1],
    z = axis[2];
  var len = Math.sqrt(x * x + y * y + z * z);
  var s, c, t;
  var a00, a01, a02, a03;
  var a10, a11, a12, a13;
  var a20, a21, a22, a23;
  var b00, b01, b02;
  var b10, b11, b12;
  var b20, b21, b22;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11]; // Construct the elements of the rotation matrix

  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c; // Perform rotation-specific matrix multiplication

  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  return out;
}
/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateX(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication

  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateY(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a20 = a[8];
  var a21 = a[9];
  var a22 = a[10];
  var a23 = a[11];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged rows
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication

  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}
/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function rotateZ(out, a, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad);
  var a00 = a[0];
  var a01 = a[1];
  var a02 = a[2];
  var a03 = a[3];
  var a10 = a[4];
  var a11 = a[5];
  var a12 = a[6];
  var a13 = a[7];

  if (a !== out) {
    // If the source and destination differ, copy the unchanged last row
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  } // Perform axis-specific matrix multiplication

  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}
/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */

function fromTranslation$2(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */

function fromScaling$3(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */

function fromRotation$3(out, rad, axis) {
  var x = axis[0],
    y = axis[1],
    z = axis[2];
  var len = Math.sqrt(x * x + y * y + z * z);
  var s, c, t;

  if (len < EPSILON) {
    return null;
  }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c; // Perform rotation-specific matrix multiplication

  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromXRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromYRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = 0;
  out[2] = -s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */

function fromZRotation(out, rad) {
  var s = Math.sin(rad);
  var c = Math.cos(rad); // Perform axis-specific matrix multiplication

  out[0] = c;
  out[1] = s;
  out[2] = 0;
  out[3] = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */

function fromRotationTranslation(out, q, v) {
  // Quaternion math
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a new mat4 from a dual quat.
 *
 * @param {mat4} out Matrix
 * @param {quat2} a Dual Quaternion
 * @returns {mat4} mat4 receiving operation result
 */

function fromQuat2(out, a) {
  var translation = new ARRAY_TYPE(3);
  var bx = -a[0],
    by = -a[1],
    bz = -a[2],
    bw = a[3],
    ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7];
  var magnitude = bx * bx + by * by + bz * bz + bw * bw; //Only scale if it makes sense

  if (magnitude > 0) {
    translation[0] = ((ax * bw + aw * bx + ay * bz - az * by) * 2) / magnitude;
    translation[1] = ((ay * bw + aw * by + az * bx - ax * bz) * 2) / magnitude;
    translation[2] = ((az * bw + aw * bz + ax * by - ay * bx) * 2) / magnitude;
  } else {
    translation[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
    translation[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
    translation[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  }

  fromRotationTranslation(out, a, translation);
  return out;
}
/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */

function getScaling(out, mat) {
  var m11 = mat[0];
  var m12 = mat[1];
  var m13 = mat[2];
  var m21 = mat[4];
  var m22 = mat[5];
  var m23 = mat[6];
  var m31 = mat[8];
  var m32 = mat[9];
  var m33 = mat[10];
  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
  return out;
}
/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */

function getRotation(out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  var trace = mat[0] + mat[5] + mat[10];
  var S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if (mat[0] > mat[5] && mat[0] > mat[10]) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */

function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}
/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */

function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var xy = x * y2;
  var xz = x * z2;
  var yy = y * y2;
  var yz = y * z2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  var sx = s[0];
  var sy = s[1];
  var sz = s[2];
  var ox = o[0];
  var oy = o[1];
  var oz = o[2];
  var out0 = (1 - (yy + zz)) * sx;
  var out1 = (xy + wz) * sx;
  var out2 = (xz - wy) * sx;
  var out4 = (xy - wz) * sy;
  var out5 = (1 - (xx + zz)) * sy;
  var out6 = (yz + wx) * sy;
  var out8 = (xz + wy) * sz;
  var out9 = (yz - wx) * sz;
  var out10 = (1 - (xx + yy)) * sz;
  out[0] = out0;
  out[1] = out1;
  out[2] = out2;
  out[3] = 0;
  out[4] = out4;
  out[5] = out5;
  out[6] = out6;
  out[7] = 0;
  out[8] = out8;
  out[9] = out9;
  out[10] = out10;
  out[11] = 0;
  out[12] = v[0] + ox - (out0 * ox + out4 * oy + out8 * oz);
  out[13] = v[1] + oy - (out1 * ox + out5 * oy + out9 * oz);
  out[14] = v[2] + oz - (out2 * ox + out6 * oy + out10 * oz);
  out[15] = 1;
  return out;
}
/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */

function fromQuat$1(out, q) {
  var x = q[0],
    y = q[1],
    z = q[2],
    w = q[3];
  var x2 = x + x;
  var y2 = y + y;
  var z2 = z + z;
  var xx = x * x2;
  var yx = y * x2;
  var yy = y * y2;
  var zx = z * x2;
  var zy = z * y2;
  var zz = z * z2;
  var wx = w * x2;
  var wy = w * y2;
  var wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */

function frustum(out, left, right, bottom, top, near, far) {
  var rl = 1 / (right - left);
  var tb = 1 / (top - bottom);
  var nf = 1 / (near - far);
  out[0] = near * 2 * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = near * 2 * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = far * near * 2 * nf;
  out[15] = 0;
  return out;
}
/**
 * Generates a perspective projection matrix with the given bounds.
 * Passing null/undefined/no value for far will generate infinite projection matrix.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum, can be null or Infinity
 * @returns {mat4} out
 */

function perspective(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2),
    nf;
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[15] = 0;

  if (far != null && far !== Infinity) {
    nf = 1 / (near - far);
    out[10] = (far + near) * nf;
    out[14] = 2 * far * near * nf;
  } else {
    out[10] = -1;
    out[14] = -2 * near;
  }

  return out;
}
/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function perspectiveFromFieldOfView(out, fov, near, far) {
  var upTan = Math.tan((fov.upDegrees * Math.PI) / 180.0);
  var downTan = Math.tan((fov.downDegrees * Math.PI) / 180.0);
  var leftTan = Math.tan((fov.leftDegrees * Math.PI) / 180.0);
  var rightTan = Math.tan((fov.rightDegrees * Math.PI) / 180.0);
  var xScale = 2.0 / (leftTan + rightTan);
  var yScale = 2.0 / (upTan + downTan);
  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = (upTan - downTan) * yScale * 0.5;
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}
/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */

function ortho(out, left, right, bottom, top, near, far) {
  var lr = 1 / (left - right);
  var bt = 1 / (bottom - top);
  var nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis.
 * If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */

function lookAt(out, eye, center, up) {
  var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  var eyex = eye[0];
  var eyey = eye[1];
  var eyez = eye[2];
  var upx = up[0];
  var upy = up[1];
  var upz = up[2];
  var centerx = center[0];
  var centery = center[1];
  var centerz = center[2];

  if (
    Math.abs(eyex - centerx) < EPSILON &&
    Math.abs(eyey - centery) < EPSILON &&
    Math.abs(eyez - centerz) < EPSILON
  ) {
    return identity$3(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;
  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;
  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);

  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;
  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);

  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;
  return out;
}
/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */

function targetTo(out, eye, target, up) {
  var eyex = eye[0],
    eyey = eye[1],
    eyez = eye[2],
    upx = up[0],
    upy = up[1],
    upz = up[2];
  var z0 = eyex - target[0],
    z1 = eyey - target[1],
    z2 = eyez - target[2];
  var len = z0 * z0 + z1 * z1 + z2 * z2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  var x0 = upy * z2 - upz * z1,
    x1 = upz * z0 - upx * z2,
    x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */

function str$3(a) {
  return (
    "mat4(" +
    a[0] +
    ", " +
    a[1] +
    ", " +
    a[2] +
    ", " +
    a[3] +
    ", " +
    a[4] +
    ", " +
    a[5] +
    ", " +
    a[6] +
    ", " +
    a[7] +
    ", " +
    a[8] +
    ", " +
    a[9] +
    ", " +
    a[10] +
    ", " +
    a[11] +
    ", " +
    a[12] +
    ", " +
    a[13] +
    ", " +
    a[14] +
    ", " +
    a[15] +
    ")"
  );
}
/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */

function frob$3(a) {
  return Math.sqrt(
    Math.pow(a[0], 2) +
      Math.pow(a[1], 2) +
      Math.pow(a[2], 2) +
      Math.pow(a[3], 2) +
      Math.pow(a[4], 2) +
      Math.pow(a[5], 2) +
      Math.pow(a[6], 2) +
      Math.pow(a[7], 2) +
      Math.pow(a[8], 2) +
      Math.pow(a[9], 2) +
      Math.pow(a[10], 2) +
      Math.pow(a[11], 2) +
      Math.pow(a[12], 2) +
      Math.pow(a[13], 2) +
      Math.pow(a[14], 2) +
      Math.pow(a[15], 2)
  );
}
/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function add$3(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */

function subtract$3(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */

function multiplyScalar$3(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */

function multiplyScalarAndAdd$3(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  out[4] = a[4] + b[4] * scale;
  out[5] = a[5] + b[5] * scale;
  out[6] = a[6] + b[6] * scale;
  out[7] = a[7] + b[7] * scale;
  out[8] = a[8] + b[8] * scale;
  out[9] = a[9] + b[9] * scale;
  out[10] = a[10] + b[10] * scale;
  out[11] = a[11] + b[11] * scale;
  out[12] = a[12] + b[12] * scale;
  out[13] = a[13] + b[13] * scale;
  out[14] = a[14] + b[14] * scale;
  out[15] = a[15] + b[15] * scale;
  return out;
}
/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function exactEquals$3(a, b) {
  return (
    a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2] &&
    a[3] === b[3] &&
    a[4] === b[4] &&
    a[5] === b[5] &&
    a[6] === b[6] &&
    a[7] === b[7] &&
    a[8] === b[8] &&
    a[9] === b[9] &&
    a[10] === b[10] &&
    a[11] === b[11] &&
    a[12] === b[12] &&
    a[13] === b[13] &&
    a[14] === b[14] &&
    a[15] === b[15]
  );
}
/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */

function equals$4(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var a4 = a[4],
    a5 = a[5],
    a6 = a[6],
    a7 = a[7];
  var a8 = a[8],
    a9 = a[9],
    a10 = a[10],
    a11 = a[11];
  var a12 = a[12],
    a13 = a[13],
    a14 = a[14],
    a15 = a[15];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  var b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7];
  var b8 = b[8],
    b9 = b[9],
    b10 = b[10],
    b11 = b[11];
  var b12 = b[12],
    b13 = b[13],
    b14 = b[14],
    b15 = b[15];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
    Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
    Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
    Math.abs(a8 - b8) <= EPSILON * Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
    Math.abs(a9 - b9) <= EPSILON * Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
    Math.abs(a10 - b10) <=
      EPSILON * Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
    Math.abs(a11 - b11) <=
      EPSILON * Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
    Math.abs(a12 - b12) <=
      EPSILON * Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
    Math.abs(a13 - b13) <=
      EPSILON * Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
    Math.abs(a14 - b14) <=
      EPSILON * Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
    Math.abs(a15 - b15) <= EPSILON * Math.max(1.0, Math.abs(a15), Math.abs(b15))
  );
}
/**
 * Alias for {@link mat4.multiply}
 * @function
 */

var mul$3 = multiply$3;
/**
 * Alias for {@link mat4.subtract}
 * @function
 */

var sub$3 = subtract$3;

var mat4 = /*#__PURE__*/ Object.freeze({
  create: create$3,
  clone: clone$3,
  copy: copy$3,
  fromValues: fromValues$3,
  set: set$3,
  identity: identity$3,
  transpose: transpose$2,
  invert: invert$3,
  adjoint: adjoint$2,
  determinant: determinant$3,
  multiply: multiply$3,
  translate: translate$2,
  scale: scale$3,
  rotate: rotate$3,
  rotateX: rotateX,
  rotateY: rotateY,
  rotateZ: rotateZ,
  fromTranslation: fromTranslation$2,
  fromScaling: fromScaling$3,
  fromRotation: fromRotation$3,
  fromXRotation: fromXRotation,
  fromYRotation: fromYRotation,
  fromZRotation: fromZRotation,
  fromRotationTranslation: fromRotationTranslation,
  fromQuat2: fromQuat2,
  getTranslation: getTranslation,
  getScaling: getScaling,
  getRotation: getRotation,
  fromRotationTranslationScale: fromRotationTranslationScale,
  fromRotationTranslationScaleOrigin: fromRotationTranslationScaleOrigin,
  fromQuat: fromQuat$1,
  frustum: frustum,
  perspective: perspective,
  perspectiveFromFieldOfView: perspectiveFromFieldOfView,
  ortho: ortho,
  lookAt: lookAt,
  targetTo: targetTo,
  str: str$3,
  frob: frob$3,
  add: add$3,
  subtract: subtract$3,
  multiplyScalar: multiplyScalar$3,
  multiplyScalarAndAdd: multiplyScalarAndAdd$3,
  exactEquals: exactEquals$3,
  equals: equals$4,
  mul: mul$3,
  sub: sub$3
});

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create$4() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone$4(a) {
  var out = new ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues$4(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */

function copy$4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set$4(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function add$4(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function subtract$4(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function multiply$4(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale$4(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
    ay = a[1],
    az = a[2];
  var bx = b[0],
    by = b[1],
    bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = RANDOM() * 2.0 * Math.PI;
  var z = RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
    y = a[1],
    z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
    y = a[1],
    z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
    qy = q[1],
    qz = q[2],
    qw = q[3];
  var x = a[0],
    y = a[1],
    z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
    uvy = qz * x - qx * z,
    uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
    uuvy = qz * uvx - qx * uvz,
    uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */

function rotateX$1(out, a, b, c) {
  var p = [],
    r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(c) - p[2] * Math.sin(c);
  r[2] = p[1] * Math.sin(c) + p[2] * Math.cos(c); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */

function rotateY$1(out, a, b, c) {
  var p = [],
    r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(c) + p[0] * Math.cos(c);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(c) - p[0] * Math.sin(c); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */

function rotateZ$1(out, a, b, c) {
  var p = [],
    r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(c) - p[1] * Math.sin(c);
  r[1] = p[0] * Math.sin(c) + p[1] * Math.cos(c);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var tempA = fromValues$4(a[0], a[1], a[2]);
  var tempB = fromValues$4(b[0], b[1], b[2]);
  normalize(tempA, tempA);
  normalize(tempB, tempB);
  var cosine = dot(tempA, tempB);

  if (cosine > 1.0) {
    return 0;
  } else if (cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$4(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals$4(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals$5(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2))
  );
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub$4 = subtract$4;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul$4 = multiply$4;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = divide;
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = distance;
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = squaredDistance;
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = length;
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = squaredLength;
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = (function() {
  var vec = create$4();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
})();

var vec3 = /*#__PURE__*/ Object.freeze({
  create: create$4,
  clone: clone$4,
  length: length,
  fromValues: fromValues$4,
  copy: copy$4,
  set: set$4,
  add: add$4,
  subtract: subtract$4,
  multiply: multiply$4,
  divide: divide,
  ceil: ceil,
  floor: floor,
  min: min,
  max: max,
  round: round,
  scale: scale$4,
  scaleAndAdd: scaleAndAdd,
  distance: distance,
  squaredDistance: squaredDistance,
  squaredLength: squaredLength,
  negate: negate,
  inverse: inverse,
  normalize: normalize,
  dot: dot,
  cross: cross,
  lerp: lerp,
  hermite: hermite,
  bezier: bezier,
  random: random,
  transformMat4: transformMat4,
  transformMat3: transformMat3,
  transformQuat: transformQuat,
  rotateX: rotateX$1,
  rotateY: rotateY$1,
  rotateZ: rotateZ$1,
  angle: angle,
  zero: zero,
  str: str$4,
  exactEquals: exactEquals$4,
  equals: equals$5,
  sub: sub$4,
  mul: mul$4,
  div: div,
  dist: dist,
  sqrDist: sqrDist,
  len: len,
  sqrLen: sqrLen,
  forEach: forEach
});

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function create$5() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function clone$5(a) {
  var out = new ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function fromValues$5(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */

function copy$5(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function set$5(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */

function add$5(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */

function subtract$5(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */

function multiply$5(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */

function divide$1(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */

function ceil$1(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */

function floor$1(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */

function min$1(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */

function max$1(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */

function round$1(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function scale$5(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */

function scaleAndAdd$1(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */

function distance$1(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance$1(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.sqrt(x * x + y * y + z * z + w * w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$1(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */

function negate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */

function inverse$1(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */

function normalize$1(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {vec4} result the receiving vector
 * @param {vec4} U the first vector
 * @param {vec4} V the second vector
 * @param {vec4} W the third vector
 * @returns {vec4} result
 */

function cross$1(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
    B = v[0] * w[2] - v[2] * w[0],
    C = v[0] * w[3] - v[3] * w[0],
    D = v[1] * w[2] - v[2] * w[1],
    E = v[1] * w[3] - v[3] * w[1],
    F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function lerp$1(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */

function random$1(out, scale) {
  scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;

  var v1, v2, v3, v4;
  var s1, s2;

  do {
    v1 = RANDOM() * 2 - 1;
    v2 = RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);

  do {
    v3 = RANDOM() * 2 - 1;
    v4 = RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */

function transformMat4$1(out, a, m) {
  var x = a[0],
    y = a[1],
    z = a[2],
    w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */

function transformQuat$1(out, a, q) {
  var x = a[0],
    y = a[1],
    z = a[2];
  var qx = q[0],
    qy = q[1],
    qz = q[2],
    qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */

function zero$1(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$5(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals$5(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals$6(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3))
  );
}
/**
 * Alias for {@link vec4.subtract}
 * @function
 */

var sub$5 = subtract$5;
/**
 * Alias for {@link vec4.multiply}
 * @function
 */

var mul$5 = multiply$5;
/**
 * Alias for {@link vec4.divide}
 * @function
 */

var div$1 = divide$1;
/**
 * Alias for {@link vec4.distance}
 * @function
 */

var dist$1 = distance$1;
/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */

var sqrDist$1 = squaredDistance$1;
/**
 * Alias for {@link vec4.length}
 * @function
 */

var len$1 = length$1;
/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */

var sqrLen$1 = squaredLength$1;
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$1 = (function() {
  var vec = create$5();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
})();

var vec4 = /*#__PURE__*/ Object.freeze({
  create: create$5,
  clone: clone$5,
  fromValues: fromValues$5,
  copy: copy$5,
  set: set$5,
  add: add$5,
  subtract: subtract$5,
  multiply: multiply$5,
  divide: divide$1,
  ceil: ceil$1,
  floor: floor$1,
  min: min$1,
  max: max$1,
  round: round$1,
  scale: scale$5,
  scaleAndAdd: scaleAndAdd$1,
  distance: distance$1,
  squaredDistance: squaredDistance$1,
  length: length$1,
  squaredLength: squaredLength$1,
  negate: negate$1,
  inverse: inverse$1,
  normalize: normalize$1,
  dot: dot$1,
  cross: cross$1,
  lerp: lerp$1,
  random: random$1,
  transformMat4: transformMat4$1,
  transformQuat: transformQuat$1,
  zero: zero$1,
  str: str$5,
  exactEquals: exactEquals$5,
  equals: equals$6,
  sub: sub$5,
  mul: mul$5,
  div: div$1,
  dist: dist$1,
  sqrDist: sqrDist$1,
  len: len$1,
  sqrLen: sqrLen$1,
  forEach: forEach$1
});

/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */

function create$6() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  out[3] = 1;
  return out;
}
/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function identity$4(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/

function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  var s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */

function getAxisAngle(out_axis, q) {
  var rad = Math.acos(q[3]) * 2.0;
  var s = Math.sin(rad / 2.0);

  if (s > EPSILON) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }

  return rad;
}
/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */

function multiply$6(out, a, b) {
  var ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  var bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateX$2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  var bx = Math.sin(rad),
    bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateY$2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  var by = Math.sin(rad),
    bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */

function rotateZ$2(out, a, rad) {
  rad *= 0.5;
  var ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  var bz = Math.sin(rad),
    bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */

function calculateW(out, a) {
  var x = a[0],
    y = a[1],
    z = a[2];
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}
/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  var ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  var bx = b[0],
    by = b[1],
    bz = b[2],
    bw = b[3];
  var omega, cosom, sinom, scale0, scale1; // calc cosine

  cosom = ax * bx + ay * by + az * bz + aw * bw; // adjust signs (if necessary)

  if (cosom < 0.0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  } // calculate coefficients

  if (1.0 - cosom > EPSILON) {
    // standard case (slerp)
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  } // calculate final values

  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
/**
 * Generates a random quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */

function random$2(out) {
  // Implementation of http://planning.cs.uiuc.edu/node198.html
  // TODO: Calling random 3 times is probably not the fastest solution
  var u1 = RANDOM();
  var u2 = RANDOM();
  var u3 = RANDOM();
  var sqrt1MinusU1 = Math.sqrt(1 - u1);
  var sqrtU1 = Math.sqrt(u1);
  out[0] = sqrt1MinusU1 * Math.sin(2.0 * Math.PI * u2);
  out[1] = sqrt1MinusU1 * Math.cos(2.0 * Math.PI * u2);
  out[2] = sqrtU1 * Math.sin(2.0 * Math.PI * u3);
  out[3] = sqrtU1 * Math.cos(2.0 * Math.PI * u3);
  return out;
}
/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */

function invert$4(out, a) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3];
  var dot$$1 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  var invDot = dot$$1 ? 1.0 / dot$$1 : 0; // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */

function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */

function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  var fTrace = m[0] + m[4] + m[8];
  var fRoot;

  if (fTrace > 0.0) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0); // 2w

    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot; // 1/(4w)

    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    // |w| <= 1/2
    var i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    var j = (i + 1) % 3;
    var k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }

  return out;
}
/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */

function fromEuler(out, x, y, z) {
  var halfToRad = (0.5 * Math.PI) / 180.0;
  x *= halfToRad;
  y *= halfToRad;
  z *= halfToRad;
  var sx = Math.sin(x);
  var cx = Math.cos(x);
  var sy = Math.sin(y);
  var cy = Math.cos(y);
  var sz = Math.sin(z);
  var cz = Math.cos(z);
  out[0] = sx * cy * cz - cx * sy * sz;
  out[1] = cx * sy * cz + sx * cy * sz;
  out[2] = cx * cy * sz - sx * sy * cz;
  out[3] = cx * cy * cz + sx * sy * sz;
  return out;
}
/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$6(a) {
  return "quat(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */

var clone$6 = clone$5;
/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */

var fromValues$6 = fromValues$5;
/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */

var copy$6 = copy$5;
/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */

var set$6 = set$5;
/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */

var add$6 = add$5;
/**
 * Alias for {@link quat.multiply}
 * @function
 */

var mul$6 = multiply$6;
/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */

var scale$6 = scale$5;
/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot$2 = dot$1;
/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 * @function
 */

var lerp$2 = lerp$1;
/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */

var length$2 = length$1;
/**
 * Alias for {@link quat.length}
 * @function
 */

var len$2 = length$2;
/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength$2 = squaredLength$1;
/**
 * Alias for {@link quat.squaredLength}
 * @function
 */

var sqrLen$2 = squaredLength$2;
/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */

var normalize$2 = normalize$1;
/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var exactEquals$6 = exactEquals$5;
/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

var equals$7 = equals$6;
/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */

var rotationTo = (function() {
  var tmpvec3 = create$4();
  var xUnitVec3 = fromValues$4(1, 0, 0);
  var yUnitVec3 = fromValues$4(0, 1, 0);
  return function(out, a, b) {
    var dot$$1 = dot(a, b);

    if (dot$$1 < -0.999999) {
      cross(tmpvec3, xUnitVec3, a);
      if (len(tmpvec3) < 0.000001) cross(tmpvec3, yUnitVec3, a);
      normalize(tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot$$1 > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      cross(tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot$$1;
      return normalize$2(out, out);
    }
  };
})();
/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat} out
 */

var sqlerp = (function() {
  var temp1 = create$6();
  var temp2 = create$6();
  return function(out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));
    return out;
  };
})();
/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */

var setAxes = (function() {
  var matr = create$2();
  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];
    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];
    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];
    return normalize$2(out, fromMat3(out, matr));
  };
})();

var quat = /*#__PURE__*/ Object.freeze({
  create: create$6,
  identity: identity$4,
  setAxisAngle: setAxisAngle,
  getAxisAngle: getAxisAngle,
  multiply: multiply$6,
  rotateX: rotateX$2,
  rotateY: rotateY$2,
  rotateZ: rotateZ$2,
  calculateW: calculateW,
  slerp: slerp,
  random: random$2,
  invert: invert$4,
  conjugate: conjugate,
  fromMat3: fromMat3,
  fromEuler: fromEuler,
  str: str$6,
  clone: clone$6,
  fromValues: fromValues$6,
  copy: copy$6,
  set: set$6,
  add: add$6,
  mul: mul$6,
  scale: scale$6,
  dot: dot$2,
  lerp: lerp$2,
  length: length$2,
  len: len$2,
  squaredLength: squaredLength$2,
  sqrLen: sqrLen$2,
  normalize: normalize$2,
  exactEquals: exactEquals$6,
  equals: equals$7,
  rotationTo: rotationTo,
  sqlerp: sqlerp,
  setAxes: setAxes
});

/**
 * Dual Quaternion<br>
 * Format: [real, dual]<br>
 * Quaternion format: XYZW<br>
 * Make sure to have normalized dual quaternions, otherwise the functions may not work as intended.<br>
 * @module quat2
 */

/**
 * Creates a new identity dual quat
 *
 * @returns {quat2} a new dual quaternion [real -> rotation, dual -> translation]
 */

function create$7() {
  var dq = new ARRAY_TYPE(8);

  if (ARRAY_TYPE != Float32Array) {
    dq[0] = 0;
    dq[1] = 0;
    dq[2] = 0;
    dq[4] = 0;
    dq[5] = 0;
    dq[6] = 0;
    dq[7] = 0;
  }

  dq[3] = 1;
  return dq;
}
/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat2} a dual quaternion to clone
 * @returns {quat2} new dual quaternion
 * @function
 */

function clone$7(a) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = a[0];
  dq[1] = a[1];
  dq[2] = a[2];
  dq[3] = a[3];
  dq[4] = a[4];
  dq[5] = a[5];
  dq[6] = a[6];
  dq[7] = a[7];
  return dq;
}
/**
 * Creates a new dual quat initialized with the given values
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromValues$7(x1, y1, z1, w1, x2, y2, z2, w2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  dq[4] = x2;
  dq[5] = y2;
  dq[6] = z2;
  dq[7] = w2;
  return dq;
}
/**
 * Creates a new dual quat from the given values (quat and translation)
 *
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component (translation)
 * @param {Number} y2 Y component (translation)
 * @param {Number} z2 Z component (translation)
 * @returns {quat2} new dual quaternion
 * @function
 */

function fromRotationTranslationValues(x1, y1, z1, w1, x2, y2, z2) {
  var dq = new ARRAY_TYPE(8);
  dq[0] = x1;
  dq[1] = y1;
  dq[2] = z1;
  dq[3] = w1;
  var ax = x2 * 0.5,
    ay = y2 * 0.5,
    az = z2 * 0.5;
  dq[4] = ax * w1 + ay * z1 - az * y1;
  dq[5] = ay * w1 + az * x1 - ax * z1;
  dq[6] = az * w1 + ax * y1 - ay * x1;
  dq[7] = -ax * x1 - ay * y1 - az * z1;
  return dq;
}
/**
 * Creates a dual quat from a quaternion and a translation
 *
 * @param {quat2} dual quaternion receiving operation result
 * @param {quat} q quaternion
 * @param {vec3} t tranlation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotationTranslation$1(out, q, t) {
  var ax = t[0] * 0.5,
    ay = t[1] * 0.5,
    az = t[2] * 0.5,
    bx = q[0],
    by = q[1],
    bz = q[2],
    bw = q[3];
  out[0] = bx;
  out[1] = by;
  out[2] = bz;
  out[3] = bw;
  out[4] = ax * bw + ay * bz - az * by;
  out[5] = ay * bw + az * bx - ax * bz;
  out[6] = az * bw + ax * by - ay * bx;
  out[7] = -ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Creates a dual quat from a translation
 *
 * @param {quat2} dual quaternion receiving operation result
 * @param {vec3} t translation vector
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromTranslation$3(out, t) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = t[0] * 0.5;
  out[5] = t[1] * 0.5;
  out[6] = t[2] * 0.5;
  out[7] = 0;
  return out;
}
/**
 * Creates a dual quat from a quaternion
 *
 * @param {quat2} dual quaternion receiving operation result
 * @param {quat} q the quaternion
 * @returns {quat2} dual quaternion receiving operation result
 * @function
 */

function fromRotation$4(out, q) {
  out[0] = q[0];
  out[1] = q[1];
  out[2] = q[2];
  out[3] = q[3];
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Creates a new dual quat from a matrix (4x4)
 *
 * @param {quat2} out the dual quaternion
 * @param {mat4} a the matrix
 * @returns {quat2} dual quat receiving operation result
 * @function
 */

function fromMat4$1(out, a) {
  //TODO Optimize this
  var outer = create$6();
  getRotation(outer, a);
  var t = new ARRAY_TYPE(3);
  getTranslation(t, a);
  fromRotationTranslation$1(out, outer, t);
  return out;
}
/**
 * Copy the values from one dual quat to another
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the source dual quaternion
 * @returns {quat2} out
 * @function
 */

function copy$7(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  return out;
}
/**
 * Set a dual quat to the identity dual quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @returns {quat2} out
 */

function identity$5(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  return out;
}
/**
 * Set the components of a dual quat to the given values
 *
 * @param {quat2} out the receiving quaternion
 * @param {Number} x1 X component
 * @param {Number} y1 Y component
 * @param {Number} z1 Z component
 * @param {Number} w1 W component
 * @param {Number} x2 X component
 * @param {Number} y2 Y component
 * @param {Number} z2 Z component
 * @param {Number} w2 W component
 * @returns {quat2} out
 * @function
 */

function set$7(out, x1, y1, z1, w1, x2, y2, z2, w2) {
  out[0] = x1;
  out[1] = y1;
  out[2] = z1;
  out[3] = w1;
  out[4] = x2;
  out[5] = y2;
  out[6] = z2;
  out[7] = w2;
  return out;
}
/**
 * Gets the real part of a dual quat
 * @param  {quat} out real part
 * @param  {quat2} a Dual Quaternion
 * @return {quat} real part
 */

var getReal = copy$6;
/**
 * Gets the dual part of a dual quat
 * @param  {quat} out dual part
 * @param  {quat2} a Dual Quaternion
 * @return {quat} dual part
 */

function getDual(out, a) {
  out[0] = a[4];
  out[1] = a[5];
  out[2] = a[6];
  out[3] = a[7];
  return out;
}
/**
 * Set the real component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {quat} q a quaternion representing the real part
 * @returns {quat2} out
 * @function
 */

var setReal = copy$6;
/**
 * Set the dual component of a dual quat to the given quaternion
 *
 * @param {quat2} out the receiving quaternion
 * @param {quat} q a quaternion representing the dual part
 * @returns {quat2} out
 * @function
 */

function setDual(out, q) {
  out[4] = q[0];
  out[5] = q[1];
  out[6] = q[2];
  out[7] = q[3];
  return out;
}
/**
 * Gets the translation of a normalized dual quat
 * @param  {vec3} out translation
 * @param  {quat2} a Dual Quaternion to be decomposed
 * @return {vec3} translation
 */

function getTranslation$1(out, a) {
  var ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7],
    bx = -a[0],
    by = -a[1],
    bz = -a[2],
    bw = a[3];
  out[0] = (ax * bw + aw * bx + ay * bz - az * by) * 2;
  out[1] = (ay * bw + aw * by + az * bx - ax * bz) * 2;
  out[2] = (az * bw + aw * bz + ax * by - ay * bx) * 2;
  return out;
}
/**
 * Translates a dual quat by the given vector
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the dual quaternion to translate
 * @param {vec3} v vector to translate by
 * @returns {quat2} out
 */

function translate$3(out, a, v) {
  var ax1 = a[0],
    ay1 = a[1],
    az1 = a[2],
    aw1 = a[3],
    bx1 = v[0] * 0.5,
    by1 = v[1] * 0.5,
    bz1 = v[2] * 0.5,
    ax2 = a[4],
    ay2 = a[5],
    az2 = a[6],
    aw2 = a[7];
  out[0] = ax1;
  out[1] = ay1;
  out[2] = az1;
  out[3] = aw1;
  out[4] = aw1 * bx1 + ay1 * bz1 - az1 * by1 + ax2;
  out[5] = aw1 * by1 + az1 * bx1 - ax1 * bz1 + ay2;
  out[6] = aw1 * bz1 + ax1 * by1 - ay1 * bx1 + az2;
  out[7] = -ax1 * bx1 - ay1 * by1 - az1 * bz1 + aw2;
  return out;
}
/**
 * Rotates a dual quat around the X axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateX$3(out, a, rad) {
  var bx = -a[0],
    by = -a[1],
    bz = -a[2],
    bw = a[3],
    ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7],
    ax1 = ax * bw + aw * bx + ay * bz - az * by,
    ay1 = ay * bw + aw * by + az * bx - ax * bz,
    az1 = az * bw + aw * bz + ax * by - ay * bx,
    aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateX$2(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Y axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateY$3(out, a, rad) {
  var bx = -a[0],
    by = -a[1],
    bz = -a[2],
    bw = a[3],
    ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7],
    ax1 = ax * bw + aw * bx + ay * bz - az * by,
    ay1 = ay * bw + aw * by + az * bx - ax * bz,
    az1 = az * bw + aw * bz + ax * by - ay * bx,
    aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateY$2(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat around the Z axis
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the dual quaternion to rotate
 * @param {number} rad how far should the rotation be
 * @returns {quat2} out
 */

function rotateZ$3(out, a, rad) {
  var bx = -a[0],
    by = -a[1],
    bz = -a[2],
    bw = a[3],
    ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7],
    ax1 = ax * bw + aw * bx + ay * bz - az * by,
    ay1 = ay * bw + aw * by + az * bx - ax * bz,
    az1 = az * bw + aw * bz + ax * by - ay * bx,
    aw1 = aw * bw - ax * bx - ay * by - az * bz;
  rotateZ$2(out, a, rad);
  bx = out[0];
  by = out[1];
  bz = out[2];
  bw = out[3];
  out[4] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[5] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[6] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[7] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (a * q)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the dual quaternion to rotate
 * @param {quat} q quaternion to rotate by
 * @returns {quat2} out
 */

function rotateByQuatAppend(out, a, q) {
  var qx = q[0],
    qy = q[1],
    qz = q[2],
    qw = q[3],
    ax = a[0],
    ay = a[1],
    az = a[2],
    aw = a[3];
  out[0] = ax * qw + aw * qx + ay * qz - az * qy;
  out[1] = ay * qw + aw * qy + az * qx - ax * qz;
  out[2] = az * qw + aw * qz + ax * qy - ay * qx;
  out[3] = aw * qw - ax * qx - ay * qy - az * qz;
  ax = a[4];
  ay = a[5];
  az = a[6];
  aw = a[7];
  out[4] = ax * qw + aw * qx + ay * qz - az * qy;
  out[5] = ay * qw + aw * qy + az * qx - ax * qz;
  out[6] = az * qw + aw * qz + ax * qy - ay * qx;
  out[7] = aw * qw - ax * qx - ay * qy - az * qz;
  return out;
}
/**
 * Rotates a dual quat by a given quaternion (q * a)
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat} q quaternion to rotate by
 * @param {quat2} a the dual quaternion to rotate
 * @returns {quat2} out
 */

function rotateByQuatPrepend(out, q, a) {
  var qx = q[0],
    qy = q[1],
    qz = q[2],
    qw = q[3],
    bx = a[0],
    by = a[1],
    bz = a[2],
    bw = a[3];
  out[0] = qx * bw + qw * bx + qy * bz - qz * by;
  out[1] = qy * bw + qw * by + qz * bx - qx * bz;
  out[2] = qz * bw + qw * bz + qx * by - qy * bx;
  out[3] = qw * bw - qx * bx - qy * by - qz * bz;
  bx = a[4];
  by = a[5];
  bz = a[6];
  bw = a[7];
  out[4] = qx * bw + qw * bx + qy * bz - qz * by;
  out[5] = qy * bw + qw * by + qz * bx - qx * bz;
  out[6] = qz * bw + qw * bz + qx * by - qy * bx;
  out[7] = qw * bw - qx * bx - qy * by - qz * bz;
  return out;
}
/**
 * Rotates a dual quat around a given axis. Does the normalisation automatically
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the dual quaternion to rotate
 * @param {vec3} axis the axis to rotate around
 * @param {Number} rad how far the rotation should be
 * @returns {quat2} out
 */

function rotateAroundAxis(out, a, axis, rad) {
  //Special case for rad = 0
  if (Math.abs(rad) < EPSILON) {
    return copy$7(out, a);
  }

  var axisLength = Math.sqrt(
    axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]
  );
  rad = rad * 0.5;
  var s = Math.sin(rad);
  var bx = (s * axis[0]) / axisLength;
  var by = (s * axis[1]) / axisLength;
  var bz = (s * axis[2]) / axisLength;
  var bw = Math.cos(rad);
  var ax1 = a[0],
    ay1 = a[1],
    az1 = a[2],
    aw1 = a[3];
  out[0] = ax1 * bw + aw1 * bx + ay1 * bz - az1 * by;
  out[1] = ay1 * bw + aw1 * by + az1 * bx - ax1 * bz;
  out[2] = az1 * bw + aw1 * bz + ax1 * by - ay1 * bx;
  out[3] = aw1 * bw - ax1 * bx - ay1 * by - az1 * bz;
  var ax = a[4],
    ay = a[5],
    az = a[6],
    aw = a[7];
  out[4] = ax * bw + aw * bx + ay * bz - az * by;
  out[5] = ay * bw + aw * by + az * bx - ax * bz;
  out[6] = az * bw + aw * bz + ax * by - ay * bx;
  out[7] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
/**
 * Adds two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the first operand
 * @param {quat2} b the second operand
 * @returns {quat2} out
 * @function
 */

function add$7(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  return out;
}
/**
 * Multiplies two dual quat's
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a the first operand
 * @param {quat2} b the second operand
 * @returns {quat2} out
 */

function multiply$7(out, a, b) {
  var ax0 = a[0],
    ay0 = a[1],
    az0 = a[2],
    aw0 = a[3],
    bx1 = b[4],
    by1 = b[5],
    bz1 = b[6],
    bw1 = b[7],
    ax1 = a[4],
    ay1 = a[5],
    az1 = a[6],
    aw1 = a[7],
    bx0 = b[0],
    by0 = b[1],
    bz0 = b[2],
    bw0 = b[3];
  out[0] = ax0 * bw0 + aw0 * bx0 + ay0 * bz0 - az0 * by0;
  out[1] = ay0 * bw0 + aw0 * by0 + az0 * bx0 - ax0 * bz0;
  out[2] = az0 * bw0 + aw0 * bz0 + ax0 * by0 - ay0 * bx0;
  out[3] = aw0 * bw0 - ax0 * bx0 - ay0 * by0 - az0 * bz0;
  out[4] =
    ax0 * bw1 +
    aw0 * bx1 +
    ay0 * bz1 -
    az0 * by1 +
    ax1 * bw0 +
    aw1 * bx0 +
    ay1 * bz0 -
    az1 * by0;
  out[5] =
    ay0 * bw1 +
    aw0 * by1 +
    az0 * bx1 -
    ax0 * bz1 +
    ay1 * bw0 +
    aw1 * by0 +
    az1 * bx0 -
    ax1 * bz0;
  out[6] =
    az0 * bw1 +
    aw0 * bz1 +
    ax0 * by1 -
    ay0 * bx1 +
    az1 * bw0 +
    aw1 * bz0 +
    ax1 * by0 -
    ay1 * bx0;
  out[7] =
    aw0 * bw1 -
    ax0 * bx1 -
    ay0 * by1 -
    az0 * bz1 +
    aw1 * bw0 -
    ax1 * bx0 -
    ay1 * by0 -
    az1 * bz0;
  return out;
}
/**
 * Alias for {@link quat2.multiply}
 * @function
 */

var mul$7 = multiply$7;
/**
 * Scales a dual quat by a scalar number
 *
 * @param {quat2} out the receiving dual quat
 * @param {quat2} a the dual quat to scale
 * @param {Number} b amount to scale the dual quat by
 * @returns {quat2} out
 * @function
 */

function scale$7(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  return out;
}
/**
 * Calculates the dot product of two dual quat's (The dot product of the real parts)
 *
 * @param {quat2} a the first operand
 * @param {quat2} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */

var dot$3 = dot$2;
/**
 * Performs a linear interpolation between two dual quats's
 * NOTE: The resulting dual quaternions won't always be normalized (The error is most noticeable when t = 0.5)
 *
 * @param {quat2} out the receiving dual quat
 * @param {quat2} a the first operand
 * @param {quat2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {quat2} out
 */

function lerp$3(out, a, b, t) {
  var mt = 1 - t;
  if (dot$3(a, b) < 0) t = -t;
  out[0] = a[0] * mt + b[0] * t;
  out[1] = a[1] * mt + b[1] * t;
  out[2] = a[2] * mt + b[2] * t;
  out[3] = a[3] * mt + b[3] * t;
  out[4] = a[4] * mt + b[4] * t;
  out[5] = a[5] * mt + b[5] * t;
  out[6] = a[6] * mt + b[6] * t;
  out[7] = a[7] * mt + b[7] * t;
  return out;
}
/**
 * Calculates the inverse of a dual quat. If they are normalized, conjugate is cheaper
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a dual quat to calculate inverse of
 * @returns {quat2} out
 */

function invert$5(out, a) {
  var sqlen = squaredLength$3(a);
  out[0] = -a[0] / sqlen;
  out[1] = -a[1] / sqlen;
  out[2] = -a[2] / sqlen;
  out[3] = a[3] / sqlen;
  out[4] = -a[4] / sqlen;
  out[5] = -a[5] / sqlen;
  out[6] = -a[6] / sqlen;
  out[7] = a[7] / sqlen;
  return out;
}
/**
 * Calculates the conjugate of a dual quat
 * If the dual quaternion is normalized, this function is faster than quat2.inverse and produces the same result.
 *
 * @param {quat2} out the receiving quaternion
 * @param {quat2} a quat to calculate conjugate of
 * @returns {quat2} out
 */

function conjugate$1(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  out[4] = -a[4];
  out[5] = -a[5];
  out[6] = -a[6];
  out[7] = a[7];
  return out;
}
/**
 * Calculates the length of a dual quat
 *
 * @param {quat2} a dual quat to calculate length of
 * @returns {Number} length of a
 * @function
 */

var length$3 = length$2;
/**
 * Alias for {@link quat2.length}
 * @function
 */

var len$3 = length$3;
/**
 * Calculates the squared length of a dual quat
 *
 * @param {quat2} a dual quat to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */

var squaredLength$3 = squaredLength$2;
/**
 * Alias for {@link quat2.squaredLength}
 * @function
 */

var sqrLen$3 = squaredLength$3;
/**
 * Normalize a dual quat
 *
 * @param {quat2} out the receiving dual quaternion
 * @param {quat2} a dual quaternion to normalize
 * @returns {quat2} out
 * @function
 */

function normalize$3(out, a) {
  var magnitude = squaredLength$3(a);

  if (magnitude > 0) {
    magnitude = Math.sqrt(magnitude);
    var a0 = a[0] / magnitude;
    var a1 = a[1] / magnitude;
    var a2 = a[2] / magnitude;
    var a3 = a[3] / magnitude;
    var b0 = a[4];
    var b1 = a[5];
    var b2 = a[6];
    var b3 = a[7];
    var a_dot_b = a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3;
    out[0] = a0;
    out[1] = a1;
    out[2] = a2;
    out[3] = a3;
    out[4] = (b0 - a0 * a_dot_b) / magnitude;
    out[5] = (b1 - a1 * a_dot_b) / magnitude;
    out[6] = (b2 - a2 * a_dot_b) / magnitude;
    out[7] = (b3 - a3 * a_dot_b) / magnitude;
  }

  return out;
}
/**
 * Returns a string representation of a dual quatenion
 *
 * @param {quat2} a dual quaternion to represent as a string
 * @returns {String} string representation of the dual quat
 */

function str$7(a) {
  return (
    "quat2(" +
    a[0] +
    ", " +
    a[1] +
    ", " +
    a[2] +
    ", " +
    a[3] +
    ", " +
    a[4] +
    ", " +
    a[5] +
    ", " +
    a[6] +
    ", " +
    a[7] +
    ")"
  );
}
/**
 * Returns whether or not the dual quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat2} a the first dual quaternion.
 * @param {quat2} b the second dual quaternion.
 * @returns {Boolean} true if the dual quaternions are equal, false otherwise.
 */

function exactEquals$7(a, b) {
  return (
    a[0] === b[0] &&
    a[1] === b[1] &&
    a[2] === b[2] &&
    a[3] === b[3] &&
    a[4] === b[4] &&
    a[5] === b[5] &&
    a[6] === b[6] &&
    a[7] === b[7]
  );
}
/**
 * Returns whether or not the dual quaternions have approximately the same elements in the same position.
 *
 * @param {quat2} a the first dual quat.
 * @param {quat2} b the second dual quat.
 * @returns {Boolean} true if the dual quats are equal, false otherwise.
 */

function equals$8(a, b) {
  var a0 = a[0],
    a1 = a[1],
    a2 = a[2],
    a3 = a[3],
    a4 = a[4],
    a5 = a[5],
    a6 = a[6],
    a7 = a[7];
  var b0 = b[0],
    b1 = b[1],
    b2 = b[2],
    b3 = b[3],
    b4 = b[4],
    b5 = b[5],
    b6 = b[6],
    b7 = b[7];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
    Math.abs(a2 - b2) <= EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
    Math.abs(a3 - b3) <= EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
    Math.abs(a4 - b4) <= EPSILON * Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
    Math.abs(a5 - b5) <= EPSILON * Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
    Math.abs(a6 - b6) <= EPSILON * Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
    Math.abs(a7 - b7) <= EPSILON * Math.max(1.0, Math.abs(a7), Math.abs(b7))
  );
}

var quat2 = /*#__PURE__*/ Object.freeze({
  create: create$7,
  clone: clone$7,
  fromValues: fromValues$7,
  fromRotationTranslationValues: fromRotationTranslationValues,
  fromRotationTranslation: fromRotationTranslation$1,
  fromTranslation: fromTranslation$3,
  fromRotation: fromRotation$4,
  fromMat4: fromMat4$1,
  copy: copy$7,
  identity: identity$5,
  set: set$7,
  getReal: getReal,
  getDual: getDual,
  setReal: setReal,
  setDual: setDual,
  getTranslation: getTranslation$1,
  translate: translate$3,
  rotateX: rotateX$3,
  rotateY: rotateY$3,
  rotateZ: rotateZ$3,
  rotateByQuatAppend: rotateByQuatAppend,
  rotateByQuatPrepend: rotateByQuatPrepend,
  rotateAroundAxis: rotateAroundAxis,
  add: add$7,
  multiply: multiply$7,
  mul: mul$7,
  scale: scale$7,
  dot: dot$3,
  lerp: lerp$3,
  invert: invert$5,
  conjugate: conjugate$1,
  length: length$3,
  len: len$3,
  squaredLength: squaredLength$3,
  sqrLen: sqrLen$3,
  normalize: normalize$3,
  str: str$7,
  exactEquals: exactEquals$7,
  equals: equals$8
});

/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */

function create$8() {
  var out = new ARRAY_TYPE(2);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
  }

  return out;
}
/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */

function clone$8(a) {
  var out = new ARRAY_TYPE(2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */

function fromValues$8(x, y) {
  var out = new ARRAY_TYPE(2);
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */

function copy$8(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}
/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */

function set$8(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}
/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function add$8(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function subtract$6(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}
/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function multiply$8(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
}
/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function divide$2(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
}
/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */

function ceil$2(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
}
/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */

function floor$2(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
}
/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function min$2(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
}
/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */

function max$2(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
}
/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */

function round$2(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
}
/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */

function scale$8(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
}
/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */

function scaleAndAdd$2(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */

function distance$2(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance$2(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return x * x + y * y;
}
/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */

function length$4(a) {
  var x = a[0],
    y = a[1];
  return Math.sqrt(x * x + y * y);
}
/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength$4(a) {
  var x = a[0],
    y = a[1];
  return x * x + y * y;
}
/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */

function negate$2(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
}
/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */

function inverse$2(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
}
/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */

function normalize$4(out, a) {
  var x = a[0],
    y = a[1];
  var len = x * x + y * y;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  return out;
}
/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot$4(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}
/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */

function cross$2(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
}
/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec2} out
 */

function lerp$4(out, a, b, t) {
  var ax = a[0],
    ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */

function random$3(out, scale) {
  scale = scale || 1.0;
  var r = RANDOM() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
}
/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
}
/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat2d(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
}
/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat3$1(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
}
/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */

function transformMat4$2(out, a, m) {
  var x = a[0];
  var y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}
/**
 * Rotate a 2D vector
 * @param {vec2} out The receiving vec2
 * @param {vec2} a The vec2 point to rotate
 * @param {vec2} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec2} out
 */

function rotate$4(out, a, b, c) {
  //Translate point to the origin
  var p0 = a[0] - b[0],
    p1 = a[1] - b[1],
    sinC = Math.sin(c),
    cosC = Math.cos(c); //perform rotation and translate to correct position

  out[0] = p0 * cosC - p1 * sinC + b[0];
  out[1] = p0 * sinC + p1 * cosC + b[1];
  return out;
}
/**
 * Get the angle between two 2D vectors
 * @param {vec2} a The first operand
 * @param {vec2} b The second operand
 * @returns {Number} The angle in radians
 */

function angle$1(a, b) {
  var x1 = a[0],
    y1 = a[1],
    x2 = b[0],
    y2 = b[1];
  var len1 = x1 * x1 + y1 * y1;

  if (len1 > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len1 = 1 / Math.sqrt(len1);
  }

  var len2 = x2 * x2 + y2 * y2;

  if (len2 > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len2 = 1 / Math.sqrt(len2);
  }

  var cosine = (x1 * x2 + y1 * y2) * len1 * len2;

  if (cosine > 1.0) {
    return 0;
  } else if (cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}
/**
 * Set the components of a vec2 to zero
 *
 * @param {vec2} out the receiving vector
 * @returns {vec2} out
 */

function zero$2(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {vec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str$8(a) {
  return "vec2(" + a[0] + ", " + a[1] + ")";
}
/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals$8(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function equals$9(a, b) {
  var a0 = a[0],
    a1 = a[1];
  var b0 = b[0],
    b1 = b[1];
  return (
    Math.abs(a0 - b0) <= EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
    Math.abs(a1 - b1) <= EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1))
  );
}
/**
 * Alias for {@link vec2.length}
 * @function
 */

var len$4 = length$4;
/**
 * Alias for {@link vec2.subtract}
 * @function
 */

var sub$6 = subtract$6;
/**
 * Alias for {@link vec2.multiply}
 * @function
 */

var mul$8 = multiply$8;
/**
 * Alias for {@link vec2.divide}
 * @function
 */

var div$2 = divide$2;
/**
 * Alias for {@link vec2.distance}
 * @function
 */

var dist$2 = distance$2;
/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */

var sqrDist$2 = squaredDistance$2;
/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */

var sqrLen$4 = squaredLength$4;
/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach$2 = (function() {
  var vec = create$8();
  return function(a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 2;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
    }

    return a;
  };
})();

var vec2 = /*#__PURE__*/ Object.freeze({
  create: create$8,
  clone: clone$8,
  fromValues: fromValues$8,
  copy: copy$8,
  set: set$8,
  add: add$8,
  subtract: subtract$6,
  multiply: multiply$8,
  divide: divide$2,
  ceil: ceil$2,
  floor: floor$2,
  min: min$2,
  max: max$2,
  round: round$2,
  scale: scale$8,
  scaleAndAdd: scaleAndAdd$2,
  distance: distance$2,
  squaredDistance: squaredDistance$2,
  length: length$4,
  squaredLength: squaredLength$4,
  negate: negate$2,
  inverse: inverse$2,
  normalize: normalize$4,
  dot: dot$4,
  cross: cross$2,
  lerp: lerp$4,
  random: random$3,
  transformMat2: transformMat2,
  transformMat2d: transformMat2d,
  transformMat3: transformMat3$1,
  transformMat4: transformMat4$2,
  rotate: rotate$4,
  angle: angle$1,
  zero: zero$2,
  str: str$8,
  exactEquals: exactEquals$8,
  equals: equals$9,
  len: len$4,
  sub: sub$6,
  mul: mul$8,
  div: div$2,
  dist: dist$2,
  sqrDist: sqrDist$2,
  sqrLen: sqrLen$4,
  forEach: forEach$2
});

const glMatrix = exports;
exports.common = common;
exports.mat2 = mat2;
exports.mat2d = mat2d;
exports.mat3 = mat3;
exports.mat4 = mat4;
exports.quat = quat;
exports.quat2 = quat2;
exports.vec2 = vec2;
exports.vec3 = vec3;
exports.vec4 = vec4;
exports.glMatrix = glMatrix;// stats.js - http://github.com/mrdoob/stats.js
const Stats = function() {
  function h(a) {
    c.appendChild(a.dom);
    return a;
  }
  function k(a) {
    for (var d = 0; d < c.children.length; d++)
      c.children[d].style.display = d === a ? "block" : "none";
    l = a;
  }
  var l = 0,
    c = document.createElement("div");
  c.style.cssText =
    "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
  c.addEventListener(
    "click",
    function(a) {
      a.preventDefault();
      k(++l % c.children.length);
    },
    !1
  );
  var g = (performance || Date).now(),
    e = g,
    a = 0,
    r = h(new Stats.Panel("FPS", "#0ff", "#002")),
    f = h(new Stats.Panel("MS", "#0f0", "#020"));
  if (self.performance && self.performance.memory)
    var t = h(new Stats.Panel("MB", "#f08", "#201"));
  k(0);
  return {
    REVISION: 16,
    dom: c,
    addPanel: h,
    showPanel: k,
    begin: function() {
      g = (performance || Date).now();
    },
    end: function() {
      a++;
      var c = (performance || Date).now();
      f.update(c - g, 200);
      if (
        c > e + 1e3 &&
        (r.update((1e3 * a) / (c - e), 100), (e = c), (a = 0), t)
      ) {
        var d = performance.memory;
        t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
      }
      return c;
    },
    update: function() {
      g = this.end();
    },
    domElement: c,
    setMode: k
  };
};
Stats.Panel = function(h, k, l) {
  var c = Infinity,
    g = 0,
    e = Math.round,
    a = e(window.devicePixelRatio || 1),
    r = 80 * a,
    f = 48 * a,
    t = 3 * a,
    u = 2 * a,
    d = 3 * a,
    m = 15 * a,
    n = 74 * a,
    p = 30 * a,
    q = document.createElement("canvas");
  q.width = r;
  q.height = f;
  q.style.cssText = "width:80px;height:48px";
  var b = q.getContext("2d");
  b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";
  b.textBaseline = "top";
  b.fillStyle = l;
  b.fillRect(0, 0, r, f);
  b.fillStyle = k;
  b.fillText(h, t, u);
  b.fillRect(d, m, n, p);
  b.fillStyle = l;
  b.globalAlpha = 0.9;
  b.fillRect(d, m, n, p);
  return {
    dom: q,
    update: function(f, v) {
      c = Math.min(c, f);
      g = Math.max(g, f);
      b.fillStyle = l;
      b.globalAlpha = 1;
      b.fillRect(0, 0, r, m);
      b.fillStyle = k;
      b.fillText(e(f) + " " + h + " (" + e(c) + "-" + e(g) + ")", t, u);
      b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
      b.fillRect(d + n - a, m, a, p);
      b.fillStyle = l;
      b.globalAlpha = 0.9;
      b.fillRect(d + n - a, m, a, e((1 - f / v) * p));
    }
  };
};
"object" === typeof module && (module.exports = Stats);var BASIS = (function() {
  return function(BASIS) {

  var _scriptDir =
    typeof document !== "undefined" && document.currentScript
      ? document.currentScript.src
      : undefined;

const base64ToArrayBuffer = base64 => {
	const _atob = ( typeof atob === "function" ) ? atob :
		string => {
			/** from https://github.com/MaxArt2501/base64-js/blob/master/base64.js */
			// atob can work with strings with whitespaces, even inside the encoded part,
			// but only \t, \n, \f, \r and ' ', which can be stripped.

			const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
			// Regular expression to check formal correctness of base64 encoded strings
			b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;		
			
			string = String(string).replace(/[\t\n\f\r ]+/g, "");
			if ( !b64re.test(string) )
				throw new TypeError("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");

			// Adding the padding if missing, for semplicity
			string += "==".slice(2 - (string.length & 3));
			var bitmap, result = "", r1, r2, i = 0;
			for (; i < string.length;) {
				bitmap = b64.indexOf(string.charAt(i++)) << 18 | b64.indexOf(string.charAt(i++)) << 12
						| (r1 = b64.indexOf(string.charAt(i++))) << 6 | (r2 = b64.indexOf(string.charAt(i++)));

				result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
						: r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
						: String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
			}

			return result;
		};
	
	const binString = _atob(base64);
	const ab = new ArrayBuffer(binString.length);
	const u8arr = new Uint8Array(ab);
	for(let i = 0; i < binString.length; i ++)
		u8arr[i] = binString[i].charCodeAt();
	return ab;
};

const basis_transcoder_wasm_buffer = base64ToArrayBuffer( "AGFzbQEAAAABjgIeYAAAYAF/AX9gAX8AYAJ/fwF/YAN/f38Bf2AEf39/fwF/YAd/f39/f39/AX9gBn98f39/fwF/YAJ/fwBgBH9/f38AYAZ/f39/f38AYAV/f39/fwBgBX9/f39/AX9gCH9/f39/f39/AX9gA39+fwF+YAN/f38AYAABf2ANf39/f39/f39/f39/fwBgCH9/f39/f39/AGADf39/AXxgEH9/f39/f39/f39/f39/f38Bf2AMf39/f39/f39/f39/AX9gC39/f39/f39/f39/AX9gA35/fwF/YAJ+fwF/YAJ8fwF8YAZ/f39/f38Bf2AHf39/f39/fwBgB39/fH9/f38Bf2AJf39/f39/f39/AX8C9gIrA2VudgFiAAIDZW52AWMAAgNlbnYBZAAAA2VudgFlAA8DZW52AWYACwNlbnYBZwASA2VudgFoAA8DZW52AWkAAQNlbnYBagABA2VudgFrAAMDZW52AWwAAgNlbnYBbQACA2VudgFuAAIDZW52AW8ABQNlbnYBcAABA2VudgFxAAMDZW52AXIACQNlbnYBcwATA2VudgF0AAgDZW52AXUADwNlbnYBdgALA2VudgF3AAUDZW52AXgAAwNlbnYBeQADA2VudgF6ABADZW52AUEAAgNlbnYBQgABA2VudgFDAAADZW52AUQAAQNlbnYBRQAEA2VudgFGABADZW52AUcAAQNlbnYBSAAIA2VudgFJAAADZW52AUoADwNlbnYBSwAKA2VudgFMAAgDZW52AU0ACgNlbnYBTgARA2VudgxfX3RhYmxlX2Jhc2UDfwADZW52AWEDfwADZW52Bm1lbW9yeQIAgAIDZW52BXRhYmxlAXAB1gLWAgOMBIoECAgCAwMDAgMIAgEIAQMICAEEBBUPCwQPDwMIAwMPDwMDAwQDBAMBAQgEAQMBGAMBAwIEDwMEAwEBAQMBAgAIAgIBCwQBCQENAQgCBQwKAQgEAwgBAQMDCAkICAgDAwMBAQEJDwwFABkDDwEEAQIFCQMCAgYBDwQCAwUDCAMCDwQIAwMDCQUaCA8DBAUFDwEIDwgDAQQJFgEPAw8DBAEDAwQCCAMDAgICAgICAAIEBQMYFwQIBwYDDwMQDgQAAQICCAgIBQYNBggBDAUEBQQEDAoLCQAODQMGDAcBGwoLAQ8IHQ0aDAUEHAMDCQELCgMDBAQCAQgPAwMDAwMIDwMCAwMDAwgDCAgbAQYDCAEIDwQIAwQIAwgDCAgKGgIIDwQIDwQICAgDAQMPAQEBAwMIAwQACAgIDwQICA8PCAgDCAkABA8IAwgPBAgDAQgDAwMDCAgPBAgIAwMDAwgICAMICwwICQgFCA8EBAgPBAgPCAkFBA8IAwgICAEIAwEICAgFCAQICA8ICAEICQgICQMPBAgKAwgICQQIBAQICAMIAwMIBAgDCQEBAQMIDwQICAgDCAMIAw8EAQEBCAgDAwMDCAMIAwgICA8ICAMICA8DBAgDCAgDAgMCBAgICAMPBAgBAQUBAwIEAgEJCwoDCQsKBAUIAAIQCAEAABQAAAAABAAAAAAAAAAAAAAABggBfwFBgM8OCwd1FgFPAJsEAVAAjQEBUQDgAQFSAJ0EAVMAKQFUAE0BVQCPAgFWAI4CAVcAjQIBWACMAgFZAIsCAVoAigIBXwCJAgEkAIgCAmFhAPYBAmJhAJ4BAmNhAIcCAmRhAIYCAmVhAIQCAmZhAIMCAmdhAIICAmhhALAECfsDAQAjAAvWAoEC5AGaAs0CrwKSAoUC7wGAAtsBW4QBhAGEAYIEwAHAAeUD5APjA+IDgAP/Av4C/QKfAVVVnwHOAswCVVVVVbgCkAL9AVtbW1tL4gHUAZYEmAKXAvUB9AHyAUtLS0tLS0uVAfMB8QGVAf8B8AH+Ae0B/AHsAfsB4QH6ASHYApkEMHEtcXEtcS39Ay0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLZkBmAGYAS0tLZ4BwgKlAjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMoEEgAT/A/kD+AP2A/ID8QPvA+4D7AOCAegD4QPgA7gB2QPXA9UD0wPQA7YByQPHA7YBxAPBA64BvgO7A7cDuAGxA68DrQOsA6kDpwOjA4IBoAOdA5oDeacBlQOTA5ADjAOIA4UDgwP8AvsC9wLyAoIB7wLsAuoCeeUC4wLiAnmnAd8C3gLbAtoC2QLVAssCygLGAsMCvwK+ArwCugK3ArQCrQKsAqoCogKbAtoBMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy+QGTBI8EkQL4AZQEkASTAvcBlQSRBJQCCuDPCIoEFQAgACABNgIAIAAgARBoIAFqNgIECz0BAX8gASgCBCABKAIAayICBEAgACACEMkBIAAoAgAgACgCBGogASgCACACEFwaIAAgAiAAKAIEajYCBAsLEAAgAEUEQA8LIABBeGoQZgt/AQV/An8CQCABQQ9qQXBxIgMgAEGAIGoiBSgCACIBQQRqIgIoAgAiBmoiBEH3H0sEfyADQfgfSwR/IAAgAxD8AwUgABD7AyAFKAIAIgFBBGoiACgCACICIANqIQQMAgsFIAIhACAGIQIMAQsMAQsgACAENgIAIAFBCGogAmoLCzUBAX8gACgCACICIAAoAgRGBH9BAAUgAi0AACABQf8BcUYEfyAAIAJBAWo2AgBBAQVBAAsLCw0AIABB8AJqIAEQ0wILBgAgABApC3MBBX8jAiECIwJBIGokAiAAKAIEIQMgAkEIaiIEIgUgACgCADYCACAFIAM2AgQgAiABKQIANwMAIAJBEGoiAyACKQIANwIAIAQgAxB8BH8gACAAKAIAIAEoAgQgASgCAGtqNgIAQQEFQQALIQYgAiQCIAYLRQEBfyAAKAIAKAIQIQIgACABIAJB/wBxQcoBahEIACAALAAFQQFHBEAgACgCACgCFCECIAAgASACQf8AcUHKAWoRCAALCwYAQQoQAQvzJQEtfyMCIQMjAkHgAmokAiADQcACaiEFIANBuAJqIQYgA0GwAmohByADQagCaiEIIANBoAJqIQkgA0EIaiEEIANBmAJqIQogA0GQAmohCyADQYgCaiEMIANBgAJqIQ0gA0H4AWohDiADQfABaiEPIANB6AFqIRAgA0HgAWohESADQdgBaiESIANB0AFqIRMgA0HIAWohFCADQcABaiEVIANBuAFqIRYgA0GwAWohFyADQagBaiEYIANBoAFqIRkgA0GYAWohGiADQZABaiEbIANBiAFqIRwgA0GAAWohHSADQfgAaiEeIANB8ABqIR8gA0HoAGohICADQeAAaiEhIANB2ABqISIgA0HQAGohIyADQcgAaiEkIANBQGshJSADQThqISYgA0EwaiEnIANBKGohKCADQSBqISkgA0EYaiEqIANBEGohKyADQcgCakGS0g0QJyADQdACaiICIAMpAsgCNwIAIANB2AJqIiwgACACEC5B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AgAgACACEDQMBQtBAAwECwJAAkACQAJAAkACQAJAAkAgASwAAUHQAGsOKwYHBwcHBwcHBwcFBwcHBwcHBwcABwcHBwcHBwcHBwcHAQcCBwMHBwcHBwQHCyAAIAFBAmo2AgAgAiAAEDMiATYCACABBH8gBCAAEDEiATYCACABBH8gAEHwAmogAiAEEL8DBUEACwVBAAsMCgsgACABQQJqNgIAIAIgABAxIgE2AgAgAQR/IAAgAhDFAQVBAAsMCQsgABBtDAgLIAAgAUECajYCACACIAAQMyIBNgIAIAEEfyAAQfbSDSACEFAFQQALDAcLIAAgAUECajYCACACIAAQMSIBNgIAIAEEfyAAQfbSDSACEFAFQQALDAYLIAAgAUECajYCAAJAAkACQCAAKAIEIAAoAgAiAWtBAEsEfyABLAAABUEAC0EYdEEYdUHUAGsOEwACAgICAgICAgICAgICAgICAgECCyACIAAQYiIBNgIAIAEEfyAAQfACaiACEMMDBUEACwwHCyACIAAQtQEiATYCACABBH8gACACELABBUEACwwGC0EADAULIAAgAUECajYCACAAQQhqIgEiBSgCBCAFKAIAa0ECdSEFAkADQCAAQcUAECsNASACIAAQYCIGNgIAIAYEQCABIAIQNQwBCwtBAAwFCyAEIAAgBRA+IAIgAEHwAmogBBDGAzYCACAAIAIQsAEMBAtBAAwDCwJAAkACQAJAAkACQCABLAABQeUAaw4TAAUFBQEFBQIFBQUFBQMFBQUFBAULIAAgAUECajYCACACIAAQMSIBNgIAIAEEfyAAQf/SDSACEFAFQQALDAcLIAAgAUECajYCACACIAAQMyIBNgIAIAEEfyAAQf/SDSACEFAFQQALDAYLIAAgAUECajYCACACIAAQMyIBNgIAIAEEfwJ/IABBCGoiASIFKAIEIAUoAgBrQQJ1IQUCQANAIABBxQAQKw0BIAQgABBfIgY2AgAgBgRAIAEgBBA1DAELC0EADAELIAQgACAFED4gAEHwAmogAiAEEMgDCwVBAAsMBQsgACABQQJqNgIAIABBiNMNECwMBAsgACABQQJqNgIAIAIgABAxIgE2AgAgAQR/IABB8AJqIAIQygMFQQALDAMLQQAMAgsgABBtDAELQQALCyEtIAMkAiAtCwYAQQsQAQviEQEGfyMCIQQjAkEg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EEkFQQALBSABCwVBAAsLCyEGIAIkAiAGC6MBAQN/IwIhAiMCQRBqJAICfwJAAkACQCAAKAIEIAAoAgAiAWtBAEsEfyABLAAABUEAC0EYdEEYdUHEAGsOEQECAgICAgICAgICAgICAgIAAgsgAiAAEGIiATYCACABBH8gAEGUAWogAhA1IAEFQQALDAILIAIgABCGASIBNgIAIAEEfyAAQZQBaiACEDUgAQVBAAsMAQsgABBvCyEDIAIkAiADC2cBAX8gASgCBCABKAIAayAAKAIEIAAoAgBrSwR/QQAFAn8gASgCACECIAEoAgQhASAAKAIAIQADf0EBIAEgAkYNARogACwAACACLAAARgR/IABBAWohACACQQFqIQIMAQVBAAsLCwsLtAEBAn8gAUEANgIAIAAoAgQgACgCACICa0EASwR/IAIsAAAFQQALQVBqQRh0QRh1Qf8BcUEJSgR/QQEFA38gACgCBCAAKAIAIgJrQQBLBH8gAiwAAAVBAAtBUGpBGHRBGHVB/wFxQQpIBH8gASADQQpsNgIAIAEgACgCACICIAAoAgRGBH9BAAUgACACQQFqNgIAIAIsAAALQRh0QRh1QVBqIAEoAgBqIgM2AgAMAQVBAAsLCws3ACAAQfieDTYCACAAQR06AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHopQ02AgAgACABNgIIC0sAIABB+J4NNgIAIABBLzoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQZClDTYCACAAIAEpAgA3AgggACACNgIQIAAgAykCADcCFAv8AQEHfyAAKAIIIgIgACgCBCIDa0EBdSABTwRAIANBACABQQF0EDkaIAAgAUEBdCADajYCBA8LIAEgAyAAKAIAIgNrIgZBAXUiB2oiBEEASARAEAILIAQgAiADayICIAIgBEkbQf////8HIAJBAXVB/////wNJGyIEBEAgBEEASARAQQgQByICEFggAkGQtg02AgAgAkHImQ1BywAQBgUgBEEBdBA3IgghBQsLIAdBAXQgBWoiAkEAIAFBAXQQORogBkEASgRAIAggAyAGED0aCyAAIAU2AgAgACABQQF0IAJqNgIEIAAgBEEBdCAFajYCCCADRQRADwsgAxApC4kCAQh/IAAoAggiAiAAKAIEIgNrQQJ1IAFPBEAgA0EAIAFBAnQQORogACABQQJ0IANqNgIEDwsgASADIAAoAgAiA2siBkECdSIHaiIEQf////8DSwRAEAILIAQgAiADayICQQF1IgggCCAESRtB/////wMgAkECdUH/////AUkbIgQEQCAEQf////8DSwRAQQgQByICEFggAkGQtg02AgAgAkHImQ1BywAQBgUgBEECdBA3IgkhBQsLIAdBAnQgBWoiAkEAIAFBAnQQORogBkEASgRAIAkgAyAGED0aCyAAIAU2AgAgACABQQJ0IAJqNgIEIAAgBEECdCAFajYCCCADRQRADwsgAxApCyQBAX8gASgCCCIBKAIAKAIYIQIgACABIAJB/wBxQcoBahEIAAtnAQF/IAAoAgQgACgCAGsgASgCBCABKAIAa0YEfwJ/IAAoAgAhAiAAKAIEIQAgASgCACEBA39BASAAIAJGDQEaIAEsAAAgAiwAAEYEfyABQQFqIQEgAkEBaiECDAEFQQALCwsFQQALCwQAQQALZQECfyMCIQIjAkEQaiQCIAJBCGohAyACIAE2AgACQAJAA0AgAEHCABArBEAgAyAAEHAgAygCACADKAIERg0CIAIgAEHwAmogAiADEIQEIgE2AgAMAQsLDAELQQAhAQsgAiQCIAELaQEDfyMCIQEjAkEQaiQCIABBxAAQKwR/An8gAEH0ABArRQRAQQAgAEHUABArRQ0BGgsgASAAEDEiAjYCACACBH8gAEHFABArBH8gAEH67A0gARBQBUEACwVBAAsLBUEACyEDIAEkAiADC6kDAQV/IwIhASMCQUBrJAIgAUEwaiECIAFBKGohBCABQSBqIQUgAUEUaiEDIABB1QAQKwRAIAQgABBwIAQoAgAgBCgCBEYEf0EABQJ/IAVBnu0NECcgAiAFKQIANwIAIAQgAhB8RQRAIAIgABCHASIDNgIAIAMEfyAAQfACaiACIAQQyAIFQQALDAELIAIgBEEJELcBIAFBADYCACABQQA2AgQgAigCACEEIAMgADYCACADIAAoAgA2AgQgA0EBOgAIIAAgBDYCACACKAIEIQIgASAAQQRqNgIIIAEgACgCBDYCDCABQQE6ABAgACACNgIEIAEgABBwIAEsABAEQCABKAIIIAEoAgw2AgALIAMsAAgEQCADKAIAIAMoAgQ2AgALIAEoAgAgASgCBEYEf0EABSADIAAQhwEiAjYC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AgwgAkEIaiIDIgYgAUEQajYCACAGIAEoAhA2AgQgBkEBOgAIIAFBfzYCECABKAIEIQQgACgCCCABEC8CQAJAAkACQCABKAIQIgZBf2sOAgABAgsgCEHzyA0QJyAFIAgpAgA3AgAgASAFECgMAgsgASAENgIEDAELQQEhBANAIAQgBk8NASACQYHODRAnIAUgAikCADcCACABIAUQKCABIAQ2AgwgACgCCCABEC8gBEEBaiEEDAAACwALIAMsAAgEQCADKAIAIAMoAgQ2AgALIAcsAAgEQCAHKAIAIAcoAgQ2AgALIAIkAgtBACAAQfieDTYCACAAQTg6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEG4pA02AgAgACABNgIIIAAgAikCADcCDAsNACAAQfACaiABEMUDCw8AIABB8AJqIAEgAhC2AwsRACAAQfACaiABIAIgAxCmAwsRACAAQfACaiABIAIgAxCXAwuGDQEPfyMCIQMjAkEQaiQCIAAgASkAADcAACAAIAEpAAg3AAggAiwACARAIAAsAAEhByAALAACIQggACwABCEJIAAsAAUhCiAALAAGIQsgACwACCEMIAAsAAkhDSAALAAKIQ4gACwADCEFIAAsAA0hBiAALAAOIQEgACAALAAAOgABIAAgBzoAAiAAIAg6AAMgACAJOgAFIAAgCjoABiAAIAs6AAcgACAMOgAJIAAgDToACiAAIA46AAsgACAFOgANIAAgBjoADiAAIAE6AA8LIAIsAAkEQCAAKAAAIQUgACgABCEGIAAoAAghASAAIAAoAAw2AAAgACAFNgAEIAAgBjYACCAAIAE2AAwLIAMgACACLAAGQQBHIAItAAwQywMgACADKQAANwAAIAAgAykACDcACCACLAAHBEAgAyAAEMIDIAAgAykAADcAACAAIAMpAAg3AAgLIAIsAAoEQCADIAAQugMgACADKQAANwAAIAAgAykACDcACAsgAiwACwRAIAMgABCyAyAAIAMpAAA3AAAgACADKQAINwAICyACLAABBEAgAyAAEKoDIAAgAykAADcAACAAIAMpAAg3AAgLIAIsAAMEQCAALQABQc63DWosAAAhDyAALQACQc63DWosAAAhECAALQADQc63DWosAAAhESAALQAEQc63DWosAAAhByAALQAFQc63DWosAAAhCCAALQAGQc63DWosAAAhCSAALQAHQc63DWosAAAhCiAALQAIQc63DWosAAAhCyAALQAJQc63DWosAAAhDCAALQAKQc63DWosAAAhDSAALQALQc63DWosAAAhDiAALQAMQc63DWosAAAhBSAALQANQc63DWosAAAhBiAALQAOQc63DWotAAAgAC0AD0HOtw1qLQAAQQh0ciEBIAAgAC0AAEHOtw1qLAAAOgAAIAAgDzoAASAAIBA6AAIgACAROgADIAAgBzoABCAAIAg6AAUgACAJOgAGIAAgCjoAByAAIAs6AAggACAMOgAJIAAgDToACiAAIA46AAsgACAFOgAMIAAgBjoADSAAIAE7AA4LIAIsAAQEQCADIAAQpQMgACADKQAANwAAIAAgAykACDcACAsgAiwAACIBBEAgAC0AASABQf8BcSIEQQJ0QaDoBGpqLAAAIQ8gAC0AAiAEQQJ0QaDoBGpqLAAAIRAgAC0AAyAEQQJ0QaDoBGpqLAAAIREgAC0ABCAEQQJ0QaDoBGpqLAAAIQcgAC0ABSAEQQJ0QaDoBGpqLAAAIQggAC0ABiAEQQJ0QaDoBGpqLAAAIQkgAC0AByAEQQJ0QaDoBGpqLAAAIQogAC0ACCAEQQJ0QaDoBGpqLAAAIQsgAC0ACSAEQQJ0QaDoBGpqLAAAIQwgAC0ACiAEQQJ0QaDoBGpqLAAAIQ0gAC0ACyAEQQJ0QaDoBGpqLAAAIQ4gAC0ADCAEQQJ0QaDoBGpqLAAAIQUgAC0ADSAEQQJ0QaDoBGpqLAAAIQYgAC0ADiAEQQJ0QaDoBGpqLQAAIAAtAA8gBEECdEGg6ARqai0AAEEIdHIhASAAIAAtAAAgBEECdEGg6ARqaiwAADoAACAAIA86AAEgACAQOgACIAAgEToAAyAAIAc6AAQgACAIOgAFIAAgCToABiAAIAo6AAcgACALOgAIIAAgDDoACSAAIA06AAogACAOOgALIAAgBToADCAAIAY6AA0gACABOwAOCyACLAAFBEBBAyAALQABa0H/AXEhD0EDIAAtAAJrQf8BcSEQQQMgAC0AA2tB/wFxIRFBAyAALQAEa0H/AXEhB0EDIAAtAAVrQf8BcSEIQQMgAC0ABmtB/wFxIQlBAyAALQAHa0H/AXEhCkEDIAAtAAhrQf8BcSELQQMgAC0ACWtB/wFxIQxBAyAALQAKa0H/AXEhDUEDIAAtAAtrQf8BcSEOQQMgAC0ADGtB/wFxIQVBAyAALQANa0H/AXEhBkEDIAAtAA5rQf8BcUEDIAAtAA9rQf//A3FBCHRB//8DcXIhASAAQQMgAC0AAGs6AAAgACAPOgABIAAgEDoAAiAAIBE6AAMgACAHOgAEIAAgCDoABSAAIAk6AAYgACAKOgAHIAAgCzoACCAAIAw6AAkgACANOgAKIAAgDjoACyAAIAU6AAwgACAGOgANIAAgATsADgsgAiwAAkUEQCADJAIPCyADIAAQnAMgACADKQAANwAAIAAgAykACDcACCADJAILwQEBA38jAiECIwJBIGokAiACQQhqQdjjDRAnIAJBEGoiASACKQIINwIAIAAgARAuBH8gABBeGiABIABBABA/IABB3wAQKwR/IAAgARCjAQVBAAsFIAJB2+MNECcgASACKQIANwIAIAAgARAuBH8gASAAQQAQPyABKAIAIAEoAgRGBH9BAAUgAEHwABArBH8gABBeGiABIABBABA/IABB3wAQKwR/IAAgARCjAQVBAAsFQQALCwVBAAsLIQMgAiQCIAMLCwAgAEEIaiABEEELNQEBfyABKAIEIQMgACABKAIAIAIgASgCBCABKAIAayIBQX9qIAEgAksbajYCACAAIAM2AgQLdQEDfyMCIQIjAkEgaiQCIAJBEGoiBEHJzA0QJyACQRhqIgMgBCkCADcCACABIAMQKCAAKAIIIAEQLyACQQhqIgRBxcwNECcgAyAEKQIANwIAIAEgAxAoIAIgACkCDDcDACADIAIpAgA3AgAgASADECggAiQCCxsAIABB8AJqQQwQKiIAIAEoAgBBAEcQ1AMgAAuFCQEWfyMCIQIjAkGgAWokAiACQZABaiEBIAJBiAFqIQMgAkGAAWohBCACQfgAaiEFIAJB8ABqIQYgAkHoAGohByACQeAAaiEIIAJB2ABqIQkgAkHQAGohCiACQcgAaiELIAJBQGshDCACQThqIQ0gAkEwaiEOIAJBKGohDyACQSBqIRAgAkEYaiERIAJBEGohEiACQQhqIRMgAEHMABArBH8CfwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAAKAIEIAAoAgAiFGtBAEsEfyAULAAABUEAC0EYdEEYdUHUAGsOJgAUFBQUFBQUFBQUExQEAgMREhAUBQgJFAoLDg8UFBQGBxQUAQwNFAtBAAwUCyAAIAAoAgBBAWo2AgAgA0Hnzg0QJyABIAMpAgA3AgAgACABEEAMEwsgBEHvzg0QJyABIAQpAgA3AgAgACABEC4EQCABQQA2AgAgACABELkBDBMLIAVB884NECcgASAFKQIANwIAQQAgACABEC5FDRIaIAFBATYCACAAIAEQuQEMEgsgACAAKAIAQQFqNgIAIAZB2ccNECcgASAGKQIANwIAIAAgARBADBELIAAgACgCAEEBajYCACAHQd7HDRAnIAEgBykCADcCACAAIAEQQAwQCyAAIAAoAgBBAWo2AgAgCEHqxw0QJyABIAgpAgA3AgAgACABEEAMDwsgACAAKAIAQQFqNgIAIAlB+McNECcgASAJKQIANwIAIAAgARBADA4LIAAgACgCAEEBajYCACAKQf7HDRAnIAEgCikCADcCACAAIAEQQAwNCyAAIAAoAgBBAWo2AgAgC0GqxQ4QJyABIAspAgA3AgAgACABEEAMDAsgACAAKAIAQQFqNgIAIAxB984NECcgASAMKQIANwIAIAAgARBADAsLIAAgACgCAEEBajYCACANQfnODRAnIAEgDSkCADcCACAAIAEQQAwKCyAAIAAoAgBBAWo2AgAgDkH7zg0QJyABIA4pAgA3AgAgACABEEAMCQsgACAAKAIAQQFqNgIAIA9B/s4NECcgASAPKQIANwIAIAAgARBADAgLIAAgACgCAEEBajYCACAQQYHPDRAnIAEgECkCADcCACAAIAEQQAwHCyAAIAAoAgBBAWo2AgAgEUG7yA0QJyABIBEpAgA3AgAgACABEEAMBgsgACAAKAIAQQFqNgIAIBJBxMgNECcgASASKQIANwIAIAAgARBADAULIAAgACgCAEEBajYCACAAEN8DDAQLIAAgACgCAEEBajYCACAAEN4DDAMLIAAgACgCAEEBajYCACAAEN0DDAILIBNBl8cNECcgASATKQIANwIAQQAgACABEC5FDQEaIAAQUSIBBEAgASAAQcUAECsNAhoLQQAMAQsgASAAEDMiAzYCACADBH8gAiAAQQAQPwJ/IAIoAgAgAigCBEYhFSAAQcUAECshBCAVCwR/IANBACAEGwUgBAR/IABB8AJqIAEgAhDcAwVBAAsLBUEACwsFQQALIRYgAiQC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CCABLQAAcSAFQQF2IAN0cjoAACACQQFqIgJBBEcNAAsLIA9Bf2ohASAdQQF2IQIgCSgCACAGQQtsahBnIAZBAWoiBiAESQ0AQQALCyEAIA0oAhgiAQRAIA0gATYCHCABECkLIA0oAgwiAQRAIA0gATYCECABECkLIA0oAgAiAQRAIA0gATYCBCABECkLCwVBASEACyALKAIYIgEEQCALIAE2AhwgARApCyALKAIMIgEEQCALIAE2AhAgARApCyALKAIAIgEEQCALIAE2AgQgARApCyAARQ0CQQALCwwBC0EBCyEAIBEoAhgiAQRAIBEgATYCHCABECkLIBEoAgwiAQRAIBEgATYCECABECkLIBEoAgAiAQRAIBEgATYCBCABECkLCwsLCwsFQQAhAAsFQQAhAAsFQQAhAAsFQQAhAAsLIBYoAhgiAQRAIBYgATYCHCABECkLIBYoAgwiAQRAIBYgATYCECABECkLIBYoAgAiAQRAIBYgATYCBCABECkLIBUoAhgiAQRAIBUgATYCHCABECkLIBUoAgwiAQRAIBUgATYCECABECkLIBUoAgAiAQRAIBUgATYCBCABECkLIBQoAhgiAQRAIBQgATYCHCABECkLIBQoAgwiAQRAIBQgATYCECABECkLIBQoAgAiAQRAIBQgATYCBCABECkLIBMoAhgiAQRAIBMgATYCHCABECkLIBMoAgwiAQRAIBMgATYCECABECkLIBMoAgAiAUUEQCANJAIgAA8LIBMgATYCBCABECkgDSQCIAAL0AEBAX8CQAJAAkAgAUEARyICIABBA3FBAEdxBEADQCAALQAARQ0CIAFBf2oiAUEARyICIABBAWoiAEEDcUEAR3ENAAsLIAJFDQELIAAtAABFBEAgAUUNAQwCCwJAAkAgAUEDTQ0AA0AgACgCACICQf/9+3dqIAJBgIGChHhxQYCBgoR4c3FFBEAgAEEEaiEAIAFBfGoiAUEDSw0BDAILCwwBCyABRQ0BCwNAIAAtAABFDQIgAUF/aiIBRQ0BIABBAWohAAwAAAsAC0EAIQALIAALzgEBA38CQAJAIAIoAhAiAw0AIAIQkwFFBEAgAigCECEDDAELDAELIAMgAigCFCIEayABSQRAIAIgACABIAIoAiRBD3FBKmoRBAAaDAELIAFFIAIsAEtBAEhyRQRAAkAgASEDA0Ag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ACABNgKIASABECkLIAAoAngiAQRAIAAgATYCfCABECkLIAAoAmwiAQRAIAAgATYCcCABECkLIAAoAmAiAQRAIAAgATYCZCABECkLIAAoAlQiAQRAIAAgATYCWCABECkLIAAoAkgiAQRAIAAgATYCTCABECkLIAAoAjwiAQRAIABBQGsgATYCACABECkLIAAoAjAiAQRAIAAgATYCNCABECkLIAAoAiQiAQRAIAAgATYCKCABECkLIAAoAhgiAQRAIAAgATYCHCABECkLIAAoAgwiAQRAIAAgATYCECABECkLIAAoAgAiAUUEQA8LIAAgATYCBCABECkLvwIBAX8gAEGwAWoQ5QEgACgCoAEiAQRAIAAgATYCpAEgARApCyAAKAKUASIBBEAgACABNgKYASABECkLIAAoAogBIgEEQCAAIAE2AowBIAEQKQsgACgCfCIBBEAgACABNgKAASABECkLIAAoAnAiAQRAIAAgATYCdCABECkLIAAoAmQiAQRAIAAgATYCaCABECkLIAAoAlgiAQRAIAAgATYCXCABECkLIAAoAkwiAQRAIAAgATYCUCABECkLIABBQGsoAgAiAQRAIAAgATYCRCABECkLIAAoAjQiAQRAIAAgATYCOCABECkLIAAoAigiAQRAIAAgATYCLCABECkLIAAoAhwiAQRAIAAgATYCICABECkLIAAoAgwiAQRAIAAgATYCECABECkLIAAoAgAiAUUEQA8LIAAgATYCBCABECkLgAEBA38jAiECIwJBEGokAkG4xA4sAABFBEBBuMQOLAAAQQBHQQFzBEBByMQOQQJB9JsNEA82AgBBuMQOQQA2AgBBuMQOQbjEDigCAEEBcjYCAAsLAn9ByMQOKAIAIQQgASgCABAKIAIgASgCADYCACAECyAAQeO5DSACEBAgAiQCC7QBAgJ/AnwjAiEDIwJBEGokAiABKAIAKAIAQfq5DRAIIgIQCSEBIAIQAAJ8IAFBgJsNIAMQESEFIAMoAgAQDCAFC6shAiABEAAgAEEANgIAIABBADYCBCAAQQA2AgggAkUEQCADJAIPCyACQQBIBEAQAgsgACACEDciATYCBCAAIAE2AgAgACABIAJqNgIIA0AgAUEAOgAAIAAgACgCBEEBaiIBNgIEIAJBf2oiAg0ACyADJAILsAICB38CfCMCIQMjAkEgaiQC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IAA2AgALQwECfyMCIQIjAkEQaiQCIABBFBAqIQAgAkHA9A0QJyABKAIAIQEgAkEIaiIDIAIpAgA3AgAgACADIAEQRSACJAIgAAtDAQJ/IwIhAiMCQRBqJAIgAEEUECohACACQbf0DRAnIAEoAgAhASACQQhqIgMgAikCADcCACAAIAMgARBFIAIkAiAAC0MBAn8jAiECIwJBEGokAiAAQRQQKiEAIAJBqfQNECcgASgCACEBIAJBCGoiAyACKQIANwIAIAAgAyABEEUgAiQCIAALQwECfyMCIQIjAkEQaiQCIABBFBAqIQAgAkGW9A0QJyABKAIAIQEgAkEIaiIDIAIpAgA3AgAgACADIAEQRSACJAIgAAtDAQJ/IwIhAiMCQRBqJAIgAEEUECohACACQfvzDRAnIAEoAgAhASACQQhqIgMgAikCADcCACAAIAMgARBFIAIkAiAAC18BA38jAiECIwJBIGokAiACQQhqIgRBo/MNECcgAkEQaiIDIAQpAgA3AgAgASADECggACgCCCABEC8gAkG88w0QJyADIAIpAgA3AgAgASADECggACgCDCABEC8gAiQCCz4AIABB+J4NNgIAIABBFToABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQdC1DTYCACAAIAE2AgggACACNgIMC0MBAn8jAiECIwJBEGokAiAAQRQQKiEAIAJB+vINECcgASgCACEBIAJBCGoiAyACKQIANwIAIAAgAyABEEUgAiQCIAALDgAgACAAKALMBDYC0AQLQwECfyMCIQIjAkEQaiQCIABBFBAqIQAgAkHo8g0QJyABKAIAIQEgAkEIaiIDIAIpAgA3AgAgACADIAEQRSACJAIgAAtDAQJ/IwIhAiMCQRBqJAIgAEEUECohACACQdLyDRAnIAEoAgAhASACQQhqIgMgAikCADcCACAAIAMgARBFIAIkAiAAC0MBAn8jAiECIwJBEGokAiAAQRQQKiEAIAJBvvINECcgASgCACEBIAJBCGoiAyACKQIANwIAIAAgAyABEEUgAiQCIAALQwECfyMCIQIjAkEQaiQCIABBFBAqIQAgAkGl8g0QJyABKAIAIQEgAkEIaiIDIAIpAgA3AgAgACADIAEQRSACJAIgAAtAAQJ/IwIhAiMCQRBqJAIgAkHF8Q0QJyACQQhqIgMgAikCADcCACAB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AgAiAWtBAUsEfyABLAABBUEAC0EYdEEYdUHSAGsOBQIBAQEAAQsgACAAKAIAQQJqNgIAIAIgAEEAEEciATYCACABBH8gAEHwAmogAhCoAgVBAAsMAwtBAAwCCyAAIAAoAgBBAmo2AgAgAiAAQQAQRyIBNgIAIAEEfyAAIAMQwgEgAEHfABArcgR/IABB8AJqIAIQqQIFQQALBUEACwwBC0EACyEGIAMkAiAGC3UBA38jAiECIwJBIGokAiAAKAIIIAEQLyACQRBqIgRBk+INECcgAkEYaiIDIAQpAgA3AgAgASADECggAiAAKQIMNwMAIAMgAikCADcCACABIAMQKCACQQhqIgBBxcwNECcgAyAAKQIANwIAIAEgAxAoIAIkAgtBACAAQfieDTYCACAAQQE6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHMtA02AgAgACABNgIIIAAgAikCADcCDAtGAQF/IwIhAyMCQRBqJAIgAEEUECohACABKAIAIQEgAyACKQIANwMAIANBCGoiAiADKQIANwIAIAAgASACELUCIAMkAiAACzsBAn8jAiECIwJBEGokAiACIAApAgg3AwAgAkEIaiIDIAIpAgA3AgAgASADECggACgCECABEC8gAiQCCy8BAn8jAiECIwJBEGokAiACIAE2AgAgAiAAQQdxEQEAIQMgAigCABAAIAIkAiADC0EBAX8jAiEDIwJBEGokAiAAQRQQKiEAIAMgARAnIAIoAgAhASADQQhqIgIgAykCADcCACAAIAIgARBFIAMkAiAAC1YBA38jAiECIwJBIGokAiACQQhqIgRB6u8NECcgAkEQaiIDIAQpAgA3AgAgASADECggACgCCCABEC8gAkHFzA0QJyADIAIpAgA3AgAgASADECggAiQCC0wBAX8gAEEMECoiAiEAIAEoAgAhASAAQfieDTYCACAAQRA6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEH0sw02AgAgACABNgIIIAILPwECfyMCIQIjAkEQaiQCIAJBqu8NECcgAkEIaiIDIAIpAgA3AgAgASADECggAEEIaiABEEEgAUEpEDYgAiQCC2kBAX8jAiECIwJBEGokAiAAQRAQKiEAIAIgASkCADcDACACIAIpAgA3AgggAEH4ng02AgAgAEEROgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABByLMNNgIAIAAgAikCCDcCCCACJAIgAAvpAgEFfyMCIQQjAkFAayQCIARBIGohBSAEQTBqIgJBycwNECcgBEE4aiIDIAIpAgA3AgAgASADECggAEEMaiABEEEgBEEoaiICQcXMDRAnIAMgAikCADcCACABIAMQKCAAKAIIIgIoAgAoAhQhBiACIAEgBkH/AHFBygFqEQgAIAAoAhQiAkEBcQRAIAVBqO0NECcgAyAFKQIANwIAIAEgAxAoIAAoAhQhAgsgBEEYaiEFIAJBAnEEQCAFQa/tDRAnIAMgBSkCADcCACABIAMQKCAAKAIUIQILIARBEGohBSACQQRxBEAgBUG57Q0QJyADIAUpAgA3AgAgASADECgLIARBCGohAgJAAkACQCAALAAYQQFrDgIAAQILIAJB8u4NECcgAyACKQIANwIAIAEgAxAoDAELIARB9e4NECcgAyAEKQIANwIAIAEgAxAoCyAAKAIcBEAgAUEgEDYgACgCHCABEC8LIAQkAgtQAQJ/IwIhAiMCQRBqJAIgACgCCCIAKAIAKAIQIQMgACABIANB/wBxQcoBahEIACACQcfMDRAnIAJBCGoiACACKQIANwIAIAEgABAoIAIkAgtWACAAQfieDTYCACAAQQ86AAQgAEEAOgAFIABBAToABiAAQQA6AAcgAEGcsw02AgAgACABNgIIIAAgAikCADcCDCAAIAM2AhQgACAEOgAYIAAgBTYCHAthAQF/IwIhBiMCQRBqJAIgAEEgECohACABKAIAIQEgBiACKQIANwMAIAMoAgAhAiAELAAAIQMgBSgCACEEIAZBCGoiBSAGKQIANwIAIAAgASAFIAIgAyAEEMACIAYkAiAACy4BAX8gAEUEQA8LIAAoAswEIgEEQCAAIAE2AtAEIAEQKQsgAEEEahDmASAAECkLdQEDfyMCIQIjAkEgaiQCIAAoAgggARAvIAJBEGoiBEH/zQ0QJyACQRhqIgMgBCkCADcCACABIAMQKCACIAApAgw3AwAgAyACKQIANwIAIAEgAxAoIAJBCGoiAEGUzQ0QJyADIAApAgA3AgAgASADECggAiQCC0EAIABB+J4NNgIAIABBCjoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQfCyDTYCACAAIAE2AgggACACKQIANwIMC0YBAX8jAiEDIwJBEGokAiAAQRQQKiEAIAEoAgAhASADIAIpAgA3AwAgA0EIaiICIAMpAgA3AgAgACABIAIQxAIgAyQCIAALWAEDfyMCIQIjAkEgaiQCIAAoAgggARAvIAJBCGoiBEHHzA0QJyACQRBqIgMgBCkCADcCACABIAMQKCACIAApAgw3AwAgAyACKQIANwIAIAEgAxAoIAIkAgtBACAAQfieDTYCACAAQQI6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHEsg02AgAgACABNgIIIAAgAikCADcCDAtGAQF/IwIhAyMCQRBqJAIgAEEUECohACABKAIAIQEgAyACKQIANwMAIANBCGoiAiADKQIANwIAIAAgASACEMcCIAMkAiAAC5sBAQR/IwIhAiMCQSBqJAIgAkEYaiEDIAJBEGohBCAAKAIIIgVBAXEEQCAEQajtDRAnIAMgBCkCADcCACABIAMQKCAAKAIIIQULIAJBCGohBCAFQQJxBEAgBEGv7Q0QJyADIAQpAgA3AgAgASADECggACgCCCEFCyAFQQRxBEAgAkG57Q0QJyADIAIpAgA3AgAgASADECgLIAIkAgskAQF/IAAoAgwiACgCACgCFCECIAAgASACQf8AcUHKAWoRCAALKwECfyAAKAIMIgIoAgAoAhAhAyACIAEgA0H/AHFBygFqEQgAIAAgARDJAgsLACAAKAIMIAEQSAsGAEHAjA0LCwAgACgCDCABEEYLVQEDfyABLAAFIQMgASwABiEEIAEsAAchBSAAQfieDTYCACAAQQM6AAQgACADOgAFIAAgBDoABiAAIAU6AAcgAEGYsg02AgAgACACNgIIIAAgATYCDAs6AQJ/IwIhASMCQRBqJAIgAEEQECohACABQefODRAnIAFBCGoiAiABKQIANwIAIAAgAhBPIAEkAiAACzoBAn8jAiEBIwJBEGokAiAAQRAQKiEAIAFBi+0NECcgAUEIaiICIAEpAgA3AgAgACACEE8gASQCIAALOgECfyMCIQEjAkEQaiQCIABBEBAqIQAgAUGE7Q0QJyABQQhqIgIgASkCADcCACAAIAIQTyABJAIgAAs4AQF/IwIhAiMCQRBqJAIgAEEQECohACACIAEQJyACQQhqIgEgAikCADcCACAAIAEQTyACJAIgAAs8AQF/IwIhAiMCQRBqJAIgAEEQECohACACIAEpAgA3AwAgAkEIaiIBIAIpAgA3AgAgACABEE8gAiQCIAALcwEDfyMCIQIjAkEgaiQCIAJBEGpBuOwNECcgAkEYaiIDIAIpAhA3AgAgASADECggACgCDCEEIAIgACgCCDYCCCACIAQ2AgwgAyACKQIINwIAIAEgAxAoIAJB28kNECcgAyACKQIANwIAIAEgAxAoIAIkAguBAQEBfyMCIQIjAkEgaiQCIABBEBAqIQAgAiABKQIANwMAIAJBEGoiASACKQIANwIAIAJBCGogARB2IAEgAikCCDcCACAAQfieDTYCACAAQRo6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHssQ02AgAgACABKQIANwIIIAIkAiAAC00BAX8jAiEDIwJBEGokAiAAQRQQKiEAIAEoAgAhASADIAIoAgA2AgAgA0EANgIEIANBCGoiAiADKQIANwIAIAAgASACEJwBIAMkAiAAC0YBAn8Q4wFBxMQOKAIABEAPC0EMEDchAEGomw0oAgAhASAAQQA2AgAgAEEANgIEIABBADYCCCAAIAEQ7gFBxMQOIAA2AgALuwEBBH8jAiECIwJBIGokAiACQQhqIQQgACgCCCABEC8gAkEQakGA7A0QJyACQRhqIgMgAikCEDcCACABIAMQKCAAQQxqIgAiBSgCAAR/IAUoAgRFBUEACwRAIAAoAgAgARAvBSAAKAIEBH8gACgCAAVBAAsEQCAAKAIEIQUgBCAAKAIANgIAIAQgBTYCBCADIAQpAgA3AgAgASADECgLCyACQdvJDRAnIAMgAikCADcCACABIAMQKCACJAILmQIBBX8jAiEDIwJBMGokAiADQSBqIQIgA0EYaiEEIAEoAgQiBQR/IAEoAgAgBUF/amosAAAFQQALQf8BcUHdAEcEQCAEQcfMDRAnIAIgBCkCADcCACABIAIQKAsgA0EIaiEFIANBEGpBzusNECcgAiADKQIQNwIAIAEgAhAoIABBDGoiBCIGKAIEBH8gBigCAAVBAAsEQCAEKAIEIQYgBSAEKAIANgIAIAUgBjYCBCACIAUpAgA3AgAgASACECgFIAQoAgAEfyAEKAIERQVBAAsEQCAEKAIAIAEQLwsLIANB28kNECcgAiADKQIANwIAIAEgAhAoIAAoAggiACgCACgCFCECIAAgASACQf8AcUHKAWoRCAAgAyQCCyQBAX8gACgCCCIAKAIAKAIQIQIgACABIAJB/wBxQcoBahEIAAtBACAAQfieDTYCACAAQQ46AAQgAEEAOgAFIABBADoABiAAQQE6AAcgAEGUsQ02AgAgACABNgIIIAAgAikCADcCDAtGAQF/IwIhAyMCQRBqJAIgAEEUECohACABKAIAIQEgAyACKQIANwMAIANBCGoiAiADKQIANwIAIAAgASACENwCIAMkAiAAC3ABAn8jAiECIwJBEGokAiACQQhqIQMCQAJAIAAoAgwgARBGDQAgACgCDCABEEgNAAwBCyACQcXMDRAnIAMgAikCADcCACABIAMQKAsgACgCDCIDKAIAKAIUIQAgAyABIABB/wBxQcoBahEIACACJAILtwEBBn8jAiECIwJBIGokAiACQRhqIQMgAkEQaiEEIAJBCGohBSAAKAIMIgYoAgAoAhAhByAGIAEgB0H/AHFBygFqEQgAAkACQCAAKAIMIAEQRg0AIAAoAgwgARBIDQAgBUHHzA0QJyADIAUpAgA3AgAgASADECgMAQsgBEHJzA0QJyADIAQpAgA3AgAgASADECgLIAAoAgggARAvIAJBkusNECcgAyACKQIANwIAIAEgAxAoIAIkAgtHAQF/IAIsAAUhAyAAQfieDTYCACAAQQ06AAQgACADOgAFIABBAToABiAAQQE6AAcgAEHosA02AgAgACABNgIIIAAgAjYCDAs+ACAAQfieDTYCACAAQRc6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEG8sA02AgAgACABNgIIIAAgAjYCDAtfAAJAAkACQAJAAkACQAJAIAEoAggOBgABAgMEBQYLIABBtMoNECcMBQsgAEG+yg0QJwwECyAAQb7KDRAnDAMLIABBmugNECcMAgsgAEGo6A0QJwwBCyAAQbboDRAnCwv6AQEHfyMCIQMjAkFAayQCIANBMGohAiADQShqIQQgA0EgaiEFIANBGGohBiADQRBqIQcgA0EIaiEIAkACQAJAAkACQAJAAkAgACgCCA4GAAECAwQFBgsgBEHryg0QJyACIAQpAgA3AgAgASACECgMBQsgBUH6yg0QJyACIAUpAgA3AgAgASACECgMBAsgBkHF6A0QJyACIAYpAgA3AgAgASACECgMAwsgB0GM6Q0QJyACIAcpAgA3AgAgASACECgMAgsgCEG+6Q0QJyACIAgpAgA3AgAgASACECgMAQsgA0Hw6Q0QJyACIAMpAgA3AgAgASACECgLIAMkAgtMAQF/IABBDBAqIgIhACABKAIAIQEgAEH4ng02AgAgAEEjOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABBkLANNgIAIAAgATYCCCACC3EBA38jAiECIwJBIGokAiACQRBqIQMgAkEIaiEEIAAsAAwEQCAEQabSDRAnIAMgBCkCADcCACABIAMQKAsgACgCCCIAKAIAKAIYIQQgAiAAIARB/wBxQcoBahEIACADIAIpAgA3AgAgASADECggAiQCC0gAIABB+J4NNgIAIABBJToABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQeSvDTYCACAAIAE2AgggACACQQFxOgAMIAAgAzYCEAupAwEBf0Hrtw1BAUGsmw1B+7cNQdEAQQIQI0HAjA1ByIwNQdiMDUEAQf63DUEDQYG4DUEAQYG4DUEAQYO4DUH7tw1B0gAQJkHAjA1BAkGwmw1BjbgNQRlBBBAlQQQQNyIAQdMANgIAQcCMDUGRuA1BAkG4mw1Bl7gNQdcAIABBABAFQQQQNyIAQQU2AgBBwIwNQZu4DUECQcCbDUGNuA1BGiAAQQAQBUEEEDciAEEGNgIAQcCMDUGnuA1BAkHAmw1BjbgNQRogAEEAEAVBBBA3IgBBGzYCAEHAjA1BtLgNQQNByJsNQcG4DUEGIABBABAFQQQQNyIAQQc2AgBBwIwNQca4DUEEQZCIDUHUuA1BASAAQQAQBUEEEDciAEEINgIAQcCMDUHauA1BBEGQiA1B1LgNQQEgAEEAEAVBBBA3IgBBAjYCAEHAjA1B6bgNQQVBoIgNQYe5DUEBIABBABAFQQQQNyIAQQc2AgBBwIwNQY65DUECQcCbDUGNuA1BGiAAQQAQBUEEEDciAEEBNgIAQcCMDUGfuQ1BCEHAiA1BrrkNQQEgAEEAEAULkwMBBX8jAiEDIwJBEGokAiABKAIAIgQtAARBJEYEQCADIAQoAggiBDYCACAEQX5qQQRJBEAgASAAQfACaiADEOQCNgIACwsgA0EEaiEEAn8gAEHDABArBH8gAEHJABArIQUCQAJAIAAoAgQgACgCACIGa0EASwR/IAYsAAAFQQALIgZBGHRBGHVBMWsOBQEBAQABAAtBAAwCCyADIAZBGHRBGHVBUGo2AgAgACAAKAIAQQFqNgIAIAIEQCACQQE6AAALAn8CQCAFRQ0AIAAgAhBHDQBBAAwBCyAEQQA6AAAgACABIAQgAxCgAQsFIAAoAgQgACgCACIFa0EASwR/IAUsAAAFQQALQf8BcUHEAEYEfwJAAkAgACgCBCAAKAIAIgVrQQFLBH8gBSwAAQVBAAsiBUEYdEEYdUEwaw4GAQEBAAABAAtBAAwDCyADIAVBGHRBGHVBUGo2AgAgACAAKAIAQQJqNgIAIAIEQCACQQE6AAALIARBAToAACAAIAEgBCADEKABBUEACwsLIQcgAyQCIAcLPgAgAEH4ng02AgAgAEEYOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABBuK8NNgIAIAAgATYCCCAAIAI2AgwLbAEDfyMCIQIjAkEgaiQCIAJBEGoiBEHq5g0QJyACQRhqIgMgBCkCADcCACABIAMQKCACIAApAgg3AwAgAyACKQIANwIAIAEgAxAoIAJBCGoiAEHz5g0QJyADIAApAgA3AgAgASADECggAiQCC2kBAX8jAiECIwJBEGokAiAAQRAQKiEAIAIgASkCADcDACACIAIpAgA3AgggAEH4ng02AgAgAEEnOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABBjK8NNgIAIAAgAikCCDcCCCACJAIgAAuSAQEDfyMCIQIjAkEwaiQCIAJBGGoiBEGr5g0QJyACQSBqIgMgBCkCADcCACABIAMQKCACIAApAhA3AwAgAyACKQIANwIAIAEgAxAoIAJBEGoiBEGz5g0QJyADIAQpAgA3AgAgASADECggAEEIaiABEEEgAkEIaiIAQcXMDRAnIAMgACkCADcCACABIAMQKCACJAILRAAgAEH4ng02AgAgAEEoOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABB4K4NNgIAIAAgASkCADcCCCAAIAIpAgA3AhALWAEBfyMCIQMjAkEgaiQCIABBGBAqIQAgAyABKQIANwMIIAMgAikCADcDACADQRBqIgEgAykCCDcCACADQRhqIgIgAykCADcCACAAIAEgAhDtAiADJAIgAAsZACABQdsAEDYgAEEIaiABEEEgAUHdABA2C2kBAX8jAiECIwJBEGokAiAAQRAQKiEAIAIgASkCADcDACACIAIpAgA3AgggAEH4ng02AgAgAEEpOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABBtK4NNgIAIAAgAikCCDcCCCACJAIgAAvnAgEGfyMCIQEjAkEwaiQCIAFBGGohBSABQQhqIQMgAUEQaiEEIAFBIGpBouYNECcgAUEoaiICIAEpAiA3AgAgACACEC4EQCACIABBABA/IABB3wAQKwR/IABB8AJqIAIQ6wIFQQALIQAFIAVBpeYNECcgAiAFKQIANwIAIAAgAhAuBEAgAUEANgIAIAFBADYCBCADIABB6gJqNgIAIAMgACwA6gI6AAQgA0EBOgAFIABBAToA6gIgBEGo5g0QJyACIAQpAgA3AgACfwJAIAAgAhAuDQAgAEEIaiIFIgQoAgQgBCgCAGtBAnUhBAJAA0AgAiAAEDMiBjYCACAGRQ0BIAUgAhA1IABBxQAQK0UNAAsgASAAIAQQPgwBC0EADAELIAIgAEEAED8gAEHfABArBH8gAEHwAmogASACEO4CBUEACwshACADLAAFBEAgAygCACADLAAEOgAACwVBACEACwsgASQCIAALOQECfyMCIQIjAkEQaiQCIAJBquUNECcgAkEIaiIDIAIpAgA3AgAgASADECggACgCCCABEC8gAiQCC0wBAX8gAEEMECoiAiEAIAEoAgAhASAAQfieDTYCACAAQSI6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEGIrg02AgAgACABNgIIIAILgQEBA38jAiECIwJBIGokAiACQQhqQaPlDRAnIAJBEGoiAyACKQIINwIAAn8CQCAAIAMQLg0AIAJBp+UNECcgAyACKQIANwIAIAAgAxAuDQAgACABEHgMAQsgAyAAIAEQeCIBNgIAIAEEfyAAQfACaiADEPMCBUEACwshBCACJAIgBAvvAQEEfyMCIQIjAkEQaiQCIAJBCGohAyAAQdoAECsEfyADIAAQUSIENgIAIAQEfyAAQcUAECsEfwJ/IABB8wAQKwRAIAAgACgCACAAKAIEEKEBNgIAIAIgAEGp5w0QLDYCACAAIAMgAhB3DAELIABB5AAQK0UEQCACIAAgARBHIgE2AgAgAQR/IAAgACgCACAAKAIEEKEBNgIAIAAgAyACEHcFQQALDAELIAIgAEEBED8gAEHfABArBH8gAiAAIAEQRyIBNgIAIAEEfyAAIAMgAhB3BUEACwVBAAsLBUEACwVBAAsFQQALIQUgAiQCIAULkwYBCH8jAiEEIwJBMGokAiAEQSBqIQYgBEEUaiEHIARBGGohAiAEQQhqIQUgBCABNgIUIABBzgAQKwR/IAAQXiEDIAFFIghFBEAgASADNgIECyAAQc8AECsEQCAIRQRAIAFBAjoACAsFAkAgAUEARyEDIABB0gAQKwRAIANFDQEgAUEBOgAIBSADRQ0BIAFBADoACAsLCyACQQA2AgAgBSAANgIAIAUgAjYCBCAFIAc2AgggBEGn5Q0QJyAGIAQpAgA3AgAgACAGEC4EQCACIABB5ecNECw2AgALIABBlAFqIQECfwJAAkACQANAIABBxQAQKw0CIABBzAAQKxoCQCAAQc0AECsEQCACKAIARQ0BBQJAAkACQAJAAkACQAJAIAAoAgQgACgCACIDa0EASwR/IAMsAAAFQQALQRh0QRh1QcMAaw4SBQIEBAQEAQQEBAQEBAQEBAMABAsgBSAAEGIQXUUNByABIAIQNQwFCyAGIAAgBCgCFEEARxBKIgM2AgAgA0UgAigCAEVyDQggAiAAIAIgBhBJNgIAIAQoAhQiAwRAIANBAToAAQsgASACEDUMBAsCQCAAKAIEIAAoAgAiA2tBAUsEfyADLAABBUEAC0EYdEEYdUHDAGsOMgIDAwMDAwMDAwMDAwMDAwMDAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAwsgBSAAEIYBEF1FDQUgASACEDUMAwsgACgCBCAAKAIAIgNrQQFLBH8gAywAAQVBAAtB/wFxQfQARg0AIAYgABBvIgM2AgAgBSADEF1FDQggAigCACADRwRAIAEgBhA1CwwCCyAFIAAgBCgCFBB4EF1FDQMgASACEDUMAQsgAigCAEUNAiAFIAAgAiAEKAIUEOgCEF1FDQIgAiAAIAIoAgAQhQEiAzYCACADRQ0CIAEgAhA1CwsMAQsLQQAMAwtBAAwCCyACKAIABH8gASgCACABKAIERgR/QQAFIAEgASgCBEF8ajYCBCACKAIACwVBAAsMAQtBAAsFQQALIQkgBCQCIAkLQQECfyMCIQIjAkEQaiQCIAIgACkCCDcDACACQQhqIgMgAikCADcCACABIAMQKCABQSAQNiAAKAIQIAEQLyACJAILqwIBB38gACgCCCIDIAAoAgQiAmtBC20gAU8EQANAIAJCADcAACACQQA7AAggAkEAOgAKIAAgACgCBEELaiICNgIEIAFBf2oiAQ0ACw8LIAEgAiAAKAIAIgJrIgVBC20iCGoiBkH0ope6AUsEQBACCyAGIAMgAmtBC20iA0EBdCIEIAQgBkkbQfSil7oBIANButGL3QBJGyIDBEAgA0H0ope6AUsEQEEIEAciBBBYIARBkLYNNgIAIARByJkNQcsAEAYFIANBC2wQNyEHCwsgCEELbCAHaiIEQQAgAUELbBA5GiAFQXVtQQtsIARqIQEgBUEASgRAIAEgAiAFED0aCyAAIAE2AgAgACAGQQtsIAdqNgIEIAAgA0ELbCAHajYCCCACRQRADwsgAhApC0EAIABB+J4NNgIAIABBBjoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQdytDTYCACAAIAEpAgA3AgggACACNgIQC0YBAX8jAiEDIwJBEGokAiAAQRQQKiEAIAMgASkCADcDACACKAIAIQEgA0EIaiICIAMpAgA3AgAgACACIAEQ+QIgAyQCIAALdQECfyMCIQIjAkEQaiQCIABBEGoiAywAAEUEQCACIAM2AgAgAiADLAAAOgAEIAJBAToABSADQQE6AAAgACgCDCIAKAIAKAIUIQMgACABIANB/wBxQcoBahEIACACLAAFBEAgAigCACACLAAEOgAACwsgAiQCC3UBAn8jAiECIwJBEGokAiAAQRBqIgMsAABFBEAgAiADNgIAIAIgAywAADoABCACQQE6AAUgA0EBOgAAIAAoAgwiACgCACgCECEDIAAgASADQf8AcUHKAWoRCAAgAiwABQRAIAIoAgAgAiwABDoAAAsLIAIkAgt3AQJ/IwIhAiMCQRBqJAIgAEEQaiIDLAAARQRAIAIgAzYCACACIAMsAAA6AAQgAkEBOgAFIANBAToAACAAKAIMIgAoAgAoAgwhAyAAIAEgA0EfcUEKahEDACEAIAIsAAUEQCACKAIAIAIsAAQ6AAALCyACJAIgAAtmAQJ/IwIhAiMCQRBqJAIgAEEQaiIDLAAABEBBACEABSACIAM2AgAgAiADLAAAOgAEIAJBAToABSADQQE6AAAgACgCDCABEEghACACLAAFBEAgAigCACACLAAEOgAACwsgAiQCIAALZgECfyMCIQIjAkEQaiQCIABBEGoiAywAAARAQQAhAAUgAiADNgIAIAIgAywAADoABCACQQE6AAUgA0EBOgAAIAAoAgwgARBGIQAgAiwABQRAIAIoAgAgAiwABDoAAAsLIAIkAiAAC2YBAn8jAiECIwJBEGokAiAAQRBqIgMsAAAEQEEAIQAFIAIgAzYCACACIAMsAAA6AAQgAkEBOgAFIANBAToAACAAKAIMIAEQYSEAIAIsAAUEQCACKAIAIAIsAAQ6AAALCyACJAIgAAtFACAAQfieDTYCACAAQR86AAQgAEECOgAFIABBAjoABiAAQQI6AAcgAEGwrQ02AgAgACABNgIIIABBADYCDCAAQQA6ABALkAIBCH8gACgCCCIDIAAoAgQiAmtBA3UgAU8EQANAIAJCADcCACAAIAAoAgRBCGoiAjYCBCABQX9qIgENAAsPCyABIAIgACgCACICayIHQQN1IghqIgZB/////wFLBEAQAgsgBiADIAJrIgNBAnUiBCAEIAZJG0H/////ASADQQN1Qf////8ASRsiAwRAIANB/////wFLBEBBCBAHIgQQWCAEQZC2DTYCACAEQciZDUHLABAGBSADQQN0EDciCSEFCwsgCEEDdCAFakEAIAFBA3QQORogB0EASgRAIAkgAiAHED0aCyAAIAU2AgAgACAGQQN0IAVqNgIEIAAgA0EDdCAFajYCCCACRQRADwsgAhApC08BA38jAiECIwJBIGokAiACQQhqIgRB2OMNECcgAkEQaiIDIAQpAgA3AgAgASADECggAiAAKQIINwMAIAMgAikCADcCACABIAMQKCACJAILaQEBfyMCIQIjAkEQaiQCIABBEBAqIQAgAiABKQIANwMAIAIgAikCADcCCCAAQfieDTYCACAAQTY6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEGErQ02AgAgACACKQIINwIIIAIkAiAAC8QCAQV/IwIhAiMCQUBrJAIgAkE4aiEDIAJBMGohBiACQSBqIQQgAkEoaiIFIAE2AgAgBSAANgIEIAFBKBA2IAAsABgEQCAAKAIMIgQEQCAEIAEQLyABQSAQNiACIABBEGoiACkCADcDGCADIAIpAhg3AgAgASADECggAUEgEDYFIABBEGohAAsgBkGi4w0QJyADIAYpAgA3AgAgASADECggAiAAKQIANwMQIAMgAikCEDcCACABIAMQKCABQSAQNiAFEKQBBSAFEKQBIAFBIBA2IAIgACkCEDcDCCADIAIpAgg3AgAgASADECggBEGn4w0QJyADIAQpAgA3AgAgASADECggACgCDARAIAFBIBA2IAIgACkCEDcDACADIAIpAgA3AgAgASADECggAUEgEDYgACgCDCABEC8LCyABQSkQNiACJAILUgAgAEH4ng02AgAgAEE5OgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABB2KwNNgIAIAAgAzYCCCAAIAQ2AgwgACACKQIANwIQIAAgAUEBcToAGAtbAQF/IwIhBSMCQRBqJAIgAEEcECohACABLAAAQQBHIQEgBSACKQIANwMAIAMoAgAhAiAEKAIAIQMgBUEIaiIEIAUpAgA3AgAgACABIAQgAiADEIYDIAUkAiAAC58CAQV/IwIhAyMCQUBrJAIgA0EwaiEEIANBOGoiAkGUzQ0QJyAAQQxqIgYgAhCDAQRAIARBycwNECcgAiAEKQIANwIAIAEgAhAoCyADQQhqIQQgA0EoaiIFQcnMDRAnIAIgBSkCADcCACABIAIQKCAAKAIIIAEQLyADQSBqIgVBkOINECcgAiAFKQIANwIAIAEgAhAoIAMgBikCADcDACACIAMpAgA3AgAgASACECggA0EYaiIFQZPiDRAnIAIgBSkCADcCACABIAIQKCAAKAIUIAEQLyADQRBqIgBBxcwNECcgAiAAKQIANwIAIAEgAhAoIAJBlM0NECcgBiACEIMBBEAgBEHFzA0QJyACIAQpAgA3AgAgASACECgLIAMkAgtIACAAQfieDTYCACAAQSo6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEGsrA02AgAgACABNgIIIAAgAikCADcCDCAAIAM2AhQLlAIBB38gACgCCCIDIAAoAgQiAmtBBHUgAU8EQANAIAJCADcAACACQgA3AAggACAAKAIEQRBqIgI2AgQgAUF/aiIBDQALDwsgASACIAAoAgAiAmsiB0EEdSIIaiIGQf////8ASwRAEAILIAYgAyACayIDQQN1IgUgBSAGSRtB/////wAgA0EEdUH///8/SRsiAwRAIANB/////wBLBEBBCBAHIgUQWCAFQZC2DTYCACAFQciZDUHLABAGBSADQQR0EDchBAsLIAhBBHQgBGpBACABQQR0EDkaIAdBAEoEQCAEIAIgBxA9GgsgACAENgIAIAAgBkEEdCAEajYCBCAAIANBBHQgBGo2AgggAkUEQA8LIAIQKQtPAQF/IwIhBCMCQRBqJAIgAEEYECohACABKAIAIQEgBCACKQIANwMAIAMoAgAhAiAEQQhqIgMgBCkCADcCACAAIAEgAyACEIkDIAQkAiAAC3UBA38jAiECIwJBIGokAiACIAApAgg3AwAgAkEYaiIDIAIpAgA3AgAgASADECggAkEQaiIEQcnMDRAnIAMgBCkCADcCACABIAMQKCAAKAIQIAEQLyACQQhqIgBBxcwNECcgAyAAKQIANwIAIAEgAxAoIAIkAgtBACAAQfieDTYCACAAQTU6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEGArA02AgAgACABKQIANwIIIAAgAjYCEAtGAQF/IwIhAyMCQRBqJAIgAEEUECohACADIAEpAgA3AwAgAigCACEBIANBCGoiAiADKQIANwIAIAAgAiABEI0DIAMkAiAAC0wBAn8jAiEDIwJBEGokAiAAQRgQKiEAIANB1uENECcgASgCACEBIAIoAgAhAiADQQhqIgQgAykCADcCACAAIAQgASACEGwgAyQCIAALXwEDfyMCIQIjAkEgaiQCIAAoAgggARAvIAJBCGoiBEHJzA0QJyACQRBqIgMgBCkCADcCACABIAMQKCAAQQxqIAEQQSACQcXMDRAnIAMgAikCADcCACABIAMQKCACJAILQQAgAEH4ng02AgAgAEEyOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABB1KsNNgIAIAAgATYCCCAAIAIpAgA3AgwLRgEBfyMCIQMjAkEQaiQCIABBFBAqIQAgASgCACEBIAMgAikCADcDACADQQhqIgIgAykCADcCACAAIAEgAhCRAyADJAIgAAt8AQN/IwIhAiMCQSBqJAIgAkEQaiIEQcnMDRAnIAJBGGoiAyAEKQIANwIAIAEgAxAoIAAoAgggARAvIAJBCGoiBEH04A0QJyADIAQpAgA3AgAgASADECggAEEMaiABEEEgAkHFzA0QJyADIAIpAgA3AgAgASADECggAiQCC0EAIABB+J4NNgIAIABBNzoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQairDTYCACAAIAE2AgggACACKQIANwIMC4cBAQN/IwIhAiMCQSBqJAIgAkEYaiEDIAJBEGohBCAALAAMBEAgBEGb2g0QJyADIAQpAgA3AgAgASADECgLIAJBCGoiBEG34A0QJyADIAQpAgA3AgAgASADECggACwADQRAIAJBvuANECcgAyACKQIANwIAIAEgAxAoCyAAKAIIIAEQLyACJAILSwAgAEH4ng02AgAgAEE0OgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABB/KoNNgIAIAAgATYCCCAAIAJBAXE6AAwgACADQQFxOgANCyQAIABBEBAqIgAgASgCACACLAAAQQBHIAMsAABBAEcQlgMgAAtMAQJ/IwIhAyMCQRBqJAIgAEEYECohACADQargDRAnIAEoAgAhASACKAIAIQIgA0EIaiIEIAMpAgA3AgAgACAEIAEgAhBsIAMkAiAACz4AIABB+J4NNgIAIABBFjoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQdCqDTYCACAAIAE2AgggACACNgIMC1ABAn8jAiECIwJBEGokAiACQabSDRAnIAJBCGoiAyACKQIANwIAIAEgAxAoIAAoAggiACgCACgCECEDIAAgASADQf8AcUHKAWoRCAAgAiQCC0wBAX8gAEEMECoiAiEAIAEoAgAhASAAQfieDTYCACAAQSY6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEGkqg02AgAgACABNgIIIAILvgYBCn8jAiEIIwJBEGokAiAIQQhqIQIgAEIANwAAIABCADcACANAIANBf2oiCUEDSyEKIAlBAnQhBiADQQFqIglBAnQhByAKBH9BAAUgAiABIAZqLAAAOgAAIAIgASAGQQFyaiwAADoAAUECCyIFQQFqIQQgAiAFaiABIANBAnQiBUEBcmosAAA6AAAgA0ECSyILRQRAIAIgBGogASAHaiwAADoAACAEQQFqIAJqIAEgB0EBcmosAAA6AAAgBEECaiEECyACIAIgBGogCBBaIAAgBWogAiAEQQF2aiwAADoAACAKBH9BAAUgAiABIAZqLAAAOgAAIAIgASAGQQFyaiwAADoAASACIAEgBkECcmosAAA6AAJBAwsiAyACaiABIAVqLAAAOgAAIANBAWoiBEEBaiEDIAIgBGogASAFQQJyaiwAADoAACALRQRAIAIgA2ogASAHaiwAADoAACACIANBAWoiA2ogASAHQQFyaiwAADoAACACIANBAWpqIAEgB0ECcmosAAA6AAAgA0ECaiEDCyACIAIgA2ogCBBaIAAgBUEBcmogAiADQQF2aiwAADoAACAKBH9BAAUgAiABIAZBAXJqLAAAOgAAIAIgASAGQQJyaiwAADoAASACIAEgBkEDcmosAAA6AAJBAwsiAyACaiABIAVBAXJqLAAAOgAAIANBAWoiBEEBaiEDIAIgBGogASAFQQNyaiwAADoAACALRQRAIAIgA2ogASAHQQFyaiwAADoAACADQQFqIgMgAmogASAHQQJyaiwAADoAACADQQFqIAJqIAEgB0EDcmosAAA6AAAgA0ECaiEDCyACIAIgA2ogCBBaIAAgBUECcmogA0EBdiACaiwAADoAACAKBH9BAAUgAiABIAZBAnJqLAAAOgAAIAIgASAGQQNyaiwAADoAAUECCyIEQQFqIQMgAiAEaiABIAVBAnJqLAAAOgAAIAtFBEAgAiADaiABIAdBAnJqLAAAOgAAIANBAWoiAyACaiABIAdBA3JqLAAAOgAAIANBAWohAwsgAiACIANqIAgQWiAAIAVBA3JqIANBAXYgAmosAAA6AAAgCUEERwRAIAkhAwwBCwsgCCQCCzkBAn8jAiECIwJBEGokAiACQYffDRAnIAJBCGoiAyACKQIANwIAIAEgAxAoIAAoAgggARAvIAIkAgs3ACAAQfieDTYCACAAQQQ6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEH4qQ02AgAgACABNgIICzoBAn8jAiEBIwJBEGokAiAAQRAQKiEAIAFB994NECcgAUEIaiICIAEpAgA3AgAgACACEE8gASQCIAALOQECfyMCIQIjAkEQaiQCIAJBt94NECcgAkEIaiIDIAIpAgA3AgAgASADECggACgCCCABEC8gAiQCC0wBAX8gAEEMECoiAiEAIAEoAgAhASAAQfieDTYCACAAQRM6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHMqQ02AgAgACABNgIIIAILZAEDfyMCIQEjAkEQaiQCIAEgACgCBCAAKAIAIgJrQQBLBH8gAiwAAAVBAAtBGHRBGHVBUGpBCkkEfyAAEGsFIAAQewsiAjYCACACBH8gAEHwAmogARCbAwVBAAshAyABJAIgAws5AQJ/IwIhAiMCQRBqJAIgAkGb2g0QJyACQQhqIgMgAikCADcCACABIAMQKCAAKAIIIAEQLyACJAILNwAgAEH4ng02AgAgAEEhOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABBoKkNNgIAIAAgATYCCAupBAEBfyAAQQA2AAkgAEEAOwANIABBADoADyAAIAEtAABBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoAACAAIAEtAAFBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoAASAAIAEtAAJBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoAAiAAIAEtAANBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoAAyAAIAEtAARBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoABCAAIAEtAAVBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoABSAAIAEtAAZBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoABiAAIAEtAAdBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoAByAAIAEtAAhBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoACCAAIAEtAAlBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoACSAAIAEtAApBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoACiAAIAEtAAtBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoACyAAIAEtAAxBAWoiAkEDIAJBA0gbIgJBACACQQBKGzoADCAAIAEtAA1BAWoiAkEDIAJBA0gbIgJBACACQQBKGzoADSAAIAEtAA5BAWoiAkEDIAJBA0gbIgJBACACQQBKGzoADiAAIAEtAA9BAWoiAEEDIABBA0gbIgBBACAAQQBKGzoADwtLAQF/IwIhBCMCQRBqJAIgAEEYECohACABKAIAIQEgBCACECcgAygCACECIARBCGoiAyAEKQIANwIAIAAgASADIAIQqwEgBCQCIAALRAECfyMCIQIjAkEQaiQCIAAoAgggARAvIAIgACkCDDcDACACQQhqIgMgAikCADcCACABIAMQKCAAKAIUIAEQLyACJAILTQECfyMCIQMjAkEQaiQCIABBGBAqIQAgASgCACEBIANB49kNECcgAigCACECIANBCGoiBCADKQIANwIAIAAgASAEIAIQqwEgAyQCIAALfAEDfyMCIQIjAkEgaiQCIAJBEGoiBEHJzA0QJyACQRhqIgMgBCkCADcCACABIAMQKCAAKAIIIAEQLyACQQhqIgRBqdkNECcgAyAEKQIANwIAIAEgAxAoIAAoAgwgARAvIAJB28kNECcgAyACKQIANwIAIAEgAxAoIAIkAguZBwEGfyABLQAAIAEtAAFBAnRyIAEtAAJBBHRyIAEtAANBBnRyIAEtAAQgAS0ABUECdHIgAS0ABkEEdHIgAS0AB0EGdHJBCHRyIAEtAAggAS0ACUECdHIgAS0ACkEEdHIgAS0AC0EGdHJBEHRyIAEtAAwgAS0ADUECdHIgAS0ADkEEdHIgAS0AD0EGdHJBGHRyIQIgAEIANwAAIABCADcACANAIAEgBkECdCIEai0AACEFIAAgBGoCfwJAAkACQCACIAJFaiICQf//A3FB6aACbCACQRB2aiICIAJFaiIDQf//A3FB6aACbCADQRB2aiIDQf//A3EgA0EQdnNBBmxBEHYgAkH//wNxIAJBEHZzQQZsQRB2aiICQQ9xDgsAAgICAgICAgICAQILQX4MAgtBAgwBC0F/IAJBB0sgAkEDSRsLIAVqIgJBAyACQQNIGyICQQAgAkEAShs6AAAgASAEQQFyIgVqLQAAIQcgA0UgA2oiAkH//wNxQemgAmwgAkEQdmoiAyADRWoiAkH//wNxQemgAmwgAkEQdmohAiAAIAVqAn8CQAJAAkAgA0H//wNxIANBEHZzQQZsQRB2IAJB//8DcSACQRB2c0EGbEEQdmoiA0EPcQ4LAAICAgICAgICAgECC0F+DAILQQIMAQtBfyADQQdLIANBA0kbCyAHaiIDQQMgA0EDSBsiA0EAIANBAEobOgAAIAEgBEECciIFai0AACEHIAIgAkVqIgJB//8DcUHpoAJsIAJBEHZqIgMgA0VqIgJB//8DcUHpoAJsIAJBEHZqIQIgACAFagJ/AkACQAJAIANB//8DcSADQRB2c0EGbEEQdiACQf//A3EgAkEQdnNBBmxBEHZqIgNBD3EOCwACAgICAgICAgIBAgtBfgwCC0ECDAELQX8gA0EHSyADQQNJGwsgB2oiA0EDIANBA0gbIgNBACADQQBKGzoAACABIARBA3IiA2otAAAhBSACIAJFaiICQf//A3FB6aACbCACQRB2aiIEIARFaiICQf//A3FB6aACbCACQRB2aiECIAAgA2oCfwJAAkACQCAEQf//A3EgBEEQdnNBBmxBEHYgAkH//wNxIAJBEHZzQQZsQRB2aiIEQQ9xDgsAAgICAgICAgICAQILQX4MAgtBAgwBC0F/IARBB0sgBEEDSRsLIAVqIgRBAyAEQQNIGyIEQQAgBEEAShs6AAAgBkEBaiIGQQRHDQALCz4AIABB+J4NNgIAIABBKzoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQcioDTYCACAAIAE2AgggACACNgIMCwwAIAAgASkCCDcCAAsyAQF/IwIhAiMCQRBqJAIgAiAAKQIINwMAIAJBCGoiACACKQIANwIAIAEgABAoIAIkAgs6AQJ/IwIhASMCQRBqJAIgAEEQECohACABQefYDRAnIAFBCGoiAiABKQIANwIAIAAgAhBPIAEkAiAAC4sBAQN/IwIhAiMCQRBqJAIgACwAEARAIAFB2wAQNiAAKAIIIAEQLyABQd0AEDYFIAFBLhA2IAAoAgggARAvCyACQQhqIQMgACgCDCIELAAEQb9/akEYdEEYdUH/AXFBAk4EfyACQfXXDRAnIAMgAikCADcCACABIAMQKCAAKAIMBSAECyABEC8gAiQCC0kAIABB+J4NNgIAIABBwQA6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHwpw02AgAgACABNgIIIAAgAjYCDCAAIANBAXE6ABALlQEBA38jAiECIwJBIGokAiABQdsAEDYgACgCCCABEC8gAkEIakHv1w0QJyACQRBqIgMgAikCCDcCACABIAMQKCAAKAIMIAEQLyABQd0AEDYgACgCECIELAAEQb9/akEYdEEYdUH/AXFBAk4EfyACQfXXDRAnIAMgAikCADcCACABIAMQKCAAKAIQBSAECyABEC8gAiQCC5EHAQN/IABCADcAACAAQgA3AAggACABLQAAIgQiA0EDdCADIARqayABLQABIgRrIAEtAARrQQRtIgJBAyACQQNIGyICQQAgAkEAShs6AAAgACAEQQN0IAEtAAEgA2prIAEtAAIiA2sgAS0ABWtBBG0iAkEDIAJBA0gbIgJBACACQQBKGzoAASAAIANBA3QgBCABLQACamsgAS0AAyIEayABLQAGa0EEbSICQQMgAkEDSBsiAkEAIAJBAEobOgACIAAgBEEDdCADIAEtAANqayAEayABLQAHa0EEbSIDQQMgA0EDSBsiA0EAIANBAEobOgADIAAgAS0ABCIDQQN0IAEtAAAgA2prIAEtAAUiBGsgAS0ACGtBBG0iAkEDIAJBA0gbIgJBACACQQBKGzoABCAAIARBA3QgAS0AASADamsgAS0ABiIDayABLQAJa0EEbSICQQMgAkEDSBsiAkEAIAJBAEobOgAFIAAgA0EDdCABLQACIARqayABLQAHIgRrIAEtAAprQQRtIgJBAyACQQNIGyICQQAgAkEAShs6AAYgACAEQQN0IAMgAS0AA2prIARrIAEtAAtrQQRtIgNBAyADQQNIGyIDQQAgA0EAShs6AAcgACABLQAIIgNBA3QgAS0ABCADamsgAS0ACSIEayABLQAMa0EEbSICQQMgAkEDSBsiAkEAIAJBAEobOgAIIAAgBEEDdCADIAEtAAVqayABLQAKIgNrIAEtAA1rQQRtIgJBAyACQQNIGyICQQAgAkEAShs6AAkgACADQQN0IAQgAS0ABmprIAEtAAsiBGsgAS0ADmtBBG0iAkEDIAJBA0gbIgJBACACQQBKGzoACiAAIARBA3QgAyABLQAHamsgBGsgAS0AD2tBBG0iA0EDIANBA0gbIgNBACADQQBKGzoACyAAIAEtAAwiA0EDdCABLQAIIANqayABLQANIgRrIAEtAAxrQQRtIgJBAyACQQNIGyICQQAgAkEAShs6AAwgACAEQQN0IAMgAS0ACWprIAEtAA4iA2sgAS0ADWtBBG0iAkEDIAJBA0gbIgJBACACQQBKGzoADSAAIANBA3QgBCABLQAKamsgAS0ADyIEayABLQAOa0EEbSICQQMgAkEDSBsiAkEAIAJBAEobOgAOIAAgBEEDdCADIAEtAAtqayAEayABLQAPa0EEbSIAQQMgAEEDSBsiAEEAIABBAEobOgAPC0YAIABB+J4NNgIAIABBwgA6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHEpw02AgAgACABNgIIIAAgAjYCDCAAIAM2AhALPwEBfyMCIQIjAkEQaiQCIABBFBAqIQAgAiABKQIANwMAIAJBCGoiASACKQIANwIAIABBACABEK8BIAIkAiAAC0EAIABB+J4NNgIAIABBLDoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQZinDTYCACAAIAE2AgggACACKQIANwIMC0IBAX8jAiEDIwJBEGokAiAAQRQQKiEAIAEoAgAhASADIAIQJyADQQhqIgIgAykCADcCACAAIAEgAhC1AyADJAIgAAutAgEFfyMCIQMjAkFAayQCIANBOGohAiADQTBqIQQgACwAHARAIARBgdcNECcgAiAEKQIANwIAIAEgAhAoCyADQSBqIQQgA0EoakGN1w0QJyACIAMpAig3AgAgASACECggACwAHQRAIARBkdcNECcgAiAEKQIANwIAIAEgAhAoCyADQRhqIQQgA0EQaiEFIAFBIBA2IABBCGoiBigCBARAIARBycwNECcgAiAEKQIANwIAIAEgAhAoIAYgARBBIAVBxcwNECcgAiAFKQIANwIAIAEgAhAoCyADQQhqIQQgACgCECABEC8gAEEUaiIAKAIEBEAgBEHJzA0QJyACIAQpAgA3AgAgASACECggACABEEEgA0HFzA0QJyACIAMpAgA3AgAgASACECgLIAMkAgtfACAAQfieDTYCACAAQTM6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEHspg02AgAgACABKQIANwIIIAAgAjYCECAAIAMpAgA3AhQgACAEQQFxOgAcIAAgBUEBcToAHQtfAQN/IwIhAiMCQSBqJAIgAEEcECohACACQQhqQe3WDRAnIAEoAgAhASACQcXMDRAnIAJBEGoiAyACKQIINwIAIAJBGGoiBCACKQIANwIAIAAgAyABIAQQfyACJAIgAAveDAECfyAAQgA3AAAgAEIANwAIIAAgAS0AACICQeMAIAJB4wBJGyICIAEtAAEiAyACIANJGyICIAEtAAQiAyACIANJGyICIAEtAAUiAyACIANJGzoAACAAIAEtAAAiAkHjACACQeMASRsiAiABLQABIgMgAiADSRsiAiABLQACIgMgAiADSRsiAiABLQAEIgMgAiADSRsiAiABLQAFIgMgAiADSRsiAiABLQAGIgMgAiADSRs6AAEgACABLQABIgJB4wAgAkHjAEkbIgIgAS0AAiIDIAIgA0kbIgIgAS0AAyIDIAIgA0kbIgIgAS0ABSIDIAIgA0kbIgIgAS0ABiIDIAIgA0kbIgIgAS0AByIDIAIgA0kbOgACIAAgAS0AAiICQeMAIAJB4wBJGyICIAEtAAMiAyACIANJGyICIAEtAAYiAyACIANJGyICIAEtAAciAyACIANJGzoAAyAAIAEtAAAiAkHjACACQeMASRsiAiABLQABIgMgAiADSRsiAiABLQAEIgMgAiADSRsiAiABLQAFIgMgAiADSRsiAiABLQAIIgMgAiADSRsiAiABLQAJIgMgAiADSRs6AAQgACABLQAAIgJB4wAgAkHjAEkbIgIgAS0AASIDIAIgA0kbIgIgAS0AAiIDIAIgA0kbIgIgAS0ABCIDIAIgA0kbIgIgAS0ABSIDIAIgA0kbIgIgAS0ABiIDIAIgA0kbIgIgAS0ACCIDIAIgA0kbIgIgAS0ACSIDIAIgA0kbIgIgAS0ACiIDIAIgA0kbOgAFIAAgAS0AASICQeMAIAJB4wBJGyICIAEtAAIiAyACIANJGyICIAEtAAMiAyACIANJGyICIAEtAAUiAyACIANJGyICIAEtAAYiAyACIANJGyICIAEtAAciAyACIANJGyICIAEtAAkiAyACIANJGyICIAEtAAoiAyACIANJGyICIAEtAAsiAyACIANJGzoABiAAIAEtAAIiAkHjACACQeMASRsiAiABLQADIgMgAiADSRsiAiABLQAGIgMgAiADSRsiAiABLQAHIgMgAiADSRsiAiABLQAKIgMgAiADSRsiAiABLQALIgMgAiADSRs6AAcgACABLQAEIgJB4wAgAkHjAEkbIgIgAS0ABSIDIAIgA0kbIgIgAS0ACCIDIAIgA0kbIgIgAS0ACSIDIAIgA0kbIgIgAS0ADCIDIAIgA0kbIgIgAS0ADSIDIAIgA0kbOgAIIAAgAS0ABCICQeMAIAJB4wBJGyICIAEtAAUiAyACIANJGyICIAEtAAYiAyACIANJGyICIAEtAAgiAyACIANJGyICIAEtAAkiAyACIANJGyICIAEtAAoiAyACIANJGyICIAEtAAwiAyACIANJGyICIAEtAA0iAyACIANJGyICIAEtAA4iAyACIANJGzoACSAAIAEtAAUiAkHjACACQeMASRsiAiABLQAGIgMgAiADSRsiAiABLQAHIgMgAiADSRsiAiABLQAJIgMgAiADSRsiAiABLQAKIgMgAiADSRsiAiABLQALIgMgAiADSRsiAiABLQANIgMgAiADSRsiAiABLQAOIgMgAiADSRsiAiABLQAPIgMgAiADSRs6AAogACABLQAGIgJB4wAgAkHjAEkbIgIgAS0AByIDIAIgA0kbIgIgAS0ACiIDIAIgA0kbIgIgAS0ACyIDIAIgA0kbIgIgAS0ADiIDIAIgA0kbIgIgAS0ADyIDIAIgA0kbOgALIAAgAS0ACCICQeMAIAJB4wBJGyICIAEtAAkiAyACIANJGyICIAEtAAwiAyACIANJGyICIAEtAA0iAyACIANJGzoADCAAIAEtAAgiAkHjACACQeMASRsiAiABLQAJIgMgAiADSRsiAiABLQAKIgMgAiADSRsiAiABLQAMIgMgAiADSRsiAiABLQANIgMgAiADSRsiAiABLQAOIgMgAiADSRs6AA0gACABLQAJIgJB4wAgAkHjAEkbIgIgAS0ACiIDIAIgA0kbIgIgAS0ACyIDIAIgA0kbIgIgAS0ADSIDIAIgA0kbIgIgAS0ADiIDIAIgA0kbIgIgAS0ADyIDIAIgA0kbOgAOIAAgAS0ACiIAQeMAIABB4wBJGyIAIAEtAAsiAiAAIAJJGyIAIAEtAA4iAiAAIAJJGyIAIAEtAA8iASAAIAFJGzoADwuiAQEDfyMCIQIjAkEwaiQCIAJBGGoiBEHJzA0QJyACQSBqIgMgBCkCADcCACABIAMQKCAAKAIIIAEQLyACQRBqIgRBrdYNECcgAyAEKQIANwIAIAEgAxAoIAAoAgwgARAvIAJBCGoiBEGz1g0QJyADIAQpAgA3AgAgASADECggACgCECABEC8gAkHFzA0QJyADIAIpAgA3AgAgASADECggAiQCC0UAIABB+J4NNgIAIABBLToABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQcCmDTYCACAAIAE2AgggACACNgIMIAAgAzYCEAtMAQJ/IwIhAyMCQRBqJAIgAEEYECohACADQZzWDRAnIAEoAgAhASACKAIAIQIgA0EIaiIEIAMpAgA3AgAgACAEIAEgAhBsIAMkAiAAC8kBAQR/IwIhAiMCQTBqJAIgAiAAKQIINwMAIAJBIGoiAyACKQIANwIAIAEgAxAoIAJBGGoiBEH/zQ0QJyADIAQpAgA3AgAgASADECggACgCECIEKAIAKAIQIQUgBCABIAVB/wBxQcoBahEIACACQRBqIgRB7dUNECcgAyAEKQIANwIAIAEgAxAoIAAoAhQiACgCACgCECEEIAAgASAEQf8AcUHKAWoRCAAgAkEIaiIAQcXMDRAnIAMgACkCADcCACABIAMQKCACJAILTAECfyMCIQMjAkEQaiQCIABBGBAqIQAgA0Hh1Q0QJyABKAIAIQEgAigCACECIANBCGoiBCADKQIANwIAIAAgBCABIAIQbCADJAIgAAtdAQJ/IwIhAyMCQSBqJAIgAEEcECohACADQQhqIAEQJyACKAIAIQEgA0HFzA0QJyADQRBqIgIgAykCCDcCACADQRhqIgQgAykCADcCACAAIAIgASAEEH8gAyQCIAALYgEDfyMCIQIjAkEwaiQCIAJBGGoiA0Hj1A0QJyACQSBqIgQgAykCADcCACABIAQQKCACQQhqIgMgACgCCBB+IAMgARCuASACQcXMDRAnIAQgAikCADcCACABIAQQKCACJAILngsBAn8gAEIANwAAIABCADcACCAAIAEtAAAiAiABLQABIgMgAiADSxsiAiABLQAEIgMgAiADSxsiAiABLQAFIgMgAiADSxs6AAAgACABLQAAIgIgAS0AASIDIAIgA0sbIgIgAS0AAiIDIAIgA0sbIgIgAS0ABCIDIAIgA0sbIgIgAS0ABSIDIAIgA0sbIgIgAS0ABiIDIAIgA0sbOgABIAAgAS0AASICIAEtAAIiAyACIANLGyICIAEtAAMiAyACIANLGyICIAEtAAUiAyACIANLGyICIAEtAAYiAyACIANLGyICIAEtAAciAyACIANLGzoAAiAAIAEtAAIiAiABLQADIgMgAiADSxsiAiABLQAGIgMgAiADSxsiAiABLQAHIgMgAiADSxs6AAMgACABLQAAIgIgAS0AASIDIAIgA0sbIgIgAS0ABCIDIAIgA0sbIgIgAS0ABSIDIAIgA0sbIgIgAS0ACCIDIAIgA0sbIgIgAS0ACSIDIAIgA0sbOgAEIAAgAS0AACICIAEtAAEiAyACIANLGyICIAEtAAIiAyACIANLGyICIAEtAAQiAyACIANLGyICIAEtAAUiAyACIANLGyICIAEtAAYiAyACIANLGyICIAEtAAgiAyACIANLGyICIAEtAAkiAyACIANLGyICIAEtAAoiAyACIANLGzoABSAAIAEtAAEiAiABLQACIgMgAiADSxsiAiABLQADIgMgAiADSxsiAiABLQAFIgMgAiADSxsiAiABLQAGIgMgAiADSxsiAiABLQAHIgMgAiADSxsiAiABLQAJIgMgAiADSxsiAiABLQAKIgMgAiADSxsiAiABLQALIgMgAiADSxs6AAYgACABLQACIgIgAS0AAyIDIAIgA0sbIgIgAS0ABiIDIAIgA0sbIgIgAS0AByIDIAIgA0sbIgIgAS0ACiIDIAIgA0sbIgIgAS0ACyIDIAIgA0sbOgAHIAAgAS0ABCICIAEtAAUiAyACIANLGyICIAEtAAgiAyACIANLGyICIAEtAAkiAyACIANLGyICIAEtAAwiAyACIANLGyICIAEtAA0iAyACIANLGzoACCAAIAEtAAQiAiABLQAFIgMgAiADSxsiAiABLQAGIgMgAiADSxsiAiABLQAIIgMgAiADSxsiAiABLQAJIgMgAiADSxsiAiABLQAKIgMgAiADSxsiAiABLQAMIgMgAiADSxsiAiABLQANIgMgAiADSxsiAiABLQAOIgMgAiADSxs6AAkgACABLQAFIgIgAS0ABiIDIAIgA0sbIgIgAS0AByIDIAIgA0sbIgIgAS0ACSIDIAIgA0sbIgIgAS0ACiIDIAIgA0sbIgIgAS0ACyIDIAIgA0sbIgIgAS0ADSIDIAIgA0sbIgIgAS0ADiIDIAIgA0sbIgIgAS0ADyIDIAIgA0sbOgAKIAAgAS0ABiICIAEtAAciAyACIANLGyICIAEtAAoiAyACIANLGyICIAEtAAsiAyACIANLGyICIAEtAA4iAyACIANLGyICIAEtAA8iAyACIANLGzoACyAAIAEtAAgiAiABLQAJIgMgAiADSxsiAiABLQAMIgMgAiADSxsiAiABLQANIgMgAiADSxs6AAwgACABLQAIIgIgAS0ACSIDIAIgA0sbIgIgAS0ACiIDIAIgA0sbIgIgAS0ADCIDIAIgA0sbIgIgAS0ADSIDIAIgA0sbIgIgAS0ADiIDIAIgA0sbOgANIAAgAS0ACSICIAEtAAoiAyACIANLGyICIAEtAAsiAyACIANLGyICIAEtAA0iAyACIANLGyICIAEtAA4iAyACIANLGyICIAEtAA8iAyACIANLGzoADiAAIAEtAAoiACABLQALIgIgACACSxsiACABLQAOIgIgACACSxsiACABLQAPIgEgACABSxs6AA8LTAEBfyAAQQwQKiICIQAgASgCACEBIABB+J4NNgIAIABBMToABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQbylDTYCACAAIAE2AgggAgtVAQJ/IwIhAiMCQSBqJAIgAiAAKQIINwMIIAJBEGoiAyACKQIINwIAIAEgAxAoIAAoAhAgARAvIAIgACkCFDcDACADIAIpAgA3AgAgASADECggAiQCC18BA38jAiECIwJBIGokAiAAQRwQKiEAIAJBCGpBpdQNECcgASgCACEBIAJBxcwNECcgAkEQaiIDIAIpAgg3AgAgAkEYaiIEIAIpAgA3AgAgACADIAEgBBB/IAIkAiAAC2kBAX8jAiECIwJBEGokAiAAQRAQKiEAIAIgASkCADcDACACIAIpAgA3AgggAEH4ng02AgAgAEEAOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABB5KQNNgIAIAAgAikCCDcCCCACJAIgAAsrAQF/IAAoAggiAgRAIAIgARAvCyABQfsAEDYgAEEMaiABEEEgAUH9ABA2C0YBAX8jAiEDIwJBEGokAiAAQRQQKiEAIAEoAgAhASADIAIpAgA3AwAgA0EIaiICIAMpAgA3AgAgACABIAIQrwEgAyQCIAALOQECfyMCIQIjAkEQaiQCIAJBjtMNECcgAkEIaiIDIAIpAgA3AgAgASADECggACgCCCABEC8gAiQCC0wBAX8gAEEMECoiAiEAIAEoAgAhASAAQfieDTYCACAAQTo6AAQgAEEBOgAFIABBAToABiAAQQE6AAcgAEGMpA02AgAgACABNgIIIAILjQUBAX8jAiEEIwJBEGokAiAEQgA3AgAgBEIANwIIIAIEQCAEIAEoAAw2AgAgBCABKAAINgIEIAQgASgABDYCCCAEIAEoAAA2AgwFIAQgASkAADcAACAEIAEpAAg3AAgLIABCADcAACAAQgA3AAgCQAJAAkACQAJAAkAgAw4EAAECAwQLIAAgBCkAADcAACAAIAQpAAg3AAgMBAsgACAELAAMOgAAIAAgBCwACDoAASAAIAQsAAQ6AAIgACAELAAAOgADIAAgBCwADToABCAAIAQsAAk6AAUgACAELAAFOgAGIAAgBCwAAToAByAAIAQsAA46AAggACAELAAKOgAJIAAgBCwABjoACiAAIAQsAAI6AAsgACAELAAPOgAMIAAgBCwACzoADSAAIAQsAAc6AA4gACAELAADOgAPDAMLIAAgBCwADzoAACAAIAQsAA46AAEgACAELAANOgACIAAgBCwADDoAAyAAIAQsAAs6AAQgACAELAAKOgAFIAAgBCwACToABiAAIAQsAAg6AAcgACAELAAHOgAIIAAgBCwABjoACSAAIAQsAAU6AAogACAELAAEOgALIAAgBCwAAzoADCAAIAQsAAI6AA0gACAELAABOgAOIAAgBCwAADoADwwCCyAAIAQsAAM6AAAgACAELAAHOgABIAAgBCwACzoAAiAAIAQsAA86AAMgACAELAACOgAEIAAgBCwABjoABSAAIAQsAAo6AAYgACAELAAOOgAHIAAgBCwAAToACCAAIAQsAAU6AAkgACAELAAJOgAKIAAgBCwADToACyAAIAQsAAA6AAwgACAELAAEOgANIAAgBCwACDoADiAAIAQsAAw6AA8MAQsgBCQCDwsgBCQCC9ADAQp/IwIhAiMCQUBrJAIgAkEYaiEEIAJBEGohBSACQQhqIQYgAkEoakGS0g0QJyACQTBqIgEgAikCKDcCACACQTlqIgggACABEC5BAXE6AAAgAkE4aiIJIAAoAgQgACgCACIDa0EBSwR/IAMsAAEFQQALQf8BcUHhAEY6AAAgAkEgakH41g0QJyABIAIpAiA3AgACfwJAIAAgARAuDQAgBEH71g0QJyABIAQpAgA3AgAgACABEC4NAEEADAELIABBCGoiBCIDKAIEIAMoAgBrQQJ1IQMCQAJAA0AgAEHfABArRQRAIAEgABAxIgc2AgAgB0UNAiAEIAEQNQwBCwsMAQtBAAwBCyAFIAAgAxA+IAYgABAzIgM2AgAgAwR/An8gAkH+1g0QJyABIAIpAgA3AgAgACABEC5FBEBBACAAQcUAECtFDQEaIAFBADYCACABQQA2AgQgAEHwAmogBSAGIAEgCCAJEK0BDAELIAQoAgQgBCgCAGtBAnUhAwJAA0AgAEHFABArDQEgASAAEDEiBzYCACAHBEAgBCABEDUMAQsLQQAMAQsgASAAIAMQPiAAQfACaiAFIAYgASAIIAkQrQELBUEACwshCiACJAIgCgumAgEHfyMCIQIjAkEgaiQCIAJBCGohASACQRBqQfHgDRAnIAJBGGoiBCACKQIQNwIAIAAgBBAuBH8gASAAQegCajYCACABIAAsAOgCOgAEIAFBAToABSAAQQA6AOgCIAQgABAzIgM2AgAgASwABQRAIAEoAgAgASwABDoAAAsgAwR/An8gAEHfABArRQRAIAEgABAxIgM2AgAgAwR/IAIgACABIAFBBGoQvAEgAEHwAmogBCACEKYBBUEACwwBCyAAQQhqIgMiBSgCBCAFKAIAa0ECdSEFAkADQCAAQcUAECsNASABIAAQMSIGNgIAIAYEQCADIAEQNQwBCwtBAAwBCyABIAAgBRA+IABB8AJqIAQgARCmAQsFQQALBUEACyEHIAIkAiAHC8INASV/IwIhAiMCQaACaiQCIAJBCGohASACQZACaiEHIAJBiAJqIQMgAkGAAmohBCACQfgBaiEIIAJB8AFqIQkgAkHoAWohCiACQeABaiELIAJB2AFqIQwgAkHQAWohDSACQcgBaiEOIAJBwAFqIQ8gAkG4AWohECACQbABaiERIAJBqAFqIRIgAkGgAWohEyACQZgBaiEUIAJBkAFqIRUgAkGIAWohFiACQYABaiEXIAJB+ABqIRggAkHwAGohGSACQegAaiEaIAJB4ABqIRsgAkHYAGohHCACQdAAaiEdIAJByABqIR4gAkFAayEfIAJBOGohICACQTBqISEgAkEoaiEiIAJBIGohIyACQRhqISQgAkEQaiEFIABB5gAQKwRAAkACQAJAAkAgACgCBCAAKAIAIgZrQQBLBH8gBiwAAAVBAAsiBkEYdEEYdUHMAGsOJwABAQEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAgELQQEhJQwBC0EAIQAMAQsgByAlOgAAIAAgACgCAEEBajYCACACQQA2AgAgAkEANgIEIANBxeINECcgASADKQIANwIAAkACQCAAIAEQLgRAIAFBzcwNECcMAQUCQCAEQcjiDRAnIAEgBCkCADcCACAAIAEQLgRAIAFBy8wNECcMAwsgCEHL4g0QJyABIAgpAgA3AgAgACABEC4EQCABQZXSDRAnDAMLIAlBzuINECcgASAJKQIANwIAIAAgARAuBEAgAUGY0g0QJwwDCyAKQdHiDRAnIAEgCikCADcCACAAIAEQLgRAIAFBpNINECcMAwsgC0HU4g0QJyABIAspAgA3AgAgACABEC4EQCABQajSDRAnDAMLIAxB1+INECcgASAMKQIANwIAIAAgARAuBEAgAUGr0g0QJwwDCyANQdriDRAnIAEgDSkCADcCACAAIAEQLgRAIAFBrdINECcMAwsgDkHd4g0QJyABIA4pAgA3AgAgACABEC4EQCABQbDSDRAnDAMLIA9B4OINECcgASAPKQIANwIAIAAgARAuBEAgAUGy0g0QJwwDCyAQQePiDRAnIAEgECkCADcCACAAIAEQLgRAIAFBtdINECcMAwsgEUHm4g0QJyABIBEpAgA3AgAgACABEC4EQCABQbjSDRAnDAMLIBJB6eINECcgASASKQIANwIAIAAgARAuBEAgAUGUzQ0QJwwDCyATQeziDRAnIAEgEykCADcCACAAIAEQLgRAIAFBu9INECcMAwsgFEHv4g0QJyABIBQpAgA3AgAgACABEC4EQCABQb7SDRAnDAMLIBVB8uINECcgASAVKQIANwIAIAAgARAuBEAgAUHB0g0QJwwDCyAWQfXiDRAnIAEgFikCADcCACAAIAEQLgRAIAFB/80NECcMAwsgF0H44g0QJyABIBcpAgA3AgAgACABEC4EQCABQaTRDRAnDAMLIBhB++INECcgASAYKQIANwIAIAAgARAuBEAgAUHF0g0QJwwDCyAZQf7iDRAnIAEgGSkCADcCACAAIAEQLgRAIAFBjs0NECcMAwsgGkGB4w0QJyABIBopAgA3AgAgACABEC4EQCABQcjSDRAnDAMLIBtBhOMNECcgASAbKQIANwIAIAAgARAuBEAgAUHO0g0QJwwDCyAcQYfjDRAnIAEgHCkCADcCACAAIAEQLgRAIAFB09INECcMAwsgHUGK4w0QJyABIB0pAgA3AgAgACABEC4EQCABQdbSDRAnDAMLIB5BjeMNECcgASAeKQIANwIAIAAgARAuBEAgAUHY0g0QJwwDCyAfQZDjDRAnIAEgHykCADcCACAAIAEQLgRAIAFB39INECcMAwsgIEGT4w0QJyABICApAgA3AgAgACABEC4EQCABQeHSDRAnDAMLICFBluMNECcgASAhKQIANwIAIAAgARAuBEAgAUHq0g0QJwwDCyAiQZnjDRAnIAEgIikCADcCACAAIAEQLgRAIAFB7NINECcMAwsgI0Gc4w0QJyABICMpAgA3AgAgACABEC4EQCABQe/SDRAnDAMLICRBn+MNECcgASAkKQIANwIAIAAgARAuRQRAQQAhAAwBCyABQfLSDRAnDAILCwwBCyACIAEpAwA3AwAgASAAEDEiAzYCACAFQQA2AgAgAwR/An8CQAJAIAZBGHRBGHVBzABrDgcAAQEBAQEAAQsgBSAAEDEiBDYCAEEAIARFDQEaICUEQCABIAQ2AgAgBSADNgIACwsgAEHwAmogByACIAEgBRCHAwsFQQALIQALCwVBACEACyACJAIgAAtpAQF/IwIhAiMCQRBqJAIgAEEQECohACACIAEpAgA3AwAgAiACKQIANwIIIABB+J4NNgIAIABBHDoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQeCjDTYCACAAIAIpAgg3AgggAiQCIAALlgIBBX8jAiEDIwJBQGskAiADQThqIQIgA0EwaiEEIANBKGohBSAAKAIMIAAoAghrQQNLBEAgBEHJzA0QJyACIAQpAgA3AgAgASACECggAyAAKQIINwMQIAIgAykCEDcCACABIAIQKCAFQcXMDRAnIAIgBSkCADcCACABIAIQKAsgA0EgaiEEIANBGGohBSAAQRBqIgYoAgAsAABB7gBGBEAgBEGk0Q0QJyACIAQpAgA3AgAgASACECggBSAGQQEQtwEgAiAFKQIANwIABSADIAYpAgA3AwggAiADKQIINwIACyABIAIQKCAAKAIMIAAoAghrQQRJBEAgAyAAKQIINwMAIAIgAykCADcCACABIAIQKAsgAyQCC0QAIABB+J4NNgIAIABBPToABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQbSjDTYCACAAIAEpAgA3AgggACACKQIANwIQC1gBAX8jAiEDIwJBIGokAiAAQRgQKiEAIAMgASkCADcDCCADIAIpAgA3AwAgA0EQaiIBIAMpAgg3AgAgA0EYaiICIAMpAgA3AgAgACABIAIQ0QMgAyQCIAALQQEBfyMCIQIjAkEQaiQCIAAsAAgEQCACQe3QDRAnBSACQfLQDRAnCyACQQhqIgAgAikCADcCACABIAAQKCACJAILOgAgAEH4ng02AgAgAEE7OgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABBiKMNNgIAIAAgAUEBcToACAu0AgEJfyMCIQIjAkEwaiQCIAJBGGohBSACQShqIQYgAkEgaiEHIABBCGoiACgCACEIIAAoAgRBAWogCGtBCEsEQAJ/IAZBBGohCiAGIQADQCAEQQhHBEAgAEHQAUGpASAEQQFyIAhqLAAAIglBUGpBCkkbIAlqQQBBCSAEIAhqLAAAIglBUGpBCkkbIAlq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IQUgAiQCIAULWQEBfyABKAIQQX9GBEAgASAAKAIMNgIQIAFBADYCDAsgASgCDCICIAAoAgxJBEAgACgCCCACQQJ0aigCACIAKAIAKAIUIQIgACABIAJB/wBxQcoBahEIAAsLWQEBfyABKAIQQX9GBEAgASAAKAIMNgIQIAFBADYCDAsgASgCDCICIAAoAgxJBEAgACgCCCACQQJ0aigCACIAKAIAKAIQIQIgACABIAJB/wBxQcoBahEIAAsLWgEBfyABKAIQQX9GBEAgASAAKAIMNgIQIAFBADYCDAsgASgCDCICIAAoAgxJBH8gACgCCCACQQJ0aigCACIAKAIAKAIMIQIgACABIAJBH3FBCmoRAwAFIAALC0UBAX8gASgCEEF/RgRAIAEgACgCDDYCECABQQA2AgwLIAEoAgwiAiAAKAIMSQR/IAAoAgggAkECdGooAgAgARBIBUEACwtFAQF/IAEoAhBBf0YEQCABIAAoAgw2AhAgAUEANgIMCyABKAIMIgIgACgCDEkEfyAAKAIIIAJBAnRqKAIAIAEQRgVBAAsLRQEBfyABKAIQQX9GBEAgASAAKAIMNgIQIAFBADYCDAsgASgCDCICIAAoAgxJBH8gACgCCCACQQJ0aigCACABEGEFQQALC7cCAQN/IABB+J4NNgIAIABBGzoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQayhDTYCACAAQQhqIgIgASkCADcCACAAQQI6AAUgAEECOgAHIABBAjoABiACKAIAIQEgAigCACACKAIEQQJ0aiEEAkACQANAIAEgBEYNASABQQRqIQMgASgCACwABkEBRgRAIAMhAQwBCwsMAQsgAEEBOgAGCyACKAIAIQEgAigCACACKAIEQQJ0aiEEAkACQANAIAEgBEYNASABQQRqIQMgASgCACwAB0EBRgRAIAMhAQwBCwsMAQsgAEEBOgAHCyACKAIAIQEgAigCACACKAIEQQJ0aiECAkACQANAIAEgAkYNASABQQRqIQMgASgCACwABUEBRgRAIAMhAQwBCwsMAQsgAEEBOgAFCws9AQF/IwIhAiMCQRBqJAIgAEEQECohACACIAEpAgA3AwAgAkEIaiIBIAIpAgA3AgAgACABEOYDIAIkAiAAC5gBAQN/IwIhAiMCQSBqJAIgAkEIaiEEIAJBEGpB/80NECcgAkEYaiIDIAIpAhA3AgAgASADECggAEEIaiABEEEgASgCBCIABH8gASgCACAAQX9qaiwAAAVBAAtB/wFxQT5GBEAgBEHHzA0QJyADIAQpAgA3AgAgASADECgLIAJBlM0NECcgAyACKQIANwIAIAEgAxAoIAIkAgtpAQF/IwIhAiMCQRBqJAIgAEEQECohACACIAEpAgA3AwAgAiACKQIANwIIIABB+J4NNgIAIABBHjoABCAAQQE6AAUgAEEBOgAGIABBAToAByAAQYChDTYCACAAIAIpAgg3AgggAiQCIAALoQIBAn8gACgCACAAQQxqRiECIAEoAgAgAUEMakYEQCACRQRAIAAoAgAQKSAAIABBDGoiAjYCACAAIAI2AgQgACAAQSxqNgIICyABKAIEIAEoAgAiAmsiAwRAIAAoAgAgAiADEFwaCyAAIAAoAgAgASgCBCABKAIAa0ECdUECdGo2AgQgASABKAIANgIEBSACBEAgACABKAIANgIAIAAgASgCBDYCBCAAIAEoAgg2AgggASABQQxqIgA2AgAgASAANgIEIAEgAUEsajYCCAUgACgCACECIAAgASgCADYCACABIAI2AgAgACgCBCECIAAgASgCBDYCBCABIAI2AgQgACgCCCECIAAgASgCCDYCCCABIAI2AgggASABKAIANgIECwsLrwEBAn8gACAAQQxqIgI2AgAgACACNgIEIAAgAEEsajYCCCABKAIAIAFBDGpGBEAgASgCBCABKAIAIgJrIgMEQCAAKAIAIAIgAxBcGgsgACAAKAIAIAEoAgQgASgCAGtBAnVBAnRqNgIEIAEgASgCADYCBAUgACABKAIANgIAIAAgASgCBDYCBCAAIAEoAgg2AgggASABQQxqIgA2AgAgASAANgIEIAEgAUEsajYCCAsLFAAgACgCCCABEC8gACgCDCABEC8LPgAgAEH4ng02AgAgAEEgOgAEIABBAToABSAAQQE6AAYgAEEBOgAHIABB1KANNgIAIAAgATYCCCAAIAI2AgwLlgEBA38jAiEDIwJBEGokAiADQQhqIQQCQAJAIAAoAggiAi0ABEEKRw0AIAIQvgFFBEAgACgCCCECDAELDAELAkACQCACIAEQRg0AIAAoAgggARBIDQAMAQsgA0HFzA0QJyAEIAMpAgA3AgAgASAEECgLIAAoAggiACgCACgCFCECIAAgASACQf8AcUHKAWoRCAALIAMkAgvAAgEIfyMCIQMjAkFAayQCIANBMGohAiADQShqIQUgA0EgaiEGIANBGGohByADQRBqIQggA0EIaiEJAkACQCAAKAIIIgQtAARBCkcNACAEEL4BBEAgACgCCCEAIAhBkM0NECcgAiAIKQIANwIAIAEgAhAoIAMgACkCDDcDACACIAMpAgA3AgAgASACECggCUGUzQ0QJyACIAkpAgA3AgAgASACECgFIAAoAgghBAwBCwwBCyAEIAEgBCgCACgCEEH/AHFBygFqEQgAIAAoAgggARBGBEAgBUHHzA0QJyACIAUpAgA3AgAgASACECgLAkACQCAAKAIIIAEQRg0AIAAoAgggARBIDQAMAQsgBkHJzA0QJyACIAYpAgA3AgAgASACECgLIAdBjs0NECcgAiAHKQIANwIAIAEgAhAoCyADJAILUwEDfyAAQQwQKiIDIgIhACABKAIAIgEsAAUhBCAAQfieDTYCACAAQQs6AAQgACAEOgAFIABBAToABiAAQQE6AAcgAkGooA02AgAgAiABNgIIIAMLvwEBBX8jAiECIwJBIGokAiACQRhqIQUgAkEQaiEDIAJBCGohBiAAQRBqIgQsAABFBEAgAyAENgIAIAMgBCwAADoABCADQQE6AAUgBEEBOgAAIAYgACABEL8BAkACQCAGKAIEIgAgARBGDQAgACABEEgNAAwBCyACQcXMDRAnIAUgAikCADcCACABIAUQKAsgACABIAAoAgAoAhRB/wBxQcoBahEIACADLAAFBEAgAygCACADLAAEOgAACwsgAiQCC5QCAQd/IwIhAiMCQTBqJAIgAkEoaiEDIAJBGGohBCACQQhqIQYgAkEgaiEHIAJBEGohCCAAQRBqIgUsAABFBEAgBCAFNgIAIAQgBSwAADoABCAEQQE6AAUgBUEBOgAAIAYgACABEL8BIAYoAgQiACgCACgCECEFIAAgASAFQf8AcUHKAWoRCAAgACABEEYEQCAHQcfMDRAnIAMgBykCADcCACABIAMQKAsCQAJAIAAgARBGDQAgACABEEgNAAwBCyAIQcnMDRAnIAMgCCkCADcCACABIAMQKAsgAkHNzA1By8wNIAYoAgAbECcgAyACKQIANwIAIAEgAxAoIAQsAAUEQCAEKAIAIAQsAAQ6AAAL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3BEw+aX1WSEal6JRQJlpBmZYwESmSJHsVEYB+/rs/FARcdFBQUQEn/AOXo5IEA8ZPV9AbkCtBJn+b1wfEDsJS0UfbJRAbZYLD9tkZMH51uKRdJB4l0BcfFPDM6VEMysQdMEl1EA2yUjXyRlmeIV5kUAcTFlm0tIFL7QRxwhXJ2D5SoUTENCWYn3wuJk9QzJdSb5kaJFHuUNOEKFW532d0KiVUGK/h4/UwZlw1IsVE2PboDlB5WOc3OREJWyE0QQOTyZbseCdSUkyAAISAAAgAgAAEAoAABAKAAAgIwAAEBsAABALAAAQGwAAECQAABAcAAACEgAAIAIAABAKAAAQCgAQACMAABAbAAAQCwAAEBsAIAAjAAAQGwAAEAEAABABAAAQAQAAEAEAABACAAAQAgAAEAIAAAAEAAAABAAAAAQAABABAAAQAQAAEAEAABABAAAQAgAAEAIAABACAAAABAAQAAIAAAAEAAACEgAAIAIAABAKAAAQCgAAAhIAAgASAAAQCgAAEBIAAgASAAAQEgBB8IkBC9c7EAQsABASGwAQAh4AEAIeAAAENAAAEhQAAAIBAAAgGwAAAk0AACAkABAEEwAQEgIAEAIFABACBQAgIDMAABIUAAACAQAAIBsAICAzAAAgGwAQEhoAEBIaABASGgAQIBsAACIIAAACAQAAAgEAACACAAAgEwAAIAsAEBIBABASAQAQEgEAECACABACCAAAAgEAAAIBAAAgAgAiAAgAACACABAEEgAQEgEAEAIEAAACAAAQBBIABBASAAACAAAAIBoABBASAAAgGgAQABoAEAAaABAAGgAQABoAABIAAAASAAAAEgAAACABAAAQCgAAEAoAICQkACAEFAAgIh8AIBIcABAGPAAgIh8AIBITABASHAAAIjQAABIWAAIEFgACIgYAAhIOAAISDgASAjMAICIWACASCgAAEhIAJgAzAAASEgAgBBMAIAQTACAEEwAgEhMAICIRACASCgAgEgoAIAINABASDgAQAggAAhIFAAISBQACEgUAAhIFAAICCAAgEgEAIBIBACACBAACAggAIAIEAAQAEgAgBAIAAhIKAAAiCQAEABIACAASAAAiCQAAEhIACAASAAASEgAgABIAIAASACAAEgAgABIAIBIJACASCQAgEgkAIAIJABACBAAQAgQAEgYsABIUGgASBB4AEgQeAAIGNAACFBUAAgQBAAIiGwAQFDQAICIbABIGEwASFAEAEgQFABIEBQAUEDMAAhQVAAIEAQACIhsAEBQzAAIiGwASFBoAEhQaABIUGgASIhsAAiQIAAIEAQACBAEAAiICACAECwAgIgIAEhQBABIUAQASFAEAEiICABIECAACBAEAAgQBAAIiAgAkAggAAiICACQAEgASFAAAEgQEAAIEAAAkABIABhISAAIEAAAAIhoABhISAAAiGgASABoAEgAaABIAGgASABoAAgQBAAIEAQACBAEAAiIBACAiAQAgIgEAIggoACIGFQAiJCEAIiQcACIWNwAiJBkAIiQNACIUHwAgBjcAEhQUAAQGFQAEJAUABCQFAAQUCwAWADMAIiQVACIkCQACFBMAIAYzAAIUEwAiBhUAIgYVACIGFQAiFBUAIgYOACIUBgAiFAYAIgQOABIUCwASFAsABCQBAAQkAQAEJAEABBQCAAIYCAAiFAIAIhQCAAQECgAcAAgABAQKABYQEgAiBgEABCQEABIkBAAWEBIALBASABIkBAAAFBIALBASAAAUEgAiABQAIgAUACIAFAAiABQAIhQFACIUBQAiFAUAIgQFABIUAgASFAIAFAguABQWGwAUBh8AFAYcAAQYNAAEFhMABAYHAAQGJAASFjgAIgYfABQIFQAUFgIAFAYGABQGAwAkBjMABBYSAAQGBgASBhoAHwAzABIGGgAUFhoAFBYaABQWGgAUBhsABCYJAAQGBgAEBgYABCQBACIGCQAEJAQAFBYBABQWAQAUFgEAFAYCABYCCAAUJAQAFCQEAAQkAAAqAggABCQAABYEEgAUFgEAJAYCAAQGAgAWBBIADwASAAQGAgAABhoADwASAAAGGgAUABoAFAAaABQAGgAUABoABBYBAAQWAQAEFgEABCQBAAQkBAAEJAQAJCgmACQIFgAkJiEAJCYcACQYNwAkJhkAJCYNABQWHAAiCDcABBYXAAYIFQAGJgUABiYFAAYWCwAYAjMAJCYVABQmCQAEFhMADQAzAAQWEwAkCBUAJAgVACQIFQAkFhUAJAgOACQWBgAkFgYAJAYOAAQmCgAEFg4ABiYBAAYmAQAGJgEABhYCAAgCCAAkFgIAJBYCAAYGCgAeAggABgYKAAoAEgAkCAIABiYEAAQmBQAKABIABAgSAAQmBQAAFhIABAgSAAAWEgAkABQAJAAUACQAFAAkABQAJBYFACQWBQAkFgUAJAYFAAQWBQAEFgUAFgouABYYGgAWCB4AFggeAAYaNAAGGBUABggFAAYmJQAUGDUABiYoABYKFQAWGAEAFggFABYIBQAQCzMABhgUAAYIBAAGJiQAGQAzAAYmJAAWGBoAFhgaABYYGgAWCB4ABigJAAYIBQAGCAUABiYBACQICwAGJgQAFhgBABYYAQAWGAEAFggFABgECAAGCAQABggEAAYmAAALAAgABiYAACoAEgAWGAAAFggEAAYIAAAqABIACQASAAYIAAAACCQACQASAAAIJAAWABoAFgAaABYAGgAWABoABhgBAAYYAQAGGAEABiYBAAYmBAAGJgQAJgwsACYKHgAmKC4AJigiACYaNQAmKBUAJigJACYYGQAGCjkAFhgWAAgKFQAIKAUACCgFAAgYEQAcADMAJigUACYoCAAGGBUAJQAzAAYYFQAmGhoAJhoaACYaGgAmGB4AJgoJACYoBQAmKAUAJhgJABYYCwAWGAYACCgBAAgoAQAIKAEACBgBACYKCAAIGAQACBgEAAYYBQAXAAgABhgFABAHEgAmCgQACCgEAAYoBQAQBxIAFQASAAYoBQAAGBQAFQASAAAYFAAmABoAJgAaACYAGgAmABoAJigBACYoAQAmKAEAJggCABYYAgAWGAIAGAwmABgaFgAYCh4AGAoWAAgcNAAIGhMACAoGAAgoJQAmGjcAJgoeABgMFgAYGgYAGAoOABgKBgAqBjMACBoSABgKAwAWChoAEwAzABYKGgAYGhUAGBoVABgaFQAYChUACCoJAAgKBQAICgUACCgBACYKCAAIKAQAGBoFABgaBQAYGgUAGAoFABwCCAAYCgIAGAoCAAgoAAAqCAgACCgAABoIEgAYGgIAKAoCAAgKAQAaCBIADwYSAAgKAQAAChoADwYSAAAKGgAYABQAGAAUABgAFAAYABQACBoBAAgaAQAIGgEACCgBACYKBAAmCgQAKA4oACgMFQAoKiEAKCohACgcNwAoKhcAKCoSACgaIQAIDDkAGBoWAAoMFQAKKgUACioFAAoaEQAeAjMAKCoTABgqDgAIGhUAIwIzAAgaFQAoDBUAKAwVACgMFQAoGhUAKAwOACgaBgAoGgYAKAoOAAgqCgAYGgYACioBAAoqAQAKKgEAChoBABADCAAoGgIAKBoCAAgaBQARAAgACBoFABABEgAoDAEACioEAAgqBQAQARIAEwISAAgqBQAAGhQAEwISAAAaFAAoABQAKAAUACgAFAAoABQAKBoFACgaBQAoGgUAKAoFABgaAgAYGgIAGg4mABocFgAaDB4AGgwWAAoeNAAKHBUACgwGAAoqJQAYHDUAKAwfABoOFgAaHAYAGgwOABoMBgAvAjMAChwUABoMAwAYDBoAEQIzABgMGgAaHBUAGhwVABocFQAaDBUACiwJAAoMBQAKDAUACioBACgMCQAoKgIAGhwFABocBQAaHAUAGgwFAB4ECAAaDAIAGgwCAAoqAAAPCAgACioAAA8AEgAaHAIAKgwFAAoMAQAPABIABQQSAAoMAQAADBoABQQSAAAMGgAaABQAGgAUABoAFAAaABQAChwBAAocAQAKHAEACioBACgqAgAoKgIAKi8uACoOHwAMLCUAKiwfACouNAAqLBUAKiwGACocGQAKDjMAGhwUAAweEgAMDgIADCwBAAwsCgAdADMAKiwUACosBQAaHBQAJQYzABocFAAqHhoAKh4aACoeGgAqHB4AKg4JACosBQAqLAUAKhwJAAosCQAaHAQADCwAAAwsAAAMLAAADBwAAC0ACAAMHAQADBwEABocBAAbCAgAGhwEAC0CEgAMDgIADCwBABosAQAtAhIAGQgSABosAQAAHBQAGQgSAAAcFAAqABoAKgAaACoAGgAqABoAKiwBACosAQAqLAEAKgwFABocAAAaHAAAHC8mABweFgAcDiEAHA4ZAAwfNwAMHhcADA4SAAwOIQAqHjcAKg4VABwvFgAcHgYALA4OABwOCQAuCjMADB4TABwOBgAaDhUAFwgzABoOFQAcHhUAHB4VABweFQAcDhUADC4OAAwODgAMDg4ADCwGACoOCgAMLAYAHB4FABweBQAcHgUAHA4FAB0CCAAcDgIAHA4CAAwsAgAjBggADCwCAAgHEgAcHgIALA4FAAwOBQAIBxIAIQYSAAwOBQAADhQAIQYSAAAOFAAcABQAHAAUABwAFAAcABQADB4FAAweBQAMHgUADCwFACoOAQAqDgEALA8uACwvGwAOLiUALC4fACwfNQAsLhUALC4GACweGQAqLzcAHB4WAA4fFAAOLwgADi4BAA4uCgAmAzMALC4UACwuBQAMHhUAIwgzAAweFQAsHxoALB8aACwfGgAsHh4ALC8LACwuBQAsLgUALB4JAAwuCQAcHgYADi4AAA4uAAAOLgAADh4AACsCCAAOHgQADh4EAAweBQAVCAgADB4FACkAEgAsLwEADi4BABwuAQApABIAEwgSABwuAQAAHhQAEwgSAAAeFAAsABoALAAaACwAGgAsABoALC4BACwuAQAsLgEALA4FABweAgAcHgIAHi0mAB4fFQAeLxgAHi8YAA4dNwAOHxYADi8IAA4uNwAcHzUALC8pAB4tFgAeHwUAHi8IAB4vCAApAjMADh8SAA4vBAAMLyUAEQgzAAwvJQAeHxQAHh8UAB4fFAAeLxgADg8OAA4vCAAOLwgADi4GACwvCQAOLgYAHh8EAB4fBAAeHwQAHi8IACYBCAAOLwQADi8EAA4uAgArHAgADi4CAAkAEgAeHwEALi8BAA4vAAAJABIAAAkSAA4vAAAALyQAAAkSAAAvJAAeABQAHgAUAB4AFAAeABQADh8EAA4fBAAOHwQADi4FAA4uBQAOLgUALis2AC4tKQAvDzcALg8sAC4NMwAuDxQALg8IAC4fGAAOLTgAHh8VAC8dFQAvDwYALw8GAC8fEQAXADMALg8UAC4PCAAeHxQAEgkzAB4fFAAuDSUALg0lAC4NJQAuDygALi0IAC4PBAAuDwQALh8IAA4PDgAeHwUALw8CAC8PAgAvDwIALx8BACcACAAuDwQALg8EAB4fBAAJHAgAHh8EACcCEgAvDwUALw8FAB4PBAAnAhIAIgkSAB4PBAAAHxQAIgkSAAAfFAAuACQALgAkAC4AJAAuACQALg8AAC4PAAAuDwAALi8BAB4fAQAeHwEAHysmAB8dFgAfLRkAHy0WAC8rNQAvHRMALy0GAC8PJQAuHTQALi0bAB8rFgAfHQYAHy0JAB8tBgAJBjMALx0SAC8tBQAeLRoAIAczAB4tGgAfDRUAHw0VAB8NFQAfLRUALw0JAC8tBQAvLQUALw8BAC4tCgAuDwgAHw0FAB8NBQAfDQUAHy0FABcCCAAfDwQAHw8EAC8PAAAUCQgALw8AAC8LEgAfHQIADy0FAC8tAQAvCxIAFgkSAC8tAQAALRoAFgkSAAAtGgAfABQAHwAUAB8AFAAfABQALx0BAC8dAQAvHQEALw8BAC4tAQAuLQEADwsmAA8rFQAPDSEADw0hAA8bNwAPDRcADw0SAA8dIQAvDTsAHx0WAC0bFQAtDQYALQ0GAC0dEQAVAjMADw0TAA8NDgAfHRUAGAkzAB8dFQAPGxUADxsVAA8bFQAPHRUADw0OAA8dBgAPHQYADy0OAC8NCgAfHQYALQ0CAC0NAgAtDQIALR0BACUCCAAPHQIADx0CAB8dBQAiBwgAHx0FACMAEgAPKwEALQ0FAB8NBQAjABIAJAcSAB8NBQAAHRQAJAcSAAAdFAAPABQADwAUAA8AFAAPABQADw0FAA8NBQAPDQUADy0FAB8dAgAfHQIAHSkmAB0bFAAdKxkAHSsZAC0pNQAtGxUALSsGAC0NJQAfGzUADysfAB0pFgAdGwQAHSsJAB0rCQAjAjMALRsUAC0rBQAfKxoAIgUzAB8rGgAdGxQAHRsUAB0bFAAdDRgALQsJAC0rBQAtKwUALQ0BAA8rCQAPDQIAHRsEAB0bBAAdGwQAHQ0IACwBCAAdDQQAHQ0EAC0NAAAaCQgALQ0AAAMAEgAdGwAADSsFAC0rAQADABIAAAMSAC0rAQAAKxoAAAMSAAArGgAdABQAHQAUAB0AFAAdABQALRsBAC0bAQAtGwEALQ0BAA8NAgAPDQIADQkuAA0pHwArCyUADQsfAA0ZNQANCxUADQsGAA0bHgAdCzgAHRsWACsZEgArKQIAKwsBACsbEAARADMADQsUAA0LBQAdGxUAEgMzAB0bFQANGRoADRkaAA0ZGgANGxsADSkJAA0bAwANGwMADRsOAC0LCQAdGwYAKwsAACsLAAArCwAAKxsAAB8FCAANGwIADRsCAB0bBQAOCQgAHRsFAB8DEgArKQIAKwsBAB0LAQAfAxIAIgMSAB0LAQAAGxQAIgMSAAAbFAANABoADQAaAA0AGgANABoADQsBAA0LAQANCwEADSsFAB0bAgAdGwIAGycmABsZFgAbKSEAGykZACsXNwArGRcAKykSACspIQANGTcADSkVABsnFgAbGQYACykOABspCQAbCTMAKxkTABspBgANKRUADgczAA0pFQAbCRUAGwkVABsJFQAbKRUAKwkOACsZDgArGQ4AKwsFAA0pCgArCwUAGwkFABsJBQAbCQUAGykFABECCAAbKQIAGykCACsLAQAQAQgAKwsBACsHEgAbGQIACykFABspBQArBxIAEgESABspBQAAKRQAEgESAAApFAAbABQAGwAUABsAFAAbABQAKwkFACsJBQArCQUAKwsEAA0pAQANKQEACwcuAAsnHgApCSUACwkfAAsXNQALCRUACwkGAAsZHgANJzcAGxkWACkXEgApCQQAKQkBACkZEAARBjMACwkUAAsJBQAbGRUAFAEzABsZFQALFxoACxcaAAsXGgALGRsACycJAAsZAwALGQMACxkOACsJCQAbGQYAKQkAACkJAAApCQAAKRkAAB0DCAALGQIACxkCABsZBQArCQgAGxkFAB0BEgApCQQAKQkBABsJAQAdARIAJAESABsJAQAAGRQAJAESAAAZFAALABoACwAaAAsAGgALABoACwkBAAsJAQALCQEACykCABsZAgAbGQIAGSUmABkXFgAZJxkAGScZACkVNwApFxcAKScJACknLgAbFzUACyceABklFgAZFwYAGScJABknCQAbAzMAKRcTACknBQAbJxoAJwkzABsnGgAZBxUAGQcVABkHFQAZCRgAKQcOACknCAApJwgAKQkFAAsnCAApCQUAGQcFABkHBQAZBwUAGQkIACcLCAAZCQQAGQkEACkJAQAWAQgAKQkBACkFEgAZFwIACScCACknAQApBRIAFwkSACknAQAAJxoAFwkSAAAnGgAZABQAGQAUABkAFAAZABQAKQcFACkHBQApBwUAKQkEACkJBAApCQQAJxU2ACcHKAAnByUACQcpAAkFMwAJBxQACQcFAAkXHgApJTMAGRcaACcVEgAnBwQAJwcBACcHEQALATMACQcUAAkHBQAZFxoABQkzABkXGgAnByQAJwckACcHJAAnFyQACRUKAAkHBAAJBwQACRcFACkHDAAZFwEAJwcAACcHAAAnBwAAJxcAABkFCAAJBwQACQcEABkXAQAKAQgAGRcBABkDEgAnBwQAJwcBABkHAQAZAxIADAESABkHAQAAFxoADAESAAAXGgAJACQACQAkAAkAJAAJACQACQcAAAkHAAAJBwAACRcEABkXAAAZFwAAFxMmABcFFwAXFRwAFyUXACcTNwAnFRkAJyUNACclIQAJFTUACSUWAAcVGwAXBQ4AByUOABclDgAXBTMAJxUVABclBgAJJRUADgEzAAklFQAXBRMAFwUTABcFEwAXJRMAJwUOACcVCQAnFQkAJwcFAAklCwAnBwUAFwUKABcFCgAXBQoABwcKAAkDCAAXJQIAFyUCACcHAQAfAwgAJwcBACUHEgAXBQUAByUFABclBQAlBxIAHgESABclBQAAJRQAHgESAAAlFAAXABIAFwASABcAEgAXABIAJwUFACcFBQAnBQUAJwcEAAklAgAJJQIAByEsAAcjHwAHBSQABwUfAAcTNQAHBRYABwUHAAcVHwAnIzkAFxUbACUTFAAlBQQAJQUBACUFEQAXETMABwUVAAcFBgAXFRoALREzABcVGgAHExoABxMaAAcTGgAHBR4AByMJAAcFBgAHBQYABxUGACcFCQAXFQIAJQUAACUFAAAlBQAAJRUAABcDCAAlFQQAJRUEABcVAQArAwgAFxUBABcBEgAlBQQAJQUBABcFAQAXARIAIQcSABcFAQAAFRoAIQcSAAAVGgAHABoABwAaAAcAGgAHABoABwUCAAcFAgAHBQIAByUCABcVAQAXFQEAFREmABUTFAAVIx8AFSMXACURNwAlExYAJSMNACUjIQAXEzgAByMVAAUTGwAVEwsABSMOABUjDgAVAzMAJRMSABUjBgAHIxUAKwEzAAcjFQAVAxMAFQMTABUDEwAVIxMAJQMOACUjCQAlIwkAJQUFAAcjCgAlBQUAFQMKABUDCgAVAwoABQUKAAMZCAAVIwIAFSMCACUFAQAdAQgAJQUBACMFEgAVEwIABSMFABUjBQAjBRIAGwESABUjBQAAIxQAGwESAAAjFAAVABIAFQASABUAEgAVABIAJRMEACUTBAAlEwQAJQUEAAcjAQAHIwEAIxEsACMhGwAjAxsAIwMjAAUBMwAFAxoABQMBAAUTHgAlITMAFRMaACMREwAjIQIAIwMCACMDCgAFATMABQMaAAUDAQAVExoACQEzABUTGgAjAxsAIwMbACMDGwAjExsABREKAAUDAQAFAwEABRMFACUDDAAVEwEAIwMCACMDAgAjAwIAIxMCABMFCAAFAwEABQMBABUTAQAlAwgAFRMBABMDEgAjIQEAIwMBAAUDAQATAxIAJwESAAUDAQAAExoAJwESAAATGgAjABoAIwAaACMAGgAjABoABQMAAAUDAAAFAwAABRMEABUTAAAVEwAAEwE2ABMBFgATERwAEyEbABMBPQAjER4AEyETACMhHwAFETQABSEUAAMBGAADEQgAAyENAAMhEQARBTMAIxEVABMhCgAFIRMABREzAAUhEwATARIAEwESABMBEgATIRIAExETABMhCgATIQoAEwMOAAUhCwAjAwYAAyEEAAMhBAADIQQAAwMIAAMDCAATIQEAEyEBABMDBQADAwgAEwMFACEhEgATAQQAAyEJABMhCQAhIRIAISESABMhCQAAIRIAISESAAAhEgATABIAEwASABMAEgATABIAIwEJACMBCQAjAQkAEwMKACMDAgAjAwIAIQFMACEBJAAhARsAIQEjACEBVAADARoAAwEBAAMRHgATATgAExEbABEBKwAhAQsAIQECACEBCgABAzMAAwEaAAMBAQATERoAAwEzABMRGgAhARsAIQEbACEBGwAhERoAAwEQAAMBAQADAQEAAxEFACMBDAATEQIAIQECACEBAgAhAQIAIREBABEDCAADAQEAAwEBABMRAQAjAQgAExEBABEBEgARAQoAIQEBABMBAAARARIAIQESABMBAAAAERoAIQESAAARGgAhABoAIQAaACEAGgAhABoAAwEAAAMBAAADAQAAAxEEABMRAQATEQEAEQEkABEBHAARARsAEQETABEBHAARAQwAEQELABEBCgAhARQAIQECAAEBBAABAQQAAQEEAAEBBAABEQMAEQEDABEBAgARAQEAEQEDABEBAQARARsAEQEbABEBGwARARMAEQETABEBCwARAQsAEQEKACEBCwAhAQIAAQEEAAEBBAABAQQAAQEEAAERAgARAQIAEQECABEBAQARAQIAEQEBAAEBAAABAQAAAQEAAAEBAAABAQAAAQEAAAEBAAAAAQAAAQEAAAABAAARABIAEQASABEAEgARABIAEQEKABEBCgARAQoAEQEKACEBAgAhAQIAAARKAAASCgAAAgEAAAIaAAAimgAAAmMAACAxAAAgeQAAIKIAACCCAAAESgAAEgoAAAIBAAACGgAgAJkAAAJjAAAgMQAAIHkAACCZAAAgeQAAAgAAAAIAAAACAAAAEAQAACANAAAQBQAAEAUAABAJAAAQDgAAEAoAAAIAAAACAAAAAgAAABAEABAADQAAEAUAABAFAAAQCQAgAA0AABAJACAgSAAAEgoAAAIBAAACGgAgIEgAICBIAAACGgAAIEgAICBIAAAgSABB8cUBC9Y7JlEAABQKABAiIgAAEhoAACTzAAAiYwAAEhoAAAKLAAASFwEAAqQAEAZMABAE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CgAvLRUALi0RAAoB8wAODUkAHi0GAAwPSgAECfMADA9KAB4LUAAeC1AAHgtQAB4tUQAOCzgADh0JAA4dCQAOHwYADC04ACwfBQAuKwkALisJAC4rCQAuDwoAJwAyAB4tAgAeLQIALB8BAAkcMgAsHwEACQZIAC4rAQAvLQUADi0FAAkGSAAgB0gADi0FAAAPSgAgB0gAAA9KAB4AUAAeAFAAHgBQAB4AUAAODQUADg0FAA4NBQAOHwUALB8EACwfBAAvCZoALxtRAC8NagAvDWEALgn0AC4rTwAuDQYALi15AAwb+AAsHVQAHxlLAB8bBgAfDQYAHx0eABUA8wAuK04ALg0FAAwdSwASB/MADB1LAC8LUAAvC1AALwtQAC8dUAAuCzMALg0FAC4NBQAuDwsAHA02AA4tBgAfKwEAHysBAB8rAQAfHQUAFwIyAC4NBAAuDQQADi0FABQJMgAOLQUAFQJIAC8bAQAPDQUAHg0BABUCSAAYCUgAHg0BAAAdSgAYCUgAAB1KAC8AUAAvAFAALwBQAC8AUAAuDQEALg0BAC4NAQAuDwIADi0CAA4tAgAfB5IAHylTAB8bfgAfK08ALxfzAC8LTgAvKwUALw1uAA4L9wAeDU8ADwlLAA8LAgAPGxUADysOAA4D8wAvC04ALysFAA4NSgAgBfMADg1KAB8JSwAfCUsAHwlLAB8rSwAvGTQALysBAC8rAQAvHQUADis4AC4dBQAPCwEADwsBAA8LAQAPDQEAJQIyAC8rAQAvKwEALh0BACIHMgAuHQEAIwJIAA8LAQAtKwUALysEACMCSAAiBUgALysEAAANSgAiBUgAAA1KAB8ASgAfAEoAHwBKAB8ASgAvGwEALxsBAC8bAQAvLQEALh0EAC4dBAAtB5gALRlRAC0LagAtC2EADxf9AB8ZWgAfCw8AHyt6AA4Z9wAuG1kAHSdJAB0ZBgAdCwYAHRsaAC4D8wAvGUwAHwsGAA4bUAAQA/MADhtQAC0JUAAtCVAALQlQAC0bUQAPGTsADxsKAA8bCgAfDRIAHgs2AC4rCQAdKQEAHSkBAB0pAQAdKwIALAEyAA8bAQAPGwEALisFABoJMgAuKwUALgFIAC0ZAQANCwUAHwsCAC4BSAAaB0gAHwsCAAAbUAAaB0gAABtQAC0AUAAtAFAALQBQAC0AUAAPGwkADxsJAA8bCQAfDQkALw0FAC8NBQAdBZoAHSdZAA0ZegAdKVkALRX1AC0JSgAtKQ8ALQtqAC8J9wAfC1UADSVMAA0JCQArGRIADSkRAAEA8wAtCUkAHSkKAC8LUAAAAfMALwtQAB0HUAAdB1AAHQdQAB0pUAAtFzMALSkGAC0pBgAtGwYAHyk2AB8bBgANCQUADQkFAA0JBQANCwUAHwUyAB0pAQAdKQEADxsBAA4JMgAPGwEAGwlIAA0JBQArGQkAHSkJABsJSAAOB0gAHSkJAAALUAAOB0gAAAtQAB0AUAAdAFAAHQBQAB0AUAAtGQEALRkBAC0ZAQAtGwUAHwsFAB8LBQArBZQAKxdPACsJbgArCVMADRX4AA0nVQANCQkAHRl+AC8X+AAPGVMAGxVLABsXBgAbCQUAGwkaAA8B8wAdF0oADQkFAB8ZSwAJC/MAHxlLACsHSgArB0oAKwdKACsZSgANBzgADQkJAA0JCQANCxUADwk4AA8pBgAbJwEAGycBABsnAQAbGQUAEQIyACsZBAArGQQADykCABABMgAPKQIAEQZIABsXBQALCQEAHQkAABEGSAAUAUgAHQkAAAAZSgAUAUgAABlKACsASgArAEoAKwBKACsASgANCQUADQkFAA0JBQANCwUADykFAA8pBQAbA5IAGyVTABsXdwAbJ08AKxP0ACsHTwArJwoAKwlqAA8H9QAdCVUACyNMAAsHCQApJw4ACycRABsF8wANB04AGycJAC0JUAAGAfMALQlQABsFSwAbBUsAGwVLABsnSwArFTMAKycGACsnBgArGQYALSc1AB0ZBgALBwUACwcFAAsHBQALCQUAHQMyABsnBQAbJwUADRkBACsJMgANGQEAGwNIACkHBAApJwUAGycFABsDSAAnCUgAGycFAAAJUAAnCUgAAAlQABsASgAbAEoAGwBKABsASgArFwEAKxcBACsXAQArGQUAHQkFAB0JBQApA5QAKRVPACkHbwApB1sACxP4AAslVQALBwoAGyd6AC0V+AANF1MAGRNLABkVBgAZBwYAGRceABEK8wAbFVEACwcGAB0XSwAYAfMAHRdLACkFSgApBUoAKQVKACkXSgALBTgACwcJAAsHCQALCRUAHQc2AA0nBQAZJQEAGSUBABklAQAZJwIAJwsyACkXBAApFwQADScEABYBMgANJwQAJwdIABkVBQAJBwUAGwcCACcHSAAaAUgAGwcCAAAXSgAaAUgAABdKACkASgApAEoAKQBKACkASgALBwUACwcFAAsHBQALCQUADScBAA0nAQAZAZoACSNbAAkVbgAZJVkAKQH3ACkFTQApFQ0AKQdtACsF9wAbB1UAJxNRAAkjCgAnFQ0ACSUWACkB8wApBUkAKRUJACsHUAAvA/MAKwdQABkDUAAZA1AAGQNQABklUAApAzgAKRUJACkVCQApFwkAGyU2AAsXCQAnFQkAJxUJACcVCQAJBwoAGQUyABklAQAZJQEACxcFAAoBMgALFwUAFwVIAAkjAQAnFQQACxUEABcFSAAOAUgACxUEAAAHUAAOAUgAAAdQABkAUAAZAFAAGQBQABkAUAApBQUAKQUFACkFBQApFwUAGwcFABsHBQAnAZQAJwNPACcFbgAnBVMACQH0AAkjTwAJBQUACRV6ACsT+AALFU0AFxFIABcTAgAXBQQAFwUZAAkB8wAZE0oACQUEABsVSQAuAfMAGxVJACcDSwAnA0sAJwNLACcVSwAJAzMACQUFAAkFBQAJBxIACwU1ACklAgAXEwEAFxMBABcTAQAXFQEACQMyAAkFBAAJBQQAKSUBAB8DMgApJQEAFxFIABcTAgAHBQQAGQUAABcRSAAtEUgAGQUAAAAVSAAtEUgAABVIACcASgAnAEoAJwBKACcASgAJBQEACQUBAAkFAQAJBwIAKSUBACklAQAHAbgAFxFdAAcTegAXI1kAFwEEAScDSgAnIw8AJwVqACkD9wAZBVUAJRFRAAchBQAlExMAByMRABMJ8wAnA0kAFyMKACkFUAAtAfMAKQVQABcBUAAXAVAAFwFQABcjUAAnETMAJyMGACcjBgAnFQYAGSM2AAkVCQAHIQQAByEEAAchBAAHBQUAFwMyABcjAQAXIwEACRUFACsDMgAJFQUAFQNIAAchAQAlEwoAFyMJABUDSAArAUgAFyMJAAAFUAArAUgAAAVQABcAUAAXAFAAFwBQABcAUAAnEwEAJxMBACcTAQAnFQIAGQUFABkFBQAVAeoAJQFPACUDbgAlA1oAJQEsAQchUgAHAwkAFxOLACkR+AAJE1MAFQFaABURAgAVAwQAFQMZABUR8wAXEUoABwMFABkTSwARFfMAGRNLACUBSwAlAUsAJQFLACUTSgAHATgABxMGAAcTBgAHBRUACQM1AAkjBgAVEQEAFREBABURAQAVEwQAAxkyAAcTAgAHEwIACSMCAB0BMgAJIwIAESdIABURAgAFAwQAFwMAABEnSAAnEUgAFwMAAAATSgAnEUgAABNKACUASgAlAEoAJQBKACUASgAHAwUABwMFAAcDBQAHBQUACSMFAAkjBQAFASIBBQFnAAURbgAVIWoABQFZASUBTgAlEQ0AJQN3ACcB+AAXA1sAIwF+ACMBBgAjEQgABSEdACMB8wAlAUoAJREJAAkhUQABI/MACSFRAAUBXgAFAV4ABQFeABUhWgAVAT0AJREJACURCQAlEwkAFyE1AAcTCAAjEQQAIxEEACMRBAAjAwQAEwUyABUhAAAVIQAABxMEACUDMgAHEwQAEQVIACMBAgAjEQQABxEEABEFSAAFEUgABxEEAAAhUAAFEUgAACFQAAUAWgAFAFoABQBaAAUAWgAlAQQAJQEEACUBBAAlEwUAFwMBABcDAQATAV0BIwG5ACMBeQAjAVEAEwGOAQUBZgAFAQIAFRF6ACUBDgEHEUIAAwF+ABMBLQATAQkAEwEZACEh3QAjAVIABQEBABcRPQAhId0AFxE9ACMBeQAjAXkAIwF5ACMRSQAjAV4ABQECAAUBAgAFIREABwE1ACUhAQATAQkAEwEJABMBCQATEQEAAwMyAAUBAQAFAQEAJSEAAAMDMgAlIQAAAQM9ACEBGQADAQEABQEBAAEDPQADAT0ABQEBAAARPQADAT0AABE9ACMASAAjAEgAIwBIACMASAAFAQEABQEBAAUBAQAFAwEAJSEBACUhAQADAe8AAwGkAAMBiwATAVkAAwHvABMBPgATARoAIxEiACMBowAVAQoAIQFFACEBHQAhARQAIQEEAAEDXQADASYAEwEKABUBCgADAV0AFQEKAAMBiwADAYsAAwGLABMBWQATAYoAEwEaABMBGgAjEQkABQFKAAURCAAhARQAIQEUACEBFAAhAQQAEQMyABMBCgATAQoABREEACMBMgAFEQQAAREFABEBAQARAQAAIQEAAAERBQARAQUAIQEAAAABCQARAQUAAAEJABMAUAATAFAAEwBQABMAUAATAREAEwERABMBEQAjEQUAFQEBABUBAQARAaIAIQGCACEBeQAhAVEAIQGKACEBOgAhATEAAwEBABMBUgATAQoAEQESABEBCgARAQkAEQEBAAEREgARAQYAEQEFAAMBAAARARIAAwEAACEBeQAhAXkAIQF5ACEBUQAhAVkAIQExACEBMQADAQEAEwEuABMBCgARAQkAEQEJABEBCQARAQEAEQENABEBBQARAQUAAwEAACEBDQADAQAAAQEAAAEBAAABAQAAAQEAAAEBAAABAQAAAQEAAAABAAABAQAAAAEAACEASAAhAEgAIQBIACEASAADARoAAwEaAAMBGgADAQEAEwEKABMBCgAAJsgAABQZAAAiBQAAIlUAABS6AQAiCgEAEn0AAAI+AQAS4gEAAlcBACbIAAAUGQAAIgUAACJVABAEuQEAIgoBABJ9AAACPgEEELkBAAI+AQAEAQAABAEAAAQBAAACAQAAAikAACANAAAgDQAAEBkAABAuAAAQGgAABAEAAAQBAAAEAQAAAgEAAAIpAAAgDQAAIA0AABAZAAIAKQAAEBkAEgLIAAAUGQAAIgUAACJVABICyAAmAMgAACJVAAAS0AAmAMgAABLQAEHxgQILxgEKygAAFgEAABQaAAAEKQAAFrECABRgAQAEjQAAEtQBACLuAgAS+AEACsoAABYBAAAUGgAABCkAIgCuAgAUYAEABI0AABLUAQAirgIAEtQBABYAAAAWAAAAFgAAACIBAAAikQAAEi0AABItAAAgVQAAIJ4AACBeAAAWAAAAFgAAABYAAAAiAQAQApEAABItAAASLQAAIFUAIgCRAAAgVQAUEMgAABYBABAUBQAABCkAFBDIABAUyAAABCkAACLIABAUyAAAIsgAQeCDAgvoORAM5QAQCB4AEAZKABAkOgAACtMCAAYaAQAkRQAABJ4BABRkAwAiAQIQDMwAEAgFACAGHQAQJCEABALTAgAGGgEAJEUAAASeAQoA0wIABJ4BEAgeABAIHgAQCB4AEAQhAAAGpAAABBkAAAQZAAASQQAAEs4AABJlABAIBQAQCAUAEAgFABAECAACAqIAAAQZAAAEGQAAEkEAAgKiAAASQQASCMgAEAgBAAIkBQAAJBQAEgjIACwAyAAAJBQAAATaACwAyAAABNoAEAAdABAAHQAQAB0AEAAdAAASAQAAEgEAABIBAAAgAAAAIAkAACAJABAeRwEgKIsAIBbKABAGlwAAHNQCAAjsAAAWDgAAFF4BAAa8AwAU7gECDMsAAhgCAAIWGwACBioAJALTAgAI7AAAFg4AABReARQE0wIAFF4BECp9ABAqfQAQKn0AEAZ+AAAYpAAABgEAAAYBAAAEJQAABBgBACJtAAIYAQACGAEAAhgBAAIkAgASBKIAAAYBAAAGAQAABCUAJAKiAAAEJQAIAMgAAhgBABIWBQAAFgoACADIAC8AyAAAFgoAACTIAC8AyAAAJMgAEAB9ABAAfQAQAH0AEAB9AAAGAAAABgAAAAYAAAASAQAAEiUAABIlAAIumgECGtoAAgg9AQIm4gAQHtUCECjZABAmDwAABjgBACbcAwAGoQEiHNEAEhoNACIIGwASJiIACADTAgAoywAQJg4AAAYoAS8A0wIABigBAgzQAAIM0AACDNAAAhbRABAqowAQJgYAECYGABAUGgAABh0BABRRABIaCQASGgkAEhoJACIGCgACGKIAIBYFACAWBQAAFBEAHACiAAAUEQAYAsgAEhoEAAQICQAACAoAGALIAA0AyAAACAoAABbQAA0AyAAAFtAAAgDQAAIA0AACANAAAgDQABAIAQAQCAEAEAgBABAEAgAABC0AAAQtABIPkgESDN4AIhhLARIY2gAgL9UCIBrUACAYBQAgJkQBABh0AwAmLAEEHsgABBoFAAQYJAAECCkAKADTAhAaywAgGAQAACb7AC4C0wIAJvsAEg7LABIOywASDssAEgjKACAcowAgGAUAIBgFACAGFQAAJtsAAAYNAAQaAQAEGgEABBoBAAQmAAAWAqIAAggBAAIIAQAABgQAKgKiAAAGBAAQC8gAIioEABQYBAAgGAAAEAvIABkAyAAgGAAAACbKABkAyAAAJsoAEgDKABIAygASAMoAEgDKACAoAQAgKAEAICgBACAkAQAABgkAAAYJAAQPmAEEHN0ABAo9AQQo3QASH9UCEirZABIoBgACCDsBABoUAwAI5AAUL8wAFAwGACQKGwAUKCEACgLTAiAMywASKAUAAAjjAC0C0wIACOMABA7QAAQO0AAEDtAABBjRABIsowASKAIAEigCABIWGgAAGLMAACYDABQMBQAUDAUAFAwFABQYBQAIAqIAEigBABIoAQAAJgIAHgKiAAAmAgAaBMgAFAwCAAYoBQASKAQAGgTIAAcAyAASKAQAABjQAAcAyAAAGNAABADQAAQA0AAEANAABADQABIKAQASCgEAEgoBABIGAgAAJgIAACYCABQNkgEUDtwAJBpLARQa2AAiLdUCIgzVACIaBQAiGFEBAAzkAhAo2AAGH8oABhwBAAYaJAAGCikAKgLTAhIcyAAiGgQAACjRACwG0wIAKNEAFC7IABQuyAAULsgAFArJACIeowAiGgUAIhoFACIIEgAAGqQAIAgCAAYcAAAGHAAABhwAAAYoAQAYBKIABAoBAAQKAQACCAIACwCiAAIIAgAOAMgABhwBABYaBAAiGgAADgDIAAgKyAAiGgAAACjIAAgKyAAAKMgAFADIABQAyAAUAMgAFADIACIqAQAiKgEAIioBACImAQAgCAEAIAgBAAYNlAEGHtsABgxHAQYq1wAUHdUCFCzZABQMCQAECkEBAA7TAiAa3gAmD84AJg4IACYMGAAWKiIADgDTAgQOywAUDAgAABrLAAgK0wIAGssABi/KAAYvygAGL8oABhrOABQuowAUDAUAFAwFABQYHgAgKqQAAigGACYsBAAmLAQAJiwEACYKBQAmCqIAFAwEABQMBAACKAIAFwCiAAIoAgAeAsgAJg4EAAgMBAAEDAQAHgLIACMCyAAEDAQAABrKACMCyAAAGsoABgDKAAYAygAGAMoABgDKABQMAQAUDAEAFAwBABQIAgACCgQAAgoEABYLkgEWL+MAJixBARYc2gAkG9cCJB7XACQcDQAkKkcBIB7VAhIq1AAIHcgACB4EABgcHQAIDC0AAAHTAhQeywAGHAUAICrKAAEA0wIgKsoAFg/KABYPygAWD8oAFgzKACQPqAAkHA0AJBwNACQKEQACHKMAIgoJAAgeAAAIHgAACB4AAAgqAAAcAqIABgwFAAYMBQAECgQAKgiiAAQKBAAvAsgACB4EABgcBAAkHAAALwLIABECyAAkHAAAACrKABECyAAAKsoAFgDKABYAygAWAMoAFgDKACQOBQAkDgUAJA4FACQoBAAiGgIAIhoCAAgLmAEIH90ACA44AQgs4gAWG9QCFi7ZABYsDAAGDEEBAi/YAiIc6gAoHdEAGC8KACgOFgAYLCIAEgPTAiQvywAWLAsAIBzQAC0I0wIgHNAACA/RAAgP0QAID9EACBzRABYPpQAWLAMAFiwDABYaHgAiLKQABCoGACgeCgAoHgoAKB4KACgMCgAQA6IAFiwCABYsAgAEKgIAEQCiAAQqAgAPAsgAGC8BAAoOBAAGDgUADwLIACEEyAAGDgUAABzQACEEyAAAHNAACADQAAgA0AAIANAACADQABYOAQAWDgEAFg4BABYKAgAEDAQABAwEABgJkgEYLeMAKC5EARge2gAmGdcCJi/VACYeDQAmHEUBIh/XAhQs2gAKG8oACh8BABoeHQAKDi0ABAPTAhYfyAAIHggAIizKAAME0wIiLMoAGA3KABgNygAYDcoAGA7KACYNqAAmHg0AJh4NACYMEQAEHqMAJAwJAAofAAAKHwAACh8AAAosAAAeBKIACA4EAAgOBAAGDAQADwiiAAYMBAArAMgACh8BABoeBAAmHgAAKwDIABMGyAAmHgAAACzKABMGyAAALMoAGADKABgAygAYAMoAGADKACYuBQAmLgUAJi4FACYqBAAUHAQAFBwEAAoJlAEKHdsAGi9KAQou3gAYCdMCGA/RABgvEgAIDkQBBC3TAiQe3gAqC84AKg8IACovFgAaLikAKwDTAggPygAYLxIABB7KABMG0wIEHsoACivKAAorygAKK8oACh7OABgNogAYLggAGC4IABgsGQAUL6gAFiwEACoPBAAqDwQAKg8EACoOCAAtAKIAKC4EACguBAAWLAAAGwiiABYsAAAmA8gAKg8EAAwvCQAILwoAJgPIACMIyAAILwoAAB7KACMIyAAAHsoACgDKAAoAygAKAMoACgDKABgvAAAYLwAAGC8AABgMBAAWLAQAFiwEABoHmAEqDewAKg9MARof4AAoF9cCKC3VACgfCAAoLjgBJB3VAhYu2gAMGckADA0GABwfHQAMLyoACwDTAhgdywAoHwQABi7RAAUI0wIGLtEAGinQABop0AAaKdAAGi/QACgLqAAoHwgAKB8IACgOFgAGH6MAJh4KAAwNAgAMDQIADA0CAAwuAgAdAqIACi8CAAovAgAWHgkAIwaiABYeCQApAsgAKg0EACwfAQAoHwAAKQLIABEIyAAoHwAAAC7QABEIyAAALtAAGgDQABoA0AAaANAAGgDQACgPBAAoDwQAKA8EACgsBQAmHgEAJh4BAAwHlAEMG9QADC1MAQwP1wAaF9QCGg3YABoPCAAaLz4BBivTAggv4wAsCc4ALA0IACwtFgAcDyYAGAPTAgoNygAaDwgABh/RAAMY0wIGH9EADCnKAAwpygAMKcoADB/LABoLogAaDwQAGg8EABouGQAm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BQAcvgEACggAAAieAhsA6gUACJ4CAh+RAQIfkQECH5EBAhiUAQAuVAEACgQAAAoEAAAGNAAAFqUCAAYVASIOAgAiDgIAIg4CACIIBQAWAlIBAAoEAAAKBAAABjQAKgJSAQAGNAAcAKUBIg4FACQKBQAACgQAHAClAQcApQEACgQAABipAQcApQEAGKkBAgCQAQIAkAECAJABAgCQAQAaAAAAGgAAABoAAAAkAQAABJUAAASVABIJSgMSL84BIgyVAhIawgEQGfEFEA65ARAqDwAQGI0CABruBwAYcgMUDakBFB4JABQqNgAEGk0AGgLqBQAOpgEQKgsAABhyAiYI6gUAGHICEi2lARItpQESLaUBEgqmARAPWAEQKg4AECoOABAmJgAAGFoCACaiABQOBAAUDgQAFA4EABQoBQAIAlIBIBoCACAaAgAAJhIAHgJSAQAmEgAOAKUBBB4FAAYqAQAAKgEADgClARMApQEAKgEAACilARMApQEAKKUBEgClARIApQESAKUBEgClARAMBQAQDAUAEAwFABAGCAAABlAAAAZQAAQJVgMEH8oBBByiAiIMxQECGesFIB69AQIMCQAgCpECABw6BwAKmgIkG6YBJC4GAAYcMAAkDFYAEAfqBRAupQECDAgAAAohAhUA6gUACiECIg2xASINsQEiDbEBIiqxAQIPUwECDAUAAgwFACAIMgAACt0BAAg+ACQuAgAkLgIAJC4CACQKBQAYBFIBAgwEAAIMBAAAGAkACwBSAQAYCQAAAaUBJC4FACYMBQACDAQAAAGlAQEApQECDAQAABqpAQEApQEAGqkBBACxAQQAsQEEALEBBACxAQIcAQACHAEAAhwBAAImAgAACCUAAAglABQHSgMULccBJA6PAhQcwgEiCfMFEi/CASIsDQASKpMCAA7DBgAqHgIWC6YBFi8FABYsMgAGHFYAHgDqBQIvpQEiLAQAACr6ASEA6gUAKvoBFCulARQrpQEUK6UBFAypARINWwEiHAsAIhwLABIoKwAADIUBAAoJABYvAQAWLwEAFi8BABYqAQAmClIBIhwCACIcAgAACgUAFwBSAQAKBQACAaUBFi8EAAgsAAASLAAAAgGlAQECpQESLAAAACqpAQECpQEAKqkBFAClARQApQEUAKUBFAClARIeCQASHgkAEh4JACIICgAACgUAAAoF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AAIkAAADCAAAAgEAAAIBAAABBQAAAR4AAAEJAAECBAABAgQAAQIEAAEBCAABAQgAAAIBAAACAQAAAQUAAwAIAAABBQACARIAAAMEAAECAAAAAgAAAgESAAUAEgAAAgAAAAIkAAUAEgAAAiQAAAAkAAAAJAAAACQAAAAkAAACAQAAAgEAAAIBAAABAQAAAQUAAAEFAAEGNgABBCgAAQM9AAEDJAABBTMAAQMlAAEDAQABAzQAAANIAAADKAACBBYAAgMNAAIDBAACAw0AAQUzAAAEHQABAwEAAAMoAAcAMwAAAygAAQUlAAEFJQABBSUAAQMkAAEECAABAwEAAQMBAAECBQAAAwgAAQIJAAIDBAACAwQAAgMEAAICCAADAAgAAQMBAAEDAQABAgUABgAIAAECBQADAhIAAQQEAAIDAAABAwAAAwISAAYBEgABAwAAAAMkAAYBEgAAAyQAAQAkAAEAJAABACQAAQAkAAEDAQABAwEAAQMBAAECAQAAAwQAAAMEAAIHNgACBSgAAgQ+AAIEJgACBjMAAgQbAAIEAwACA0UAAAU8AAEENgADBRYAAwQJAAMEBgADBBUABQAzAAIEGwACBAMAAAQyAAoAMwAABDIAAgYlAAIGJQACBiUAAgQlAAIFCAACBAIAAgQCAAIDBQABBAgAAgMJAAMEBQADBAUAAwQFAAMDCAAEAQgAAgQCAAIEAgACAwUACQAIAAIDBQADBRIAAgUEAAMEAgACBAIAAwUSAAcCEgACBAIAAAQyAAcCEgAABDIAAgAkAAIAJAACACQAAgAkAAIEAQACBAEAAgQBAAIDAQABBAQAAQQEAAMIRAADBjwABAVEAAMFMgADBzUAAwYcAAMFBQADBTUAAwVEAAIFJgAEBhYABAUNAAQFBAAEBQ0ABgE0AAMGGwADBQQAAQUlAA0ANAABBSUAAwcyAAMHMgADBzIAAwUyAAMGCwADBQUAAwUFAAMEBgACBQsAAwQJAAQFBAAEBQQABAUEAAQECAAEBAgAAwUEAAMFBAADBAUADAAIAAMEBQAHABIABAUJAAQFAAADBQAABwASAA4AEgADBQAAAAUkAA4AEgAABSQAAwAyAAMAMgADADIAAwAyAAMGAgADBgIAAwYCAAMEAgACBQIAAgUCAAQJNgAEBygABAY9AAQGJAAECDMABAYlAAQGAQAEBjQAAgdEAAMGJgAFBxYABQYNAAUGBAAFBg0ACAAzAAUGIgAEBgEAAgYlABAAMwACBiUABAglAAQIJQAECCUABAYkAAQHCAAEBgEABAYBAAQFBQADBgsABAUJAAUGBAAFBgQABQYEAAUFCAAFBQgABAYBAAQGAQAEBQUADwAIAAQFBQAIARIABAcEAAUGAAAEBgAACAESABEAEgAEBgAAAAYkABEAEgAABiQABAAkAAQAJAAEACQABAAkAAQGAQAEBgEABAYBAAQFAQADBgIAAwYCAAUKNgAFCCgABQc9AAUHJAAFCTMABQclAAUHAQAFBzQAAwg8AAQHKAAGCBYABgcNAAYHBAAGBw0ACQEzAAQIHQAFBwEAAwclABMAMwADByUABQklAAUJJQAFCSUABQckAAUICAAFBwEABQcBAAUGBQAEBwgABQYJAAYHBAAGBwQABgcEAAYGCAAJAAgABQcBAAUHAQAFBgUAEgAIAAUGBQAKABIABQgEAAYHAAAFBwAACgASABIBEgAFBwAAAAckABIBEgAAByQABQAkAAUAJAAFACQABQAkAAUHAQAFBwEABQcBAAUGAQAEBwQABAcEAAYLNgAGCSgABgg+AAYIJgAGCjMABggbAAYIAwAGB0UABAk8AAUINgAHCRYABwgJAAcIBgAHCBUACwAzAAYIGwAGCAMABAgyABYAMwAECDIABgolAAYKJQAGCiUABgglAAYJCAAGCAIABggCAAYHBQAFCAgABgcJAAcIBQAHCAUABwgFAAcHCAAKAQgABggCAAYIAgAGBwUAFQAIAAYHBQALARIABgkEAAcIAgAGCAIACwESABMCEgAGCAIAAAgyABMCEgAACDIABgAkAAYAJAAGACQABgAkAAYIAQAGCAEABggBAAYHAQAFCAQABQgEAAcMRAAHCjwACAlEAAcJMgAHCzUABwocAAcJBQAHCTUABwlEAAYJJgAIChYACAkNAAgJBAAICQ0ADAE0AAcKGwAHCQQABQklABkANAAFCSUABwsyAAcLMgAHCzIABwkyAAcKCwAHCQUABwkFAAcIBgAGCQsABwgJAAgJBAAICQQACAkEAAgICAAMAAgABwkEAAcJBAAHCAUAGAAIAAcIBQANABIACAkJAAgJAAAHCQAADQASABoAEgAHCQAAAAkkABoAEgAACSQABwAyAAcAMgAHADIABwAyAAcKAgAHCgIABwoCAAcIAgAGCQIABgkCAAgNNgAICygACAo9AAgKJAAIDDMACAolAAgKAQAICjQABgtEAAcKJgAJCxYACQoNAAkKBAAJCg0ADAQzAAkKIgAICgEABgolABwAMwAGCiUACAwlAAgMJQAIDCUACAokAAgLCAAICgEACAoBAAgJBQAHCgsACAkJAAkKBAAJCgQACQoEAAkJCAANAQgACAoBAAgKAQAICQUAGwAIAAgJBQAOARIACAsEAAkKAAAICgAADgESAB0AEgAICgAAAAokAB0AEgAACiQACAAkAAgAJAAIACQACAAkAAgKAQAICgEACAoBAAgJAQAHCgIABwoCAAkONgAJDCgACQs9AAkLJAAJDTMACQslAAkLAQAJCzQABww8AAgLKAAKDBYACgsNAAoLBAAKCw0ADQUzAAgMHQAJCwEABwslAB8AMwAHCyUACQ0lAAkNJQAJDSUACQskAAkMCAAJCwEACQsBAAkKBQAICwgACQoJAAoLBAAKCwQACgsEAAoKCAAPAAgACQsBAAkLAQAJCgUAHgAIAAkKBQAPAhIACQwEAAoLAAAJCwAADwISAB4BEgAJCwAAAAskAB4BEgAACyQACQAkAAkAJAAJACQACQAkAAkLAQAJCwEACQsBAAkKAQAICwQACAsEAAoPNgAKDSgACgw+AAoMJgAKDjMACgwbAAoMAwAKC0UACA08AAkMNgALDRYACwwJAAsMBgALDBUAEQAzAAoMGwAKDAMACAwyAB4CMwAIDDIACg4lAAoOJQAKDiUACgwlAAoNCAAKDAIACgwCAAoLBQAJDAgACgsJAAsMBQALDAUACwwFAAsLCAAQAQgACgwCAAoMAgAKCwUAHwEIAAoLBQAPBRIACg0EAAsMAgAKDAIADwUSAB8CEgAKDAIAAAwyAB8CEgAADDIACgAkAAoAJAAKACQACgAkAAoMAQAKDAEACgwBAAoLAQAJDAQACQwEAAsQRAALDjwADA1EAAsNMgALDzUACw4cAAsNBQALDTUACw1EAAoNJgAMDhYADA0NAAwNBAAMDQ0AEgE0AAsOGwALDQQACQ0lAB8DNAAJDSUACw8yAAsPMgALDzIACw0yAAsOCwALDQUACw0FAAsMBgAKDQsACwwJAAwNBAAMDQQADA0EAAwMCAAQBAgACw0EAAsNBAALDAUAHAQIAAsMBQATABIADA0JAAwNAAALDQAAEwASAB4EEgALDQAAAA0kAB4EEgAADSQACwAyAAsAMgALADIACwAyAAsOAgALDgIACw4CAAsMAgAKDQIACg0CAAwRNgAMDygADA49AAwOJAAMEDMADA4lAAwOAQAMDjQACg9EAAsOJgANDxYADQ4NAA0OBAANDg0AFAAzAA0OIgAMDgEACg4lABgIMwAKDiUADBAlAAwQJQAMECUADA4kAAwPCAAMDgEADA4BAAwNBQALDgsADA0JAA0OBAANDgQADQ4EAA0NCAARBQgADA4BAAwOAQAMDQUAHwQIAAwNBQAUARIADA8EAA0OAAAMDgAAFAESAB8FEgAMDgAAAA4kAB8FEgAADiQADAAkAAwAJAAMACQADAAkAAwOAQAMDgEADA4BAAwNAQALDgIACw4CAA0SNgANECgADQ89AA0PJAANETMADQ8lAA0PAQANDzQACxA8AAwPKAAOEBYADg8NAA4PBAAODw0AFQEzAAwQHQANDwEACw8lABsIMwALDyUADRElAA0RJQANESUADQ8kAA0QCAANDwEADQ8BAA0OBQAMDwgADQ4JAA4PBAAODwQADg8EAA4OCAAVAAgADQ8BAA0PAQANDgUAHgYIAA0OBQAWABIADRAEAA4PAAANDwAAFgASAB4HEgANDwAAAA8kAB4HEgAADyQADQAkAA0AJAANACQADQAkAA0PAQANDwEADQ8BAA0OAQAMDwQADA8EAA4TNgAOESgADhA+AA4QJgAOEjMADhAbAA4QAwAOD0UADBE8AA0QNgAPERYADxAJAA8QBgAPEBUAFwAzAA4QGwAOEAMADBAyAB4IMwAMEDIADhIlAA4SJQAOEiUADhAlAA4RCAAOEAIADhACAA4PBQANEAgADg8JAA8QBQAPEAUADxAFAA8PCAAWAQgADhACAA4QAgAODwUAHwcIAA4PBQAXARIADhEEAA8QAgAOEAIAFwESABsKEgAOEAIAABAyABsKEgAAEDIADgAkAA4AJAAOACQADgAkAA4QAQAOEAEADhABAA4PAQANEAQADRAEAA8URAAPEjwAEBFEAA8RMgAPEzUADxIcAA8RBQAPETUADxFEAA4RJgAQEhYAEBENABARBAAQEQ0AGAE0AA8SGwAPEQQADRElAB8JNAANESUADxMyAA8TMgAPEzIADxEyAA8SCwAPEQUADxEFAA8QBgAOEQsADxAJABARBAAQEQQAEBEEABAQCAAYAAgADxEEAA8RBAAPEAUAGAwIAA8QBQAZABIAEBEJABARAAAPEQAAGQASAB4KEgAPEQAAABEkAB4KEgAAESQADwAyAA8AMgAPADIADwAyAA8SAgAPEgIADxICAA8QAgAOEQIADhECABAVNgAQEygAEBI9ABASJAAQFDMAEBIlABASAQAQEjQADhNEAA8SJgARExYAERINABESBAAREg0AGAQzABESIgAQEgEADhIlABwMMwAOEiUAEBQlABAUJQAQFCUAEBIkABATCAAQEgEAEBIBABARBQAPEgsAEBEJABESBAAREgQAERIEABERCAAZAQgAEBIBABASAQAQEQUAGwwIABARBQAaARIAEBMEABESAAAQEgAAGgESAB8LEgAQEgAAABIkAB8LEgAAEiQAEAAkABAAJAAQACQAEAAkABASAQAQEgEAEBIBABARAQAPEgIADxICABEWNgARFCgAERM9ABETJAARFTMAERMlABETAQAREzQADxQ8ABATKAASFBYAEhMNABITBAASEw0AGQUzABAUHQAREwEADxMlAB8MMwAPEyUAERUlABEVJQARFSUAERMkABEUCAAREwEAERMBABESBQAQEwgAERIJABITBAASEwQAEhMEABISCAAbAAgAERMBABETAQAREgUAHgwIABESBQAbAhIAERQEABITAAAREwAAGwISAB4NEgAREwAAABMkAB4NEgAAEyQAEQAkABEAJAARACQAEQAkABETAQAREwEAERMBABESAQAQEwQAEBMEABIXNgASFSgAEhQ+ABIUJgASFjMAEhQbABIUAwASE0UAEBU8ABEUNgATFRYAExQJABMUBgATFBUAHQAzABIUGwASFAMAEBQyAB4OMwAQFDIAEhYlABIWJQASFiUAEhQlABIVCAASFAIAEhQCABITBQARFAgAEhMJABMUBQATFAUAExQFABMTCAAcAQgAEhQCABIUAgASEwUAHw0IABITBQAbBRIAEhUEABMUAgASFAIAGwUSAB8OEgASFAIAABQyAB8OEgAAFDIAEgAkABIAJAASACQAEgAkABIUAQASFAEAEhQBABITAQARFAQAERQEABMYRAATFjwAFBVEABMVMgATFzUAExYcABMVBQATFTUAExVEABIVJgAUFhYAFBUNABQVBAAUFQ0AHgE0ABMWGwATFQQAERUlAB8PNAARFSUAExcyABMXMgATFzIAExUyABMWCwATFQUAExUFABMUBgASFQsAExQJABQVBAAUFQQAFBUEABQUCAAcBAgAExUEABMVBAATFAUAHBAIABMUBQAfABIAFBUJABQVAAATFQAAHwASAB4QEgATFQAAABUkAB4QEgAAFSQAEwAyABMAMgATADIAEwAyABMWAgATFgIAExYCABMUAgASFQIAEhUCABQZNgAUFygAFBY9ABQWJAAUGDMAFBYlABQWAQAUFjQAEhdEABMWJgAVFxYAFRYNABUWBAAVFg0AHAgzABUWIgAUFgEAEhYlABgUMwASFiUAFBglABQYJQAUGCUAFBYkABQXCAAUFgEAFBYBABQVBQATFgsAFBUJABUWBAAVFgQAFRYEABUVCAAdBQgAFBYBABQWAQAUFQUAHxAIABQVBQAfAxIAFBcEABUWAAAUFgAAHwMSAB8REgAUFgAAABYkAB8REgAAFiQAFAAkABQAJAAUACQAFAAkABQWAQAUFgEAFBYBABQVAQATFgIAExYCABUaNgAVGCgAFRc9ABUXJAAVGTMAFRclABUXAQAVFzQAExg8ABQXKAAWGBYAFhcNABYXBAAWFw0AHQkzABQYHQAVFwEAExclABsUMwATFyUAFRklABUZJQAVGSUAFRckABUYCAAVFwEAFRcBABUWBQAUFwgAFRYJABYXBAAWFwQAFhcEABYWCAAfBAgAFRcBABUXAQAVFgUAHhIIABUWBQAfBhIAFRgEABYXAAAVFwAAHwYSAB4TEgAVFwAAABckAB4TEgAAFyQAFQAkABUAJAAVACQAFQAkABUXAQAVFwEAFRcBABUWAQAUFwQAFBcEABYbNgAWGSgAFhg+ABYYJgAWGjMAFhgbABYYAwAWF0UAFBk8ABUYNgAXGRYAFxgJABcYBgAXGBUAHwgzABYYGwAWGAMAFBgyAB4UMwAUGDIAFholABYaJQAWGiUAFhglABYZCAAWGAIAFhgCABYXBQAVGAgAFhcJABcYBQAXGAUAFxgFABcXCAAfBwgAFhgCABYYAgAWFwUAHxMIABYXBQAfCRIAFhkEABcYAgAWGAIAHwkSABsWEgAWGAIAABgyABsWEgAAGDIAFgAkABYAJAAWACQA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AQAOE1sAGBDzAA4TWwARFloAERZaABEWWgARE2MAEBYzABAUAgAQFAIAEBIbAA4UMgAOExMAERYJABEWCQARFgkAERMSABsAMgAQFAEAEBQBAA4TCgAeDDIADhMKAB0ASAARFgQAEhQAABAUAQAdAEgAHg5IABAUAQAAE1oAHg5IAAATWgARAFoAEQBaABEAWgARAFoAEBQBABAUAQAQFAEAEBICAA4TCgAOEwoAEhmiABIXXgASFXMAEhVjABEZ9AARFk0AERUCABEUagAPFv0ADxRUABIZUQASFw0AExUZABIVEgAdAfMAERZMABEVAQAPFFAAGxDzAA8UUAASF1oAEhdaABIXWgASFF4AERczABEVAgARFQIAERMbAA8VMgAPFBQAEhcJABIXCQASFwkAEhQNABwBMgARFQEAERUBAA8UEAAfDTIADxQQAB4BSAASFwQAExUAABEVAQAeAUgAHw9IABEVAQAAFFAAHw9IAAAUUAASAFoAEgBaABIAWgASAFoAERUBABEVAQARFQEAERMCAA8UBAAPFAQAExqaABMYVAATFnUAExZVABIa9AASF0sAEhYCABIVagAQF/0AEBVkABMaWgATGBQAFBYaABMWFQAfAPQAEhdLABIWAgAQFVsAHhD0ABAVWwATGFAAExhQABMYUAATFlQAEhg0ABIWAQASFgEAEhUZABAWNAAQFRMAExgQABMYEAATGBAAExYUABwEMgASFgEAEhYBABAVCgAcEDIAEBUKABwISAATGAQAFBYBABIWAQAcCEgAGBRIABIWAQAAFVoAGBRIAAAVWgATAFAAEwBQABMAUAATAFAAEhYBABIWAQASFgEAEhQBABAVCgAQFQoAFBuiABQZXgAUF3QAFBdkABMb9AATGEwAExcCABMWagARGP0AERZkABQbUQAUGQ0AFRcaABQXEwAfA/QAExhMABMXAgARFlsAHxH0ABEWWwAUGVoAFBlaABQZWgAUFmMAExk0ABMXAQATFwEAExYZABEXNAARFhMAFBkJABQZCQAUGQkAFBYSAB0FMgATFwEAExcBABEWCgAfEDIAERYKAB0JSAAUGQQAFRcBABMXAQAdCUgAGxRIABMXAQAAFloAGxRIAAAWWgAUAFoAFABaABQAWgAUAFoAExcBABMXAQATFwEAExUBABEWCgARFgoAFRyiABUa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0wIAB/4AAwzRAAMM0QADDNEAAwjUAAENsgACCBEAAggRAAEGGgAAB+UAAAYRAAQKAgAECgIABAoCAAQHAgAFBaIAAggBAAIIAQAABgEADwCiAAAGAQALAMgABAsFAAUIEQACCBEACwDIABYAyAACCBEAAAfaABYAyAAAB9oAAwDQAAMA0AADANAAAwDQAAIIEAACCBAAAggQAAIFEAAABhAAAAYQAAQRogEEDOQABAo7AQQJ7gADEOgCAgvqAAMJIQACCDEBAAs8AwAI5AAFD8kABQwGAAUKIQAFCSoACwDYAgEMzAADCREAAAjgABYA2AIACOAABA3bAAQN2wAEDdsABAneAAMMsgADCREAAwkRAAIHGgAACbIAAAcGAAULAgAFCwIABQsCAAUIAgAJAKIAAwkBAAMJAQABBwEAEgCiAAEHAQAMAcgABQwFAAYJEQADCREADAHIABkAyAADCREAAAjQABkAyAAACNAABADaAAQA2gAEANoABADaAAMJEAADCRAAAwkQAAMGEAAABwUAAAcFAAUSogEFDeQABQs7AQUK7gADE+gCAwzhAAMLKAADCTEBAAztAgAJ4QAGEMkABg0GAAYLIQAGCioADADUAgINzAAEChIAAAnRABgA1AIACdEABQ7bAAUO2wAFDtsABQreAAMPsgADCxgAAwsYAAMIIAABCrIAAQgFAAYMAgAGDAIABgwCAAYJAgAKAaIABAoCAAQKAgACCAEAFQCiAAIIAQAOAMgABg0FAAcKEQAEChEADgDIABoByAAEChEAAAnQABoByAAACdAABQDaAAUA2gAFANoABQDaAAMMEQADDBEAAwwRAAMHFAABCAUAAQgFAAYTmgEGD90ABgxEAQYL6gAFEuMCBA7pAAQMKAAECioBAA7UAgIK5AAHEcoABw4BAAcMIAAHCykADgDTAgMO0wAEDBgAAQraABoB0wIBCtoABhDRAAYQ0QAGENEABgvRAAQQsgAFCxQABQsUAAQJGgABDKsAAwkKAAcOAQAHDgEABw4BAAcKBAAMAKIABQsEAAULBAADCQEAGACiAAMJAQANBcgABw4BAAgMFAADDBEADQXIAB8AyAADDBEAAAraAB8AyAAACtoABgDQAAYA0AAGANAABgDQAAULEAAFCxAABQsQAAUIEAADCQkAAwkJAAcUmAEHEOEABw1EAQcM5AAGE+MCBQ/pAAYMIQAFCyoBAQ/UAgML5AAIEskACA8GAAgNIQAIDCoADwHTAgQPzAAGDBEAAgvaABsC0wICC9oABxDRAAcQ0QAHENEABwzUAAURsgAGDBEABgwRAAUKGgACDasAAwoOAAgOAgAIDgIACA4CAAgLAgANAaIABgwBAAYMAQAECgEAGwCiAAQKAQARAMgACA8FAAkMEQAGDBEAEQDIAB4CyAAGDBEAAAvaAB4CyAAAC9oABwDQAAcA0AAHANAABwDQAAYMEAAGDBAABgwQAAYJEAADCwoAAwsKAAgVogEIEOQACA47AQgN7gAHFOgCBg/qAAcNIQAGDDEBAhDZAgMM4QAJE8kACRAGAAkOIQAJDSoAEQDYAgUQzAAHDREAAwzRAB4C2AIDDNEACBHbAAgR2wAIEdsACA3eAAcQsgAHDREABw0RAAYLGgADDqsABAsGAAkPAgAJDwIACQ8CAAkMAgAPAKIABw0BAAcNAQAFCwEAHgCiAAULAQASAcgACRAFAAoNEQAHDREAEgHIAB8DyAAHDREAAAzQAB8DyAAADNAACADaAAgA2gAIANoACADaAAcNEAAHDRAABw0QAAcKEAAECwUABAsFAAkWogEJEeQACQ87AQkO7gAHF+gCBxDhAAcPKAAHDTEBAxHZAgQN4QAKFMkAChEGAAoPIQAKDioAEATUAgYRzAAIDhIABA3RABwE1AIEDdEACRLbAAkS2wAJEtsACQ7eAAcTsgAHDxgABw8YAAcMIAAFDrIABQwFAAoQAgAKEAIAChACAAoNAgAQAaIACA4CAAgOAgAGDAEAHwGiAAYMAQATAsgAChEFAAsOEQAIDhEAEwLIAB4FyAAIDhEAAA3QAB4FyAAADdAACQDaAAkA2gAJANoACQDaAAcQEQAHEBEABxARAAcLFAAFDAUABQwFAAoXmgEKE90AChBEAQoP6gAJFuMCCBLpAAgQKAAIDioBBBLUAgYO5AALFcoACxIBAAsQIAALDykAEwLTAgcS0wAIEBgABQ7aAB4F0wIFDtoAChTRAAoU0QAKFNEACg/RAAgUsgAJDxQACQ8UAAgNGgAFEKsABw0KAAsSAQALEgEACxIBAAsOBAAQBKIACQ8EAAkPBAAHDQEAHASiAAcNAQAVAcgACxIBAAwQFAAHEBEAFQHIABsIyAAHEBEAAA7aABsIyAAADtoACgDQAAoA0AAKANAACgDQAAkPEAAJDxAACQ8QAAkMEAAHDQkABw0JAAsYmAELFOEACxFEAQsQ5AAKF+MCCRPpAAoQIQAJDyoBBRPUAgcP5AAMFskADBMGAAwRIQAMECoAEwXTAggTzAAKEBEABg/aAB8G0wIGD9oACxTRAAsU0QALFNEACxDUAAkVsgAKEBEAChARAAkOGgAGEasABw4OAAwSAgAMEgIADBICAAwPAgARBaIAChABAAoQAQAIDgEAHwSiAAgOAQAXAMgADBMFAA0QEQAKEBEAFwDIAB4IyAAKEBEAAA/aAB4IyAAAD9oACwDQAAsA0AALANAACwDQAAoQEAAKEBAAChAQAAoNEAAHDwoABw8KAAwZogEMFOQADBI7AQwR7gALGOgCChPqAAsRIQAKEDEBBhTZAgcQ4QANF8kADRQGAA0SIQANESoAFwDYAgkUzAALEREABxDRAB4I2AIHENEADBXbAAwV2wAMFdsADBHeAAsUsgALEREACxERAAoPGgAHEqsACA8GAA0TAgANEwIADRMCAA0QAgAVAKIACxEBAAsRAQAJDwEAHgaiAAkPAQAYAcgADRQFAA4REQALEREAGAHIAB8JyAALEREAABDQAB8JyAAAENAADADaAAwA2gAMANoADADaAAsREAALERAACxEQAAsOEAAIDwUACA8FAA0aogENFeQADRM7AQ0S7gALG+gCCxThAAsTKAALETEBBxXZAggR4QAOGMkADhUGAA4TIQAOEioAGADUAgoVzAAMEhIACBHRABgM1AIIEdEADRbbAA0W2wANFtsADRLeAAsXsgALExgACxMYAAsQIAAJErIACRAFAA4UAgAOFAIADhQCAA4RAgAWAaIADBICAAwSAgAKEAEAHweiAAoQAQAaAMgADhUFAA8SEQAMEhEAGgDIAB4LyAAMEhEAABHQAB4LyAAAEdAADQDaAA0A2gANANoADQDaAAsUEQALFBEACxQRAAsPFAAJEAUACRAFAA4bmgEOF90ADhREAQ4T6gANGuMCDBbpAAwUKAAMEioBCBbUAgoS5AAPGcoADxYBAA8UIAAPEykAGgDTAgsW0wAMFBgACRLaAB4L0wIJEtoADhjRAA4Y0QAOGNEADhPRAAwYsgANExQADRMUAAwRGgAJFKsACxEKAA8WAQAPFgEADxYBAA8SBAAYAKIADRMEAA0TBAALEQEAGAyiAAsRAQAZBcgADxYBABAUFAALFBEAGQXIAB8MyAALFBEAABLaAB8MyAAAEtoADgDQAA4A0AAOANAADgDQAA0TEAANExAADRMQAA0QEAALEQkACxEJAA8cmAEPGOEADxVEAQ8U5AAOG+MCDRfpAA4UIQANEyoBCRfUAgsT5AAQGskAEBcGABAVIQAQFCoAGwHTAgwXzAAOFBEAChPaABsO0wIKE9oADxjRAA8Y0QAPGNEADxTUAA0ZsgAOFBEADhQRAA0SGgAKFasACxIOABAWAgAQFgIAEBYCABATAgAZAaIADhQBAA4UAQAMEgEAGwyiAAwSAQAdAMgAEBcFABEUEQAOFBEAHQDIAB4OyAAOFBEAABPaAB4OyAAAE9oADwDQAA8A0AAPANAADwDQAA4UEAAOFBAADhQQAA4REAALEwoACxMKABAdogEQGOQAEBY7ARAV7gAPHOgCDhfqAA8VIQAOFDEBChjZAgsU4QARG8kAERgGABEWIQARFSoAHQDYAg0YzAAPFREACxTRAB4O2AILFNEAEBnbABAZ2wAQGdsAEBXeAA8YsgAPFREADxURAA4TGgALFqsADBMGABEXAgARFwIAERcCABEUAgAbAKIADxUBAA8VAQANEwEAHgyiAA0TAQAeAcgAERgFABIVEQAPFREAHgHIAB8PyAAPFREAABTQAB8PyAAAFNAAEADaABAA2gAQANoAEADaAA8VEAAPFRAADxUQAA8SEAAMEwUADBMFABEeogERGeQAERc7AREW7gAPH+gCDxjhAA8XKAAPFTEBCxnZAgwV4QASHMkAEhkGABIXIQASFioAHATUAg4ZzAAQFhIADBXRABwQ1AIMFdEAERrbABEa2wARGtsAERbeAA8bsgAPFxgADxcYAA8UIAANFrIADRQFABIYAgASGAIAEhgCABIVAgAcAaIAEBYCABAWAgAOFAEAHw2iAA4UAQAfAsgAEhkFABMWEQAQFhEAHwLIAB4RyAAQFhEAABXQAB4RyAAAFdAAEQDaABEA2gARANoAEQDaAA8YEQAPGBEADxgRAA8TFAANFAUADRQFABIfmgESG90AEhhEARIX6gARHuMCEBrpABAYKAAQFioBDBrUAg4W5AATHcoAExoBABMYIAATFykAHwLTAg8a0wAQGBgADRbaAB4R0wINFtoAEhzRABIc0QASHNEAEhfRABAcsgARFxQAERcUABAVGgANGKsADxUKABMaAQATGgEAExoBABMWBAAcBKIAERcEABEXBAAPFQEAHBCiAA8VAQAdCcgAExoBABQYFAAPGBEAHQnIABsUyAAPGBEAABbaABsUyAAAFtoAEgDQABIA0AASANAAEgDQABEXEAARFxAAERcQABEUEAAPFQkADxUJABMfqgETHOEAExlEARMY5AASH+MCERvpABIYIQARFyoBDRvUAg8X5AAUHskAFBsGABQZIQAUGCoAHwXTAhAbzAASGBEADhfaAB8S0wIOF9oAExzRABMc0QATHNEAExjUABEdsgASGBEAEhgRABEWGgAOGasADxYOABQaAgAUGgIAFBoCABQXAgAdBaIAEhgBABIYAQAQFgEAHxCiABAWAQAfCMgAFBsFABUYEQASGBEAHwjIAB4UyAASGBEAABfaAB4UyAAAF9oAEwDQABMA0AATANAAEwDQABIYEAASGBAAEhgQABIVEAAPFwoADxcKABQf1AEUHOQAFBo7ARQZ7gATH+sCEhvqABMZIQASGDEBDhzZAg8Y4QAVH8kAFRwGABUaIQAVGSoAHwjYAhEczAATGREADxjRAB4U2AIPGNEAFB3bABQd2wAUHdsAFBneABMcsgATGREAExkRABIXGgAPGqsAEBcGABUbAgAVGwIAFRsCABUYAgAfBKIAExkBABMZAQARFwEAHhKiABEXAQAfC8gAFRwFABYZEQATGREAHwvIAB8VyAATGREAABjQAB8VyAAAGNAAFADaABQA2gAUANoAFADaABMZEAATGRAAExkQABMWEAAQFwUAEBcFABUfIgIVHeQAFRs7ARUa7gAUHxQDExzhABMbKAATGTEBDx3ZAhAZ4QAWH9sAFh0GABYbIQAWGioAHBDUAhIdzAAUGhIAEBnRABgY1AIQGdEAFR7bABUe2wAVHtsAFRreABMfsgATGxgAExsYABMYIAARGrIAERgFABYcAgAWHAIAFhwCABYZAgAfB6IAFBoCABQaAgASGAEAHxOiABIYAQAfDsgAFh0FABcaEQAUGhEAHw7IAB4XyAAUGhEAABnQAB4XyAAAGdAAFQDaABUA2gAVANoAFQDaABMcEQATHBEAExwRABMXFAARGAUAERgFABcfoAIWH90AFhxEARYb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ABcfagAXH2oAFx9qABYcBQAcEIgCER8EABEfBAAOGgUAGBiIAg4aBQAfGPkCGh89ARgfAQARHwAAHxj5Ah4c+QIRHwAAAB0RAx4c+QIAHREDEwCEAxMAhAMTAIQDEwCEAxEfCAARHwgAER8IABEYCAAMGwUADBsFABcfcw8WH9QIFR/6BRQfewMWHxcREx+qBBIfNgARHCUDDx8DDAwd8gEZH4kFGB/+ARgflQAXHkoAHxPJCBUfqQMTHwUACx3iAR8ZyQgLHeIBFR/6BRUf+gUVH/oFFB97AxQf4wQSHzYAEh82ABEbTAAMH7MCDhsYABgflQAYH5UAGB+VABcdBQAdEYgCEx8FABMfBQAPGwUAGxiIAg8bBQAdHeEBGx/KABkfBAAUHwEAHR3hAR8c4QEUHwEAAB3hAR8c4QEAHeEBFAB6AxQAegMUAHoDFAB6AxIfHQASHx0AEh8dABIZCAANHAUADRwFABgfGQ4XH5cIFh+TBhUfkwMXH/MOFB8vBBMfmQASHeUBEB+CCg0eMgEaH20EGR/pARkfyAAYHxQAHRnpBhYfxgIVHykADB4iARsc6QYMHiIBFh+TBhYfkwYWH5MGFR+TAxUfeQUTH5kAEx+ZABIcVgAOHwEDDhwSABkfyAAZH8gAGR/IABgeCAAfEIgCFR8pABUfKQAPHAIAHhiIAg8cAgAfGwkBHB9xABsfAQAXHwEAHxsJAR8dCQEXHwEAAB4hAR8dCQEAHiEBFQB6AxUAegMVAHoDFQB6AxMfNQATHzUAEx81ABMaCAAOHQUADh0FABgf6QwYH64IFx8DBxYf3gMYH24NFh8/BBUfMgETHiUBEh9jCQ8edgAbH1kDGh/RARofDQEZHwgAHxdeBRgfIgIXH2IADh5yAB8bXgUOHnIAFx8DBxcfAwcXHwMHFh/eAxYfMwYVHzIBFR8yARMdVgAQH4EDDx0SABofDQEaHw0BGh8NARkfCAAfE4gCFx9iABcfYgAQHQIAHxmIAhAdAgAfHHEAHR80ABwfAQAaHwEAHxxxAB4ecQAaHwEAAB5xAB4ecQAAHnEAFgB6AxYAegMWAHoDFgB6AxQfWgAUH1oAFB9aABQbCgAPHgUADx4FABkfFAwZH/QIGB+6BxgfYwQZHzQMFx8sBBYfDQIUHowAFB+UCBAfKQAcH6gCGx/KARsfUQEaH0EAHR0IBBofyAEYH7kAEB8lAB8cCAQQHyUAGB+6BxgfugcYH7oHGB9jBBgf6QYWHw0CFh8NAhQeTAASHzgEER4YABsfUQEbH1EBGx9RARofQQAcHIgCGB+5ABgfuQASHgUAHByIAhIeBQAfHhIAHh8JAB4fAAAdHwAAHx4SAB4fEgAdHwAAAB8kAB4fEgAAHyQAFwCEAxcAhAMXAIQDFwCEAxYfpAAWH6QAFh+kABUcCAAQHwUAEB8FABsfAgsaH84IGR/7Bxkf2wQaHw0LGB9LBBcfrAIVH0gAFh/XBxIfFAAdHzYCHB+kARwfZAEbH3oAHxsDAxsfggEaH+gAEx8BAB8dAwMTHwEAGR/7Bxkf+wcZH/sHGR/bBBkfGwcXH6wCFx+sAhUfSAAUH5QEEh8UABwfZAEcH2QBHB9kARsfegAfGUICGh/oABof6AATHwEAGx5CAhMfAQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAGAB6AxgAegMYAHoDGAB6AxcfyAAXH8gAFx/IABYdCAASHxQAEh8UABsfwggbH1cHGh/KBhoffgQbH6EIGB/bAxgfcgIXHxQAFx8YBhMfNQAdH1YBHR8BAR0f3QAcH0QAHxzEARwf5AAbH4kAFh8BAB4exAEWHwEAGh/KBhofygYaH8oGGh9+BBkf2wUYH3ICGB9yAhcfFAAWH7YDEx81AB0f3QAdH90AHR/dABwfRAAfGlQBGx+JABsfiQAWHwEAHh1UARYfAQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAGQB6AxkAegMZAHoDGQB6AxgfCQEYHwkBGB8JARceCAATHzUAEx81ABwfNAcbHxcGGx+eBRsfMwQbH7EGGh9VAxkfewIYHwoAGB+3BBUffQAeH6wAHh+RAB0ffQAdHygAHx3YAB0feQAcH0QAGB8BAB8e2AAYHwEAGx+eBRsfngUbH54FGx8zBBsfzQQZH3sCGR97AhgfCgAXH/QCFR99AB0ffQAdH30AHR99AB0fKAAfHKQAHB9EABwfRAAYHwEAHh6kABgfAQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAGgB6AxoAegMaAHoDGgB6AxkfWgEZH1oBGR9aARgfCgAVH30AFR99AAATIAYADcoAAAoNAAAIVAIADSsNAAlyCAAIOAQABesJAAZADgAFlAoAEyAGAA3KAAAKDQAACFQCBgErDQAJcggACDgEAAXrCQ0AKw0ABesJAAkAAAAJAAAACQAAAAQEAAAEIgEABH0AAAR9AAACpAAAAkEBAAK9AAAJAAAACQAAAAkAAAAEBAACASIBAAR9AAAEfQAAAqQABAAiAQACpAAJASAGAA3KAAAKDQAACFQCCQEgBhMAIAYACFQCAAYyBhMAIAYABjIGAEGhlgcLxwEWIAYAD3UAAAsIAAAJ5QEAD4MPAApBCQAJJQQABhILAAf1EAAGEgwAFiAGAA91AAALCAAACeUBBwGADwAKQQkACSUEAAYSCwsCgA8ABhILAAwBAAAMAQAADAEAAAYAAAAGAAIABcIAAAXCAAADQAEAA0ACAAJ9AQAMAQAADAEAAAwBAAAGAAADAAACAAXCAAAFwgAAA0ABBgAAAgADQAELACAGAA91AAALCAAACeUBCwAgBhYAIAYACeUBAAcyBhYAIAYABzIGAEGRmAcLxwEZIAYAES0AAAw6AAAKiAEAESwSAAskCgAKYQQAB7YMAAgUFAAG8g0AGSAGABEtAAAMOgAACogBCAEsEgALJAoACmEEAAe2DBEALBIAB7YMAA8BAAAPAQAADwEAAAcEAAAHIgMABkABAAZAAQADAAIAA4ADAANAAgAPAQAADwEAAA8BAAAHBAADAiIDAAZAAQAGQAEAAwACBwAiAwADAAIMASAGABEtAAEMDQAACogBDAEgBhkAIAYACogBAAgoBhkAIAYACCgGAEGBmgcLxwEcIgYAExAAAA2yAAALVAEAEzAVAA0bCwAL2AQACHgOAAlzFwAH/w8AHCIGABMQAAENegAAC1QBBwUrFQANGwsAC9gEAAh4Dg8CKxUACHgOABIBAAASAQAAEgEAAAkBAAAJgAQAB80BAAfNAQAExQIABAEFAAQ+AwASAQAAEgEAABIBAAAJAQAEAYAEAAfNAQAHzQEABMUCCQCABAAExQIOACAGABMQAAINDQAAC1QBDgAgBhoBIAYAC1QBAAkoBhoBIAYACSgGAEHwmwcLiDYBHWEGARRLAAEOCQEADTkBABYrFQAOCwoADFUDAAlSDQAKZBgACZIPAR0hBgEUCwACDnUAAA05AQsAKxUADgsKAAxVAwAJUg0WACsVAAlSDQETQQABE0EAARNBAAEKQQAADIAEAAkhAQAJIQEABUQCAAVxBQAF7QIBEwEAARMBAAETAQABCgEABASABAAJIQEACSEBAAVEAgwAgAQABUQCDQUgBgAVBAADDg0AAA3oAA0FIAYfACAGAA3oAAAKMgYfACAGAAoyBgEAQQABAEEAAQBBAAEAQQAAAwEAAAMBAAADAQAAAgEAAAEUAAABFAABH8MGARaVAAIPyQEBDnkBABkrFQAQKwkADSwCAAprDAALXxkACTIPAh4hBgIVCwADD3UAAQ45AQwBKxUAECsJAA0sAgAKawwZACsVAAprDAEWkQABFpEAARaRAAELmgAAD4AEAAvCAAALwgAABuEBAAf7BQAG4QICFAEAAhQBAAIUAQACCwEABQWABAALwgAAC8IAAAbhAQ8AgAQABuEBEQAgBgEWBAAEDwgAAA6dABEAIAYeAiAGAA6dAAALMgYeAiAGAAsyBgEAkQABAJEAAQCRAAEAkQAABgEAAAYBAAAGAQAAAwEAAANBAAADQQACH7kHAhdVAQIQwwIBD/4BABwwFQARWQgAD3UBAAvbCwANNRoAChQPAx8hBgMWCwAEEHoAAg85AQ4AKxUAEVkIAA91AQAL2wsaASsVAAvbCwIXUQECF1EBAhdRAQIMVQEAEoAEAA1oAAANaAAACJoBAAiWBgAHEgMDFQEAAxUBAAMVAQADDAIACQCABAANaAAADWgAAAiaARIAgAQACJoBEgEgBgIXBAAFEA0AAA91ABIBIAYfAyAGAA91AAAMKAYfAyAGAAwoBgIAUQECAFEBAgBRAQIAUQEACQEAAAkBAAAJAQAABQQAAASCAAAEggADHzEJAhg6AgMRAwQCEMoCAB8wFQATuwcAEMMAAAwpCwAOfxsAC08PBB8oBgQXEAAFEXoAAxBLAQ8BKxUAE7sHABDDAAAMKQsbAisVAAwpCwIaIgICGiICAhoiAgIOIgIAFYAEAA4yAAAOMgAACTEBAAlABwAIPgMEFgEABBYBAAQWAQAEDQEACgGABAAOMgAADjIAAAkxARUAgAQACTEBEwIgBgMYCgAGEQ0AABBKABMCIAYeBSAGABBKAAANKAYeBSAGAA0oBgIAIQICACECAgAhAgIAIQIADAAAAAwAAAAMAAAABgEAAAXNAAAFzQAEH6QLAxqdAwMTzAUCEQgEAR+AFQAVEwcAET0AAA1bCgAQ/BwADSQPBh9TBgUYCwAGEnUABBE5AREAKxUAFRMHABE9AAANWwoeAisVAA1bCgMbhAMDG4QDAxuEAwMPhAMAGIAEABAIAAAQCAAACtAAAAtMCAAJcQMFFwEABRcBAAUXAQAFDgEADACABAAQCAAAEAgAAArQABgAgAQACtAAFQEgBgQZBAAHEg0AABEtABUBIAYbCCAGABEtAAAOMgYbCCAGAA4yBgMAhAMDAIQDAwCEAwMAhAMADwEAAA8BAAAPAQAACAQAAAZkAQAGZAEEH1QOAxsoBQQUlAcDEkgFAh+LFgAXyQYAEiUAAA62CQARHx4ADloPBx9jBgYZCwAHE3UABRI5ARIBKxUAF8kGABIlAAAOtgkfAysVAA62CQMe5AQDHuQEAx7kBAMQ6AQAG4AEABIBAAASAQAAC6QAAAxBCQAK6QMGGAEABhgBAAYYAQAGDwEADQGABAASAQAAEgEAAAukABsAgAQAC6QAFwAgBgUaBAAIEwgAABIkABcAIAYeCCAGABIkAAAPMgYeCCAGAA8yBgMA5AQDAOQEAwDkBAMA5AQAEgEAABIBAAASAQAACQEAAAf5AQAH+QEFH/oQBBxsBgUVRAkEE6cGAx+/FwAYbAYAFCYAAA9WCQASIR8AD0MPCB+SBgcaCwAIFHoABhM5ARMCKxUAGGgGABQiAAAPUgkeBSsVAA9SCQQfMwYEHzMGBB8zBgQRNgYAHoQEABQdAAAUHQAADHUAAA2zCQALFAQHGQEABxkBAAcZAQAHEAIADwCABAETAQABEwEAAAxxAB4AgAQADHEAGAEgBgYbBAAJFA0AABQZABgBIAYfCSAGABQZAAAQKAYfCSAGABAoBgQAMgYEADIGBAAyBgQAMgYAFQUAABUFAAAVBQAACwgAAAk1AgAJNQIHH+QRBR1sBgYWRAkEFJwGBB9UGAEZbAYBFSYAARAsCQAUmR0AEFANCR/gBggbEAAJFXoABxRLARMFKxUAGjkGAhQbAAAQzAgfBisVABDMCAUfNgYFHzYGBR82BgUSNgYBH4QEARUdAAEVHQABDXUAAA/BCAANuwIIGgEACBoBAAgaAQAIEQEAEAGABAIUAgACFAIAAA1KAB8BgAQADUoAGgAgBgccCgAKFQ0AABUKABoAIAYeCyAGABUKAAARKAYeCyAGABEoBgUAMgYFADIGBQAyBgUAMgYBFgUAARYFAAEWBQABDAgAAAqxAQAKsQEIH9oSBh5sBgcXMAkGFYwGBR8/GQIabAYCFiYAAhEsCQAWHBwAES8LCx9JBwkcCwAKFnUACBU5ARcAKxUBGzIGAhYdAAASQwgeCCsVABJDCAYfTAYGH0wGBh9MBgYTMQYDHpsEAxUdAAMVHQACDnoAABGhBwAOqgEJGwEACRsBAAkbAQAJEgEAEASABAMVBAADFQQAAA8xABwEgAQADzEAGQUgBggdBAALFg0AARYEABkFIAYfDCAGARYEAAASMgYfDCAGABIyBgYAKAYGACgGBgAoBgYAKAYCGAoAAhgKAAIYCgACDQoAAA0QAQANEAEJH/QTBx9sBggYRAkHFowGBx8EGgMbbAYDFyYAAxIsCQAX6xoAEtcJDB+gBwodCwALF3UACRY5ARgBKxUCHDAGAxcdAAAT6wcfCSsVABPrBwcfaAYHH2gGBx9oBgcULAYEH6QEAxciAAMXIgADD3oAABMDBwAPBQEKHAEAChwBAAocAQAKEwEAEQWABAQWAQAEFgEAABAaAB8EgAQAEBoAHQAgBgkeBAAMFwgAAhcEAB0AIAYeDiAGAhcEAAATMgYeDiAGABMyBgcAKAYHACgGBwAoBgcAKAYDGAoAAxgKAAMYCgADDgoAAA6qAAAOqgAKHzIVCB+fBgkZRAkIF6cGCB/NGgQcbAYEGCYAAxNECQAZrRkAE9wIDR8SCAseCwAMGHoAChc5ARoAKxUDHTAGBBgiAAAUkQceCysVABSRBwgflgYIH5YGCB+WBggVNgYFH7YEBBgdAAQYHQAEEHUAABRCBgARfgALHQEACx0BAAsdAQALFAIAFQCABAUXAQAFFwEAABEFAB4GgAQAEQUAHgEgBgofBAANGA0AAxgKAB4BIAYfDyAGAxgKAAAUKAYfDyAGABQoBggAMgYIADIGCAAyBggAMgYEGQUABBkFAAQZBQAEDwgAABBaAAAQWgALHxoWCR8sBwoaRAkIGJwGCR/MGwUdbAYFGSYABRQsCQAa6xgAFewHDh+oCAwfEAANGXoACxhLARsBKxUCHzAGBhgbAAAVKAcbDisVABUoBwkf2wYJH9sGCR/bBgkWNgYGH+wEBRkdAAUZHQAFEXUAABazBQASJgAMHgEADB4BAAweAQAMFQEAFgGABAYYAgAGGAIAABICAB8HgAQAEgIAHwIgBgsfDQAOGQ0ABBkKAB8CIAYeESAGBBkKAAAVKAYeESAGABUoBgkAMgYJADIGCQAyBgkAMgYFGgUABRoFAAUaBQAFEAgAABIlAAASJQAMH5QXCx/xBwsbMAkKGYwGCx//HAYebAYGGiYABhUsCQAc3RcAFgIHDx9DCQ0fMgAOGnUADBk5AR0AKxUFHzIGBhodAAAWwgYeDisVABbCBgofSQcKH0kHCh9JBwoXMQYHHzsFBxkdAAcZHQAGEnoAABdBBQATEAANHwEADR8BAA0fAQANFgEAGACABAcZBAAHGQQAAhMBABgMgAQCEwEAHQkgBg4fKQAPGg0ABRoEAB0JIAYbFCAGBRoEAAAWMgYbFCAGABYyBgoAKAYKACgGCgAoBgoAKAYGHAoABhwKAAYcCgAGEQoAABQNAAAUDQANHzIZDB/cCAwcRAkLGowGDB/8HQcfbAYHGyYABxYsCQAeJBcAF58GER/oCQ8fiwAPG3UADRo5AR4BKxUHH2MGBxsdAAAXlgYfDysVABeWBgsfkQcLH5EHCx+RBwsYLAYJH4wFBxsiAAcbIgAHE3oAABnSBAEUEQAOHwoADh8KAA4fCgAOFwEAGQGABAgaAQAIGgEAAhQCABsMgAQCFAIAHwggBg8fWgAQGwgABhsEAB8IIAYeFCAGBhsEAAAXMgYeFCAGABcyBgsAKAYLACgGCwAoBgsAKAYHHAoABxwKAAccCgAHEgoAABUKAAAVCgAPH3QaDR8jCg0dRAkMG6cGDR8xHwgfvQYIHCYABxdECQAfjRYAGGwGEh+iChAfBQEQHHoADhs5AR8CKxUIH7kGCBwiAAAYaAYeESsVABhoBgwf6wcMH+sHDB/rBwwZNgYKH+YFCBwdAAgcHQAIFHUAABukBAIVEQAPHxoADx8aAA8fGgAPGAIAGwCABAkbAQAJGwEAAxUCAB4MgAQDFQIAHwsgBhEftAARHA0ABxwKAB8LIAYfFSAGBxwKAAAYKAYfFSAGABgoBgwAMgYMADIGDAAyBgwAMgYIHQUACB0FAAgdBQAIEwgAARYKAAEWCgAQH/IbDh+LCw4eRAkMHJwGDh+cIAofZwcJHSYACRgsCQEfRBcBGWwGEx8yCxEf1AERHXoADxxLAR8FKxUKH0MHChwbAAAZQQYfEisVABlBBg0fcggNH3IIDR9yCA0aNgYLHzYGCR0dAAkdHQAJFXUAAByJBAMWEQAQHzEAEB8xABAfMQAQGQEAHAGABAocAgAKHAIABBYCAB8NgAQEFgIAHw4gBhMfFQESHQ0ACB0KAB8OIAYeFyAGCB0KAAAZKAYeFyAGABkoBg0AMgYNADIGDQAyBg0AMgYJHgUACR4FAAkeBQAJFAgAAhcKAAIXCgARH9QdDx9QDQ8fMAkOHYwGEB/hIQsfiwgKHiYAChksCQMfWxgCGmwGFB8oDBMf8gISHnUAEB05AR8IKxUMHwwICh4dAAAaMwYeFCsVABozBg8fzAgPH8wIDx/MCA4bMQYMH8wGCx0dAAsdHQAKFnoAAB6LBAQXEAASH1UAEh9VABIfVQARGgEAHASABAsdBAALHQQABhcBABwQgAQGFwEAHRUgBhQftAETHg0ACR4EAB0VIAYfGCAGCR4EAAAaMgYfGCAGABoyBg4AKAYOACgGDgAoBg4AKAYKHw0ACh8NAAofDQAKFQoAAxgKAAMYCgASH7ofEB9DDxAfVgkPHowGER9MIwwfEAoLHyYACxosCQYfmxkDG2wGFh9ADRQfFAQTH3UAER45AR8LKxUPH+wICx8dAAAbMwYfFSsVABszBhAfUgkQH1IJEB9SCQ8cLAYOH4QHCx8iAAsfIgALF3oAAR+LBAUYEQATH3EAEx9xABMfcQASGwEAHQWABAweAQAMHgEABhgCAB8QgAQGGAIAHxQgBhYfUQIUHwgACh8EAB8UIAYeGiAGCh8EAAAbMgYeGiAGABsyBg8AKAYPACgGDwAoBg8AKAYLHxkACx8ZAAsfGQALFgoABBkKAAQZCgATH9YdER/cDxEf6wkQHnsGEh9pIQ4ffgkNHyUACxuUBwcf6BcEHCgFFx+0CxQfKAQUH6QAEx66AB0RwxIQH+IHDR8BAAEc5QQbGMMSARzlBBEf6wkRH+sJER/rCRAdNgYPH+wHDR8lAA0fJQAMGHUAAx+SBAYZEQAUH6QAFB+kABQfpAATHAIAHwSABA0fAQANHwEABxkCAB4SgAQHGQIAHxbiBBgf+QEWHwAADR8AAB8W4gQeG+IEDR8AAAAc5AQeG+IEABzkBBAAMgYQADIGEAAyBhAAMgYNHyUADR8lAA0fJQAMFwgABRoKAAUaCgAUH5QbEx9zDxIflgoRHzsGEx8lHg8fXAgOH00ADRzIBQgfoxUGHJ0DFx/UCRYfsQMVH+kAFB5kAB8P2A8SH3gGDx8IAAQchAMfF9gPBByEAxIflgoSH5YKEh+WChEeNgYQH5EIDh9NAA4fTQANGXUABR/RBAcaEQAVH+kAFR/pABUf6QAUHQEAHweABA8fCAAPHwgACBoCAB8TgAQIGgIAHxd0AxkfcgEXHwQAEB8BAB8XdAMfG3QDEB8BAAAchAMfG3QDAByEAxEAMgYRADIGEQAyBhEAMgYOHzQADh80AA4fNAANGAgABhsKAAYbCgAVH4cZFB9PDxMfKQsSHzEGFB9DGxAflgcPH8MADhzeAwsfMhMHHTICGB/9BxcfPgMWH1IBFR8aAB0V9gwTHyIFER80AAUdIgIfGPYMBR0iAhMfKQsTHykLEx8pCxIfMQYRH4QJDx/DAA8fwwAOGnoABx87BQgbEAAWH1IBFh9SARYfUgEVHgEAHBCABBEfNAARHzQAChsBABgYgAQKGwEAHxkhAhof3QAZHwAAEx8AAB8ZIQIfHCECEx8AAAAdIQIfHCECAB0hAhIAKAYSACgGEgAoBhIAKAYPH0oADx9KAA8fSgAOGQoABxwKAAccCgAWHwcYFB9fDxQf2wsTH2gGFR86GRIfbgcQH3UBDx2eAgwfkxEIHVsBGR/BBhgfEgMXH5oBFh8BAB8TwQoUH0YEEx9xAAgdUgEfGcEKCB1SARQf2wsUH9sLFB/bCxMfaAYTH0YKEB91ARAfdQEPG3oACh/LBQkcEQAXH5oBFx+aARcfmgEWHwEAHRGABBMfcQATH3EAChwCABsYgAQKHAIAHxo9ARsfggAaHwkAFh8AAB8aPQEeHT0BFh8AAAAdUQEeHT0BAB1RARMAKAYTACgGEwAoBhMAKAYQH3UAEB91ABAfdQAPGgoACB0KAAgdCgAXHzsWFh+kDxUftgwUH9sGFh+HFxMfJgcSH14CEB2uAQ4fQhAJHpsAGh/JBRkfIQMYH/kBFx8aAB0Z4QgWH5IDFB/CAAkekgAbHOEICR6SABUftgwVH7YMFR+2DBQf2wYUHxMLEh9eAhIfXgIQHHUACx+BBgodEQAYH/kBGB/5ARgf+QEXHxoAHxCABBQfwgAUH8IACx0CAB4YgAQLHQIAHxyRABwfQQAcHwEAGR8AAB8ckQAeHpEAGR8AAAAekQAeHpEAAB6RABQAMgYUADIGFAAyBhQAMgYRH7QAER+0ABEftAAQGwgACR4KAAkeCgAYHy0VFx+fDxYfow0VH5sHFx+jFRQfVwcTH1UDER7uABAfUg8LHlEAGx/NBBofLQMaH2kCGB9kAB8XVgcXHzYDFh8xAQweQgAfG1YHDB5CABYfow0WH6MNFh+jDRUfmwcVHwkMEx9VAxMfVQMRHXUADh9xBwseEQAaH2kCGh9pAhofaQIYH2QAHxOABBYfMQEWHzEBDB4CAB8ZgAQMHgIAHx0tAB4fEgAdHwQAHB8BAB8dLQAfHi0AHB8BAAAeQQAfHi0AAB5BABUAMgYVADIGFQAyBhUAMgYSHwUBEh8FARIfBQERHAgACh8KAAofCgAYHzoUGB//DxcfeA4WH5kIGB9NFBUfNQgUH9gEEh+ZABIfsA4MHxAAHB9ABBsfPgMbH8UCGh/1AB0dAAYaHxgDGB/NAQ4fAQAfHAAGDh8BABcfeA4XH3gOFx94DhYfmQgXH0QNFB/YBBQf2AQSHnoADx+gCAwfEAAbH8UCGx/FAhsfxQIaH/UAHByABBgfzQEYH80BDh8BABwcgAQOHwEAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAHx8AAAAfAAAfHwAAAB8AABYAKAYWACgGFgAoBhYAKAYUH1QBFB9UARQfVAESHQoADB8QAAwfEAAZH3QRGB8fDhgftgwXHwwIGB89ERYfKgcVH7UEEx86ABMfNwwOHzUAHB8AAxwfQAIcHwACGx+qAB8aLAQaHxgCGR9SARAfAQAeHSwEEB8BABgftgwYH7YMGB+2DBcfDAgXHyQLFR+1BBUftQQTHzoAEB9WBw4fNQAcHwACHB8AAhwfAAIbH6oAHxgiAxkfUgEZH1IBEB8BAB4cIgMQHwEAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAHx8AAAAfAAAfHwAAAB8AABcAKAYXACgGFwAoBhcAKAYVH6UBFR+lARUfpQETHgoADh81AA4fNQAaHxIPGR90DBkfUwsYH5sHGR90DhcfPAYXH1gEFB8IABQfHAoQH3UAHR/yARwfgAEcH0ABGx96AB8bqwIbH1YBGh/UABMfAQAfHasCEx8BABkfUwsZH1MLGR9TCxgfmwcYH4kJFx9YBBcfWAQUHwgAEh8gBhAfdQAcH0ABHB9AARwfQAEbH3oAHR0AAhof1AAaH9QAEx8BAB8cAAITHwEAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAHx8AAAAfAAAfHwAAAB8AABgAMgYYADIGGAAyBhgAMgYWHwgCFh8IAhYfCAIUHwgAEB91ABAfdQAbH7oMGh/mChofIgoZH1MHGh8hDBgfpwUXHzgEFR8UABYfZwgSH9AAHR8yAR0f3QAdH7kAHB9AAB8cgAEcH8AAGx99ABYfAQAeHoABFh8BABofIgoaHyIKGh8iChkfUwcZH1MIFx84BBcfOAQVHxQAFB84BRIf0AAdH7kAHR+5AB0fuQAcH0AAHxsiARsffQAbH30AFh8BAB8dIgEWHwEAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAHx8AAAAfAAAfHwAAAB8AABkAMgYZADIGGQAyBhkAMgYXH1QCFx9UAhcfVAIVHxQAEh/QABIf0AAAGW0KABJAAQANBQAAC9kDABH9FgALoQ4ACtIGAAdFEQAI8RgAB64SABltCgASQAEADQUAAAvZAwgB/RYAC6EOAArSBgAHRRERAP0WAAdFEQAMAAAADAAAAAwAAAAGAQAABiECAAXNAAAFzQAAA1EBAANhAgADkQEADAAAAAwAAAAMAAAABgEAAwAhAgAFzQAABc0AAANRAQYAIQIAA1EBDQBtCgASQAEADQUAAAvZAw0AbQoZAG0KAAvZAwAIgQoZAG0KAAiBCgBBodIHC8cBHGkKABTUAAAOCgAADFIDABMNGgANhg8ACy0HAAgBEwAJYhwAB74UABxpCgAU1AAADgoAAAxSAwkBDRoADYYPAAstBwAIARMTAA0aAAgBEwAPAAAADwAAAA8AAAAHCQAAB00DAAZRAQAGUQEAAyECAAOxAwADYQIADwAAAA8AAAAPAAAABwkAAwJJAwAGUQEABlEBAAMhAgYBSQMAAyECDARpCgAU1AABDgUAAAxSAwwEaQocAGkKAAxSAwAJgQocAGkKAAmBCgBBkdQHC8cBH2kKABVxAAAPQQAADcUCABVyHQAOwRAADHMHAAnSFAAKZiAACNUWAB9pCgAVcQAAD0EAAA3FAgoBch0ADsEQAAxzBwAJ0hQVAHIdAAnSFAASAAAAEgAAABIAAAAJAAAACbEEAAfiAQAH4gEABOQCAAQ2BQAEXQMAEgAAABIAAAASAAAACQAABAGxBAAH4gEAB+IBAATkAgkAsQQABOQCDQVpCgAVcQACDwUAAA3FAg0FaQofAGkKAA3FAgAKgQofAGkKAAqBCgBBgdYHC8cBH/kKABc0AAAQrQAADkoCABcuIQAPAhIADZ4HAAnCFgALwSQACQIZAR/BCgAXNAABEIQAAA5KAgsBLSEADwISAA2eBwAJwhYTAi0hAAnCFgAVAAAAFQAAABUAAAAKCQAACl0GAAmAAgAJgAIABdkDAAUGBwAFggQAFQAAABUAAAAVAAAACgkAAwVZBgAJgAIACYACAAXZAwcCWQYABdkDEQBpCgAXNAACEA0AAA5KAhEAaQoeAmkKAA5KAgALgQoeAmkKAAuBCgBB8NcHC8gBAR8hDAAZCAABEUUBAA8AAgAZxSUAEWETAA5ICAAKFRkADBYqAAruGwIf2QsAGQgAAREFAQAPAAIMAcUlABFhEwAOSAgAChUZGQDFJQAKFRkAGAAAABgAAAAYAAAADAAAAAyCCAAJYQMACWEDAAYhBQAFcwkABfMFABgAAAAYAAAAGAAAAAwAAAQEgggACWEDAAlhAwAGIQUMAIIIAAYhBRMAbQoAGQgABBEFAAAPAAITAG0KHwNtCgAPAAIADIEKHwNtCgAMgQoAQeDZBwuYNAIfiQ0AG0EAAROyAQAR2gEAHMYlABIyEgAQtQYAC0EYAA3jKgALxRsDHx0MARoIAAISBQEAEdoBDgDFJQASMhIAELUGAAtBGBoBxSUAC0EYARlAAAEZQAABGUAAAQ1AAAAPgggAC6gCAAuoAgAHpQQAB/0JAAaxBQEZAAABGQAAARkAAAENAAAFBYIIAAuoAgALqAIAB6UEDwCCCAAHpQQUAGkKABsBAAUSBQAAEZoBFABpChgIaQoAEZoBAA2BChgIaQoADYEKAABAAAAAQAAAAEAAAABAAAADAAAAAwAAAAMAAAACBAAAAQ0AAAENAAMfTQ8BHIEAAhSFAgESGgIAH8YlABTqEAAR3gQADCUXAA45LAAMZhsEH5IMAhsIAAMTBQEBEtoBDwHFJQAU6hAAEd4EAAwlFxsCxSUADCUXARyAAAEcgAABHIAAAQ+EAAASgggADeIBAA3iAQAIEAQACJgKAAe+BQIaAAACGgAAAhoAAAIOAAAJAIIIAA3iAQAN4gEACBAEEgCCCAAIEAQVAWkKARwBAAYTBQAAEjEBFQFpChsIaQoAEjEBAA6BChsIaQoADoEKAQCAAAEAgAABAIAAAQCAAAAGAAAABgAAAAYAAAADAAAAAj0AAAI9AAMfvRECHUEBAhWIAwETcQIBHxUmABWyDwASkgMADgEWABCNLQANyxoFHy4NAxwKAAQU/gACE9oBEQDGJQAVsg8AEpIDAA4BFh4CxiUADgEWAh1AAQIdQAECHUABARBAAQAVgggAD2EBAA9hAQAJcQMACUILAAmxBQMbAAADGwAAAxsAAAMPAAAKAYIIAA9hAQAPYQEACXEDFQCCCAAJcQMXAGkKAh0BAAYUDQAAE/UAFwBpCh4IaQoAE/UAAA+BCh4IaQoAD4EKAQBAAQEAQAEBAEABAQBAAQAJAAAACQAAAAkAAAAEBAAABH0AAAR9AAQfAhUCHzoCAxbzBAIUUgMCHz0nABehDgATggIADuoUABHZLgAOjhoHH+ENBB0IAAUVBQEDFOsBEgHFJQAXoQ4AE4ICAA7qFB8DxSUADuoUAh8xAgIfMQICHzECAhEiAgAYgggAEc0AABHNAAAK2gIAC04MAAmxBQQcAAAEHAAABBwAAAQQAAAMAIIIABHNAAARzQAACtoCGACCCAAK2gIZAG0KAx4BAAgVBQAAFKoAGQBtCh8JbQoAFKoAABCBCh8JbQoAEIEKAgAhAgIAIQICACECAgAhAgAMAAAADAAAAAwAAAAGAQAABc0AAAXNAAUfuhgDH4kDBBe2BgIVSwQDH9UoABmWDQAVcQEAEBIUABKnMAAP0xoIH34OBR4IAAYWBQEEFdoBEwLFJQAZlg0AFXEBABASFB4FxSUAEBIUAx+FAwMfhQMDH4UDAxJiAwAbgggAE4IAABOCAAALigIADEMNAArzBQUdAAAFHQAABR0AAAURAAANAYIIABOCAAATggAAC4oCGwCCCAALigIYBGkKBB8BAAkWBQAAFXEAGARpChwMaQoAFXEAABGBChwMaQoAEYEKAwBhAwMAYQMDAGEDAwBhAwAPAAAADwAAAA8AAAAHCQAABlEBAAZRAQYfFh0EH7IFBBh+CAMWiwUDHyUrABvyDAAWwwAAEQETABQ3MgAQ4hoJHz4PBh8IAAcXBQEFFtoBEwXFJQAb8gwAFsMAABEBEx8GxSUAEQETAx91BQMfdQUDH3UFAxO6BAAegggAFD0AABQ9AAAMIQIADT0OAAxiBgYeAAAGHgAABh4AAAYSAAAPAIIIABQ9AAAUPQAADCECHgCCCAAMIQIZBWkKBh8IAAoXBQAAFkoAGQVpCh8MaQoAFkoAABKBCh8MaQoAEoEKAwCxBAMAsQQDALEEAwCxBAASAAAAEgAAABIAAAAJAAAAB+IBAAfiAQcfgiEEH2IIBRnOCgMXKwcEH/YtABw1DAAXXgAAEgISABW2MwARtRoKHyIQBx8xAAgY/gAGF9oBFwDGJQAcNQwAF14AABICEh4IxiUAEgISBB+BBwQfgQcEH4EHAxWBBgAftAgAFhIAABYSAAAOqQEAD5MPAA2NBgcfAAAHHwAABx8AAAcTAAAQAYIIABYSAAAWEgAADqkBHwGCCAAOqQEdAGkKBx8xAAoYDQAAFzoAHQBpCh4OaQoAFzoAABOBCh4OaQoAE4EKAwCBBgMAgQYDAIEGAwCBBgAVAAAAFQAAABUAAAAKCQAACYACAAmAAgcflycFH3YMBRrXDQQYLAkFHy4yAB6RCwAZHgAAE0URABcWNgASEhsLH/kQCB+yAAkZBQEHGOsBGAHFJQAekQsAGR4AABNFER8JxSUAE0URBR+SCgUfkgoFH5IKBBaDCAEfZAkAGAAAABgAAAAPUQEAEAQRAA4pBwgfCQAIHwkACB8JAAgUAAAQBIIIABgAAAAYAAAAD1EBHASCCAAPUQEfAG0KCh9xAAwZBQAAGRoAHwBtCh8PbQoAGRoAABSBCh8PbQoAFIEKBACCCAQAgggEAIIIBACCCAAYAAAAGAAAABgAAAAMAAAACWEDAAlhAwgfyiwGH1sQBhtGEAQZAgsGH0o2AB83CwAaDwAAFIIQABiGNwATXhsMH+4RCh9BAQoaBQEIGdoBGgDFJQAfNgsAGg4AABSBEB4LxSUAFIEQBh+CDQYfgg0GH4INBReCCgIfgwoAGg4AABoOAAAQBQEAEfMRAA+hBwkfJAAJHyQACR8kAAkVAAARBYIIARkAAAEZAAAAEAQBHwSCCAAQBAEcCGkKCx/CAA0aBQAAGgUAHAhpChgUaQoAGgUAABWBChgUaQoAFYEKBQCBCgUAgQoFAIEKBQCBCgAbAQAAGwEAABsBAAAOBQAACw0EAAsNBAkfFi8HH+IRBxwWEAUaAgsHH4Y3AR/iCwEbDwAAFQMQABlzNQAVshgOH/oSCx8CAgsbBQEJGtoBGwHFJQIfxgsBGw4AABWyDxsOxSUAFbIPBx/iDQcf4g0HH+INBhiBCgMf6woBGw4AARsOAAERBQEAE60QABDtBQsfSQALH0kACx9JAAoWAAAVAIIIAhoAAAIaAAAAEbkAHgaCCAARuQAdCWkKDR9AAQ4bBQAAGwEAHQlpChsUaQoAGwEAABaBChsUaQoAFoEKBgCBCgYAgQoGAIEKBgCBCgEcAQABHAEAARwBAAEPBQAADR0DAA0dAwsf2jAIH9MTCB1GEAYbAgsIHzs5Ax+3DAIcFwABFgMQABu2MwAVEhYPH74TDB8OAwwc/gAKG9oBHQDGJQMfhgwCHBYAABb1Dh4OxiUAFvUOCB96Dggfeg4IH3oOBxmBCgQfggsCHBMAAhwTAAISBQEAFUIPABFSBAwfagAMH2oADB9qAAsXAAAWAYIIAxsAAAMbAAAAEoAAHweCCAASgAAfCGkKDx+9AQ4cDQABHAQAHwhpCh4UaQoBHAQAABeBCh4UaQoAF4EKBwCBCgcAgQoHAIEKBwCBCgIdAQACHQEAAh0BAAIPCgAADn0CAA59AgwfJjMKH5YWCR5GEAccFgsKH207BB8iDgMdGQACFwUQAB2OMQAX0xMQHwIVDh+UBA0dBQELHOsBHgHFJQYfjQ0DHRUAABd6Dh8PxSUAF3oOCR8yDwkfMg8JHzIPCBqCCgYfVQwDHRgAAx0YAAMT/gAAFyMOABMOAw0fkQANH5EADR+RAAwYAAAYAIIIBBwAAAQcAAAAE2oAGAyCCAATagAfC20KEB+AAhAdBQACHQIAHwttCh8VbQoCHQIAABiBCh8VbQoAGIEKCACBCggAgQoIAIEKCACBCgMeBQADHgUAAx4FAAMRCAAAEbQBABG0AQ0fljULH7UYCh9GEAgdAgsLH808Bh/+DwQeDwADGBYQAB9DMAAY4hERH2oWDx/tBQ4eBQEMHdoBHwLFJQcfsQ4EHg4AABjiDR4RxSUAGOINCh/1Dwof9Q8KH/UPCRuCCgcf1QwEHg4ABB4OAAQUBQEAGAINABQCAg4f0AAOH9AADh/QAA0ZAAAZAYIIBR0AAAUdAAAAFUAAGwyCCAAVQAAcFGkKEh89AxEeBQADHgIAHBRpChwYaQoDHgIAABmBChwYaQoAGYEKCQCBCgkAgQoJAIEKCQCBCgQfAQAEHwEABB8BAAQSBQAAEjIBABIyAQ4fKjgMH14bCx+CEAkeAgsMH7Y+Bx/iEQUfDwAEGQMQAB8TLwAZ+Q8TH1IXEB+hBw8fBQENHtoBHwXFJQof8Q8FHw4AABlVDR8SxSUAGVUNCx+BEAsfgRALH4EQChyBCggflA0FHw4ABR8OAAUVBQEAGhMMABUhAQ8fBAEPHwQBDx8EAQ4aAAAbAIIIBh4AAAYeAAAAFhkAHgyCCAAWGQAdFWkKFB8NBBIfBQAEHwEAHRVpCh8YaQoEHwEAABqBCh8YaQoAGoEKCgCBCgoAgQoKAIEKCgCBCgUfCgAFHwoABR8KAAUTBQAAFMIAABTCAA8f9TQNH7YbDB9FEQof0QoNH3w7CB+uEAYfLgAFGpQNAB8MKwAaJAwUHxgVER+LBxAfUQEPHkABHwcIIgsfLg4HHwAAABprCh8TCCIAGmsKDB9FEQwfRREMH0URCx2BCgkfig4GHy4ABh8uAAYWBQEAG0ILABatABAfUQEQH1EBEB9RAQ8bAAAcAYIIBx8AAAcfAAAAFwkAHw2CCAAXCQAfE4IIFh9xAxMfAAAHHwAAHxOCCB8ZgggHHwAAABuCCB8ZgggAG4IICwCBCgsAgQoLAIEKCwCBCgYfJQAGHyUABh8lAAYTCgAAFm0AABZtABAfhjEOH1sbDR9VEgwfmgoPH8o2Ch9nDwgfXgAGGs4KAh9aJwAbYggUH1oSEx/SBhEf0AEQHqQAHQ2aHQwfEgwJHxQAABuBBx8Umh0AG4EHDR9VEg0fVRINH1USDB6CCgsfYw8IH14ACB9eAAcX/gAAHVoKABgxABEf0AERH9ABER/QARAcAAAcBIIICR8UAAkfFAAAGAAAHBCCCAAYAAAfFVkGFx+NAhUfBAAKHwEAHxVZBh8aWQYKHwEAABuBBh8aWQYAG4EGDACBCgwAgQoMAIEKDACBCggfOgAIHzoACB86AAcVCAAAGDEAABgxABEfCi8PH+IaDx9SEw0fggoQH0czCx8fDgkf5QAHG34IAx9hJAAbsgUVHzYQEx9iBhMfIQIRHlkAHwsFGg4fXgoLHz0AABx1BR8VBRoAHHUFDx9SEw8fUhMPH1ITDR+CCgwfShAJH+UACR/lAAgYBQEAH9gJABkKABMfIQITHyECEx8hAhEdAAAdBYIICx89AAsfPQABGQAAHxCCCAEZAAAfFrEEGB/iARYfAQANHwEAHxaxBB4bsQQNHwEAAByxBB4bsQQAHLEEDQCBCg0AgQoNAIEKDQCBCgkfVQAJH1UACR9VAAgWBQAAGQoAABkKABIf0iwQH9MaDx8SFA4fpQoQH/cvDB9SDQofowEIG7YGBB/mIQAciQMXHyoOFB8OBhQfigISHxkAHRHFFg8fAgkMH4IAAByFAxsYxRYAHIUDDx8SFA8fEhQPHxIUDh+lCg0fZBEKH6MBCh+jAQkZBQEAH9gJARoKABQfigIUH4oCFB+KAhIeAAAfBIIIDB+CAAwfggACGgAAHhKCCAIaAAAfF00DGR9hARcfCQAQHwAAHxdNAx8bTQMQHwAAABxhAx8bTQMAHGEDDgCBCg4AgQoOAIEKDgCBCgofggAKH4IACh+CAAkXBQAAGwEAABsBABMfFioRHzIbEB8CFQ8f+goRH04tDB8SDQwfggIJHMYEBh+xHwAdOgIXH0oMFh8DBhUfBQMTHwAAHw/aExAf8gcOH90AAB0qAh8X2hMAHSoCEB8CFRAfAhUQHwIVDx/6Cg8fihIMH4ICDB+CAgoaBQECH5oKAhsKABUfBQMVHwUDFR8FAxMfAAAfB4IIDh/dAA4f3QADGwAAHxOCCAMbAAAfGSECGh/dABkfAAATHwAAHxkhAh8cIQITHwAAAB0hAh8cIQIAHSECDwCBCg8AgQoPAIEKDwCBCgsfqgALH6oACx+qAAoXCgABHAEAARwBABQf8ScSH3EbEh9hFhAfogsTHygqDh/TDA0f1gMKHV0DCB+kHQIdRQEYH6kKFx+0BRYfpAMUHyQAHRX4EBMf0gYQH2EBAh1BAR8Y+BACHUEBEh9hFhIfYRYSH2EWEB+iCxAfpBMNH9YDDR/WAwsb/gAEH6ULAxwKABYfpAMWH6QDFh+kAxQfJAAcEIIIEB9hARAfYQEEHAAAGBiCCAQcAAAfGyIBGx99ABsfBAAWHwEAHxsiAR8dIgEWHwEAAB1AAR8dIgEAHUABEACBChAAgQoQAIEKEACBCgwf9QAMH/UADB/1AAsZCAACHQUAAh0FABQfYSYTH2YbEx8lFxEfkgwUHwUoDx/VDA4fMgULHWQCCh85HAMehQAZH6MJGB++BRcfEAQVH5AAHxPDDhQfLAYSH/QBAx6BAB8Zww4DHoEAEx8lFxMfJRcTHyUXER+SDBEf4hQOHzIFDh8yBQwcBQEGH8MMBB0KABcfEAQXHxAEFx8QBBUfkAAdEYIIEh/0ARIf9AEFHQAAGxiCCAUdAAAfHIAAHR89ABwfAAAZHwEAHxyAAB4egAAZHwEAAB6AAB4egAAAHoAAEQCBChEAgQoRAIEKEQCBCg0fUgENH1IBDR9SAQwaBQADHgUAAx4FABUfMyUUH8UbFB9BGBIfkQ0UHxUmEB9SDQ8ftQYMHpEBCx80GwQfQQAaH+EIGR8DBhgfpQQXHwQBHRnjDBYf0gUUH6gCBh5AABsc4wwGHkAAFB9BGBQfQRgUH0EYEh+RDRIfRBYPH7UGDx+1Bg0dBQEIHwMOBR4KABgfpQQYH6UEGB+lBBcfBAEfEIIIFB+oAhQfqAIGHgAAHhiCCAYeAAAfHiIAHh8NAB4fBAAcHwAAHx4iAB4fIgAcHwAAAB5AAB4fIgAAHkAAEgCBChIAgQoSAIEKEgCBCg8fpQEPH6UBDx+lAQ0bBQAEHwEABB8BABcf8SMVH5IcFR+CGRMfwg4VH8wkEh9EDhAfkQgOHkUBDh+UGgYfCgAbHwkIGh9FBhkfYgUYH7oBHxdYCxcfrAUWH3EDBx8AAB8bWAsHHwAAFR+CGRUfghkVH4IZEx/CDhMfRBcQH5EIEB+RCA4eBQEKH3UPBh8KABkfYgUZH2IFGR9iBRgfugEfE4IIFh9xAxYfcQMHHwAAHxmCCAcfAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAEwCBChMAgQoTAIEKEwCBChAfAAIQHwACEB8AAg4bCgAGHwoABh8KABcfcR8WH5YZFh8lFxQfBQ4XH8kfEx+UDBIfAggPH60ADx+tFggfNAAbHwgGGx+dBBofEAQZH2EBHxh2CBgfOwQXH40CCh8BAB4cdggKHwEAFh8lFxYfJRcWHyUXFB8FDhQfWRQSHwIIEh8CCA8edQAMH00NCB80ABofEAQaHxAEGh8QBBkfYQEfFVkGFx+NAhcfjQIKHwEAHxpZBgofAQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAFACBChQAgQoUAIEKFACBChEfcQIRH3ECER9xAg8dCAAIHzQACB80ABgfCRwXH9UWFx/xFBUfkQ0XH3kbFB+BCxMfcwcQH0EAEB+iEwofdQAcH3EEGx9dAxsf5AIaHwQBHR1BBhofQQMYH+IBDR8BAB8cQQYNHwEAFx/xFBcf8RQXH/EUFR+RDRUfNRITH3MHEx9zBxAfQQAOH7ULCh91ABsf5AIbH+QCGx/kAhofBAEfFrEEGB/iARgf4gENHwEAHhuxBA0fAQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAFQCBChUAgQoVAIEKFQCBChIf8gISH/ICEh/yAhAeBQAKH3UACh91ABgf+RgYH74UFx8BExYf8gwYHwIYFB+xChQfLQcRHwUAEh8dEQsf1AAcHyEDHB9hAhwfIQIbH7kAHxphBBofMQIZH2EBEB8AAB4dYQQQHwAAFx8BExcfARMXHwETFh/yDBYfVRAUHy0HFB8tBxEfBQAPHz0KCx/UABwfIQIcHyECHB8hAhsfuQAfF00DGR9hARkfYQEQHwAAHxtNAxAfAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAFgCBChYAgQoWAIEKFgCBChMfUgMTH1IDEx9SAxEfBQALH9QACx/UABkfMxYYH64SGB9FERcfZQwYH8IUFh8DChUfNAcSHwoAEh+tDg0fUgEdHxMCHB+RARwfUQEbH3kAHxvWAhsfawEaH90AEx8AAB8d1gITHwAAGB9FERgfRREYH0URFx9lDBcfSQ4VHzQHFR80BxIfCgAQHxEJDR9SARwfUQEcH1EBHB9RARsfeQAfGSECGh/dABof3QATHwAAHxwhAhMfAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAFwCBChcAgQoXAIEKFwCBChQf2QMUH9kDFB/ZAxIfCgANH1IBDR9SAQIfQCkAHjIGABatAAAS8g4AHJFGABOiLwARwRcACxI3AA26SwALljoDH+gnAB4yBgAWrQAAEvIODASRRgAToi8AEcEXAAsSNxwAkUYACxI3ABEBAAARAQAAEQEAAAkEAAAJUQQAB7oBAAe6AQAEqAIABM4EAAQhAwARAQAAEQEAABEBAAAJBAAEAVEEAAe6AQAHugEABKgCCQBRBAAEqAIVACAkAB4yBgAWrQAAEvIOFQAgJB4GICQAEvIOAA4gJB4GICQADiAkAEGgjggLyAECH0AsAB89BQAXRAAAEyoOAB6GSwAUQzEAEtMXAAykOQAOllEADOU9Ax8oKgAfPQUAF0QAABMqDg8AhksAFEMxABLTFwAMpDkeAIZLAAykOQAUAAAAFAAAABQAAAAKAQAACukFAAhdAgAIXQIABZ0DAAWSBgAEQQQAFAAAABQAAAAUAAAACgEABQDpBQAIXQIACF0CAAWdAwoA6QUABZ0DFgEgJAAfPQUAF0QAABMqDhYBICQfByAkABMqDgAPICQfByAkAA8gJABBkJAIC8gBAx+oLwAfLQUAGAoAABQlDQAf4VAAFdEyABJTGAANUTwAD7dXAA0aQQQf4SwAHy0FABgKAAAUJQ0PAtFQABXRMgASUxgADVE8HgHRUAANUTwAFwAAABcAAAAXAAAACwkAAAvFBwAJBAMACQQDAAW9BAAFkggABWYFABcAAAAXAAAAFwAAAAsJAAYAwQcACQQDAAkEAwAFvQQKAcEHAAW9BBcCICQAHy0FABgKAAAUJQ0XAiAkHgkgJAAUJQ0AECIkHgkgJAAQIiQAQYCSCAvIAQMf6DMAHx0GABkKAAAWBQwBH8ZWABfzNAAUphgADjA/ABBCXgANmkQEH2EwAB8dBgAZCgAAFgUMEQBxVgAX8zQAFKYYAA4wPx4CcVYADjA/ABoAAAAaAAAAGgAAAA0AAAAN2QkACvoDAAr6AwAG5AUABvEKAAbkBgAaAAAAGgAAABoAAAANAAAGAdkJAAr6AwAK+gMABuQFDQDZCQAG5AUXBSAkAB8dBgAZCgAAFgUMFwUgJB8KICQAFgUMABEiJB8KICQAESIkAEHwkwgLyAEEH8Q5AB9dCAAbSAAAFgkLAR9MXgAZIjcAFbMYAA4yQwARz2UADtZIBR/RNAEfNAgAG0gAABYJCxAEK10AGSI3ABWzGAAOMkMcBCtdAA4yQwAdAQAAHQEAAB0BAAAPBAAAD4IMAAwFBQAMBQUAB7UHAAfxDQAGwQgAHQEAAB0BAAAdAQAADwQABwGADAAMBQUADAUFAAe1BwsCgAwAB7UHGwAgJAMfXQcCGggAABYJCxsAICQeDCAkABYJCwASICQeDCAkABIgJABB4JUIC8gBBB9kPwEfFAsAHKoAABg0CgIfc2UAGQI5ABZJGQAQ4EYAES9tAA52TQcfUzkCH5IKARuVAAAYNAoTAIBjABkCOQAWSRkAEOBGHgSAYwAQ4EYAHwkAAB8JAAAfCQAAEAAAABAgDwAN6gUADeoFAAdlCQAH0RAAB84KAB8JAAAfCQAAHwkAABAAAAgAIA8ADeoFAA3qBQAHZQkQACAPAAdlCRwBICQEH6IIAxsIAAAYNAocASAkHw0gJAAYNAoAEyAkHw0gJAATICQAQdCXCAunMgQfhEUCH3YOAR0OAQAZOQkDH6trABtgOgAXRhkAEflIABN0cwAQlFAHHxM9Ax9hDQEdzgAAGTkJFAB4aAAbYDoAF0YZABH5SBgIeGgAEflIAB99AAAffQAAH30AABIIAAASQhEADqAGAA6gBgAIaAoACFgTAAhMDAEfSAABH0gAAR9IAAASCAAJAEIRAA6gBgAOoAYACGgKEgBCEQAIaAoeACAkBh/9CQMcCgAAGTUJHgAgJB4PICQAGTUJABQiJB4PICQAFCIkAAAEAAAABAAAAAQAAAAEAAABAAAAAQAAAAEAAAAABAAAAAQAAAAEAAUfkkoCH/YRAR6WAQAarAgDHxtuAB0LOAAZ6RUAEuBGABQJdQARTU8IH9I+BB+zDwIezgAAGqwIFQF4aAAdCzgAGekVABLgRhsIeGgAEuBGAR8IAQEfCAEBHwgBARNIAAAVQhEAEIQFABCEBQAKdAkACQIUAAm1CwIfdQACH3UAAh91AAETCAAKAUIRABCEBQAQhAUACnQJFQBCEQAKdAkfASAkCB9xCwQdCgAAGkgIHwEgJBsSICQAGkgIABUiJBsSICQAFSIkAQBEAAEARAABAEQAAQBEAAAEAQAABAEAAAQBAAACAAAAAhkAAAIZAAcfvVADH5oWAh9xAgEb6wgEH2lxAB7jNQAaohIAEgNFABXZdgASZE4JHzNBBR/pEgMfzQABG6sIFwB7aAAe4zUAGqISABIDRR4Ie2gAEgNFAh9NAgIfTQICH00CARS6AAAYQhEAEmUEABJlBAAKiggACw4VAApjCwMfqQADH6kAAx+pAAIUDQAMAEIRABJlBAASZQQACooIGABCEQAKiggfBCAkCh80DQYeCAAAG6IHHwQgJB4SICQAG6IHABYgJB4SICQAFiAkAQC5AAEAuQABALkAAQC5AAAHAAAABwAAAAcAAAADCQAAA0kAAANJAAcfSVQEH40aAx/ZAwEcsggFH/xyAB++MgAbuw8AFB1CABfkdgASpEwLHwVBBx+MFAQf6AACHF0IGAGTZgAfvjIAG7sPABQdQh8Jk2YAFB1CAx/ZAwMf2QMDH9kDAhV6AQAbQhEAFIkDABSJAwAM1QcADAMWAAuGCwQf6AAEH+gABB/oAAMVDQANAUIRABSJAwAUiQMADNUHGwBCEQAM1QcfBxQjCx8RDgcfBAAAHIEGHwcUIx8TFCMAHIEGABcUIx8TFCMAFxQjAgB5AQIAeQECAHkBAgB5AQAKAAAACgAAAAoAAAAFAAAABJIAAASSAAcfyVIEH40bAx/JBQIcLQgGH5luAB+OLAAclQsAFK06ABfkcAATS0YLHxU8Bx8MEwUfRQEDHPoGGQEzXwAfjiwAHJULABStOhsMM18AFK06Ax/JBQMfyQUDH8kFAhdtAgAeQhEAFagCABWoAgAN9AYADf0WAAyGCwUfRQEFH0UBBR9FAQQWCAAPAEIRABWoAgAVqAIADfQGHgBCEQAN9AYfCAIfDB90DAgfAAAAHYQEHwgCHx4UAh8AHYQEABcUHx4UAh8AFxQfAgBpAgIAaQICAGkCAgBpAgANAAAADQAAAA0AAAAGCQAABekAAAXpAAgfWVEFH0YdBB8pCAIdsgcHH4VqAB9eJwAc5QcAFZQzABn4agAUDkAMH0Q3CB/SEQcfiAEEHaUFGgEoWAAfXicAHOUHABWUMx8LKFgAFZQzBB8pCAQfKQgEHykIAxeyAwAfdBEAFwkCABcJAgAOJQYAD1MYAA1dCwcfiAEHH4gBBx+IAQUXCAAQAUIRABcJAgAXCQIADiUGHwFCEQAOJQYfCjQbDh/hCgofBAAAHeQCHwo0Gx8UNBsAHeQCABg6Gx8UNBsAGDobAwCpAwMAqQMDAKkDAwCpAwAQAQAAEAEAABABAAAIAQAABnkBAAZ5AQgf7VAGH0wfBR+OCwMdCQgHH4NmAB+6IgAdggQAFj0sABn+ZAAVTzkNH34yCh/ZEAgf5QEFHVIEGQWiUAAfuiIAHYIEABY9LB8MolAAFj0sBR+OCwUfjgsFH44LAxlRBQEfJBIAGVEBABlRAQAPlQUAEMQZAA6lCwgf5QEIH+UBCB/lAQYYDQAQBEIRABlRAQAZUQEAD5UFHARCEQAPlQUfCzUXDx9JCQsfAQAAHoQBHws1Fx8VNRcAHoQBABhBFx8VNRcAGEEXAwBQBQMAUAUDAFAFAwBQBQATAAAAEwAAABMAAAAKBAAACCQCAAgkAgkf6VAHH38hBR/eDgMe1AgHHwNkAB+qHwAdggIAFk0mABpmYAAVLzQPH2ouCx+mDwkfVAIGHTIDHAFNSgIfgh8AHYICABZNJh8NTUoAFk0mBR/eDgUf3g4FH94OBBobBwIfYhMAG+gAABvoAAAQ9AQAEQ4bAA82DAkfVAIJH1QCCR9UAgcZDQARBUIRABvoAAAb6AAAEPQEHwRCEQAQ9AQfDe0TEB/6Bw0fBAAAHqQAHw3tEx8W7RMAHqQAABnxEx8W7RMAGfETBAAaBwQAGgcEABoHBAAaBwAWAAAAFgAAABYAAAALAAAACbkCAAm5AgofqVEHHx8kBh+zEgQe8wkIH9JhAR9xHQAeCAEAFwEhABvhWwAWbS8PHyoqDB/KDgof1QIIHW0CHQFNRAMfahwAHggBABcBIRsQTUQAFwEhBh+zEgYfsxIGH7MSBBsTCQMfChUAHYIAAB2CAAASSAQAE8QcABGZDAof1QIKH9UCCh/VAggaCAAVAEIRAB2CAAAdggAAEkgEHgZCEQASSAQfDuUQEh/JBg4fAQAAH0AAHw7lEB4X5RAAH0AAABnxEB4X5RAAGfEQBAAKCQQACgkEAAoJBAAKCQAZAAAAGQAAABkAAAAMBAAACp0DAAqdAwsfHVIIH3onBx+7FgQe0wsIH5JgAh+CGwAfUQAAGAEcAB3DVwAWfSsQH40mDB8KDgsfNQMIHqQBHgGiPgQfnhkAH1EAABgBHB8Poj4AGAEcBx+7FgcfuxYHH7sWBRxjCwMfShcAHkgAAB5IAAASyAMAFGUeABHpDAsfNQMLHzUDCx81AwkbCAAWAUIRAB5IAAAeSAAAEsgDHwdCEQASyAMfDyEOEx+qBQ8fCQAAHwAAHw8hDh8XIQ4AHwAAABohDh8XIQ4AGiEOBQBaCwUAWgsFAFoLBQBaCwAcAQAAHAEAABwBAAAOAAAAC4QEAAuEBAsfhVMIH7IrBx8BHAUfMQ4JH99fAx9qGgAfUQAAGLsWAB1VUwAXeicRH/siDh9pDQwf1AMKHvIAHQWoOAYfyhYBH0oAABi7Fh8QqDgAGLsWBx8BHAcfARwHHwEcBR4iDgQfZRoAH1EAAB9RAAAUNQMAFTUgABLLDQwf1AMMH9QDDB/UAwocDQAYAEIRAR9KAAEfSgAAFDUDGAxCEQAUNQMdFUgLFB+EBBEfAQADHwEAHRVICx8YSAsDHwEAABpaCx8YSAsAGloLBQAhDgUAIQ4FACEOBQAhDgAfAAAAHwAAAB8AAAAPCQAADY0FAA2NBQwfvVUJH08wCB8BIQYf8hAKHxhgAx/6GQEfKgEAGVoSAB5fUAAYHyQRHxsgDx+kDA0fhQQLHnoAHwOzMwcfjBQDH5EAABlaEh8RszMAGVoSCB8BIQgfASEIHwEhBh/yEAUf8x0BHyoBAR8qAQAVqAIAF0siABPKDg0fhQQNH4UEDR+FBAsdDQAZAUIRAx+RAAMfkQAAFagCGwxCEQAVqAIfEwoJFh+1AxMfBAAGHwEAHxMKCR8ZCgkGHwEAABsKCR8ZCgkAGwoJBgDxEAYA8RAGAPEQBgDxEAAfQAAAH0AAAB9AAAARAAAADa0GAA2tBgwfHVgKHxE1CR/GJgYfQhQLHzxgAx+KGgIftAIAGosOAB98TQAZ+iATH/kcEB82DA8f9AQMH0QAHQkTLwgfmhIEH+gAABqLDhsUEy8AGosOCR/GJgkfxiYJH8YmBh9CFAUf8yECH7QCAh+0AgAWLQIAGUQkABVZDw8f9AQPH/QEDx/0BAweCAAbAEIRBB/oAAQf6AAAFi0CHgxCEQAWLQIfFAgHFh/VAhQfAAAJHwEAHxQIBx4aCAcJHwEAABsaBx4aCAcAGxoHBgDxEwYA8RMGAPETBgDxEwEfuQABH7kAAR+5AAASCQAAD/oHAA/6BwwffVsLHwI6CR/GLAcfBRgLHxxhBB+NGwIf1AQAGksLAB88SwAZih4TH2kaER8jDBAflQUNHwgAHwfIKgofzBAGH2EBABpLCx8TyCoAGksLCR/GLAkfxiwJH8YsBx8FGAcfdSYCH9QEAh/UBAAX5QEAGSQmABVZEBAflQUQH5UFEB+VBQ0fCAAcAUIRBh9hAQYfYQEAF+UBHw1CEQAX5QEfFkoFFx8kAhYfBAAMHwAAHxZKBR4bSgUMHwAAABxQBR4bSgUAHFAFBwBBFwcAQRcHAEEXBwBBFwEfqQEBH6kBAR+pAQAUAQAAEUQJABFECQ0fu18LHw5ACh8lNAgfJB0LH0pjBB/fHQMf5QcAGykIAB/mSQAahhwUH9IXEh/dCxEfaAYOHxkAHQ1aJgwfIg8IHwkCABspCB8UWiYAGykICh8lNAofJTQKHyU0CB8kHQcfuysDH+UHAx/lBwAYiAEAG+goABfSEREfaAYRH2gGER9oBg4fGQAcBEIRCB8JAggfCQIAGIgBHBBCEQAYiAEfF50DGB+CARcfAQAPHwEAHxedAx8bnQMPHwEAABypAx8bnQMAHKkDBwA6GwcAOhsHADobBwA6GwIfEQMCHxEDAh8RAwAWBAAAEbUKABG1Cg4fP2QMH0tGCx+tOggfJCIMH5NlBh/PIAMflQsAHMkFAB/GSQAaZhsVHwIWEx+GCxIfPQcQH0gAHwvFIg4f+g0KH7oCABzJBR8VxSIAHMkFCx+tOgsfrToLH606CB8kIggfZjEDH5ULAx+VCwAaJAEAHSsrABgMExIfPQcSHz0HEh89BxAfSAAdBUIRCh+6AgofugIAGiQBHxBCEQAaJAEfGWUCGh/1ABkfBAASHwEAHxllAhseZQISHwEAAB1pAhseZQIAHWkCCAAUHwgAFB8IABQfCAAUHwMfsQQDH7EEAx+xBAAXAAAAEnEMABJxDA8fW2gMH8tMCx8dQgkf+CcMH9NoBh//IwQfuw8AHNkDAB+mSgAbjRoWH3YUFB+GCxMf1QcRH7QAHRGFHw8f8gwLH4kDABzZAxsYhR8AHNkDCx8dQgsfHUILHx1CCR/4JwgfZjcEH7sPBB+7DwAb6AAAHWstABn9ExMf1QcTH9UHEx/VBxEftAAfBEIRCx+JAwsfiQMAG+gAHhJCEQAb6AAfGm0BGx+SABofAQAVHwEAHxptAR4dbQEVHwEAAB15AR4dbQEAHXkBCAAUIwgAFCMIABQjCAAUIwMfgQYDH4EGAx+BBgAYBAAAFBEOABQRDg8fu2cNH2ZPDB87RQofkSoNH+ZnBx83JQUfRhMAHU4CAB+uSAAcmhYXH6ISFR/hCxQfoggSH0UBHw+aHBAfNgwOH3kEAB0qAh8XmhwAHSoCDB87RQwfO0UMHztFCh+RKgkf9DoFH0YTBR9GEwAczQAAH3UsABplEhQfoggUH6IIFB+iCBIfRQEfB0IRDh95BA4feQQAHKkAHxNCEQAcqQAfG7kAHB9JABsfCQAYHwAAHxu5AB8duQAYHwAAAB65AB8duQAAHrkACQAgJAkAICQJACAkCQAgJAQfogcEH6IHBB+iBwEZCAAAFQINABUCDRAfZmUPH/RPDR+RRwsfaywPH5RkCB+HJgcfNBYBHnUBAB+/RgAdZBEYH1URFx8MDBYfxAkTHyoCHRW4GRIftAsPH4QFAB7tAB8YuBkAHu0ADR+RRw0fkUcNH5FHCx9rLAsfLT0HHzQWBx80FgEdzgAAH4YqABuzDxYfxAkWH8QJFh/ECRMfKgIcEEIRDx+EBQ8fhAUAHWQAGBhCEQAdZAAfHTQAHh8ZAB0fAQAbHwEAHx00AB8eNAAbHwEAAB5EAB8eNAAAHkQACgAiJAoAIiQKACIkCgAiJAUflQgFH5UIBR+VCAIbBQAAF3ELABdxCxEfBGQPH5RQDx8ESQwfZC4QH3FiCh+NKAgfRhkCHg4BAh8ERgAdBA4ZH6MQFx9MDBcfaAoUHzQDHxODFxMfhgsQH7UGAB59AB8ZgxcAHn0ADx8ESQ8fBEkPHwRJDB9kLgwfdD8IH0YZCB9GGQIezgAAH2YqAB0EDRcfaAoXH2gKFx9oChQfNAMdEUIREB+1BhAftQYAHj0AGxhCEQAePQAfHwQAHx8EAB8fBAAeHwEAHx8EAB8fBAAeHwEAAB8EAB8fBAAAHwQACwAiJAsAIiQLACIkCwAiJAYfiAkGH4gJBh+ICQMbCgAAGc0JABnNCRIfYl8QH3dNDx/gRg0fZC4QH4VcCx8fJwgf7hkDH6oAAx/vQQAesgoZH3MOGB/OChgfZQkVHzQDHxQsFBQfGAoSHxAGAB8JAB4aLBQAHwkADx/gRg8f4EYPH+BGDR9kLgwfUD0IH+4ZCB/uGQQehAAAH6YnAB1AChgfZQkYH2UJGB9lCRUfNAMfDyAPEh8QBhIfEAYAHwkAHxcgDwAfCQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAADAAgJAwAICQMACAkDAAgJAcfNAoHHzQKBx80CgQcCAAAG6IIABuiCBMf6lgRH7xJEB9GQw4fQS0RHzRWCx9PJQofbRkFH0QABB/8PAAeMggaHxEMGB8eCRgftQcWH5UCHRmrEBYfZggTHwUFAh8AABscqxACHwAAEB9GQxAfRkMQH0ZDDh9BLQ0fwjkKH20ZCh9tGQUfRAAAH5YkAB7yBxgftQcYH7UHGB+1BxYflQIfEIIMEx8FBRMfBQUCHwAAHhiCDAIfAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAADQAgJA0AICQNACAkDQAgJAgfHQsIHx0LCB8dCwUdCAAAHUAHAB1ABxMfqFISH3BFER/JPw8fEiwRH4ZPDB+KIwsfphgGHwUABh/PNwAfHQYbH2wJGR9GBxkfJQYXH/0BHBwhDRYfmwYUH/0DBR8BABwcIQ0FHwEAER/JPxEfyT8RH8k/Dx8SLA8fWjULH6YYCx+mGAYfBQACH/IhAB8dBhkfJQYZHyUGGR8lBhcf/QEfEtkJFB/9AxQf/QMFHwEAHhnZCQUfAQAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAADgAiJA4AIiQOACIkDgAiJAkfaAwJH2gMCR9oDAYfBQAAHhQGAB4UBhQfYk0TH2VBEh/gPBAfMSsTHyFJDh+cIgwfWhgHHwoABx+aMwAfLQUbH0wHGh+4BRof9AQYH40BHxdZChcfMQUWHxoDCB8AAB8bWQoIHwAAEh/gPBIf4DwSH+A8EB8xKw8fOjIMH1oYDB9aGAcfCgADH9YfAB8tBRof9AQaH/QEGh/0BBgfjQEfE8UHFh8aAxYfGgMIHwAAHxnFBwgfAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAADwAiJA8AIiQPACIkDwAiJAsfJQ0LHyUNCx8lDQcfCgAAHy0FAB8tBRQfwkgTH+U9Ex+kOREfkSoTH5FDDx/6IA0fjRgIH0QACB/DLwAfPQUbH6wFGx9BBBsfyAMZH0UBHxjiBxgf8wMXH10CCx8AAB4c4gcLHwAAEx+kORMfpDkTH6Q5ER+RKhAfLS8NH40YDR+NGAgfRAAEHwYeAB89BRsfyAMbH8gDGx/IAxkfRQEfFekFFx9dAhcfXQILHwAAHxrpBQsfAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAEAAgJBAAICQQACAkEAAgJAwfKg4MHyoODB8qDggfRAAAHz0FAB89BRUfREQUH5Y6FB8SNxIfsCkUH5I+Dx/aHw8fShgJH8gACh9KLAAfTQYcHxEEGx8hAxsfqAIaH+gAHR3BBRof8QIYH7oBDh8AAB8cwQUOHwAAFB8SNxQfEjcUHxI3Eh+wKREfvSwPH0oYDx9KGAkfyAAGH2YcAB9NBhsfqAIbH6gCGx+oAhof6AAcHFEEGB+6ARgfugEOHwAAHBxRBA4fAAAfHwAAHx8AAB8fAAAfHwAAHx8AAB8fAAAfHwAAAB8AAB8fAAAAHwAAEQAgJBEAICQRACAkEQAgJA0fWQ8NH1kPDR9ZDwkfyAAAH00GAB9NBgAEEgAAAwQAAAIAAAACCQAAAyQAAAIWAAACDQAAARgAAAEpAAABGQAABBIAAAMEAAACAAAAAgkAAQEkAAACFgAAAg0AAAEYAAMAJAAAARgAAAIAAAACAAAAAgAAAAEAAAABAgAAAQEAAAEBAAAABAAAAAQAAAAEAAACAAAAAgAAAAIAAAABAAAAAQIAAAEBAAABAQAAAAQAAQACAAAABAACABIAAAMEAAACAAAAAgkAAgASAAQAEgAAAgkAAAEUAAQAEgAAARQAQaDKCAvXOwEIJgABBhUAAQQYAAEEGAAACDQAAAUSAAAEAQAAAxgAAARNAAADKAACBhYAAQYFAAIEBAABBAgABAA0AAAFEgAABAEAAAMYAAgANAAAAxgAAQYUAAEGFAABBhQAAQMVAAAGCAAABAEAAAQBAAACBQAAAxgAAAIJAAIEBAACBAQAAgQEAAIDBAADAAgAAQMBAAEDAQABAgQABgAIAAECBAAFABIAAQYBAAIEAAAABAAABQASAAoAEgAABAAAAAMUAAoAEgAAAxQAAQAUAAEAFAABABQAAQAUAAAFAAAABQAAAAUAAAACAQAAAgUAAAIFAAMKJgADCBUAAwYYAAMGGAACCjQAAgcSAAIGAQACBRgAAAc1AAEFFQAECBYAAwgFAAQGBAADBggABwA0AAIHEgACBgEAAQUUAA4ANAABBRQAAwgUAAMIFAADCBQAAwUVAAIICAACBgEAAgYBAAIEBQAABggAAQUFAAQGBAAEBgQABAYEAAQFBAAGAAgAAwUBAAMFAQADBAQADAAIAAMEBAAIABIAAwgBAAQGAAACBgAACAASABAAEgACBgAAAAUUABAAEgAABRQAAwAUAAMAFAADABQAAwAUAAIHAAACBwAAAgcAAAIEAQABBQEAAQUBAAUMJgAFChUABQgYAAUIGAAEDDQABAkSAAQIAQAEBxgAAgk1AAMHFQAGChYABQoFAAYIBAAFCAgAAhAzAAQJEgAECAEAAwcUABQAMwADBxQABQoUAAUKFAAFChQABQcVAAQKCAAECAEABAgBAAQGBQACCAgAAwcFAAYIBAAGCAQABggEAAYHBAAJAAgABQcBAAUHAQAFBgQAEgAIAAUGBAALABIABQoBAAYIAAAECAAACwASABYAEgAECAAAAAcUABYAEgAABxQABQAUAAUAFAAFABQABQAUAAQJAAAECQAABAkAAAQGAQADBwEAAwcBAAcPJAAHDBMABwocAAcKFAAGDzQABgsWAAYKBwAGCRwAAww0AAUJGwAIDRMACAsDAAgKAwAICgYADQEzAAYLFQAHCgMABQkbABsAMwAFCRsABwwTAAcMEwAHDBMABwoTAAYNCQAGCgYABgoGAAYJAwAFCgkABQkCAAgKAgAICgIACAoCAAgJAgAMAQgABwoCAAcKAgAFCQIAGQAIAAUJAgAOARIABwwBAAgKAgAGCgIADgESAA8HEgAGCgIAAAkaAA8HEgAACRoABwASAAcAEgAHABIABwASAAYLAgAGCwIABgsCAAYJAgAFCQEABQkBAAkQJgAJDhMACQwcAAkMFAAIETQACA0WAAgMBwAICxwABQ40AAcLGwAKDxMACg0DAAoMAwAKDAYAEAEzAAgNFQAJDAMABwsbACEAMwAHCxsACQ4TAAkOEwAJDhMACQwTAAgPCQAIDAYACAwGAAgLAwAHDAkABwsCAAoMAgAKDAIACgwCAAoLAgAPAQgACQwCAAkMAgAHCwIAHwAIAAcLAgARABIACQ4BAAoMAgAIDAIAEQASACIAEgAIDAIAAAsaACIAEgAACxoACQASAAkAEgAJABIACQASAAgNAgAIDQIACA0CAAgLAgAHCwEABwsBAAsSJgALEBMACw4cAAsOFAAKEzQACg8WAAoOBwAKDRwABxA0AAkNGwAMEBUADA8DAAwOAwAMDgYAEwEzAAoPFQALDgMACQ0bACcAMwAJDRsACxASAAsQEgALEBIACw4TAAoRCQAKDgYACg4GAAoNAwAJDgkACQ0CAAwOAgAMDgIADA4CAAwNAgAPBwgACw4CAAsOAgAJDQIAHwMIAAkNAgAUABIACxABAAwOAgAKDgIAFAASACgAEgAKDgIAAA0aACgAEgAADRoACwASAAsAEgALABIACwASAAoPAgAKDwIACg8CAAoNAgAJDQEACQ0BAA0UJgANEhMADRAbAA0QEwAMFTQADBETAAwQBQAMDxwAChE0AAsPGwAOEhUADhEDAA4QAQANEAoAFgEzAAwREgANEAIACw8bAC0AMwALDxsADRISAA0SEgANEhIADRATAAwTCQAMEAUADBAFAAwPAwAKEAsACw8CAA4QAQAOEAEADhABAA4PAgAPDQgADRACAA0QAgALDwIAHwYIAAsPAgAXABIADRIBAA4QAAAMEAAAFwASAC4AEgAMEAAAAA8aAC4AEgAADxoADQASAA0AEgANABIADQASAAwRAQAMEQEADBEBAAwPAgALDwEACw8BAA8XJgAPFBUADxIlAA8SFQAPFjcADxMXAA8SBQAOER4ADRM4AA0RHAAQFRMAEBMDABASAwAQEgYAEREzAA8TEwAPEgEADhEaADMAMwAOERoADxUUAA8VFAAPFRQADxIUAA8TDgAPEgQADxIEAA4RBQANEgkADREDABASAgAQEgIAEBICABARAgAYAQgADxIAAA8SAAAOEQEAMQAIAA4RAQAaARIADxQBABASAgAPEgEAGgESADUAEgAPEgEAABEaADUAEgAAERoADwAUAA8AFAAPABQADwAUAA8SBAAPEgQADxIEAA4RBAANEQIADRECABEZJAARFhMAERQcABEUFAAQGTQAEBUWABAUBwAQExwADxU4AA8THAASFxMAEhUDABIUAwASFAYAFBEzABAVFQARFAMADhQaADkAMwAOFBoAERYTABEWEwARFhMAERQTABAXCQAQFAYAEBQGABATAwAPFAkADxMDABIUAgASFAIAEhQCABITAgAbAQgAERQCABEUAgAPEwIANwAIAA8TAgAdARIAERYBABIUAgAQFAIAHQESADsAEgAQFAIAABMaADsAEgAAExoAEQASABEAEgARABIAEQASABAVAgAQFQIAEBUCABATAgAPEwIADxMCABMbJAATGBMAExYcABMWFAASGzQAEhcWABIWBwASFRwADxg4ABEVGwAUGRMAFBcDABQWAwAUFgYAFxEzABIXFQATFgMAERUbAD8AMwARFRsAExgTABMYEwATGBMAExYTABIZCQASFgYAEhYGABIVAwARFgkAERUCABQWAgAUFgIAFBYCABQVAgAeAQgAExYCABMWAgARFQIAPQAIABEVAgAfAxIAExgBABQWAgASFgIAHwMSAD8BEgASFgIAABUaAD8BEgAAFRoAEwASABMAEgATABIAEwASABIXAgASFwIAEhcCABIVAgARFQEAERUBABUdJAAVGhMAFRgcABUYFAAUHTQAFBkWABQYBwAUFxwAERo0ABMXGwAWGxMAFhkDABYYAwAWGAYAIgEzABQZFQAVGAMAExcbAD8DMwATFxsAFRoTABUaEwAVGhMAFRgTABQbCQAUGAYAFBgGABQXAwATGAkAExcCABYYAgAWGAIAFhgCABYXAgAhAQgAFRgCABUYAgATFwIAPwIIABMXAgAfCRIAFRoBABYYAgAUGAIAHwkSAD8EEgAUGAIAABcaAD8EEgAAFxoAFQASABUAEgAVABIAFQASABQZAgAUGQIAFBkCABQXAgATFwEAExcBABcfKAAXHRgAFxshABcaGAAXHjcAFhwYABcaCAAWGhwAFBwzABUaFQAYHRQAGBwBABgbBAAYGgUAJgAzABYcFAAXGgQAFBoUAD4HMwAUGhQAFx0UABcdFAAXHRQAFxoUABccDAAXGgQAFxoEABYZBAAUGwkAFhkEABgbAAAYGwAAGBsAABgaAQAfDAgAFxoAABcaAAAWGQAAPgYIABYZAAAmARIAGBwBABgbBAAXGgQAJgESAC0QEgAXGgQAABoUAC0QEgAAGhQAFwAUABcAFAAXABQAFwAUABcaBAAXGgQAFxoEABYZBAAVGgEAFRoBABkhJgAZHxgAGR0hABkcGAAZIDcAGB4YABkcCAAYHBwAFh4zABccFQAaHxQAGh4BABodBAAaHAUAKQAzABgeFAAZHAQAFhwUAD4KMwAWHBQAGR8UABkfFAAZHxQAGRwUABkeDAAZHAQAGRwEABgbBAAWHQkAGBsEABodAAAaHQAAGh0AABocAQAfEggAGRwAABkcAAAYGwAAPgkIABgbAAApARIAGh4BABodBAAZHAQAKQESADMQEgAZHAQAABwUADMQEgAAHBQAGQAUABkAFAAZABQAGQAUABkcBAAZHAQAGRwEABgbBAAXHAEAFxwBABsjJgAbIBUAGx8hABseGAAbIjcAGiAYABseCAAaHhwAGR84ABkeFQAcIRIAHCACABwfBAAcHgUALAAzABogFAAbHgQAGB4UAD4NMwAYHhQAGyEUABshFAAbIRQAGx4UABsfDgAbHgQAGx4EABodBAAYHwkAGh0EABwfAAAcHwAAHB8AABweAQAiEQgAGx4AABseAAAaHQAAPgwIABodAAAsARIAGyABABwfBAAbHgQALAESADkQEgAbHgQAAB4UADkQEgAAHhQAGwAUABsAFAAbABQAGwAUABseBAAbHgQAGx4EABodBAAZHgEAGR4BAB0lJgAdIhUAHSAlAB0gFQAdJDcAHSEXAB0gBQAcICcAGyE4ABogHgAeIxIAHiICAB4gAgAeIAUALwAzAB0hEwAdIAEAGiAaAC4YMwAaIBoAHSMUAB0jFAAdIxQAHSAUAB0hDgAdIAQAHSAEABwfBAAbIAkAHB8EAB4hAAAeIQAAHiEAAB4fBAAlEQgAHSAAAB0gAAAcHwAAPg8IABwfAAAvARIAHSIBAB4gAgAdIAEALwESAD8QEgAdIAEAACAaAD8QEgAAIBoAHQAUAB0AFAAdABQAHQAUAB0gBAAdIAQAHSAEABwfBAAcHwQAHB8EAB8oLAAfJRwAICMoAB8iHwAfJjUAHyMVAB8iBwAfIh4AHCQzAB0iFQAgJRQAICQBACAjBAAgIgUAMgAzAB4kEwAfIgYAHCIVAD4TMwAcIhUAHyYaAB8mGgAfJhoAHyIbAB8kCQAfIgMAHyIDAB8hAgAdIgoAHiECACAjAAAgIwAAICMAACAiAQAxAAgAHyICAB8iAgAeIQEAPhIIAB4hAQAvCBIAICQBACAjBAAfIgUALwgSAD4UEgAfIgUAACIUAD4UEgAAIhQAHwAaAB8AGgAfABoAHwAaAB8jAQAfIwEAHyMBAB8hAgAdIgEAHSIBACEpKAAhJxgAISUhACEkGAAhKDcAICYYACEkCAAgJBwAHiYzAB8kFQAiJxQAIiYBACIlBAAiJAUANQAzACAmFAAhJAQAHiQVAD4WMwAeJBUAIScUACEnFAAhJxQAISQUACEmDAAhJAQAISQEACAjBAAfJAoAICMEACIlAAAiJQAAIiUAACIkAQA0AAgAISQAACEkAAAgIwAAPhUIACAjAAAvDhIAIiYBACIlBAAhJAQALw4SAD4XEgAhJAQAACQUAD4XEgAAJBQAIQAUACEAFAAhABQAIQAUACEkBAAhJAQAISQEACAjBAAfJAEAHyQBACMrKAAjKRgAIychACMmGAAjKjcAIigYACMmCAAiJhwAICgzACEmFQAkKRQAJCgBACQnBAAkJgUAOAAzACIoFAAjJgQAICYUAD4ZMwAgJhQAIykUACMpFAAjKRQAIyYUACMoDAAjJgQAIyYEACIlBAAgJwkAIiUEACQnAAAkJwAAJCcAACQmAQA3AAgAIyYAACMmAAAiJQAAPhgIACIlAAAwERIAJCgBACQnBAAjJgQAMBESAD4aEgAjJgQAACYUAD4aEgAAJhQAIwAUACMAFAAjABQAIwAUACMmBAAjJgQAIyYEACIlBAAhJgEAISYBACUtKAAlKxgAJSkhACUoGAAlLDcAJCoYACUoCAAkKBwAIiozACMoFQAmKxQAJioBACYpBAAmKAUAOwAzACQqFAAlKAQAIigUAD4cMwAiKBQAJSsUACUrFAAlKxQAJSgUACUqDAAlKAQAJSgEACQnBAAiKQkAJCcEACYpAAAmKQAAJikAACYoAQA6AAgAJSgAACUoAAAkJwAAPhsIACQnAAAzERIAJioBACYpBAAlKAQAMxESAD4dEgAlKAQAACgUAD4dEgAAKBQAJQAUACUAFAAlABQAJQAUACUoBAAlKAQAJSgEACQnBAAjKAEAIygBACguLAAoLBsAKCscACcrHAAnLzQAJywWACcrAwAmKhwAJCw1ACUqEwAoLhMAKCwCACgrAwAoKgoAPgEzACYsEwAnKwIAJSoSAD8fMwAlKhIAKCwaACgsGgAoLBoAKCoaACcsCwAnKwIAJysCACcpAgAlKwsAJikDACgsAQAoLAEAKCwBACgqAQA1EAgAKCoBACgqAQAnKQEAPx4IACcpAQA/ABIAKCwBACgrAgAmKwEAPwASAD4gEgAmKwEAACoSAD4gEgAAKhIAJwAaACcAGgAnABoAJwAaACcrAQAnKwEAJysBACcpAQAlKgEAJSoBACowLAAqLhsAKi0cACktHAApMDUAKS4WACktAwAoLBwAJi41ACcsEwAqMBMAKi4CACotAwAqLAoAPwUzACguEwApLQIAJywSAC8qMwAnLBIAKi4aACouGgAqLhoAKiwaACkuCwApLQIAKS0CACkrAgAnLQsAKCsDACouAQAqLgEAKi4BACosAQA4EAgAKiwBACosAQApKwEAPiEIACkrAQA/BhIAKi4BACotAgAoLQEAPwYSAD4jEgAoLQEAACwSAD4jEgAALBIAKQAaACkAGgApABoAKQAaACktAQApLQEAKS0BACkrAQAnLAEAJywBACwyLAAsMBoALC8cACsvHAArMjUAKy8bACsvAwAqLhwAKDAzACkuEwAsMhMALDABACwvAwAsLgoAPwszACowEwArLwIAKS4SAC8tMwApLhIALDAaACwwGgAsMBoALC4aACswCQArLwIAKy8CACstAgApLwsAKi0DACwwAQAsMAEALDABACwuAQA7EAgALC4BACwuAQArLQEAPiQIACstAQA/DBIALDAAACwvAgAqLwEAPwwSAD4mEgAqLwEAAC4SAD4mEgAALhIAKwAaACsAGgArABoAKwAaACsvAQArLwEAKy8BACstAQApLgEAKS4BAC40LAAuMhoALjEfAC0wHwAtNDUALTEVAC0wBwAtMB4AKjIzACswFQAuNBMALjIBAC4xBgAuMAYANyAzACwyEwAtMAYAKjAVAC4wMwAqMBUALjIaAC4yGgAuMhoALTAbAC0yCQAtMAMALTADAC0vAgArMAoALC8DAC4yAQAuMgEALjIBAC4wAgA+EAgALTACAC0wAgAtLwEAPicIAC0vAQA/EhIALjIAAC8wBAAtMAUAPxISAD4pEgAtMAUAADAUAD4pEgAAMBQALQAaAC0AGgAtABoALQAaAC0xAQAtMQEALTEBAC0vAQArMAEAKzABADA2LAAwNBsAMDMcADAyIwAvNzMALzQVAC8zAwAvMhYALTQ0AC0yEwAwNhMAMDQCADAzAwAwMgoAPxczAC80FQAvMwMALTISAD8rMwAtMhIAMDQaADA0GgAwNBoAMDIaAC81CAAvMwIALzMCAC8xAQAtMwgALjEFADA0AQAwNAEAMDQBADAyAQA/FQgAMDIBADAyAQAvMQEAPyoIAC8xAQA/GRIAMDQBADAzAgAuMwEAPxkSAD8sEgAuMwEAADISAD8sEgAAMhIAMAAaADAAGgAwABoAMAAaAC8zAQAvMwEALzMBAC8xAAAtMgEALTIBADI4LAAyNhsAMjUcADE1HAAxOTQAMTYWADE1AwAwNBwALzY0AC80EwAyOBMAMjYCADI1AwAyNAoAPx0zADA2EwAxNQIALzQSAD8uMwAvNBIAMjYaADI2GgAyNhoAMjQaADE2CwAxNQIAMTUCADEzAgAvNQgAMDMDADI2AQAyNgEAMjYBADI0AQA/GwgAMjQBADI0AQAxMwEAPy0IADEzAQA/HxIAMjYBADI1AgAwNQEAPx8SAD8vEgAwNQEAADQSAD8vEgAANBIAMQAaADEAGgAxABoAMQAaADE1AQAxNQEAMTUBADEzAQAvNAEALzQBADQ6LAA0OBsANDccADM3HAAzOzQAMzgWADM3AwAyNhwAMDg1ADE2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LgfzAAkVSQAQG1AAEBtQABAbUAAQFVEADhs1AA4XAwAOFwMADhMGAAoXNAALFAYAERkAABEZAAARGQAAERUAABsBMgAPFgAADxYAAA0TBQA3ADIADRMFABcRSAARGQEAEhcEAA8WBAAXEUgAPwBIAA8WBAAAFUgAPwBIAAAVSAAQAFAAEABQABAAUAAQAFAADhgBAA4YAQAOGAEADhMCAAsUAgALFAIAEiGYABIcUQASGW0AERhUABAh8wAQG04AEBkIABAXbAALG/QADRdMABMfSAATGwEAExkIABMYDQAgAfMADxtLABEYBQALF0kALgrzAAsXSQASHVAAEh1QABIdUAARGFAAEB0yABAZBAAQGQQAEBUFAAwZNAANFgYAExsAABMbAAATGwAAExcAAB4BMgARGAEAERgBAA8VBQA9ADIADxUFACIBSAATGwEAFBkEABEYBAAiAUgAPwNIABEYBAAAF0gAPwNIAAAXSAARAFAAEQBQABEAUAARAFAAEBkAABAZAAAQGQAAEBUBAA0WAgANFgIAFCOYABQeUQAUG20AExpUABIj8wASHU4AEhsIABIZbAANHfQADxlMABUhSAAVHQEAFRsIABUaDQAjAfMAER1IABMaBQANGUkALg3zAA0ZSQAUH1AAFB9QABQfUAATGlAAEh8yABIbBAASGwQAEhcFAA4bNAAPGAYAFR0AABUdAAAVHQAAFRkAACEBMgATGgEAExoBABEXBAA/AjIAERcEACUBSAAVHQEAFhsEABMaBAAlAUgAPwZIABMaBAAAGUgAPwZIAAAZSAATAFAAEwBQABMAUAATAFAAEhsAABIbAAASGwAAEhcBAA8YAgAPGAIAFiaSABYgTgAWHW8AFhxUABQm9AAUH0oAFB0EABQbZAAOIPcAERtLABckSQAXIAMAFx0LABccDgAnAPMAFB9JABQdAwAQG0oAPgjzABAbSgAWIUoAFiFKABYhSgAWHEsAFCE1ABQdAwAUHQMAFBkKABAdMgASGgIAFx8CABcfAgAXHwIAFxsCAB8MMgAVHAEAFRwBABIaAQA+BjIAEhoBACkASAAXIAIAGB0CABMdAgApAEgAPgpIABMdAgAAG0oAPgpIAAAbSgAWAEoAFgBKABYASgAWAEoAFB4BABQeAQAUHgEAFBkBABIaAQASGgEAGCiSABgiTgAYH28A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KCsEADUQMgAlLQEAJS0BACMqAAA/HjIAIyoAAD8FSAAnMAAAKS0BACQtAAA/BUgALypIACQtAAAAK1AALypIAAArUAAmAEgAJgBIACYASAAmAEgAJS0EACUtBAAlLQQAJSkEACIqAQAiKgEAKDiSACgzTQApL3gAKC9MACc39wAmMU0AJy8FACYtZAAiMfgAIy1RACo0TgApMgQAKi8IACkvFAA/B/MAJjFJACcvAQAjLVAAPyPzACMtUAAoNEgAKDRIACg0SAAoLkgAJzI2ACcvBQAnLwUAJiwIACIvNQAkLAEAKjAEACowBAAqMAQAKi0EADgQMgAnLwEAJy8BACUsAAA+ITIAJSwAAD8LSAApMgAAKy8BACYvAAA/C0gALy1IACYvAAAALVAALy1IAAAtUAAoAEgAKABIACgASAAoAEgAJy8EACcvBAAnLwQAJysEACQsAQAkLAEAKjqSACo1TQArMXkAKjBRACk59wAoM00AKDEJACgvZAAkM/gAJS9RACw2TgArNAQALDEGACswEQA/DfMAKDNJACgxBQAlL1AAPybzACUvUAAqNkgAKjZIACo2SAAqMEgAKTQ2ACkwBgApMAYAKC4IACQxMwAmLgEALDIEACwyBAAsMgQALC8EADsQMgApMAIAKTACACcuAAA+JDIAJy4AADcgSAArNAAALDECACgxAQA3IEgALjBIACgxAQAAL1AALjBIAAAvUAAqAEgAKgBIACoASAAqAEgAKTAFACkwBQApMAUAKS0EACYuAQAmLgEALDySACw3TQAtM3kALDJRACs79wAqNU0AKjMJACoxZwAmNfgAJzFMAC44TgAtNgQALjMGAC0yEQA/E/MAKjVJACozBQAmMUoAPynzACYxSgAsOEgALDhIACw4SAAsMkgAKzY2ACsyBgArMgYAKjAJACYzMwAoMAIALjQEAC40BAAuNAQALjEEAD4QMgArMgIAKzICACgwAQA+JzIAKDABADogSAAtNgAALjMCACozAQA6IEgANDBIACozAQAAMUoANDBIAAAxSgAsAEgALABIACwASAAsAEgAKzIFACsyBQArMgUAKy8EACgwAQAoMAEALj+SAC45TwAvNXMALjVOAC099QAtN00ALTUCACwzaQAnOPMAKjNSADA7TAAwNwkAMDUIAC81EgA7IfMALDdKAC01AQApM1AA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AAcVAQAHFQEABBABAB8GogAEEAEAHAHIAAwaAQAOFQIABxUBABwByAAvBcgABxUBAAATygAvBcgAABPKAAkA0AAJANAACQDQAAkA0AAHFgAABxYAAAcWAAAHDwEAAhEAAAIRAAAMJ5QBDB7UAA0YPgEMF9cACSfUAgkb1AAJGAcACBQyAQAc1AIDFdIADiPLAA4cAgAPGBYADhceABwB0wIHHMsAChcEAAAVyQAvBdMCABXJAAwgygAMIMoADCDKAAwWygAJH6UACRgDAAkYAwAJEg4AAhikAAQTBgAOHAEADhwBAA4cAQAOFQEAGAGiAAoXAAAKFwAABhIFADEAogAGEgUAFxHIAA4cAQAQGAQAChcEABcRyAA/AMgAChcEAAAVyAA/AMgAABXIAAwAygAMAMoADADKAAwAygAJGQEACRkBAAkZAQAJEQIABBMCAAQTAgAOKZQBDiDXAA8aPgEOGdcACynUAgsd1AALGgcAChYyAQIe1AIFF9IAECXIABAeAQARGhgAEBkoAB8B0wIJHssADBkEAAIXyQAvCNMCAhfJAA4iygAOIsoADiLKAA4YygALIaMACxoDAAsaAwALFA4ABBqkAAYVBgAQHgAAEB4AABAeAAAQFwAAGwGiAAwZAAAMGQAACBQFADcAogAIFAUAIgHIABAeAQASGgQADBkEACIByAA/A8gADBkEAAAXyAA/A8gAABfIAA4AygAOAMoADgDKAA4AygALGwEACxsBAAsbAQALEwIABhUCAAYVAgAQK5gBECLYABAcOAEQG90ADSvUAg0f1AANHAcADBgyAQQg1AIHGdIAEifIABIgAQATHBgAERskACIA0wILIMkADhsEAAQZyQAvC9MCBBnJABAj0QAQI9EAECPRABAa0AANI6MADRwDAA0cAwANFg4ABhykAAgXBgASHwEAEh8BABIfAQASGQAAHgGiAA4bAAAOGwAAChYFAD0AogAKFgUAJQHIABIgAQAUHAQADhsEACUByAA/BsgADhsEAAAZyAA/BsgAABnIABAA0AAQANAAEADQABAA0AANHQEADR0BAA0dAQANFQIACBcCAAgXAgASLZgBEiTYABIeOAERHdgADy3UAg8h0gAPHgcADhoyAQYi1AIJG9IAFCnIABQiAQAVHhgAEx0kACUA0wINIskAEB0FAAYbyQAvDtMCBhvJABIl0QASJdEAEiXRABIc0AAPJaMADx4DAA8eAwAPGA4ACB6kAAoZBgAUIQEAFCEBABQhAQAUGwAAIQGiABAdAQAQHQEADBgFAD8CogAMGAUAKAHIABQiAQAWHgQAEB0EACgByAA/CcgAEB0EAAAbyAA/CcgAABvIABEA0AARANAAEQDQABEA0AAPHwEADx8BAA8fAQAPFwIAChkCAAoZAgAUL5QBFCbUABUgPgEUH9cAES/UAhEj1AARIAcAEB00AQgk1AILHdIAFizJABYkAgAXIBYAFh8jACgB0wIPJM4AESAGAAkdygA/CdMCCR3KABQoygAUKMoAFCjKABQeywARJ6UAESADABEgAwARGhMACiCkAA0bAgAWJAEAFiQBABYkAQAWHQIAHwyiABIfAQASHwEADRsBAD4GogANGwEALADIABYkAQAYIAQAECAEACwAyAA+DcgAECAEAAAdygA+DcgAAB3KABQAygAUAMoAFADKABQAygARIQEAESEBABEhAQARGQEADRsBAA0bAQAWMZQBFijUABciPgEWIdcAEzHUAhMl1AATIgcAEh80AQom1AINH9IAGC7JABgmAgAZIhYAGCEeACsB0wIRJssAFCEEAAsfygA/DNMCCx/KABYqygAWKsoAFirKABYgygATKaUAEyIDABMiAwATHBMADCKkAA8dAgAYJgEAGCYBABgmAQAYHwIAHxKiABQhAAAUIQAADx0BAD4JogAPHQEALwDIABgmAQAaIgQAFCEEAC8AyAAuGMgAFCEEAAAfygAuGMgAAB/KABYAygAWAMoAFgDKABYAygATIwEAEyMBABMjAQATGwEADx0BAA8dAQAYM5QBGCrUABkkPgEYI9cAFTPUAhUn1AAVJAcAFCAyAQwo1AIPIdUAGi/LABooAgAbJBYAGiMeAC4B0wITKMsAFiMEAA0hyAA/D9MCDSHIABgsygAYLMoAGCzKABgiygAVK6UAFSQDABUkAwAVHhMADiSkABEfAgAaKAEAGigBABooAQAaIQEAIhGiABYjAAAWIwAAER8BAD4MogARHwEAMQHIABooAQAcJAQAFiMEADEByAAuG8gAFiMEAAAhyAAuG8gAACHIABgAygAYAMoAGADKABgAygAVJQEAFSUBABUlAQAVHQEAER8BABEfAQAaNZQBGizUABsmPgEaJdcAFzXU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ACYzAgAmMwIAIi8AAD4kogAiLwAAOiDIACo5AAAsNAIAJTQBADogyAA0MMgAJTQBAAAxygA0MMgAADHKACgAyAAoAMgAKADIACgAyAAmMwUAJjMFACYzBQAmLQQAIS8BACEvAQArPxICKjzYACs2OgEqNdUAKT8fAyc61wAnNgkAJzMyAR470wIhM9IALT/UACw7BAAtNhUALDUdAD8W0wImOskAJzYFAB8zywA+K9MCHzPLACo/yAAqP8gAKj/IACo0yQAoPKYAKDUGACg1BgAnMBEAIDajACMxAgAtOQQALTkEAC05BAAtMwQAPhCiACg1AgAoNQIAIzEBAD4nogAjMQEAPSDIACw7AAAuNgIAJzYBAD0gyAA6MMgAJzYBAAAzygA6MMgAADPKACoAyAAqAMgAKgDIACoAyAAoNQUAKDUFACg1BQAoLwQAIzEBACMxAQAuP3ICLD/eAC05OwEsONMALD9lAyk81QAqOAIAKTUqASA90wIkNdkAMD/0AC88BQAvOBoALjciAD0g0wIoPMoAKjgBACI10AA6MNMCIjXQACw/2gAsP9oALD/aACw3ywAqP6MAKjgCACo4AgApMxkAIzijACUzAQAvPAEALzwBAC88AQAvNQIAPxWiACo4AQAqOAEAJjMAAD8qogAmMwAAPyPIAC49AgAxOAEAKTgBAD8jyAA/McgAKTgBAAA10AA/McgAADXQACwAygAsAMoALADKACwAygAqOAEAKjgBACo4AQAqMQEAJTMBACUzAQAwP9gCLz/uAC87OwEuOtMALj+pAys+1QAsOgIAKzcqASI/0wImN9kAMj8eATA/BAAxOhQAMDkkAD8i0wIqPsoALDoBACQ30AA+MdMCJDfQAC8/6gAvP+oALz/qAC45ywAsP7UALDoCACw6AgArNRkAJTqjACc1AQAxPQQAMT0EADE9BAAxNwQAPxuiACw6AQAsOgEAKDUAAD8togAoNQAAPynIADA/AAAzOgEAKzoBAD8pyAA/NMgAKzoBAAA30AA/NMgAADfQAC4AygAuAMoALgDKAC4AygAsOgEALDoBACw6AQAsMwEAJzUBACc1AQAyP2IDMT89ATE9OAEwPNgAMD8YBC4/2wAuPAIALTkqASY/7AIoOdkANT9eATM/FAAzPBQAMjskAD8o0wIuP9oALjwBACY50AA+NNMCJjnQ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MakBFDGpARQiqgEQL1QBECUCABAlAgAQHSIABiVVAQoeBQAXKwEAFysBABcrAQAXIQEAHxJSAREkAAARJAAACh4BAD4JUgEKHgEAMgClARcsAQAaJQEADyUBADIApQE+E6UBDyUBAAAhpQE+E6UBACGlARQAqQEUAKkBFACpARQAqQEQJgAAECYAABAmAAAQGwAACR8BAAkfAQAWPk4DFjC9ARcoigIWJsIBEjzqBRIrwQESJwMAECKGAgQu6wUJI7kBGTimARkuAgAaJy4AGSZKAC8C6gUQLakBEicDAAYjpQE+EeoFBiOlARYzqQEWM6kBFjOpARYkqgESMVIBEicCABInAgASHyIACCdVAQsgBgAZLQEAGS0BABktAQAZIwEAIhFSARMmAAATJgAADCAEAD4MUgEMIAQANQClARkuAQAcJwEAEScBADUApQE+FqUBEScBAAAjpQE+FqUBACOlARYAqQEWAKkBFgCpARYAqQESKAAAEigAABIoAAASHQAACyACAAsgAgAYP1IDGDK9ARkqigIYKMIBFD7qBRQtwQEUKQMAEiSGAgYw7QULJbkBGzqmARswAwAcKS4AGyhKAC8I6gUSL6kBFCkDAAglpQE+FOoFCCWlARg1qQEYNakBGDWpARgmqgEUM1IBFCkCABQpAgAUISgACilVAQ0iBgAbLwEAGy8BABsvAQAbJQEAJRFSARUoAAAVKAAADiIEAD4PUgEOIgQAOAClARowAQAeKQEAEykBADgApQE+GaUBEykBAAAlpQE+GaUBACWlARgAqQEYAKkBGACpARgAqQEUKgAAFCoAABQqAAAUHwAADSICAA0iAgAaP3IDGjS/ARsshgIaKr4BFz72BRYwvwEWKwUAFSeGAggy6wUNJ7sBHjqpAR0yBAAeLC0AHSpFADYA6gUUMaYBFisEAAonqgEvH+oFCieqARo4pQEaOKUBGjilARoppQEWNlMBFisFABYrBQAWIyMADCtSARAkBQAeMAQAHjAEAB4wBAAeJwQAMQBSARcqAgAXKgIAECQBAD4SUgEQJAEAOwClAR0yAAAgKwEAFisAADsApQE+HKUBFisAAAAnqQE+HKUBACepARoApQEaAKUBGgClARoApQEWLAIAFiwCABYsAgAWIQEADyUBAA8lAQAdP5oDHDa/AR0uhgIcLL4BGT//BRgyvwEY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AQEBAQEBAQEBAQEBAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDBAQEBAQEBAQEBAQEBAQEBAQFBQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYGBgYGBgYHBwcHBwcHBwcHBwcHBwcHCAgICAgICAgICAgICAgICAgICAgICAgICAkJCQkJCQkJCQkJCQkJCQkKCgoKCgoKCgoKCgoKCgoKCgsLCwsLCwsLCwsLCwsLCwsMDAwMDAwMDAwMDAwMDAwMDA0NDQ0NDQ0NDQ0NDQ0NDQ0ODg4ODg4ODg4ODg4ODg4ODg8PDw8PDw8PDw8PDw8PDw8AQdLRDAveAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgcHBwcHBwcHBwcHBwcHBwcHCABB0dMMC4ckAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQYGBgYGBgYGBgYGBgYGBgYG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EAERARQBFQFAAUEBRAFFAVABUQFUAVUBAAQBBAQEBQQQBBEEFAQVBEAEQQREBEUEUARRBFQEVQQABQEFBAUFBRAFEQUUBRUFQAVBBUQFRQVQBVEFVAVVBQAQARAEEAUQEBAREBQQFRBAEEEQRBBFEFAQURBUEFUQABEBEQQRBREQERERFBEVEUARQRFEEUURUBFREVQRVREAFAEUBBQFFBAUERQUFBUUQBRBFEQURRRQFFEUVBRVFAAVARUEFQUVEBURFRQVFRVAFUEVRBVFFVAVURVUFVUVAEABQARABUAQQBFAFEAVQEBAQUBEQEVAUEBRQFRAVUAAQQFBBEEFQRBBEUEUQRVBQEFBQURBRUFQQVFBVEFVQQBEAUQERAVEEEQRRBREFURAREFERERFRFBEUURURFVEAEUBRQRFBUUQRRFFFEUVRUBFQUVERUVFUEVRRVRFVUUAUAFQBFAFUBBQEVAUUBVQQFBBUERQRVBQUFFQVFBVUABRAVEEUQVREFERURRRFVFAUUFRRFFFUVBRUVFUUVVRAFQBVARUBVQQVBFUFFQVVEBUQVREVEVUUFRRVFRUVVQAVQFVBFUFVRBVEVUUVRVVQFVBVURVRVVQVVFVVFVVVYD+//+g////YAAAAIABAADQ/P//EP////AAAAAwAwAAkPr//1D+//+wAQAAcAUAACD4//+Q/f//cAIAAOAHAADA9P//oPz//2ADAABACwAAAPH//4D7//+ABAAAAA8AACDs///Q+f//MAYAAOATAACw3f//MPf//9AIAABQIgAAAAEAAQABAAEAAQABAAEAAQIDAgMCAwIDAgMCAwIDAgMAAQABAAEAAQABAAEAAQABAgMCAwIDAgMCAwIDAgMCAwABAAEAAQABAAEAAQABAAECAwIDAgMCAwIDAgMCAwIDAAEAAQABAAEAAQABAAEAAQIDAgMCAwIDAgMCAwIDAgMAAQABAAEAAQABAAEAAQABAgMCAwIDAgMCAwIDAgMCAwABAAEAAQABAAEAAQABAAECAwIDAgMCAwIDAgMCAwIDAAEAAQABAAEAAQABAAEAAQIDAgMCAwIDAgMCAwIDAgMAAQABAAEAAQABAAEAAQABAgMCAwIDAgMCAwIDAgMCAwAAAQEAAAEBAAABAQAAAQEAAAEBAAABAQAAAQEAAAEBAgIDAwICAwMCAgMD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AAAAAAAAGEkDAAEAAAACAAAAAwAAAAQAAAARAAAAAgAAAAMAAAAGAAAAEQAAAAAAAAAoSQMAAQAAAAIAAAADAAAABAAAABIAAAACAAAAAwAAAAYAAAASAAAAAAAAADhJAwABAAAAAgAAAAMAAAAEAAAAEwAAAAIAAAADAAAABgAAABMAAAAAAAAASEkDAAEAAAACAAAAAwAAAAQAAAAUAAAAAgAAAAMAAAAGAAAAFAAAAAAAAABYSQMAAQAAAAIAAAADAAAABAAAABUAAAACAAAAAwAAAAYAAAAVAAAAAAAAAGhJAwABAAAAAgAAAAMAAAAEAAAAFgAAAAIAAAADAAAABgAAABYAAAAAAAAAeEkDAAEAAAACAAAAAwAAAAQAAAAXAAAAAgAAAAMAAAAGAAAAFwAAAAAAAACISQMAAQAAAAIAAAADAAAABAAAABgAAAACAAAAAwAAAAYAAAAYAAAAAAAAAJhJAwABAAAAAgAAAAMAAAAEAAAAGQAAAAIAAAADAAAABgAAABkAAAAAAAAAqEkDAAEAAAACAAAAAwAAAAQAAAAaAAAAAgAAAAMAAAAGAAAAGgAAAAAAAAC4SQMAAQAAAAIAAAADAAAABAAAABsAAAACAAAAAwAAAAYAAAAbAAAAAAAAAMhJAwABAAAAAgAAAAMAAAAEAAAAHAAAAAIAAAADAAAABgAAABwAAAAAAAAA2EkDAAEAAAACAAAAAwAAAAQAAAAdAAAAAgAAAAMAAAAGAAAAHQAAAAAAAADoSQMAAQAAAAIAAAADAAAABAAAAB4AAAACAAAAAwAAAAYAAAAeAAAAAAAAAPhJAwABAAAAAgAAAAMAAAAEAAAAHwAAAAIAAAADAAAABgAAAB8AAAAAAAAACEoDAAEAAAACAAAAAwAAAAQAAAAgAAAAAgAAAAMAAAAGAAAAIAAAAAAAAAAYSgMAAQAAAAIAAAADAAAABAAAACEAAAACAAAAAwAAAAYAAAAhAAAAAAAAAChKAwABAAAAAgAAAAMAAAAEAAAAIgAAAAIAAAADAAAABgAAACIAAAAAAAAAOEoDAAEAAAACAAAAAwAAAAQAAAAjAAAAAgAAACQAAAAGAAAAIwAAAAAAAABISgMAAQAAAAIAAAADAAAABAAAACUAAAACAAAAAwAAAAYAAAAkAAAAAAAAAFhKAwABAAAAAgAAAAMAAAAEAAAAJgAAAAIAAAADAAAABgAAACUAAAAAAAAAaEoDAAEAAAACAAAAAwAAAAQAAAAnAAAAAgAAACgAAAAGAAAAJgAAAAAAAAB4SgMAAQAAAAIAAAADAAAABAAAACkAAAACAAAAAwAAAAYAAAAnAAAAAAAAAIhKAwABAAAAAgAAAAMAAAAEAAAAKgAAAAIAAAADAAAABgAAACgAAAAAAAAAmEoDAAEAAAACAAAAAwAAAAQAAAArAAAAAgAAAAMAAAAGAAAAKQAAAAAAAACoSgMAAQAAAAIAAAADAAAABAAAACwAAAACAAAALQAAAAYAAAAqAAAAAAAAALhKAwABAAAAAgAAAAMAAAAEAAAALgAAAAIAAAADAAAABgAAACsAAAAAAAAAyEoDAAEAAAACAAAAAwAAAAQAAAAvAAAAAgAAAAMAAAAGAAAALAAAAAAAAADYSgMAAQAAAAIAAAADAAAABAAAADAAAAACAAAAAwAAAAYAAAAtAAAAAAAAAOhKAwABAAAAAgAAAAMAAAAEAAAAMQAAAAIAAAADAAAABgAAAC4AAAAAAAAA+EoDAAEAAAACAAAAAwAAAAQAAAAyAAAAAgAAAAMAAAAGAAAALwAAAAAAAAAISwMAAQAAAAIAAAADAAAABAAAADMAAAACAAAAAwAAAAYAAAAwAAAAAAAAABhLAwABAAAAAgAAAAMAAAAEAAAANAAAAAIAAAADAAAABgAAADEAAAAAAAAAKEsDAAsAAAAMAAAADQAAAA4AAAA1AAAANgAAAAMAAAAGAAAAMgAAAAAAAAA4SwMAAQAAAAIAAAADAAAABAAAADcAAAACAAAAAwAAAAYAAAAzAAAAAAAAAEhLAwABAAAAAgAAAAMAAAAEAAAAOAAAAAIAAAA5AAAABgAAADQAAAAAAAAAWEsDAAEAAAACAAAAAwAAAAQAAAA6AAAAAgAAAAMAAAAGAAAANQAAAAAAAABoSwMAAQAAAAIAAAADAAAABAAAADsAAAACAAAAAwAAAAYAAAA2AAAAAAAAAHhLAwABAAAAAgAAAAMAAAAEAAAAPAAAAAIAAAADAAAABgAAADcAAAAAAAAAiEsDAAEAAAACAAAAAwAAAAQAAAA9AAAAAgAAAAMAAAAGAAAAOAAAAAAAAACYSwMAAQAAAAIAAAADAAAABAAAAD4AAAACAAAAAwAAAAYAAAA5AAAAAAAAAKhLAwABAAAAAgAAAAMAAAAEAAAAPwAAAAIAAABAAAAABgAAADoAAAAAAAAAuEsDAAEAAAACAAAAAwAAAAQAAABBAAAAAgAAAEIAAAAGAAAAOwAAAAAAAADISwMADwAAAAIAAAADAAAABAAAAEMAAABEAAAAAwAAAAYAAAA8AAAAAAAAANhLAwAQAAAAEQAAAAMAAAAEAAAARQAAAEYAAAADAAAABgAAAD0AAAAAAAAA6EsDAAEAAAACAAAAAwAAAAQAAABHAAAAAgAAAAMAAAAGAAAAPgAAAAAAAAD4SwMAAQAAAAIAAAADAAAABAAAAEgAAAACAAAAAwAAAAYAAAA/AAAAAAAAAAhMAwASAAAAEwAAABQAAAAEAAAASQAAAEoAAAADAAAABgAAAEAAAAAAAAAAGEwDAAEAAAACAAAAAwAAAAQAAABLAAAAAgAAAAMAAAAGAAAAQQAAAAAAAAAoTAMAAQAAAAIAAAADAAAABAAAAEwAAAACAAAAAwAAAAYAAABCAAAAAAAAADhMAwAVAAAAAgAAABYAAAAEAAAATQAAAE4AAAADAAAABgAAAEMAAAAAAAAASEwDAAEAAAACAAAAAwAAAAQAAABPAAAAAgAAAAMAAAAGAAAARAAAAAAAAABYTAMAAQAAAAIAAAADAAAABAAAAFAAAAACAAAAAwAAAAYAAABFAAAAAAAAAGhMAwABAAAAAgAAAAMAAAAEAAAAUQAAAAIAAAADAAAABgAAAEYAAAAAAAAAeEwDAAEAAAACAAAAAwAAAAQAAABSAAAAAgAAAAMAAAAGAAAARwAAAAAAAACITAMAFwAAAAIAAAAYAAAABAAAAFMAAABUAAAAAwAAAAYAAABIAAAAAAAAAJhMAwABAAAAAgAAAAMAAAAEAAAAVQAAAAIAAAADAAAABgAAAEkAAAAAAAAAqEwDAAEAAAACAAAAAwAAAAQAAABWAAAAAgAAAAMAAAAGAAAASgAAAAAAAAC4TAMASwAAAEwAAAACAAAAAAAAAMhMAwBLAAAATQAAAAIAAAAAAAAAGE0DAAEAAABOAAAAAwAAAAQAAAAEAAAAAAAAAOhMAwABAAAATwAAAAMAAAAEAAAABQAAAAAAAACYTQMAAQAAAFAAAAADAAAABAAAAAMAAAADAAAAAwAAAAMAAACSSSSSSSQAAgMBAQADAmFsbG9jYXRvcjxUPjo6YWxsb2NhdGUoc2l6ZV90IG4pICduJyBleGNlZWRzIG1heGltdW0gc3VwcG9ydGVkIHNpemUAAgADAQMCAAEAAgEDACFKa5S13v8AIkRmiKrM7v9pbml0aWFsaXplQmFzaXMAdmkAaWkAdgBCYXNpc0ZpbGUAaWlpAGNsb3NlAHZpaQBnZXRIYXNBbHBoYQBnZXROdW1JbWFnZXMAZ2V0TnVtTGV2ZWxzAGlpaWkAZ2V0SW1hZ2VXaWR0aABpaWlpaQBnZXRJbWFnZUhlaWdodABnZXRJbWFnZVRyYW5zY29kZWRTaXplSW5CeXRlcwBpaWlpaWkAc3RhcnRUcmFuc2NvZGluZwB0cmFuc2NvZGVJbWFnZQBpaWlpaWlpaWkATjEwZW1zY3JpcHRlbjN2YWxFAEhFQVA4AGJ1ZmZlcgBVaW50OEFycmF5AHNldABsZW5ndGgAY29uc3RydWN0b3IAYnl0ZUxlbmd0aABQSzEwYmFzaXNfZmlsZQBQMTBiYXNpc19maWxlADEwYmFzaXNfZmlsZQAtKyAgIDBYMHgAKG51bGwpAC0wWCswWCAwWC0weCsweCAweABpbmYASU5GAG5hbgBOQU4Ac3RkOjpiYXNpY19zdHJpbmc8dW5zaWduZWQgY2hhcj4Ac3RkOjp3c3RyaW5nAGVtc2NyaXB0ZW46OnZhbABlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxjaGFyPgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxzaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgY2hhcj4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8c2hvcnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIHNob3J0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQ+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PHVuc2lnbmVkIGludD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8bG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dW5zaWduZWQgbG9uZz4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50OF90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxpbnQxNl90PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzx1aW50MTZfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8aW50MzJfdD4AZW1zY3JpcHRlbjo6bWVtb3J5X3ZpZXc8dWludDMyX3Q+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGZsb2F0PgBlbXNjcmlwdGVuOjptZW1vcnlfdmlldzxkb3VibGU+AGVtc2NyaXB0ZW46Om1lbW9yeV92aWV3PGxvbmcgZG91YmxlPgBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0llRUUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJZEVFAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWZFRQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0ltRUUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJbEVFAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWpFRQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0lpRUUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJdEVFAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SXNFRQBOMTBlbXNjcmlwdGVuMTFtZW1vcnlfdmlld0loRUUATjEwZW1zY3JpcHRlbjExbWVtb3J5X3ZpZXdJYUVFAE4xMGVtc2NyaXB0ZW4xMW1lbW9yeV92aWV3SWNFRQBOU3QzX18yMTJiYXNpY19zdHJpbmdJd05TXzExY2hhcl90cmFpdHNJd0VFTlNfOWFsbG9jYXRvckl3RUVFRQBOU3QzX18yMjFfX2Jhc2ljX3N0cmluZ19jb21tb25JTGIxRUVFAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0loTlNfMTFjaGFyX3RyYWl0c0loRUVOU185YWxsb2NhdG9ySWhFRUVFAE5TdDNfXzIxMmJhc2ljX3N0cmluZ0ljTlNfMTFjaGFyX3RyYWl0c0ljRUVOU185YWxsb2NhdG9ySWNFRUVFAHRlcm1pbmF0aW5nIHdpdGggJXMgZXhjZXB0aW9uIG9mIHR5cGUgJXM6ICVzAHRlcm1pbmF0aW5nIHdpdGggJXMgZXhjZXB0aW9uIG9mIHR5cGUgJXMAdGVybWluYXRpbmcgd2l0aCAlcyBmb3JlaWduIGV4Y2VwdGlvbgB0ZXJtaW5hdGluZwB1bmNhdWdodABTdDlleGNlcHRpb24ATjEwX19jeHhhYml2MTE2X19zaGltX3R5cGVfaW5mb0UAU3Q5dHlwZV9pbmZvAE4xMF9fY3h4YWJpdjEyMF9fc2lfY2xhc3NfdHlwZV9pbmZvRQBOMTBfX2N4eGFiaXYxMTdfX2NsYXNzX3R5cGVfaW5mb0UAdGVybWluYXRlX2hhbmRsZXIgdW5leHBlY3RlZGx5IHJldHVybmVkAF9aAF9fX1oAX2Jsb2NrX2ludm9rZQBpbnZvY2F0aW9uIGZ1bmN0aW9uIGZvciBibG9jayBpbiAAdm9pZABib29sAGNoYXIAc2lnbmVkIGNoYXIAdW5zaWduZWQgY2hhcgBzaG9ydAB1bnNpZ25lZCBzaG9ydABpbnQAdW5zaWduZWQgaW50AGxvbmcAdW5zaWduZWQgbG9uZwBsb25nIGxvbmcAX19pbnQxMjgAdW5zaWduZWQgX19pbnQxMjgAZmxvYXQAbG9uZyBkb3VibGUAX19mbG9hdDEyOAAuLi4AZGVjaW1hbDY0AGRlY2ltYWwxMjgAZGVjaW1hbDMyAGRlY2ltYWwxNgBjaGFyMzJfdABjaGFyMTZfdABhdXRvAGRlY2x0eXBlKGF1dG8pAHN0ZDo6bnVsbHB0cl90AFthYmk6AF0ATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTBBYmlUYWdBdHRyRQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGU0Tm9kZUUAYWxsb2NhdG9yAGJhc2ljX3N0cmluZwBzdHJpbmcAaXN0cmVhbQBvc3RyZWFtAGlvc3RyZWFtAHN0ZDo6YWxsb2NhdG9yAHN0ZDo6YmFzaWNfc3RyaW5nAHN0ZDo6c3RyaW5nAHN0ZDo6aXN0cmVhbQBzdGQ6Om9zdHJlYW0Ac3RkOjppb3N0cmVhbQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxOVNwZWNpYWxTdWJzdGl0dXRpb25FACBpbWFnaW5hcnkATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMjBQb3N0Zml4UXVhbGlmaWVkVHlwZUUAIGNvbXBsZXgAKQAgACgAJgAmJgBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxM1JlZmVyZW5jZVR5cGVFAG9iamNfb2JqZWN0ACoAaWQ8AD4ATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTFQb2ludGVyVHlwZUUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMjBOYW1lV2l0aFRlbXBsYXRlQXJnc0UAPAAsIABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxMlRlbXBsYXRlQXJnc0UATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTNQYXJhbWV0ZXJQYWNrRQB3Y2hhcl90AGIwRQBiMUUAdQBsAHVsAGxsAHVsbABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxNUludGVnZXJDYXN0RXhwckUAJUxhTABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxNkZsb2F0TGl0ZXJhbEltcGxJZUVFACVhAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE2RmxvYXRMaXRlcmFsSW1wbElkRUUAJWFmAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE2RmxvYXRMaXRlcmFsSW1wbElmRUUAdHJ1ZQBmYWxzZQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGU4Qm9vbEV4cHJFAC0ATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTRJbnRlZ2VyTGl0ZXJhbEUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMjBUZW1wbGF0ZUFyZ3VtZW50UGFja0UAZ3MAJj0APQBhbGlnbm9mICgALAB+AC4qAC8ALz0AXgBePQA9PQA+PQA8PQA8PAA8PD0ALT0AKj0ALS0AIT0AIQB8fAB8AHw9AC0+KgArACs9ACsrAC0+ACUAJT0APj4APj49AHNpemVvZiAoAHR5cGVpZCAoAHRocm93AHRocm93IABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGU5VGhyb3dFeHByRQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxMkluaXRMaXN0RXhwckUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTNOb2RlQXJyYXlOb2RlRQBzaXplb2YuLi4gKABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxM0VuY2xvc2luZ0V4cHJFAHNpemVvZi4uLigATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMjJQYXJhbWV0ZXJQYWNrRXhwYW5zaW9uRQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxOVNpemVvZlBhcmFtUGFja0V4cHJFAHN0YXRpY19jYXN0AD4oAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZThDYXN0RXhwckUAcmVpbnRlcnByZXRfY2FzdAApID8gKAApIDogKABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxNUNvbmRpdGlvbmFsRXhwckUAbm9leGNlcHQgKABudwBuYQBwaQA6Om9wZXJhdG9yIABuZXcAW10ATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlN05ld0V4cHJFAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTExUG9zdGZpeEV4cHJFACAuLi4gACA9IABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxNUJyYWNlZFJhbmdlRXhwckUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTBCcmFjZWRFeHByRQBfR0xPQkFMX19OAChhbm9ueW1vdXMgbmFtZXNwYWNlKQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGU4TmFtZVR5cGVFAClbAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE4QXJyYXlTdWJzY3JpcHRFeHByRQAuAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTEwTWVtYmVyRXhwckUAc3JOAHNyADo6AE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE5R2xvYmFsUXVhbGlmaWVkTmFtZUUAZG4Ab24Ab3BlcmF0b3ImJgBvcGVyYXRvciYAb3BlcmF0b3ImPQBvcGVyYXRvcj0Ab3BlcmF0b3IoKQBvcGVyYXRvciwAb3BlcmF0b3J+AG9wZXJhdG9yIGRlbGV0ZVtdAG9wZXJhdG9yKgBvcGVyYXRvci8Ab3BlcmF0b3IvPQBvcGVyYXRvcl4Ab3BlcmF0b3JePQBvcGVyYXRvcj09AG9wZXJhdG9yPj0Ab3BlcmF0b3I+AG9wZXJhdG9yW10Ab3BlcmF0b3I8PQBvcGVyYXRvcjw8AG9wZXJhdG9yPDw9AG9wZXJhdG9yPABvcGVyYXRvci0Ab3BlcmF0b3ItPQBvcGVyYXRvcio9AG9wZXJhdG9yLS0Ab3BlcmF0b3IgbmV3W10Ab3BlcmF0b3IhPQBvcGVyYXRvciEAb3BlcmF0b3IgbmV3AG9wZXJhdG9yfHwAb3BlcmF0b3J8AG9wZXJhdG9yfD0Ab3BlcmF0b3ItPioAb3BlcmF0b3IrAG9wZXJhdG9yKz0Ab3BlcmF0b3IrKwBvcGVyYXRvci0+AG9wZXJhdG9yPwBvcGVyYXRvciUAb3BlcmF0b3IlPQBvcGVyYXRvcj4+AG9wZXJhdG9yPj49AG9wZXJhdG9yPD0+AG9wZXJhdG9yIiIgAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE1TGl0ZXJhbE9wZXJhdG9yRQBvcGVyYXRvciBkZWxldGUAb3BlcmF0b3IgAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTIyQ29udmVyc2lvbk9wZXJhdG9yVHlwZUUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlOER0b3JOYW1lRQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxM1F1YWxpZmllZE5hbWVFAGR5bmFtaWNfY2FzdABkZWxldGUAW10gAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTEwRGVsZXRlRXhwckUAY3YAKSgATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTRDb252ZXJzaW9uRXhwckUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlOENhbGxFeHByRQBjb25zdF9jYXN0AE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTEwUHJlZml4RXhwckUAKSAAICgATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTBCaW5hcnlFeHByRQBhYQBhbgBhTgBhUwBjbQBkcwBkdgBkVgBlbwBlTwBlcQBnZQBndABsZQBscwBsUwBsdABtaQBtSQBtbABtTABuZQBvbwBvcgBvUgBwbABwTABybQByTQBycwByUwAuLi4gACAuLi4ATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlOEZvbGRFeHByRQBmcABmTABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxM0Z1bmN0aW9uUGFyYW1FAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTI0Rm9yd2FyZFRlbXBsYXRlUmVmZXJlbmNlRQBUcwBzdHJ1Y3QAVHUAdW5pb24AVGUAZW51bQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUyMkVsYWJvcmF0ZWRUeXBlU3BlZlR5cGVFAFN0TABTdABzdGQ6OgBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxNlN0ZFF1YWxpZmllZE5hbWVFAERDAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTIxU3RydWN0dXJlZEJpbmRpbmdOYW1lRQBVdABVbAB2RQAnbGFtYmRhACcoAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE1Q2xvc3VyZVR5cGVOYW1lRQAndW5uYW1lZAAnAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTE1VW5uYW1lZFR5cGVOYW1lRQBzdHJpbmcgbGl0ZXJhbABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGU5TG9jYWxOYW1lRQBzdGQATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTJDdG9yRHRvck5hbWVFAGJhc2ljX2lzdHJlYW0AYmFzaWNfb3N0cmVhbQBiYXNpY19pb3N0cmVhbQBzdGQ6OmJhc2ljX3N0cmluZzxjaGFyLCBzdGQ6OmNoYXJfdHJhaXRzPGNoYXI+LCBzdGQ6OmFsbG9jYXRvcjxjaGFyPiA+AHN0ZDo6YmFzaWNfaXN0cmVhbTxjaGFyLCBzdGQ6OmNoYXJfdHJhaXRzPGNoYXI+ID4Ac3RkOjpiYXNpY19vc3RyZWFtPGNoYXIsIHN0ZDo6Y2hhcl90cmFpdHM8Y2hhcj4gPgBzdGQ6OmJhc2ljX2lvc3RyZWFtPGNoYXIsIHN0ZDo6Y2hhcl90cmFpdHM8Y2hhcj4gPgBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUyN0V4cGFuZGVkU3BlY2lhbFN1YnN0aXR1dGlvbkUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTBOZXN0ZWROYW1lRQA6OioATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTlQb2ludGVyVG9NZW1iZXJUeXBlRQBbAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTlBcnJheVR5cGVFAER2ACB2ZWN0b3JbAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTEwVmVjdG9yVHlwZUUAcGl4ZWwgdmVjdG9yWwBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUxNVBpeGVsVmVjdG9yVHlwZUUAZGVjbHR5cGUoAGRvdWJsZQB1bnNpZ25lZCBsb25nIGxvbmcAb2JqY3Byb3RvACBjb25zdAAgdm9sYXRpbGUAIHJlc3RyaWN0AE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZThRdWFsVHlwZUUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTdWZW5kb3JFeHRRdWFsVHlwZUUATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTNPYmpDUHJvdG9OYW1lRQBEbwBub2V4Y2VwdABETwBEdwBEeABSRQBPRQAgJgAgJiYATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTJGdW5jdGlvblR5cGVFAHRocm93KABOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUyMER5bmFtaWNFeGNlcHRpb25TcGVjRQBub2V4Y2VwdCgATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTJOb2V4Y2VwdFNwZWNFAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTExU3BlY2lhbE5hbWVFAE4xMl9HTE9CQUxfX05fMTE2aXRhbml1bV9kZW1hbmdsZTlEb3RTdWZmaXhFAFVhOWVuYWJsZV9pZkkATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTZGdW5jdGlvbkVuY29kaW5nRQAgW2VuYWJsZV9pZjoATjEyX0dMT0JBTF9fTl8xMTZpdGFuaXVtX2RlbWFuZ2xlMTJFbmFibGVJZkF0dHJFAHRocmVhZC1sb2NhbCB3cmFwcGVyIHJvdXRpbmUgZm9yIAByZWZlcmVuY2UgdGVtcG9yYXJ5IGZvciAAZ3VhcmQgdmFyaWFibGUgZm9yIABub24tdmlydHVhbCB0aHVuayB0byAAdmlydHVhbCB0aHVuayB0byAAdGhyZWFkLWxvY2FsIGluaXRpYWxpemF0aW9uIHJvdXRpbmUgZm9yIABjb25zdHJ1Y3Rpb24gdnRhYmxlIGZvciAALWluLQBOMTJfR0xPQkFMX19OXzExNml0YW5pdW1fZGVtYW5nbGUyMUN0b3JWdGFibGVTcGVjaWFsTmFtZUUAY292YXJpYW50IHJldHVybiB0aHVuayB0byAAdHlwZWluZm8gbmFtZSBmb3IgAHR5cGVpbmZvIGZvciAAVlRUIGZvciAAdnRhYmxlIGZvciAAU3QxMWxvZ2ljX2Vycm9yAFN0MTJsZW5ndGhfZXJyb3IATjEwX19jeHhhYml2MTE3X19wYmFzZV90eXBlX2luZm9FAE4xMF9fY3h4YWJpdjExOV9fcG9pbnRlcl90eXBlX2luZm9FAE4xMF9fY3h4YWJpdjEyMF9fZnVuY3Rpb25fdHlwZV9pbmZvRQBOMTBfX2N4eGFiaXYxMjlfX3BvaW50ZXJfdG9fbWVtYmVyX3R5cGVfaW5mb0UATjEwX19jeHhhYml2MTIzX19mdW5kYW1lbnRhbF90eXBlX2luZm9FAHYARG4AYgBjAGgAYQBzAHQAaQBqAG0AZgBkAE4xMF9fY3h4YWJpdjEyMV9fdm1pX2NsYXNzX3R5cGVfaW5mb0U=" );




	  
	  
    BASIS = BASIS || {};

    var Module = typeof BASIS !== "undefined" ? BASIS : {};
	/** ha */
	Object.assign(Module, {
		wasmBinary: basis_transcoder_wasm_buffer
	});

	
    var moduleOverrides = {};
    var key;
    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }
    var arguments_ = [];
    var thisProgram = "./this.program";
    var quit_ = function(status, toThrow) {
      throw toThrow;
    };
    var ENVIRONMENT_IS_WEB = false;
    var ENVIRONMENT_IS_WORKER = false;
    var ENVIRONMENT_IS_NODE = false;
    var ENVIRONMENT_HAS_NODE = false;
    var ENVIRONMENT_IS_SHELL = false;
    ENVIRONMENT_IS_WEB = typeof window === "object";
    ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    ENVIRONMENT_HAS_NODE =
      typeof process === "object" &&
      typeof process.versions === "object" &&
      typeof process.versions.node === "string";
    ENVIRONMENT_IS_NODE =
      ENVIRONMENT_HAS_NODE && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER;
    ENVIRONMENT_IS_SHELL =
      !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
    var scriptDirectory = "";
    function locateFile(path) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path, scriptDirectory);
      }
      return scriptDirectory + path;
    }
    var read_, readBinary;
    if (ENVIRONMENT_IS_NODE) {
      scriptDirectory = __dirname + "/";
      var nodeFS;
      var nodePath;
      read_ = function shell_read(filename, binary) {
        var ret;
        if (!nodeFS) nodeFS = require("fs");
        if (!nodePath) nodePath = require("path");
        filename = nodePath["normalize"](filename);
        ret = nodeFS["readFileSync"](filename);
        return binary ? ret : ret.toString();
      };
      readBinary = function readBinary(filename) {
        var ret = read_(filename, true);
        if (!ret.buffer) {
          ret = new Uint8Array(ret);
        }
        assert(ret.buffer);
        return ret;
      };
      if (process["argv"].length > 1) {
        thisProgram = process["argv"][1].replace(/\\/g, "/");
      }
      arguments_ = process["argv"].slice(2);
      process["on"]("uncaughtException", function(ex) {
        if (!(ex instanceof ExitStatus)) {
          throw ex;
        }
      });
      process["on"]("unhandledRejection", abort);
      quit_ = function(status) {
        process["exit"](status);
      };
      Module["inspect"] = function() {
        return "[Emscripten Module object]";
      };
    } else if (ENVIRONMENT_IS_SHELL) {
      if (typeof read != "undefined") {
        read_ = function shell_read(f) {
          return read(f);
        };
      }
      readBinary = function readBinary(f) {
        var data;
        if (typeof readbuffer === "function") {
          return new Uint8Array(readbuffer(f));
        }
        data = read(f, "binary");
        assert(typeof data === "object");
        return data;
      };
      if (typeof scriptArgs != "undefined") {
        arguments_ = scriptArgs;
      } else if (typeof arguments != "undefined") {
        arguments_ = arguments;
      }
      if (typeof quit === "function") {
        quit_ = function(status) {
          quit(status);
        };
      }
      if (typeof print !== "undefined") {
        if (typeof console === "undefined") console = {};
        console.log = print;
        console.warn = console.error =
          typeof printErr !== "undefined" ? printErr : print;
      }
    } else if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(
          0,
          scriptDirectory.lastIndexOf("/") + 1
        );
      } else {
        scriptDirectory = "";
      }
      read_ = function shell_read(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send(null);
        return xhr.responseText;
      };
      if (ENVIRONMENT_IS_WORKER) {
        readBinary = function readBinary(url) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", url, false);
          xhr.responseType = "arraybuffer";
          xhr.send(null);
          return new Uint8Array(xhr.response);
        };
      }
    }
    var out = Module["print"] || console.log.bind(console);
    var err = Module["printErr"] || console.warn.bind(console);
    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }
    moduleOverrides = null;
    if (Module["arguments"]) arguments_ = Module["arguments"];
    if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
    if (Module["quit"]) quit_ = Module["quit"];
    var asm2wasmImports = {
      "f64-rem": function(x, y) {
        return x % y;
      },
      debugger: function() {}
    };
    var setTempRet0 = function(value) {
    };
    var wasmBinary;
    if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
    var noExitRuntime;
    if (Module["noExitRuntime"]) noExitRuntime = Module["noExitRuntime"];
    if (typeof WebAssembly !== "object") {
      err("no native wasm support detected");
    }
    var wasmMemory;
    var wasmTable;
    var ABORT = false;
    function assert(condition, text) {
      if (!condition) {
        abort("Assertion failed: " + text);
      }
    }
    var UTF8Decoder =
      typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
    function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (u8Array[endPtr] && !(endPtr >= endIdx)) ++endPtr;
      if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
      } else {
        var str = "";
        while (idx < endPtr) {
          var u0 = u8Array[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = u8Array[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode(((u0 & 31) << 6) | u1);
            continue;
          }
          var u2 = u8Array[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
          } else {
            u0 =
              ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (u8Array[idx++] & 63);
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
          }
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0)) return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
        }
        if (u <= 127) {
          if (outIdx >= endIdx) break;
          outU8Array[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx) break;
          outU8Array[outIdx++] = 192 | (u >> 6);
          outU8Array[outIdx++] = 128 | (u & 63);
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx) break;
          outU8Array[outIdx++] = 224 | (u >> 12);
          outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
          outU8Array[outIdx++] = 128 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          outU8Array[outIdx++] = 240 | (u >> 18);
          outU8Array[outIdx++] = 128 | ((u >> 12) & 63);
          outU8Array[outIdx++] = 128 | ((u >> 6) & 63);
          outU8Array[outIdx++] = 128 | (u & 63);
        }
      }
      outU8Array[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
          u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
        if (u <= 127) ++len;
        else if (u <= 2047) len += 2;
        else if (u <= 65535) len += 3;
        else len += 4;
      }
      return len;
    }
    var UTF16Decoder =
      typeof TextDecoder !== "undefined"
        ? new TextDecoder("utf-16le")
        : undefined;
    var WASM_PAGE_SIZE = 65536;
    function alignUp(x, multiple) {
      if (x % multiple > 0) {
        x += multiple - (x % multiple);
      }
      return x;
    }
    var buffer,
      HEAP8,
      HEAPU8,
      HEAP16,
      HEAPU16,
      HEAP32,
      HEAPU32,
      HEAPF32,
      HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    var DYNAMIC_BASE = 5482368,
      DYNAMICTOP_PTR = 239456;
    var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 16777216;
    if (Module["wasmMemory"]) {
      wasmMemory = Module["wasmMemory"];
    } else {
      wasmMemory = new WebAssembly.Memory({
        initial: INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE
      });
    }
    if (wasmMemory) {
      buffer = wasmMemory.buffer;
    }
    INITIAL_TOTAL_MEMORY = buffer.byteLength;
    updateGlobalBufferAndViews(buffer);
    HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback();
          continue;
        }
        var func = callback.func;
        if (typeof func === "number") {
          if (callback.arg === undefined) {
            Module["dynCall_v"](func);
          } else {
            Module["dynCall_vi"](func, callback.arg);
          }
        } else {
          func(callback.arg === undefined ? null : callback.arg);
        }
      }
    }
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATMAIN__ = [];
    var __ATPOSTRUN__ = [];
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      callRuntimeCallbacks(__ATINIT__);
    }
    function preMain() {
      callRuntimeCallbacks(__ATMAIN__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var runDependencyWatcher = null;
    var dependenciesFulfilled = null;
    function addRunDependency(id) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return String.prototype.startsWith
        ? filename.startsWith(dataURIPrefix)
        : filename.indexOf(dataURIPrefix) === 0;
    }
    var wasmBinaryFile = "basis_transcoder.wasm";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary() {
      try {
        if (wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(wasmBinaryFile);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err) {
        abort(err);
      }
    }
    function getBinaryPromise() {
      if (
        !wasmBinary &&
        (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) &&
        typeof fetch === "function"
      ) {
        return fetch(wasmBinaryFile, { credentials: "same-origin" })
          .then(function(response) {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" +
                wasmBinaryFile +
                "'";
            }
            return response["arrayBuffer"]();
          })
          .catch(function() {
            return getBinary();
          });
      }
      return new Promise(function(resolve, reject) {
        resolve(getBinary());
      });
    }
    function createWasm(env) {
      var info = {
        env: env,
        wasi_unstable: env,
        global: { NaN: NaN, Infinity: Infinity },
        "global.Math": Math,
        asm2wasm: asm2wasmImports
      };
      function receiveInstance(instance, module) {
        var exports = instance.exports;
        Module["asm"] = exports;
        removeRunDependency();
      }
      addRunDependency();
      function receiveInstantiatedSource(output) {
        receiveInstance(output["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise()
          .then(function(binary) {
            return WebAssembly.instantiate(binary, info);
          })
          .then(receiver, function(reason) {
            err("failed to asynchronously prepare wasm: " + reason);
            abort(reason);
          });
      }
      function instantiateAsync() {
        if (
          !wasmBinary &&
          typeof WebAssembly.instantiateStreaming === "function" &&
          !isDataURI(wasmBinaryFile) &&
          typeof fetch === "function"
        ) {
          fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(
            response
          ) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiatedSource, function(reason) {
              err("wasm streaming compile failed: " + reason);
              err("falling back to ArrayBuffer instantiation");
              instantiateArrayBuffer(receiveInstantiatedSource);
            });
          });
        } else {
          return instantiateArrayBuffer(receiveInstantiatedSource);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      instantiateAsync();
      return {};
    }
    Module["asm"] = function(global, env, providedBuffer) {
      env["memory"] = wasmMemory;
      env["table"] = wasmTable = new WebAssembly.Table({
        initial: 342,
        maximum: 342,
        element: "anyfunc"
      });
      env["__memory_base"] = 1024;
      env["__table_base"] = 0;
      var exports = createWasm(env);
      return exports;
    };
    __ATINIT__.push({
      func: function() {
        globalCtors();
      }
    });
    function ___cxa_allocate_exception(size) {
      return _malloc(size);
    }
    function ___cxa_pure_virtual() {
      ABORT = true;
      throw "Pure virtual function called!";
    }
    function ___cxa_throw(ptr, type, destructor) {
      if (!("uncaught_exception" in __ZSt18uncaught_exceptionv)) {
        __ZSt18uncaught_exceptionv.uncaught_exceptions = 1;
      } else {
        __ZSt18uncaught_exceptionv.uncaught_exceptions++;
      }
      throw ptr;
    }
    function ___cxa_uncaught_exceptions() {
      return __ZSt18uncaught_exceptionv.uncaught_exceptions;
    }
    var SYSCALLS = {
      buffers: [null, [], []],
      printChar: function(stream, curr) {
        var buffer = SYSCALLS.buffers[stream];
        if (curr === 0 || curr === 10) {
          (stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
          buffer.length = 0;
        } else {
          buffer.push(curr);
        }
      },
      varargs: 0,
      get: function(varargs) {
        SYSCALLS.varargs += 4;
        var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
        return ret;
      },
      getStr: function() {
        var ret = UTF8ToString(SYSCALLS.get());
        return ret;
      },
      get64: function() {
        var low = SYSCALLS.get(),
          high = SYSCALLS.get();
        return low;
      },
      getZero: function() {
        SYSCALLS.get();
      }
    };
    function ___syscall140(which, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD(),
          offset_high = SYSCALLS.get(),
          offset_low = SYSCALLS.get(),
          result = SYSCALLS.get(),
          whence = SYSCALLS.get();
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
          abort(e);
        return -e.errno;
      }
    }
    function ___syscall6(which, varargs) {
      SYSCALLS.varargs = varargs;
      try {
        var stream = SYSCALLS.getStreamFromFD();
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
          abort(e);
        return -e.errno;
      }
    }
    function _fd_write(stream, iov, iovcnt, pnum) {
      try {
        var num = 0;
        for (var i = 0; i < iovcnt; i++) {
          var ptr = HEAP32[(iov + i * 8) >> 2];
          var len = HEAP32[(iov + (i * 8 + 4)) >> 2];
          for (var j = 0; j < len; j++) {
            SYSCALLS.printChar(stream, HEAPU8[ptr + j]);
          }
          num += len;
        }
        HEAP32[pnum >> 2] = num;
        return 0;
      } catch (e) {
        if (typeof FS === "undefined" || !(e instanceof FS.ErrnoError))
          abort(e);
        return -e.errno;
      }
    }
    function ___wasi_fd_write() {
      return _fd_write.apply(null, arguments);
    }
    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }
    function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }
    var embind_charCodes = undefined;
    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var char_0 = 48;
    var char_9 = 57;
    function makeLegalFunctionName(name) {
      if (undefined === name) {
        return "_unknown";
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      } else {
        return name;
      }
    }
    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      return new Function(
        "body",
        "return function " +
          name +
          "() {\n" +
          '    "use strict";' +
          "    return body.apply(this, arguments);\n" +
          "};\n"
      )(body);
    }
    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function(message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== undefined) {
          this.stack =
            this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
        if (this.message === undefined) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };
      return errorClass;
    }
    var BindingError = undefined;
    function throwBindingError(message) {
      throw new BindingError(message);
    }
    var InternalError = undefined;
    function throwInternalError(message) {
      throw new InternalError(message);
    }
    function whenDependentTypesAreResolved(
      myTypes,
      dependentTypes,
      getTypeConverters
    ) {
      myTypes.forEach(function(type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function(dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(function() {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }
    function registerType(rawType, registeredInstance, options) {
      options = options || {};
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError(
          "registerType registeredInstance requires argPackAdvance"
        );
      }
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(
          'type "' + name + '" must have a positive integer typeid pointer'
        );
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function(cb) {
          cb();
        });
      }
    }
    function __embind_register_bool(
      rawType,
      name,
      size,
      trueValue,
      falseValue
    ) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function(wt) {
          return !!wt;
        },
        toWireType: function(destructors, o) {
          return o ? trueValue : falseValue;
        },
        argPackAdvance: 8,
        readValueFromPointer: function(pointer) {
          var heap;
          if (size === 1) {
            heap = HEAP8;
          } else if (size === 2) {
            heap = HEAP16;
          } else if (size === 4) {
            heap = HEAP32;
          } else {
            throw new TypeError("Unknown boolean type size: " + name);
          }
          return this["fromWireType"](heap[pointer >> shift]);
        },
        destructorFunction: null
      });
    }
    function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
        return false;
      }
      if (!(other instanceof ClassHandle)) {
        return false;
      }
      var leftClass = this.$$.ptrType.registeredClass;
      var left = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right = other.$$.ptr;
      while (leftClass.baseClass) {
        left = leftClass.upcast(left);
        leftClass = leftClass.baseClass;
      }
      while (rightClass.baseClass) {
        right = rightClass.upcast(right);
        rightClass = rightClass.baseClass;
      }
      return leftClass === rightClass && left === right;
    }
    function shallowCopyInternalPointer(o) {
      return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType
      };
    }
    function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
    }
    var finalizationGroup = false;
    function detachFinalizer(handle) {}
    function runDestructor($$) {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }
    function releaseClassHandle($$) {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
        runDestructor($$);
      }
    }
    function attachFinalizer(handle) {
      if ("undefined" === typeof FinalizationGroup) {
        attachFinalizer = function(handle) {
          return handle;
        };
        return handle;
      }
      finalizationGroup = new FinalizationGroup(function(iter) {
        for (var result = iter.next(); !result.done; result = iter.next()) {
          var $$ = result.value;
          if (!$$.ptr) {
            console.warn("object already deleted: " + $$.ptr);
          } else {
            releaseClassHandle($$);
          }
        }
      });
      attachFinalizer = function(handle) {
        finalizationGroup.register(handle, handle.$$, handle.$$);
        return handle;
      };
      detachFinalizer = function(handle) {
        finalizationGroup.unregister(handle.$$);
      };
      return attachFinalizer(handle);
    }
    function ClassHandle_clone() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this;
      } else {
        var clone = attachFinalizer(
          Object.create(Object.getPrototypeOf(this), {
            $$: { value: shallowCopyInternalPointer(this.$$) }
          })
        );
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone;
      }
    }
    function ClassHandle_delete() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }
      detachFinalizer(this);
      releaseClassHandle(this.$$);
      if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = undefined;
        this.$$.ptr = undefined;
      }
    }
    function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }
    var delayFunction = undefined;
    var deletionQueue = [];
    function flushPendingDeletes() {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]();
      }
    }
    function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }
      deletionQueue.push(this);
      if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
      this.$$.deleteScheduled = true;
      return this;
    }
    function init_ClassHandle() {
      ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
      ClassHandle.prototype["clone"] = ClassHandle_clone;
      ClassHandle.prototype["delete"] = ClassHandle_delete;
      ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
      ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
    }
    function ClassHandle() {}
    var registeredPointers = {};
    function ensureOverloadTable(proto, methodName, humanName) {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function() {
          if (
            !proto[methodName].overloadTable.hasOwnProperty(arguments.length)
          ) {
            throwBindingError(
              "Function '" +
                humanName +
                "' called with an invalid number of arguments (" +
                arguments.length +
                ") - expects one of (" +
                proto[methodName].overloadTable +
                ")!"
            );
          }
          return proto[methodName].overloadTable[arguments.length].apply(
            this,
            arguments
          );
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }
    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (
          undefined === numArguments ||
          (undefined !== Module[name].overloadTable &&
            undefined !== Module[name].overloadTable[numArguments])
        ) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError(
            "Cannot register multiple overloads of a function with the same number of arguments (" +
              numArguments +
              ")!"
          );
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (undefined !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }
    function RegisteredClass(
      name,
      constructor,
      instancePrototype,
      rawDestructor,
      baseClass,
      getActualType,
      upcast,
      downcast
    ) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
    function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(
            "Expected null or instance of " +
              desiredClass.name +
              ", got an instance of " +
              ptrClass.name
          );
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    }
    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError(
          'Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name
        );
      }
      if (!handle.$$.ptr) {
        throwBindingError(
          "Cannot pass deleted object as a pointer of type " + this.name
        );
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }
          return ptr;
        } else {
          return 0;
        }
      }
      if (!handle.$$) {
        throwBindingError(
          'Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name
        );
      }
      if (!handle.$$.ptr) {
        throwBindingError(
          "Cannot pass deleted object as a pointer of type " + this.name
        );
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError(
          "Cannot convert argument of type " +
            (handle.$$.smartPtrType
              ? handle.$$.smartPtrType.name
              : handle.$$.ptrType.name) +
            " to parameter type " +
            this.name
        );
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      if (this.isSmartPointer) {
        if (undefined === handle.$$.smartPtr) {
          throwBindingError("Passing raw pointer to smart pointer is illegal");
        }
        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError(
                "Cannot convert argument of type " +
                  (handle.$$.smartPtrType
                    ? handle.$$.smartPtrType.name
                    : handle.$$.ptrType.name) +
                  " to parameter type " +
                  this.name
              );
            }
            break;
          case 1:
            ptr = handle.$$.smartPtr;
            break;
          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle["clone"]();
              ptr = this.rawShare(
                ptr,
                __emval_register(function() {
                  clonedHandle["delete"]();
                })
              );
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;
          default:
            throwBindingError("Unsupporting sharing policy");
        }
      }
      return ptr;
    }
    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError(
          'Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name
        );
      }
      if (!handle.$$.ptr) {
        throwBindingError(
          "Cannot pass deleted object as a pointer of type " + this.name
        );
      }
      if (handle.$$.ptrType.isConst) {
        throwBindingError(
          "Cannot convert argument of type " +
            handle.$$.ptrType.name +
            " to parameter type " +
            this.name
        );
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2]);
    }
    function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr);
      }
      return ptr;
    }
    function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
        this.rawDestructor(ptr);
      }
    }
    function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
        handle["delete"]();
      }
    }
    function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (undefined === desiredClass.baseClass) {
        return null;
      }
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    }
    function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }
    function getLiveInheritedInstances() {
      var rv = [];
      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }
      return rv;
    }
    function setDelayFunction(fn) {
      delayFunction = fn;
      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    }
    function init_embind() {
      Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
      Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
      Module["flushPendingDeletes"] = flushPendingDeletes;
      Module["setDelayFunction"] = setDelayFunction;
    }
    var registeredInstances = {};
    function getBasestPointer(class_, ptr) {
      if (ptr === undefined) {
        throwBindingError("ptr should not be undefined");
      }
      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }
      return ptr;
    }
    function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }
    function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType");
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified");
      }
      record.count = { value: 1 };
      return attachFinalizer(
        Object.create(prototype, { $$: { value: record } })
      );
    }
    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
      var registeredInstance = getInheritedInstance(
        this.registeredClass,
        rawPointer
      );
      if (undefined !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance["clone"]();
        } else {
          var rv = registeredInstance["clone"]();
          this.destructor(ptr);
          return rv;
        }
      }
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr: ptr
          });
        }
      }
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(
        rawPointer,
        this.registeredClass,
        toType.registeredClass
      );
      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp
        });
      }
    }
    function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype["argPackAdvance"] = 8;
      RegisteredPointer.prototype[
        "readValueFromPointer"
      ] = simpleReadValueFromPointer;
      RegisteredPointer.prototype[
        "deleteObject"
      ] = RegisteredPointer_deleteObject;
      RegisteredPointer.prototype[
        "fromWireType"
      ] = RegisteredPointer_fromWireType;
    }
    function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this["toWireType"] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this["toWireType"] = genericPointerToWireType;
      }
    }
    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }
      if (
        undefined !== Module[name].overloadTable &&
        undefined !== numArguments
      ) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }
    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
      function makeDynCaller(dynCall) {
        var args = [];
        for (var i = 1; i < signature.length; ++i) {
          args.push("a" + i);
        }
        var name = "dynCall_" + signature + "_" + rawFunction;
        var body = "return function " + name + "(" + args.join(", ") + ") {\n";
        body +=
          "    return dynCall(rawFunction" +
          (args.length ? ", " : "") +
          args.join(", ") +
          ");\n";
        body += "};\n";
        return new Function("dynCall", "rawFunction", body)(
          dynCall,
          rawFunction
        );
      }
      var fp;
      if (Module["FUNCTION_TABLE_" + signature] !== undefined) {
        fp = Module["FUNCTION_TABLE_" + signature][rawFunction];
      } else if (typeof FUNCTION_TABLE !== "undefined") {
        fp = FUNCTION_TABLE[rawFunction];
      } else {
        var dc = Module["dynCall_" + signature];
        if (dc === undefined) {
          dc = Module["dynCall_" + signature.replace(/f/g, "d")];
          if (dc === undefined) {
            throwBindingError("No dynCall invoker for signature: " + signature);
          }
        }
        fp = makeDynCaller(dc);
      }
      if (typeof fp !== "function") {
        throwBindingError(
          "unknown function pointer with signature " +
            signature +
            ": " +
            rawFunction
        );
      }
      return fp;
    }
    var UnboundTypeError = undefined;
    function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }
    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(
        message + ": " + unboundTypes.map(getTypeName).join([", "])
      );
    }
    function __embind_register_class(
      rawType,
      rawPointerType,
      rawConstPointerType,
      baseClassRawType,
      getActualTypeSignature,
      getActualType,
      upcastSignature,
      upcast,
      downcastSignature,
      downcast,
      name,
      destructorSignature,
      rawDestructor
    ) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(
        getActualTypeSignature,
        getActualType
      );
      if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast);
      }
      if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast);
      }
      rawDestructor = embind__requireFunction(
        destructorSignature,
        rawDestructor
      );
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function() {
        throwUnboundTypeError(
          "Cannot construct " + name + " due to unbound types",
          [baseClassRawType]
        );
      });
      whenDependentTypesAreResolved(
        [rawType, rawPointerType, rawConstPointerType],
        baseClassRawType ? [baseClassRawType] : [],
        function(base) {
          base = base[0];
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
          var constructor = createNamedFunction(legalFunctionName, function() {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError("Use 'new' to construct " + name);
            }
            if (undefined === registeredClass.constructor_body) {
              throw new BindingError(name + " has no accessible constructor");
            }
            var body = registeredClass.constructor_body[arguments.length];
            if (undefined === body) {
              throw new BindingError(
                "Tried to invoke ctor of " +
                  name +
                  " with invalid number of parameters (" +
                  arguments.length +
                  ") - expected (" +
                  Object.keys(registeredClass.constructor_body).toString() +
                  ") parameters instead!"
              );
            }
            return body.apply(this, arguments);
          });
          var instancePrototype = Object.create(basePrototype, {
            constructor: { value: constructor }
          });
          constructor.prototype = instancePrototype;
          var registeredClass = new RegisteredClass(
            name,
            constructor,
            instancePrototype,
            rawDestructor,
            baseClass,
            getActualType,
            upcast,
            downcast
          );
          var referenceConverter = new RegisteredPointer(
            name,
            registeredClass,
            true,
            false,
            false
          );
          var pointerConverter = new RegisteredPointer(
            name + "*",
            registeredClass,
            false,
            false,
            false
          );
          var constPointerConverter = new RegisteredPointer(
            name + " const*",
            registeredClass,
            false,
            true,
            false
          );
          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
          };
          replacePublicSymbol(legalFunctionName, constructor);
          return [referenceConverter, pointerConverter, constPointerConverter];
        }
      );
    }
    function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i]);
      }
      return array;
    }
    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }
    function __embind_register_class_constructor(
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = "constructor " + classType.name;
        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (
          undefined !== classType.registeredClass.constructor_body[argCount - 1]
        ) {
          throw new BindingError(
            "Cannot register multiple constructors with identical number of parameters (" +
              (argCount - 1) +
              ") for class '" +
              classType.name +
              "'! Overload resolution is currently only performed using the parameter count, not actual type info!"
          );
        }
        classType.registeredClass.constructor_body[
          argCount - 1
        ] = function unboundTypeHandler() {
          throwUnboundTypeError(
            "Cannot construct " + classType.name + " due to unbound types",
            rawArgTypes
          );
        };
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
          classType.registeredClass.constructor_body[
            argCount - 1
          ] = function constructor_body() {
            if (arguments.length !== argCount - 1) {
              throwBindingError(
                humanName +
                  " called with " +
                  arguments.length +
                  " arguments, expected " +
                  (argCount - 1)
              );
            }
            var destructors = [];
            var args = new Array(argCount);
            args[0] = rawConstructor;
            for (var i = 1; i < argCount; ++i) {
              args[i] = argTypes[i]["toWireType"](
                destructors,
                arguments[i - 1]
              );
            }
            var ptr = invoker.apply(null, args);
            runDestructors(destructors);
            return argTypes[0]["fromWireType"](ptr);
          };
          return [];
        });
        return [];
      });
    }
    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError(
          "new_ called with constructor type " +
            typeof constructor +
            " which is not a function"
        );
      }
      var dummy = createNamedFunction(
        constructor.name || "unknownFunctionName",
        function() {}
      );
      dummy.prototype = constructor.prototype;
      var obj = new dummy();
      var r = constructor.apply(obj, argumentList);
      return r instanceof Object ? r : obj;
    }
    function craftInvokerFunction(
      humanName,
      argTypes,
      classType,
      cppInvokerFunc,
      cppTargetFunc
    ) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError(
          "argTypes array size mismatch! Must at least get return value and 'this' types!"
        );
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;
      for (var i = 1; i < argTypes.length; ++i) {
        if (
          argTypes[i] !== null &&
          argTypes[i].destructorFunction === undefined
        ) {
          needsDestructorStack = true;
          break;
        }
      }
      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";
      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }
      var invokerFnBody =
        "return function " +
        makeLegalFunctionName(humanName) +
        "(" +
        argsList +
        ") {\n" +
        "if (arguments.length !== " +
        (argCount - 2) +
        ") {\n" +
        "throwBindingError('function " +
        humanName +
        " called with ' + arguments.length + ' arguments, expected " +
        (argCount - 2) +
        " args!');\n" +
        "}\n";
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = [
        "throwBindingError",
        "invoker",
        "fn",
        "runDestructors",
        "retType",
        "classParam"
      ];
      var args2 = [
        throwBindingError,
        cppInvokerFunc,
        cppTargetFunc,
        runDestructors,
        argTypes[0],
        argTypes[1]
      ];
      if (isClassMethodFunc) {
        invokerFnBody +=
          "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }
      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody +=
          "var arg" +
          i +
          "Wired = argType" +
          i +
          ".toWireType(" +
          dtorStack +
          ", arg" +
          i +
          "); // " +
          argTypes[i + 2].name +
          "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }
      if (isClassMethodFunc) {
        argsListWired =
          "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
      invokerFnBody +=
        (returns ? "var rv = " : "") +
        "invoker(fn" +
        (argsListWired.length > 0 ? ", " : "") +
        argsListWired +
        ");\n";
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody +=
              paramName +
              "_dtor(" +
              paramName +
              "); // " +
              argTypes[i].name +
              "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }
      if (returns) {
        invokerFnBody +=
          "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
      }
      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }
    function __embind_register_class_function(
      rawClassType,
      methodName,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      rawInvoker,
      context,
      isPureVirtual
    ) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
        function unboundTypesHandler() {
          throwUnboundTypeError(
            "Cannot call " + humanName + " due to unbound types",
            rawArgTypes
          );
        }
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (
          undefined === method ||
          (undefined === method.overloadTable &&
            method.className !== classType.name &&
            method.argCount === argCount - 2)
        ) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
          var memberFunction = craftInvokerFunction(
            humanName,
            argTypes,
            classType,
            rawInvoker,
            context
          );
          if (undefined === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }
          return [];
        });
        return [];
      });
    }
    var emval_free_list = [];
    var emval_handle_array = [
      {},
      { value: undefined },
      { value: null },
      { value: true },
      { value: false }
    ];
    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = undefined;
        emval_free_list.push(handle);
      }
    }
    function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          ++count;
        }
      }
      return count;
    }
    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== undefined) {
          return emval_handle_array[i];
        }
      }
      return null;
    }
    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }
    function __emval_register(value) {
      switch (value) {
        case undefined: {
          return 1;
        }
        case null: {
          return 2;
        }
        case true: {
          return 3;
        }
        case false: {
          return 4;
        }
        default: {
          var handle = emval_free_list.length
            ? emval_free_list.pop()
            : emval_handle_array.length;
          emval_handle_array[handle] = { refcount: 1, value: value };
          return handle;
        }
      }
    }
    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function(handle) {
          var rv = emval_handle_array[handle].value;
          __emval_decref(handle);
          return rv;
        },
        toWireType: function(destructors, value) {
          return __emval_register(value);
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: null
      });
    }
    function _embind_repr(v) {
      if (v === null) {
        return "null";
      }
      var t = typeof v;
      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    }
    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function(pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };
        case 3:
          return function(pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }
    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, {
        name: name,
        fromWireType: function(value) {
          return value;
        },
        toWireType: function(destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError(
              'Cannot convert "' + _embind_repr(value) + '" to ' + this.name
            );
          }
          return value;
        },
        argPackAdvance: 8,
        readValueFromPointer: floatReadValueFromPointer(name, shift),
        destructorFunction: null
      });
    }
    function __embind_register_function(
      name,
      argCount,
      rawArgTypesAddr,
      signature,
      rawInvoker,
      fn
    ) {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = readLatin1String(name);
      rawInvoker = embind__requireFunction(signature, rawInvoker);
      exposePublicSymbol(
        name,
        function() {
          throwUnboundTypeError(
            "Cannot call " + name + " due to unbound types",
            argTypes
          );
        },
        argCount - 1
      );
      whenDependentTypesAreResolved([], argTypes, function(argTypes) {
        var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
        replacePublicSymbol(
          name,
          craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn),
          argCount - 1
        );
        return [];
      });
    }
    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed
            ? function readS8FromPointer(pointer) {
                return HEAP8[pointer];
              }
            : function readU8FromPointer(pointer) {
                return HEAPU8[pointer];
              };
        case 1:
          return signed
            ? function readS16FromPointer(pointer) {
                return HEAP16[pointer >> 1];
              }
            : function readU16FromPointer(pointer) {
                return HEAPU16[pointer >> 1];
              };
        case 2:
          return signed
            ? function readS32FromPointer(pointer) {
                return HEAP32[pointer >> 2];
              }
            : function readU32FromPointer(pointer) {
                return HEAPU32[pointer >> 2];
              };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_integer(
      primitiveType,
      name,
      size,
      minRange,
      maxRange
    ) {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var shift = getShiftFromSize(size);
      var fromWireType = function(value) {
        return value;
      };
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = function(value) {
          return (value << bitshift) >>> bitshift;
        };
      }
      var isUnsignedType = name.indexOf("unsigned") != -1;
      registerType(primitiveType, {
        name: name,
        fromWireType: fromWireType,
        toWireType: function(destructors, value) {
          if (typeof value !== "number" && typeof value !== "boolean") {
            throw new TypeError(
              'Cannot convert "' + _embind_repr(value) + '" to ' + this.name
            );
          }
          if (value < minRange || value > maxRange) {
            throw new TypeError(
              'Passing a number "' +
                _embind_repr(value) +
                '" from JS side to C/C++ side to an argument of type "' +
                name +
                '", which is outside the valid range [' +
                minRange +
                ", " +
                maxRange +
                "]!"
            );
          }
          return isUnsignedType ? value >>> 0 : value | 0;
        },
        argPackAdvance: 8,
        readValueFromPointer: integerReadValueFromPointer(
          name,
          shift,
          minRange !== 0
        ),
        destructorFunction: null
      });
    }
    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array
      ];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data = heap[handle + 1];
        return new TA(heap["buffer"], data, size);
      }
      name = readLatin1String(name);
      registerType(
        rawType,
        {
          name: name,
          fromWireType: decodeMemoryView,
          argPackAdvance: 8,
          readValueFromPointer: decodeMemoryView
        },
        { ignoreDuplicateRegistrations: true }
      );
    }
    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, {
        name: name,
        fromWireType: function(value) {
          var length = HEAPU32[value >> 2];
          var str;
          if (stdStringIsUTF8) {
            var endChar = HEAPU8[value + 4 + length];
            var endCharSwap = 0;
            if (endChar != 0) {
              endCharSwap = endChar;
              HEAPU8[value + 4 + length] = 0;
            }
            var decodeStartPtr = value + 4;
            for (var i = 0; i <= length; ++i) {
              var currentBytePtr = value + 4 + i;
              if (HEAPU8[currentBytePtr] == 0) {
                var stringSegment = UTF8ToString(decodeStartPtr);
                if (str === undefined) str = stringSegment;
                else {
                  str += String.fromCharCode(0);
                  str += stringSegment;
                }
                decodeStartPtr = currentBytePtr + 1;
              }
            }
            if (endCharSwap != 0) HEAPU8[value + 4 + length] = endCharSwap;
          } else {
            var a = new Array(length);
            for (var i = 0; i < length; ++i) {
              a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
            }
            str = a.join("");
          }
          _free(value);
          return str;
        },
        toWireType: function(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
          var getLength;
          var valueIsOfTypeString = typeof value === "string";
          if (
            !(
              valueIsOfTypeString ||
              value instanceof Uint8Array ||
              value instanceof Uint8ClampedArray ||
              value instanceof Int8Array
            )
          ) {
            throwBindingError("Cannot pass non-string to std::string");
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            getLength = function() {
              return lengthBytesUTF8(value);
            };
          } else {
            getLength = function() {
              return value.length;
            };
          }
          var length = getLength();
          var ptr = _malloc(4 + length + 1);
          HEAPU32[ptr >> 2] = length;
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            stringToUTF8(value, ptr + 4, length + 1);
          } else {
            if (valueIsOfTypeString) {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(ptr);
                  throwBindingError(
                    "String has UTF-16 code units that do not fit in 8 bits"
                  );
                }
                HEAPU8[ptr + 4 + i] = charCode;
              }
            } else {
              for (var i = 0; i < length; ++i) {
                HEAPU8[ptr + 4 + i] = value[i];
              }
            }
          }
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function(ptr) {
          _free(ptr);
        }
      });
    }
    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var getHeap, shift;
      if (charSize === 2) {
        getHeap = function() {
          return HEAPU16;
        };
        shift = 1;
      } else if (charSize === 4) {
        getHeap = function() {
          return HEAPU32;
        };
        shift = 2;
      }
      registerType(rawType, {
        name: name,
        fromWireType: function(value) {
          var HEAP = getHeap();
          var length = HEAPU32[value >> 2];
          var a = new Array(length);
          var start = (value + 4) >> shift;
          for (var i = 0; i < length; ++i) {
            a[i] = String.fromCharCode(HEAP[start + i]);
          }
          _free(value);
          return a.join("");
        },
        toWireType: function(destructors, value) {
          var HEAP = getHeap();
          var length = value.length;
          var ptr = _malloc(4 + length * charSize);
          HEAPU32[ptr >> 2] = length;
          var start = (ptr + 4) >> shift;
          for (var i = 0; i < length; ++i) {
            HEAP[start + i] = value.charCodeAt(i);
          }
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        argPackAdvance: 8,
        readValueFromPointer: simpleReadValueFromPointer,
        destructorFunction: function(ptr) {
          _free(ptr);
        }
      });
    }
    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, {
        isVoid: true,
        name: name,
        argPackAdvance: 0,
        fromWireType: function() {
          return undefined;
        },
        toWireType: function(destructors, o) {
          return undefined;
        }
      });
    }
    function requireHandle(handle) {
      if (!handle) {
        throwBindingError("Cannot use deleted val. handle = " + handle);
      }
      return emval_handle_array[handle].value;
    }
    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(
          humanName + " has unknown type " + getTypeName(rawType)
        );
      }
      return impl;
    }
    function __emval_as(handle, returnType, destructorsRef) {
      handle = requireHandle(handle);
      returnType = requireRegisteredType(returnType, "emval::as");
      var destructors = [];
      var rd = __emval_register(destructors);
      HEAP32[destructorsRef >> 2] = rd;
      return returnType["toWireType"](destructors, handle);
    }
    var emval_symbols = {};
    function getStringOrSymbol(address) {
      var symbol = emval_symbols[address];
      if (symbol === undefined) {
        return readLatin1String(address);
      } else {
        return symbol;
      }
    }
    var emval_methodCallers = [];
    function __emval_call_void_method(caller, handle, methodName, args) {
      caller = emval_methodCallers[caller];
      handle = requireHandle(handle);
      methodName = getStringOrSymbol(methodName);
      caller(handle, methodName, null, args);
    }
    function emval_get_global() {
      if (typeof globalThis === "object") {
        return globalThis;
      }
      return (function() {
        return Function;
      })()("return this")();
    }
    function __emval_get_global(name) {
      if (name === 0) {
        return __emval_register(emval_get_global());
      } else {
        name = getStringOrSymbol(name);
        return __emval_register(emval_get_global()[name]);
      }
    }
    function __emval_addMethodCaller(caller) {
      var id = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id;
    }
    function __emval_lookupTypes(argCount, argTypes, argWireTypes) {
      var a = new Array(argCount);
      for (var i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(
          HEAP32[(argTypes >> 2) + i],
          "parameter " + i
        );
      }
      return a;
    }
    function __emval_get_method_caller(argCount, argTypes) {
      var types = __emval_lookupTypes(argCount, argTypes);
      var retType = types[0];
      var signatureName =
        retType.name +
        "_$" +
        types
          .slice(1)
          .map(function(t) {
            return t.name;
          })
          .join("_") +
        "$";
      var params = ["retType"];
      var args = [retType];
      var argsList = "";
      for (var i = 0; i < argCount - 1; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        params.push("argType" + i);
        args.push(types[1 + i]);
      }
      var functionName = makeLegalFunctionName("methodCaller_" + signatureName);
      var functionBody =
        "return function " +
        functionName +
        "(handle, name, destructors, args) {\n";
      var offset = 0;
      for (var i = 0; i < argCount - 1; ++i) {
        functionBody +=
          "    var arg" +
          i +
          " = argType" +
          i +
          ".readValueFromPointer(args" +
          (offset ? "+" + offset : "") +
          ");\n";
        offset += types[i + 1]["argPackAdvance"];
      }
      functionBody += "    var rv = handle[name](" + argsList + ");\n";
      for (var i = 0; i < argCount - 1; ++i) {
        if (types[i + 1]["deleteObject"]) {
          functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
        }
      }
      if (!retType.isVoid) {
        functionBody += "    return retType.toWireType(destructors, rv);\n";
      }
      functionBody += "};\n";
      params.push(functionBody);
      var invokerFunction = new_(Function, params).apply(null, args);
      return __emval_addMethodCaller(invokerFunction);
    }
    function __emval_get_module_property(name) {
      name = getStringOrSymbol(name);
      return __emval_register(Module[name]);
    }
    function __emval_get_property(handle, key) {
      handle = requireHandle(handle);
      key = requireHandle(key);
      return __emval_register(handle[key]);
    }
    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }
    function craftEmvalAllocator(argCount) {
      var argsList = "";
      for (var i = 0; i < argCount; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
      }
      var functionBody =
        "return function emval_allocator_" +
        argCount +
        "(constructor, argTypes, args) {\n";
      for (var i = 0; i < argCount; ++i) {
        functionBody +=
          "var argType" +
          i +
          " = requireRegisteredType(Module['HEAP32'][(argTypes >> 2) + " +
          i +
          '], "parameter ' +
          i +
          '");\n' +
          "var arg" +
          i +
          " = argType" +
          i +
          ".readValueFromPointer(args);\n" +
          "args += argType" +
          i +
          "['argPackAdvance'];\n";
      }
      functionBody +=
        "var obj = new constructor(" +
        argsList +
        ");\n" +
        "return __emval_register(obj);\n" +
        "}\n";
      return new Function(
        "requireRegisteredType",
        "Module",
        "__emval_register",
        functionBody
      )(requireRegisteredType, Module, __emval_register);
    }
    var emval_newers = {};
    function __emval_new(handle, argCount, argTypes, args) {
      handle = requireHandle(handle);
      var newer = emval_newers[argCount];
      if (!newer) {
        newer = craftEmvalAllocator(argCount);
        emval_newers[argCount] = newer;
      }
      return newer(handle, argTypes, args);
    }
    function __emval_new_cstring(v) {
      return __emval_register(getStringOrSymbol(v));
    }
    function __emval_run_destructors(handle) {
      var destructors = emval_handle_array[handle].value;
      runDestructors(destructors);
      __emval_decref(handle);
    }
    function _abort() {
      Module["abort"]();
    }
    function _emscripten_get_heap_size() {
      return HEAP8.length;
    }
    function _llvm_trap() {
      abort("trap!");
    }
    function _emscripten_memcpy_big(dest, src, num) {
      HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
    }
    function ___setErrNo(value) {
      if (Module["___errno_location"])
        HEAP32[Module["___errno_location"]() >> 2] = value;
      return value;
    }
    function abortOnCannotGrowMemory(requestedSize) {
      abort("OOM");
    }
    function emscripten_realloc_buffer(size) {
      try {
        wasmMemory.grow((size - buffer.byteLength + 65535) >> 16);
        updateGlobalBufferAndViews(wasmMemory.buffer);
        return 1;
      } catch (e) {}
    }
    function _emscripten_resize_heap(requestedSize) {
      var oldSize = _emscripten_get_heap_size();
      var PAGE_MULTIPLE = 65536;
      var LIMIT = 2147483648 - PAGE_MULTIPLE;
      if (requestedSize > LIMIT) {
        return false;
      }
      var MIN_TOTAL_MEMORY = 16777216;
      var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);
      while (newSize < requestedSize) {
        if (newSize <= 536870912) {
          newSize = alignUp(2 * newSize, PAGE_MULTIPLE);
        } else {
          newSize = Math.min(
            alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE),
            LIMIT
          );
        }
      }
      var replacement = emscripten_realloc_buffer(newSize);
      if (!replacement) {
        return false;
      }
      return true;
    }
    embind_init_charCodes();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    InternalError = Module["InternalError"] = extendError(
      Error,
      "InternalError"
    );
    init_ClassHandle();
    init_RegisteredPointer();
    init_embind();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(
      Error,
      "UnboundTypeError"
    );
    init_emval();
    var asmGlobalArg = {};
    var asmLibraryArg = {
      c: abort,
      A: setTempRet0,
      i: ___cxa_allocate_exception,
      I: ___cxa_pure_virtual,
      h: ___cxa_throw,
      z: ___cxa_uncaught_exceptions,
      m: ___setErrNo,
      y: ___syscall140,
      x: ___syscall6,
      w: ___wasi_fd_write,
      v: __embind_register_bool,
      N: __embind_register_class,
      M: __embind_register_class_constructor,
      g: __embind_register_class_function,
      L: __embind_register_emval,
      u: __embind_register_float,
      K: __embind_register_function,
      f: __embind_register_integer,
      e: __embind_register_memory_view,
      t: __embind_register_std_string,
      J: __embind_register_std_wstring,
      H: __embind_register_void,
      s: __emval_as,
      r: __emval_call_void_method,
      b: __emval_decref,
      G: __emval_get_global,
      q: __emval_get_method_caller,
      p: __emval_get_module_property,
      k: __emval_get_property,
      l: __emval_incref,
      o: __emval_new,
      j: __emval_new_cstring,
      n: __emval_run_destructors,
      d: _abort,
      F: _emscripten_get_heap_size,
      E: _emscripten_memcpy_big,
      D: _emscripten_resize_heap,
      C: _llvm_trap,
      B: abortOnCannotGrowMemory,
      a: DYNAMICTOP_PTR
    };
    var asm = Module["asm"](asmGlobalArg, asmLibraryArg, buffer);
    Module["asm"] = asm;
    var __ZSt18uncaught_exceptionv = (Module[
      "__ZSt18uncaught_exceptionv"
    ] = function() {
      return Module["asm"]["O"].apply(null, arguments);
    });
    var ___embind_register_native_and_builtin_types = (Module[
      "___embind_register_native_and_builtin_types"
    ] = function() {
      return Module["asm"]["P"].apply(null, arguments);
    });
    var ___errno_location = (Module["___errno_location"] = function() {
      return Module["asm"]["Q"].apply(null, arguments);
    });
    var ___getTypeName = (Module["___getTypeName"] = function() {
      return Module["asm"]["R"].apply(null, arguments);
    });
    var _free = (Module["_free"] = function() {
      return Module["asm"]["S"].apply(null, arguments);
    });
    var _malloc = (Module["_malloc"] = function() {
      return Module["asm"]["T"].apply(null, arguments);
    });
    var globalCtors = (Module["globalCtors"] = function() {
      return Module["asm"]["ha"].apply(null, arguments);
    });
    var dynCall_ii = (Module["dynCall_ii"] = function() {
      return Module["asm"]["U"].apply(null, arguments);
    });
    var dynCall_iidiiii = (Module["dynCall_iidiiii"] = function() {
      return Module["asm"]["V"].apply(null, arguments);
    });
    var dynCall_iii = (Module["dynCall_iii"] = function() {
      return Module["asm"]["W"].apply(null, arguments);
    });
    var dynCall_iiii = (Module["dynCall_iiii"] = function() {
      return Module["asm"]["X"].apply(null, arguments);
    });
    var dynCall_iiiii = (Module["dynCall_iiiii"] = function() {
      return Module["asm"]["Y"].apply(null, arguments);
    });
    var dynCall_iiiiii = (Module["dynCall_iiiiii"] = function() {
      return Module["asm"]["Z"].apply(null, arguments);
    });
    var dynCall_iiiiiiii = (Module["dynCall_iiiiiiii"] = function() {
      return Module["asm"]["_"].apply(null, arguments);
    });
    var dynCall_iiiiiiiii = (Module["dynCall_iiiiiiiii"] = function() {
      return Module["asm"]["$"].apply(null, arguments);
    });
    var dynCall_jiji = (Module["dynCall_jiji"] = function() {
      return Module["asm"]["aa"].apply(null, arguments);
    });
    var dynCall_v = (Module["dynCall_v"] = function() {
      return Module["asm"]["ba"].apply(null, arguments);
    });
    var dynCall_vi = (Module["dynCall_vi"] = function() {
      return Module["asm"]["ca"].apply(null, arguments);
    });
    var dynCall_vii = (Module["dynCall_vii"] = function() {
      return Module["asm"]["da"].apply(null, arguments);
    });
    var dynCall_viiii = (Module["dynCall_viiii"] = function() {
      return Module["asm"]["ea"].apply(null, arguments);
    });
    var dynCall_viiiii = (Module["dynCall_viiiii"] = function() {
      return Module["asm"]["fa"].apply(null, arguments);
    });
    var dynCall_viiiiii = (Module["dynCall_viiiiii"] = function() {
      return Module["asm"]["ga"].apply(null, arguments);
    });
    Module["asm"] = asm;
    var calledRun;
    Module["then"] = function(func) {
      if (calledRun) {
        func(Module);
      } else {
        var old = Module["onRuntimeInitialized"];
        Module["onRuntimeInitialized"] = function() {
          if (old) old();
          func(Module);
        };
      }
      return Module;
    };
    function ExitStatus(status) {
      this.name = "ExitStatus";
      this.message = "Program terminated with exit(" + status + ")";
      this.status = status;
    }
    dependenciesFulfilled = function runCaller() {
      if (!calledRun) run();
      if (!calledRun) dependenciesFulfilled = runCaller;
    };
    function run(args) {
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) return;
      function doRun() {
        if (calledRun) return;
        calledRun = true;
        if (ABORT) return;
        initRuntime();
        preMain();
        if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
          setTimeout(function() {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    Module["run"] = run;
    function abort(what) {
      if (Module["onAbort"]) {
        Module["onAbort"](what);
      }
      what += "";
      out(what);
      err(what);
      ABORT = true;
      throw "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
    }
    Module["abort"] = abort;
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    noExitRuntime = true;
    run();

    return BASIS;
  };
})();
const BasisTranscoder = BASIS;/**
 * @author Don McCurdy / https://www.donmccurdy.com
 * @author Austin Eng / https://github.com/austinEng
 * @author Shrek Shao / https://github.com/shrekshao
 */

/**
 * Loader for Basis Universal GPU Texture Codec.
 *
 * Basis Universal is a "supercompressed" GPU texture and texture video
 * compression system that outputs a highly compressed intermediate file format
 * (.basis) that can be quickly transcoded to a wide variety of GPU texture
 * compression formats.
 *
 * This loader parallelizes the transcoding process across a configurable number
 * of web workers, before transferring the transcoded compressed texture back
 * to the main thread.
 */

const BASIS_FORMAT = {
	cTFETC1: 0,
	cTFETC2: 1,
	cTFBC1: 2,
	cTFBC3: 3,
	cTFBC4: 4,
	cTFBC5: 5,
	cTFBC7_M6_OPAQUE_ONLY: 6,
	cTFBC7_M5: 7,
	cTFPVRTC1_4_RGB: 8,
	cTFPVRTC1_4_RGBA: 9,
	cTFASTC_4x4: 10,
	cTFATC_RGB: 11,
	cTFATC_RGBA_INTERPOLATED_ALPHA: 12,
	cTFRGBA32: 13,
	cTFRGB565: 14,
	cTFBGR565: 15,
	cTFRGBA4444: 16,
};

const COMPRESSED_RGB_S3TC_DXT1_EXT  = 0x83F0;
const COMPRESSED_RGBA_S3TC_DXT5_EXT = 0x83F3;

const COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93B0;
const RGB_ETC1_Format = 36196;
const RGB_PVRTC_4BPPV1_Format = 35840;
const RGBA_PVRTC_4BPPV1_Format = 35842;

const BASIS_FORMAT_TO_WEBGL = new Map([
	[BASIS_FORMAT.cTFASTC_4x4     , COMPRESSED_RGBA_ASTC_4x4_KHR],
	
	[BASIS_FORMAT.cTFBC1          , COMPRESSED_RGB_S3TC_DXT1_EXT],
	[BASIS_FORMAT.cTFBC3          , COMPRESSED_RGBA_S3TC_DXT5_EXT],
	
	[BASIS_FORMAT.cTFETC1         , RGB_ETC1_Format],
	[BASIS_FORMAT.cTFPVRTC1_4_RGB , RGB_PVRTC_4BPPV1_Format],
	[BASIS_FORMAT.cTFPVRTC1_4_RGBA, RGBA_PVRTC_4BPPV1_Format],
]);





const __cacheSupports = new WeakMap();
const detectOnlySupport = (gl) => {
	if ( __cacheSupports.has(gl) )
		return {...__cacheSupports.get(gl)};

	const glExts = gl.getSupportedExtensions();
	const map = {
		astcSupported : ["_compressed_texture_astc"],
		etcSupported  : ["_compressed_texture_etc1"],
		dxtSupported  : ["_compressed_texture_s3tc"],
		pvrtcSupported: ["_compressed_texture_pvrtc", "_compressed_texture_pvrtc"]
	};

	const config = {};

	Object
		.entries(map)
		.map(([key, exts]) => {
			const findGlExts = [];
			exts.forEach(ext => 
				findGlExts.push( ...glExts.filter(glExt => glExt.indexOf(ext) !== -1) ) );

			config[key] = !!findGlExts.length;
			findGlExts.forEach(glExt => 
				gl.getExtension(glExt));
		});
	
	__cacheSupports.set(gl, config);
	return detectOnlySupport(gl);
};

const detectSupport = (gl, useAlpha = true) => {
	const config = detectOnlySupport(gl);

	/**
	const config = {};
	config.astcSupported = !! gl.getExtension( 'WEBGL_compressed_texture_astc' );
	config.etcSupported = !! gl.getExtension( 'WEBGL_compressed_texture_etc1' );
	config.dxtSupported = !! gl.getExtension( 'WEBGL_compressed_texture_s3tc' );
	config.pvrtcSupported = !! gl.getExtension( 'WEBGL_compressed_texture_pvrtc' )
		|| !! gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
	*/

	if ( config.astcSupported )
		config.format = BASIS_FORMAT.cTFASTC_4x4;
    else 
	if ( config.dxtSupported )
		config.format = useAlpha ? BASIS_FORMAT.cTFBC3 : BASIS_FORMAT.cTFBC1;
	else 
	if ( config.pvrtcSupported )
		config.format = useAlpha ? BASIS_FORMAT.cTFPVRTC1_4_RGBA : BASIS_FORMAT.cTFPVRTC1_4_RGB;
	else 
	if ( config.etcSupported )
		config.format = BASIS_FORMAT.cTFETC1;
	else
		throw new Error( 'THREE.BasisTextureLoader: No suitable compressed texture format found.' );

	return {...config, useAlpha};
};

let basisTranscoderInstance = null;
const transcode = (srcArrayBuffer, config) => {
	basisTranscoderInstance = basisTranscoderInstance || new BasisTranscoder();

	const basisFile = new basisTranscoderInstance.BasisFile( new Uint8Array(srcArrayBuffer) );

	const width    = basisFile.getImageWidth(0, 0);
	const height   = basisFile.getImageHeight(0, 0);
    const levels   = basisFile.getNumLevels(0 );
    const hasAlpha = basisFile.getHasAlpha();

	function cleanup() {
		basisFile.close();
		basisFile.delete();
	}

	if ( ! width || ! height || ! levels ) {
		cleanup();
		throw new Error( 'THREE.BasisTextureLoader:  Invalid .basis file' );
	}

	if ( ! basisFile.startTranscoding() ) {
		cleanup();
		throw new Error( 'THREE.BasisTextureLoader: .startTranscoding failed' );
	}

	const mipmaps = [];
	for(let mip = 0; mip < levels; mip ++ ) {
		const mipWidth  = basisFile.getImageWidth(0, mip);
		const mipHeight = basisFile.getImageHeight(0, mip);
		const dst = new Uint8Array( basisFile.getImageTranscodedSizeInBytes(0, mip, config.format) );

		const status = basisFile.transcodeImage(
			dst,
			0,
			mip,
			config.format,
			config.useAlpha,
			0
		);

		if ( ! status ) {
			cleanup();
			throw new Error( 'THREE.BasisTextureLoader: .transcodeImage failed.' );
		}

		mipmaps.push( { data: dst, width: mipWidth, height: mipHeight } );
	}

	cleanup();
	return { width, height, hasAlpha, mipmaps };
};

const parseFormat = (format) => {
	if ( !BASIS_FORMAT_TO_WEBGL.has(format) )
		throw new Error( 'THREE.BasisTextureLoader: No supported format available.' );

	return BASIS_FORMAT_TO_WEBGL.get(format);
};

const compressedTexImage2D = (gl, basisTextureData) => {
	const glInternalFormat = parseFormat(basisTextureData.format);
	basisTextureData.mipmaps.forEach((mipmap, i) =>
		gl.compressedTexImage2D(gl.TEXTURE_2D, i, glInternalFormat, mipmap.width, mipmap.height, 0, mipmap.data ) );
};

function __worker(BasisTranscoder) {
	var basisTranscoderInstance = null;

	function transcode(srcArrayBuffer, config) {
		basisTranscoderInstance = basisTranscoderInstance || new BasisTranscoder();

		const basisFile = new basisTranscoderInstance.BasisFile( new Uint8Array(srcArrayBuffer) );

		const width    = basisFile.getImageWidth(0, 0);
		const height   = basisFile.getImageHeight(0, 0);
		const levels   = basisFile.getNumLevels(0 );
		const hasAlpha = basisFile.getHasAlpha();

		function cleanup() {
			basisFile.close();
			basisFile.delete();
		}

		if ( ! width || ! height || ! levels ) {
			cleanup();
			throw new Error( 'THREE.BasisTextureLoader:  Invalid .basis file' );
		}

		if ( ! basisFile.startTranscoding() ) {
			cleanup();
			throw new Error( 'THREE.BasisTextureLoader: .startTranscoding failed' );
		}

		const mipmaps = [];
		for(let mip = 0; mip < levels; mip ++ ) {
			const mipWidth  = basisFile.getImageWidth(0, mip);
			const mipHeight = basisFile.getImageHeight(0, mip);
			const dst = new Uint8Array( basisFile.getImageTranscodedSizeInBytes(0, mip, config.format) );

			const status = basisFile.transcodeImage(
				dst,
				0,
				mip,
				config.format,
				config.useAlpha,
				0
			);

			if ( ! status ) {
				cleanup();
				throw new Error( 'THREE.BasisTextureLoader: .transcodeImage failed.' );
			}

			mipmaps.push( { data: dst, width: mipWidth, height: mipHeight } );
		}

		cleanup();
		return { width, height, hasAlpha, mipmaps };
	}	function processInputMessage(data) {
		switch(data.type) {
			case "transcode-request":
				try {
					var info = transcode(data.buffer, data.config);
					info.type = "transcode-answer";
					info.id = data.id;
					var buffers = [];
					for(var i = 0; i < info.mipmaps.length; i++)
						buffers.push( info.mipmaps[i].data.buffer );
					postMessage(info, buffers);
				} catch(e) {
					postMessage({
						type: "error",
						id: data.id,
						error: e.message
					});
				}
				
				break;
		}
	}

	function init(onmessageCallback) {
		var inputMessages = [];
		function checkInputMessages() {
			if ( !basisTranscoderInstance )
				return;
			
			var msg = null;
			while(msg = inputMessages.shift())
				onmessageCallback(msg);
		}
		onmessage = event => {
			inputMessages.push(event.data);
			checkInputMessages();
		};
		var _basisTranscoderInstance = BasisTranscoder({
			onRuntimeInitialized: function() {
				basisTranscoderInstance = _basisTranscoderInstance;
				basisTranscoderInstance.initializeBasis();
				checkInputMessages();
			}
		});
	}
	init(processInputMessage);
}

let __workerUrl = null;
const getWorkerUrl = () => {
	if ( __workerUrl )
		return __workerUrl;

	__workerUrl = URL.createObjectURL(new Blob([`(${ __worker.toString() })(${ BasisTranscoder.toString() })`]));
	return __workerUrl;
};

class BasisTextureData {
	constructor(mipmaps, format, hasAlpha = false) {
		this.mipmaps  = mipmaps;
		this.width    = mipmaps[0].width;
		this.height   = mipmaps[0].height;
		this.format   = format;
		this.hasAlpha = hasAlpha;
	}
}

class BasisThreadControl {
	constructor() {
		this._nextId = 1;
		this.ids = {};

		this.worker = new Worker(getWorkerUrl());
		this.worker.onmessage = ({data: {id, type, error, ...data}}) => {
			switch(type) {
				case "transcode-answer":
					const {resolve, reject} = this.ids[id];
					delete this.ids[id];
					if ( error )
						reject(new Error(error));
					else
						resolve(data);
					break;
			}
		};
	}
	
	getId() {
		return this._nextId++;
	}

	async transcode(buffer, config) {
		const id = this.getId();

		return new Promise((resolve, reject) => {
			this.worker.postMessage({
				type: "transcode-request",
				id,
				buffer,
				config,
			});
			
			this.ids[id] = {resolve, reject};
		});
	}
}
class BasisThreadControlPool {
	constructor(numThreads = 1) {
		this.numThreads = 1;
		this.nextWorker = 0;
		this.workers = [];
		
		this.setNumThreads(numThreads);
	}
	
	setNumThreads(numThreads) {
		numThreads |= 0;
		this.numThreads = Math.min(Math.max(1, numThreads), 8);
		while(this.workers.length < this.numThreads )
			this.workers.push({
				control: new BasisThreadControl(),
				numTasks: 0,
			});
	}
	
	detectSupport(gl) {
		return detectSupport(gl);
	}
	
	async transcode(arrayBuffer, config) {
		const workers = this.workers.slice(0, this.numThreads);
		workers.sort((l, r) => l.numTasks - r.numTasks);
		const worker = workers[0];
		if ( !worker )
			throw new Error(`Not found worker. Change num threads`);
		
		worker.numTasks++;
		try {
			const result = await worker.control.transcode(arrayBuffer, config);
			return new BasisTextureData(result.mipmaps, config.format, result.hasAlpha);
		} catch(e) {
			throw e;
		} finally {
			worker.numTasks--;
		}
	}
	
	compressedTexImage2D(gl, basisTextureData) {
		compressedTexImage2D(gl, basisTextureData);
	}
	
	getConfig(gl, useAlpha = true) {
		return detectSupport(gl, useAlpha);
	}
	
	async transcodeToGlTexture(gl, arrayBuffer, useAlpha = true) {
		const config = detectSupport(gl, useAlpha);
		const data = await this.transcode(arrayBuffer, config);
		compressedTexImage2D(gl, data);
	}
}

const basisThreadControlPool$1 = new BasisThreadControlPool(1);

globalThis.BasisThreadControl=BasisThreadControl;
globalThis.BasisThreadControlPool=BasisThreadControlPool;
globalThis.basisThreadControlPool=basisThreadControlPool$1;

const BasisTextureLoader = {detectSupport, transcode, parseFormat, compressedTexImage2D};let requestFileSystem = false;
let storageInfo       = false;
let TEMPORARY, PERSISTENT;
try {
	requestFileSystem = (window.requestFileSystem || window.webkitRequestFileSystem || window.mozRequestFileSystem).bind(window);
	storageInfo       = (navigator.temporaryStorage || navigator.webkitTemporaryStorage || navigator.mozTemporaryStorage).bind(navigator);

	TEMPORARY  = window.TEMPORARY;
	PERSISTENT = window.PERSISTENT;
} catch(e) {}

const UTF8TextDecoder = new TextDecoder("utf8");
const UTF8TextEncoder = new TextEncoder("utf8");

/**
const ID = () => Math.random().toString(36).slice(2);

(async() => {
	try {
	var kvs = new KeyValueStorageOnFileApi("main");
	var d = await kvs.init();
	console.log(d)
	window.kvs=kvs;

	let ids = [];
	window.ab = await kvs.get('test');
	const buf = new Uint8Array(1024*1024);
	kvs.del('trst')
	
	
	console.time('set');
		await kvs.set("MAXBUF", buf);
		
console.log(`	kvs.del('MAXBUF')`, 	await kvs.del('MAXBUF'))
console.log(`	kvs.del('MAXBUF')`, 	await kvs.del('MAXBUF'))
		if(0)
	for(let i = 0; i < 1e3; i++) {
		let id = ID();
		ids.push(id);
		await kvs.set(id, buf);
	}
	console.timeEnd('set');
	
	
	let h=0;
	let arr=[];
	console.time('get');
	const r = await kvs.getReader("MAXBUF");
	for(let i = 0; i < 1e3+10; i++) {
		let test = r.read(i*1024, i*1024+1024);
		arr.push(test);
		//h += (new Uint8Array(test))[Math.random() * 10];
	}
	let r2 = await Promise.all(arr);
	console.timeEnd('get');
	console.log(r2)
	
	
	
	if (0 ) {
	let h=0;
	let arr=[];
	console.time('get');
	for(let i = 0; i < 1e3; i++) {
		let id = ids.pop();
		let test = kvs.get(id);
		arr.push(test);
		//h += (new Uint8Array(test))[Math.random() * 10];
	}
	let r = await Promise.all(arr);
	console.timeEnd('get');
	console.log(r)
	}
	
	
	} catch(e) {
		console.log(e)
	}
})();

*//*!
    localForage -- Offline Storage, Improved
    Version 1.5.0
    https://localforage.github.io/localForage
    (c) 2013-2017 Mozilla, Apache License 2.0
*/

const createLocalForage = (function(){
	return (function e(t,n,r){
		
		function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
var Mutation = global.MutationObserver || global.WebKitMutationObserver;

var scheduleDrain;

{
  if (Mutation) {
    var called = 0;
    var observer = new Mutation(nextTick);
    var element = global.document.createTextNode('');
    observer.observe(element, {
      characterData: true
    });
    scheduleDrain = function () {
      element.data = (called = ++called % 2);
    };
  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
    var channel = new global.MessageChannel();
    channel.port1.onmessage = nextTick;
    scheduleDrain = function () {
      channel.port2.postMessage(0);
    };
  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
    scheduleDrain = function () {

      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
      var scriptEl = global.document.createElement('script');
      scriptEl.onreadystatechange = function () {
        nextTick();

        scriptEl.onreadystatechange = null;
        scriptEl.parentNode.removeChild(scriptEl);
        scriptEl = null;
      };
      global.document.documentElement.appendChild(scriptEl);
    };
  } else {
    scheduleDrain = function () {
      setTimeout(nextTick, 0);
    };
  }
}

var draining;
var queue = [];
//named nextTick for less confusing stack traces
function nextTick() {
  draining = true;
  var i, oldQueue;
  var len = queue.length;
  while (len) {
    oldQueue = queue;
    queue = [];
    i = -1;
    while (++i < len) {
      oldQueue[i]();
    }
    len = queue.length;
  }
  draining = false;
}

module.exports = immediate;
function immediate(task) {
  if (queue.push(task) === 1 && !draining) {
    scheduleDrain();
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
},{}],2:[function(_dereq_,module,exports){
var immediate = _dereq_(1);

/* istanbul ignore next */
function INTERNAL() {}

var handlers = {};

var REJECTED = ['REJECTED'];
var FULFILLED = ['FULFILLED'];
var PENDING = ['PENDING'];

module.exports = exports = Promise;

function Promise(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('resolver must be a function');
  }
  this.state = PENDING;
  this.queue = [];
  this.outcome = void 0;
  if (resolver !== INTERNAL) {
    safelyResolveThenable(this, resolver);
  }
}

Promise.prototype["catch"] = function (onRejected) {
  return this.then(null, onRejected);
};
Promise.prototype.then = function (onFulfilled, onRejected) {
  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
    typeof onRejected !== 'function' && this.state === REJECTED) {
    return this;
  }
  var promise = new this.constructor(INTERNAL);
  if (this.state !== PENDING) {
    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
    unwrap(promise, resolver, this.outcome);
  } else {
    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
  }

  return promise;
};
function QueueItem(promise, onFulfilled, onRejected) {
  this.promise = promise;
  if (typeof onFulfilled === 'function') {
    this.onFulfilled = onFulfilled;
    this.callFulfilled = this.otherCallFulfilled;
  }
  if (typeof onRejected === 'function') {
    this.onRejected = onRejected;
    this.callRejected = this.otherCallRejected;
  }
}
QueueItem.prototype.callFulfilled = function (value) {
  handlers.resolve(this.promise, value);
};
QueueItem.prototype.otherCallFulfilled = function (value) {
  unwrap(this.promise, this.onFulfilled, value);
};
QueueItem.prototype.callRejected = function (value) {
  handlers.reject(this.promise, value);
};
QueueItem.prototype.otherCallRejected = function (value) {
  unwrap(this.promise, this.onRejected, value);
};

function unwrap(promise, func, value) {
  immediate(function () {
    var returnValue;
    try {
      returnValue = func(value);
    } catch (e) {
      return handlers.reject(promise, e);
    }
    if (returnValue === promise) {
      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
    } else {
      handlers.resolve(promise, returnValue);
    }
  });
}

handlers.resolve = function (self, value) {
  var result = tryCatch(getThen, value);
  if (result.status === 'error') {
    return handlers.reject(self, result.value);
  }
  var thenable = result.value;

  if (thenable) {
    safelyResolveThenable(self, thenable);
  } else {
    self.state = FULFILLED;
    self.outcome = value;
    var i = -1;
    var len = self.queue.length;
    while (++i < len) {
      self.queue[i].callFulfilled(value);
    }
  }
  return self;
};
handlers.reject = function (self, error) {
  self.state = REJECTED;
  self.outcome = error;
  var i = -1;
  var len = self.queue.length;
  while (++i < len) {
    self.queue[i].callRejected(error);
  }
  return self;
};

function getThen(obj) {
  // Make sure we only access the accessor once as required by the spec
  var then = obj && obj.then;
  if (obj && typeof obj === 'object' && typeof then === 'function') {
    return function appyThen() {
      then.apply(obj, arguments);
    };
  }
}

function safelyResolveThenable(self, thenable) {
  // Either fulfill, reject or reject with error
  var called = false;
  function onError(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.reject(self, value);
  }

  function onSuccess(value) {
    if (called) {
      return;
    }
    called = true;
    handlers.resolve(self, value);
  }

  function tryToUnwrap() {
    thenable(onSuccess, onError);
  }

  var result = tryCatch(tryToUnwrap);
  if (result.status === 'error') {
    onError(result.value);
  }
}

function tryCatch(func, value) {
  var out = {};
  try {
    out.value = func(value);
    out.status = 'success';
  } catch (e) {
    out.status = 'error';
    out.value = e;
  }
  return out;
}

exports.resolve = resolve;
function resolve(value) {
  if (value instanceof this) {
    return value;
  }
  return handlers.resolve(new this(INTERNAL), value);
}

exports.reject = reject;
function reject(reason) {
  var promise = new this(INTERNAL);
  return handlers.reject(promise, reason);
}

exports.all = all;
function all(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var values = new Array(len);
  var resolved = 0;
  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    allResolver(iterable[i], i);
  }
  return promise;
  function allResolver(value, i) {
    self.resolve(value).then(resolveFromAll, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
    function resolveFromAll(outValue) {
      values[i] = outValue;
      if (++resolved === len && !called) {
        called = true;
        handlers.resolve(promise, values);
      }
    }
  }
}

exports.race = race;
function race(iterable) {
  var self = this;
  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
    return this.reject(new TypeError('must be an array'));
  }

  var len = iterable.length;
  var called = false;
  if (!len) {
    return this.resolve([]);
  }

  var i = -1;
  var promise = new this(INTERNAL);

  while (++i < len) {
    resolver(iterable[i]);
  }
  return promise;
  function resolver(value) {
    self.resolve(value).then(function (response) {
      if (!called) {
        called = true;
        handlers.resolve(promise, response);
      }
    }, function (error) {
      if (!called) {
        called = true;
        handlers.reject(promise, error);
      }
    });
  }
}

},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
if (typeof global.Promise !== 'function') {
  global.Promise = _dereq_(2);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
},{"2":2}],4:[function(_dereq_,module,exports){

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getIDB() {
    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
    } catch (e) {}
}

var idb = getIDB();

function isIndexedDBValid() {
    try {
        // Initialize IndexedDB; fall back to vendor-prefixed versions
        // if needed.
        if (!idb) {
            return false;
        }
        // We mimic PouchDB here;
        //
        // We test for openDatabase because IE Mobile identifies itself
        // as Safari. Oh the lulz...
        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

        // Safari <10.1 does not meet our requirements for IDB support (#5572)
        // since Safari 10.1 shipped with fetch, we can use that to detect it
        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
        // some outdated implementations of IDB that appear on Samsung
        // and HTC Android devices <4.4 are missing IDBKeyRange
        typeof IDBKeyRange !== 'undefined';
    } catch (e) {
        return false;
    }
}

function isWebSQLValid() {
    return typeof openDatabase === 'function';
}

function isLocalStorageValid() {
    try {
        return typeof localStorage !== 'undefined' && 'setItem' in localStorage && localStorage.setItem;
    } catch (e) {
        return false;
    }
}

// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
// Abstracts constructing a Blob object, so it also works in older
// browsers that don't support the native Blob constructor. (i.e.
// old QtWebKit versions, at least).
function createBlob(parts, properties) {
    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
    parts = parts || [];
    properties = properties || {};
    try {
        return new Blob(parts, properties);
    } catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}

// This is CommonJS because lie is an external dependency, so Rollup
// can just ignore it.
if (typeof Promise === 'undefined') {
    // In the "nopromises" build this will just throw if you don't have
    // a global promise object, but it would throw anyway later.
    _dereq_(3);
}
var Promise$1 = Promise;

function executeCallback(promise, callback) {
    if (callback) {
        promise.then(function (result) {
            callback(null, result);
        }, function (error) {
            callback(error);
        });
    }
}

function executeTwoCallbacks(promise, callback, errorCallback) {
    if (typeof callback === 'function') {
        promise.then(callback);
    }

    if (typeof errorCallback === 'function') {
        promise["catch"](errorCallback);
    }
}

// Some code originally from async_storage.js in
// [Gaia](https://github.com/mozilla-b2g/gaia).

var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
var supportsBlobs;
var dbContexts;
var toString = Object.prototype.toString;

// Transaction Modes
var READ_ONLY = 'readonly';
var READ_WRITE = 'readwrite';

// Transform a binary string to an array buffer, because otherwise
// weird stuff happens when you try to work with the binary string directly.
// It is known.
// From http://stackoverflow.com/questions/14967647/ (continues on next line)
// encode-decode-image-with-base64-breaks-image (2013-04-21)
function _binStringToArrayBuffer(bin) {
    var length = bin.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    for (var i = 0; i < length; i++) {
        arr[i] = bin.charCodeAt(i);
    }
    return buf;
}

//
// Blobs are not supported in all versions of IndexedDB, notably
// Chrome <37 and Android <5. In those versions, storing a blob will throw.
//
// Various other blob bugs exist in Chrome v37-42 (inclusive).
// Detecting them is expensive and confusing to users, and Chrome 37-42
// is at very low usage worldwide, so we do a hacky userAgent check instead.
//
// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
//
// Code borrowed from PouchDB. See:
// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
//
function _checkBlobSupportWithoutCaching(idb) {
    return new Promise$1(function (resolve) {
        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
        var blob = createBlob(['']);
        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

        txn.onabort = function (e) {
            // If the transaction aborts now its due to not being able to
            // write to the database, likely due to the disk being full
            e.preventDefault();
            e.stopPropagation();
            resolve(false);
        };

        txn.oncomplete = function () {
            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
            var matchedEdge = navigator.userAgent.match(/Edge\//);
            // MS Edge pretends to be Chrome 42:
            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
        };
    })["catch"](function () {
        return false; // error, so assume unsupported
    });
}

function _checkBlobSupport(idb) {
    if (typeof supportsBlobs === 'boolean') {
        return Promise$1.resolve(supportsBlobs);
    }
    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
        supportsBlobs = value;
        return supportsBlobs;
    });
}

function _deferReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Create a deferred object representing the current database operation.
    var deferredOperation = {};

    deferredOperation.promise = new Promise$1(function (resolve) {
        deferredOperation.resolve = resolve;
    });

    // Enqueue the deferred operation.
    dbContext.deferredOperations.push(deferredOperation);

    // Chain its promise to the database readiness.
    if (!dbContext.dbReady) {
        dbContext.dbReady = deferredOperation.promise;
    } else {
        dbContext.dbReady = dbContext.dbReady.then(function () {
            return deferredOperation.promise;
        });
    }
}

function _advanceReadiness(dbInfo) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Resolve its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.resolve();
    }
}

function _rejectReadiness(dbInfo, err) {
    var dbContext = dbContexts[dbInfo.name];

    // Dequeue a deferred operation.
    var deferredOperation = dbContext.deferredOperations.pop();

    // Reject its promise (which is part of the database readiness
    // chain of promises).
    if (deferredOperation) {
        deferredOperation.reject(err);
    }
}

function _getConnection(dbInfo, upgradeNeeded) {
    return new Promise$1(function (resolve, reject) {

        if (dbInfo.db) {
            if (upgradeNeeded) {
                _deferReadiness(dbInfo);
                dbInfo.db.close();
            } else {
                return resolve(dbInfo.db);
            }
        }

        var dbArgs = [dbInfo.name];

        if (upgradeNeeded) {
            dbArgs.push(dbInfo.version);
        }

        var openreq = idb.open.apply(idb, dbArgs);

        if (upgradeNeeded) {
            openreq.onupgradeneeded = function (e) {
                var db = openreq.result;
                try {
                    db.createObjectStore(dbInfo.storeName);
                    if (e.oldVersion <= 1) {
                        // Added when support for blob shims was added
                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
                    }
                } catch (ex) {
                    if (ex.name === 'ConstraintError') {
                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
                    } else {
                        throw ex;
                    }
                }
            };
        }

        openreq.onerror = function (e) {
            e.preventDefault();
            reject(openreq.error);
        };

        openreq.onsuccess = function () {
            resolve(openreq.result);
            _advanceReadiness(dbInfo);
        };
    });
}

function _getOriginalConnection(dbInfo) {
    return _getConnection(dbInfo, false);
}

function _getUpgradedConnection(dbInfo) {
    return _getConnection(dbInfo, true);
}

function _isUpgradeNeeded(dbInfo, defaultVersion) {
    if (!dbInfo.db) {
        return true;
    }

    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
    var isDowngrade = dbInfo.version < dbInfo.db.version;
    var isUpgrade = dbInfo.version > dbInfo.db.version;

    if (isDowngrade) {
        // If the version is not the default one
        // then warn for impossible downgrade.
        if (dbInfo.version !== defaultVersion) {
            console.warn('The database "' + dbInfo.name + '"' + ' can\'t be downgraded from version ' + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
        }
        // Align the versions to prevent errors.
        dbInfo.version = dbInfo.db.version;
    }

    if (isUpgrade || isNewStore) {
        // If the store is new then increment the version (if needed).
        // This will trigger an "upgradeneeded" event which is required
        // for creating a store.
        if (isNewStore) {
            var incVersion = dbInfo.db.version + 1;
            if (incVersion > dbInfo.version) {
                dbInfo.version = incVersion;
            }
        }

        return true;
    }

    return false;
}

// encode a blob for indexeddb engines that don't support blobs
function _encodeBlob(blob) {
    return new Promise$1(function (resolve, reject) {
        var reader = new FileReader();
        reader.onerror = reject;
        reader.onloadend = function (e) {
            var base64 = btoa(e.target.result || '');
            resolve({
                __local_forage_encoded_blob: true,
                data: base64,
                type: blob.type
            });
        };
        reader.readAsBinaryString(blob);
    });
}

// decode an encoded blob
function _decodeBlob(encodedBlob) {
    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
    return createBlob([arrayBuff], { type: encodedBlob.type });
}

// is this one of our fancy encoded blobs?
function _isEncodedBlob(value) {
    return value && value.__local_forage_encoded_blob;
}

// Specialize the default `ready()` function by making it dependent
// on the current database operations. Thus, the driver will be actually
// ready when it's been initialized (default) *and* there are no pending
// operations on the database (initiated by some other instances).
function _fullyReady(callback) {
    var self = this;

    var promise = self._initReady().then(function () {
        var dbContext = dbContexts[self._dbInfo.name];

        if (dbContext && dbContext.dbReady) {
            return dbContext.dbReady;
        }
    });

    executeTwoCallbacks(promise, callback, callback);
    return promise;
}

// Try to establish a new db connection to replace the
// current one which is broken (i.e. experiencing
// InvalidStateError while creating a transaction).
function _tryReconnect(dbInfo) {
    _deferReadiness(dbInfo);

    var dbContext = dbContexts[dbInfo.name];
    var forages = dbContext.forages;

    for (var i = 0; i < forages.length; i++) {
        if (forages[i]._dbInfo.db) {
            forages[i]._dbInfo.db.close();
            forages[i]._dbInfo.db = null;
        }
    }

    return _getConnection(dbInfo, false).then(function (db) {
        for (var j = 0; j < forages.length; j++) {
            forages[j]._dbInfo.db = db;
        }
    })["catch"](function (err) {
        _rejectReadiness(dbInfo, err);
        throw err;
    });
}

// FF doesn't like Promises (micro-tasks) and IDDB store operations,
// so we have to do it with callbacks
function createTransaction(dbInfo, mode, callback) {
    try {
        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
        callback(null, tx);
    } catch (err) {
        if (!dbInfo.db || err.name === 'InvalidStateError') {
            return _tryReconnect(dbInfo).then(function () {

                var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
                callback(null, tx);
            });
        }

        callback(err);
    }
}

// Open the IndexedDB database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    // Initialize a singleton container for all running localForages.
    if (!dbContexts) {
        dbContexts = {};
    }

    // Get the current context of the database;
    var dbContext = dbContexts[dbInfo.name];

    // ...or create a new context.
    if (!dbContext) {
        dbContext = {
            // Running localForages sharing a database.
            forages: [],
            // Shared database.
            db: null,
            // Database readiness (promise).
            dbReady: null,
            // Deferred operations on the database.
            deferredOperations: []
        };
        // Register the new context in the global container.
        dbContexts[dbInfo.name] = dbContext;
    }

    // Register itself as a running localForage in the current context.
    dbContext.forages.push(self);

    // Replace the default `ready()` function with the specialized one.
    if (!self._initReady) {
        self._initReady = self.ready;
        self.ready = _fullyReady;
    }

    // Create an array of initialization states of the related localForages.
    var initPromises = [];

    function ignoreErrors() {
        // Don't handle errors here,
        // just makes sure related localForages aren't pending.
        return Promise$1.resolve();
    }

    for (var j = 0; j < dbContext.forages.length; j++) {
        var forage = dbContext.forages[j];
        if (forage !== self) {
            // Don't wait for itself...
            initPromises.push(forage._initReady()["catch"](ignoreErrors));
        }
    }

    // Take a snapshot of the related localForages.
    var forages = dbContext.forages.slice(0);

    // Initialize the connection process only when
    // all the related localForages aren't pending.
    return Promise$1.all(initPromises).then(function () {
        dbInfo.db = dbContext.db;
        // Get the connection or open a new one without upgrade.
        return _getOriginalConnection(dbInfo);
    }).then(function (db) {
        dbInfo.db = db;
        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
            // Reopen the database for upgrading.
            return _getUpgradedConnection(dbInfo);
        }
        return db;
    }).then(function (db) {
        dbInfo.db = dbContext.db = db;
        self._dbInfo = dbInfo;
        // Share the final connection amongst related localForages.
        for (var k = 0; k < forages.length; k++) {
            var forage = forages[k];
            if (forage !== self) {
                // Self is already up-to-date.
                forage._dbInfo.db = dbInfo.db;
                forage._dbInfo.version = dbInfo.version;
            }
        }
    });
}

function getItem(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.get(key);

                    req.onsuccess = function () {
                        var value = req.result;
                        if (value === undefined) {
                            value = null;
                        }
                        if (_isEncodedBlob(value)) {
                            value = _decodeBlob(value);
                        }
                        resolve(value);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items stored in database.
function iterate(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var iterationNumber = 1;

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (cursor) {
                            var value = cursor.value;
                            if (_isEncodedBlob(value)) {
                                value = _decodeBlob(value);
                            }
                            var result = iterator(value, cursor.key, iterationNumber++);

                            // when the iterator callback retuns any
                            // (non-`undefined`) value, then we stop
                            // the iteration immediately
                            if (result !== void 0) {
                                resolve(result);
                            } else {
                                cursor["continue"]();
                            }
                        } else {
                            resolve();
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);

    return promise;
}

function setItem(key, value, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        var dbInfo;
        self.ready().then(function () {
            dbInfo = self._dbInfo;
            if (toString.call(value) === '[object Blob]') {
                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
                    if (blobSupport) {
                        return value;
                    }
                    return _encodeBlob(value);
                });
            }
            return value;
        }).then(function (value) {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.put(value, key);

                    // The reason we don't _save_ null is because IE 10 does
                    // not support saving the `null` type in IndexedDB. How
                    // ironic, given the bug below!
                    // See: https://github.com/mozilla/localForage/issues/161
                    if (value === null) {
                        value = undefined;
                    }

                    transaction.oncomplete = function () {
                        // Cast to undefined so the value passed to
                        // callback/promise is the same as what one would get out
                        // of `getItem()` later. This leads to some weirdness
                        // (setItem('foo', undefined) will return `null`), but
                        // it's not my fault localStorage is our baseline and that
                        // it's weird.
                        if (value === undefined) {
                            value = null;
                        }

                        resolve(value);
                    };
                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function removeItem(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    // We use a Grunt task to make this safe for IE and some
                    // versions of Android (including those used by Cordova).
                    // Normally IE won't like `.delete()` and will insist on
                    // using `['delete']()`, but we have a build step that
                    // fixes this for us now.
                    var req = store["delete"](key);
                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onerror = function () {
                        reject(req.error);
                    };

                    // The request will be also be aborted if we've exceeded our storage
                    // space.
                    transaction.onabort = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function clear(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.clear();

                    transaction.oncomplete = function () {
                        resolve();
                    };

                    transaction.onabort = transaction.onerror = function () {
                        var err = req.error ? req.error : req.transaction.error;
                        reject(err);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function length(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.count();

                    req.onsuccess = function () {
                        resolve(req.result);
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function key(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        if (n < 0) {
            resolve(null);

            return;
        }

        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var advanced = false;
                    var req = store.openCursor();

                    req.onsuccess = function () {
                        var cursor = req.result;
                        if (!cursor) {
                            // this means there weren't enough keys
                            resolve(null);

                            return;
                        }

                        if (n === 0) {
                            // We have the first key, return it if that's what they
                            // wanted.
                            resolve(cursor.key);
                        } else {
                            if (!advanced) {
                                // Otherwise, ask the cursor to skip ahead n
                                // records.
                                advanced = true;
                                cursor.advance(n);
                            } else {
                                // When we get here, we've got the nth key.
                                resolve(cursor.key);
                            }
                        }
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
                if (err) {
                    return reject(err);
                }

                try {
                    var store = transaction.objectStore(self._dbInfo.storeName);
                    var req = store.openCursor();
                    var keys = [];

                    req.onsuccess = function () {
                        var cursor = req.result;

                        if (!cursor) {
                            resolve(keys);
                            return;
                        }

                        keys.push(cursor.key);
                        cursor["continue"]();
                    };

                    req.onerror = function () {
                        reject(req.error);
                    };
                } catch (e) {
                    reject(e);
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

var asyncStorage = {
    _driver: 'asyncStorage',
    _initStorage: _initStorage,
    iterate: iterate,
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    keys: keys
};

// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
// it to Base64, so this is how we store it to prevent very strange errors with less
// verbose ways of binary <-> string data storage.
var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

var BLOB_TYPE_PREFIX = '~~local_forage_type~';
var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

var SERIALIZED_MARKER = '__lfsc__:';
var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

// OMG the serializations!
var TYPE_ARRAYBUFFER = 'arbf';
var TYPE_BLOB = 'blob';
var TYPE_INT8ARRAY = 'si08';
var TYPE_UINT8ARRAY = 'ui08';
var TYPE_UINT8CLAMPEDARRAY = 'uic8';
var TYPE_INT16ARRAY = 'si16';
var TYPE_INT32ARRAY = 'si32';
var TYPE_UINT16ARRAY = 'ur16';
var TYPE_UINT32ARRAY = 'ui32';
var TYPE_FLOAT32ARRAY = 'fl32';
var TYPE_FLOAT64ARRAY = 'fl64';
var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

var toString$1 = Object.prototype.toString;

function stringToBuffer(serializedString) {
    // Fill the string into a ArrayBuffer.
    var bufferLength = serializedString.length * 0.75;
    var len = serializedString.length;
    var i;
    var p = 0;
    var encoded1, encoded2, encoded3, encoded4;

    if (serializedString[serializedString.length - 1] === '=') {
        bufferLength--;
        if (serializedString[serializedString.length - 2] === '=') {
            bufferLength--;
        }
    }

    var buffer = new ArrayBuffer(bufferLength);
    var bytes = new Uint8Array(buffer);

    for (i = 0; i < len; i += 4) {
        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

        /*jslint bitwise: true */
        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
    }
    return buffer;
}

// Converts a buffer to a string to store, serialized, in the backend
// storage library.
function bufferToString(buffer) {
    // base64-arraybuffer
    var bytes = new Uint8Array(buffer);
    var base64String = '';
    var i;

    for (i = 0; i < bytes.length; i += 3) {
        /*jslint bitwise: true */
        base64String += BASE_CHARS[bytes[i] >> 2];
        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
        base64String += BASE_CHARS[bytes[i + 2] & 63];
    }

    if (bytes.length % 3 === 2) {
        base64String = base64String.substring(0, base64String.length - 1) + '=';
    } else if (bytes.length % 3 === 1) {
        base64String = base64String.substring(0, base64String.length - 2) + '==';
    }

    return base64String;
}

// Serialize a value, afterwards executing a callback (which usually
// instructs the `setItem()` callback/promise to be executed). This is how
// we store binary data with localStorage.
function serialize(value, callback) {
    var valueType = '';
    if (value) {
        valueType = toString$1.call(value);
    }

    // Cannot use `value instanceof ArrayBuffer` or such here, as these
    // checks fail when running the tests using casper.js...
    //
    // TODO: See why those tests fail and use a better solution.
    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
        // Convert binary arrays to a string and prefix the string with
        // a special marker.
        var buffer;
        var marker = SERIALIZED_MARKER;

        if (value instanceof ArrayBuffer) {
            buffer = value;
            marker += TYPE_ARRAYBUFFER;
        } else {
            buffer = value.buffer;

            if (valueType === '[object Int8Array]') {
                marker += TYPE_INT8ARRAY;
            } else if (valueType === '[object Uint8Array]') {
                marker += TYPE_UINT8ARRAY;
            } else if (valueType === '[object Uint8ClampedArray]') {
                marker += TYPE_UINT8CLAMPEDARRAY;
            } else if (valueType === '[object Int16Array]') {
                marker += TYPE_INT16ARRAY;
            } else if (valueType === '[object Uint16Array]') {
                marker += TYPE_UINT16ARRAY;
            } else if (valueType === '[object Int32Array]') {
                marker += TYPE_INT32ARRAY;
            } else if (valueType === '[object Uint32Array]') {
                marker += TYPE_UINT32ARRAY;
            } else if (valueType === '[object Float32Array]') {
                marker += TYPE_FLOAT32ARRAY;
            } else if (valueType === '[object Float64Array]') {
                marker += TYPE_FLOAT64ARRAY;
            } else {
                callback(new Error('Failed to get type for BinaryArray'));
            }
        }

        callback(marker + bufferToString(buffer));
    } else if (valueType === '[object Blob]') {
        // Conver the blob to a binaryArray and then to a string.
        var fileReader = new FileReader();

        fileReader.onload = function () {
            // Backwards-compatible prefix for the blob type.
            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
        };

        fileReader.readAsArrayBuffer(value);
    } else {
        try {
            callback(JSON.stringify(value));
        } catch (e) {
            console.error("Couldn't convert value into a JSON string: ", value);

            callback(null, e);
        }
    }
}

// Deserialize data we've inserted into a value column/field. We place
// special markers into our strings to mark them as encoded; this isn't
// as nice as a meta field, but it's the only sane thing we can do whilst
// keeping localStorage support intact.
//
// Oftentimes this will just deserialize JSON content, but if we have a
// special marker (SERIALIZED_MARKER, defined above), we will extract
// some kind of arraybuffer/binary data/typed array out of the string.
function deserialize(value) {
    // If we haven't marked this string as being specially serialized (i.e.
    // something other than serialized JSON), we can just return it and be
    // done with it.
    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
        return JSON.parse(value);
    }

    // The following code deals with deserializing some kind of Blob or
    // TypedArray. First we separate out the type of data we're dealing
    // with from the data itself.
    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

    var blobType;
    // Backwards-compatible blob type serialization strategy.
    // DBs created with older versions of localForage will simply not have the blob type.
    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
        blobType = matcher[1];
        serializedString = serializedString.substring(matcher[0].length);
    }
    var buffer = stringToBuffer(serializedString);

    // Return the right type based on the code/type set during
    // serialization.
    switch (type) {
        case TYPE_ARRAYBUFFER:
            return buffer;
        case TYPE_BLOB:
            return createBlob([buffer], { type: blobType });
        case TYPE_INT8ARRAY:
            return new Int8Array(buffer);
        case TYPE_UINT8ARRAY:
            return new Uint8Array(buffer);
        case TYPE_UINT8CLAMPEDARRAY:
            return new Uint8ClampedArray(buffer);
        case TYPE_INT16ARRAY:
            return new Int16Array(buffer);
        case TYPE_UINT16ARRAY:
            return new Uint16Array(buffer);
        case TYPE_INT32ARRAY:
            return new Int32Array(buffer);
        case TYPE_UINT32ARRAY:
            return new Uint32Array(buffer);
        case TYPE_FLOAT32ARRAY:
            return new Float32Array(buffer);
        case TYPE_FLOAT64ARRAY:
            return new Float64Array(buffer);
        default:
            throw new Error('Unkown type: ' + type);
    }
}

var localforageSerializer = {
    serialize: serialize,
    deserialize: deserialize,
    stringToBuffer: stringToBuffer,
    bufferToString: bufferToString
};

/*
 * Includes code from:
 *
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */
// Open the WebSQL database (automatically creates one if one didn't
// previously exist), using any options set in the config.
function _initStorage$1(options) {
    var self = this;
    var dbInfo = {
        db: null
    };

    if (options) {
        for (var i in options) {
            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
        }
    }

    var dbInfoPromise = new Promise$1(function (resolve, reject) {
        // Open the database; the openDatabase API will automatically
        // create it for us if it doesn't exist.
        try {
            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
        } catch (e) {
            return reject(e);
        }

        // Create our key/value table if it doesn't exist.
        dbInfo.db.transaction(function (t) {
            t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' (id INTEGER PRIMARY KEY, key unique, value)', [], function () {
                self._dbInfo = dbInfo;
                resolve();
            }, function (t, error) {
                reject(error);
            });
        });
    });

    dbInfo.serializer = localforageSerializer;
    return dbInfoPromise;
}

function getItem$1(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).value : null;

                    // Check to see if this is serialized content we need to
                    // unpack.
                    if (result) {
                        result = dbInfo.serializer.deserialize(result);
                    }

                    resolve(result);
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function iterate$1(iterator, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;

            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
                    var rows = results.rows;
                    var length = rows.length;

                    for (var i = 0; i < length; i++) {
                        var item = rows.item(i);
                        var result = item.value;

                        // Check to see if this is serialized content
                        // we need to unpack.
                        if (result) {
                            result = dbInfo.serializer.deserialize(result);
                        }

                        result = iterator(result, item.key, i + 1);

                        // void(0) prevents problems with redefinition
                        // of `undefined`.
                        if (result !== void 0) {
                            resolve(result);
                            return;
                        }
                    }

                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function _setItem(key, value, callback, retriesLeft) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            // The localStorage API doesn't return undefined values in an
            // "expected" way, so undefined is always cast to null in all
            // drivers. See: https://github.com/mozilla/localForage/pull/42
            if (value === undefined) {
                value = null;
            }

            // Save the original value to pass to the callback.
            var originalValue = value;

            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    dbInfo.db.transaction(function (t) {
                        t.executeSql('INSERT OR REPLACE INTO ' + dbInfo.storeName + ' (key, value) VALUES (?, ?)', [key, value], function () {
                            resolve(originalValue);
                        }, function (t, error) {
                            reject(error);
                        });
                    }, function (sqlError) {
                        // The transaction failed; check
                        // to see if it's a quota error.
                        if (sqlError.code === sqlError.QUOTA_ERR) {
                            // We reject the callback outright for now, but
                            // it's worth trying to re-run the transaction.
                            // Even if the user accepts the prompt to use
                            // more storage on Safari, this error will
                            // be called.
                            //
                            // Try to re-run the transaction.
                            if (retriesLeft > 0) {
                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
                                return;
                            }
                            reject(sqlError);
                        }
                    });
                }
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function setItem$1(key, value, callback) {
    return _setItem.apply(this, [key, value, callback, 1]);
}

function removeItem$1(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
                    resolve();
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Deletes every item in the table.
// TODO: Find out if this resets the AUTO_INCREMENT number.
function clear$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('DELETE FROM ' + dbInfo.storeName, [], function () {
                    resolve();
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Does a simple `COUNT(key)` to get the number of items stored in
// localForage.
function length$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                // Ahhh, SQL makes this one soooooo easy.
                t.executeSql('SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
                    var result = results.rows.item(0).c;

                    resolve(result);
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

// Return the key located at key index X; essentially gets the key from a
// `WHERE id = ?`. This is the most efficient way I can think to implement
// this rarely-used (in my experience) part of the API, but it can seem
// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
// the ID of each key will change every time it's updated. Perhaps a stored
// procedure for the `setItem()` SQL would solve this problem?
// TODO: Don't change ID on `setItem()`.
function key$1(n, callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
                    var result = results.rows.length ? results.rows.item(0).key : null;
                    resolve(result);
                }, function (t, error) {
                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$1(callback) {
    var self = this;

    var promise = new Promise$1(function (resolve, reject) {
        self.ready().then(function () {
            var dbInfo = self._dbInfo;
            dbInfo.db.transaction(function (t) {
                t.executeSql('SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
                    var keys = [];

                    for (var i = 0; i < results.rows.length; i++) {
                        keys.push(results.rows.item(i).key);
                    }

                    resolve(keys);
                }, function (t, error) {

                    reject(error);
                });
            });
        })["catch"](reject);
    });

    executeCallback(promise, callback);
    return promise;
}

var webSQLStorage = {
    _driver: 'webSQLStorage',
    _initStorage: _initStorage$1,
    iterate: iterate$1,
    getItem: getItem$1,
    setItem: setItem$1,
    removeItem: removeItem$1,
    clear: clear$1,
    length: length$1,
    key: key$1,
    keys: keys$1
};

// Config the localStorage backend, using options set in the config.
function _initStorage$2(options) {
    var self = this;
    var dbInfo = {};
    if (options) {
        for (var i in options) {
            dbInfo[i] = options[i];
        }
    }

    dbInfo.keyPrefix = dbInfo.name + '/';

    if (dbInfo.storeName !== self._defaultConfig.storeName) {
        dbInfo.keyPrefix += dbInfo.storeName + '/';
    }

    self._dbInfo = dbInfo;
    dbInfo.serializer = localforageSerializer;

    return Promise$1.resolve();
}

// Remove all keys from the datastore, effectively destroying all data in
// the app's key/value store!
function clear$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var keyPrefix = self._dbInfo.keyPrefix;

        for (var i = localStorage.length - 1; i >= 0; i--) {
            var key = localStorage.key(i);

            if (key.indexOf(keyPrefix) === 0) {
                localStorage.removeItem(key);
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Retrieve an item from the store. Unlike the original async_storage
// library in Gaia, we don't modify return values at all. If a key's value
// is `undefined`, we pass that value to the callback function.
function getItem$2(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result = localStorage.getItem(dbInfo.keyPrefix + key);

        // If a result was found, parse it from the serialized
        // string into a JS object. If result isn't truthy, the key
        // is likely undefined and we'll pass it straight to the
        // callback.
        if (result) {
            result = dbInfo.serializer.deserialize(result);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

// Iterate over all items in the store.
function iterate$2(iterator, callback) {
    var self = this;

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var keyPrefix = dbInfo.keyPrefix;
        var keyPrefixLength = keyPrefix.length;
        var length = localStorage.length;

        // We use a dedicated iterator instead of the `i` variable below
        // so other keys we fetch in localStorage aren't counted in
        // the `iterationNumber` argument passed to the `iterate()`
        // callback.
        //
        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
        var iterationNumber = 1;

        for (var i = 0; i < length; i++) {
            var key = localStorage.key(i);
            if (key.indexOf(keyPrefix) !== 0) {
                continue;
            }
            var value = localStorage.getItem(key);

            // If a result was found, parse it from the serialized
            // string into a JS object. If result isn't truthy, the
            // key is likely undefined and we'll pass it straight
            // to the iterator.
            if (value) {
                value = dbInfo.serializer.deserialize(value);
            }

            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

            if (value !== void 0) {
                return value;
            }
        }
    });

    executeCallback(promise, callback);
    return promise;
}

// Same as localStorage's key() method, except takes a callback.
function key$2(n, callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var result;
        try {
            result = localStorage.key(n);
        } catch (error) {
            result = null;
        }

        // Remove the prefix from the key, if a key is found.
        if (result) {
            result = result.substring(dbInfo.keyPrefix.length);
        }

        return result;
    });

    executeCallback(promise, callback);
    return promise;
}

function keys$2(callback) {
    var self = this;
    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        var length = localStorage.length;
        var keys = [];

        for (var i = 0; i < length; i++) {
            if (localStorage.key(i).indexOf(dbInfo.keyPrefix) === 0) {
                keys.push(localStorage.key(i).substring(dbInfo.keyPrefix.length));
            }
        }

        return keys;
    });

    executeCallback(promise, callback);
    return promise;
}

// Supply the number of keys in the datastore to the callback function.
function length$2(callback) {
    var self = this;
    var promise = self.keys().then(function (keys) {
        return keys.length;
    });

    executeCallback(promise, callback);
    return promise;
}

// Remove an item from the store, nice and simple.
function removeItem$2(key, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = self.ready().then(function () {
        var dbInfo = self._dbInfo;
        localStorage.removeItem(dbInfo.keyPrefix + key);
    });

    executeCallback(promise, callback);
    return promise;
}

// Set a key's value and run an optional callback once the value is set.
// Unlike Gaia's implementation, the callback function is passed the value,
// in case you want to operate on that value only after you're sure it
// saved, or something like that.
function setItem$2(key, value, callback) {
    var self = this;

    // Cast the key to a string, as that's all we can set as a key.
    if (typeof key !== 'string') {
        console.warn(key + ' used as a key, but it is not a string.');
        key = String(key);
    }

    var promise = self.ready().then(function () {
        // Convert undefined values to null.
        // https://github.com/mozilla/localForage/pull/42
        if (value === undefined) {
            value = null;
        }

        // Save the original value to pass to the callback.
        var originalValue = value;

        return new Promise$1(function (resolve, reject) {
            var dbInfo = self._dbInfo;
            dbInfo.serializer.serialize(value, function (value, error) {
                if (error) {
                    reject(error);
                } else {
                    try {
                        localStorage.setItem(dbInfo.keyPrefix + key, value);
                        resolve(originalValue);
                    } catch (e) {
                        // localStorage capacity exceeded.
                        // TODO: Make this a specific error/event.
                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
                            reject(e);
                        }
                        reject(e);
                    }
                }
            });
        });
    });

    executeCallback(promise, callback);
    return promise;
}

var localStorageWrapper = {
    _driver: 'localStorageWrapper',
    _initStorage: _initStorage$2,
    // Default API, from Gaia/localStorage.
    iterate: iterate$2,
    getItem: getItem$2,
    setItem: setItem$2,
    removeItem: removeItem$2,
    clear: clear$2,
    length: length$2,
    key: key$2,
    keys: keys$2
};

// Custom drivers are stored here when `defineDriver()` is called.
// They are shared across all instances of localForage.
var CustomDrivers = {};

var DriverType = {
    INDEXEDDB: 'asyncStorage',
    LOCALSTORAGE: 'localStorageWrapper',
    WEBSQL: 'webSQLStorage'
};

var DefaultDriverOrder = [DriverType.INDEXEDDB, DriverType.WEBSQL, DriverType.LOCALSTORAGE];

var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'];

var DefaultConfig = {
    description: '',
    driver: DefaultDriverOrder.slice(),
    name: 'localforage',
    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
    // we can use without a prompt.
    size: 4980736,
    storeName: 'keyvaluepairs',
    version: 1.0
};

var driverSupport = {};
// Check to see if IndexedDB is available and if it is the latest
// implementation; it's our preferred backend library. We use "_spec_test"
// as the name of the database because it's not the one we'll operate on,
// but it's useful to make sure its using the right spec.
// See: https://github.com/mozilla/localForage/issues/128
driverSupport[DriverType.INDEXEDDB] = isIndexedDBValid();

driverSupport[DriverType.WEBSQL] = isWebSQLValid();

driverSupport[DriverType.LOCALSTORAGE] = isLocalStorageValid();

var isArray = Array.isArray || function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};

function callWhenReady(localForageInstance, libraryMethod) {
    localForageInstance[libraryMethod] = function () {
        var _args = arguments;
        return localForageInstance.ready().then(function () {
            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
        });
    };
}

function extend() {
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];

        if (arg) {
            for (var key in arg) {
                if (arg.hasOwnProperty(key)) {
                    if (isArray(arg[key])) {
                        arguments[0][key] = arg[key].slice();
                    } else {
                        arguments[0][key] = arg[key];
                    }
                }
            }
        }
    }

    return arguments[0];
}

function isLibraryDriver(driverName) {
    for (var driver in DriverType) {
        if (DriverType.hasOwnProperty(driver) && DriverType[driver] === driverName) {
            return true;
        }
    }

    return false;
}

var LocalForage = function () {
    function LocalForage(options) {
        _classCallCheck(this, LocalForage);

        this.INDEXEDDB = DriverType.INDEXEDDB;
        this.LOCALSTORAGE = DriverType.LOCALSTORAGE;
        this.WEBSQL = DriverType.WEBSQL;

        this._defaultConfig = extend({}, DefaultConfig);
        this._config = extend({}, this._defaultConfig, options);
        this._driverSet = null;
        this._initDriver = null;
        this._ready = false;
        this._dbInfo = null;

        this._wrapLibraryMethodsWithReady();
        this.setDriver(this._config.driver)["catch"](function () {});
    }

    // Set any config values for localForage; can be called anytime before
    // the first API call (e.g. `getItem`, `setItem`).
    // We loop through options so we don't overwrite existing config
    // values.


    LocalForage.prototype.config = function config(options) {
        // If the options argument is an object, we use it to set values.
        // Otherwise, we return either a specified config value or all
        // config values.
        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
            // If localforage is ready and fully initialized, we can't set
            // any new configuration values. Instead, we return an error.
            if (this._ready) {
                return new Error("Can't call config() after localforage " + 'has been used.');
            }

            for (var i in options) {
                if (i === 'storeName') {
                    options[i] = options[i].replace(/\W/g, '_');
                }

                if (i === 'version' && typeof options[i] !== 'number') {
                    return new Error('Database version must be a number.');
                }

                this._config[i] = options[i];
            }

            // after all config options are set and
            // the driver option is used, try setting it
            if ('driver' in options && options.driver) {
                return this.setDriver(this._config.driver);
            }

            return true;
        } else if (typeof options === 'string') {
            return this._config[options];
        } else {
            return this._config;
        }
    };

    // Used to define a custom driver, shared across all instances of
    // localForage.


    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
        var promise = new Promise$1(function (resolve, reject) {
            try {
                var driverName = driverObject._driver;
                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');
                var namingError = new Error('Custom driver name already in use: ' + driverObject._driver);

                // A driver name should be defined and not overlap with the
                // library-defined, default drivers.
                if (!driverObject._driver) {
                    reject(complianceError);
                    return;
                }
                if (isLibraryDriver(driverObject._driver)) {
                    reject(namingError);
                    return;
                }

                var customDriverMethods = LibraryMethods.concat('_initStorage');
                for (var i = 0; i < customDriverMethods.length; i++) {
                    var customDriverMethod = customDriverMethods[i];
                    if (!customDriverMethod || !driverObject[customDriverMethod] || typeof driverObject[customDriverMethod] !== 'function') {
                        reject(complianceError);
                        return;
                    }
                }

                var setDriverSupport = function setDriverSupport(support) {
                    driverSupport[driverName] = support;
                    CustomDrivers[driverName] = driverObject;
                    resolve();
                };

                if ('_support' in driverObject) {
                    if (driverObject._support && typeof driverObject._support === 'function') {
                        driverObject._support().then(setDriverSupport, reject);
                    } else {
                        setDriverSupport(!!driverObject._support);
                    }
                } else {
                    setDriverSupport(true);
                }
            } catch (e) {
                reject(e);
            }
        });

        executeTwoCallbacks(promise, callback, errorCallback);
        return promise;
    };

    LocalForage.prototype.driver = function driver() {
        return this._driver || null;
    };

    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
        var self = this;
        var getDriverPromise = Promise$1.resolve().then(function () {
            if (isLibraryDriver(driverName)) {
                switch (driverName) {
                    case self.INDEXEDDB:
                        return asyncStorage;
                    case self.LOCALSTORAGE:
                        return localStorageWrapper;
                    case self.WEBSQL:
                        return webSQLStorage;
                }
            } else if (CustomDrivers[driverName]) {
                return CustomDrivers[driverName];
            } else {
                throw new Error('Driver not found.');
            }
        });
        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
        return getDriverPromise;
    };

    LocalForage.prototype.getSerializer = function getSerializer(callback) {
        var serializerPromise = Promise$1.resolve(localforageSerializer);
        executeTwoCallbacks(serializerPromise, callback);
        return serializerPromise;
    };

    LocalForage.prototype.ready = function ready(callback) {
        var self = this;

        var promise = self._driverSet.then(function () {
            if (self._ready === null) {
                self._ready = self._initDriver();
            }

            return self._ready;
        });

        executeTwoCallbacks(promise, callback, callback);
        return promise;
    };

    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
        var self = this;

        if (!isArray(drivers)) {
            drivers = [drivers];
        }

        var supportedDrivers = this._getSupportedDrivers(drivers);

        function setDriverToConfig() {
            self._config.driver = self.driver();
        }

        function extendSelfWithDriver(driver) {
            self._extend(driver);
            setDriverToConfig();

            self._ready = self._initStorage(self._config);
            return self._ready;
        }

        function initDriver(supportedDrivers) {
            return function () {
                var currentDriverIndex = 0;

                function driverPromiseLoop() {
                    while (currentDriverIndex < supportedDrivers.length) {
                        var driverName = supportedDrivers[currentDriverIndex];
                        currentDriverIndex++;

                        self._dbInfo = null;
                        self._ready = null;

                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
                    }

                    setDriverToConfig();
                    var error = new Error('No available storage method found.');
                    self._driverSet = Promise$1.reject(error);
                    return self._driverSet;
                }

                return driverPromiseLoop();
            };
        }

        // There might be a driver initialization in progress
        // so wait for it to finish in order to avoid a possible
        // race condition to set _dbInfo
        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
            return Promise$1.resolve();
        }) : Promise$1.resolve();

        this._driverSet = oldDriverSetDone.then(function () {
            var driverName = supportedDrivers[0];
            self._dbInfo = null;
            self._ready = null;

            return self.getDriver(driverName).then(function (driver) {
                self._driver = driver._driver;
                setDriverToConfig();
                self._wrapLibraryMethodsWithReady();
                self._initDriver = initDriver(supportedDrivers);
            });
        })["catch"](function () {
            setDriverToConfig();
            var error = new Error('No available storage method found.');
            self._driverSet = Promise$1.reject(error);
            return self._driverSet;
        });

        executeTwoCallbacks(this._driverSet, callback, errorCallback);
        return this._driverSet;
    };

    LocalForage.prototype.supports = function supports(driverName) {
        return !!driverSupport[driverName];
    };

    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
        extend(this, libraryMethodsAndProperties);
    };

    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
        var supportedDrivers = [];
        for (var i = 0, len = drivers.length; i < len; i++) {
            var driverName = drivers[i];
            if (this.supports(driverName)) {
                supportedDrivers.push(driverName);
            }
        }
        return supportedDrivers;
    };

    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
        // Add a stub for each driver API method that delays the call to the
        // corresponding driver method until localForage is ready. These stubs
        // will be replaced by the driver methods as soon as the driver is
        // loaded, so there is no performance impact.
        for (var i = 0; i < LibraryMethods.length; i++) {
            callWhenReady(this, LibraryMethods[i]);
        }
    };

    LocalForage.prototype.createInstance = function createInstance(options) {
        return new LocalForage(options);
    };

    return LocalForage;
}();

// The actual localForage object that we expose as a module or via a
// global. It's extended by pulling in one of our other libraries.


var localforage_js = new LocalForage();

module.exports = localforage_js;

},{"3":3}]},{},[4])(4)

});

const localForage = new createLocalForage();var Module$1 = (function() {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  return (
function(Module) {
  Module = Module || {};



  return Module
}
);
})();globalThis.BasisTextureLoader=BasisTextureLoader;
const sleep = msec => new Promise((resolve) => setTimeout(resolve, msec));

console.log(BasisTextureLoader);


const entityInstanceVertexShaderSource = `\`
	precision highp float;
	
	attribute vec3 a_Position;
	attribute vec2 a_Uv;
	attribute vec4 a_Color;
	
	attribute vec4 a_InstancedMatrix0;
	attribute vec4 a_InstancedMatrix1;
	attribute vec4 a_InstancedMatrix2;
	attribute vec4 a_InstancedMatrix3;	
	
	varying vec2 v_Uv;
	varying vec4 v_Color;
	
	void main() {
		mat4 instancedMatrix = mat4( a_InstancedMatrix0, a_InstancedMatrix1, a_InstancedMatrix2, a_InstancedMatrix3 );
		v_Uv = a_Uv;
		v_Color = a_Color / 255.0;
		gl_Position = instancedMatrix * vec4(a_Position, 1.0);
	}
\``.replace(/`/g, "");
const entityInstanceFragmentShaderSource = `\`
	precision highp float;
	
	uniform sampler2D u_Texture;
	
	varying vec2 v_Uv;
	varying vec4 v_Color;
	
	void main() {
		vec4 texColor = texture2D(u_Texture, v_Uv);
		gl_FragColor = texColor * v_Color;
	}
\``.replace(/`/g, "");

function getShaderSource_BSP() {
	return [
	`\`
		precision highp float;

		uniform mat4 u_ProjectionViewMatrix;
		//uniform sampler2D u_DataTexture;

		attribute vec3 a_Position;
		attribute vec2 a_Uv;
		attribute vec2 a_LgtUv;
		attribute vec4 a_Color;

		varying vec2 v_Uv;
		varying vec2 v_LgtUv;
		varying vec4 v_Color;
		
		varying float v_Z;
		
		vec4 readVecFromTexture2D(float offset, sampler2D tex, float width, float height) {
			vec2 uv = vec2(
				mod  (offset,  width) + 0.2,
				floor(offset / width) + 0.2
			);
			uv.x /= width;
			uv.y /= height;
			return texture2D(tex, uv);
		}
		mat4 readMat4FromTexture2D(float offset, sampler2D tex, float width, float height) {
			return mat4(
				readVecFromTexture2D(offset + 0.0, tex, width, height),
				readVecFromTexture2D(offset + 1.0, tex, width, height),
				readVecFromTexture2D(offset + 2.0, tex, width, height),
				readVecFromTexture2D(offset + 3.0, tex, width, height)
			);
		}

		void main() {
			v_Uv = a_Uv;
			v_LgtUv = a_LgtUv / 32767.0;
			v_Color = a_Color / 255.0;

			gl_Position = 
				u_ProjectionViewMatrix * 
			//	readMat4FromTexture2D(0.0, u_DataTexture, 1024.0, 1.0) * 
				vec4(a_Position, 1.0);

			//v_Color = vec4(v_LgtUv, 1, 1);
			//v_Color = fract( vec4(v_Uv, 1, 1) );
			
			v_Z = gl_Position.z;
		}
	\``,
	`\`
		precision highp float;
		
		uniform sampler2D u_Texture;
		uniform sampler2D u_LgtTexture;
		
		uniform vec4 u_Color;
		
		varying vec2 v_Uv;
		varying vec2 v_LgtUv;
		varying vec4 v_Color;
		
		varying float v_Z;
		
		uniform float u_GammaFactor;
		#define GAMMA_FACTOR 2.2
		vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
			return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
		}

		void main() {
			vec4 lgtTexColor = texture2D(u_LgtTexture, v_LgtUv);
			vec4 texColor = texture2D(u_Texture, v_Uv);
			gl_FragColor = vec4(1)
				* lgtTexColor
				* texColor
				* v_Color
				* u_Color
			;
			/**
			gl_FragColor = LinearToGamma(gl_FragColor, u_GammaFactor);
			//gl_FragColor = v_Color;
			//gl_FragColor.a = 1.0;

			float z = v_Z;
			float fogNear = 7000.0;
			float fogFar = 10000.0;
			//vec3 fogColor = vec3(0.5254901960784314, 0.7058823529411765, 0.7490196078431373);
			vec3 fogColor = vec3(0.7490196078431373, 0.7058823529411765, 0.5254901960784314);
			
			fogNear = 1500.000000;
			fogFar =  12000.000000;
			fogColor = vec3(0.8431372549019608, 0.6509803921568628, 0.4);
			fogColor = vec3(0.4, 0.6509803921568628, 0.8431372549019608);
			float fogFactor = (z - fogNear) / (fogFar - fogNear);
			if ( fogFactor < 0.0 ) fogFactor = 0.0;
			if ( fogFactor > 1.0 ) fogFactor = 1.0;
			fogFactor=0.0;
			//fogFactor = ( v_Z > 1000.0 ) ? 0.0 : 1.0;

			
			//float fogFactor = smoothstep( -0.5, -1.0, v_Z );
			gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor );
			
			*/
		}
	\``
	].map(s => s.replace(/`/g, ""));
}
function getShaderSource_ENTITY() {
	return [
	`\`
		precision highp float;
		
		attribute vec3 a_Position;
		attribute vec2 a_Uv;
		attribute vec4 a_Color;
		
		uniform mat4 u_ProjectionViewMatrix;
		
		varying vec2 v_Uv;
		varying vec4 v_Color;
		
		void main() {
			v_Uv = a_Uv;
			v_Color = a_Color / 255.0;
			gl_Position = u_ProjectionViewMatrix * vec4(a_Position, 1.0);
		}
	\``,
	`\`
		precision highp float;
		
		uniform sampler2D u_Texture;
		uniform vec4      u_Color;
		
		varying vec2 v_Uv;
		varying vec4 v_Color;
		
		uniform float u_GammaFactor;
		#define GAMMA_FACTOR 2.2
		vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
			return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
		}
		
		void main() {
			vec4 texColor = texture2D(u_Texture, v_Uv);
			gl_FragColor = 
				texColor 
				* v_Color
				* u_Color
				;
			
		//	gl_FragColor = LinearToGamma(gl_FragColor, u_GammaFactor);
		}
	\``
	].map(s => s.replace(/`/g, ""));
}

function parseBuffer(buffer) {
	const ctx = ( buffer instanceof ArrayBuffer ) ? {
		arrayBuffer: buffer, 
		byteOffset : 0, 
		byteLength : buffer.byteLength
	} : {
		arrayBuffer: buffer.buffer,
		byteOffset : buffer.byteOffset,
		byteLength : buffer.byteLength,
	};
	
	ctx.uint8array = new Uint8Array(ctx.arrayBuffer, ctx.byteOffset, ctx.byteLength);
	
	return ctx;
}
function reallocArrayBuffer(arrayBuffer, newByteLength) {
	const oldBuf = parseBuffer(arrayBuffer);
	const newBuf = parseBuffer(new ArrayBuffer(newByteLength));
	newBuf.uint8array.set(oldBuf.uint8array.subarray(0, Math.min(oldBuf.byteLength, newBuf.byteLength)));
	return newBuf.arrayBuffer;
}

function createCanvas(width = 640, height = 420, isAppend = true) {
	const canvas = document.createElement("canvas");
	if ( isAppend ) {
		Object.assign(canvas, {width, height});
		Object.assign(canvas.style, {
			width : `${width}px`,
			height: `${height}px`,
			"box-shadow": "0 0 20px 0px",
			margin: "10px",
			position: "fixed",
			top: "0px",
			left: "0px",
			
			left: `calc(50% - ${width}px/2)`,
			top: `calc(50% - ${height}px/2)`,
			margin: "0px",
		});
		document.body.appendChild(canvas);
	}
	return canvas;
}
function compileShader(gl, vShaderSource, fShaderSource) {
	const glVertexShader = gl.createShader(gl.VERTEX_SHADER);
	const glFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(glVertexShader, vShaderSource);
	gl.shaderSource(glFragmentShader, fShaderSource);

	for(const shader of [glVertexShader, glFragmentShader]) {
		gl.compileShader(shader);
		if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {
			const error = gl.getShaderInfoLog(shader);
			console.error("Error compile shader: " + error);
			throw new Error(error);
		}
	}

	return {glVertexShader, glFragmentShader};
}
function createProgram(gl, glVertexShader, glFragmentShader) {
	const glProgram = gl.createProgram();  
	gl.attachShader(glProgram, glVertexShader);  
	gl.attachShader(glProgram, glFragmentShader);  
	gl.linkProgram(glProgram);
	if ( !gl.getProgramParameter(glProgram, gl.LINK_STATUS) ) {
		const error = gl.getProgramInfoLog(glProgram);
		console.error("Linking shader program error: " + error);
		throw new Error(error);
	}
	
	return glProgram;
}
function getInfoPrgoram(gl, glProgram) {
	const aNum = gl.getProgramParameter(glProgram, gl.ACTIVE_ATTRIBUTES);
	const uNum = gl.getProgramParameter(glProgram, gl.ACTIVE_UNIFORMS);

	const glActiveAttributes = Array(aNum).fill(0).map((v, i) => gl.getActiveAttrib(glProgram, i));
	const glActiveUniforms = Array(uNum).fill(0).map((v, i) => gl.getActiveUniform(glProgram, i));

	const attributes = {};
	const uniforms = {};

	glActiveAttributes.map(({name}) => attributes[name] = gl.getAttribLocation (glProgram, name));
	glActiveUniforms  .map(({name}) => uniforms  [name] = gl.getUniformLocation(glProgram, name));
	
	const names = {...attributes, ...uniforms};
	
	return {glActiveAttributes, glActiveUniforms, attributes, uniforms, names};
}
class GlProgram {
	constructor(gl, vertexShaderSource, fragmentShaderSource) {
		this.gl = gl;

		const {glVertexShader, glFragmentShader} = compileShader(gl, vertexShaderSource, fragmentShaderSource);
		this.glVertexShader = glVertexShader;
		this.glFragmentShader = glFragmentShader;

		const glProgram = createProgram(gl, glVertexShader, glFragmentShader);
		this.glProgram = glProgram;

		const infoProgram = getInfoPrgoram(gl, glProgram);
		Object.assign(this, infoProgram.names);
		Object.assign(this, infoProgram);
	}
	use() {
		const gl = this.gl;
		gl.useProgram(this.glProgram);
	}
}
class GlBuffer {
	constructor(gl, bufferType, drawType) {
		bufferType = bufferType !== undefined ? bufferType : gl.ARRAY_BUFFER;
		drawType = drawType !== undefined ? drawType : gl.STATIC_DRAW;
		
		this.gl = gl;
		this.glBufferType = bufferType;
		this.glBufferDrawType = drawType;

		this.glBuffer = gl.createBuffer();
		this.size = 0;
		this.byteCursor = 0;
		
		this.arrayBuffer = new ArrayBuffer(0);
	}

	bind() {
		const gl = this.gl;
		gl.bindBuffer(this.glBufferType, this.glBuffer);
		return this;
	}
	
	_updateBufferData() {
		const gl = this.gl;
		gl.bufferData(this.glBufferType, this.arrayBuffer, this.glBufferDrawType);
		this.size = this.arrayBuffer.byteLength;
		
		return this;
	}
	_prepareSize(newSize) {
		if ( newSize > this.size ) {
			let tmpSize = this.size + 1;
			while(tmpSize < newSize)
				tmpSize *= 2;
			
			this.arrayBuffer = reallocArrayBuffer(this.arrayBuffer, tmpSize);
			this._updateBufferData();
		}
	}

	bufferData(buffer) {
		const gl = this.gl;
		const buf = parseBuffer(buffer);
		this.arrayBuffer = reallocArrayBuffer(this.arrayBuffer, buf.byteLength);
		parseBuffer(this.arrayBuffer).uint8array.set(buf.uint8array);
		this._updateBufferData();
		
		return this;
	}
	bufferSubData(buffer, offset = 0) {
		const gl = this.gl;
		const buf = parseBuffer(buffer);
		this._prepareSize(offset + buf.byteLength);
		gl.bufferSubData(this.glBufferType, offset, buffer);
		parseBuffer(this.arrayBuffer).uint8array.set(buf.uint8array, offset);
		return this;
	}
	bufferAppendData(buffer) {
		this.bufferSubData(buffer, this.byteCursor);
		const byteCursor = this.byteCursor;
		this.byteCursor += buffer.byteLength;
		return byteCursor;
	}
	setByteCursor(byteCursor = 0) {
		this.byteCursor = byteCursor;
	}
	getByteCursor() {
		return this.byteCursor;
	}
	
}
class FloatTexture {
	constructor(gl, numFloats = 1024, width = 1024) {
		this._gl;
		
		this._glTexture;
		
		this._numFloats = 1024*4;
		this._width = 1024;
		this._height = 1;
		
		this._arrayBuffer = new ArrayBuffer();
		this._floatArray = new Float32Array(this._arrayBuffer);

		
		this._gl = gl;
		this._width = width;
		
		this
			._createTexture()
			.setNumFloats(numFloats);
	}
	
	_updateBuffer() {
		if ( this._floatArray.length === this._numFloats )
			return this;
		
		const arrayBuffer = new ArrayBuffer(this._numFloats * 4);
		const floatArray = new Float32Array(arrayBuffer);
		
		floatArray.set(this._floatArray.subarray(0, floatArray.length));
		
		this._arrayBuffer = arrayBuffer;
		this._floatArray = floatArray;
		
		return this;
	}
	_setNumFloats(_numFloats) {
		const numFloats = Math.ceil(_numFloats / 4) * 4;
		const numTexels = numFloats / 4;

		this._height = Math.ceil(numTexels / this._width);

		this._numFloats = this._width * this._height * 4;
		
		return this;
	}
	_createTexture() {
		const gl = this._gl;

		const glTexture = this._glTexture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, glTexture);
		
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		
		return this;
	}
	
	bind() {
		const gl = this._gl;
		gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
		return this;
	}
	unbind() {
		const gl = this._gl;
		gl.bindTexture(gl.TEXTURE_2D, null);
		return this;
	}
	update() {
		const gl = this._gl;
		this
			._updateBuffer()
			.bind();
		
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this._width, this._height, false, gl.RGBA, gl.FLOAT, this._floatArray);
		return this;
	}
	
	setNumFloats(numFloats) {
		this
			._setNumFloats(numFloats)
			.update();
	}
	
	texture2D(uv) {
		const offset = Math.floor(uv.x * this._width) + Math.floor(uv.y * this._height) * this._width;
		return [
			this.floatArray[offset * 4 + 0],
			this.floatArray[offset * 4 + 1],
			this.floatArray[offset * 4 + 2],
			this.floatArray[offset * 4 + 3],
		];
	}
	readVecFromTexture2DRaw(offset, width, height) {
		const uv = {
			x: (offset % width) + 0.2,
			y: Math.floor(offset / width) + 0.2
		};
		uv.x /= width;
		uv.y /= height;
		return this.texture2D(uv);
	}
	readVecFromTexture2D(offset) {
		return this.readVecFromTexture2DRaw(offset, this._width, this._height);
	}
	
	get glTexture() { return this._glTexture; }
	get arrayBuffer() { return this._arrayBuffer; }
	get floatArray() { return this._floatArray; }
}

const CAM_MOVE_FORWARD         = 0b001000;
const CAM_MOVE_BACKWARD        = 0b000100;
const CAM_MOVE_LEFT            = 0b000010;
const CAM_MOVE_RIGHT           = 0b000001;
const CAM_ROTATE_YAW_LEFT      = 0b100000;
const CAM_ROTATE_YAW_RIGHT     = 0b010000;
const CAM_KEYBOARD_MAP = new Map([
	["W".charCodeAt(), CAM_MOVE_FORWARD],
	["S".charCodeAt(), CAM_MOVE_BACKWARD],
	["Q".charCodeAt(), CAM_MOVE_LEFT],
	["E".charCodeAt(), CAM_MOVE_RIGHT],
			
	["A".charCodeAt(), CAM_ROTATE_YAW_LEFT],
	["D".charCodeAt(), CAM_ROTATE_YAW_RIGHT],
]);
const CAM_KEYBOARD_GETFLAG = (which) => CAM_KEYBOARD_MAP.get(which) | 0;

class DeltaTime {
	constructor() {
		this._prevTimeSec = 0;
		this._deltaTimeSec = 0;
		this.tick();
	}

	tick() {
		const nowSec = performance.now()*1e-3;
		this._deltaTimeSec = nowSec - this._prevTimeSec;
		this._prevTimeSec = nowSec;
	}

	get deltaTimeSec() { return this._deltaTimeSec; }
}
class Camera {
	constructor(pos = [0,0,0], yaw = 0, pitch = 0) {
		this._pos = new Float64Array(3);
		
		this._yawRate = -1;
		this._pitchRate = 1;

		/// влево, вправо
		this._yaw = 0;
		/// вверх, вниз
		this._pitch = 0;
		
		this._matrix = new Float64Array(16);

		this._state = 0;
		
		this._deltaTime = new DeltaTime();
		
		this._camMoveRate = 1000;
	
	
		glMatrix.vec3.copy(this._pos, pos);
		this.update();
		
		this._mousedown = () => {
			window.addEventListener("mouseup", this._mouseup);
			window.addEventListener("mousemove", this._mousemove);
		};
		this._mouseup = () => {
			window.removeEventListener("mouseup", this._mouseup);
			window.removeEventListener("mousemove", this._mousemove);
		};
		this._mousemove = (event) => {
			this.yaw += event.movementX * this._yawRate;
			this.pitch += event.movementY * this._pitchRate;
		};
		
		this._keydown = (event) => {
			this._state |= CAM_KEYBOARD_GETFLAG(event.which);
		//	console.log(this._state);
		};
		this._keyup = (event) => {
			this._state &= ~CAM_KEYBOARD_GETFLAG(event.which);
		};
		
		this._blur = () => {
			this._state = 0;
			window.removeEventListener("mouseup", this._mouseup);
			window.removeEventListener("mousemove", this._mousemove);
		};
			
		
	}
	
	_updatePos() {
		const deltaTimeSec = this._deltaTime.deltaTimeSec;
		
		const dir = new Float64Array([0,0,0]);
		if ( this._state & CAM_MOVE_FORWARD  ) dir[2]--;
		if ( this._state & CAM_MOVE_BACKWARD ) dir[2]++;
		if ( this._state & CAM_MOVE_RIGHT    ) dir[0]--;
		if ( this._state & CAM_MOVE_LEFT     ) dir[0]++;
		
		glMatrix.vec3.normalize(dir, dir);
		glMatrix.vec3.scale(dir, dir, deltaTimeSec * this._camMoveRate);

		const matrix = [];
		glMatrix.mat4.identity(matrix);
		glMatrix.mat4.rotateY(matrix, matrix, -this._yaw / 180 * Math.PI);
		glMatrix.mat4.rotateX(matrix, matrix, -this._pitch / 180 * Math.PI);
		
		glMatrix.vec3.transformMat4(dir, dir, matrix);
		let nextPos = [];
		glMatrix.vec3.add(nextPos, this._pos, dir);
		
		if ( nextPos.some((v, i) => v !== this._pos[i]) ) {
			let curr = [...this._pos];
			let next = [...nextPos];
			curr[1] -= 50;
			next[1] -= 50;
			
			const pcp = getPathCrossPoint(curr, next);
			if ( pcp.flag ) {
				console.log(pcp);
				next = pcp.pos;
				next[1] -= 16;
			}
			
			const y = getNextYpos(next);
			//console.log({y, y0: next[1]})
			if ( y > -30e3 )
				next[1] = y;
			
			next[1] += 50;
			nextPos = next;
		}
		
		glMatrix.vec3.copy(this._pos, nextPos);
	}

	update() {
		this._deltaTime.tick();
		
		this._updatePos();
		
		glMatrix.mat4.identity(this._matrix);
		glMatrix.mat4.rotateX(this._matrix, this._matrix, this._pitch / 180 * Math.PI);
		glMatrix.mat4.rotateY(this._matrix, this._matrix, this._yaw / 180 * Math.PI);
		glMatrix.mat4.translate(this._matrix, this._matrix, [-this._pos[0], -this._pos[1], -this._pos[2]]);
	}

	startEvents() {
		window.addEventListener("mousedown", this._mousedown);
		window.addEventListener("blur", this._blur);

		window.addEventListener("keydown", this._keydown);
		window.addEventListener("keyup", this._keyup);
	}
	stopEvents() {
		window.removeEventListener("mousedown", this._mousedown);
		window.removeEventListener("blur", this._blur);

		window.removeEventListener("keydown", this._keydown);
		window.removeEventListener("keyup", this._keyup);
		
		
		window.removeEventListener("mouseup", this._mouseup);
		window.removeEventListener("mousemove", this._mousemove);
	}

	get pos() { return this._pos; }
	
	get yaw() { return this._yaw; }
	get pitch() { return this._pitch; }
	set yaw(val) { this._yaw = val; }
	set pitch(val) { this._pitch = val; }

	get matrix() { return this._matrix; }
}

class ShowInfo {
	constructor() {
		const $pre = document.createElement("pre");
		Object.assign($pre.style, {
			position: "fixed",
			top: "0px",
			right: "0px",
			margin: "10px",
			"z-index": 10,
		});
		window.addEventListener("load", () => {
			document.body.appendChild($pre);
		});
	
		this.dom = $pre;
		
		this.text = "";
	}
	
	begin() {
		this.text = "";
	}
	addText(text) {
		this.text += text;
	}
	end() {
		this.dom.textContent = this.text;
	}
}
class DeltaTimeMark {
	constructor() {
		this.map = {};
	}
	
	begin(mark) {
		this.map[mark] = performance.now();
	}
	end(mark) {
		this.map[mark] = performance.now() - this.map[mark];
	}
	
	getText() {
		return Object
			.entries(this.map)
			.map(([mark, val]) => `${mark}: ${ val.toFixed(1) }ms fps~${ Math.round(1/val*1e3) }`)
			.join("\n");
	}
}

	const showInfo = new ShowInfo();
	const deltaTimeMark = new DeltaTimeMark();


class CameraControl {
	constructor() {
		
	}
	
	save(name) {
		const obj = {
			pos: [...camera.pos],
			yaw: camera.yaw,
			pitch: camera.pitch,
		};
		localStorage.setItem("CAMERA_" + name, JSON.stringify(obj));
	}
	load(name) {
		const obj = JSON.parse(localStorage.getItem("CAMERA_" + name));
		camera.yaw = obj.yaw;
		camera.pitch = obj.pitch;
		camera.pos.set(obj.pos);
	}
}
const cameraControl = new CameraControl();
globalThis.cameraControl=cameraControl;




const glBuffers  = [];
const glTextures = [null, null];
class Renderer {
	constructor(width = 1024, height = 768) {
		const canvas = createCanvas(width, height);
		const gl = canvas.getContext("webgl", {
			antialias            : false,
			alpha                : false,
			stencil              : false,
			preserveDrawingBuffer: false,
			premultipliedAlpha   : false,
			
			depth                : true,
			desynchronized       : true,
			
			powerPreference      : "default",
			//powerPreference: "low-power",
			//powerPreference: "high-performance",
			
			failIfMajorPerformanceCaveat: false,
		});
		
		this.canvas = canvas;
		this.gl = gl;
		
		gl.getExtension('OES_standard_derivatives');
		gl.getExtension('EXT_shader_texture_lod');
		gl.getExtension("OES_element_index_uint");
		gl.getExtension("OES_texture_float");
	
		gl.viewport(0, 0, canvas.width, canvas.height);
		
		const glInstancedArraysExt = gl.getExtension("ANGLE_instanced_arrays");
		globalThis.glInstancedArraysExt=glInstancedArraysExt;
		
		const glVertexArrayObjectExt = gl.getExtension("OES_vertex_array_object");
		globalThis.glVertexArrayObjectExt = glVertexArrayObjectExt;
		
		this.gammaFactor = 1;
		
		globalThis.gl = gl;
		
		this.textures = [];
		
		this.program;
		this.programEntity;
		
		this.execCode;
		
		const NeutralA = [-7399.944336, 1042.556641+50, -5483.316895];
		this.camera = new Camera(NeutralA);
		this.camera.startEvents();
		this.camera.yaw = 90;
		globalThis.camera = this.camera;
		
		this.stat = new Stats();
		document.body.appendChild(this.stat.dom);
	}
	
	async init() {
		const gl = this.gl;
		
		const glTextureWhitePixel = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, glTextureWhitePixel);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, false, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255,255,255,255]));
		glTextures[0] = glTextureWhitePixel;
		glTextures[1] = glTextureWhitePixel;
		
		//this.glTexs = await loadTexture(gl, "/textures/${i}.basis", 178);
		//this.glLgtTexs = await loadTexture(gl, "/textures/lgt/${i}.basis", 7);
		this.glTexs = glTextures;
		this.glLgtTexs = glTextures;
		
		this.vbEmpty = new GlBuffer(gl);
		this.ibEmpty = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
		
		this.program = new GlProgram(gl, ...getShaderSource_BSP());
		await this.initProgram();
		
		//this.programEntityVertexTexture = new GlProgram(gl, entityVertexShaderSource, entityFragmentShaderSource);
		//await this.initProgramEntityVertexTexture();
		
		this.programEntitySimple = new GlProgram(gl, ...getShaderSource_ENTITY());
		await this.initProgramEntitySimple();
		
		this.programEntityInstnace = new GlProgram(gl, entityInstanceVertexShaderSource, entityInstanceFragmentShaderSource);
		await this.initProgramEntityInstance();
			
		this.execCode = new ExecCode(gl, [
			null,
			{
				program: this.program,
				uniformList: [ this.program.u_ProjectionViewMatrix ]
			},
			{
				program: this.programEntitySimple,
				uniformList: [ this.programEntitySimple.u_ProjectionViewMatrix ]
			},
			{
				program: this.programEntityInstnace,
				uniformList: []
			}
		]);
	}
	
	async initProgram() {
		const gl = this.gl;
		const program = this.program;

		program.init = () => {
			program.use();
			
			gl.uniform1i(this.program.u_Texture   , 0);
			gl.uniform1i(this.program.u_LgtTexture, 1);
			gl.uniform4f(program.u_Color, 1, 1, 1, 1);
			
			this.vbEmpty.bind();
			this.ibEmpty.bind();
			program.enableVertexAttribArrayList();
			program.vertexAttribPointerList();
		};
		program.useAndSet = () => {
			program.use();
		
			gl.uniform4f(program.u_Color, 1, 1, 1, 1);
			
			gl.uniform1i(program.u_Texture   , 0);
			gl.uniform1i(program.u_LgtTexture, 1);
			gl.uniform1f(program.u_GammaFactor, this.gammaFactor);
		};
		program.unuse = () => {};
		program.enableVertexAttribArrayList = () => {
			gl.enableVertexAttribArray(program.a_Position);
			gl.enableVertexAttribArray(program.a_Uv);
			gl.enableVertexAttribArray(program.a_LgtUv);
			gl.enableVertexAttribArray(program.a_Color);
		};
		program.vertexAttribPointerList = () => {
			gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT        , false, 28, 0);
			gl.vertexAttribPointer(this.program.a_Uv      , 2, gl.FLOAT        , false, 28, 3*4);
			gl.vertexAttribPointer(this.program.a_LgtUv   , 2, gl.SHORT        , false, 28, 3*4+2*4);
			gl.vertexAttribPointer(this.program.a_Color   , 4, gl.UNSIGNED_BYTE, false, 28, 3*4+2*4+2*2);
		};
		
		program.init();
	}
	async initProgramEntitySimple() {
		const gl = this.gl;
		const program = this.programEntitySimple;

		program.init = () => {
			program.use();
		
			gl.uniform1i(program.u_Texture   , 0);
			
			this.vbEmpty.bind();
			this.ibEmpty.bind();
			program.enableVertexAttribArrayList();
			program.vertexAttribPointerList();
		};
		program.useAndSet = () => {
			program.use();
			gl.uniform4f(program.u_Color, 1, 1, 1, 1);
			gl.uniform1f(program.u_GammaFactor, this.gammaFactor);
		};
		program.unuse = () => {};
		program.enableVertexAttribArrayList = () => {
			gl.enableVertexAttribArray(program.a_Position);
			gl.enableVertexAttribArray(program.a_Uv);
			gl.enableVertexAttribArray(program.a_Color);
		};
		program.vertexAttribPointerList = () => {
			program.enableVertexAttribArrayList();
			gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT        , false, 24, 0);
			gl.vertexAttribPointer(program.a_Uv      , 2, gl.FLOAT        , false, 24, 3*4);
			gl.vertexAttribPointer(program.a_Color   , 4, gl.UNSIGNED_BYTE, false, 24, 3*4+2*4);
		};
	
		program.init();
	}
	async initProgramEntityInstance() {
		const gl = this.gl;
		const program = this.programEntityInstnace;
		
		program.verticesBuffer = new GlBuffer(gl);
		program.indexesBuffer = new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER);
		program.instancedBuffer = new GlBuffer(gl, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);
	
		const vbEmpty = new GlBuffer(gl);
		const vbEmpty2 = new GlBuffer(gl);
	
		program.init = () => {
			program.use();
			
			gl.uniform1i(program.u_Texture   , 0);
			
			vbEmpty.bind();
			program.enableVertexAttribArrayList();
			program.vertexAttribPointerList();
			
			program.instancedBuffer.bind();
			program.specialEnableVertexAttribArrayList();
			program.specialVertexAttribPointerList();
		};
		program.useAndSet = () => {
			program.use();
			
			program.beginVertexAttribDivisorANGLEList();
		};
		program.unuse = () => {
			program.endVertexAttribDivisorANGLEList();
		};
		
		program.enableVertexAttribArrayList = () => {
			gl.enableVertexAttribArray(program.a_Position);
			gl.enableVertexAttribArray(program.a_Uv);
			gl.enableVertexAttribArray(program.a_Color);
		};
		program.vertexAttribPointerList = (offset = 0) => {
			gl.vertexAttribPointer(program.a_Position, 3, gl.FLOAT        , false, 24, offset+0);
			gl.vertexAttribPointer(program.a_Uv      , 2, gl.FLOAT        , false, 24, offset+3*4);
			gl.vertexAttribPointer(program.a_Color   , 4, gl.UNSIGNED_BYTE, false, 24, offset+3*4+2*4);
		};
		
		program.beginVertexAttribDivisorANGLEList = () => {
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix0, 1);
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix1, 1);
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix2, 1);
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix3, 1);
		};
		program.endVertexAttribDivisorANGLEList = () => {
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix0, 0);
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix1, 0);
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix2, 0);
			glInstancedArraysExt.vertexAttribDivisorANGLE(program.a_InstancedMatrix3, 0);
		};
		
		
		program.specialEnableVertexAttribArrayList = () => {
			gl.enableVertexAttribArray(program.a_InstancedMatrix0);
			gl.enableVertexAttribArray(program.a_InstancedMatrix1);
			gl.enableVertexAttribArray(program.a_InstancedMatrix2);
			gl.enableVertexAttribArray(program.a_InstancedMatrix3);		
		};
		program.specialVertexAttribPointerList = (offset = 0) => {
			program.instancedBuffer.bind();
			program.beginVertexAttribDivisorANGLEList();
			
			gl.vertexAttribPointer(program.a_InstancedMatrix0, 4, gl.FLOAT, false, 4*4*4, offset+0*4*4);
			gl.vertexAttribPointer(program.a_InstancedMatrix1, 4, gl.FLOAT, false, 4*4*4, offset+1*4*4);
			gl.vertexAttribPointer(program.a_InstancedMatrix2, 4, gl.FLOAT, false, 4*4*4, offset+2*4*4);
			gl.vertexAttribPointer(program.a_InstancedMatrix3, 4, gl.FLOAT, false, 4*4*4, offset+3*4*4);
		};
	
		program.specialInstancedBufferData = (data) => {
			program.instancedBuffer.bind().bufferData(data);
			//program.instancedBuffer.bind().bufferAppendData(new Float32Array(16))
			//program.instancedBuffer.bind().bufferData(new Float32Array(16)).bufferAppendData(data);
			this.__instb = data;
			program.specialVertexAttribPointerList();
		};
		
		program.init();
	}

	async initProgramEntityVertexTexture() {
		const gl = this.gl;
		const program = this.programEntityVertexTexture;
		program.use();

		program.verticesFloatTexture = new FloatTexture(gl);
		program.vertexIdexesBuffer = new GlBuffer(gl);
				
		program.useAndSet = () => {
			program.use();
			
			gl.enableVertexAttribArray( program.a_VertexOffset );
			
			program.vertexIdexesBuffer.bind();
			gl.vertexAttribPointer(program.a_VertexOffset, 1, gl.FLOAT, false, 4, 0);
			
			gl.uniform1i(program.u_DataVerticesTexture, 4);
			gl.activeTexture(gl.TEXTURE4);
			program.verticesFloatTexture.bind();
		};
	}

	
	glSetTexture(texId, glTex) {
		const gl = this.gl;
		const map = new Map();
		this.glSetTexture = (texId, glTex) => {
		//	if ( map.get(texId) === glTex )
		//		return;
			
			map.set(texId, glTex);
			gl.activeTexture(texId);
			gl.bindTexture(gl.TEXTURE_2D, glTex);
		};
		return this.glSetTexture(texId, glTex);
	}
	
	programRenderUse() {
		const program = this.program;
		program.use();
			
		//gl.uniformMatrix4fv(this.program.u_ProjectionViewMatrix , false, projectionViewMatrix);
		gl.uniform1i(this.program.u_Texture   , 0);
		gl.uniform1i(this.program.u_LgtTexture, 1);
		gl.uniform1i(this.program.u_DataTexture, 2);

		gl.activeTexture(gl.TEXTURE2);
		this.program.floatTexture.bind();
		glMatrix.mat4.identity( this.program.floatTexture.floatArray );
		this.program.floatTexture.update();
			
		gl.enableVertexAttribArray(program.a_Position);
		gl.enableVertexAttribArray(program.a_Uv);
		gl.enableVertexAttribArray(program.a_LgtUv);
		gl.enableVertexAttribArray(program.a_Color);
		
		this.program.verticesBuffer.bind();
		gl.vertexAttribPointer(this.program.a_Position, 3, gl.FLOAT        , false, 28, 0);
		gl.vertexAttribPointer(this.program.a_Uv      , 2, gl.FLOAT        , false, 28, 3*4);
		gl.vertexAttribPointer(this.program.a_LgtUv   , 2, gl.SHORT        , false, 28, 3*4+2*4);
		gl.vertexAttribPointer(this.program.a_Color   , 4, gl.UNSIGNED_BYTE, false, 28, 3*4+2*4+2*2);	

		this.program.indexesBuffer .bind();
	}

	
	
	preRenderEntity(renderMatGroups) {
		const gl = this.gl;
		
		const groupMap = {};
		for(const matGroup of renderMatGroups) {
			if ( matGroup.entityId === -1 )
				continue;

			const key = `${ matGroup.entityId }-${ matGroup.start }-${ matGroup.count }`;
			const group = groupMap[key] = groupMap[key] || {
				...matGroup,
				matrixList: []
			};
				
			group.matrixList.push(matGroup.matrix);
		}
		const groups = Object.values(groupMap);
		for(const group of groups) {
			group.matrixs = new Float32Array(group.matrixList.length*16);
			let offset = 0;
			for(const matrix of group.matrixList) {
				group.matrixs.set(matrix, offset);
				offset += 16;
			}
		}
		
		globalThis.groups=groups;
		return groups;
	}
	
	loopDraw() {
		const draw = () => {
			requestAnimationFrame(draw);
			
			showInfo.begin();
			
			
			this.stat.update();
			this.camera.update();

			const o = tt();
			if ( !globalThis.noSyncWasm ) {
				o.pos.set(this.camera.pos); 
				o.pitch[0] = this.camera.pitch; 
				o.yaw[0] = this.camera.yaw;
			}
			

			this.saveFM = null;
			if ( !this.saveFM ) {
				deltaTimeMark.begin("Module.API_frameMove");
					Module.API_frameMove();
				deltaTimeMark.end("Module.API_frameMove");	
				const projectionViewMatrix = tt().viewProjectMatrix;
				const renderMatGroups = getMatGroupsRanges();
			
				this.saveFM = {
					projectionViewMatrix, renderMatGroups
				};
			}
			
			const {projectionViewMatrix, renderMatGroups} = this.saveFM;	


			/** webgl render */
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
			gl.disable(gl.BLEND);
			
			gl.enable(gl.DEPTH_TEST);
				gl.depthFunc(gl.LEQUAL);
				gl.depthMask(gl.DEPTH_WRITEMASK);
			
			gl.enable(gl.CULL_FACE);
				gl.cullFace(gl.FRONT);
			
			//this.programEntitySimple.useAndSet();
			
			const rr = getRR();
			this.execCode.exec(rr.cmdMemory, rr.uniformMemory);

			//showInfo.addText(`numDrawTringles: ${numDrawTringles} \n`);
			//showInfo.addText(`numDrawElementsCalls: ${numDrawElementsCalls} \n`);
			showInfo.addText(deltaTimeMark.getText());
			showInfo.end();
			
		}; 
		
		draw();
	}

	groupByTextures(renderMatGroups) {
		let t = performance.now();
		
		const makeGroups = (arr, offset) => {
			let seq = 0;
			const groups = {};
			for(let i = 0; i < arr.length; i += 4) {
				const start = arr[i+0];
				const count = arr[i+1];
				const texId = arr[i+2];
				const lgtTexId = arr[i+3];
				const key = arr[i+offset];
				groups[key] = groups[key] || {i: seq++, arr: []};
				groups[key].arr.push(start, count, texId, lgtTexId);
			}
			
			return Object
				.values(groups)
				.sort((l, r) => l.i - r.i)
				.map(g => g.arr);
		};
		
		const result = makeGroups(renderMatGroups, 3)
			.map(arr => makeGroups(arr, 2))
			.flat()
			.flat();
		
		t = performance.now() - t;
		//console.log(t);
		return result;
	}
	
	async loadEntityList() {
		/*
		this.entityNameList = loadEntityNames();
		globalThis.entityNameList=this.entityNameList;
		this.entityFilesList = await loadEntities(this.entityNameList);
		globalThis.entityFilesList=this.entityFilesList;
		
		this.entities = [];
		let i = 0;
		for(const entityFiles of this.entityFilesList) {
			if ( entityFiles ) {
				console.log(i, entityFiles);
				await wrapWriteData(entityFiles.r3e, entityFiles.r3m, (pR3e, pR3m) => {
					Module.API_loadEntity(i, pR3e, pR3m);
				});
			}
			
			i++;
		}
		*/
		//return;
		const vbib = readVerticesRenderData(Module.API_getEntityRenderDataAll());
		console.log({vbib});
		console.log( this.entities );
		this.programEntitySimple.verticesBuffer.bind().bufferData(vbib.vertices);
		this.programEntitySimple.indexesBuffer .bind().bufferData(vbib.indexes );
		
		this.programEntityInstnace.verticesBuffer.bind().bufferData(vbib.vertices);
		this.programEntityInstnace.indexesBuffer .bind().bufferData(vbib.indexes );
				
				
		if ( this.programEntityVertexTexture ) {
			this.programEntityVertexTexture.verticesFloatTexture.setNumFloats( (vbib.vertices.byteLength/24 * 32) / 4 );
			
			for(let i = 0, j = 0; i < this.programEntityVertexTexture.verticesFloatTexture.floatArray.length; ) {
				for(let k = 0; k < 6; k++)
					this.programEntityVertexTexture.verticesFloatTexture.floatArray[i++] = vbib.vertices[j++];
				i += 2;
			}
			
			for(let i = 0, j = 0; i < this.programEntityVertexTexture.verticesFloatTexture.floatArray.length; ) {
				for(let k = 0; k < 3; k++)
					this.programEntityVertexTexture.verticesFloatTexture.floatArray[i++] = vbib.vertices[j++];
				for(let k = 0; k < 3; k++) j++;
				i++;
			}
			this.programEntityVertexTexture.verticesFloatTexture.update();
			
			this.programEntityVertexTexture.vertexIdexesBuffer.bind().bufferData(new Float32Array(vbib.indexes));
		}
	}
	
	
}


function getMatGroupsRanges() {
	const pOffset = Module.API_getMatGroupRanges();
	const size   = Module.HEAPU32[pOffset/4];
	const offset = Module.HEAPU32[pOffset/4 + 1];
	//console.log({pOffset, size, offset})
	/**
	typedef struct {
		int32_t      type;
		int32_t      entityId;
		int32_t      start;
		int32_t      count;
		int32_t      textureId;
		int32_t      lgtTextureId;
		glm::mat4f_t matrix;
	} matGroupRange_t;
	*/

	const array = [];
	for(let i = offset/4; i < (offset + size)/4; ) {
		const type         = Module.HEAP32[ i++ ];
		const entityId     = Module.HEAP32[ i++ ];
		
		const vbId         = Module.HEAP32[ i++ ];
		const ibId         = Module.HEAP32[ i++ ];
		const start        = Module.HEAP32[ i++ ];
		const count        = Module.HEAP32[ i++ ];
		
		const textureId    = Module.HEAP32[ i++];
		const lgtTextureId = Module.HEAP32[ i++ ];
		const matrix       = Module.HEAPF32.subarray(i, i + 16); i += 16;

		const color        = Module.HEAP32[ i++ ]; 
		const A = ((color >>> 24) & 0xFF) / 0xFF;
		const R = ((color >>> 16) & 0xFF) / 0xFF;
		const G = ((color >>>  8) & 0xFF) / 0xFF;
		const B = ((color >>>  0) & 0xFF) / 0xFF;
		const colorArr = [R,G,B,A];
	
		const blendType    = Module.HEAP32[ i++ ]; 
		const blendSrc     = Module.HEAP32[ i++ ]; 
		const blendDst     = Module.HEAP32[ i++ ]; 
		
		array.push({
			vbId, ibId,
			type, entityId, start, count, textureId, lgtTextureId, matrix,
			blendType, blendSrc, blendDst,
			color, colorArr
		});
	}
	
	return array;
}

var _getPathCrossPointPTR = 0;
function getPathCrossPoint(src = [0,0,0], dst = [0,0,0]) {
	_getPathCrossPointPTR = _getPathCrossPointPTR || Module._malloc(4*3*2);
	let fp = _getPathCrossPointPTR / 4;
	
	for(let i = 0; i < 3; i++) Module.HEAPF32[fp++] = src[i];
	for(let i = 0; i < 3; i++) Module.HEAPF32[fp++] = dst[i];
	const pRes = Module.API_getPathCrossPoint(_getPathCrossPointPTR);
	let pFRes = pRes/4;
	
	const pos = [
		Module.HEAPF32[pFRes++],
		Module.HEAPF32[pFRes++],
		Module.HEAPF32[pFRes++],
	];
	const flag = Module.HEAP32[pFRes++];
	
	const flagMap = {
		0: "NO_COLLISION",
		1: "NORMAL_COLLISION",
		2: "CONTINUE_NODE",
		3: "ONE_NORMAL_COLLISION",
		4: "CANT_GO",
	};
	
	return {pos, flag, flagStr: flagMap[flag]};
}



function ExecCode(gl, shaderInfoList) {
	let cursor = 0;
	
	let I8, U8, F32, I32, U32;
	let cmdMemory;
	let shaderInfo = {
		program: {
			unuse() {}
		}
	};
	const I = () => cmdMemory[cursor++];

	const throwErrorFunction = () => {
		throw new Error(`RR:Method not found`);
	};
	const map = Array(1024).fill(throwErrorFunction);
	
	const CMD_USE_SHADER = 4;
	map[CMD_USE_SHADER] = () => {
		shaderInfo.program.unuse();
		
		const shaderId = I();
		shaderInfo = shaderInfoList[shaderId];
		shaderInfo.program.useAndSet();
	};

	const CMD_DEPTH_TEST_ENABLE = 32;
	const CMD_DEPTH_TEST_DISABLE = 33;
	const CMD_DEPTH_MASK = 34;
	map[CMD_DEPTH_TEST_ENABLE ] = () => gl.enable( gl.DEPTH_TEST );
	map[CMD_DEPTH_TEST_DISABLE] = () => gl.disable( gl.DEPTH_TEST );
	map[CMD_DEPTH_MASK        ] = () => gl.depthMask( I() );

	const CMD_BLEND_ENABLE     = 52;
	const CMD_BLEND_DISABLE    = 53;
	const CMD_BLEND_FUNC       = 54;
	map[CMD_BLEND_ENABLE ] = () => gl.enable( gl.BLEND );
	map[CMD_BLEND_DISABLE] = () => gl.disable( gl.BLEND );
	map[CMD_BLEND_FUNC   ] = () => gl.blendFunc( I(), I() );

	const CMD_ACTIVE_TEXTURE = 72;
	const CMD_BIND_TEXTURE = 73;
	map[CMD_ACTIVE_TEXTURE] = () => gl.activeTexture(gl.TEXTURE0 + I());
	map[CMD_BIND_TEXTURE  ] = () => gl.bindTexture(gl.TEXTURE_2D, glTextures[I()]);


	const CMD_SET_ACTIVE_TEXTURE = 74;
	map[CMD_SET_ACTIVE_TEXTURE] = () => {
		gl.activeTexture(gl.TEXTURE0 + I());
		gl.bindTexture(gl.TEXTURE_2D, glTextures[I()]);
	};
	
	const CMD_SET_UNIFORM_OFFSET_DATA = 84;
	map[CMD_SET_UNIFORM_OFFSET_DATA] = () => {
		const offset = I();
		//gl.uniformMatrix4fv(shaderInfo.uniforms[??], false, uniformMemory.subarray(offset/4, offset/4 + 16));
	};
	const CMD_SET_UNIFORM_MATRIX4FV = 85;
	map[CMD_SET_UNIFORM_MATRIX4FV] = () => {
		const uniformId = I();
		const offset = I() / 4;
		gl.uniformMatrix4fv(shaderInfo.uniformList[uniformId], false, F32.subarray(offset, offset + 16));
	};

	const CMD_DRAW_ELEMENTS_TRI_U32 = 64;
	map[CMD_DRAW_ELEMENTS_TRI_U32] = () => {
		const start = I();
		const count = I();
		gl.drawElements(gl.TRIANGLES, count, gl.UNSIGNED_INT, start*4);
	};
	
	const CMD_DRAW_ELEMENTS_INSTANCED_TRI_U32 = 65;
	map[CMD_DRAW_ELEMENTS_INSTANCED_TRI_U32] = () => {
		const start = I();
		const count = I();
		const primcount = I();
		glInstancedArraysExt.drawElementsInstancedANGLE(gl.TRIANGLES, count, gl.UNSIGNED_INT, start*4, primcount);
	};
	const CMD_SPECIAL_INSTANCED_BUFFER_DATA = 108;
	map[CMD_SPECIAL_INSTANCED_BUFFER_DATA] = () => {
		const offset = I();
		const size = I();
		shaderInfo.program.specialInstancedBufferData(U8.subarray(offset, offset + size));
	};
	
	const CMD_SPECIAL_VB_SHADER_ATTRIB_POINTER_LIST = 157;
	map[CMD_SPECIAL_VB_SHADER_ATTRIB_POINTER_LIST] = () => {
		const offset = I();
		shaderInfo.program.specialVertexAttribPointerList(offset);
	};
	
	
	const CMD_BIND_VB = 91;
	map[CMD_BIND_VB] = () => gl.bindBuffer(gl.ARRAY_BUFFER, glBuffers[I()]);
	
	const CMD_BIND_IB = 92;
	map[CMD_BIND_IB] = () => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, glBuffers[I()]);

	const CMD_VB_SHADER_ATTRIB_POINTER_LIST = 93;
	map[CMD_VB_SHADER_ATTRIB_POINTER_LIST] = () => shaderInfo.program.vertexAttribPointerList();
	
	const exec = (_cmdMemory, _uniformMemory) => {
		cursor = 0;
		cmdMemory = _cmdMemory;
		I8  = new Int8Array(_uniformMemory.buffer, _uniformMemory.byteOffset);
		U8  = new Uint8Array(_uniformMemory.buffer, _uniformMemory.byteOffset);
		F32 = new Float32Array(_uniformMemory.buffer, _uniformMemory.byteOffset);
		I32 = new Int32Array(_uniformMemory.buffer, _uniformMemory.byteOffset);
		U32 = new Uint32Array(_uniformMemory.buffer, _uniformMemory.byteOffset);
		
		let icc = 0;
		let iccMax = window.iccMax||1e9;
		let code = "";
		while(cursor < cmdMemory.length) {
			const cmd = I();
			let saveCursor = cursor;
			
			const fn = map[cmd];
			if ( !fn ) {
				console.error(`Cmd ${cmd} not found`);
				break;
			}
			
			if ( this.createCode ) {
				let fnCode = fn
					.toString()
					.replace(/^\s*\(\s*\)\s*\=\>\s*\{/, "")
					.replace(/^\s*\(\s*\)\s*\=\>\s*/, "		")
					.replace(/\s*\}\s*$/, "")
					.replace(/\bI\(\)/g, () => {
						return cmdMemory[saveCursor++];
					})
					+ "\n";
				
				code += fnCode;
			}
			
			fn();
			if ( cmd === CMD_DRAW_ELEMENTS_TRI_U32 && ++icc >= iccMax )
				break;
		}
		
		this.code = code;
	};
	
	this.createCode = false;
	
	this.exec = exec;
}

function getRR() {
	let pOffset = Module.API_getRR() / 4;
	
	const uSize   = Module.HEAPU32[pOffset++]/4;
	const uOffset = Module.HEAPU32[pOffset++]/4;
	const cSize   = Module.HEAPU32[pOffset++]/4;
	const cOffset = Module.HEAPU32[pOffset++]/4;
	//console.log({ uOffset, uSize  , cOffset, cSize })
	const uniformMemory = Module.HEAP32.subarray(uOffset, uOffset + uSize);
	const cmdMemory = Module.HEAP32.subarray(cOffset, cOffset + cSize);
	
	return { uniformMemory, cmdMemory };
}
try { getRR(); } catch(e) {}
const readVerticesRenderData = (offset) => {
	const rdSize = Module.HEAPU32[offset/4+0];
	const rdOffset = Module.HEAPU32[offset/4+1];
	const rdiSize = Module.HEAPU32[offset/4+2];
	const rdiOffset = Module.HEAPU32[offset/4+3];
	return {
		vertices: Module.HEAPF32.subarray(rdOffset /4, rdOffset /4 + rdSize /4),
		indexes : Module.HEAP32.subarray(rdiOffset/4, rdiOffset/4 + rdiSize/4),
	}
};

/**
draw noalpha map
draw noalpha entities

draw alpha map/entities
*/

const MAP_NAME = "NeutralA";

const fetchMapTexture = async (mapName, texturePath) => {
	return await (await fetch( `/static/maps/${ MAP_NAME }/${ texturePath }` )).arrayBuffer();
};
globalThis.fetchMapTexture=fetchMapTexture;


function tt() {
	const vpMatOffset = Module.API_getViewProjectMatrix();
	const camPosOffset = Module.API_getCamPosition();
	const camYawOffset = Module.API_getCamYaw();
	const camPitchOffset = Module.API_getCamPitch();
	const frustumOffset = Module.API_getFrustum();

	return {
		viewProjectMatrix: Module.HEAPF32.subarray(vpMatOffset/4, vpMatOffset/4+16),
		pos: Module.HEAPF32.subarray(camPosOffset/4, camPosOffset/4 + 3),
		yaw: Module.HEAPF32.subarray(camYawOffset/4, camYawOffset/4 + 1),
		pitch: Module.HEAPF32.subarray(camPitchOffset/4, camPitchOffset/4 + 1),
		
		frustum: Module.HEAPF32.subarray(frustumOffset/4, frustumOffset/4+4*6),
	};
}


/**

ro = readRenderData()
render(ro.renderBuffer.buffer, ro.renderIndexBuffer, ro.renderMatGroups)

texAb = await fetchMapTexture(MAP_NAME, 0);
basisConfig = BasisTextureLoader.detectSupport(gl);
texBasis = BasisTextureLoader.transcode(texAb, basisConfig);



*/


(() => {

class SelectMapMenu extends EventTarget {
	constructor(style) {
		super();
		
		this.maps = [
			"NeutralA",
			"NeutralAS1",
			"NeutralAS2",
			
			"NeutralB",
			"NeutralBS1",
			"NeutralBS2",
			
			"NeutralC",
			"NeutralCS1",
			"NeutralCS2",
			
			
			"Platform01",
			"Sette",
			"Resources",
			"Elan",
			"Cauldron01",
			"Medicallab",
			
			"accretia",
			"bellato",
			"cora",
		];
 
		this.html = `
		<div class="select-map-menu" >
			<ul style="
				list-style-type: none;
				cursor: pointer;
			">
				${
					this.maps.map(map => `<li>${map}</li>`).join("")
				}
			</ul>
		</div>
		`;
		this.dom = document.createElement("div");
		this.dom.innerHTML = this.html;
		this.dom = this.dom.children[0];
		
		Object.assign(this.dom.style, style);
		console.log(style, this.dom.style);
			
		this.style = document.createElement("style");
		this.style.textContent = `
			.select-map-menu {
				position: fixed;
				right: 0px;
				top: 0px;
				margin: 0px;
				padding: 0px;
			}
			.select-map-menu ul {
				list-style-type: none;
				cursor: pointer;
				user-select: none;
			    margin: 0px;
			}
			.select-map-menu ul li {
				padding: 2px 10px 2px 10px;
			    color: #AAA;
				background: #484848;
			}
			.select-map-menu ul li:hover {
				background: #333;
				//box-shadow: inset 0px 3px 10px 0px #f7f4f4;
			}
			.select-map-menu ul li.active {
			    background: #1d202b;
			}
		`;

		this.onclick = (event) => {
			this.elements.map(e => e.classList.remove("active"));
			const el = event.target;
			el.classList.add("active");
			
			const e = new Event("update");
			e.mapName = event.target.textContent;
			this.dispatchEvent(e);
		};

		this.setEvents();
		this.mount();
	}

	get elements() {
		return [...this.dom.querySelectorAll("li")];
	}

	mount() {
		document.body.appendChild(this.style);
		document.body.appendChild(this.dom);
	}
	unmount() {
		document.body.removeChild(this.style);
		document.body.removeChild(this.dom);
	}

	setEvents() {
		this.elements.map(el => el.addEventListener("click", this.onclick));
	}
	deleteEvents() {
		this.elements.map(el => el.removeEventListener("click", this.onclick));
	}

	delete() {
		this.deleteEvents();
		this.unmount();
	}
}

if ( window.smm )
	window.smm.delete();

window.addEventListener("load", () => {
	window.smm = new SelectMapMenu({
		top: "100px",
		"z-index": 1e3,
	});

	smm.addEventListener("update", ({mapName}) => {
		Module.API_loadBsp(mapName);
	});

});

})();



 



const u32ToHex = n =>{
	const ab = new ArrayBuffer(4);
	const i32s = new Int32Array(ab);
	const u8s = new Uint8Array(ab);
	i32s[0] = n;
	return [...u8s].reduce((s, b) => s + `0${b.toString(16)}`.slice(-2), "");
};

let gbFSDownloadSummarySize = 0;
let gbFSDownloadUnicalSummarySize = 0;
let gbFSDownloadSetGUID = new Set();
const SHADERID_ENTITY = 2;

const gbFSFileGUIDList = new Set();

function SimpleFileSystem(gl, wasm) {
	const Module = wasm;
class _SimpleFileSystem {
	constructor() {
		this.map = new Map();
	}

	updateFSMapData(mapData) {
		mapData.map(([key, val]) => 
			this.map.set(this.normalize(key), val) );
	}
	setFSMapData(mapData) {
		this.map.clear();
		this.updateFSMapData(mapData);
	}

	normalize(path) {
		path = path
			.toLowerCase()
			.replace(/\\/g, "/")
			.replace(/\/{2,}/g, "/");

		const srcArr = path.split("/");
		const dstArr = [];
		for(let i = 0; i < srcArr.length; i++) {
			const s = srcArr[i];
			if ( !s.length )
				continue;
			
			if ( s === "." )
				continue;
			
			if ( s === ".." ) {
				dstArr.pop();
				continue;
			}
	
			dstArr.push(s);
		}
		
		return dstArr.join("/");
	}

	getFileGUID(path) {
		return this.map.get( this.normalize(path) ) | 0;
	}
	fileExistsSync(path) {
		return this.map.has( this.normalize(path) );
	}

	guidToHex(guid) {
		return u32ToHex(guid);
	}

	delExt(path) {
		return path.replace(/\.[^.]+$/, "")
	}
	getBase(path) {
		return this.normalize(path).replace(/.*\//, "");
	}
	
	async _loadFile(retId, path) {
		path = this.normalize(path);
		const guid = this.getFileGUID(path);
		if ( !guid ) {
			return;
		}
		
		const guidHex = this.guidToHex(guid);
		const buffer = await (await fetch(`/static/RFOnline/files/${guidHex}`)).arrayBuffer();
		const pData = Module._malloc(buffer.byteLength);
		Module.HEAP8.subarray(pData).set(new Uint8Array(buffer));
		
		Module.APIWASM_FS_setFileData(retId, guid, pData, buffer.byteLength);
	}
	async _loadFileByGUID(retId, guid) {
		const guidHex = this.guidToHex(guid);
		try {
			const buffer = await (await fetch(`/static/RFOnline/files/${guidHex}`)).arrayBuffer();
			const pData = Module._malloc(buffer.byteLength);
			Module.HEAP8.subarray(pData).set(new Uint8Array(buffer));
			Module.APIWASM_FS_setFileData(retId, guid, pData, buffer.byteLength);
		} catch(e) {
			Module.APIWASM_FS_setFileData(retId, guid, 0, 0);
		}
	}
	
	async loadFileByGUID(guid) {
		const guidHex = this.guidToHex(guid);
		const response = await fetch(`/static/RFOnline/files/${guidHex}`);
		if ( response.status !== 200 )
			throw new Error(`Bad response status; expected 200, got ${response.status}`);
		
		return await response.arrayBuffer();
	}
	async getFileByGUID(guid) {
		const guidHex = this.guidToHex(guid);
		gbFSFileGUIDList.add(guidHex);
		const lfKey = `F${guidHex}`;
		
		let fileData = await localForage.getItem(lfKey);
		if ( !fileData ) {
			fileData = await this.loadFileByGUID(guid);
			await localForage.setItem(lfKey, fileData);
		}
		
		gbFSDownloadSummarySize += fileData.byteLength;
		if ( !gbFSDownloadSetGUID.has(guid) )
			gbFSDownloadUnicalSummarySize += fileData.byteLength;
		gbFSDownloadSetGUID.add(guid);
		
		return fileData;
	}
	async getFile(path) {
		return this.getFileByGUID(this.getFileGUID(path));
	}
	
	/// API
	async readFileByGUID(retId, guid) {
		const answer = async (arrayBuffer, error = false) => {
			const rError = error ? 1 : 0;
			if ( error ) {
				Module.APIWASM_FS_answerFileData(retId, guid, rError);
				return;
			}
			
			const pData = Module.APIWASM_FS_requestFileData(guid, arrayBuffer.byteLength);
			//console.log("Alloc");
			//await sleep(3e3);
			//console.log("To wasm");
			
			Module.HEAP8.subarray(pData).set(new Uint8Array(arrayBuffer));
			Module.APIWASM_FS_answerFileData(retId, guid, rError);
		};
		
		try {
			await answer( await this.getFileByGUID(guid) );
		} catch(e) {
			console.log(e);
			await answer(null, true);
		}
	}
}

	this.__proto__ = new _SimpleFileSystem();
}
function SimpleTex(gl, wasm) {
	const Module = wasm;
	function texImageNullTexture(gl) {
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, false, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([
			255,255,255,255,
			127,127,127,255,
			127,127,127,255,
			255,255,255,255,
		]));
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	function createTexture() {
		const glTexture = gl.createTexture();
		const id = glTextures.push(glTexture) - 1;
		return [glTexture, id];
	}
	function getNullTexture() {
		if ( this._nullTexture )
			return this._nullTexture[0];

		const [glTexture, id] = this.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, glTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		this.texImageNullTexture(gl);
		this._nullTexture = [glTexture, id];
		return this._nullTexture[0];
	}
	async function requestTexture(guid) {
		try {
			const guidHex = u32ToHex(guid);
			
			while(globalThis.gl === undefined)
				await sleep(100);


			const [glTexture, id] = this.createTexture();
			glTextures[id] = this.getNullTexture();
			Module.APIWASM_TEX_answerTexture(guid, id, 0);
		
			//const ab = await APIJS.FS.getFile(`/textures-basis-q255-level1/${ guidHex }-q255-level1.basis`);
			const ab = await APIJS.FS.getFile(`/textures-basis-q1-level1/${ guidHex }-q1-level1.basis`);
			
			gl.bindTexture(gl.TEXTURE_2D, glTexture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			
			if ( 1 ) {
				const support = await basisThreadControlPool.transcode(ab, basisThreadControlPool.detectSupport(gl));
				gl.bindTexture(gl.TEXTURE_2D, glTexture);
				basisThreadControlPool.compressedTexImage2D(gl, support);
			}
			
			glTextures[id] = glTexture;

			//Module.APIWASM_TEX_answerTexture(guid, id, 0);
			//Module.APIWASM_TEX_answerTexture(guid, 0, 0);
		} catch(e) {
			console.log(e);
			Module.APIWASM_TEX_answerTexture(guid, -1, 1);
		}
	}
	
	this.texImageNullTexture = texImageNullTexture;
	this.createTexture = createTexture;
	this.getNullTexture = getNullTexture;
	this.requestTexture = requestTexture;
}
function SimpleGeometryBuffer(gl, wasm) {
	const glVbList = [];
	const glIbList = [];
	const vbibList = [];
	const glVaoBufferList = [];
	globalThis.glVaoBufferList=glVaoBufferList;

	class VBIB {
		constructor(vb, ib) {
			this.vb = vb;
			this.ib = ib;
			this.id = vbibList.push(this) - 1;
			
			glVbList.push(vb.glBuffer);
			glIbList.push(ib.glBuffer);
		}
		
		static createSimple() {
			return new this(
				new GlBuffer(gl, gl.ARRAY_BUFFER        , gl.STATIC_DRAW),
				new GlBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, gl.STATIC_DRAW)
			);
		}
	}
	let vbibEntity = VBIB.createSimple();

	function createWasmVecInt(arr) {
	//vbId, vbOffset, ibId, ibOffset) {
		const p = wasm._malloc(arr.length*4);
		let ofs = p/4;
		for(let v of arr)
			wasm.HEAP32[ofs++] = v;
		return p;
	}
	const glBufferList = glBuffers;//[];
	
	vbibList.push(vbibEntity);
	let entityVbId = glBufferList.push(vbibEntity.vb.glBuffer) - 1;
	let entityIbId = glBufferList.push(vbibEntity.ib.glBuffer) - 1;

	function vbibRequest(type) {
		if ( type === SHADERID_ENTITY )
			return vbibEntity.vb.byteCursor;
		
		return 0;
	}
	function vbibData(type, vbData, vbSize, ibData, ibSize) {
		//console.log({type, vbData, vbSize, ibData, ibSize});
		
		const vb = wasm.HEAP8.subarray(vbData, vbData + vbSize);
		const ib = wasm.HEAP8.subarray(ibData, ibData + ibSize);

		let vbOffset = 0, ibOffset = 0, vbId, ibId, vbib;
		if ( type === SHADERID_ENTITY ) {
			vbOffset = vbibEntity.vb.bind().bufferAppendData(vb);
			ibOffset = vbibEntity.ib.bind().bufferAppendData(ib);
			
			vbId = entityVbId;
			ibId = entityIbId;
		} else {
			vbib = VBIB.createSimple();
			vbibList.push(vbib);
			vbId = glBufferList.push(vbib.vb.glBuffer) - 1;
			ibId = glBufferList.push(vbib.ib.glBuffer) - 1;
			
			vbib.vb.bind().bufferData(vb);
			vbib.ib.bind().bufferData(ib);
			vbOffset = 0;
			ibOffset = 0;

		//	vbib.vb.arrayBuffer = null;
		//	vbib.ib.arrayBuffer = null;
		}
		
		return createWasmVecInt([
			vbId, vbOffset,
			ibId, ibOffset,
		]);
	}
	function deleteBuffer(id) {
		if ( glBufferList[id] ) {
			gl.deleteBuffer(glBufferList[id]);
			glBufferList[id] = null;
		}
	}

	this.vbibRequest = vbibRequest;
	this.vbibData = vbibData;
	this.deleteBuffer = deleteBuffer;

	globalThis.sgb = this;
	this.wasm = wasm;
	this.gl = gl;
	this.glBufferList = glBufferList;
	this.vbibList = vbibList;

}
const APIJS = {};


globalThis.APIJS = APIJS;


const getMapName = () => {
	let mapName = "neutrala";
	try {
		mapName = location.hash.match(/mapname\s*\=\s*(\w+)/i)[1];
	} catch(e) {}
	return mapName;
};

const wasmInit = async (createModule) => 
	new Promise((resolve, reject) => {
		const module = {};
		module.onRuntimeInitialized = () => {
			delete module.then;
			resolve(module);
		};
		createModule(module);
	});

async function entryPoint() {
	const wasm = await wasmInit(Module$1);
	globalThis.Module = globalThis.wasm = wasm;

	const renderer = new Renderer(1024, 768);
	//const renderer = new Renderer(1920, 1080);
	//const renderer = new Renderer(800, 600);
	globalThis.renderer = renderer;
	globalThis.gl = renderer.gl;
	const gl = renderer.gl;


	await sleep(1000);

	APIJS.FS = new SimpleFileSystem(gl, wasm);
	APIJS.TEX = new SimpleTex(gl, wasm);
	APIJS.GEOMETRYBUFFER = new SimpleGeometryBuffer(gl, wasm);
	
	APIJS.FS.setFSMapData( await(await fetch("/static/RFOnline/fileSystemMap.json")).json() );
	
	const mapName = getMapName();
	console.log("@wasm.API_init");
	wasm.API_init();
	wasm.API_loadBsp(mapName);
	
	await renderer.init();
	
	
	
	
	
	/**
	ro = readVerticesRenderData( wasm.API_mapGetRenderDataAll() );
	//renderer.program.verticesBuffer.bind().bufferData(ro.vertices);
	for(let i = 0; i < ro.vertices.length; i += ro.vertices.length/10|0)
		renderer.program.verticesBuffer.bind().bufferAppendData(
			ro.vertices.subarray(i, i + ro.vertices.length/10|0)
		);
	
	renderer.program.indexesBuffer .bind().bufferData(ro.indexes);
	*/
	renderer.loopDraw();
}


entryPoint();

let __getNextYposPtr = 0;
function getNextYpos(pos) {
	__getNextYposPtr = __getNextYposPtr || Module._malloc(4*3);
	let fp = __getNextYposPtr / 4;
	Module.HEAPF32[fp++] = pos[0];
	Module.HEAPF32[fp++] = pos[1];
	Module.HEAPF32[fp++] = pos[2];
	
	return Module.API_getNextYpos(__getNextYposPtr);
}

globalThis.ANYP = () => {
	setInterval(() => {
		try {
			const A = 0;
			const pos = [...camera.pos];
			pos[1] -= A;
			const y = getNextYpos(camera.pos);
			if ( y > -30e3 )
				camera.pos[1] = y + A;
		} catch(e) {}
	}, 0);
};