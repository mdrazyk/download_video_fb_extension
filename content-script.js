let videos;
const ELEMENT_ID = 'custom_context_menu_item';

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

const getVideoLink = htmlData => {
  const [sdUrl] = getFromBetween.get(htmlData, 'sd_src:"', '",hd_tag:"');
  const [hdUrl] = getFromBetween.get(htmlData, 'hd_src:"', '",sd_src:"');
  const [content] = getFromBetween.get(
    htmlData,
    '<meta property="og:video:secure_url" content="',
    '" />',
  );

  if (sdUrl || hdUrl) {
    return sdUrl || hdUrl;
  }

  const div = document.createElement('div');
  div.innerHTML = content;
  const decodedUrl = div.firstChild.nodeValue;
  return decodedUrl;
};

const downloadVideo = async videoLink => {
  const htmlData = await fetch(videoLink).then(data => data.text());
  const url = getVideoLink(htmlData);

  chrome.runtime.sendMessage({
    type: 'VIDEO_URLS',
    url,
  });
};

const getContextMenuContainers = () =>
  new Promise((resolve, reject) => {
    try {
      setTimeout(() => {
        const contextMenuContainers = document.querySelectorAll(
          'ul[role="menu"]',
        );
        resolve(contextMenuContainers);
      }, 10);
    } catch (error) {
      reject('Cannot find context menu container');
    }
  });

const createDownloadButtonElement = contextMenuContainers => {
  return new Promise((resolve, reject) => {
    try {
      for (const contextMenuContainer of contextMenuContainers) {
        const lastChild = contextMenuContainer.lastChild;
        const spanElement = lastChild.querySelector('[value]');
        const videoLink = spanElement && spanElement.getAttribute('value');

        const elementId = 'custom_context_menu_item';
        const customContextMenuItem = contextMenuContainer.querySelector(
          `#${elementId}`,
        );
        if (customContextMenuItem) {
          customContextMenuItem.remove();
        }

        const li = lastChild.cloneNode(true);

        li.id = ELEMENT_ID;
        li.lastChild.innerHTML = 'Download Video';
        li.onclick = () => {
          contextMenuContainer.parentNode.parentNode.parentNode.parentNode.classList.add(
            'hidden_elem',
          );

          downloadVideo(videoLink);
        };
        li.onmouseover = e => {
          e.target.style.backgroundColor = '#4262ae';
          e.target.style.color = '#ffffff';
          e.target.style.borderColor = '#2b487d';
        };
        li.onmouseout = e => {
          e.target.style.backgroundColor = '#ffffff';
          e.target.style.color = '#000000';
          e.target.style.borderColor = '#ffffff';
        };
        contextMenuContainer.appendChild(li);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const addContextMenuToVideo = async videos => {
  for (const video of videos) {
    video.oncontextmenu = async () => {
      try {
        const contextMenuContainers = await getContextMenuContainers();
        await createDownloadButtonElement(contextMenuContainers);
      } catch (error) {
        console.error('Something went wrong.', error);
      }
    };

    video.onplay = async () => {
      try {
        const contextMenuContainers = await getContextMenuContainers();
        await createDownloadButtonElement(contextMenuContainers);
      } catch (error) {
        console.error('Something went wrong.', error);
      }
    };
  }
};

(async () => {
  videos = document.getElementsByTagName('video');
  await addContextMenuToVideo(videos);
})();

window.addEventListener('scroll', async () => {
  videos = document.getElementsByTagName('video');
  await addContextMenuToVideo(videos);
});
