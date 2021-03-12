const sh = require("shelljs");

sh.rm("-rf", "dist");
sh.rm("-rf", "types");
sh.cp("-R", "packages/webgl-wrapper/dist/", "dist");
sh.cp("-R", "packages/webgl-wrapper/types/", "types");
