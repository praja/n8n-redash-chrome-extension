# Redash AI Query Generator

A Chrome extension that integrates AI-powered SQL query generation into Redash's query editor. This extension adds an AI assistant button to Redash's new query page, allowing users to generate SQL queries using natural language.

## Features

- 🤖 AI-powered SQL query generation
- 💬 Interactive chat interface
- 📋 Copy SQL queries with a single click
- 🔒 Secure authentication with n8n webhook
- 🎨 Modern UI with Ant Design styling
- 🔄 Real-time configuration updates

## Installation

1. Clone this repository:
```bash
git clone https://github.com/praja/n8n-redash-chrome-extension.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the `extension` directory from the cloned repository

## Configuration

1. Click the extension icon in Chrome to open the settings popup

2. Configure the following settings:
   - n8n Webhook URL: Your n8n webhook endpoint
   - n8n Username: Basic auth username (if required)
   - n8n Password: Basic auth password (if required)

3. Click "Save Settings" to apply the configuration

## Usage

1. Navigate to Redash's new query page (`/queries/new`)

2. Click the AI button (flash icon) in the query editor controls

3. Describe your query requirements in natural language

4. The AI will generate a SQL query based on your description

5. Click the copy button on any SQL code block to copy it to your clipboard

## Development

### Project Structure

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

### Dependencies

- [marked](https://github.com/markedjs/marked): Markdown rendering
- [Font Awesome](https://fontawesome.com/): Icons
- [Ant Design](https://ant.design/): UI components

## Security

- All credentials are stored securely in Chrome's sync storage
- Basic authentication is supported for n8n webhook endpoints
- No data is stored locally except for configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

The Apache License 2.0 is chosen because:
- It provides a good balance between permissiveness and protection
- It's widely used and well-understood in the open-source community
- It includes an express grant of patent rights
- It requires preservation of copyright and license notices
- It's compatible with most other open-source licenses

## Acknowledgments

- [Redash](https://redash.io/) for the amazing BI platform
- [n8n](https://n8n.io/) for workflow automation
- [Cursor AI](https://cursor.sh/) for development assistance 