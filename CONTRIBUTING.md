# Contributing to MV Webservice Frontend

First off, thank you for considering contributing to MV Webservice Frontend! It's people like you that make this project better.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [How to Contribute](#how-to-contribute)
- [Style Guidelines](#style-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to support@mvwebservice.com.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Set up the development environment (see main README.md)
4. Create a branch for your changes
5. Make your changes
6. Test your changes thoroughly
7. Submit a pull request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/mvsoftware-frontend.git
cd mvsoftware-frontend

# Add upstream remote
git remote add upstream https://github.com/Mayurv153/mvsoftware-frontend.git

# Install dependencies
npm install

# Create a branch for your feature
git checkout -b feature/your-feature-name

# Start development server
npm run dev
```

## Development Process

1. **Sync with upstream** before starting work:
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes
   git checkout -b fix/bug-description
   ```

3. **Make your changes** following our style guidelines

4. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

5. **Commit your changes** using conventional commits

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a pull request** from your fork to our main repository

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version, etc.)
- **Additional context**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** for the enhancement
- **Current behavior** vs **desired behavior**
- **Possible implementation** (if you have ideas)
- **Screenshots or mockups** if applicable

### Code Contributions

#### What to Work On

- Check the [Issues](https://github.com/Mayurv153/mvsoftware-frontend/issues) page
- Look for issues labeled `good first issue` for beginner-friendly tasks
- Look for issues labeled `help wanted` for items needing contributors
- Feel free to propose new features via issues first

#### Areas to Contribute

- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- Test coverage
- UI/UX enhancements
- Accessibility improvements

## Style Guidelines

### JavaScript/React Style Guide

- Use **ES6+ features** (arrow functions, destructuring, etc.)
- Use **functional components** and hooks
- Follow **React best practices**
- Use **meaningful variable names**
- Keep functions **small and focused**
- Add **comments** for complex logic
- Use **PropTypes** or TypeScript for type checking

#### Example:

```javascript
// Good
const UserProfile = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async () => {
    try {
      await onUpdate(user);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    // JSX here
  );
};

// Avoid
function UserProfile(props) {
  var editing = false;
  // ... old patterns
}
```

### CSS/Tailwind Guidelines

- Use **Tailwind utility classes** first
- Follow **mobile-first** approach
- Use **consistent spacing** (from Tailwind scale)
- Create **custom classes** only when necessary
- Keep styles **DRY** (Don't Repeat Yourself)

```jsx
// Good - Mobile first, semantic classes
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">

// Avoid - Desktop first, arbitrary values
<div className="flex gap-[17px] lg:flex-col">
```

### File Organization

- **Components**: `/src/components/ComponentName.js`
- **Pages**: `/src/app/page-name/page.js`
- **Hooks**: `/src/hooks/useHookName.js`
- **Utilities**: `/src/lib/utilityName.js`
- **Styles**: `/src/styles/`

### Naming Conventions

- **Components**: PascalCase (`UserProfile.js`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: Match component name or use kebab-case
- **CSS classes**: Follow Tailwind conventions

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **ci**: CI/CD changes

### Examples

```bash
feat(auth): add password reset functionality

fix(navbar): resolve mobile menu not closing on link click

docs(readme): update installation instructions

style(components): format code with prettier

refactor(api): simplify user data fetching logic

perf(images): implement lazy loading for gallery

test(auth): add unit tests for login component

chore(deps): update dependencies to latest versions
```

### Commit Best Practices

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject line with a period
- Separate subject from body with a blank line
- Wrap body at 72 characters
- Explain what and why, not how

## Pull Request Process

### Before Submitting

1. ✅ Ensure your code follows our style guidelines
2. ✅ Run linting: `npm run lint`
3. ✅ Build successfully: `npm run build`
4. ✅ Test your changes thoroughly
5. ✅ Update documentation if needed
6. ✅ Ensure commits follow our commit guidelines
7. ✅ Rebase on latest main branch

### PR Description

Include in your pull request:

- **Description** of changes made
- **Motivation** for the changes
- **Related issues** (use "Fixes #123" or "Closes #123")
- **Type of change** (bug fix, feature, docs, etc.)
- **Screenshots** for UI changes
- **Testing** steps performed
- **Checklist** of completed items

### PR Template

```markdown
## Description
Brief description of changes

## Motivation and Context
Why is this change needed?

## Related Issues
Fixes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Screenshots (if applicable)

## Testing Steps
1. Step one
2. Step two

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Build succeeds
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, maintainers will merge
4. Your contribution will be credited

## Issue Guidelines

### Creating Issues

- **Search existing issues** first
- Use a **clear, descriptive title**
- Provide **detailed description**
- Use **issue templates** when available
- Add **appropriate labels**
- Be **respectful and constructive**

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `question`: Further information requested
- `wontfix`: This will not be worked on

## Questions?

Feel free to:
- Open an issue with the `question` label
- Contact us at support@mvwebservice.com
- Check existing documentation and issues

## Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- Special mentions for significant contributions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to MV Webservice Frontend! 🎉
