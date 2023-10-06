// set-scope.js

const fs = require('fs');
const path = require('path');

// Get the list of changed files
const changedFiles = process.argv.slice(2);

// Extract the directory name from the first changed file
const scope = path.dirname(changedFiles[0]);

// Read the existing lerna.json file
const lernaConfig = require('./lerna.json');

// Update the "version" field in lerna.json with the extracted scope
lernaConfig.version = scope;

// Write the updated lerna.json file
fs.writeFileSync('./lerna.json', JSON.stringify(lernaConfig, null, 2));

console.log(`Set scope to "${scope}" in lerna.json`);
