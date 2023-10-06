const { execSync } = require('child_process');

// Get the list of changed files from the input argument
const changedFiles = process.argv[2];

// Function to determine the scope based on the changed files
function getScope(changedFiles) {
  const packagesDir = 'packages'; // Change this to match your project structure
  const changedPackages = [];

  // Split the list of changed files and check if they belong to any package
  const files = changedFiles.split('\n').filter(Boolean);
  for (const file of files) {
    if (file.startsWith(packagesDir)) {
      const packageScope = file.split('/')[1]; // Extract the package name/scope
      if (!changedPackages.includes(packageScope)) {
        changedPackages.push(packageScope);
      }
    }
  }

  // Combine the changed package scopes as a comma-separated string
  return changedPackages.join(',');
}

// Set the scope using the getScope function
const scope = getScope(changedFiles);

// Set the Lerna scope environment variable
process.env.LERNA_SCOPE = scope;

// Output the determined scope for debugging purposes
console.log(`Determined Lerna scope: ${scope}`);
