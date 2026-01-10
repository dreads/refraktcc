# Refrakt Custom Cuts

A beautiful, responsive photo gallery for showcasing gemstones, built as a static website for GitHub Pages. Perfect for gem cutters, jewelry makers, and collectors who want to display their work professionally.

## Live Site

View the live gallery at: **https://yourusername.github.io/gemcatalog/**

*(Replace `yourusername` with your GitHub username)*

## Features

- **Responsive Grid Layout** - Looks great on desktop, tablet, and mobile
- **Interactive Lightbox** - Click any gem to view full details and multiple photos
- **Image Gallery** - Support for multiple images per gemstone with thumbnail navigation
- **Search & Filter** - Find gems by species, color, origin, or cut name
- **Professional Design** - Clean, elegant aesthetic suitable for jewelry shoppers
- **Fast Loading** - Lazy-loaded images and optimized assets
- **Accessible** - Keyboard navigation, screen reader support, reduced motion support

## Project Structure

```
gemcatalog/
├── index.html              # Main gallery page
├── docs.html               # Documentation page
├── css/
│   └── style.css           # All styles including lightbox and responsive
├── js/
│   └── gallery.js          # Gallery logic, filtering, and lightbox
├── data/
│   └── gemstones.json      # Gemstone database (edit this to add gems)
├── images/
│   └── gems/
│       ├── sapphire-001/   # Each gem gets its own folder
│       │   ├── main.jpg    # Default/primary image
│       │   ├── side.jpg    # Additional angles
│       │   └── detail.jpg
│       ├── sapphire-002/
│       └── garnet-001/
├── scripts/
│   └── generate-thumbnails.sh  # Local thumbnail generation
├── .github/
│   └── workflows/
│       └── generate-thumbnails.yml  # Auto-generate thumbnails on push
└── README.md               # This file
```

## Adding New Gemstones

### Step 1: Create an Image Folder

Create a new folder in `images/gems/` for your gemstone:

```bash
mkdir images/gems/tourmaline-001
```

**Naming convention:** `{species}-{number}` (e.g., `sapphire-001`, `garnet-002`, `tourmaline-001`)

### Step 2: Add Photos

Copy your gemstone photos into the folder. You'll specify which images to use in the JSON file.

### Step 3: Edit gemstones.json

Open `data/gemstones.json` and add a new entry to the array:

```json
{
  "id": 4,
  "species": "Tourmaline",
  "color": "Blue-Green",
  "weightCarats": 2.15,
  "dimensions": "8.1x6.3x4.9mm",
  "outline": "Oval",
  "cutName": "Portuguese Cut",
  "sourceGeo": "Paraiba, Brazil",
  "isMined": true,
  "dateCut": "2024-11-15",
  "notes": "Exceptional neon blue-green color with electric glow. Eye-clean clarity with excellent light return.",
  "imagesPath": "images/gems/tourmaline-001",
  "defaultImage": "main.jpg",
  "additionalImages": ["side.jpg", "detail.jpg", "scale.jpg"],
  "price": 12500
}
```

### Field Reference

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique identifier (increment from last entry) |
| `species` | string | Gem species (Sapphire, Ruby, Garnet, etc.) |
| `color` | string | Primary color (Blue, Green, Pink, Padparadscha, etc.) |
| `weightCarats` | number | Weight in carats (decimal) |
| `dimensions` | string | Length x Width x Depth in mm |
| `outline` | string | Shape outline (Oval, Cushion, Round, Pear, Emerald, etc.) |
| `cutName` | string | Cut design name (Portuguese, Brilliant, Step Cut, etc.) |
| `sourceGeo` | string | Geographic origin (if natural) |
| `isMined` | boolean | `true` for natural, `false` for lab-created |
| `dateCut` | string | ISO date when cut (YYYY-MM-DD) |
| `notes` | string | Description, characteristics, certifications |
| `imagesPath` | string | Path to the gem's image folder |
| `defaultImage` | string | Filename of the primary/card image |
| `additionalImages` | array | Array of additional image/video filenames (.jpg, .png, .mp4, .webm, .mov) |
| `price` | number | Price in USD (whole number) |

