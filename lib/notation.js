module.exports = {
  parse: function(command) {
    var parsed = {};

    // determine number of dice to roll
    var A = command.match(/^(\d+)/);
    parsed.A = A && A[1] && parseInt(A[1]) || 1;

    // determine the number of faces
    var X = command.match(/d(\d+)/i);
    parsed.X = X && X[1] && parseInt(X[1]) || 20;

    // determine the number of dice to keep
    var k = command.match(/\(k(\d+)\)/i);
    parsed.k = k && k[1] && parseInt(k[1]) || null;

    // determine if should keep the lowest rolled dice
    var L = /-L|-H/.test(command);
    parsed.L = L;

    // determine the multiplier
    var C = command.match(/x(\d+)/);
    parsed.C = C && C[1] && parseInt(C[1]) || 1;

    // determine the modifier
    var M = command.match(/(-?\+?\d+)$/);
    parsed.M = M && M[1] && parseInt(M[1]) || 0;

    return parsed;
  },

  format: function(parsed) {
    var command = '';

    // add the number of dice to be rolled
    command += parsed.A || 1;

    // add the number of faces
    command += 'd' + parsed.X || 20;

    // add dice to keep command
    if (parsed.k) {
      command += '(k' + parsed.k + ')';
    }

    // add keep lowest command
    if (parsed.L) {
      command += '-L';
    }

    // add the multipier
    if (parsed.C && parsed.C != '1') {
      command += 'x' + parsed.C;
    }

    // add the modifier
    if (parsed.M && parsed.M > 0) {
      command += '+' + parsed.M;
    } else if (parsed.M) {
      command += parsed.M;
    }

    return command || undefined;
  }
}
