"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  http
} = require(process.cwd());

var _default = {
  command: 'http',
  aliases: [],
  desc: 'start the http service with currently selected plugin',
  builder: yargs => {
    yargs.option('port');
  },
  handler: argv => {
    const port = argv.port || process.env.PORT || 4000;
    const server = http();
    server.listen(port, () => console.log(`🚀 Server ready on port ${port}!`));
  }
};
exports.default = _default;