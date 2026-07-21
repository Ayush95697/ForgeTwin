# Contributing to ForgeTwin

## 1) Repository Access

Repository maintainers should invite contributors from:

- **Settings → Collaborators and teams → Add people**

Give contributors **Write** access unless they require elevated permissions.

## 2) Protect the Default Branch

Repository maintainers should configure a branch protection rule for `main`:

- Require a pull request before merging
- Require at least one approval (recommended)
- Require status checks to pass (recommended)
- Restrict direct pushes to `main`

## 3) Branching Strategy

Each contributor should create a dedicated branch from `main` for every task.

Recommended branch naming:

- `feature/<short-description>`
- `fix/<short-description>`
- `chore/<short-description>`

Examples:

- `feature/login-ui`
- `fix/api-timeout`

## 4) Keep Branches Updated

To reduce conflicts, regularly sync your branch with latest `main`.

```bash
git checkout main
git pull origin main
git checkout <your-branch>
git merge main
```

If your team prefers rebase:

```bash
git checkout <your-branch>
git fetch origin
git rebase origin/main
```

## 5) Pull Request Workflow

1. Push your branch and open a pull request targeting `main`.
2. Fill in the pull request template.
3. Request reviews from relevant contributors.
4. Resolve review feedback and conflicts.
5. Merge only after checks pass and approvals are complete.

## 6) Team Coordination (Recommended)

- Create and assign GitHub Issues for each task.
- Track delivery with GitHub Projects.
- Keep one issue per PR where possible for clearer ownership.
