# gobstones-core

A set of utility types, interfaces and classes that are used through all the Gobstones Platform repositories.

[![Licence](https://img.shields.io/github/license/gobstones/gobstones-core?style=plastic&label=License&logo=open-source-initiative&logoColor=white&color=olivegreen)](https://github.com/gobstones/gobstones-core/blob/main/LICENSE) [![Version](https://img.shields.io/github/package-json/v/gobstones/gobstones-core?style=plastic&label=Version&logo=git-lfs&logoColor=white&color=crimson)](https://www.npmjs.com/package/@gobstones/gobstones-core) [![API Docs](https://img.shields.io/github/package-json/homepage/gobstones/gobstones-core?color=blue&label=API%20Docs&logo=gitbook&logoColor=white&style=plastic)](https://gobstones.github.io/gobstones-core)

![GitHub Workflow Tests](https://img.shields.io/github/workflow/status/gobstones/gobstones-core/test-on-commit?style=plastic&label=Tests&logo=github-actions&logoColor=white) ![GitHub Workflow Build](https://img.shields.io/github/workflow/status/gobstones/gobstones-core/build-on-commit?style=plastic&label=Build&logo=github-actions&logoColor=white)

## Install

Install with **npm** by using

```
npm install @gobstones/gobstones-core
```

## Usage

Unless you are developing a library for the Gobstones Platform you probably won't need to use this library directly, as many of the elements in this library are re-exported by other tools. If you are however interesting in using this library directly or you are effectively developing things in the Gobstones Platform, there are several ways how you can use this library.

### Main module

The main module is `@gobstones/gobstones-core` and contains useful classes and abstraction to
most code usage in Gobstones. Currently some of the exported utilities are:
* Board related classes and interfaces (Board, Cell, Color, Direction)
* Expectations (The `expect` function and all it's associated matchers)
* Translator (Mainly the translator class and it's associated behavior)
* helper tools (Such as a tool for creating matrices, a deepEqual comparison, and tools to flatten/unflatten an object)

Just import then from the main module the tools you want. [Check the API](https://github.io/gobstones-core) for more information on what is exported and how it works.

```typescript
import { Board } from '@gobstones/gobstones-core';
import { expect } from '@gobstones/gobstones-core';
```

### CLI Module

The CLI module provides tools for constructing a CLI application. It resides on the `/cli` submodule. It exports mainly the `cli` type and function. Import it as follows:

```typescript
import { cli } from '@gobstones/gobstones-core/cli';
```

## Contributing

See the [Gobstones Platform Contributions Guidelines]((https://dev.gobstones.org/contribution-guidelines)) to contribute.
