function initializeGSAPScripts() {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    ScrollSmoother,
    Flip,
    ScrollToPlugin
  );

  const triggers = {
    start: "top bottom", //will trigger if the top of the elements hits 75% of the viewport from top
    endTrigger: "html", // uncomment if you want to repeat class toggling
    end: "bottom top", // change to "bottom center" and comment out endTrigger if you want to repeat animation
  };
  const repeatEnterAnimations = false;

  let elements;

  // Store the ScrollTrigger instances for the parallax effect
  let parallaxScrollTriggers = [];

  // Function to initialize the parallax effect
  function initParallax() {
    gsap.utils.toArray("[data-image-parallax]").forEach((section) => {
      const imgOrPicture = section.querySelectorAll(
        ":scope > img, :scope > picture, :scope > [data-image-parallax-element]"
      );
      if (!imgOrPicture) return;

      imgOrPicture.forEach((imgOrPicture) => {
        // Get heights
        const sectionHeight = section.offsetHeight;
        const imgHeight = imgOrPicture.offsetHeight;
        const heightDiff = imgHeight - sectionHeight;

        // Determine direction
        const direction =
          section.getAttribute("data-image-parallax") === "reverse"
            ? heightDiff / 2
            : -heightDiff / 2;

        // Create ScrollTrigger animation
        const trigger = gsap.fromTo(
          imgOrPicture,
          { y: direction },
          {
            scrollTrigger: {
              trigger: imgOrPicture,
              scrub: 1,
              start: () => "top bottom",
              end: () => "bottom top",
              invalidateOnRefresh: true,
            },
            y: 0,
            ease: "none",
          }
        );

        // Store the ScrollTrigger if needed
        parallaxScrollTriggers.push(trigger.scrollTrigger);
      });
    });
  }

  // Destroy the specific ScrollTrigger for the parallax effect
  function destroyParallaxScrollTrigger() {
    parallaxScrollTriggers.forEach((trigger) => {
      trigger.kill(); // Destroy the specific ScrollTrigger instance
    });
    parallaxScrollTriggers = []; // Clear the array after destroying the triggers
  }

  // Debounced resize handler to limit the number of times the parallax is recalculated
  let parallaxResizeTimeout;
  window.onWidthResize(() => {
    clearTimeout(parallaxResizeTimeout);
    parallaxResizeTimeout = setTimeout(() => {
      destroyParallaxScrollTrigger(); // Destroy the existing parallax ScrollTriggers
      initParallax(); // Reinitialize the parallax effect
    }, 200); // Delay the recalculation to 200ms after the resize ends
  });
  destroyParallaxScrollTrigger(); // Destroy the existing parallax ScrollTriggers
  initParallax(); // Reinitialize the parallax effect

  if (document.querySelectorAll("[data-inview],.data-inview").length) {
    // Elements in view
    ScrollTrigger.batch("[data-inview],.data-inview", {
      ...triggers,
      onEnter: (batch) => {
        batch.forEach((element) => {
          element.classList.add("is-inview");
        });
      },
      onLeaveBack: (batch) => {
        if (!repeatEnterAnimations) return;
        batch.forEach((element) => {
          element.classList.remove("is-inview");
        });
      },
    });
  }

  window.initInview = (elements, { noScrollTrigger = false } = false) => {
    // Normalize input (support for selector string or NodeList/array)
    const targets =
      typeof elements === "string"
        ? document.querySelectorAll(normalizeScopedSelector(elements))
        : elements;

    if (noScrollTrigger) {
      elements.classList.add("is-inview");
    } else {
      ScrollTrigger.batch(targets, {
        ...triggers,
        start: "top 90%",
        onEnter: (batch) => {
          batch.forEach((element) => {
            element.classList.add("is-inview");
          });
        },
        onLeaveBack: (batch) => {
          if (!repeatEnterAnimations) return;
          batch.forEach((element) => {
            element.classList.remove("is-inview");
          });
        },
      });
    }
  };

  window.initStaggerInview = (elements, { noScrollTrigger } = false) => {
    // Normalize input (support for selector string or NodeList/array)
    const findStickyAncestor = (el) => {
      while (el) {
        const style = window.getComputedStyle(el);
        if (style.position === "sticky") {
          return el; // Found sticky ancestor
        }
        el = el.parentElement;
      }
      return null; // No sticky ancestor found
    };
    const targets =
      typeof elements === "string"
        ? document.querySelectorAll(normalizeScopedSelector(elements))
        : elements;
    if (targets) {
      if (noScrollTrigger) {
        [targets].forEach((element) => {
          const selector = element.dataset.staggerInview ?? "> *";
          const children = element.querySelectorAll(
            normalizeScopedSelector(selector)
          );
          const winWidth = window.innerWidth;
          let stickyAncestor;

          if (!children.length) return;
          gsap.to(children, {
            stagger: {
              each: 0.1,
              onComplete() {
                const child = this.targets()[0];
                // const rect = child.getBoundingClientRect();
                // if (rect.left < winWidth && rect.right > 0) {
                //   child.classList.add("is-inview");
                // }
                child.classList.add("is-inview");
              },
            },
            immediateRender: true,
            overwrite: true, // Prevents animation buildup
          });

          // if (findStickyAncestor(element)) {
          //   stickyAncestor = findStickyAncestor(element);
          //   stickyAncestor.style.position = "relative";
          //   ScrollTrigger.refresh();
          //   stickyAncestor.style.position = "sticky";
          // }
        });
      } else {
        ScrollTrigger.batch(targets, {
          ...triggers,
          onEnter: (batch) => {
            batch.forEach((element) => {
              const selector = element.dataset.staggerInview ?? "> *";
              const children = element.querySelectorAll(
                normalizeScopedSelector(selector)
              );
              const winWidth = window.innerWidth;
              let stickyAncestor;

              if (!children.length) return;
              gsap.to(children, {
                stagger: {
                  each: 0.1,
                  onComplete() {
                    const child = this.targets()[0];
                    // const rect = child.getBoundingClientRect();
                    // if (rect.left < winWidth && rect.right > 0) {
                    //   child.classList.add("is-inview");
                    // }
                    child.classList.add("is-inview");
                  },
                },
                immediateRender: true,
                overwrite: true, // Prevents animation buildup
              });

              // if (findStickyAncestor(element)) {
              //   stickyAncestor = findStickyAncestor(element);
              //   stickyAncestor.style.position = "relative";
              //   ScrollTrigger.refresh();
              //   stickyAncestor.style.position = "sticky";
              // }
            });
          },
          onLeaveBack: (batch) => {
            if (!repeatEnterAnimations) return;
            // Use classList toggle with false for better performance
            batch.forEach((element) => {
              const children = element.querySelectorAll(
                normalizeScopedSelector(
                  element.dataset.staggerInview ?? ":scope > *"
                )
              );
              children.forEach((child) => child.classList.remove("is-inview"));
            });
          },
        });
      }
    }
  };
  window.initStaggerInview("[data-stagger-inview]");
  window.initStaggerInview(
    document.querySelectorAll(".stagger-immediate-children")
  );

  window.onWidthResize(() => {
    window.initStaggerInview("[data-stagger-inview]");
    window.initStaggerInview(
      document.querySelectorAll(".stagger-immediate-children")
    );
  });

  document.querySelectorAll("[data-split-text]").forEach((element, i) => {
    element.classList.add("split-text--rendered");
    const splitTexts = new SplitText(element, {
      type: "words",
      wordsClass: "split-text",
    });

    const chars = gsap.utils.toArray(splitTexts.words);

    // Wrap each word in an inner span
    chars.forEach((e) => {
      const inner = document.createElement("span");
      inner.className = "split-text__inner";
      inner.innerHTML = e.innerHTML;
      e.innerHTML = "";
      e.appendChild(inner);
    });

    const animationType = element.getAttribute("data-split-text");

    if (animationType === "colorAnimation") {
      ScrollTrigger.batch(chars, {
        start: "top 70%",
        end: "bottom 70%",
        onEnter: (batch) => {
          batch.forEach((el) => el.classList.add("is-inview"));
        },
        onLeaveBack: (batch) => {
          if (!repeatEnterAnimations) return;
          batch.forEach((el) => el.classList.remove("is-inview"));
        },
      });
    } else if (animationType === "fadeUp") {
      ScrollTrigger.create({
        trigger: element,
        ...triggers,
        onEnter: () => {
          gsap.to(chars, {
            stagger: {
              delay: 0,
              each: 0.05,
              onComplete() {
                this.targets()[0].classList.add("is-inview");
              },
            },
            immediateRender: true,
          });
        },
        onLeaveBack: () => {
          if (!repeatEnterAnimations) return;
          chars.forEach((el) => {
            el.classList.remove("is-inview", "split-text--transition-ended");
          });
        },
      });
    }
  });

  document
    .querySelectorAll("[data-accent-graphic-parallax]")
    .forEach((e, i) => {
      // Find the closest .shopify-section ancestor
      const shopifySection = e.closest(".shopify-section");
      const header = document.querySelector("header.header");
      const headerHeight = header ? header.offsetHeight : 0;

      let rafId;

      // Create ScrollTrigger for each element
      ScrollTrigger.create({
        trigger: shopifySection,
        start: () => `top 50%`,
        end: () => `bottom 25%`,
        scrub: true,
        onUpdate: (self) => {
          // Cancel previous animation frame if any
          if (rafId) cancelAnimationFrame(rafId);

          rafId = requestAnimationFrame(() => {
            const progress = self.progress;
            const parallaxMultiplier =
              e.getAttribute("data-accent-graphic-parallax") ?? -100;

            gsap.set(e, {
              yPercent: parallaxMultiplier * progress,
            });
          });
        },
      });
    });

  const parallaxElements = document.querySelectorAll("[data-mfr-parallax]");
  if (parallaxElements.length) {
    gsap.utils.toArray(parallaxElements).forEach((elem) => {
      if (elem.classList.contains("has-gsap-function")) return;
      const parallaxAttr = elem.getAttribute("data-mfr-parallax");
      const yPercent = parallaxAttr === "" ? 50 : parseFloat(parallaxAttr);
      gsap.to(elem, {
        yPercent: yPercent * -1,
        ease: "none",
        scrollTrigger: {
          trigger: elem,
          start: () => {
            return `top 75%`;
          },
          end: () => {
            return `bottom top`;
          },
          scrub: 0.5,
        },
      });

      elem.classList.add("has-gsap-function");
    });

    ScrollTrigger.addEventListener("refreshInit", () => {
      gsap.set("[data-mfr-parallax]", { yPercent: 0 });
    });
  }

  // Animated Numbers
  const animatedNumbers = document.querySelectorAll("[data-animated-number]");

  if (animatedNumbers.length > 0) {
    animatedNumbers.forEach((el) => {
      el.style.display = "inline-block";
      el.style.width = el.offsetWidth + "px";
      el.dataset.target = el.textContent;
      el.textContent = "0";
    });

    ScrollTrigger.batch("[data-animated-number]", {
      // Add your own ScrollTrigger settings here
      ...triggers,

      onEnter: (batch) => {
        batch.forEach((el) => {
          gsap.to(el, {
            duration: 1,
            innerHTML: el.dataset.target,
            roundProps: "innerHTML",
            ease: "power1.out",
            onUpdate: function () {
              el.textContent = parseInt(el.innerHTML);
            },
            onUpdateParams: ["{self}"],
          });
        });
      },

      onLeaveBack: (batch) => {
        batch.forEach((el) => {
          el.style.display = "inline-block";
          el.style.width = el.offsetWidth + "px";
          el.textContent = "0";
        });
      },
    });
  }

  ScrollTrigger.refresh();
}

