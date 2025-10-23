# vue-form-generator Examples

These examples demonstrate how to use vue-form-generator with Vue 3 in a simple HTML environment.

## Requirements

- Build the library first: `yarn build`
- The examples use the built files from `dist/` directory

## Available Examples

### 1. Simple Example (`simple/`)

A basic form demonstrating core field types:
- Text input
- Password input
- Email input
- Checklist
- Checkbox

**How to run:**
```bash
# Build the library
cd ../..
yarn build

# Open the example
cd examples/simple
open index.html  # or double-click the file
```

### 2. Post Form Example (`post-form/`)

Demonstrates form submission with various field types:
- Text input with validation
- Password input
- Email input
- Select dropdown
- File upload
- Checkbox
- Submit button

The form submits to https://httpbin.org/post for testing.

**How to run:**
```bash
# Build the library
cd ../..
yarn build

# Open the example
cd examples/post-form
open index.html  # or double-click the file
```

## Technical Details

- Uses Vue 3.x via CDN (`unpkg.com/vue@3`)
- Uses vue-form-generator core bundle (`vfg-core.js`)
- Examples use Options API for simplicity
- No build tools required - just open the HTML files in a browser

## File Structure

```
examples/
├── README.md
├── simple/
│   ├── index.html    # HTML page with Vue 3 CDN
│   └── main.js       # Vue 3 app configuration
└── post-form/
    ├── index.html    # HTML page with Vue 3 CDN
    └── main.js       # Vue 3 app configuration with form submission
```

## Notes

- Make sure to build the library before opening the examples
- The examples load the built files from `../../dist/`
- Uses Vue 3 global build for browser environments
- All validation and form generation is done client-side
