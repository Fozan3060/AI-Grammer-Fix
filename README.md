# AI-Grammer-Fix
This is a Chrome extension which corrects the grammar of the text provided using Gemini AI.

## How to Use This Extension

### 1. Load the Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top right).
3. Click **Load unpacked**.
4. Select the entire project folder (the one containing `manifest.json`).

### 2. Set Up and Run the Backend Server
1. Open a terminal and navigate to the backend folder:
   ```sh
   cd ai-grammar-fix-backend
   ```
2. Install dependencies (if you haven't already):
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend folder with your Gemini API key:
   ```env
   GEMINI_API_KEY=your_real_gemini_api_key_here
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```
   You should see: `Server running on port 3001`

### 3. Use the Extension
- Click the extension icon in Chrome to open the popup, enter text, and click **Check Grammar**.
- Or, select text on any webpage, right-click, and choose **Fix Grammar** from the context menu.

---

**Note:**
- The backend server must be running for the extension to work.
- Your API key should be kept private in the `.env` file and never committed to version control.
