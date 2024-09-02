// Internal Dependencies.
const { getRelativePath, copyFileIfExists } = require('../utils');

/**
 * Runner for generating the Gutenberg documentation.
 */
const generateFromFile = () => {

	// Copy scripts readme to core tech.
	copyFileIfExists(
		'path/to/README.md',
		getRelativePath('pages/output.mdx')
	);
}

module.exports = generateFromFile;
