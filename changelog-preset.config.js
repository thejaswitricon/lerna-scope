module.exports = {
  // Define the custom changelog generation function
  generateCustomChangelog: async (changes, context) => {
    const { commits } = context;
    const changelogEntries = [];

    // Iterate through commits and extract the author's name
    for (const commit of commits) {
      const authorName = commit.author.name;
      const commitMessage = commit.subject;

      // Create a changelog entry with the author's name and commit message
      changelogEntries.push(`- ${authorName}: ${commitMessage}`);
    }

    // Join the changelog entries with line breaks
    const changelogContent = changelogEntries.join('\n');

    return changelogContent;
  },
};
