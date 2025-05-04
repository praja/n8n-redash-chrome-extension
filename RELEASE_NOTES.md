# Release Notes - Version 0.1.1

## Changes
- Reorganized project structure for better maintainability
- Moved all extension files into an `extension` directory
- Updated README with new directory structure
- Improved installation instructions

## Directory Structure
```
.
├── extension/              # Chrome extension files
│   ├── content.js         # Main extension logic
│   ├── popup.html         # Settings interface HTML
│   ├── popup.js           # Settings interface logic
│   ├── config.js          # Configuration management
│   ├── styles.css         # UI styling
│   ├── manifest.json      # Extension manifest
│   ├── background.js      # Background script
│   └── marked.min.js      # Markdown rendering library
├── README.md              # Project documentation
└── LICENSE                # Apache 2.0 License
```

## Installation
When loading the unpacked extension, make sure to select the `extension` directory instead of the root directory. 