onReady(initializeGSAPScripts);

function stickyElementFunction() {
  if (window.innerWidth <= 1023) return;
  document
    .querySelectorAll("[data-mfr-sticky-container]")
    .forEach((element, i) => {
      let child = element.querySelector("[data-mfr-sticky]");
      const selector = element.getAttribute("data-mfr-sticky-container");

      if (selector && selector.trim() !== "") {
        child = element.querySelector(selector);
      }
      const header = document.querySelector("header.header");
      const headerHeight = header ? header.offsetHeight : 0;

      let stickyTrigger;
      if (child) {
        function initializeSticky() {
          stickyTrigger = ScrollTrigger.create({
            trigger: child,
            start: () => {
              return `top top+=${
                Number.isFinite(child.getAttribute("data-mfr-sticky"))
                  ? child.getAttribute("data-mfr-sticky")
                  : headerHeight
              }px`;
            },
            end: () => {
              const elementHeight = element.offsetHeight;
              const childHeight = child.offsetHeight;
              return `+=${elementHeight - childHeight}px`;
            },
            pin: true,
            pinSpacing: true,
          });
        }

        initializeSticky();
        // ResizeObserver to refresh on container resize
        const resizeObserver = new ResizeObserver(() => {
          if (stickyTrigger) {
            stickyTrigger.refresh();
          }
        });
        resizeObserver.observe(element);
      }
    });
}
onReady(stickyElementFunction);

