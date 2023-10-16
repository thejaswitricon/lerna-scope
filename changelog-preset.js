module.exports = {
    // Your existing configuration here
  
    // Customized function to retrieve the name of the committed person
    getAuthorName(commit) {
      return commit.committer.name;
    },
  
    // Customized transform function to include the author's name and folder name in the changelog entry
    transform(commit, context) {
      const commitMessage = commit.header;
  
      // Determine the directory name or mark as "root" for changes in the root directory
      const directoryName = commit.scope ? commit.scope : 'root';
  
      // Retrieve the author's name using the getAuthorName function
      const authorName = this.getAuthorName(commit);
  
      return conventionalChangelogWriter.transform(commit, context).then((output) => {
        return `* ${commit.type} (${directoryName}/${authorName}): ${commitMessage}\n${output}`;
      });
    },
  
    // Function to generate changelog using conventional-changelog
    generateChangelog() {
      // Your existing code for generating the changelog
    },
  };
  