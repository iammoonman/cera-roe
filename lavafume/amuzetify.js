const luamin = require("luamin");
const { readFile, writeFile } = require("fs/promises");

let fn = "main.english.lua";

if (process.argv.at(2) === "--file" && process.argv.at(3)) fn = process.argv[3];
console.log(`Minifying "${fn}" into "${fn.match(/[^\.]+/)}.lua"`);

readFile(fn, "utf-8")
	.then((text) => {
		writeFile(`${fn.match(/[^\.]+/)}.lua`, luamin.minify(text)).catch((e) => console.log(e));
	})
	.catch((e) => console.log(e));
