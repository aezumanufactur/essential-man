window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRMegaMenu"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRMegaMenu", () => ({
      isOpen: false,
      _closeTimer: null,

      init() {},

      open() {
        clearTimeout(this._closeTimer);
        this.isOpen = true;
        const bg = getComputedStyle(this.$el).getPropertyValue("--mega-menu-background").trim();
        this.$dispatch("mega-menu-opened", { background: bg });
      },

      close() {
        clearTimeout(this._closeTimer);
        this.isOpen = false;
        this.$dispatch("mega-menu-closed");
      },

      scheduleClose() {
        this._closeTimer = setTimeout(() => this.close(), 300);
      },

      cancelClose() {
        clearTimeout(this._closeTimer);
      },
    }));
  });

  window._mfrAlpineRegistered["MFRMegaMenu"] = true;
}
