# Media Page Layout Structure

## Current Structure (After Implementation)

```
┌─────────────────────────────────────────────────┐
│          HERO SECTION                           │
│          "Stories & Moments"                    │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│     PHOTO GALLERY (3D DOME)                     │
│     Category: product                           │
│     Auto-rotates @ 0.1°/frame                   │
│     Draggable, clickable enlargement            │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│   WORKSHOP MOMENTS (CAROUSEL) ✨ NEW            │
│   Category: workshop                            │
│   Theme: LIGHT (Cream #EDD8B4)                  │
│   Auto-advance @ 5 seconds                      │
│   Navigation: Arrows + Dot indicators           │
│   Color: Dark text on cream background (YANG)  │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│   STUDIO & EVENTS (CAROUSEL) ✨ NEW             │
│   Category: studio                              │
│   Theme: DARK (Brown #442D1C)                   │
│   Auto-advance @ 5 seconds                      │
│   Navigation: Arrows + Dot indicators           │
│   Color: Cream text on dark background (YIN)   │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│     WHAT PEOPLE SAY (TESTIMONIALS)              │
│     Text testimonials carousel                  │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│     VIDEO STORIES                               │
│     Video testimonials grid                     │
└─────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────┐
│     CUSTOMER EXPERIENCES                        │
│     Experience cards with images                │
└─────────────────────────────────────────────────┘
```

## Color Harmony (Yin-Yang Philosophy)

```
YIN (Dark) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ YANG (Light)
    │                                                      │
    │                                                      │
Studio & Events ◄───────────────────────────────► Workshop Moments
Dark Brown #442D1C                              Cream #EDD8B4
Cream Text                                      Dark Text
Sophisticated                                   Warm & Welcoming
Elegant                                         Inviting

COMPLEMENTARY THEME: Creates visual harmony and balance
```

## Implementation Details

### New Component: ImageCarousel.jsx
```jsx
<ImageCarousel
  images={images}          // Array of {src, alt, caption}
  title="Section Title"    // Display header
  colorTheme="light"       // OR "dark" for yin-yang effect
/>
```

### API Integration
```javascript
// Fetches 3 separate gallery categories in parallel
axios.get('/api/media/gallery/', { params: { category: 'product' } })
axios.get('/api/media/gallery/', { params: { category: 'workshop' } })
axios.get('/api/media/gallery/', { params: { category: 'studio' } })
```

### Carousel Features
- **Auto-play**: 5-second intervals (slower than dome)
- **Pause on hover**: Stops animation when user hovers
- **Manual controls**: Previous/Next arrows
- **Dot navigation**: Click to jump to specific slide
- **Captions**: Optional image captions display as overlay
- **Responsive**: Adapts to mobile, tablet, desktop
- **Smooth transitions**: 0.8s crossfade between slides

## Admin Panel Flow

```
Django Admin (/admin/)
    ↓
Media Content → Gallery Images
    ↓
    ├─ Category: "Product Gallery" → DomeGallery
    ├─ Category: "Workshop Moments" → Light Carousel
    └─ Category: "Studio & Events" → Dark Carousel
    ↓
Upload image → Set category → Add caption → Activate
    ↓
Frontend automatically fetches & displays
```

## Files Changed

| File | Change | Purpose |
|------|--------|---------|
| `ImageCarousel.jsx` | ✨ NEW | Reusable carousel component |
| `ImageCarousel.css` | ✨ NEW | Yin-yang color theming & styling |
| `Media.jsx` | ✏️ UPDATED | Import carousel, fetch 3 categories, add 2 sections |
| `Media.css` | No change | Existing styles still apply |

## Backend Files (No Changes Needed)
- ✅ `media_content/models.py` - Already supports categories
- ✅ `media_content/admin.py` - Already configured
- ✅ `media_content/serializers.py` - Already has image_url
- ✅ `media_content/views.py` - Already has category filter
- ✅ `media_content/urls.py` - Already configured

## Visual Hierarchy

```
                    Photo Gallery
                  (3D Dome Product)
                          │
                    ───────┴───────
                   │               │
         Workshop Moments   Studio & Events
         (Light Carousel)   (Dark Carousel)
         ┌──────────────┐  ┌──────────────┐
         │ WARM & OPEN │  │ DARK & MOOD  │
         │ Easy viewing│  │ Sophisticated│
         │ Inviting    │  │ Professional │
         └──────────────┘  └──────────────┘
```

## Loading States
- Section only renders if category has images
- Gracefully hides empty categories
- No error messages, clean user experience

## Performance
- API calls run in parallel
- CSS animations (GPU accelerated)
- Auto-play stops during interaction
- Lazy loads images as needed
- Responsive images scale efficiently

## Responsive Design
- **Desktop** (1024+): 16:9 aspect, 50px buttons
- **Tablet** (768): 4:3 aspect, 40px buttons  
- **Mobile** (480): 3:2 aspect, 36px buttons

---

**Status**: ✅ COMPLETE & READY
**Backend Support**: ✅ Already configured
**Admin Ready**: ✅ Users can add images immediately
**Color Theme**: ✅ Yin-Yang complementary design
**Animation**: ✅ 5-second auto-advance (slower than dome)
