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
        let commitScope = commit.scope || 'Other'; // Default to 'Other' if no scope provided
  
        // If scope is 'Other', try to extract scope from the commit message or file path
        if (commitScope === 'Other') {
          // Extract scope from the commit message
          const scopeMatch = commit.message.match(/\(([^)]+)\)/);
          if (scopeMatch) {
            commitScope = scopeMatch[1];
          }
          // Alternatively, you can extract scope from the file path if available
          // const filePath = commit.files && commit.files[0];
          // if (filePath) {
          //   const scopeMatch = filePath.match(/\/([^/]+)\//);
          //   if (scopeMatch) {
          //     commitScope = scopeMatch[1];
          //   }
          // }
        }
  
        // Determine the commit group based on the commit type
        const commitGroup = commitType === 'feat' ? 'Features' : 'Bug Fixes';
  
        // Add each commit message with the package name
        commitGroups[commitGroup].push(`${commitScope}: ${commit.message} (#${commit.hash.slice(0, 7)})`);
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
  
  