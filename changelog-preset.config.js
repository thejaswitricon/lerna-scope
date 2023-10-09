const commitPartial = `
*{{#if scope}} **{{scope}}:**
{{~/if}} {{#if subject}}
  {{~subject}}
{{~else}}
  {{~header}}
{{~/if}}

{{~!-- commit link --}}{{~#if hash}} {{#if @root.linkReferences~}}
  ([{{shortHash}}]({{commitUrlFormat}}))
{{~else}}
  {{~shortHash}}
{{~/if}}{{~/if}}

{{~!-- commit references --}}
{{~#if references~}}
  , closes
  {{~#each references}} {{#if @root.linkReferences~}}
    [
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}{{this.prefix}}{{this.issue}}]({{issueUrlFormat}})
  {{~else}}
    {{~#if this.owner}}
      {{~this.owner}}/
    {{~/if}}
    {{~this.repository}}{{this.prefix}}{{this.issue}}
  {{~/if}}{{/each}}
{{~/if}}
{{#if body}}
  <br/>
  {{body}} // The addition
{{~/if}}
`

module.exports = {
  // Function to generate a custom changelog entry for a package version
  generateEntry: ({ version, tag, commits }) => {
    const commitGroups = {
      'Bug Fixes': [],
      'Features': [],
    };

    const changedPackageFiles = new Set();

    // Group commits by commit type (e.g., feat, fix, chore)
    commits.forEach((commit) => {
      const commitType = commit.type || 'Other';
      let commitScope = commit.scope; // Use provided scope if available

      // If no explicit scope is provided, try to extract scope from the file path
      if (!commitScope) {
        const filePath = commit.files && commit.files[0];
        if (filePath) {
          // Extract the directory name from the file path
          const scopeMatch = filePath.match(/\/([^/]+)\//);
          if (scopeMatch) {
            commitScope = scopeMatch[1];
          }
        }
      }

      // Default to 'Other' if scope is still not available
      commitScope = commitScope || 'Other';

      // Determine the commit group based on the commit type
      const commitGroup = commitType === 'feat' ? 'Features' : 'Bug Fixes';

      // Add each commit message with the package name
      commitGroups[commitGroup].push(`${commitScope}: ${commit.message} (#${commit.hash.slice(0, 7)})`);

      // Track changed package.json files
      if (commit.files) {
        commit.files.forEach((filePath) => {
          if (filePath.endsWith('/package.json')) {
            changedPackageFiles.add(filePath); // Store the file path
          }
        });
      }
    });

    // Construct the changelog entry
    const changelogEntry = `## [${version}](${tag})\n`;

    // Add sections for "Bug Fixes" and "Features" if there are commits in them
    const sections = Object.keys(commitGroups)
      .filter((commitGroup) => commitGroups[commitGroup].length > 0)
      .map((commitGroup) => {
        return `### ${commitGroup}\n${commitGroups[commitGroup].join('\n')}`;
      });

    // Add a section for changed package.json files
    if (changedPackageFiles.size > 0) {
      const packageFilesSection = `### Changed Package Files\n${Array.from(changedPackageFiles).join('\n')}`;
      sections.push(packageFilesSection);
    }

    return changelogEntry + sections.join('\n') + '\n';
  },
};
