const path = require('path');

module.exports = function (robot) {
  const srcPath = path.resolve(__dirname, 'src');
  return [
    robot.loadFile(srcPath, 'index.js')
  ];
};
