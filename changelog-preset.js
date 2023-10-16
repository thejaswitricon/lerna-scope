const conventionalChangelog = require('conventional-changelog');
const conventionalChangelogWriter = require('conventional-changelog-writer');

module.exports = {
  // Customized writer to include the name of the committed person in the changelog
  writerOpts: {
    // Add your customized options here
    // For example, specify the format of the output, output stream, etc.
    // See available options: https://github.com/conventional-changelog/conventional-changelog
  },

  // Customized function to retrieve the name of the committed person
  getAuthorName(commit) {
    return commit.committer.name;
  },

  // Customized function to add the author's name to the changelog entry
  addAuthorName(context, commit) {
    return new Promise((resolve, reject) => {
      // Retrieve the author's name using the getAuthorName function
      const authorName = this.getAuthorName(commit);

      // Modify the commit object to include the author's name
      commit.authorName = authorName;

      resolve(commit);
    });
  },

  // Customized transform function to include the author's name in the changelog entry
  transform(commit, context) {
    return this.addAuthorName(context, commit).then((commitWithAuthor) => {
      const authorName = commitWithAuthor.authorName || 'Unknown Author';
      const commitMessage = commitWithAuthor.header;
      
      // Include the author's name in the changelog entry
      return conventionalChangelogWriter.transform(commitWithAuthor, context).then((output) => {
        return `* ${commitWithAuthor.type} (${authorName}): ${commitMessage}\n${output}`;
      });
    });
  },

  // Function to generate changelog using conventional-changelog
  generateChangelog() {
    return new Promise((resolve, reject) => {
      const stream = conventionalChangelog(this.writerOpts, this.context, this.gitRawCommitsOpts, this.parserOpts, this.generateOpts);
      let changelog = '';

      stream.on('data', (chunk) => {
        changelog += chunk.toString();
      });

      stream.on('end', () => {
        resolve(changelog);
      });

      stream.on('error', (err) => {
        reject(err);
      });
    });
  },
};