function autoPlayVideoFunction() {
  const autoplayVideos = document.querySelectorAll(
    'video[data-autoplay="true"]'
  );

  if (autoplayVideos.length) {
    ScrollTrigger.batch(autoplayVideos, {
      start: "top bottom",
      end: "bottom top",

      onEnter: (batch) => {
        batch.forEach((video) => {
          if (video.paused) video.play();
        });
      },

      onEnterBack: (batch) => {
        batch.forEach((video) => {
          if (video.paused) video.play();
        });
      },

      onLeave: (batch) => {
        batch.forEach((video) => {
          if (!video.paused) video.pause();
        });
      },

      onLeaveBack: (batch) => {
        batch.forEach((video) => {
          if (!video.paused) video.pause();
        });
      },
    });
  }
}
onReady(autoPlayVideoFunction);

function stickyMainOnFooterAppearance() {
  if (!gsap || !ScrollTrigger) return;

  let mainPinTrigger;
  const initPin = () => {
    mainPinTrigger = ScrollTrigger.create({
      trigger: "main",
      start: "bottom bottom",
      endTrigger: "footer",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
    });
  };
  const destroyPin = () => {
    mainPinTrigger.kill({
      revert: true,
      allowAnimation: false,
    });
  };

  ScrollTrigger.create({
    trigger: "footer",
    start: "top bottom",
    end: "bottom top",
    onToggle: ({ isActive }) => {
      if (isActive) initPin();
      else destroyPin();
    },
  });
}

