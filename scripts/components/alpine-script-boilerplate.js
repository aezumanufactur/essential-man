window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRComponentName"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRComponentName", () => ({
      // Global Variables here

      init() {

      },

      // Global Functions here
    }));
  });

  window._mfrAlpineRegistered["MFRComponentName"] = true;
}