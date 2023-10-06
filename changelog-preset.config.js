module.exports = {
    // Function to generate a custom changelog entry for a package version
    generateEntry: ({ version, tag, commits }) => {
      const commitGroups = {};
  
      // Group commits by commit type (e.g., feat, fix, chore)
      commits.forEach((commit) => {
        const commitType = commit.type || 'Other';
        if (!commitGroups[commitType]) {
          commitGroups[commitType] = [];
        }
  
        // Add each commit message with the package name
        commitGroups[commitType].push(`- (${commit.scope || 'package-1'}) :${commit.message} (#${commit.hash.slice(0, 7)})`);
      });
  
      // Construct the changelog entry
      const changelogEntry = `## [${version}](${tag})\n`;
  
      // Add sections for each commit type
      const commitTypeOrder = ['feat', 'fix', 'chore', 'docs', 'style', 'refactor', 'perf', 'test', 'Other'];
      const sections = commitTypeOrder
        .filter((commitType) => commitGroups[commitType])
        .map((commitType) => {
          return `### ${commitType.charAt(0).toUpperCase() + commitType.slice(1)}\n${commitGroups[commitType].join('\n')}`;
        });
  
      return changelogEntry + sections.join('\n') + '\n';
    },
  };
  