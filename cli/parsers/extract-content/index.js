// External Dependencies.
const fs = require('fs');

// Internal Dependencies.
const {
	getRegexForType,
	parseParams,
	parseReturn,
	parseSee,
	shouldExcludeMethod,
} = require('../../utils');
const { formatDescription } = require('../../services');

/**
 * Parse PHP file content and return list document info.
 *
 * @param {string} pathName content location.
 * @returns {object} parsed content.
 */
const extractDataFromCode = (pathName) => {
	const fileContent = fs.readFileSync(pathName, 'utf8');

	// Extract top docblock
	const docblockPattern = getRegexForType(pathName, 'docBlock');
	const topDocblockMatch = fileContent.match(docblockPattern);
	const fileDesc = topDocblockMatch ? formatDescription(topDocblockMatch?.groups?.desc) : '';

	// Extract class name and its docblock
	const classNameMatch = fileContent.match(getRegexForType(pathName, 'class'));
	const details = {
		name: classNameMatch?.groups?.classname.replaceAll(/_/gi, ' ') || '',
		extends: classNameMatch?.groups?.extends || '',
		implements: classNameMatch?.groups?.implements || '',
	}

	const classContentMatch = fileContent.match(/\{(?<content>[\s\S]*)\}/);
	const classContentBetweenBraces = classContentMatch ? classContentMatch?.groups?.content.trim() : '';

	// If we assume a class exists, parse the content inside the class.
	// Else assume a standard functions.php file and parse.
	const contentToParse = details?.name?.length ? classContentBetweenBraces : fileContent;

	// Extract class methods, their docblocks, and parameters
	const methods = [];
	let methodMatch;

	while ((methodMatch = getRegexForType(pathName, 'method').exec(contentToParse))) {
		// Extract filters
		const filters = [];
		let filtersMatch;

		const methodDesc = methodMatch?.groups?.desc;
		const methodFunction = methodMatch?.groups?.function;
		const methodName = methodMatch?.groups?.function_name;

		// Ignore any methods we don't care about.
		if (shouldExcludeMethod(methodName)) {
			continue;
		}

		// https://regex101.com/r/86Vnho/5
		const methodContentPattern = new RegExp(`^(\\t+)${methodFunction}.*?\\{(?<content>[\\s\\S]*?\\n\\1)\\}`, 'gm');

		const methodContent = methodContentPattern.exec(fileContent)?.groups?.content;
		// Get the description docBlock.
		const descriptionMatch = methodDesc.match(docblockPattern);
		const description = descriptionMatch ? formatDescription(descriptionMatch?.groups?.desc) : '';

		// For every method, look for filters.
		while ((filtersMatch = getRegexForType(pathName, 'filter').exec(methodContent))) {
			const filterDesc = filtersMatch?.groups?.desc;
			const filterName = filtersMatch?.groups?.name;

			const descriptionMatch = filterDesc.match(docblockPattern);
			const description = descriptionMatch ? descriptionMatch?.groups?.desc.trim() : '';

			// Push filter details.
			filters.push({
				name: filterName,
				description,
				returnType: parseReturn(pathName, filterDesc),
				seeUrl: parseSee(pathName, filterDesc),
				params: parseParams(pathName, filterDesc),
			});
		}

		// Push method details.
		methods.push({
			name: methodName,
			description,
			returnType: parseReturn(pathName, methodDesc),
			seeUrl: parseSee(pathName, methodDesc),
			params: parseParams(pathName, methodDesc),
			filters,
		});
	}

	return {
		details,
		fileDesc,
		methods,
	};
}

module.exports = extractDataFromCode;
