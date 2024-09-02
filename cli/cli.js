#!/usr/bin/env node
/* eslint no-console: ["error", { allow: ["log"] }] */

/**
 * External dependencies.
 */
const { Command } = require('commander');

/**
 * Init our CLI.
 *
 * @type {Command}
 */
const program = new Command();
program
	.name('docs')
	.description('CLI for Auto Docs')
	.version('0.0.1');

/**
 * Load our and configure our commands.
 */
require('./commands/generate').registerCommands(program);

// Run our cli.
program.parse(process.argv);
