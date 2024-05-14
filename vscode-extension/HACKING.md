# Gherkiner

## Cli

### build and run locally

```sh
npm run cli
node out/cli.js <path_to_filename.feature>
```

example:
```sh
NODE_CONFIG='{"paddingSymbol":" ","paddingDefault":4,"paddingTable":10,"paddings":[{"keyword":"Feature","padding":0},{"keyword":"Scenario Outline","padding":2},{"keyword":"Scenario","padding":2},{"keyword":"Given","padding":4},{"keyword":"When","padding":5},{"keyword":"Then","padding":5},{"keyword":"And","padding":6},{"keyword":"But","padding":6},{"keyword":"Backgroud","padding":2},{"keyword":"Action","padding":2},{"keyword":"Examples:","padding":4},{"keyword":"#","padding":0}],"formatOnSave":false,"fixtureLineBreak":true,"consecutiveBlankLinesToOne":false}' node out/cli.js ../sections.feature
```
