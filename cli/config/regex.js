module.exports = {
	js: {
		// https://regex101.com/r/JEYxXD/3
		filter: /(?<desc>\/\*\*\s*((?!\*\/)[\s\S])*\s*\*\/\s*)\n\t(!?const) \w* = applyFilters\(\s*['"](?<name>.+?)['"](?:\s*,\s*(?<params>[\s\S]*?))?\s*\)\s*;\s/mg,
		// https://regex101.com/r/iYnoRh/4
		method: /(?<desc>\/\*\*\s*((?!\*\/)[\s\S])*\s*\*\/\s*)\n(?<function>(?:export\s)?const\s+(?<function_name>\w+))\s* = \(/mg,
		// https://regex101.com/r/wSfEKh/1
		params: /@param\s+\{?\{(?<type>.*?)\}\}?\s+(?<variable>\S+)\s+(?<desc>[^@\n]+\.)/g
	},
	php: {},
	default: {
		// https://regex101.com/r/IzyJWL/11
		method: /\n\t(?<desc>\/\*\*\n[\s\S]*?\*\/[\s\S]*?)(?<function>(?:public|protected|private)?\s*(?:static)?\s*function\s+(?<function_name>\w+))\s*\([\s\S]*?\)(?:\s*:\s*\w+)?\s*(?:\{|;)/mg,
		// https://regex101.com/r/DjkSsO/4
		filter: /\s[ \t]\/\*\*(?<desc>[\s\S]*?)\*\/[\s\S]*?apply_filters\(\s*['"](?<name>.+?)['"](?:\s*,\s*(?<params>[\s\S]*?))?\s*\)\s*;\s/mg,
		// https://regex101.com/r/ByJIeb/2
		docBlock: /(?!\/\*\*\s )\* (?<desc>[^@]+\.)/,
		// https://regex101.com/r/42meY2/5
		class: /(?:class|trait|interface)\s+(?<classname>\w+)\s*(?:extends\s+(?<extends>\w+))?\s*(?:implements\s+(?<implements>[\w\s,]+))?{/m,
		// https://regex101.com/r/KKPgny/11
		params: /@param\s+\{?(?<type>[^}\s]+)\}?\s+(?<variable>\S+)\s+(?<desc>[^@\n]+\.)/g,
		// https://regex101.com/r/lvTQ8I/3
		return: /@returns?\s+\{?(?<type>\w+)\}?\s+\$?(?<variable>\w+).*(?!<desc>.*)/,
		// https://regex101.com/r/UGDS02/2
		see: /@see\s+(?<url>\w.*)/,
	}
}
