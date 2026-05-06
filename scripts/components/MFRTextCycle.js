window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRTextCycle"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRTextCycle", () => ({
      // Global Variables here
      words: [],
      $wrapper: null,
      $text: null,
      currentIndex: 0,
      selectors: {
        text: ".mfr-text-cycle__text",
        shortcodeEl: ".mfr-text-cycle",
      },
      init() {
        this.$wrapper = this.$el.closest(".mfr-text-cycle__settings");
        this.$text = this.$el.querySelectorAll(this.selectors.text);

        this.saveText();
        this.prerenderShortcode();
      },

      // Global Functions here
      saveText() {
        this.$text?.forEach((e, i) => {
          const span = e.querySelector("[data-timing]");
          this.words.push({
            timing: parseInt(span.getAttribute("data-timing")),
            value: span.textContent,
          });
        });
      },

      prerenderShortcode() {
        const shortcodeElements = document.querySelectorAll(
          this.selectors.shortcodeEl
        );
        if (!shortcodeElements) return;
        shortcodeElements.forEach((e, i) => {
          this.initCycle(e);
          e.classList.add("rendered");
        });
      },

      async typeWord(el, word) {
        el.classList.add("animating");
        el.textContent = "";
        for (let char of word) {
          el.textContent += char;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        el.classList.remove("animating");
      },

      async removeWord(el) {
        el.classList.add("animating");
        const word = el.textContent;
        for (let i = word.length; i > 0; i--) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          el.textContent = word.slice(0, i - 1);
        }
        el.classList.remove("animating");
      },

      getCurrentWord() {
        return this.words[this.currentIndex].value;
      },
      
      initCycle(el) {
        const cycle = async () => {
          const word = this.getCurrentWord();
          const timing = this.words[this.currentIndex].timing;

          await this.typeWord(el, word);
          await new Promise((resolve) => setTimeout(resolve, timing));
          await this.removeWord(el);

          this.currentIndex = (this.currentIndex + 1) % this.words.length;

          cycle();
        };

        cycle();
      },
    }));
  });

  window._mfrAlpineRegistered["MFRTextCycle"] = true;
}
