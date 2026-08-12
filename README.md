# LinkFlow

LinkFlow is a Windows-first quick capture workspace for links, files, folders, and meetings.

## Landing page

Run `npm install`, then `npm run dev:landing`, and open `http://localhost:4173`. The download buttons point to `landing/downloads/LinkFlow-Setup.exe`.

Build the Tailwind stylesheet with `npm run build:landing`. The current visual CSS is preserved exactly; Tailwind is configured for new landing-page components without changing this approved UI.

## Desktop MVP

Run `npm install`, then `npm run dev:desktop`. Press `Ctrl + Shift + L` to show the floating capture widget. Build and copy the Windows installer with `powershell -ExecutionPolicy Bypass -File .\scripts\build-installer.ps1`.

The current shell provides the tray menu, global shortcut, floating widget, and notification placeholder. Storage, previews, drag/drop persistence, and meeting scheduling are the next implementation layer.

The installer must exist at `landing/downloads/LinkFlow-Setup.exe` before the landing-page download button can work. The build script creates that folder, builds the `.exe`, and copies the first generated installer using that exact filename. The web/tray logo is SVG; Windows installer branding currently uses electron-builder's default icon because Windows requires an `.ico` file.

## Windows Trust

The installer is currently unsigned, so Edge and Windows SmartScreen may show an "isn't commonly downloaded" warning. This is not caused by the landing page. To remove that warning for real users, purchase a code-signing certificate from a trusted Windows certificate authority, store the certificate securely, and build with signing variables such as `CSC_LINK` and `CSC_KEY_PASSWORD`. Microsoft reputation also improves after legitimate downloads and installs. Do not disable Windows security or claim the unsigned installer is trusted.

## GitHub Releases And Updates

1. Create a GitHub repository named `LinkFLow` and replace `YOUR_GITHUB_USERNAME` in `package.json` and `desktop/electron-builder.json` with your username.
2. Install and test locally:

```powershell
npm install
npm run dev:desktop
```

3. Initialize and push the source code:

```powershell
git init
git add .
git commit -m "Build LinkFlow desktop MVP"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/LinkFLow.git
git push -u origin main
```

4. Create a release by tagging a version. The GitHub Action in `.github/workflows/release.yml` builds the Windows installer and attaches it to the release:

```powershell
git tag v0.1.0
git push origin v0.1.0
```

5. For later updates, change the version in `package.json`, commit, and push another tag:

```powershell
npm version patch
git push origin main --follow-tags
```

Installed packaged apps check GitHub Releases and notify users when a new version is downloaded. They must restart LinkFlow for the update to install. Do not replace an installer file manually; publish a new version tag.
