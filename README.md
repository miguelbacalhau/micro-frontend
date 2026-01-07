# micro-frontend

A micro-frontend toolkit for React applications that enables building, managing, and integrating multiple independent React applications as composable components.

## Overview

This toolkit provides:

- **React utilities** for creating and consuming micro-frontends
- **Vite plugins** for seamless development and production builds
- **Registry server** for dynamic micro-frontend discovery

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Host Application                         │
│                                                                 │
│   ┌──────────────────┐    ┌──────────────────┐                  │
│   │  microFrontend   │    │  microFrontend   │                  │
│   │   Host Plugin    │    │    Component     │                  │
│   └────────┬─────────┘    └────────┬─────────┘                  │
│            │                       │                            │
│            │ fetches manifest      │ mounts/unmounts            │
│            │ injects import maps   │                            │
└────────────┼───────────────────────┼────────────────────────────┘
             │                       │
             ▼                       ▼
┌────────────────────┐    ┌─────────────────────────────────────────┐
│  Registry Server   │    │           Remote Application            │
│   (port 15001)     │    │                                         │
│                    │    │   ┌─────────────────────────────────┐   │
│  GET /             │◄───┤   │  microFrontendRemote Plugin     │   │
│  POST /register/:n │    │   │                                 │   │
│                    │    │   │  - Registers MFEs on startup    │   │
└────────────────────┘    │   │  - Configures entry points      │   │
                          │   │  - Handles HMR                  │   │
                          │   └─────────────────────────────────┘   │
                          │                                         │
                          │   ┌─────────────┐  ┌─────────────┐      │
                          │   │  Entry A    │  │  Entry B    │      │
                          │   │  (widget)   │  │  (dashboard)│      │
                          │   └─────────────┘  └─────────────┘      │
                          └─────────────────────────────────────────┘
```

### Key Concepts

- **Micro-Frontend**: An independent React component with its own assets (JS/CSS) that can be mounted into any host application
- **Host Application**: The main application that consumes and renders micro-frontends
- **Remote Application**: A standalone application that exposes one or more micro-frontends
- **Entry Point**: A named export from a remote (a single remote can expose multiple entry points using `#` separator, e.g., `my-app#widget`)
- **Registry Server**: HTTP server that tracks available micro-frontends and their assets

## Installation

```bash
npm install micro-frontend
# or
yarn add micro-frontend
```

## Setup: Producer (Remote Application)

A producer is an application that exposes micro-frontends for other applications to consume.

### 1. Create your micro-frontend

```tsx
// src/widget.tsx
import { createMicroFrontend } from "micro-frontend/react";

type WidgetProps = {
  title: string;
  onAction: () => void;
};

function Widget({ title, onAction }: WidgetProps) {
  return (
    <div className="widget">
      <h2>{title}</h2>
      <button onClick={onAction}>Click me</button>
    </div>
  );
}

export default createMicroFrontend(Widget);
```

### 2. Configure Vite plugin

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { microFrontendRemote } from "micro-frontend/vite";

export default defineConfig({
  plugins: [
    react(),
    microFrontendRemote({
      name: "my-app",
      input: {
        widget: "./src/widget.tsx",
        dashboard: "./src/dashboard.tsx",
      },
      registerServerUrl: "http://localhost:15001",
    }),
  ],
});
```

### 3. Run the dev server

```bash
npm run dev
```

The plugin will:
- Start a registry server on port 15001
- Register all entry points with the registry
- Enable HMR for each entry point

## Setup: Consumer (Host Application)

A consumer is the main application that loads and renders micro-frontends.

### 1. Configure Vite plugin

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { microFrontendHost } from "micro-frontend/vite";

export default defineConfig({
  plugins: [
    react(),
    await microFrontendHost({
      registerServerUrl: "http://localhost:15001",
    }),
  ],
});
```

### 2. Import and use the micro-frontend

