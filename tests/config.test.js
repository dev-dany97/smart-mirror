// Checks that config/config.js.template still produces a valid MagicMirror² config.
// Run with: npm test   (no dependencies needed, uses the built-in Node.js test runner)
const { test } = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const template = fs.readFileSync(path.join(root, "config/config.js.template"), "utf8");
const envExample = fs.readFileSync(path.join(root, "config/config.env.example"), "utf8");

function parseEnv(text) {
	const env = {};
	for (const line of text.split(/\r?\n/)) {
		const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
		if (match) env[match[1]] = match[2];
	}
	return env;
}

// Same idea as MagicMirror²: replace every ${VARIABLE} with its value from config.env
function render(text, env) {
	return text.replace(/\$\{([A-Z0-9_]+)\}/g, (_, name) => {
		if (!(name in env)) throw new Error(`Variable ${name} is missing in config.env`);
		return env[name];
	});
}

function loadConfig(source) {
	const sandbox = { module: { exports: {} } };
	vm.runInNewContext(source, sandbox, { filename: "config.js" });
	return sandbox.module.exports;
}

const env = parseEnv(envExample);
const templateVars = [...template.matchAll(/\$\{([A-Z0-9_]+)\}/g)].map((m) => m[1]);

test("every variable in the template is defined in config.env.example", () => {
	const missing = [...new Set(templateVars)].filter((name) => !(name in env));
	assert.deepStrictEqual(missing, []);
});

test("config.env.example has no unused variables", () => {
	const unused = Object.keys(env).filter((name) => !templateVars.includes(name));
	assert.deepStrictEqual(unused, []);
});

test("rendered config is valid JavaScript and exports a config object", () => {
	const config = loadConfig(render(template, env));
	assert.strictEqual(typeof config, "object");
	assert.ok(Array.isArray(config.modules), "config.modules must be an array");
	assert.ok(config.modules.length > 0, "config.modules must not be empty");
});

test("rendered config contains no leftover placeholders", () => {
	assert.ok(!render(template, env).includes("${"));
});

test("every module has a name and a valid position", () => {
	const positions = new Set([
		"top_bar", "top_left", "top_center", "top_right",
		"upper_third", "middle_center", "lower_third",
		"bottom_left", "bottom_center", "bottom_right", "bottom_bar",
		"fullscreen_above", "fullscreen_below",
	]);
	const config = loadConfig(render(template, env));
	for (const mod of config.modules) {
		assert.ok(typeof mod.module === "string" && mod.module.length > 0, "module name missing");
		if (mod.position !== undefined) {
			assert.ok(positions.has(mod.position), `${mod.module}: unknown position "${mod.position}"`);
		}
	}
});

test("expected modules are configured", () => {
	const names = loadConfig(render(template, env)).modules.map((m) => m.module);
	for (const name of ["clock", "calendar", "MMM-WetterOnline", "MMM-NINA", "MMM-CoinMarketCap", "MMM-AVStock", "netatmo", "MMM-Tado", "MMM-Remote-Control"]) {
		assert.ok(names.includes(name), `${name} is missing`);
	}
});

test("AVStock has one purchase price per symbol or fewer", () => {
	const avstock = loadConfig(render(template, env)).modules.find((m) => m.module === "MMM-AVStock");
	assert.ok(avstock.config.purchasePrice.length <= avstock.config.symbols.length);
	assert.strictEqual(avstock.config.symbols.length, avstock.config.alias.length);
});

test("template contains no hard-coded secrets", () => {
	for (const key of ["apiKey", "clientId", "clientSecret", "refresh_token", "username", "password"]) {
		for (const match of template.matchAll(new RegExp(`^\\s*${key}\\s*:\\s*['"]([^'"]*)['"]`, "gm"))) {
			assert.match(match[1], /^\$\{[A-Z0-9_]+\}$/, `${key} must come from config.env, found "${match[1]}"`);
		}
	}
});
