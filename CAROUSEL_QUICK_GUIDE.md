# Quick Start: Adding Images to Carousels

## 📸 Add Images Via Django Admin

### Step 1: Access Admin Panel
```
URL: http://127.0.0.1:8000/admin/
Username: chriz5992@gmail.com
Password: 1234
```

### Step 2: Navigate to Gallery Images
```
Admin Home → Media Content → Gallery Images → Add Gallery Image
```

### Step 3: Upload Image
1. Click "Choose File" under "Image"
2. Select your image from computer
3. It will show preview once uploaded

### Step 4: Add Caption (Optional)
- Enter text in "Caption" field
- This will display as overlay on carousel

### Step 5: Select Category
Choose one of:
- **"Product Gallery"** → Appears in 3D Dome (centerpiece)
- **"Workshop Moments"** → Appears in light carousel with cream background
- **"Studio & Events"** → Appears in dark carousel with brown background

### Step 6: Set Order
- Enter a number (1, 2, 3, etc.)
- Lower numbers appear first
- Can reorder anytime

### Step 7: Activate Image
- Check the "Is Active" checkbox
- Only active images display on site

### Step 8: Save
- Click "Save" button
- Image will appear on Media page in ~5-10 seconds (auto-refresh)

---

## 🎨 Color Themes Explained

### Workshop Moments (Light)
- **Background**: Warm cream (#EDD8B4)
- **Text**: Dark brown (#3d1a0a)
- **Feel**: Warm, welcoming, educational
- **Best For**: Candid workshop moments, happy participants, learning activities

### Studio & Events (Dark)
- **Background**: Deep brown (#442D1C)
- **Text**: Light cream (#EDD8B4)
- **Feel**: Professional, sophisticated, gallery-like
- **Best For**: Professional events, artistic shots, polished exhibitions

---

## 🔄 Carousel Features

### Auto-Play
- Advances to next image every 5 seconds
- Pauses when you hover over carousel
- Resumes when you move mouse away

### Manual Controls
- **← Arrow**: Go to previous image
- **→ Arrow**: Go to next image
- **Dots**: Click any dot to jump to that image

### Image Captions
- Display as text overlay in bottom-right
- Semi-transparent dark background
- Captions optional (leave blank if not needed)

---

## 📊 Current Status

### Product Gallery (Dome)
- Location: Top section
- Auto-rotation: Continuous (0.1°/frame)
- Interaction: Drag, click to enlarge
- Category: product

### Workshop Moments (Carousel) ✨ NEW
- Location: Below dome
- Auto-advance: Every 5 seconds
- Theme: Light/Warm
- Category: workshop

### Studio & Events (Carousel) ✨ NEW
- Location: Below workshops
- Auto-advance: Every 5 seconds
- Theme: Dark/Professional
- Category: studio

---

## 🛠️ Technical Details

### API Endpoints
```
GET /api/media/gallery/?category=product
GET /api/media/gallery/?category=workshop
GET /api/media/gallery/?category=studio
```

### Image Requirements
- Format: JPG, PNG, WebP
- Size: Recommended 1200x675px+ (16:9 aspect)
- Max file size: Django default (usually 5MB)
- Captions: Up to 255 characters

### Responsive Breakpoints
- **Desktop**: Full size, 16:9 ratio
- **Tablet**: Adjusted size, 4:3 ratio
- **Mobile**: Optimized size, 3:2 ratio

---

## 🚀 Advanced Tips

### Optimal Image Sizes by Use Case
- **Workshop Moments**: 1200×675px (horizontal, 16:9)
- **Studio & Events**: 1200×675px (horizontal, 16:9)
- **Product Gallery**: Square or rectangular (flexible)

### Caption Best Practices
- Keep short (1-2 sentences max)
- Describe what's happening in image
- Use present tense
- Examples:
  - "Participants learning traditional techniques"
  - "Studio entrance during evening exhibition"
  - "Handcrafting workshop in progress"

### Image Organization
- Use descriptive filenames: `workshop-moment-001.jpg`
- Keep similar images grouped
- Lower order numbers appear first
- Easy to reorder from admin later

### Troubleshooting
- **Image not showing?** Check if "Is Active" is checked
- **Old image still visible?** Clear browser cache (Ctrl+Shift+Delete)
- **Wrong order?** Update "Order" field and save
- **Need to remove?** Uncheck "Is Active" instead of deleting

---

## 📱 Mobile Experience

The carousels are fully responsive:
- Carousel shrinks to fit mobile screen
- Navigation arrows still visible
- Dot indicators responsive
- Captions scale appropriately
- Touch-friendly (works with swipes too)

---

## 🎬 Example Workflow

1. Take photos at workshop
2. Select best 3-5 images
3. Resize to 1200×675px
4. Log into admin: `/admin/`
5. Add 5 Gallery Images:
   - Category: "Workshop Moments"
   - Set Order: 1, 2, 3, 4, 5
   - Add captions describing moment
   - Activate each
6. Refresh Media page to see carousel
7. Perfect! Images now rotating every 5 seconds

---

## 📞 Support

If images aren't showing:
1. Check Django admin for image existence
2. Verify "Is Active" checkbox is checked
3. Confirm category is correct (workshop/studio)
4. Refresh browser (hard refresh: Ctrl+Shift+R)
5. Check browser console for errors (F12)

---

**Status**: Ready to use! Start adding images to make your Media page shine! ✨
