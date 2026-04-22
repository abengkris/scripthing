# Contributing to Scripthing

First off, thank you for considering contributing to Scripthing! It's people like you that make Scripthing such a great tool for writers.

## Code of Conduct
By participating in this project, you are expected to uphold our Code of Conduct (please see [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)).

## How Can I Contribute?

### Reporting Bugs
- Use the [GitHub issue tracker](https://github.com/abengkris/scripthing/issues) to report bugs.
- Include a clear, descriptive title and as much information as possible to help us reproduce the issue.

### Suggesting Enhancements
- Feature requests are welcome! Please open an issue to discuss your ideas before starting implementation.

### Your First Code Contribution
1. Fork the repository and create your branch from `main`.
2. Install dependencies with `pnpm install`.
3. If you're adding a feature, follow our **Spec-Driven Development** approach (refer to [AGENTS.md](./AGENTS.md)).
4. Ensure your code follows our [Style Guides](./conductor/code_styleguides/).
5. Write tests for any new functionality.
6. Run the full quality check: `pnpm check` and `pnpm test`.

## Style Guides

### Commit Messages
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps us generate automated changelogs.
- `feat(...)`: A new feature
- `fix(...)`: A bug fix
- `docs(...)`: Documentation changes
- `chore(...)`: Maintenance tasks
- `refactor(...)`: Code changes that neither fix bugs nor add features

### Code Style
- **Files**: Use `kebab-case.ts`.
- **React Components**: Use `PascalCase.tsx`.
- **Variables/Functions**: Use `lowerCamelCase`.
- **Formatting**: We use ESLint and Prettier (run automatically via `lint-staged` on commit).

## Pull Request Process
1. Ensure your branch is up-to-date with `main`.
2. Update the `README.md` and `CHANGELOG.md` if your change adds/modifies user-facing features.
3. Your PR will be automatically tested via GitHub Actions. All checks must pass before it can be merged.
4. Once your PR is approved, it will be merged into `main`.

Thank you for your contribution!
