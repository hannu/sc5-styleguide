'use strict';

module.exports = function(source) {

  var pass = true;

  var comment = source.split('//').join('').split('/*').join('').split('*/').join('');
  comment = comment.split(/\n\s*(?=\S+\s*:)/).filter(function(block) {
    var varName = block.match(/^\s*(\S+)\s*:[\S\s\n]+/);
    console.log("var:", block)
    if (varName && varName[1]) {
      return !varName[1].indexOf('sg-');
    }
    return true;

  }).join('\n');

  return comment;
};
