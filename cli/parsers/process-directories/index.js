// External Dependencies.
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');

// Internal Dependencies.
const {
	createDirectory,
	getFileDirectory,
	getFilesAndFolders,
	isMarkdown,
	navigateDown,
} = require('../../utils');
const parseDocBlocks = require('../parse-docblock');
const { capitalizeString } = require('../../services');

/**
 * Process a directory at a defined path.
 *
 * @param {string} dirPath directory path.
 * @param {int} depth directory depth
 * @param {string} outputFilePath output path.
 */
const processPath = (dirPath, depth, outputFilePath) => {
	if (depth > 4) {
		return;
	}

	// Get all files.
	const files = fs.readdirSync(dirPath);

	// For each file or folder loop.
	for (const file of files) {
		const filePath = path.join(dirPath, file);
		const stats = fs.statSync(filePath);

		// If the file is a directory, recursively dive.
		if (stats.isDirectory()) {
			// Recursively process subdirectory
			processPath(filePath, depth + 1, outputFilePath);
		} else if (stats.isFile()) {
			// Read file content and append to output file
			const content = parseDocBlocks(filePath);
			fs.appendFileSync(outputFilePath, content);

			// Announce parse.
			console.log(chalk.green(`Processed ${getFileDirectory(filePath)}.`));
		}
	}
}

/**
 * For a given directory recursively create mdx files.
 *
 * @param {string} source source path.
 * @param {string} output output path.
 */
const handleFolderDirectories = (source, output) => {
	// Get all files and folders for the current source.
	const { files, folders } = getFilesAndFolders(source);

	// Loop through all the files and for markdown files copy, else parse.
	// For all of the files in a directory, parse and create new files.
	if (files?.length) {
		// Pull out markdown files.
		let mdxContent = '';
		files.forEach((file) => {
			// Let's assume that this file should be output at the top-level for a directory.
			if (isMarkdown(file)) {
				const path = getFileDirectory(source);
				// Create the filename.
				mdxContent = fs.readFileSync(`${source}/${file}`, 'utf8');
				fs.writeFileSync(`${navigateDown(output)}/${path}.mdx`, mdxContent, 'utf8');
				// Remove this file from the array of files.
				files.splice(files.indexOf(file), 1);
			}
		});

		// Parse all of the remaining files.
		if (files?.length) {
			let mdxContent = '';
			const path = getFileDirectory(source);
			// For non-mdx files, handle through parser.
			const mdxFileName = `${path}.mdx`;
			mdxContent += `## ${capitalizeString(path)}\n\n`;

			files.forEach((file) => {
				mdxContent += parseDocBlocks(`${source}/${file}`);
			})

			// Write these files to the top-level (created for the subdirectory) dropdown in Nextra.
			fs.writeFileSync(`${output}/${mdxFileName}`, mdxContent, 'utf8');
		}
	}

	// Loop through folders recursively and generate top-level files.
	for (const dir of folders) {
		const outputFileName = `${dir}.mdx`;
		const outputFilePath = `${output}/${outputFileName}`;

		processPath(`${source}/${dir}`, 0, outputFilePath);
	}
}

/**
 * Copy all files from a directory to another.
 *
 * @param {string} source           directory path.
 * @param {string} destination      directory path.
 * @param {array}  excludeDirectory array of directories to exclude.
 * @param {array}  excludeFiles     array of files to exclude.
 */
const copyDirectoryContents = (
	source,
	destination,
	excludeDirectory = [],
	excludeFiles = []
) => {
	// Then create the destination directory if it doesn't exist, start fresh.
	createDirectory(destination);

	// Get the list of files and subdirectories in the source directory
	fs.readdirSync(source, { withFileTypes: true }).forEach((item) => {
		const sourcePath = path.join(source, item.name);
		const destinationPath = path.join(destination, item.name);

		if (item.isDirectory()) {
			if (!excludeDirectory.some((dir) => destinationPath.includes(dir))) {
				copyDirectoryContents(sourcePath, destinationPath);
			}
		} else {
			if (!excludeFiles.some((dir) => destinationPath.includes(dir))) {
				fs.copyFileSync(sourcePath, destinationPath);
			}
		}
	});

	console.log(chalk.yellow(`${chalk.underline(getFileDirectory(source))} has been copied.`));
}

/**
 * Copy all files from a directory to another.
 *
 * @param {string} source      directory path.
 * @param {string} destination directory path.
 */
const copyFileContents = (source, destination) => {
	const content = fs.readFileSync(source, 'utf8');
	fs.writeFileSync(destination, content, 'utf8');
	console.log(chalk.yellow(`${chalk.underline(getFileDirectory(source))} has been copied.`));
}

/**
 * Process a single input/output directory.
 *
 * @param {string} source source input path.
 * @param {string} output output path.
 */
const processDirectory = (source, output) => {
	// // Create the target directory if it doesn't exist
	createDirectory(output);
	// Process directory.
	handleFolderDirectories(source, output);
}

module.exports = {
	copyFileContents,
	copyDirectoryContents,
	handleFolderDirectories,
	processDirectory,
	processPath,
}
