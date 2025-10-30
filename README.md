# SPM Registry

The official package registry for [SPM (Skill Package Manager)](https://github.com/jamiethompson/spm).

## What is this?

This is a simple JSON index that powers `spm search` functionality. It helps Claude Code users discover and share skills.

## How to Add Your Package

1. **Publish your skill package** using SPM:
   ```bash
   cd your-skill-package
   spm init
   spm publish
   ```

2. **Fork this repository**

3. **Add your package to `index.json`**:
   ```json
   {
     "name": "your-package-name",
     "version": "1.0.0",
     "description": "Brief description of your skills",
     "author": "Your Name",
     "repository": "https://github.com/yourusername/your-repo.git",
     "keywords": ["relevant", "keywords"],
     "skills": ["skill-name-1", "skill-name-2"],
     "claudeCode": {
       "minVersion": "1.0.0"
     }
   }
   ```

4. **Submit a pull request**

## Guidelines

- Keep descriptions clear and concise (max 500 characters)
- Use relevant keywords for discoverability
- Ensure your repository is public and includes a proper `skill-package.json`
- Package names must be lowercase with hyphens only (e.g., `my-awesome-skills`)
- Test your package with `spm install` before submitting

## Package Requirements

Your skill package repository should include:
- `skill-package.json` - Package metadata
- One or more skill directories with `SKILL.md` files
- Clear documentation in a README

See [stripe-webhook-skills](https://github.com/jamiethompson/stripe-webhook-skills) for a complete example.

## Questions?

Open an issue on the [SPM repository](https://github.com/jamiethompson/spm).

---

Built with ❤️ by [Jamie Thompson](https://github.com/jamiethompson)
