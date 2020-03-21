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

const downloadVideo = async videoLink => {
  const htmlData = await fetch(videoLink).then(data => data.text());
  const [sdUrl] = getFromBetween.get(htmlData, 'sd_src:"', '",hd_tag:"');
  const [hdUrl] = getFromBetween.get(htmlData, 'hd_src:"', '",sd_src:"');

  const url = hdUrl || sdUrl;

  chrome.runtime.sendMessage({
    type: 'VIDEO_URLS',
    url,
  });
};

const createDownloadVideoElement = ul => {
  const elementId = 'custom_context_menu_item';
  const customContextMenuItem = ul.querySelector(`#${elementId}`);
  if (customContextMenuItem) {
    ul.removeChild(customContextMenuItem);
  }
  const liElement = ul.lastElementChild;
  const spanElement = liElement.querySelector('[value]');
  const videoLink = spanElement.getAttribute('value');

  const lastChild = ul.lastChild;
  const li = lastChild.cloneNode(true);

  li.id = elementId;
  li.lastChild.innerHTML = 'Download Video';
  li.onclick = () => downloadVideo(videoLink);
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
      const ulListElements = Array.from(ulList);

      ulListElements.forEach(ul => createDownloadVideoElement(ul));
    });
  }
};

window.addEventListener('mousedown', event => {
  setTimeout(() => {
    const video = event.srcElement;
    if (video.nodeName === 'VIDEO') {
      video.onended = () =>
        setTimeout(() => createContextMenuElement(video), 30);
      createContextMenuElement();
    }
  });
});
