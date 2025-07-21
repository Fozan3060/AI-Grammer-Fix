/// <reference types="chrome" />

const checkButton = document.getElementById("checkButton") as HTMLButtonElement;
const inputTextArea = document.getElementById("inputText") as HTMLTextAreaElement;
const spinner = document.getElementById("spinner") as HTMLDivElement;
const buttonText = document.getElementById("buttonText") as HTMLSpanElement;
const loadingText = document.getElementById("loadingText") as HTMLSpanElement;
const outputDiv = document.getElementById("output") as HTMLDivElement;

checkButton.addEventListener("click", async () => {
  const inputText = inputTextArea.value;

  if (inputText.trim()) {
    checkButton.classList.add("loading");
    spinner.style.display = "inline-block";
    buttonText.style.display = "none";
    outputDiv.innerText = "";

    try {
      // Send message to background script to fix grammar
      chrome.runtime.sendMessage({ type: 'FIX_GRAMMAR', text: inputText }, (response) => {
        if (response && response.fixedText) {
          outputDiv.innerText = response.fixedText;
        } else {
          outputDiv.innerText = "An error occurred while fixing the grammar.";
        }
        checkButton.classList.remove("loading");
        spinner.style.display = "none";
        buttonText.style.display = "inline";
      });
    } catch (error) {
      outputDiv.innerText = "An error occurred while fixing the grammar.";
      checkButton.classList.remove("loading");
      spinner.style.display = "none";
      buttonText.style.display = "inline";
    }
  } else {
    outputDiv.innerText = "Please enter some text to fix.";
  }
});
