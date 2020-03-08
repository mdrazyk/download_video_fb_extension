const getFromBetween = {
  results: [],
  string: '',
  getFromBetween: function(sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false;
    const SP = this.string.indexOf(sub1) + sub1.length;
    const string1 = this.string.substr(0, SP);
    const string2 = this.string.substr(SP);
    const TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP, TP);
  },
  removeFromBetween: function(sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false;
    const removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
    this.string = this.string.replace(removal, '');
  },
  getAllResults: function(sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

    const result = this.getFromBetween(sub1, sub2);
    this.results.push(result);
    this.removeFromBetween(sub1, sub2);

    if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1, sub2);
    } else return;
  },
  get: function(string, sub1, sub2) {
    this.results = [];
    this.string = string;
    this.getAllResults(sub1, sub2);
    return this.results;
  },
};

let videoRequests = [];

// const getHtmlContent = ({ html, start, end }) => {
//   const spliStart = html.indexOf(start) + start.length;
//   const splitEnd = html.indexOf(end);
//   return html.slice(spliStart, splitEnd);
// };

// const getVideoDataFromHtml = html => {
//   const hdUrl = getHtmlContent({
//     html,
//     start: 'hd_src:"',
//     end: '",sd_src:"',
//   });
//   const sdUrl = getHtmlContent({
//     html,
//     start: 'sd_src:"',
//     end: '",hd_tag:"',
//   });

//   return {
//     hdUrl: hdUrl && hdUrl.startsWith('https://') ? hdUrl : null,
//     sdUrl: sdUrl && sdUrl.startsWith('https://') ? sdUrl : null,
//   };
// };

const downloadVideo = async () => {
  const htmlData = await fetch(window.location.href).then(data => data.text());

  const allUrls = getFromBetween.get(htmlData, 'sd_src:"', '",hd_tag:"');
  console.log('allUrls', allUrls);

  // const videoData = getVideoDataFromHtml(htmlData);

  // const { sdUrl, hdUrl } = videoData;
  // const videoUrl = hdUrl ? hdUrl : sdUrl;

  // console.log('htmlData', htmlData);

  // chrome.runtime.sendMessage({ videoUrl, type: 'SEND_VIDEO_URL' });
};

const createDownloadVideoElement = ul => {
  const elementId = 'custom_context_menu_item';
  const customContextMenuItem = ul.querySelector(`#${elementId}`);

  if (customContextMenuItem) {
    ul.removeChild(customContextMenuItem);
  }

  const lastChild = ul.lastChild;
  const li = lastChild.cloneNode(true);

  li.id = elementId;
  li.lastChild.innerHTML = 'Download Video';
  li.onclick = downloadVideo;
  li.onmouseover = e => (e.target.style.backgroundColor = '#ff0000');
  li.onmouseout = e => (e.target.style.backgroundColor = '#ECF3FF');
  ul.appendChild(li);
};

const createContextMenuElement = () => {
  const contextMenu = document.getElementsByClassName(
    'uiContextualLayer uiContextualLayerBelowLeft',
  );

  if (Array.from(contextMenu).length) {
    Array.from(contextMenu).forEach(child => {
      const ulList = child.getElementsByTagName('ul');
      Array.from(ulList).forEach(ul => createDownloadVideoElement(ul));
    });
  }
};

window.addEventListener('mousedown', event => {
  setTimeout(() => {
    const element = event.srcElement;
    if (element.nodeName === 'VIDEO') {
      element.onended = () => setTimeout(() => createContextMenuElement(), 30);
      createContextMenuElement();
    }
  });
});

chrome.runtime.onMessage.addListener(async ({ type, body }) => {
  if (type === 'VIDEO_REQUEST') {
    videoRequests.push(body);
    const url = body.url.slice(0, body.url.indexOf('&bytestart'));
    // console.log('url', url);
  }
});
