window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRCarousel"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRCarousel", (options = {}) => ({
      flkty: null,
      observer: null,
      onChangeFuncs: [],
      settings: {
        cellAlign: "left",
        contain: true,
        wrapAround: false,
        selectedAttraction: 0.2,
        friction: 0.8,
        cellSelector: ".mfr-carousel__item",
        ...options,
      },
      mobileSettings: {
        ...(options.mobileSettings ?? options),
      },
      selectors: {
        itemClass: ".mfr-carousel__item",
      },
      resizeDebounceTimeout: null,
      isExceeded: false,
      forceCarousel: options.forceCarousel,
      init() {
        if (this.settings?.renderCarouselOn == "none") return;
        this.checkAndToggle();
        this.checkViewportChange();
        this.checkIfExceeded();

        this.observer = new ResizeObserver(() => {
          this._resizeObserverFunction();
        });

        this.observer.observe(this.$el);
      },

      _resizeObserverFunction() {
        if (this.resizeDebounceTimeout)
          clearTimeout(this.resizeDebounceTimeout);
        this.resizeDebounceTimeout = setTimeout(() => {
          requestAnimationFrame(() => {
            this.checkAndToggle();
            this.checkIfExceeded();
          });
        }, 100);
      },

      checkAndToggle() {
        const wrapper = this.$el;
        const wrapperWidth = wrapper.offsetWidth;
        const totalWidth = this.calculateTotalWidth(wrapper, false);
        if (totalWidth > wrapperWidth || this.forceCarousel) {
          if (!this.flkty && !this.$el.classList.contains("flickity-enabled")) {
            this.initFlickity();
          } else {
            this.flkty.resize();
          }
        } else if (!this.forceCarousel) {
          this.destroyFlickity();
        }
      },

      // Function to calculate the total width of all carousel cells
      calculateTotalWidth(wrapper, ignoreRight = false) {
        const cells = wrapper.querySelectorAll(this.selectors.itemClass);
        let totalWidth = 0;

        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i];
          const style = getComputedStyle(cell);
          const margin =
            parseFloat(style.marginLeft) + parseFloat(style.marginRight);

          // If it's the last cell and ignoreRight is true
          if (ignoreRight && i === cells.length - 1) {
            const paddingRight = parseFloat(style.paddingRight);
            const paddingLeft = parseFloat(style.paddingLeft);
            const adjustedPadding = paddingLeft - paddingRight;

            totalWidth += cell.offsetWidth + margin + adjustedPadding;
          } else {
            totalWidth += cell.offsetWidth + margin;
          }
        }

        return totalWidth;
      },

      initFlickity() {
        const settings = this.getSettings();
        const mode = this.settings["renderCarouselOn"];
        const windowWidth = window.innerWidth;

        this.destroyFlickity();
        if (this.observer) this.observer.disconnect();
        let flkty;

        if (mode === "mobile" && windowWidth >= 1024) {
          if (this.$el.classList.contains("flickity-enabled")) {
            this.destroy();
          }
          return;
        }

        if (mode === "desktop" && windowWidth <= 1023) {
          if (this.$el.classList.contains("flickity-enabled")) {
            this.destroy();
          }
          return;
        }

        this.flkty = flkty = new Flickity(this.$el, settings);

        flkty.on("settle", (index) => {
          if (!this.settings.allowPlayAllVideos) {
            this.$el.querySelectorAll("video").forEach((video) => {
              video.pause();
            });
          }

          const inactiveCells = flkty.cells.filter(
            (cell, cellIndex, cellArray) => cellIndex != index
          );
          if (inactiveCells) {
            this.removeFocusOnElements(inactiveCells);
          }

          const currentCell = flkty.cells[index]?.element;
          if (!currentCell) return;

          this.addFocusOnElements(currentCell);

          if (!this.settings.allowPlayAllVideos) {
            const video = currentCell.querySelector("video[data-mfr-autoplay]");

            if (video) {
              video.play().catch(() => {
                console.warn(
                  "Video couldn't autoplay — user interaction might be required."
                );
              });
            }
          }
        });

        flkty.on("change", (index) => {
          this.onChangeFuncs.forEach((func) => {
            func(index);
          });
        });

        this.flkty.on("ready", () => {
          this.equalizeItems();
          if (this.observer) this.observer.observe(this.$el);
        });
        this.flkty.on("resize", this.equalizeItems.bind(this));
        this.flkty.on("settle", this.equalizeItems.bind(this));
      },

      getSettings() {
        const settings = {
          ...this.settings,
          ...(window.innerWidth <= 1023 && this.mobileSettings
            ? this.mobileSettings
            : {}),
          on: {
            ready: () => {
              this.$nextTick(() => {
                this.initCustomPageDots();
                this.initCustomNavButtons();
              });

              if (this.settings.hasOwnProperty("onReady"))
                this.settings.onReady();
            },
          },
        };
        return settings;
      },

      destroyFlickity() {
        if (this.flkty) {
          if (this.observer) this.observer.disconnect();
          this.flkty.destroy();
          this.flkty = null;
          if (this.$el.querySelector(".mfr-carousel-nav")) {
            this.$el.querySelectorAll(".mfr-carousel-nav").forEach((e, i) => {
              e.remove();
            });
          }
          if (this.$el.querySelector(".mfr-custom-page-dots")) {
            this.$el
              .querySelectorAll(".mfr-custom-page-dots")
              .forEach((e, i) => {
                e.remove();
              });
          }
          requestAnimationFrame(() => {
            if (this.observer) this.observer.observe(this.$el);
          });
        }
      },

      destroy() {
        if (this.observer) {
          this.observer.disconnect();
        }
        this.destroyFlickity();
      },

      checkViewportChange() {
        onViewportChange(
          () => {
            this.destroyFlickity();
            this.checkAndToggle();
          },
          () => {
            this.destroyFlickity();
            this.checkAndToggle();
          }
        );
      },

      addFocusOnElements(container) {
        const currentCellFocusableElements = getFocusableElements(container);
        if (currentCellFocusableElements.length > 0) {
          currentCellFocusableElements.forEach((el) => {
            el.setAttribute("tabindex", "1");
          });
        }
      },

      removeFocusOnElements(container) {
        container.forEach((item) => {
          const inactiveCellsFocusableElements = getFocusableElements(
            item.element
          );
          if (inactiveCellsFocusableElements.length > 0) {
            inactiveCellsFocusableElements.forEach((el) => {
              el.setAttribute("tabindex", "-1");
            });
          }
        });
      },

      mobileDesktopSettingsConditions(setting) {
        if (!setting) return;
        return (
          (this.getSettings()[setting] === true && window.innerWidth <= 1023) ||
          (this.getSettings()[setting] === true && window.innerWidth >= 1024)
        );
      },

      initCustomPageDots() {
        if (this.$el.querySelector(".mfr-custom-page-dots")) {
          this.$el.querySelectorAll(".mfr-custom-page-dots").forEach((e, i) => {
            e.remove();
          });
        }
        if (this.mobileDesktopSettingsConditions("customPageDots")) {
          const customPageDots = document.createElement("div");
          customPageDots.className = "mfr-custom-page-dots";
          const customPageDotsInner = document.createElement("div");
          customPageDotsInner.className = "mfr-custom-page-dots__inner";
          const totalSlides = this.$el.querySelectorAll(
            this.selectors.itemClass
          ).length;

          customPageDots.style.setProperty("width", `${84 * totalSlides}`);
          customPageDots.append(customPageDotsInner);
          this.flkty.element.appendChild(customPageDots);

          customPageDots.style.setProperty(
            "--percentage",
            (this.updateProgress() / 100).toFixed(2)
          );

          this.flkty.on("scroll", (data) => {
            customPageDots.style.setProperty(
              "--percentage",
              (this.updateProgress() / 100).toFixed(2)
              // this.toClampedPercentage(data)
            );
          });
        }
      },

      toClampedPercentage(decimal) {
        const percentage = decimal;
        const clamped = Math.min(100, Math.max(0, percentage));
        return parseFloat(clamped.toFixed(2));
      },

      updateProgress() {
        const viewport = this.flkty.element;
        const items = this.$el.querySelectorAll(this.selectors.itemClass);

        const viewportRect = viewport.getBoundingClientRect();
        const viewportLeft = viewportRect.left;
        const viewportRight = viewportRect.right;

        let totalVisiblePercentage = 0;
        const totalCells = items.length;

        items.forEach((item, i) => {
          const rect = item.getBoundingClientRect();
          const cellLeft = rect.left;
          const cellRight = rect.right;
          const cellWidth = rect.width;

          const visibleLeft = Math.max(cellLeft, viewportLeft);
          const visibleRight = Math.min(cellRight, viewportRight);
          const visibleWidth = Math.max(0, visibleRight - visibleLeft);

          const visiblePercentage = (visibleWidth / cellWidth) * 100;

          if (
            totalCells > i + 1 &&
            visiblePercentage < 100 &&
            cellLeft < viewportLeft
          ) {
            totalVisiblePercentage += 100;
            return;
          }

          totalVisiblePercentage += Math.min(visiblePercentage, 100);
        });

        const finalProgress = totalVisiblePercentage / totalCells;
        return finalProgress;
      },

      initCustomNavButtons() {
        if (this.$el.querySelector(".mfr-carousel-nav")) {
          this.$el.querySelectorAll(".mfr-carousel-nav").forEach((e, i) => {
            e.remove();
          });
        }
        if (this.mobileDesktopSettingsConditions("customPrevNextButtons")) {
          const nav = document.createElement("div");
          nav.className = "mfr-carousel-nav";
          const navInner = document.createElement("div");
          navInner.className = "mfr-carousel-nav__inner";

          const leftBtn = this.createNavButton("left", "Previous slide");
          const rightBtn = this.createNavButton("right", "Next slide");

          // Append buttons to nav
          navInner.appendChild(leftBtn);
          navInner.appendChild(rightBtn);
          nav.append(navInner);
          this.flkty.element.appendChild(nav);

          // Event handlers
          leftBtn.addEventListener("click", () => {
            this.flkty.previous();
          });

          rightBtn.addEventListener("click", () => {
            this.flkty.next();
          });

          this.updateNavButtons(leftBtn, rightBtn);
          this.flkty.on("change", () =>
            this.updateNavButtons(leftBtn, rightBtn)
          );
        }
      },

      createNavButton(direction, label) {
        const btn = document.createElement("button");
        btn.className = `mfr-carousel-nav__button ${direction}`;
        btn.setAttribute("aria-label", label);
        btn.setAttribute("type", "button");

        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="26">
            <path fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" transform="matrix(-4.37114e-08 -1 1 -4.37114e-08 0.548828 24.5488)" d="M24 12L12 0L0 12" fill-rule="evenodd"/>
          </svg>
        `;

        const span = document.createElement("span");
        span.className = "visually-hidden";
        span.textContent = label;

        btn.appendChild(span);
        return btn;
      },

      updateNavButtons(leftBtn, rightBtn) {
        if (this.flkty.selectedIndex === 0) {
          leftBtn.setAttribute("disabled", "true");
        } else {
          leftBtn.removeAttribute("disabled");
        }

        if (this.flkty.selectedIndex === this.flkty.slides.length - 1) {
          rightBtn.setAttribute("disabled", "true");
        } else {
          rightBtn.removeAttribute("disabled");
        }
      },
      checkIfExceeded() {
        const sizes = {
          1600: 1600,
          1920: 1920,
          2560: 2400,
          3840: 2560,
        };
        const getTotalContentWidth = () => {
          let total = 0;
          this.$el.querySelectorAll(this.selectors.itemClass).forEach((el) => {
            const style = window.getComputedStyle(el);
            const contentWidth =
              el.clientWidth -
              parseFloat(style.paddingLeft) -
              parseFloat(style.paddingRight);
            total += contentWidth;
          });
          return total;
        };
        const checkWidthAndContent = () => {
          const viewportWidth = window.innerWidth;
          const totalContentWidth = getTotalContentWidth();

          const keys = Object.keys(sizes)
            .map(Number)
            .sort((a, b) => a - b);

          let isExceeded = false; // default

          for (let i = 0; i < keys.length - 1; i++) {
            const min = keys[i];
            const max = keys[i + 1];

            if (viewportWidth >= min && viewportWidth < max) {
              const limit = sizes[min];
              isExceeded = totalContentWidth > limit;
              return isExceeded; // return or use as needed
            }
          }

          // Handle viewport larger than last key
          const lastKey = keys[keys.length - 1];
          if (viewportWidth >= lastKey) {
            const limit = sizes[lastKey];
            this.isExceeded = totalContentWidth > limit;
          }

          return isExceeded;
        };
        checkWidthAndContent();
      },

      selectCell(index) {
        if (index >= 0 && this.flkty) this.flkty.selectCell(index);
      },

      onChange(func) {
        this.onChangeFuncs.push(func);
      },

      equalizeItems() {
        if (!this.settings?.equalizeItemHeights) return;
        const els = this.$el.querySelectorAll(".mfr-carousel__item");
        let max = 0;
        els.forEach((el) => {
          el.style.height = "";
          max = Math.max(max, el.offsetHeight);
        });
        els.forEach((el) => {
          el.style.height = max + "px";
        });
      },
    }));
  });

  window._mfrAlpineRegistered["MFRCarousel"] = true;
}