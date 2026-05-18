# Contributing to Connectly

Thank you for your interest in contributing to Connectly! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- No harassment or discrimination
- Report violations to maintainers

## Getting Started

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/yourusername/connectly.git`
3. **Create a branch**: `git checkout -b feature/your-feature`
4. **Install dependencies**: `npm install` (in both frontend and backend)
5. **Make your changes**
6. **Test your changes**
7. **Commit**: `git commit -am 'Add feature description'`
8. **Push**: `git push origin feature/your-feature`
9. **Create Pull Request**

## Development Workflow

### Setup Development Environment

```bash
# Clone
git clone https://github.com/yourusername/connectly.git
cd Connectly

# Backend setup
cd backend
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm start
```

### Branch Naming Convention

- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test additions

### Commit Message Format

```
[Type] Brief description

Detailed explanation if needed

Fixes #issue_number
```

Examples:
```
[Feature] Add message reactions
[Bugfix] Fix Socket.io connection timeout
[Docs] Update API documentation
[Refactor] Simplify chat message component
[Test] Add authentication tests
```

## Code Style

### JavaScript/React

- Use ES6+ syntax
- Use functional components in React
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Naming Conventions

```javascript
// Variables and functions - camelCase
const getUserProfile = () => {};
let userEmail = 'user@example.com';

// Classes and components - PascalCase
class UserModel {}
function DashboardPage() {}

// Constants - UPPER_SNAKE_CASE
const JWT_SECRET = 'secret';
const MAX_MESSAGE_LENGTH = 500;

// Private functions/variables - with underscore prefix
const _validateEmail = (email) => {};
```

### File Structure

```javascript
// Imports first
import React from 'react';
import { useEffect, useState } from 'react';
import api from '../utils/api';

// Then constants
const INTERESTS = ['Tech', 'Music'];

// Then component
const ComponentName = () => {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Effects
  }, []);
  
  const handleAction = () => {
    // Handler logic
  };
  
  return <div>JSX</div>;
};

// Export
export default ComponentName;
```

## Testing Guidelines

### What to Test

- API endpoints
- Authentication flows
- Database operations
- Complex business logic
- Edge cases
- Error handling

### Writing Tests

```javascript
// Example test
describe('Chat API', () => {
  it('should save message successfully', async () => {
    const response = await chatAPI.saveMessage({
      chatId: '123',
      messageText: 'Hello'
    });
    
    expect(response.status).toBe(201);
    expect(response.data.message.messageText).toBe('Hello');
  });
  
  it('should flag harmful content', async () => {
    const response = await chatAPI.saveMessage({
      chatId: '123',
      messageText: 'Some harmful content'
    });
    
    expect(response.data.moderation.isSafe).toBe(false);
  });
});
```

## Pull Request Process

1. **Update your branch** with latest main
2. **Write clear PR description**
3. **Link related issues**
4. **Ensure tests pass**
5. **Request review** from maintainers
6. **Address feedback**
7. **Squash commits** if requested
8. **Merge** when approved

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation

## Related Issues
Fixes #issue_number

## Testing
Describe testing done

## Screenshots
Add if UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
```

## Documentation

- Update README.md for major changes
- Add JSDoc comments for functions
- Update API documentation
- Add examples for new features
- Keep CHANGELOG.md updated

### Comment Style

```javascript
/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 * @example
 * validateEmail('user@example.com') // true
 */
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

## Performance Guidelines

- Minimize bundle size
- Optimize database queries
- Use pagination for large datasets
- Lazy load components
- Cache API responses where appropriate
- Debounce search and typing events
- Use keys in React lists

## Security Guidelines

- Never commit secrets or API keys
- Validate all inputs
- Sanitize user data
- Use environment variables
- Follow OWASP best practices
- Report security issues privately
- Keep dependencies updated

## Adding New Dependencies

Before adding a package:

1. Check if it's necessary
2. Check size and performance impact
3. Verify maintenance and community
4. Update both package.json files if needed
5. Document why it's needed

```bash
# Add to backend
cd backend
npm install package-name

# Add to frontend
cd frontend
npm install package-name
```

## Common Tasks

### Adding a New API Endpoint

1. **Create route** in `routes/`
2. **Implement controller** in `controllers/`
3. **Add Mongoose model** or use existing in `models/`
4. **Document API** in API_TESTING.md
5. **Create frontend API call** in `utils/api.js`
6. **Add tests**
7. **Update README** if needed

### Adding a New Page

1. **Create page component** in `pages/`
2. **Add route** in `App.jsx`
3. **Create navigation** if needed
4. **Style with CSS**
5. **Add form validation**
6. **Implement API calls**
7. **Add tests**

### Fixing a Bug

1. **Create issue** if not exists
2. **Reproduce bug**
3. **Fix in code**
4. **Write test** to prevent regression
5. **Update CHANGELOG**
6. **Create PR**

## Reporting Issues

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce

**Expected behavior**
What should happen

**Actual behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Node version: [e.g., 16.0]
- Browser: [e.g., Chrome]

**Additional context**
Any other relevant info
```

### Feature Request Template

```markdown
**Description**
Clear description of feature

**Use Case**
Why is this needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other options?

**Additional Context**
Any other info
```

## Code Review Guidelines

### For Reviewers

- Check for code quality
- Verify tests are adequate
- Ensure documentation is updated
- Look for security issues
- Test the changes locally
- Provide constructive feedback
- Approve or request changes

### For Authors

- Be open to feedback
- Respond to all comments
- Make requested changes
- Push updates to same branch
- Re-request review when ready

## Branching Strategy

```
main (stable)
  ├── develop (integration)
  │   ├── feature/user-rating
  │   ├── feature/voice-calls
  │   ├── bugfix/socket-timeout
  │   └── docs/api-guide
```

## Release Process

1. Update version in package.json files
2. Update CHANGELOG.md
3. Create release branch
4. Tag release: `git tag v1.0.0`
5. Push tag: `git push origin v1.0.0`
6. Create GitHub release
7. Deploy to production

## Getting Help

- **Questions**: Ask in GitHub Discussions
- **Bugs**: Create an Issue
- **Security**: Email maintainers privately
- **Chat**: Join Discord (if exists)

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributor list
- Release notes

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [React Best Practices](https://react.dev/learn)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Socket.io Documentation](https://socket.io/docs/)

## Questions?

Feel free to reach out to maintainers or create a discussion!

Thank you for contributing to Connectly! 🙏
