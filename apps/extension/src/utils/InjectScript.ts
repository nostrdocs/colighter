export function injectSidebar() {
  const sidebarIframe = document.createElement('iframe');
  sidebarIframe.id = 'colighter-sidebar';
  sidebarIframe.src = chrome.runtime.getURL('build/sidebar.html');
  sidebarIframe.style.cssText = `
      height: 100%;
      width: 450px;
      position: fixed;
      top: 0px;
      right: 0px;
      z-index: 999999;
      border: none;
      overflow: hidden;
      background-color: #fff;
    `;

  // Ensure only one instance of the sidebar exists
  if (!document.getElementById('colighter-sidebar')) {
    document.body.appendChild(sidebarIframe);
  }
}
