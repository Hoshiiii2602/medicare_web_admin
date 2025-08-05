# Medicare Web Admin

A React-based admin panel for clinic management system.

## Build Process

The project uses a custom build process to handle the `/admin` base path for Vercel deployment:

1. **Vite Build**: Creates the main build in `dist/`
2. **Postbuild Script**: 
   - Creates `dist/admin/` directory
   - Copies `index.html` and `assets/` to `dist/admin/`
   - Fixes asset paths from `/admin/assets/` to `./assets/`

## Deployment

The application is configured for deployment on Vercel with the following structure:

```
dist/
├── index.html          # Main entry point
├── assets/             # Main assets
└── admin/
    ├── index.html      # Admin entry point (with fixed asset paths)
    └── assets/         # Admin assets (copy of main assets)
```

## Configuration Files

- `vercel.json`: Vercel deployment configuration
- `public/_redirects`: SPA routing rules
- `scripts/fix-assets.js`: Asset path fixing script

## Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Access

- Development: `http://localhost:3000/admin`
- Production: `https://your-domain.vercel.app/admin`
