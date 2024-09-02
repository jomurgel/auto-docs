// External Dependencies.
const fs = require('fs');
const chalk = require('chalk');

// Internal Dependencies.
const {
	isMarkdown,
	shouldExcludeFile,
} = require('../../utils');
const { formatHeading } = require('../../services');
const extractDataFromCode = require('../extract-content');

/**
 * Parse docBlocks for a given file.
 *
 * @param {string} pathName pathname.
 * @returns {string} markdown output.
 */
const parseDocBlocks = (pathName) => {
	let mdxContent = '';

	// Ignore folders/directories we don't need to worry about.
	if (shouldExcludeFile(pathName)) {
		return mdxContent;
	}

	const {
		details,
		fileDesc,
		filters,
		methods,
	} = extractDataFromCode(pathName);

	// If we have a readme/markdown file at the root, copy.
	if (isMarkdown(pathName)) {
		// Parse the markdown, but inset the headings by one.
		// https://regex101.com/r/CYkU2l/1
		mdxContent += `${fs.readFileSync(pathName, 'utf8').replaceAll(/#\s/ig, '## ')}\n`;
		return mdxContent;
	}

	// Determine whether or not we have a top-most details heading.
	// TODO: Will determine heading depth for now, should update docs to format properly.
	const hasDetails = Boolean(details?.name?.length);

	// Parse/setup classes.
	if (hasDetails) {
		const implementsArray = details?.implements ? details?.implements.split(', ') : [];
		const implements = implementsArray.map((implement) => `**${implement.trim()}**`);

		mdxContent += `${formatHeading(details?.name, 2)}\n`;
		mdxContent += `${fileDesc}\n`;
		mdxContent += details?.extends ? `- Extends: **${details?.extends}**\n` : '';
		mdxContent += details?.implements ? `- Implements: ${implements.join(', ')}\n\n` : '\n';
	}

	// If we have methods.
	if (methods?.length) {
		// TODO: Add return type?
		methods.forEach((method) => {
			mdxContent += `${formatHeading(method?.name, 2, mdxContent.includes('#') || !hasDetails)}\n`;
			mdxContent += `${method.description}\n`;

			if (method?.params?.length) {
				method?.params.forEach((param) => {
					const descParam = param?.desc ? ` — ${param?.desc}` : '';
					mdxContent += `- \`${param?.name}\`: ${param?.type} ${descParam}\n`;
				});
			}
			if (method?.seeUrl) {
				mdxContent += `- [Reference](${method?.seeUrl})\n`;
			}
			mdxContent += `\n`;

			// If we have filters.
			if (method?.filters?.length) {
				mdxContent += `${formatHeading('Filters', 4, !hasDetails)}\n`;

				// TODO: Add return type?
				method?.filters.forEach((filter) => {
					mdxContent += `${formatHeading(filter?.name, 5, !hasDetails)}\n`;
					mdxContent += `${filter.description}\n`;

					if (filter?.params?.length) {
						filter?.params.forEach((param) => {
							const descParam = param?.desc ? ` — ${param?.desc}` : '';
							mdxContent += `- \`${param?.name}\`: ${param?.type} ${descParam}\n`;
						});
					}
					if (filter?.seeUrl) {
						mdxContent += `- [Reference](${filter?.seeUrl})\n`;
					}
					mdxContent += `\n`;

				})
			}
		})
	}

	// Return markdown content.
	return mdxContent;
}

module.exports = parseDocBlocks;
