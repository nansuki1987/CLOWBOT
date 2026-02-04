# Documentation Index

Welcome to CLOWBOT! This index helps you find the right documentation for your needs.

## 🚀 Getting Started

### New User? Start Here!
1. **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
   - Step-by-step setup
   - Critical permission configuration
   - Quick verification checklist

2. **[README.md](README.md)** - Complete overview
   - What is CLOWBOT?
   - Full setup instructions
   - Architecture overview

## 🔧 Configuration

### Setting Up Permissions
3. **[PERMISSIONS.md](PERMISSIONS.md)** - Comprehensive permission guide
   - Detailed permission explanations
   - How to enable each permission
   - Best practices
   - Permission troubleshooting

### Configuration Files
4. **[.env.example](.env.example)** - Environment configuration template
   - All required variables
   - Optional settings
   - Security notes
   - Permission checklist

## 🐛 Troubleshooting

### Having Issues?
5. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common problems and solutions
   - Access denied error (cardkit:card:write)
   - Bot not responding
   - Streaming card failures
   - Step-by-step fixes

6. **[FAQ.md](FAQ.md)** - Frequently asked questions
   - General questions
   - Permission issues
   - Technical problems
   - Development tips

## 📊 Understanding the System

### Visual Guides
7. **[DIAGRAM.md](DIAGRAM.md)** - Visual flow diagrams
   - Error flow diagram
   - Permission request flow
   - Token scope comparison
   - Decision trees

## 🎯 Quick Reference by Task

### "I want to..."

#### Set up a new bot
→ Start with [QUICKSTART.md](QUICKSTART.md)

#### Fix "Access denied" error
→ Go to [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Section 1

#### Understand permission requirements
→ Read [PERMISSIONS.md](PERMISSIONS.md)

#### Configure environment variables
→ Copy [.env.example](.env.example) to `.env` and fill in values

#### Understand why streaming cards fail
→ Check [DIAGRAM.md](DIAGRAM.md) for visual explanation

#### Find answer to specific question
→ Browse [FAQ.md](FAQ.md)

#### Get complete documentation
→ Read [README.md](README.md)

## 📋 Documentation Statistics

| Document | Purpose | Lines | Key Topics |
|----------|---------|-------|------------|
| QUICKSTART.md | Fast setup | ~150 | Setup, permissions, verification |
| README.md | Overview | ~150 | Complete guide, architecture |
| PERMISSIONS.md | Permission details | ~260 | cardkit:card:write, best practices |
| TROUBLESHOOTING.md | Problem solving | ~190 | Errors, solutions, debugging |
| FAQ.md | Questions | ~290 | Common issues, tips |
| DIAGRAM.md | Visual guides | ~390 | Flows, diagrams, decision trees |
| .env.example | Configuration | ~110 | Environment, security |

**Total: ~1,540 lines of documentation**

## 🔑 Most Important Information

### Critical Permission Required
The `cardkit:card:write` permission is **REQUIRED** for CLOWBOT to function.

**Without it, you'll see:**
```
Failed to create streaming card: Access denied
```

**To enable it:**
1. Go to https://open.feishu.cn/app/
2. Navigate to Permissions & Scopes
3. Enable `cardkit:card:write`
4. Restart your application

**Detailed instructions:** [QUICKSTART.md](QUICKSTART.md) or [PERMISSIONS.md](PERMISSIONS.md)

## 🆘 Getting Help

### Support Resources
- **Quick issues**: Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) first
- **Permission problems**: See [PERMISSIONS.md](PERMISSIONS.md)
- **General questions**: Browse [FAQ.md](FAQ.md)
- **Feishu documentation**: https://open.feishu.cn/document/
- **Feishu support**: support@feishu.cn
- **GitHub Issues**: https://github.com/nansuki1987/CLOWBOT/issues

## 📝 Document Version History

- **Initial Release**: Complete documentation suite covering setup, permissions, and troubleshooting
- **Focus**: Resolving "Access denied" errors for streaming cards

## 🤝 Contributing

Found an error or want to improve the documentation?
- Open an issue on GitHub
- Submit a pull request
- Contact the maintainers

## 📜 License

Check the repository LICENSE file for licensing information.

---

**Quick Tip**: Bookmark this page! It's your navigation hub for all CLOWBOT documentation.
