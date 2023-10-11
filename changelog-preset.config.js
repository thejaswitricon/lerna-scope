const commitPartial = `
* {{#if scope}}**{{scope}}:** {{/if}}{{subject}}

{{!-- commit link --}}{{#if hash}} {{#if @root.linkReferences~}}
  ([{{shortHash}}]({{commitUrlFormat}}))
{{~else}}
  {{shortHash}}
{{~/if}}{{~/if}}

{{!-- commit references --}}
{{#if references~}}
  , closes
  {{~#each references}}
    {{#if @root.linkReferences~}}
      [{{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{this.prefix}}{{this.issue}}]({{issueUrlFormat}})
    {{~else}}
      {{#if this.owner}}{{this.owner}}/{{/if}}{{this.repository}}{{this.prefix}}{{this.issue}}
    {{~/if}}
  {{/each}}
{{~/if}}

{{#if body}}
  <br/>
  {{body}} // The addition
{{/if}}

{{#if folderNames}}
  <br/>
  Changed folders: {{#each folderNames}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/if}}
`;

module.exports = {
  issuePrefixes: ["TEST-"],
  issueUrlFormat: "myBugTracker.com/{prefix}{id}",
  conventionalChangelog: {
    writerOpts: {
      commitPartial,
    },
  },
};
