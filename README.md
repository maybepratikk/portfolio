# Pratik Singh - Portfolio

A modern portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Inter Tight** - Custom font via next/font

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the portfolio.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
app/
  layout.tsx          # Root layout with font and metadata
  page.tsx            # Main portfolio page
  globals.css         # Global styles with CSS variables
components/
  PortfolioContent.tsx   # Main content component
  CopyEmail.tsx          # Copy-to-clipboard email component
  Footer.tsx             # Footer with social links
```

## Features

- Dark theme with scanline and vignette effects
- Smooth fade-in animations
- Copy-to-clipboard email functionality with tooltip
- Fully responsive design
- Accessibility support (prefers-reduced-motion)
- TypeScript for type safety
- Optimized fonts with next/font

## Customization

Update the content in:
- `components/PortfolioContent.tsx` - Main copy and client links
- `components/Footer.tsx` - Social links and email
- `app/globals.css` - Color variables and visual effects

## Phase 2: Micro-interactions (Planned)

Future enhancements will include:
- Framer Motion for advanced animations
- Staggered text reveals
- Magnetic cursor effects on links
- Parallax scroll effects
- Enhanced hover states

## Original Version

The original HTML version is saved as `portfolio_original.html` for reference.
