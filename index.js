let tabId = null;
chrome.tabs.query(
  { active: true, currentWindow: true },
  tabs => (tabId = tabs[0].id),
);

const getURL = ({ url, requestId }) => {
  if (url.startsWith('https://video.fktw1-1.fna.fbcdn.net')) {
    chrome.tabs.sendMessage(tabId, {
      type: 'VIDEO_REQUEST',
      body: { url, requestId },
    });
  }
};

chrome.runtime.onMessage.addListener(({ type, url }) => {
  if (type === 'VIDEO_URLS') {
    const link = document.createElement('a');
    fetch(url)
      .then(video => video.url)
      .then(downloadableUrl => {
        link.href = downloadableUrl;
        link.download = true;
        link.click();
        link.remove();
      });
  }
});
