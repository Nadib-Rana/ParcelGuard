# ParcelGuard — Architecture & Guidelines

React + TypeScript + Vite + Tailwind CSS v4 logistics & courier fraud prevention platform.

## Development Server

Vite development server runs locally on `$PORT` (default 8443 or 5173).

- Preview URL: Access the running app through the browser or preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application router and layout mounting
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `src/context/DataContext.tsx` - Centralized state store for parcels, customers, settlements, and couriers
- `src/components/` - Modular UI widgets, drawers, modals, and step components
- `src/pages/` - Application view routes (Dashboard, FraudChecker, Parcels, BookParcel, BulkLabels, BulkUpload, Tracking, Payments, etc.)
- `src/types/` - Shared TypeScript interfaces and domain models
- `src/utils/` - Utility algorithms for CSV export, parsing, and dynamic fraud risk scoring
- `index.html` - Clean standard HTML entry shell
- `package.json` - Project dependencies and scripts
- `vite.config.ts` - Vite configuration with React and Tailwind CSS v4 plugins plus `@` alias for `src`

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Charts & Icons: Lucide React & Recharts
