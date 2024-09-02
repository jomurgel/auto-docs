// External Dependencies.
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const chalk = require('chalk');

// Internal Dependencies.
const regexConfig = require('../config/regex');
const { excludedExtensions, excludedDirectories, excludedMethods, allowedExtensions } = require('../config/support');
const { formatDescription } = require('../services');

/**
 * Check if file is empty.
 *
 * @param {string} path filename path
 * @returns
 */
const isFileEmpty = (path) => {
	return fs.readFileSync(path, 'utf8')?.length;
}

/**
 * Get all non-hidden files in a directory.
 *
 * @param {string} source source path.
 * @returns {array} array of non-hidden directory names.
 */
const getNonHiddenFolders = (source) => {
	const folders = fs.readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith('.') && !excludedDirectories.includes(dirent?.name))
		.map((dirent) => dirent.name);

	return folders;
}

/**
 * Get all non-hidden files in a directory.
 *
 * @param {string} source source source.
 * @returns {array} array of non-hidden directory names.
 */
const getNonHiddenFiles = (source) => {
	const files = fs.readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isFile() && allowedExtensions.includes(path.extname(dirent.name)) && !dirent.name.startsWith('.'))
		.map((dirent) => dirent.name);

	return files;
}

/**
 * Return list of files and folders.
 *
 * @param {string} path directory to parse.
 * @returns {array} array of two items, files, and folders.
 */
const getFilesAndFolders = (path) => ({
	files: getNonHiddenFiles(path),
	folders: getNonHiddenFolders(path),
});

/**
 * Get all top-level directories in a given folder.
 *
 * @param {string} source source path.
 * @param {string} path   file path.
 * @returns {array} array of top-level folders.
 */
const getFolderDirectories = (source) => {
	const items = fs.readdirSync(source, { withFileTypes: true });
	const folders = items
		.filter((item) => item.isDirectory())
		.map((item) => item.name);

	return folders;
}

/**
 * Determine if a directory includes any of the excluded directory names.
 *
 * @param {string} directory specified directory.
 * @returns {boolean} whether or not we should exclude the directory.
 */
const shouldExcludeDirectory = (directory) => {
	return excludedDirectories.some((loc) => directory.includes(loc));
}

/**
 * Determine if a method name should be excluded.
 *
 * @param {string} directory specified directory.
 * @returns {boolean} whether or not we should exclude the directory.
 */
const shouldExcludeMethod = (name) => {
	return excludedMethods.some((method) => name.includes(method));
}

/**
 * Determine if a file includes any of the excluded file types.
 *
 * @param {string} file specified file.
 * @returns {boolean} whether or not we should exclude the file.
 */
const shouldExcludeFile = (file) => {
	return !allowedExtensions.some((loc) => file.includes(loc)) || excludedExtensions.some((loc) => file.includes(loc));
}

/**
 * Determine if a file is a markdown file.
 *
 * @param {string} file specified file.
 * @returns {boolean} whether the file is md or not.
 */
const isMarkdown = (file) => ['.md', '.mdx'].some((loc) => file.includes(loc));

/**
 * Determine if a file is a js/jsx file.
 *
 * @param {string} file specified file.
 * @returns {boolean} whether the file is js or not.
 */
const isJs = (file) => {
	// https://regex101.com/r/8iWoC3/3
	return /.[j|t]sx?$/.test(file)
}

/**
 * Determine if a file is a php file.
 *
 * @param {string} file specified file.
 * @returns {boolean} whether the file is php or not.
 */
const isPhp = (file) => file.includes('.php');

/**
 * Get relative path for the output directory.
 *
 * @param {string} base   base path for the file location.
 * @param {string} source source file location.
 * @returns {string} path relative to the base directory.
 */
const getRelativePath = (source) => path.join(path.resolve('.'), source);

/**
 * Get last directory of a path.
 *
 * @param {string} path path string.
 * @returns {string} last folder of path string.
 */
const getFileDirectory = (path) => path.split('/').pop();

/**
 * Get a regex pattern for a file type.
 *
 * @param {string} path path.
 * @param {string} pattern pattern key.
 * @returns {string} regex pattern for type.
 */
const getRegexForType = (path, pattern) => {
	const type = getFileType(path);
	return regexConfig?.[type]?.[pattern] || regexConfig?.default?.[pattern];
}

/**
 * Get file type for pathName.
 *
 * @param {string} file content location.
 * @returns {Object} parsed content.
 */
