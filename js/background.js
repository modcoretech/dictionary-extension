chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "dictionaryLookup",
      title: "Look up '%s'",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "dictionaryLookup") {
      chrome.windows.create({
        url: `popup.html?word=${encodeURIComponent(info.selectionText)}`,
        type: "popup",
        width: 400,
        height: 600
      });
    }
  });