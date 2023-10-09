const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getChangedDirectory() {
  try {
    // Use 'git status --porcelain' to get a list of changed files and their statuses
    const { stdout } = await exec('git status --porcelain');

    // Split the output into lines
    const lines = stdout.split('\n');

    // Extract the directory names from the list of changed files
    const changedDirectories = new Set();

    for (const line of lines) {
      if (line.trim() !== '') {
        // Extract the file path from the line (skip the status characters)
        const filePath = line.trim().substring(3).trim();

        // Extract the directory name from the file path
        const directoryName = filePath.split('/')[0];

        // Add the directory name to the set of changed directories
        changedDirectories.add(directoryName);
      }
    }

    // Convert the set of directory names to an array (if needed)
    const changedDirectoryArray = Array.from(changedDirectories);

    // You can return the array of changed directory names or do further processing
    return changedDirectoryArray;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

module.exports = config({
  "issuePrefixes": ["TEST-"],
  "issueUrlFormat": "myBugTracker.com/{prefix}{id}",
}).then((preset) => {
  preset.conventionalChangelog.writerOpts.commitPartial = commitPartial;

  // Call the function to get the changed directory names
  getChangedDirectory()
    .then((changedDirectories) => {
      console.log('Changed Directories:', changedDirectories);

      // Add the changed directories to the release notes
      preset.conventionalChangelog.writerOpts.finalizeContext = async function (
        context
      ) {
        const releaseNotes = context.commitGroups.map((group) => {
          const title = group.title;
          const commits = group.commits.map((commit) => {
            return `- ${commit.hash} ${commit.subject}`;
          });

          return [title, ...commits].join('\n');
        });

        // Append the changed directories to the release notes
        if (changedDirectories.length > 0) {
          releaseNotes.push('\nChanged Directories:');
          changedDirectories.forEach((directory) => {
            releaseNotes.push(`- ${directory}`);
          });
        }

        context.finalizeContext.notes = releaseNotes.join('\n');
      };
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  return preset;
});
