const { src, dest } = require("gulp");

exports.default = function () {
  return src("./node_modules/rsuite/dist/styles/*.min.css").pipe(
    dest("./public/")
  );
};
