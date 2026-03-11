# Commit Message Standard

All commits must follow a structured format to ensure readability, traceability, and automated tooling compatibility.

This repository includes a versioned commit hook at `.githooks/commit-msg`. Running `npm i` configures `core.hooksPath` automatically so local commits are validated against this standard.

## Format

```text
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

## Commit types

| Visual token | Type | Description |
| --- | --- | --- |
| `[feature]` | `feat` | Introduces a new feature |
| `[bug]` | `fix` | Fixes a bug |
| `[refactor]` | `refactor` | Code restructuring without behavior change |
| `[perf]` | `perf` | Performance improvements |
| `[chore]` | `chore` | Maintenance tasks or tooling |
| `[test]` | `test` | Add or update tests |
| `[docs]` | `docs` | Documentation changes |
| `[style]` | `style` | Formatting or stylistic updates |
| `[config]` | `config` | Configuration updates |
| `[build]` | `build` | Build system or dependency changes |
| `[deploy]` | `deploy` | Deployment related changes |
| `[security]` | `security` | Security fixes or improvements |
| `[remove]` | `remove` | Remove deprecated or unused code |

## Scope

The scope indicates the module or system affected.

Examples:

- `(core)`
- `(api)`
- `(ui)`
- `(auth)`
- `(database)`
- `(pipeline)`
- `(agent)`
- `(config)`
- `(infra)`

Example:

```text
feat(api): add query execution endpoint
```

## Commit examples

### Feature

```text
feat(pipeline): add natural language query parser
```

### Bug fix

```text
fix(database): correct MongoDB aggregation result parsing
```

### Refactor

```text
refactor(core): simplify execution runner logic
```

### Performance

```text
perf(query-engine): optimize filter evaluation
```

### Documentation

```text
docs(readme): update installation instructions
```

### Configuration

```text
config(env): add support for local Mistral model
```

## Commit body

Use the body to explain why the change was made.

Example:

```text
feat(agent): implement dynamic action planner

Adds support for generating execution plans based on natural
language queries using the local LLM pipeline.

This enables automatic CRUD detection and execution.
```

## Footer

Use the footer for metadata or issue references.

Examples:

```text
Closes #42
Related: pipeline-refactor
Breaking-Change: query schema updated
```

## Rules

- Keep the description short and imperative.
- Start the description with a lowercase letter.
- Do not end the title with a period.
- Keep the title at or below 72 characters.
- Each commit should represent one logical change.

## Full example

```text
feat(pipeline): implement semantic action detection

Adds an AI-powered classifier that converts user queries
into structured database actions.

The classifier uses local Mistral inference and supports:
- CRUD detection
- aggregation detection
- collection inference

Closes #12
```