const getFileType = (file) => {
	// For php files.
	if (isPhp(file)) {
		return 'php';
	}
	// For js/jsx/ts/tsx files.
	if (isJs(file)) {
		return 'js';
	}
	// For md/mdx files.
	if (isMarkdown(file)) {
		return 'md';
	}
	// Return default.
	return 'default';
}

/**
 * Function to delete amd then create a directory.
 *
 * @param {string} path directory path.
 */
const createDirectory = (path) => {
	mkdirp.sync(path);
	console.log(chalk.blue(`Directory '${chalk.underline(path)}' has been created.`));
}

/**
 * Recursively remove the directory.
 *
 * @param {string} dir directory path.
 */
const recursiveRemoveDirectory = (dir) => {
	// Bail if the directory doesn't exist.
	if (!fs.existsSync(dir)) {
		return;
	}

	// Get all files.
	const list = fs.readdirSync(dir);

	// Loop through list files and remove.
	for (let i = 0; i < list.length; i++) {
		const filename = path.join(dir, list[i]);
		const stat = fs.statSync(filename);

		if (filename === '.' || filename === '..') {
			// Skip the starter  files.
		} else if (stat.isDirectory()) {
			// Recursively remove the directory.
			recursiveRemoveDirectory(filename);
		} else {
			// Remove the file.
			fs.unlinkSync(filename);
		}
	}

	fs.rmdirSync(dir);
};

/**
 * Copy a file if it exists.
 *
 * @param {string} sourcePath      Source path.
 * @param {string} destinationPath Desitnation path.
 */
const copyFileIfExists = ( sourcePath, destinationPath ) => {
	if (fs.existsSync(sourcePath)) {
		fs.copyFileSync(sourcePath, destinationPath);
	}
};

/**
 * Get params from dobBlock description.
 *
 * @param {string} path pathname type.
 * @param {string} desc docBlock description
 * @returns {string} params from description.
 */
const parseParams = (path, desc) => {
	const params = [];
	let paramMatch;
	while ((paramMatch = getRegexForType(path, 'params').exec(desc))) {
		const paramType = formatDescription(paramMatch?.groups?.type);
		const paramName = paramMatch?.groups?.variable;
		const paramDesc = paramMatch?.groups?.desc;
		params.push({ type: paramType, name: paramName, desc: paramDesc });
	}
	return params;
}

/**
 * Get return value from dobBlock description.
 *
 * @param {string} path pathname type.
 * @param {string} desc docBlock description
 * @returns {string} params from description.
 */
const parseReturn = (path, desc) => {
	const match = desc.match(getRegexForType(path, 'return'));
	return {
		type: match?.groups?.type || '',
		variable: match?.groups?.variable || '',
		desc: match?.groups?.desc || '',
	}
}

/**
 * Get @see declaration from docblock.
 *
 * @param {string} path pathname type.
 * @param {string} desc docBlock description
 * @returns {string} params from description.
 */
const parseSee = (path, desc) => {
	const match = desc.match(getRegexForType(path, 'see'));
	return match?.groups?.url;
}

/**
 * Get @see declaration from docblock.
 *
 * @param {string} path  pathname type.
 * @param {string} regex regex expression.
 */
const removeImages = (path, regex) => {

	// quick script to remove the images to prevent a build error in Nextra.
	fs.readFile(path, 'utf8', function (err,data) {
		if (err) {
			return;
		}

		var result = data.replace( regex, 'Note: Image not supported yet!');

		fs.writeFile(path, result, 'utf8', function (err) {
			if (err) return console.log(err);
		});
	});
}

/**
 * Navigate up down one directory in a path.
 *
 * @param {string} path directory path.
 * @returns {string} path less the last directory.
 */
const navigateDown = (path) => path.slice(0, path.lastIndexOf('/'));

module.exports = {
	copyFileIfExists,
	createDirectory,
	getFileDirectory,
	getFilesAndFolders,
	getFileType,
	getFolderDirectories,
	getNonHiddenFiles,
	getNonHiddenFolders,
	getRegexForType,
	getRegexForType,
	getRelativePath,
	isFileEmpty,
	isJs,
	isMarkdown,
	isPhp,
	navigateDown,
	parseParams,
	parseReturn,
	parseSee,
	recursiveRemoveDirectory,
	removeImages,
	shouldExcludeDirectory,
	shouldExcludeFile,
	shouldExcludeMethod,
}
