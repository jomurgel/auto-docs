#!/usr/bin/env node
/* eslint no-console: ["error", { allow: ["log"] }] */

// External dependencies.
const fs = require('fs');
const { exec } = require("child_process");

// Internal dependencies.
const generateFromFile = require('../../runners/generate-template-single');
const generateFromDirectory = require('../../runners/generate-template-directory');

/**
 * Main generator kickoff for this command.
 */
const generate = async (options) => {
	const { clone } = options;

	// Clone repos locally to test using all generators.
	if (clone) {
		await cloneRepos();
	}

	// Each generator is responsible for validating filesystem actions.
	// Don't assume repos cloned correctly.
	await generateFromFile();
	await generateFromDirectory();
}

/**
 * Clone repos locally, mimicking how the GitHub action would.
 *
 * @todo Add a flag to checkout main and pull for each branch too.
 * @todo Move the list of repos into a separate file.
 * @todo Add a conditional so that if the string is a local path string
 *       (formatted like `./...``), it should create a symlink so that the
 *       build is pointing to a cloned repo somewhere else.
 */
const cloneRepos = async () => {
	const repos = {
		// REPOS TO PULL IN CONTENT FROM (Correspond to Runner)
	};

	// Loop through each repo, cloning it if needed.
	Object.keys(repos).forEach((repoName, index) => {
		if (!fs.existsSync(`./${repoName}`)) {
			console.log(`Creating ./${repoName} and cloning the repo.`)
			exec(`git clone ${repos[repoName]}`);
		} else {
			console.log(`./${repoName} already exists.`)
		}
	});
}

module.exports = {
	generate,
	registerCommands,
};
