# VoltaGrid AI Frontend

A highly cohesive, hyper-premium SaaS landing page built for the **Next-Gen AI Platform Speed Run** competition. This repository showcases extreme frontend engineering, strict performance constraints, and a unique 3D sci-fi aesthetic that breaks away from generic AI templates.

## Features & Aesthetic

- **Immersive 3D Universe:** Features a full-screen, interactive Three.js WebGL particle background that persists seamlessly as you scroll and reacts to cursor movement.
- **True 3D Parallax DOM:** Custom JavaScript logic allows DOM elements (Bento grid nodes, Pricing cards) to physically tilt in 3D space (`rotateX`, `rotateY`) while internal contents pop out (`translateZ(30px)`) for a true glass-box parallax effect.
- **Hyper-Premium Sci-Fi UI:** Strips away generic glassmorphism in favor of deep pitch-black (`#030508`) panels, razor-thin glowing neon borders, and dynamic scanner HUDs.
- **Live Data Streams:** Custom CSS keyframe animations simulate continuous glowing data flowing through the Hero console pipelines and breathing neon pulses on the live metrics.
- **Silky Smooth 60FPS:** Designed with carefully managed `z-index`, hardware-accelerated transitions, and localized JavaScript listeners to eliminate any scroll lag or jank.

## Technical Constraints Met

This project strictly adheres to the competition's architectural constraints:
1. **Zero Global Re-renders:** The dynamic Pricing matrix utilizes local DOM node manipulation. Toggling currencies (USD/EUR/GBP) or billing cycles mathematically transforms the values *in place* within specific `[data-price-amount]` target nodes, completely avoiding virtual DOM reflows or framework-level state bubbling.
2. **Context Lock (Desktop to Mobile):** The active state seamlessly transfers from the grid selection on Desktop to an expanded accordion block on Mobile viewports without breaking user context.
3. **Micro-Interaction Budget:** All CSS entrance animations (`800ms`) and hover states (`100ms - 200ms`) obey the tight performance budgeting guidelines while maintaining buttery smooth easing curves (`cubic-bezier`).
4. **Vanilla DOM Mastery:** While Three.js is utilized for the background visual enhancement (as permitted), all layout, structural state, and DOM animations are engineered strictly with Vanilla JavaScript and CSS. No heavy UI libraries were harmed.

## Running Locally

To run this project locally, simply start a lightweight HTTP server:

```bash
# Using Node.js
node local-dev.js

# Or using Python 3
python -m http.server 4173
```

Then, open your browser and navigate to:
[http://127.0.0.1:4173](http://127.0.0.1:4173)