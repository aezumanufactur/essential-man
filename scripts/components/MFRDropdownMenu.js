window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRDropdownMenu"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRDropdownMenu", (args) => ({
      open: false,
      closeTimeout: null,
      devMode: args.devMode,
      disableFocusEvents: args.disableFocusEvents,
      selectors: {
        trigger: `a[href^="#${args.id}"], [data-mfr-trigger="${args.id}"]`,
      },
      init() {
        this.$triggers = document.querySelectorAll(this.selectors.trigger);
        this.$anchorElement = args.anchor;

        this.initWatcher();
        this.applyAria();

        if (this.devMode) {
          this.open = true;
          return;
        }

        this.initMouseEvents();
        this.initFocusEvents();
        this.initKeyboardEvents();
      },

      initMouseEvents() {
        this.$triggers.forEach(($trigger, i) => {
          // Attach both mouseover and click
          ["mouseover", "click"].forEach((eventName) => {
            $trigger.addEventListener(eventName, (e) => {
              e.preventDefault();
              this.open = true;
              clearTimeout(this.closeTimeout);
            });
          });

          ["mouseout"].forEach((eventName) => {
            $trigger.addEventListener(eventName, (e) => {
              e.preventDefault();
              this.closeWithDelay();
            });
          });
        });
      },

      initFocusEvents() {
        this.$triggers.forEach(($trigger, i) => {
          // Attach both mouseover and click
          ["focus"].forEach((eventName) => {
            $trigger.addEventListener(eventName, (e) => {
              if (!this.$el.contains(e.relatedTarget) ) {
                e.preventDefault();
                this.open = true;
                clearTimeout(this.closeTimeout);
              }
            });
          });
        });
      },

      initKeyboardEvents() {
        this.$el.addEventListener("keydown", (event) => {
          if ((event.key === "Escape" || event.key === "Esc") && !this.$el.querySelector( ".dropdown-opened" )) {
            event.preventDefault();
            this.closeWithDelay();
          }
        });
      },

      closeWithDelay() {
        this.closeTimeout = setTimeout(() => {
          this.open = false;
        }, 200);
      },

      cancelClose() {
        clearTimeout(this.closeTimeout);
      },

      initWatcher() {
        this.$watch("open", () => {
          if (this.open) {
            this.$el.classList.add("dropdown-opened");
          } else {
            this.$el.classList.remove("dropdown-opened");
          }
          this.applyAria();
        });
      },

      applyAria() {
        this.$triggers.forEach(($trigger, i) => {
          $trigger.setAttribute("aria-expanded", this.open);
        });
      },

      getFocusableElements() {
        return Array.from(
          this.$el.querySelectorAll(`
          a[href],
          area[href],
          input:not([disabled]):not([type="hidden"]),
          select:not([disabled]),
          textarea:not([disabled]),
          button:not([disabled]),
          iframe,
          object,
          embed,
          [tabindex]:not([tabindex="-1"]),
          [contenteditable]
        `)
        ).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );
      },
    }));
  });

  window._mfrAlpineRegistered["MFRDropdownMenu"] = true;
}