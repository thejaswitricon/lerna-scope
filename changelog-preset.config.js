module.exports = {
    // Function to generate a custom changelog entry for a package version
    generateEntry: ({ version, tag, commits }) => {
      const commitGroups = {
        'Bug Fixes': [],
        'Features': [],
      };
  
      // Group commits by commit type (e.g., feat, fix, chore)
      commits.forEach((commit) => {
        const commitType = commit.type || 'Other';
        const packageName = commit.scope || 'package-1';
  
        // Determine the commit group based on the commit type
        const commitGroup = commitType === 'feat' ? 'Features' : 'Bug Fixes';
  
        // Add each commit message with the package name
        commitGroups[commitGroup].push(`{${packageName}}: ${commit.message} (#${commit.hash.slice(0, 7)})`);
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
  