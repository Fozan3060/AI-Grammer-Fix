/// <reference types="chrome" />

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "fixGrammar",
    title: "Fix Grammar",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "fixGrammar" && info.selectionText && tab?.id) {
    const fixedText = await fixGrammarWithBackend(info.selectionText);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        document.getElementById("aiGrammarPopup")?.remove();
        const popup = document.createElement("div");
        popup.id = "aiGrammarPopup";
        popup.innerText = text;
        document.body.appendChild(popup);
        const closeButton = document.createElement("button");
        closeButton.innerHTML = "&times;";
        Object.assign(closeButton.style, {
          position: "absolute",
          top: "6px",
          right: "6px",
          border: "none",
          background: "none",
          color: "#888",
          fontSize: "18px",
          cursor: "pointer"
        });
        closeButton.addEventListener("click", () => {
          popup.remove();
        });
        popup.appendChild(closeButton);
        Object.assign(popup.style, {
          position: "absolute",
          backgroundColor: "#fff",
          color: "#333",
          padding: "12px 16px",
          borderRadius: "8px",
          boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
          zIndex: "10000",
          maxWidth: "300px",
          wordWrap: "break-word",
          border: "1px solid #e0e0e0",
          fontFamily: "'Roboto', sans-serif",
          fontSize: "14px",
          lineHeight: "1.5",
          maxHeight: "300px",
          overflowY: "auto"
        });
        let closeTimeout: number | undefined;
        popup.addEventListener("mouseenter", () => {
          clearTimeout(closeTimeout);
        });
        popup.addEventListener("mouseleave", () => {
          closeTimeout = window.setTimeout(() => popup.remove(), 5000);
        });
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        document.body.appendChild(popup);
        const popupHeight = popup.offsetHeight;
        const popupWidth = popup.offsetWidth;
        document.body.removeChild(popup);
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        if (spaceBelow > popupHeight + 12) {
          popup.style.top = `${rect.bottom + window.scrollY + 12}px`;
        } else if (spaceAbove > popupHeight + 12) {
          popup.style.top = `${rect.top + window.scrollY - popupHeight - 12}px`;
        } else {
          popup.style.top = `${(viewportHeight - popupHeight) / 2 + window.scrollY}px`;
        }
        popup.style.left = `${(viewportWidth - popupWidth) / 2 + window.scrollX}px`;
        document.body.appendChild(popup);
        closeTimeout = window.setTimeout(() => popup.remove(), 5000);
      },
      args: [fixedText],
    });
  }
});

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FIX_GRAMMAR') {
    fixGrammarWithBackend(message.text)
      .then(fixedText => sendResponse({ fixedText }))
      .catch(() => sendResponse({ fixedText: 'An error occurred while fixing the grammar.' }));
    return true; // Indicates async response
  }
});

async function fixGrammarWithBackend(text: string) {
  try {
    const response = await fetch('http://localhost:3001/fix-grammar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.fixedText || 'No response received.';
  } catch (error) {
    console.error('Error fixing grammar:', error);
    return 'An error occurred while fixing the grammar.';
  }
}
