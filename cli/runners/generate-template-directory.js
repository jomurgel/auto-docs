// External Dependencies.
const fs = require('fs');

// Internal Dependencies.
const { getRelativePath, copyFileIfExists } = require('../utils');
const { copyDirectoryContents, processDirectory } = require('../parsers/process-directories');

/**
 * Runner for generating documentation for directory.
 */
const generateRepoDocs = () => {
	// Bail if no source exists.
	if (fs.existsSync('repo/docs/')) {
		copyDirectoryContents(
			'repo/docs',
			getRelativePath('pages/to/output')
		);
	}
}

module.exports = generateRepoDocs;
