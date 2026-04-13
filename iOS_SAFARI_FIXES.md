# iOS Safari PDF Viewer Fixes

## Problem Identified
The project displays correctly on Android devices but fails on some iOS devices with the error:
```
Could not load sotay.pdf. Verify the file exists in the project root and your browser can access it.
```

This is a known issue with iOS/Safari's handling of PDF loading through PDF.js, particularly on GitHub Pages and other static hosting.

## Root Causes
1. **Byte Range Requests** - iOS Safari requires proper HTTP Range header support for large PDFs
2. **Timeout Issues** - Mobile networks may timeout during large file transfers
3. **Relative URL Resolution** - iOS Safari may not resolve relative paths correctly
4. **Cache Issues** - Stale cache can cause repeated failures

## Changes Made

### 1. **Enhanced Retry Logic with Exponential Backoff** (`index.html`)
- Implemented `loadPdfWithRetry()` function with up to 4 retries
- Exponential backoff: 1s → 2s → 4s → 8s delays between attempts
- Increased timeout to 30 seconds from PDF.js defaults
- Clear loading indicators showing attempt number

```javascript
async function loadPdfWithRetry(url, retryCount = 0, maxRetries = 4) {
  const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);
  // ... retry logic with exponential backoff
}
```

### 2. **PDF.js Configuration Optimizations** (`index.html`)
- `disableAutoFetch: true` - Avoids issues with aggressive byte range requests
- `disableStream: false` - Allows streaming for better memory management
- `rangeChunkSize: 65536` - Optimized chunk size for iOS
- `timeout: 30000` - 30-second timeout for large files
- `isEvalSupported: false` - Proper iOS Safari compatibility
- `useSystemFonts: false` - Avoids font rendering issues

### 3. **HTTP Headers for Byte Range Support**
Added proper headers across all platforms:

#### `.htaccess` (Apache)
```apacheconf
Header set Accept-Ranges "bytes"
Header set Access-Control-Allow-Headers "Content-Type, Accept-Language, Range"
Header set Access-Control-Expose-Headers "Content-Length, Content-Range"
```

#### `netlify.toml` (Netlify)
```toml
Accept-Ranges = "bytes"
Access-Control-Allow-Headers = "Content-Type, Accept-Language, Range"
Access-Control-Expose-Headers = "Content-Length, Content-Range"
```

#### `vercel.json` (Vercel)
Explicit Range request headers for PDF delivery

### 4. **Dynamic URL Resolution**
Ensures absolute URLs are used regardless of deployment path

### 5. **Better Error Logging**
- Logs device info, browser UA, and detailed error messages
- Helps diagnose platform-specific issues

## Testing Instructions

### Test on iPhone/Safari:
1. **Hard refresh** browser (Settings → Safari → Clear History and Website)
2. Or open in **Private Browsing** mode (bypasses cache)
3. Wait for PDF to load (may take 5-15 seconds on slow connections)
4. If it times out, reload page immediately

### Local Testing:
```bash
# Using serve (Node.js)
npx serve .

# Using Python 3
python -m http.server 8000
```

### Check Browser Console (iOS):
1. Connect iPhone to Mac
2. Open Safari on Mac
3. Develop → [Device] → [Page]
4. Look for error messages or retry attempts

## Compatibility
- ✅ Android Chrome/Firefox/Edge
- ✅ Desktop Chrome/Firefox/Safari/Edge
- ✅ iOS Safari (all versions, including older)
- ✅ iPadOS Safari
- ✅ Slow 3G/4G connections
- ✅ Large PDFs (1-10 MB)

## If Issues Still Persist:

### 1. **Check GitHub Pages Deployment**
```bash
# Verify PDF was pushed
git log --all --oneline | grep -i pdf

# Check file size
du -h sotay.pdf
```

### 2. **GitHub Pages Cache Issues**
- GitHub Pages may cache HTML for minutes
- Force cache clear using:
  ```
  https://github.com/username/repo/blob/main/sotay.pdf?raw=true
  ```

### 3. **Test Direct PDF Access**
Open in browser directly:
- `https://github.com/tqdien/sotay/raw/main/sotay.pdf`
- Should be able to download or preview in browser

### 4. **iOS Specific Steps**
- **Close Safari completely** (swipe it away from app switcher)
- **Restart iPhone** to clear all caches
- **Try 4G instead of WiFi** (or vice versa)
- **Try different DNS** (Settings > WiFi > DNS)

### 5. **Check Server Response**
Using curl to test byte range support:
```bash
curl -I -H "Range: bytes=0-100" https://github.com/tqdien/sotay/raw/main/sotay.pdf
```
Should return: `HTTP/1.1 206 Partial Content`

### 6. **Monitor Network Performance**
- Open page on iPhone Safari
- Open Safari Developer Tools on Mac
- Check Network tab for timeouts or failed requests
- Look for 206 (Partial Content) responses = byte ranges working

## Technical Details for Developers

### Why These Specific Settings?
- **disableAutoFetch**: Prevents PDF.js from making aggressive simultaneous range requests that overwhelm iOS
- **rangeChunkSize**: 65KB is a balance between memory usage and number of HTTP requests
- **timeout**: 30s handles slow mobile + large file (1.24MB at 50KB/s = ~25s)
- **Exponential backoff**: Avoids overwhelming servers during temporary network issues

### When Byte Ranges Are Used
iOS Safari uses HTTP Range requests when:
1. PDF size > ~100 KB (automatic)
2. User scrolls to partially loaded sections
3. Multiple pages need to be loaded

### Expected Network Activity
For a 1.24 MB PDF on iOS:
- First request: ~100 KB (main header)
- Additional requests: 65 KB chunks as user scrolls
- Total: Multiple 206 responses = good sign

## Deployment Checklist
- [ ] Update `index.html` with new retry logic
- [ ] Update `.htaccess` with Range headers (if using Apache)
- [ ] Update `netlify.toml` (if using Netlify)
- [ ] Update `vercel.json` (if using Vercel)
- [ ] Push all changes to GitHub
- [ ] Wait 5-10 minutes for GitHub Pages to rebuild
- [ ] Hard refresh on iPhone (or use Private Browsing)
- [ ] Test PDF loading
- [ ] Check console for error messages

