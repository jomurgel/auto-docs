/**
 * Capitalize the first string.
 *
 * @param {string} string string to capitalize.
 * @returns {string} capitalized string.
 */
const capitalizeString = (string) => {
	const capString = string.split(" ");

	for (let i = 0; i < capString.length; i++) {
		capString[i] = capString[i][0].toUpperCase() + capString[i].slice(1);
	}

	return capString;
}

/**
 * Format string to remove unnecessary characters.
 *
 * https://regex101.com/r/dSUajn/2
 * https://regex101.com/r/FmKt8s/1
 *
 * @param {string} string description string
 * @returns formatted string.
 */
const formatDescription = (string) => string?.trim().replaceAll(/[\t\n*]/g, '').replaceAll(/\{/gm, '\\{').replaceAll(/\}/g, '\\}').replaceAll(/\</gm, '\\<').replaceAll(/\>/g, '\\>');

/**
 * Add depth hash to heading.
 *
 * @param {string} string heading text.
 * @param {int} depth heading depth, markdown hash. Default 2.
 * @param {bool} inset whether or not to inset heading. Default false.
 * @returns {string} Markdown-hashed heading.
 */
const formatHeading = (string, depth = 2, inset = false) => {
	const headingDepth = inset ? depth + 1 : depth;
	return `${'#'.repeat(headingDepth)} ${string}`;
}

module.exports = {
	capitalizeString,
	formatDescription,
	formatHeading,
};
