const CONTEXT_MENU_ID = 'custom-context-menu';

let contextMenuOpen = false;
let linkToDownload = '';

const handleClick = async () => {
  const href = linkToDownload || window.location.href;
  const url = href.replace('www.', 'd.');

  chrome.runtime.sendMessage({
    type: 'DOWNLOAD_VIDEO',
    url,
  });
};

const createDownloadButton = () => {
  const button = document.createElement('button');

  // button props
  button.innerText = 'Download';

  // button style
  button.style.width = '100px';
  button.style.height = '30px';
  button.style.position = 'relative';
  button.style.top = '60px';
  button.style.left = '100px';

  // button handler
  button.onclick = handleClick;

  return button;
};

const createContextMenuElement = () => {
  const [body] = document.getElementsByTagName('body');

  const contextMenu = document.createElement('div');

  // context menu props
  contextMenu.setAttribute('id', CONTEXT_MENU_ID);

  // context menu style
  contextMenu.style.width = '300px';
  contextMenu.style.height = '150px';
  contextMenu.style.backgroundColor = 'white';
  contextMenu.style.top = '0px';
  contextMenu.style.left = '0px';
  contextMenu.style.position = 'fixed';
  contextMenu.style.display = 'none';

  contextMenu.appendChild(createDownloadButton());

  body.appendChild(contextMenu);
};

const openHideContextMenu = ({ xMousePosition, yMousePosition }) => {
  console.log('yMousePosition :', yMousePosition);
  console.log('xMousePosition :', xMousePosition);
  const contextMenu = document.getElementById(CONTEXT_MENU_ID);

  contextMenuOpen = !contextMenuOpen;

  contextMenu.style.display = contextMenuOpen ? 'flex' : 'none';
  contextMenu.style.top = `${yMousePosition}px`;
  contextMenu.style.left = `${xMousePosition}px`;
};

window.onload = () => {
  createContextMenuElement();
};

window.oncontextmenu = (event) => {
  const { x: xMousePosition, y: yMousePosition } = event;
  const videoLink = event.target.parentElement.querySelector(
    "[aria-label^='Enlarge']",
  );

  // event.target.textContent means that if
  // the clicked element contains any text
  // then it means it's not a video element
  // so the context menu should be invisible
  if (!window.location.pathname.includes('/videos/')) {
    if (!videoLink || event.target.textContent) {
      return;
    }
  }

  linkToDownload = videoLink ? videoLink.href : '';
  openHideContextMenu({ xMousePosition, yMousePosition });
};
