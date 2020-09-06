let tabId = null;

const getFromBetween = {
  results: [],
  string: '',
  getFromBetween: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false;
    const SP = this.string.indexOf(sub1) + sub1.length;
    const string1 = this.string.substr(0, SP);
    const string2 = this.string.substr(SP);
    const TP = string1.length + string2.indexOf(sub2);
    return this.string.substring(SP, TP);
  },
  removeFromBetween: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0)
      return false;
    const removal = sub1 + this.getFromBetween(sub1, sub2) + sub2;
    this.string = this.string.replace(removal, '');
  },
  getAllResults: function (sub1, sub2) {
    if (this.string.indexOf(sub1) < 0 || this.string.indexOf(sub2) < 0) return;

    const result = this.getFromBetween(sub1, sub2);
    this.results.push(result);
    this.removeFromBetween(sub1, sub2);

    if (this.string.indexOf(sub1) > -1 && this.string.indexOf(sub2) > -1) {
      this.getAllResults(sub1, sub2);
    } else return;
  },
  get: function (string, sub1, sub2) {
    this.results = [];
    this.string = string;
    this.getAllResults(sub1, sub2);
    return this.results;
  },
};

chrome.tabs.query(
  { active: true, currentWindow: true },
  (tabs) => (tabId = tabs[0].id),
);

chrome.runtime.onMessage.addListener(({ type, url }) => {
  if (type === 'DOWNLOAD_VIDEO') {
    fetch(url)
      .then((data) => data.text())
      .then((htmlText) => {
        const [videoUrl] = getFromBetween.get(
          htmlText,
          'video_redirect/?src=',
          '&amp;',
        );

        const url = decodeURIComponent(videoUrl);

        // TODO wywalic setTimeout
        setTimeout(() => {
          chrome.downloads.download({ url });
        }, 1000);
      });
  }
});
