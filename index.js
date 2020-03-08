const getURL = ({ url, requestId }) => {
  if (url.startsWith('https://video.fktw1-1.fna.fbcdn.net')) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'VIDEO_REQUEST',
        body: { url, requestId },
      });
    });
  }
};

// chrome.tabs.onMoved.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && tab.active) {
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//       chrome.tabs.sendMessage(tabs[0].id, { type: 'SEND_VIDEO_URL' });
//     });
//   }
// });

chrome.runtime.onMessage.addListener(async ({ videoUrl, type }) => {
  if (type === 'SEND_VIDEO_URL') {
    if (videoUrl) {
      const link = document.createElement('a');

      // fetch(videoUrl)
      //   .then(video => video.url)
      //   .then(downloadableUrl => {
      //     link.href = downloadableUrl;
      //     link.download = true;
      //     link.click();
      //     link.remove();
      //   });
    }
  }
});

// const onClickHandler = event => {
//   const { pageUrl } = event;
//   const url = pageUrl.replace('/www.', '/d.');

//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     chrome.tabs.sendMessage(tabs[0].id, { type: 'SEND_VIDEO_URL', url });
//   });
// };

// const contextMenuItem = {
//   id: 'videoDownloader',
//   title: 'Video Downloader',
//   contexts: ['all'],
// };

// chrome.contextMenus.create(contextMenuItem);
// chrome.contextMenus.onClicked.addListener(onClickHandler);

const onBeforeRequest = details => {
  if (details.url.startsWith('https://video.fktw1-1.fna.fbcdn.net')) {
    console.log('onBeforeRequest details', details);
  }
};
const onBeforeSendHeaders = details => {
  if (details.url.startsWith('https://video.fktw1-1.fna.fbcdn.net')) {
    console.log('onBeforeSendHeaders details', details);
  }
};
const onSendHeaders = details => {
  if (details.url.startsWith('https://video.fktw1-1.fna.fbcdn.net')) {
    console.log('onSendHeaders details', details);
  }
};
const onCompleted = details => {
  if (details.url.startsWith('https://video.fktw1-1.fna.fbcdn.net')) {
    console.log(
      'onCompleted details',
      details.url.slice(0, details.url.indexOf('&bytestart')),
    );
  }
};

chrome.webRequest.onBeforeRequest.addListener(getURL, {
  urls: ['<all_urls>'],
});

// chrome.webRequest.onBeforeRequest.addListener(
//   onBeforeRequest,
//   {
//     urls: ['<all_urls>'],
//   },
//   ['requestBody', 'extraHeaders'],
// );
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   onBeforeSendHeaders,
//   {
//     urls: ['<all_urls>'],
//   },
//   ['requestHeaders', 'extraHeaders'],
// );
// chrome.webRequest.onSendHeaders.addListener(
//   onSendHeaders,
//   {
//     urls: ['<all_urls>'],
//   },
//   ['requestHeaders', 'extraHeaders'],
// );
// chrome.webRequest.onCompleted.addListener(
//   onCompleted,
//   {
//     urls: ['<all_urls>'],
//   },
//   ['responseHeaders', 'extraHeaders'],
// );
