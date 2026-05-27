document.addEventListener("alpine:init", () => {
  Alpine.store("offCanvas", {
    mobileMenu: false,
    cart: false,
    contact: false,
    announcementBarHeight: 0,
  });
});

document.addEventListener("alpine:initialized", () => {
  const bar = document.querySelector(".announcement-bar");
  if (bar) {
    Alpine.store("offCanvas").announcementBarHeight = bar.offsetHeight;
    new ResizeObserver(([entry]) => {
      Alpine.store("offCanvas").announcementBarHeight = entry.contentRect.height;
    }).observe(bar);
  }
});
