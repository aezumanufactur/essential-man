window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRSearch"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRSearch", () => ({
      active: false,
      query: "",
      showQuickWords: true,
      abortController: new AbortController(),
      cachedResults: [],
      vars: {
        input: "#offCanvasSearchInput",
        inputDebounce: null,
        inputDebounceTimeout: 2000,
        results: ".offcanvas-search__results",
      },
      init() {
        this.$input = this.$el.querySelector(this.vars.input);
        this.$predictiveSearchResults = this.$el.querySelector(
          this.vars.results
        );
        this.$watch(
          "query",
          this.debounce((val) => {
            this.checkActive();
            this.fetchResults();
          }, 250)
        );
      },
      isInputValueEmpty() {
        return this.query === "";
      },
      checkActive() {
        if (!this.isInputValueEmpty()) {
          this.active = true;
        } else {
          clearTimeout(this.inputDebounce);
          this.inputDebounce = setTimeout(() => {
            if (this.isInputValueEmpty()) {
              this.active = false;
              this.$predictiveSearchResults.innerHTML = "";
            } else {
              this.active = true;
            }
          }, 2000);
        }
      },
      async typeWord(word) {
        this.query = "";
        for (let char of word) {
          this.query += char;
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
        if( this.__handleOnInput ) this.__handleOnInput();
      },
      fetchResults() {
        const queryKey = this.query.toLowerCase().trim();

        if (this.cachedResults[queryKey]) {
          this.renderSearchResults(this.cachedResults[queryKey]);
          return;
        }

        fetch(
          `/search/suggest?q=${encodeURIComponent(
            this.query
          )}&section_id=mfr-search__predictive`
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.text();
          })
          .then((text) => {
            const resultsMarkup = new DOMParser()
              .parseFromString(text, "text/html")
              .querySelector("#mfr-predictive-search-results")?.innerHTML;

            // Ensure resultsMarkup exists before using it
            if (!resultsMarkup) {
              throw new Error("Failed to parse search results.");
            }

            // Use a consistent cache key
            this.cachedResults[queryKey] = resultsMarkup;
            this.renderSearchResults(resultsMarkup);
          })
          .catch((error) => {
            this.cachedResults[queryKey] = false;
            console.error("Search fetch error:", error);
          });
      },
      renderSearchResults(resultsMarkup) {
        this.$predictiveSearchResults.innerHTML = resultsMarkup;

        if (typeof lozad !== "undefined") lozad("img.lozad").observe();
      },
      debounce(func, delay = 250) {
        let timeoutId;

        return function (...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        };
      },
    }));
  });

  window._mfrAlpineRegistered["MFRSearch"] = true;
}