### Using Google Sheets for Data Entry

For easier data entry with voice typing support:

1. **Import the template:**
   - Open [Google Sheets](https://sheets.google.com)
   - File → Import → Upload `gemstones-template.csv`

2. **Enter data with voice:**
   - Click a cell and press `Ctrl+Shift+S` (or Tools → Voice typing)
   - Speak your data, press Tab to move between fields
   - For `additionalImages`, separate filenames with `|` (pipe)
   - For `isMined`, use `TRUE` or `FALSE`

3. **Convert back to JSON:**
   ```bash
   # Download as CSV from Google Sheets (File → Download → CSV)
   # Save as gemstones-template.csv, then run:
   python3 csv-to-json.py gemstones-template.csv
   ```

## Adding Gem Photos & Videos

### Recommended Image Specifications

| Property | Recommendation |
|----------|----------------|
| **Format** | JPEG (.jpg) for photos, PNG for graphics |
| **Dimensions** | 1200x1200px or larger (square or 4:3 ratio) |
| **Quality** | 80-85% JPEG quality (balance of quality/size) |
| **File Size** | Under 500KB per image ideal |
| **Color Space** | sRGB for web compatibility |

### Video Support

The gallery supports short videos to showcase sparkle and fire:

| Property | Recommendation |
|----------|----------------|
| **Format** | MP4 (.mp4), WebM (.webm), MOV (.mov) |
| **Duration** | 5-15 seconds ideal |
| **Resolution** | 1080p or 720p |
| **File Size** | Under 10MB per video |

Videos play automatically with loop in the lightbox and show a play icon on thumbnails.

### Suggested Photo Angles

- **main.jpg** - Hero shot, face-up view showing brilliance
- **side.jpg** - Profile view showing depth and pavilion
- **back.jpg** - View of the pavilion/bottom
- **detail.jpg** - Macro shot showing inclusions or special features
- **scale.jpg** - Photo with size reference (ruler, coin, finger)
- **cert.jpg** - Certificate or grading report (if applicable)
- **sparkle.mp4** - Short video showing light play and fire

### Photo Tips

1. **Lighting** - Use diffused lighting to show color accurately
2. **Background** - Neutral gray or white works best
3. **Focus** - Ensure the table (top facet) is sharp
4. **Consistency** - Use similar lighting/angles across all gems

## Creating Thumbnails

The gallery automatically uses your full-size images for thumbnails. For optimal performance, 200px WebP thumbnails can be generated automatically.

### Automatic Thumbnail Generation (GitHub Action)

A GitHub Action automatically generates thumbnails when you push new images:

- **Trigger:** Push to `main` branch with new/changed images in `images/gems/`
- **Output:** 200px wide WebP thumbnails (e.g., `stone.jpg` → `stone-thumb.webp`)
- **Location:** Same folder as the original image

The action runs automatically and commits the generated thumbnails back to the repository.

### Local Thumbnail Generation

To generate thumbnails locally before pushing:

```bash
# Install ImageMagick (required)
brew install imagemagick  # macOS
sudo apt install imagemagick  # Ubuntu

# Generate thumbnails for new images
./scripts/generate-thumbnails.sh

# Regenerate all thumbnails
./scripts/generate-thumbnails.sh --force
```

### Manual Tools

**Command Line (ImageMagick):**
```bash
# Install ImageMagick
brew install imagemagick  # macOS
sudo apt install imagemagick  # Ubuntu

# Resize and optimize a single image
convert input.jpg -resize 1200x1200 -quality 85 output.jpg

# Batch process all images in a folder
for f in *.jpg; do convert "$f" -resize 1200x1200 -quality 85 "optimized_$f"; done
```

**GUI Applications:**
- **macOS:** Preview (built-in), ImageOptim (free)
- **Windows:** IrfanView (free), FastStone Photo Resizer
- **Online:** Squoosh.app, TinyPNG.com

### Recommended Sizes

| Use Case | Max Dimension | Quality |
|----------|---------------|---------|
| Main gallery images | 1200px | 85% |
| Lightbox images | 1600px | 85% |
| Thumbnails | 200px | 80% |

## Local Development

### Option 1: Python (Recommended)

Python 3 comes pre-installed on macOS and most Linux distributions.

```bash
# Navigate to project folder
cd gemcatalog

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Option 2: VS Code Live Server

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Open the project folder in VS Code
3. Right-click `index.html` → "Open with Live Server"
4. Browser opens automatically with live reload

### Option 3: Node.js

```bash
# Using npx (no install required)
npx serve

# Or install globally
npm install -g serve
serve
```

### Troubleshooting

**Images not loading?**
- Check file paths in `gemstones.json` match actual folder/file names
- Ensure you're running a local server (not opening `file://` directly)
- Check browser console (F12) for 404 errors

**JSON errors?**
- Validate your JSON at [jsonlint.com](https://jsonlint.com)
- Check for missing commas, quotes, or brackets
- Ensure `id` values are unique

## Deployment to GitHub Pages

### Initial Setup

1. Create a GitHub repository named `gemcatalog`
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/gemcatalog.git
   git push -u origin main
   ```
3. Enable GitHub Pages:
   - Go to repository **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
   - Click **Save**
4. Wait 1-2 minutes, then visit `https://yourusername.github.io/gemcatalog/`

### Updating the Site

After making changes locally:

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Add new tourmaline gemstone"

# Push to GitHub (triggers automatic deploy)
git push
```

Changes typically appear on the live site within 1-2 minutes.

### Quick Update Commands

```bash
# Add a new gem (after editing JSON and adding photos)
git add data/gemstones.json images/gems/
git commit -m "Add [gem name]"
git push

# Update gem details
git add data/gemstones.json
git commit -m "Update [gem name] details"
git push

# Add photos to existing gem
git add images/gems/[gem-folder]/
git commit -m "Add photos for [gem name]"
git push
```

## Future Enhancement Ideas

### Features
- [ ] **Sorting options** - Sort by price, weight, date added
- [ ] **Price range filter** - Slider to filter by price range
- [ ] **Favorites/wishlist** - Let visitors save favorites (localStorage)
- [ ] **Compare view** - Side-by-side gem comparison
- [ ] **Zoom on hover** - Magnifying glass effect on images
- [ ] **Video support** - Add video field for sparkle/fire demos
- [ ] **Certificate viewer** - Display GIA/AGL certificates inline
- [ ] **Social sharing** - Share individual gems to social media
- [ ] **Print view** - Printer-friendly gem detail pages

### Technical
- [ ] **Image optimization** - Automatic WebP conversion with fallbacks
- [ ] **Lazy thumbnail loading** - Load thumbnails only when lightbox opens
- [ ] **Search URL params** - Shareable filtered views via URL
- [ ] **PWA support** - Offline viewing capability
- [ ] **Analytics** - Track which gems get the most views
- [ ] **Contact form** - Inquiry form with gem ID pre-filled
- [ ] **Multi-language** - i18n support for international buyers
- [ ] **Dark mode** - Theme toggle for low-light viewing

### Content
- [ ] **Gem education pages** - Info about species, treatments, origins
- [ ] **Cut diagram library** - Technical diagrams of cut designs
- [ ] **Size comparison tool** - Visual carat weight reference
- [ ] **About page** - Cutter bio, workshop photos, process

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | Latest 2 versions |
| Firefox | Latest 2 versions |
| Safari | Latest 2 versions |
| Edge | Latest 2 versions |
| Mobile Safari | iOS 14+ |
| Chrome Android | Latest |

## License
Copyright Refraktiv Custom Cuts 2026
---

**Questions or issues?** Open an issue on GitHub or contact the repository owner.
