window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRDragScroll"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRDragScroll", () => ({
      isDragging: false,
      startX: 0,
      translateX: 0,
      maxTranslate: 0,
      containerWidth: 0,
      contentWidth: 0,
      $track: null,
      init() {
        this.$track = this.$el.querySelector(".track");
        this.updateSizes();

        // Watch container resize
        const resizeObserver = new ResizeObserver(() => {
          this.updateSizes();
        });

        resizeObserver.observe(this.$el);
      },

      updateSizes() {
        this.containerWidth = this.$el.offsetWidth;
        this.contentWidth = this.$track.scrollWidth;
        this.maxTranslate = Math.max(
          0,
          this.contentWidth - this.containerWidth
        );

        // Clamp position if needed
        if (Math.abs(this.translateX) > this.maxTranslate) {
          this.translateX = -this.maxTranslate;
        }
      },

      getClientX(event) {
        return event.touches ? event.touches[0].clientX : event.clientX;
      },

      onDragStart(event) {
        this.isDragging = true;
        this.startX = this.getClientX(event);
        this.$el.classList.add("cursor-grabbing");
      },

      onDrag(event) {
        if (!this.isDragging) return;

        const currentX = this.getClientX(event);
        const deltaX = currentX - this.startX;
        this.startX = currentX;

        this.translateX += deltaX;

        if (this.translateX > 0) this.translateX = 0;
        if (Math.abs(this.translateX) > this.maxTranslate) {
          this.translateX = -this.maxTranslate;
        }

        const percent =
          this.maxTranslate === 0
            ? 0
            : (Math.abs(this.translateX) / this.maxTranslate) * 100;

        this.$el.dispatchEvent(
          new CustomEvent("mfr:dragScroll", {
            detail: { percent: percent.toFixed(2) },
            bubbles: true,
          })
        );
      },

      onDragEnd() {
        this.isDragging = false;
        this.$el.classList.remove("cursor-grabbing");
      },

      scrollToPercent(percent) {
        if (this.maxTranslate === 0) return;

        const clampedPercent = Math.max(0, Math.min(percent, 100));
        const targetTranslate = -(this.maxTranslate * (clampedPercent / 100));

        // Smooth animation using requestAnimationFrame
        const duration = 1000; // in ms
        const start = this.translateX;
        const startTime = performance.now();

        const animate = (time) => {
          const elapsed = time - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

          this.translateX = start + (targetTranslate - start) * ease;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            this.translateX = targetTranslate; // ensure exact final value
          }
        };

        requestAnimationFrame(animate);
      },
    }));
  });

  window._mfrAlpineRegistered["MFRDragScroll"] = true;
}