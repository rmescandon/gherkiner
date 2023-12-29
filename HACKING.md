# Gherkiner

## Cli

### build and run locally

```sh
npm run cli
node out/cli.js <path_to_filename.feature>
```

### Docker

build docker image
```sh
docker build --load -f Dockerfile -t gherkiner:$(jq -r .version package.json) .
```

run from docker image
```sh
docker run --rm \
  -v $(pwd):/data \
  -u "$(id -u)" \
  gherkiner:<version> \
  <filename.feature>
```
