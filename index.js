let tabId = null;
chrome.tabs.query(
  { active: true, currentWindow: true },
  tabs => (tabId = tabs[0].id),
);

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
