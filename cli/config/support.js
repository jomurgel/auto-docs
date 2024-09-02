const allowedExtensions = [
	'.js',
	'.jsx',
	'.ts',
	'.tsx',
	'.php',
	'.md',
	'.mdx',
];

const excludedExtensions = [
	'.snap',
	'.test',
];

const excludedDirectories = [
	'node_modules',
	'bin',
	'tests',
	'test',
	'build',
	'template-parts',
];

const excludedFiles = [
	'attributes.js',
];

const excludedMethods = [
	'__construct',
	'_setup_hooks',
	'init',
];

module.exports = {
	allowedExtensions,
	excludedExtensions,
	excludedDirectories,
	excludedFiles,
	excludedMethods,
}
