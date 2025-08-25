# Quick Installation Guide

## Install SubTrackr Chrome Extension

### Step 1: Prepare Your Backend
Make sure your SubTrackr backend is running on `http://localhost:5000`

### Step 2: Load the Extension in Chrome

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer mode** (toggle switch in top right)
3. **Click "Load unpacked"**
4. **Select the `chrome-extension` folder** from this project
5. **Pin the extension** to your toolbar (optional but recommended)

### Step 3: Test the Extension

1. **Click the extension icon** in your toolbar
2. **You should see the SubTrackr popup**
3. **If not logged in**, click "Open Login Page" to authenticate
4. **After login**, the extension will show your subscription data

### Step 4: Test Smart Detection

1. **Visit a subscription service** (e.g., netflix.com)
2. **Look for the blue floating button** in the bottom right
3. **Click it** to see detected services
4. **Add subscriptions** with one click

### Step 5: Test Context Menu

1. **Right-click anywhere** on a webpage
2. **Select "Add to SubTrackr"**
3. **Choose a service** or "Custom Subscription"

## Troubleshooting

### Extension Not Loading?
- Check Chrome's developer console for errors
- Verify all files are in the `chrome-extension` folder
- Ensure your backend is running on port 5000

### API Connection Errors?
- Verify backend is running: `http://localhost:5000`
- Check CORS settings in your backend
- Ensure authentication endpoints are working

### Need to Update API Endpoints?
```bash
# For development
npm run extension:dev

# For production
npm run extension:prod
```

## Next Steps

- **Customize the extension** by editing the files
- **Add your own subscription services** in `content.js`
- **Modify the UI** by editing `popup.css` and `popup.js`
- **Build for production** using `npm run extension:build`

## Support

If you encounter issues:
1. Check the main README.md for detailed troubleshooting
2. Verify your backend is working correctly
3. Check Chrome's extension developer tools
4. Review the console for JavaScript errors

---

**Happy subscription tracking! 🎉**