```tsx
// src/App.tsx
import { createComponent } from "micro-frontend/react";

// Import using the special ?micro-frontend suffix
// Format: "name#entry?micro-frontend"
import widget from "my-app#widget?micro-frontend";

// Create a React component from the micro-frontend
const Widget = createComponent(widget, "Widget");

function App() {
  return (
    <div>
      <h1>Host Application</h1>
      <Widget
        title="My Widget"
        onAction={() => console.log("clicked")}
      />
    </div>
  );
}
```

### Import Syntax

Micro-frontends are imported using a special syntax:

```ts
import mfe from "name#entry?micro-frontend";
```

- `name`: The name specified in the remote's `microFrontendRemote` config
- `entry`: The entry point key from the `input` object
- `?micro-frontend`: Required suffix that triggers the transform

## API Reference

### React Utilities

#### `createMicroFrontend<Props>(Component)`

Wraps a React component into a micro-frontend container with lifecycle methods.

```ts
import { createMicroFrontend } from "micro-frontend/react";

const mfe = createMicroFrontend(MyComponent);
// Returns: { mount, update, unmount }
```

**Returns:**
- `mount({ props, el })`: Mount the component into an HTML element
- `update({ props, el })`: Update props on an already mounted component
- `unmount({ el })`: Unmount and cleanup the component

#### `createComponent<Props>(microFrontend, name)`

Converts a micro-frontend back into a React component for use in JSX.

```ts
import { createComponent } from "micro-frontend/react";

const MyComponent = createComponent(mfe, "MyComponent");
// Use as: <MyComponent prop1="value" />
```

### Vite Plugins

#### `microFrontendRemote(config)`

Plugin for remote applications that expose micro-frontends.

```ts
microFrontendRemote({
  name: string;              // Unique name for this remote
  input: Record<string, string>;  // Entry points (name -> file path)
  registerServerUrl: string; // Registry server URL
})
```

#### `microFrontendHost(config)`

Plugin for host applications that consume micro-frontends.

```ts
await microFrontendHost({
  registerServerUrl: string; // Registry server URL
})
```

## Registry Server

The registry server is an HTTP server that manages micro-frontend discovery. It runs automatically during development when using `microFrontendRemote`.

### Endpoints

| Method | Endpoint          | Description                                             |
|--------|-------------------|---------------------------------------------------------|
| `GET`  | `/`               | Returns JSON manifest of all registered micro-frontends |
| `POST` | `/register/:name` | Register a new micro-frontend                           |

### Manifest Format

```json
{
  "my-app#widget": {
    "name": "widget",
    "assets": {
      "js": "http://localhost:5173/src/widget.tsx",
      "css": "http://localhost:5173/src/widget.css"
    }
  },
  "my-app#dashboard": {
    "name": "dashboard",
    "assets": {
      "js": "http://localhost:5173/src/dashboard.tsx"
    }
  }
}
```

### Default Port

The registry server runs on port **15001** by default during development.

### Registration Payload

```json
{
  "name": "widget",
  "assets": {
    "js": "http://localhost:5173/src/widget.tsx",
    "css": "http://localhost:5173/src/widget.css"
  }
}
```

## Example: Multiple Entry Points

A single remote can expose multiple micro-frontends:

```ts
// Remote: vite.config.ts
microFrontendRemote({
  name: "dashboard-suite",
  input: {
    header: "./src/components/Header.tsx",
    sidebar: "./src/components/Sidebar.tsx",
    analytics: "./src/components/Analytics.tsx",
  },
  registerServerUrl: "http://localhost:15001",
})
```

```tsx
// Host: App.tsx
import header from "dashboard-suite#header?micro-frontend";
import sidebar from "dashboard-suite#sidebar?micro-frontend";
import analytics from "dashboard-suite#analytics?micro-frontend";

const Header = createComponent(header, "Header");
const Sidebar = createComponent(sidebar, "Sidebar");
const Analytics = createComponent(analytics, "Analytics");
```

## Requirements

- Node.js 22+
- React 19+
- Vite 6+

## License

MIT
