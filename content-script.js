const CONTEXT_MENU_ID = 'custom-context-menu';
const CONTEXT_MENU_WIDTH = 300;
const CONTEXT_MENU_HEIGHT = 150;

const BUTTON_WIDTH = 150;
const BUTTON_HEIGHT = 40;

let contextMenu = null;
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
  button.innerText = 'Download Video';

  // button style
  button.style.backgroundColor = '#4584c7';
  button.style.color = 'white';
  button.style.borderRadius = '5px';
  button.style.border = '1px solid';
  button.style.fontFamily = 'Arial';
  button.style.fontSize = '16px';
  button.style.position = 'relative';
  button.style.top = `${CONTEXT_MENU_HEIGHT / 2 - BUTTON_HEIGHT / 2}px`;
  button.style.left = `${CONTEXT_MENU_WIDTH / 2 - BUTTON_WIDTH / 2}px`;
  button.style.width = `${BUTTON_WIDTH}px`;
  button.style.height = `${BUTTON_HEIGHT}px`;

  // button handlers
  button.addEventListener('mouseover', () => {
    button.style.cursor = 'pointer';
    button.style.backgroundColor = '#326296';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#4584c7';
  });

  button.addEventListener('click', handleClick);

  return button;
};

const createContextMenuElement = () => {
  contextMenu = document.createElement('div');

  // context menu props
  contextMenu.setAttribute('id', CONTEXT_MENU_ID);

  // context menu style
  contextMenu.style.width = `${CONTEXT_MENU_WIDTH}px`;
  contextMenu.style.height = `${CONTEXT_MENU_HEIGHT}px`;
  contextMenu.style.backgroundColor = 'white';
  contextMenu.style.borderRadius = '5px';
  contextMenu.style.boxShadow = '0px 0px 50px 5px rgba(0,0,0,0.99)';
  contextMenu.style.position = 'absolute';
  contextMenu.style.display = 'none';

  contextMenu.appendChild(createDownloadButton());
};

const openHideContextMenu = (event) => {
  const {
    target: { offsetHeight, offsetWidth },
  } = event;

  contextMenuOpen = !contextMenuOpen;

  if (contextMenuOpen) {
    contextMenu.style.display = 'flex';
    contextMenu.style.top = `${offsetHeight / 2 - CONTEXT_MENU_HEIGHT / 2}px`;
    contextMenu.style.left = `${offsetWidth / 2 - CONTEXT_MENU_WIDTH / 2}px`;
    return event.target.parentElement.parentElement.appendChild(contextMenu);
  }

  contextMenu.style.display = 'none';
  return event.target.parentElement.parentElement.remove(contextMenu);
};

window.addEventListener('load', () => {
  createContextMenuElement();
});

window.addEventListener('contextmenu', (event) => {
  const videoLink = event.target.parentElement.querySelector("[role='link']");

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
  openHideContextMenu(event);
});

window.addEventListener('click', (event) => {
  if (!contextMenuOpen || event.target.id === CONTEXT_MENU_ID) {
    return;
  }

  contextMenu.style.display = 'none';
  contextMenuOpen = false;
});
