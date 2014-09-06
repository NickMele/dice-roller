module.exports = function(faces) {
  var self = this;

  // set the number of faces this die has
  self.faces = faces || 20;

  // rolls the die and returns the outcome
  self.roll = function() {
    var min = 1;
    var max = self.faces;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

};
