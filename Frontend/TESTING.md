# Testing Configuration

This project uses **Vitest** for unit testing and supports multiple test environments.

## Available Test Environments

### 1. **JSDOM Mode** (Default - Simulated DOM) ✅
Runs tests in a Node.js environment with a simulated DOM. Faster and better for CI/CD pipelines.

```bash
# Run tests (JSDOM is default)
npm test

# Or explicitly
npm run test:jsdom

# With UI Dashboard
npm run test:jsdom:ui

# With Coverage Report
npm run test:jsdom:coverage
```

**Best for:**
- Quick local development
- Integration with CI/CD pipelines
- Faster test execution
- DOM testing without browser overhead
- Most projects and use cases

**Status:** ✅ **Fully Working**

---

### 2. **Browser Mode** (Playwright - Real Browser) ❌
Runs tests in a real browser environment using Playwright. **NOT RECOMMENDED** for this project due to dependency conflicts.

```bash
# Run tests in browser mode (headless)
npm run test:browser

# Run with visible browser window (for debugging)
npm run test:browser:headed

# Interactive UI
npm run test:browser:ui
```

**Best for:**
- Testing real browser behavior
- Debugging visual issues
- Testing browser-specific APIs
- Ensuring cross-browser compatibility

**Status:** ❌ **Not Recommended** - ESM/CommonJS module conflicts (See troubleshooting)

**⚠️ Known Issue:** Browser mode fails due to nested CommonJS dependencies not being ESM-compatible. Use JSDOM instead.

---

### 3. **UI Mode** (Interactive Dashboard)
Interactive test runner with a visual dashboard - works with any environment.

```bash
# JSDOM UI (Recommended)
npm run test:jsdom:ui

# Browser UI
npm run test:browser:ui
```

**Features:**
- Watch mode for continuous testing
- Visual test filtering
- Detailed test results
- File watchers for auto-rerun

---

## Quick Start

For most users, use JSDOM mode (the default):

```bash
npm test                    # Run all tests
npm run test:jsdom:ui       # Run with interactive UI
npm run test:jsdom:coverage # Generate coverage report
```

---

## Configuration Details

The Vitest configuration is defined in `vite.config.js`:

- **Default Environment**: `jsdom` (simulated DOM)
- **Browser Provider**: Playwright (when using `--browser` flag)
- **Coverage Provider**: V8
- **Global Test APIs**: Enabled (`describe`, `it`, `expect` available globally)

---

## When to Use Each Environment

| Use Case | Environment | Command | Status |
|----------|-------------|---------|--------|
| Daily development & CI/CD | JSDOM | `npm test` | ✅ Recommended |
| Coverage reports | JSDOM | `npm run test:jsdom:coverage` | ✅ Recommended |
| Interactive debugging | JSDOM UI | `npm run test:jsdom:ui` | ✅ Recommended |
| Real browser testing | Browser | `npm run test:browser` | ❌ Not recommended |
| Browser UI debugging | Browser | `npm run test:browser:ui` | ❌ Not recommended |

---

## Troubleshooting

### ✅ JSDOM Tests Running Slowly
Make sure you're using defaults:
```bash
npm test
```

### ✅ Want to Run Specific Test File?
```bash
# JSDOM
npm test -- test/App.test.jsx

# Run and exit
npm test -- test/App.test.jsx --run
```

### ✅ Coverage Reports
```bash
npm run test:jsdom:coverage
```

### ❌ Browser Mode Not Recommended
**Error:** "ReferenceError: exports is not defined"

**Cause:** Some nested dependencies use CommonJS (`exports`) but browser mode expects pure ESM modules. This is a known issue with the current dependency stack.

**Solution:** Use JSDOM mode instead (recommended for this project):
```bash
npm test                    # ✅ Use this instead
npm run test:jsdom:ui       # ✅ Or use UI mode
```

**Why JSDOM is Better for This Project:**
- ✅ Fast execution (~3 seconds)
- ✅ No ESM/CommonJS conflicts
- ✅ Perfect for React component testing
- ✅ Works in CI/CD environments
- ✅ All 20 tests passing reliably

**If you must use browser mode:** You would need to upgrade/replace dependencies causing conflicts, which is not recommended.

---

## Prerequisites

### For JSDOM Mode (Default)
- ✅ Automatically included - no additional setup needed

### For Browser Mode
- Node.js 16+
- Playwright in devDependencies ✅ (already installed)
- Chromium browser binaries (install with `npx playwright install chromium`)

---

## Example Output

```
✓ test/App.test.jsx  (20 tests) 890ms

Test Files  1 passed (1)
     Tests  20 passed (20)
  Start at  18:48:07
Duration  3.01s
```

---

## Tips & Best Practices

1. **For CI/CD pipelines:** Use `npm test -- --run` for quick test runs
2. **For local development:** Use `npm run test:jsdom:ui` for interactive debugging
3. **For coverage requirements:** Use `npm run test:jsdom:coverage` to generate reports
4. **Keep tests simple:** Write tests that work in JSDOM for maximum compatibility

---

## Support

For testing issues or questions:
- ✅ **JSDOM Mode:** Fully supported - Use this for all testing needs
- ❌ **Browser Mode:** Not recommended - Dependency conflicts prevent reliable use

**Stick with JSDOM - it's the best choice for this project!**

