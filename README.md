# LinkFlow

> Keep your links, files, and meetings in flow.

LinkFlow is a Windows desktop productivity workspace designed for capturing and organizing the digital items people use every day. It replaces scattered Notepad entries, browser tabs, and clipboard history with one lightweight, visual workspace.

LinkFlow runs quietly in the background and provides a small floating capture widget inspired by modern desktop utilities. Users can save a link, file, folder, PDF, or meeting reference without leaving the application they are currently using.

## Why LinkFlow

Important information is often stored in temporary places: a browser tab, a text file, a chat message, or the Windows clipboard. These methods are fast, but they make information difficult to find later.

LinkFlow provides a focused capture flow:

1. Capture an item when it matters.
2. Keep the original link or local path.
3. Organize and revisit it when needed.

## Core Features

### Background Capture

LinkFlow remains available through the Windows system tray and a floating quick-capture widget. The application is designed to stay out of the way while remaining one shortcut away.

- Floating always-on-top widget
- System tray access
- Automatic startup with Windows
- Global shortcut support
- Animated capture and drag states

### Links And Clipboard Content

Users can copy a URL or text and save it directly to LinkFlow. Website references are stored locally so users can return to them without maintaining a separate notes file.

- URL capture
- Clipboard text capture
- Local reference storage
- Desktop save notifications

### Files And Folders

Files and folders can be dragged into the widget or selected with the file picker. LinkFlow stores the original local path instead of creating unnecessary duplicates.

- File capture
- Folder capture
- Drag-and-drop support
- Original-path preservation
- Local JSON storage

### Meetings And Reminders

Meeting links are part of the LinkFlow workflow. The planned meeting system will allow users to save meeting references, schedule events, and receive a reminder before the meeting begins.

- Meeting link organization
- Scheduled meeting references
- Ten-minute reminders
- Desktop notifications
- Direct meeting access

### Visual Product Experience

The LinkFlow interface uses a calm, focused visual language that combines:

- Deep charcoal surfaces
- Lime action accents
- Warm neutral backgrounds
- Rounded floating controls
- Lucide interface icons
- Lightweight motion and feedback

The landing page and desktop application share the same logo, colors, interaction language, and product identity.

## Product Experience

### Floating Widget

The widget is the primary quick-capture surface. It stays available in the background and supports direct interaction with the clipboard, file system, and drag-and-drop content.

### System Tray

The tray menu provides access to the main background controls:

- Open quick capture
- Show the LinkFlow widget
- Hide the LinkFlow widget
- View upcoming meetings
- Quit LinkFlow

### Local-First Design

LinkFlow is designed around local references and local storage. The application does not need to upload a user's files to provide the core capture experience.

Local paths can become unavailable when files are moved or renamed. A future path-recovery experience will help users reconnect unavailable files.

## Technology

- **Desktop platform:** Electron
- **Desktop runtime:** JavaScript and Electron IPC
- **Landing page:** HTML and Tailwind CSS
- **Icons:** Lucide Icons
- **Local storage:** JSON application data
- **Installer:** electron-builder and NSIS
- **Updates:** electron-updater with GitHub Releases
- **Automation:** GitHub Actions

## Repository Structure

```text
LinkFLow/
├── .github/workflows/       Release automation
├── assets/                  Shared application branding
├── desktop/                 Electron desktop application
├── landing/                 Product landing page
├── scripts/                 Icon and installer utilities
├── package.json             Project configuration
└── README.md                Product documentation
```

## Release And Update Model

LinkFlow uses versioned GitHub Releases for distribution. Each application version is published as a separate Windows installer rather than replacing an existing release file.

Packaged applications can check GitHub Releases for newer versions, download an update, notify the user, and install it after restart.

This approach keeps the public download flow simple while allowing the desktop product to evolve over time.

## Security And Trust

Early Windows installers may display a SmartScreen message such as “This file isn't commonly downloaded.” This is expected for a new, unsigned application and is separate from the product functionality.

For public distribution, LinkFlow should use a trusted Windows code-signing certificate. Code signing helps verify the publisher and improves user confidence during installation.

The application should never ask users to disable Windows security features.

## Roadmap

### Current Foundation

- Windows background application
- Floating capture widget
- System tray integration
- Global shortcut
- Clipboard capture
- File and folder capture
- Drag-and-drop capture
- Local item storage
- Branded installer
- Landing page and release foundation

### Next Product Layer

- Full saved-items dashboard
- Collections and tags
- Search across captured content
- Website and PDF previews
- Meeting scheduling
- Ten-minute meeting notifications
- Broken-path detection and relinking
- Settings for startup and notifications
- Improved accessibility and keyboard navigation

### Future Possibilities

- Browser extension
- Cloud synchronization
- Cross-device access
- AI-assisted organization
- Mobile companion application
- Team workspaces

## Project Status

LinkFlow is an early-stage MVP focused on validating the quick-capture workflow and background desktop experience. The current foundation establishes the core interaction model, visual identity, Windows packaging, and release direction.

## License

No open-source license has been selected yet. A license should be added before public code distribution.
