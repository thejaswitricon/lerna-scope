module.exports = {
    // Your changelog preset configuration here
  
    // Customized function to extract directory information from commit messages
    getInfoFromCommit(commit) {
      // Parse the commit message to extract the directory name
      // Assuming the commit message format is "feat(package-name): your commit message"
      const match = commit.header.match(/feat\(([^)]+)\)/);
  
      if (match) {
        const directoryName = match[1];
        return `**Directory Changed:** ${directoryName}\n\n`;
      }
  
      return '';
    },
  
    // Customized writer to include directory information in the changelog
    writerOpts: {
      transform: (commit, context) => {
        const directoryInfo = this.getInfoFromCommit(commit);
        return `* ${commit.type}: ${commit.subject}\n${directoryInfo}`;
      },
    },
  };
  