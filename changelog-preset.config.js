const fs = require('fs');
const path = require('path');

module.exports = {
  // Function to generate a custom changelog entry for a package version
  generateEntry: ({ version, tag, commits }) => {
    const commitGroups = {
      'Bug Fixes': [],
      'Features': [],
    };

    // Helper function to get the package or directory name from the file path
    function getPackageOrDirectoryName(filePath) {
      // Extract the directory name from the file path
      const parts = filePath.split('/');
      const lastPart = parts[parts.length - 2]; // Assumes package names are the parent directory
      return lastPart || 'Other'; // Default to 'Other' if no scope is available
    }

    // Group commits by commit type (e.g., feat, fix, chore)
    commits.forEach((commit) => {
      const commitType = commit.type || 'Other';
      const commitScope = commit.scope || getPackageOrDirectoryName(commit.files && commit.files[0]);

      // Determine the commit group based on the commit type
      const commitGroup = commitType === 'feat' ? 'Features' : 'Bug Fixes';

      // Add each commit message with the package name and committer's name
      commitGroups[commitGroup].push(
        `${commitScope}: ${commit.message} (#${commit.hash.slice(0, 7)}) - ${commit.committer.name}`
      );
    });

    // Construct the changelog entry
    const changelogEntry = `## [${version}](${tag})\n`;

    // Add sections for "Bug Fixes" and "Features" if there are commits in them
    const sections = Object.keys(commitGroups)
      .filter((commitGroup) => commitGroups[commitGroup].length > 0)
      .map((commitGroup) => {
        return `### ${commitGroup}\n${commitGroups[commitGroup].join('\n')}`;
      });

    return changelogEntry + sections.join('\n') + '\n';
  },
};
