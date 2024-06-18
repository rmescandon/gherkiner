# Gherkiner

## Cli

situate in the cli folder
```sh
cd cli
```

### install typescript
Maybe first time you need to install the project dependencies
```sh
npm i
```

### build and run locally

```sh
npm run build
node out/cli.js -s <path_to_settings.json> <path_to_filename.feature>
```

you can find some example files for testing purposes at *examples* subfolder

### publish NPM

```sh
npm publish --access public --workspaces
````

NOTE: the npm package requires the shared npm package (gherkiner-shared) at shared folder.