// onReady(stickyMainOnFooterAppearance)

// document.addEventListener("visibilitychange", () => {
//   if (document.visibilityState === "visible" && ScrollTrigger && ScrollTrigger.refresh) {
//     ScrollTrigger.refresh(true);
//   }
// });

function initRevealingSection() {
  const sections = document.querySelectorAll("[data-revealing-section]");
  sections.forEach((section) => {
    const shopifySection = section.closest(".shopify-section");
    const resizeObserver = new ResizeObserver(() => {
      shopifySection.style.height = `${Math.min(
        section.clientHeight * 1.5,
        1800
      )}px`;
      if (!gsap || !ScrollTrigger) return;
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(section);

    shopifySection.style.zIndex = 0;

    ScrollTrigger.create({
      trigger: section.closest(".shopify-section"),
      enter: "top bottom",
      bottom: "bottom top",
      onToggle: (data) => {
        section.classList.toggle("show", data.isActive);
      },
    });
  });
}
onReady(initRevealingSection);

function shopifyEventsRefresh() {
  document.addEventListener("shopify:section:load", (event) => {
    const section = event.detail.sectionId;
    console.log("Section loaded:", section);

    // Re-init Alpine.js components in this section
    if (event.target.querySelector("[x-data]")) {
      Alpine.initTree(event.target);
    }

    if (event.target.querySelectorAll("[data-inview]").length) {
      event.target.querySelectorAll("[data-inview]").forEach(($e) => {
        window.initInview($e);
      });
    }
    if (event.target.querySelectorAll("[data-stagger-inview]").length) {
      event.target.querySelectorAll("[data-stagger-inview]").forEach(($e) => {
        window.initStaggerInview($e);
      });
    }
  });
}
onReady(shopifyEventsRefresh);