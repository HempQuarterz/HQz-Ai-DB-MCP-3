# Hemp Database UI Components Export Guide

This guide will help you export just the UI components from your Industrial Hemp Database for use with a fresh Supabase setup.

## Step 1: Essential UI Components to Copy

### Layout Components
- `client/src/components/layout/navbar.tsx` - The navigation bar
- `client/src/components/layout/footer.tsx` - The page footer
- `client/src/components/layout/container.tsx` - Page container component (if exists)

### Home Page Components
- `client/src/components/home/hero.tsx` - Hero section
- `client/src/components/home/plant-type-cards.tsx` - Plant type showcase cards
- `client/src/components/home/stats-counter.tsx` - Statistics counter component

### Plant Components
- `client/src/components/plant/plant-part-selector.tsx` - Plant part selection UI
- `client/src/components/plant/plant-visualization.tsx` - Plant visualization component

### Product Components
- `client/src/components/product/product-card.tsx` - Product card display
- `client/src/components/product/product-detail.tsx` - Product detail view
- `client/src/components/product/industry-filter.tsx` - Industry filtering UI

### Research Components
- `client/src/components/research/research-paper-card.tsx` - Research paper card
- `client/src/components/research/research-paper-list.tsx` - Research papers list
- `client/src/components/research/research-paper-detail.tsx` - Research paper details

### Model Components
- `client/src/components/models/HempModelViewer.tsx` - 3D model viewer
- `client/src/components/models/SimpleHempModel.tsx` - Simplified hemp model

### UI Components
- Any shadcn UI components from `client/src/components/ui/`

## Step 2: Page Components to Export

- `client/src/pages/home.tsx` - Homepage
- `client/src/pages/plant-types.tsx` - Plant types page
- `client/src/pages/plant-type.tsx` - Individual plant type page
- `client/src/pages/plant-parts.tsx` - Plant parts listing
- `client/src/pages/plant-part.tsx` - Individual plant part page
- `client/src/pages/industries.tsx` - Industries showcase
- `client/src/pages/product-listing.tsx` - Product listing page
- `client/src/pages/product-detail.tsx` - Individual product page
- `client/src/pages/research.tsx` - Research papers page
- `client/src/pages/research-detail.tsx` - Individual research paper page
- `client/src/pages/not-found.tsx` - 404 page

## Step 3: Styling and Assets

Make sure to copy these styling elements:

- `client/src/index.css` - Main CSS file with Tailwind imports
- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration

### Assets to Copy
- Attached assets:
  - `attached_assets/Circle Logo.png` - Logo
  - `attached_assets/matrixrain.gif` - Matrix background animation
  - `attached_assets/SweetLeaf.ttf` - Custom font
  - Any other images used in the UI

## Step 4: Utility Files

These utility files are important for the UI functionality:

- `client/src/lib/utils.ts` - Utility functions
- `client/src/hooks/use-mobile.tsx` - Mobile detection hook
- `client/src/hooks/use-toast.ts` - Toast notification system

## Step 5: Updating Component Imports

When moving components to your new project, you'll need to update imports:

1. Update paths to match your new project structure
2. Replace data-fetching hooks with the Supabase versions
3. Fix any broken asset references

Example of updating a component:

**Original:**
```tsx
import { usePlantTypes } from "@/hooks/use-plant-data";
```

**Updated:**
```tsx
import { usePlantTypes } from "../hooks/use-data";
```

## Step 6: Remove Backend-Specific Code

When copying components, remove any code that directly interacts with the old backend:

- Remove references to specific API endpoints
- Replace with calls to your Supabase hooks

## Step 7: Adapt Three.js Components

For the 3D model viewers:

1. Copy the Three.js component files
2. Ensure all dependencies are installed:
   ```
   npm install three @react-three/fiber @react-three/drei
   ```
3. Update model file paths to reference your new asset locations

## Step 8: Updating Component Style Classes

If you need to modify style classes:

1. Keep the existing Tailwind classes for consistency
2. Modify the theme colors in `tailwind.config.ts` if needed
3. Use the utilities from `utils.ts` for class name merging

## Final Checklist

Before finishing:

- [ ] Verify all necessary UI components are copied
- [ ] Check that all component imports are updated
- [ ] Ensure all assets are properly referenced
- [ ] Confirm styling is preserved
- [ ] Update data-fetching logic to use Supabase
- [ ] Test key UI interactions

This approach allows you to reuse the UI you've built while implementing a fresh database architecture with Supabase.