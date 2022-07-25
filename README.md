# FuckHomework

## Introduction

This is a SvelteKit web application to blame and manage received homework of yours.

## Features

- Succinct Web UI

## Getting started

First make sure your machine has `git`, `node`, `npm` and `yarn` installed. Then clone the repository:

```bash
git clone https://github.com/LittleYe233/FuckHomework.git
cd FuckHomework
```

Then install the dependencies:

```bash
yarn
```

Now you can configure the application (via [Configuration](#configuration)) and launch it:

```bash
# development server
npm run dev
```

## Configuration

All configurations are stored in `config.json`, which is ignored by Git. So after cloning the repository, make sure to create it in the root folder. The only required field is `version` which should be `1` now:

```json
{
    "version": 1
}
```

Also you can copy or rename `config.example.json` to `config.json` which includes most of the supported fields and most of their values are default ones.

`config.json` and `config.example.json` support JSON Schema to lint them. Use Visual Studio Code and hover the cursor onto these fields to check details.

## To-do list

- User management and permission
- Additional rules (i.e. filename restriction) for components (i.e. homework upload panel)
- More optional visualization
- Due time restriction
- Classification for ongoing and finished homework

## Technology stack

- TypeScript
- Vite
- Svelte & SvelteKit
- Tailwind CSS

## Donate

Planned.

## License

[MIT license](/LICENSE)
