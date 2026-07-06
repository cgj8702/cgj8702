# Momo Design System: Sakura Glass

## Brand Identity
Momo is an emotionally intelligent AI companion designed to reduce anxiety through serene, kawaii-inspired digital interaction. The brand personality is gentle, non-judgmental, and ethereal.

## Visual Language: Sakura Glass
The "Sakura Glass" aesthetic is a fusion of modern glassmorphism and traditional Japanese stationery influences.

### Core Principles
- **Transparency & Depth:** Layered translucent panels with high backdrop blur.
- **Organic Softness:** Extreme corner rounding (32px+) on all containers.
- **Tactile Details:** Subtle 1px inner borders to simulate glass edges.
- **Ethereal Motion:** Gentle, high-performance particle systems (falling sakura petals) and floating ambient animations.

## Design Tokens

### Theme Implementation
The system utilizes **CSS Custom Properties (Variables)** as the single source of truth, mapped directly into the Tailwind CSS configuration to ensure consistency across global styles and utility classes.

### Color Palette
- **Primary:** `--color-primary: #D98CB3` (Buttons, active states, brand emphasis)
- **Background Gradient:** `--color-bg-start: #FDFBFB` to `--color-bg-end: #F3E8EE`
- **Surface (Glass):** `--color-surface: rgba(255, 255, 255, 0.45)` with `blur(16px)`
- **Surface Highlight:** `--color-surface-highlight: rgba(255, 255, 255, 0.8)` (Glass edges/inner borders)
- **Text (High Contrast):** `--color-text: #5A4B54` (Primary body and headings)
- **Text (Muted):** `--color-muted: #9CA3AF` (Secondary info, legal)
- **Accent:** `--color-accent: #F9C0D3` (Decorative elements, glowing effects)

### Typography
- **Headings:** `Zen Maru Gothic` (700 weight)
- **Subheadings:** `Zen Maru Gothic` (500 weight)
- **Body:** `Nunito` (400 weight)
- **Interface/Buttons:** `Zen Maru Gothic` (700 weight)

### Spacing & Radius
- **Radius (Large):** `32px` (Cards, hero sections)
- **Radius (Pill):** `9999px` (Buttons, search bars)
- **Chat Bubbles:** 
    - Momo: `16px 16px 16px 4px`
    - User: `16px 16px 4px 16px`
- **Section Padding:** `120px` (Vertical breathing room)

## Technical Architecture

### Componentization (DRY)
To eliminate HTML duplication across multiple pages, the site uses a **Shared Component Model**:
- **Templates:** Navigation and Footer templates are stored as string constants within a `COMPONENTS` object in `script.js`.
- **Injection:** A `loadComponent` function dynamically injects these templates into designated placeholders (`#nav-placeholder`, `#footer-placeholder`) during the `DOMContentLoaded` event.
- **CORS Optimization:** Components are stored internally in JS rather than external HTML files to ensure seamless loading when served via `file://` protocol.

### Navigation State
The system programmatically tracks the current location using `window.location.pathname` and applies the `text-primary` class to the corresponding navigation link to provide a visual "active" indicator.

## Accessibility (a11y) Specifications

### Inclusive Interface
- **Screen Reader Support:** All form inputs utilize hidden `<label>` elements with the `.sr-only` class to provide context without compromising the visual minimalist design.
- **Semantic Imagery:** Decorative SVGs are marked with `aria-hidden="true"` to reduce noise for assistive technologies.
- **Dynamic Content:** The chat interface implements `role="log"` and `aria-live="polite"`, ensuring that new messages are announced to screen reader users in a non-disruptive manner.

## Motion Specifications
- **Background:** Vanilla JS particle system for falling sakura petals.
- **Petal Speed:** Fast descent (configured for energy and life).
- **Ambient Float:** Keyframe animations for Y-axis drifting on glass cards.
- **Interaction Flow:** Transition logic has been refactored from nested callbacks to an **Asynchronous Flow (`async/await`)**, ensuring predictable timing for loading states and success animations.