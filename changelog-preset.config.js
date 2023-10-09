const fs = require('fs');
const path = require('path');

module.exports = {
  // Function to generate a custom changelog entry for a package version
  generateEntry: ({ version, tag, commits }) => {
    // Discover package names dynamically by scanning the 'packages' directory
    const packageNames = discoverPackageNames(); // Implement this function

    // Construct the changelog entry
    const changelogEntry = `## [${version}](${tag})\n`;

    // Add a section for package names
    if (packageNames.length > 0) {
      const packageNamesSection = `### Packages\n${packageNames.join('\n')}`;
      return changelogEntry + packageNamesSection + '\n';
    }

    // If no package names found, return only the changelog entry
    return changelogEntry + '\n';
  },
};

// Function to discover package names dynamically
function discoverPackageNames() {
  const packagesDir = path.join(__dirname, './modules/ami/*'); // Change to the path of your packages directory

  if (fs.existsSync(packagesDir)) {
    return fs.readdirSync(packagesDir).filter((entry) => {
      const packageJsonPath = path.join(packagesDir, entry, 'package.json');
      return fs.existsSync(packageJsonPath);
    });
  }

  return [];
}
