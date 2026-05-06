window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRCarouselMarquee"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRCarouselMarquee", (options = {}) => ({
      settings: {
        scrollSpeed: 1,
        ...options,
      },
      vars: {
        requestId: null,
        $carousel: null,
        pauseOnDrag: null,
        toLeft: options["direction"] == "left",
        resizeBound: false,
        appendCounter: 0,
        maxAppends: 10,
        resizeHandler: null,
        resizeTimer: null,
        isResizing: false,
        baseItems: null,
        dragBound: false,
        autoUnfocusBound: false,
      },
      init() {
        this.vars.pauseOnDrag = this.settings["pauseOnDrag"];
        this.vars.scrollSpeed = this.settings["scrollSpeed"];

        if (this.settings?.renderAutoScrollOn == "none") return;

        this.initRender();
        this.setClass();
      },

      setClass() {
        if (this.settings.renderAutoScrollOn == "mobile") {
          this.$el.classList.add("mobile-carousel");
        }
      },

      initRender() {
        this.checkViewport();
        this.bindResize();
        this.refreshOnImageLoad();
      },

      checkViewport() {
        const items = this.getCarouselItems();
        const totalItemsWidth = this.getTotalItemsWidth(items);
        const getCarouselWidth = this.$el.offsetWidth;

        const mode = this.settings["renderAutoScrollOn"];
        const windowWidth = window.innerWidth;

        const shouldRender =
          mode === "mobile"
            ? windowWidth <= 1023
            : mode === "desktop"
              ? windowWidth >= 1024
              : true;

        if (!shouldRender) {
          this.teardownCarousel();
          return;
        }

        if (totalItemsWidth >= getCarouselWidth) {
          this.initCarousel();
        } else {
          if (this.$el.classList.contains("flickity-enabled")) {
            this.teardownCarousel();
          }
          this.appendUntilFilled(getCarouselWidth);
          const updatedWidth = this.getTotalItemsWidth(this.getCarouselItems());
          if (
            updatedWidth >= getCarouselWidth ||
            this.vars.appendCounter >= this.vars.maxAppends
          ) {
            this.initCarousel();
          }
        }
      },

      initCarousel() {
        if (this.$el.classList.contains("flickity-enabled")) return;
        this.vars.$carousel = new Flickity(this.$el, {
          accessibility: true,
          resize: true,
          wrapAround: true,
          prevNextButtons: false,
          pageDots: false,
          percentPosition: true,
          groupCells: false,
          cellAlign: "center",
          imagesLoaded: true,
          on: {
            ready: () => {
              this.refreshOnImageLoad();
            },
          },
        });

        this.vars.$carousel.x = 0;
        this.play();

        if (this.vars.pauseOnDrag) {
          if (!this.vars.dragBound) {
            this.$el.addEventListener("pointerdown", () => {
              this.pause();
            });
            this.$el.addEventListener("mouseleave", () => {
              if (!this.$el.classList.contains("paused")) return;
              this.$el.classList.remove("paused");
              if (!this.vars.requestId) {
                this.play();
              }
            });
            this.vars.dragBound = true;
          }
        }

        if (!this.vars.autoUnfocusBound) {
          this.setAutoUnfocus(this.$el);
          this.vars.autoUnfocusBound = true;
        }
      },

      play() {
        if (this.vars.requestId || !this.vars.$carousel) return;

        const step = () => {
          this.vars.$carousel.x -=
            this.vars.scrollSpeed * (this.vars.toLeft ? 1 : -1);
          this.vars.$carousel.settle(this.vars.$carousel.x);
          this.vars.requestId = window.requestAnimationFrame(step);
        };

        this.vars.requestId = window.requestAnimationFrame(step);
      },

      pause() {
        this.$el.classList.add("paused");
        if (this.vars.requestId) {
          window.cancelAnimationFrame(this.vars.requestId);
          this.vars.requestId = null;
        }
      },

      getCarouselItems() {
        if (this.$el.classList.contains("flickity-enabled")) {
          return this.$el.querySelector(".flickity-slider")?.children || [];
        } else {
          return this.$el.children;
        }
      },

      getBaseItems() {
        if (!this.vars.baseItems || this.vars.baseItems.length === 0) {
          this.vars.baseItems = Array.from(this.$el.children).filter(
            (el) => !el.classList.contains("appended-item")
          );
        }
        return this.vars.baseItems;
      },

      getTotalItemsWidth(items) {
        let totalWidth = 0;
        const itemArray = Array.from(items);

        itemArray.forEach((el, i) => {
          if (i === itemArray.length - 1) return;
          const style = getComputedStyle(el);
          const margin =
            parseFloat(style.marginLeft) + parseFloat(style.marginRight);
          totalWidth += el.offsetWidth + margin;
        });

        return totalWidth;
      },

      appendUntilFilled(containerWidth) {
        const baseItems = this.getBaseItems();
        const baseWidth = this.getTotalItemsWidth(baseItems);
        if (baseWidth <= 0) return;

        const neededAppends = Math.max(
          0,
          Math.ceil(containerWidth / baseWidth) - 1
        );
        const remainingAppends = Math.min(
          this.vars.maxAppends - this.vars.appendCounter,
          neededAppends
        );

        for (let i = 0; i < remainingAppends; i++) {
          this.reappendCarouselItems();
        }
      },

      reappendCarouselItems() {
        const baseItems = this.getBaseItems();
        baseItems.forEach((el) => {
          const clone = el.cloneNode(true);
          clone.classList.add("appended-item");
          this.$el.appendChild(clone);
        });
        this.vars.appendCounter++;
        if (typeof lozad === "function") {
          lozad("img.lozad").observe();
        }
      },

      refreshOnImageLoad() {
        this.$el.querySelectorAll("img").forEach((img) => {
          img.addEventListener("load", () => this._refreshAfterImageLoad());
          img.addEventListener("error", () => this._refreshAfterImageLoad());
        });
      },

      _refreshAfterImageLoad() {
        this._repositionCarousel();
        this.checkViewport();
        if (this.vars.$carousel) {
          this.play();
        }
      },

      _repositionCarousel() {
        if (typeof Flickity !== "undefined") {
          const flickityInstance = Flickity.data(this.$el);
          if (flickityInstance) {
            flickityInstance.reposition();
          }
        }
      },

      teardownCarousel() {
        if (this.vars.$carousel) {
          this.vars.$carousel.destroy();
          this.vars.$carousel = null;
        }
        if (this.vars.requestId) {
          window.cancelAnimationFrame(this.vars.requestId);
          this.vars.requestId = null;
        }
        this.$el
          .querySelectorAll(".appended-item")
          .forEach((el) => el.remove());
        this.vars.appendCounter = 0;
        this.vars.baseItems = null;
        this.pause();
      },

      setSpeed(newSpeed) {
        this.vars.scrollSpeed = newSpeed;
      },

      bindResize() {
        if (this.vars.resizeBound) return;
        this.vars.resizeBound = true;

        this.vars.resizeHandler = () => {
          if (!this.vars.isResizing) {
            this.vars.isResizing = true;
            this.pause();
          }

          clearTimeout(this.vars.resizeTimer);
          this.vars.resizeTimer = setTimeout(() => {
            this.vars.isResizing = false;
            this.checkViewport();
            if (this.vars.$carousel) {
              this.play();
            }
          }, 250);
        };

        window.addEventListener("resize", this.vars.resizeHandler, {
          passive: true,
        });
      },

      setAutoUnfocus(element, timing = 3000) {
        if (!element) {
          throw new Error("An element is required.");
        }

        element.addEventListener("focus", () => {
          // Clear any existing timers to avoid stacking
          if (element._unfocusTimer) {
            clearTimeout(element._unfocusTimer);
          }

          // Set timer to unfocus after 3 seconds
          element._unfocusTimer = setTimeout(() => {
            element.blur();
            element._unfocusTimer = null;
            this.play();
          }, timing);
        });
      },
    }));
  });

  window._mfrAlpineRegistered["MFRCarouselMarquee"] = true;
}
