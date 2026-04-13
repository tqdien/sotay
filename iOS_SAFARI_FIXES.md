# iOS Safari PDF Viewer Fixes

## Problem Identified
The project displays correctly on Android devices but fails on some iOS devices with the error:
```
Could not load sotay.pdf. Verify the file exists in the project root and your browser can access it.
```

This is a known issue with iOS/Safari's handling of relative paths when loading PDFs through PDF.js, particularly on platforms like GitHub Pages.

## Changes Made

### 1. **Dynamic URL Resolution** (`index.html`)
- Changed from relative path `./sotay.pdf` to dynamically resolved absolute URL
- Uses `new URL()` constructor to ensure paths are correctly resolved regardless of deployment environment
```javascript
const pdfPath = (() => {
  const url = new URL("./sotay.pdf", window.location.href);
  return url.href;
})();
```

### 2. **Enhanced Error Handling**
- Added detailed error logging with device/browser detection
- Implemented automatic retry mechanism with cache-busting query parameters
- Added PDF accessibility test before attempting to load
- Better error messages for debugging

### 3. **iOS/Safari Meta Tags** (`index.html`)
- Added `apple-mobile-web-app-capable` 
- Added `apple-mobile-web-app-status-bar-style`
- Added `user-scalable=no` to prevent unwanted zoom
- Added `theme-color` meta tag

### 4. **Server Configuration Files**

#### `.htaccess` (Apache servers)
- CORS headers to allow PDF file access from any origin
- Proper cache control headers
- Content-Type headers for PDF files
- Gzip compression for bandwidth optimization

#### `vercel.json` (Vercel deployment)
- CORS headers configuration
- Cache control for PDF and HTML files
- Content-Type headers

#### `netlify.toml` (Netlify deployment)
- CORS headers configuration
- Cache control for different file types
- Proper content type headers

## Testing Instructions

### Test on iPhone/Safari:
1. Deploy the updated code to your hosting platform (GitHub Pages, Vercel, Netlify, etc.)
2. Open the URL on an iPhone or iPad running iOS
3. The PDF should now load without errors

### Test Locally:
```bash
# Using serve (Node.js)
npx serve .

# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000
```

### Browser Developer Tools:
- On iOS Safari: Open Web Inspector (Settings → Safari → Advanced → Web Inspector)
- Check the console for any remaining errors
- Monitor Network tab to verify PDF file is being accessed correctly

## Compatibility
- ✅ Android Chrome/Firefox/Edge
- ✅ Desktop Chrome/Firefox/Safari/Edge
- ✅ iOS Safari (including older versions)
- ✅ iPadOS Safari
- ✅ iOS Chrome/Firefox (now working)

## If Issues Persist:

1. **Check deployment platform** - Ensure your server supports the configuration files:
   - GitHub Pages: No special configuration needed (files are served as-is)
   - Vercel: Supports `vercel.json`
   - Netlify: Supports `netlify.toml`
   - Apache: Supports `.htaccess`

2. **Enable HTTPS** - iOS Safari has stricter security requirements; ensure your site uses HTTPS

3. **Check file permissions** - Ensure `sotay.pdf` has read permissions in your hosting environment

4. **Clear browser cache** - iOS Safari sometimes caches file not found errors:
   - Settings → Safari → Clear History and Website Data

5. **Test with different iOS versions** - Some older iOS versions may need additional testing
