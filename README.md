# Eskele SMP website

React 19, Vite 8, and Tailwind CSS 4 landing page for Peaceful SMP (Java + Bedrock)
and Fabric Adventures (modded Java). Players choose a world, view its requirements,
and request access through Discord.

## Run locally on Windows

Use Node.js 22.18 or newer (the workspace currently has Node.js 24). From this folder:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open http://localhost:8443. If running inside Figma Make, its preview manages the dev
server for you. The exported Windows folder needs the command above when no server
is running. Dependencies must be installed first; registry access is required on a
fresh checkout. Do not commit `node_modules`, caches, or `dist`.

If Corepack cannot write its cache, use a workspace-local cache:

```powershell
$env:COREPACK_HOME = Join-Path (Get-Location) '.cache/corepack'
```

If your environment forces npm offline mode, enable downloads only in an environment
where network access is allowed:

```powershell
corepack pnpm install --frozen-lockfile --offline=false
```

## Validate and build

```powershell
corepack pnpm typecheck
corepack pnpm format:check
corepack pnpm build
corepack pnpm preview
```

The build typechecks the app and creates a static site in `dist`. It can be hosted on
any static hosting service. The Figma configuration and preview plugins are preserved.
Vite uses its native config loader so Windows native dependencies are loaded directly.
Node.js 22.18+ supports the TypeScript config without a separate transpiler. Restart
the dev server after changing site metadata in `.figma/make/site.json`.

## Site configuration

- `src/site-config.ts`: Discord invite, shared by every community/access link.
- `src/App.tsx`: World descriptions, hosting providers, supported editions, and content.
- `src/index.css`: Fonts, responsive layouts, and theme.
- `.figma/make/site.json`: Page title, description, language, and search indexing.

Server details are intentionally obtained from the community team. The site does not
authenticate members or securely distribute downloads; Discord handles the access
process. Do not put hosting credentials, private server keys, or tokens in client code.

## Before launch

1. Confirm that the Discord invite works and the community has clear rules and an
   access-request process for both worlds.
2. Publish the supported Minecraft version, Java address, Bedrock address/port, and
   Fabric modpack/version in the appropriate Discord channels.
3. Confirm the current hosting, crossplay, difficulty, and availability claims with
   the server operators. The network-updates link points to Discord; there is no live
   server-status integration.
4. Check the page and both dialogs on desktop and mobile. Verify Escape closes the
   dialog, Tab stays within it, focus returns to the server button, and all Discord
   links open the correct community.
5. Deploy `dist`, connect a domain, and enable search indexing by changing
   `robots.index` to `true` in `.figma/make/site.json` when ready for public launch.

The largest current asset is the 6.6 MB hero PNG. Converting it to WebP or AVIF is a
useful next optimization for mobile loading. Fonts currently load from Google Fonts.
