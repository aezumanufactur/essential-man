window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRProductVariantSelector"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRProductVariantSelector", ({ productURL, sectionID }) => ({
      // Global Variables here

      // DOM selector strings used to find elements within the component
      selectors: {
        selectedOption: "[type='radio']:checked", // Finds all checked radio buttons (variant options)
      },

      // The base URL of the product page used for fetching variant-specific content
      productURL,

      // The Shopify section ID used to fetch only the specific section's HTML
      sectionID,

      // Lifecycle hook that runs when the component is initialized (currently empty)
      init() {},

      // Global Functions here

      /**
       * Fetches the HTML markup for the currently selected product variant
       * Makes an AJAX request to get fresh product data without a full page reload
       *
       * @returns {Promise<Document>} A parsed HTML document containing the variant's markup
       * @throws {Error} If the fetch request fails
       */
      async getVariant() {
        // Constructs the URL with selected variant options and section ID
        const url = this.getURL();

        try {
          // Fetches the HTML content for the selected variant using axios
          // Accept header ensures we get HTML instead of JSON
          const { data: htmlString } = await axios.get(url, {
            headers: { Accept: "text/html" },
          });

          // Creates a new DOM parser to convert the HTML string into a Document object
          const parser = new DOMParser();

          // Parses the HTML string into a navigable DOM structure
          const variantDocument = parser.parseFromString(
            htmlString,
            "text/html"
          );

          // Returns the parsed document so specific elements can be extracted
          return variantDocument;
        } catch (error) {
          // Logs the error to the console for debugging purposes
          console.error("Failed to fetch variant markup:", error);

          // Re-throws the error so calling code can handle it
          throw error;
        }
      },

      /**
       * Retrieves the values of all currently selected variant options
       * Collects IDs from all checked radio buttons (e.g., size, color options)
       *
       * @returns {Array<string>} An array of selected option values/IDs
       */
      getSelectedOptionsID() {
        // Queries the DOM for all checked radio buttons within this component
        // Spread operator converts NodeList to Array for easier manipulation
        let selectedOptions = [
          ...this.$root.querySelectorAll(this.selectors.selectedOption),
        ];

        // Extracts and returns the value attribute from each checked radio button
        return selectedOptions.map((v) => v.value);
      },

      /**
       * Constructs the URL for fetching the selected product variant
       * Includes section ID, selected options, and optional selling plan parameter
       *
       * @returns {string} The complete URL with all necessary query parameters
       */
      getURL() {
        // Checks if a selling plan (subscription) parameter exists in the current page URL
        // Returns the value if present, or false if not found
        const sellingPlanParam =
          new URLSearchParams(window.location.search).get("selling_plan") ||
          false;

        // Builds the URL with the following components:
        // 1. Base product URL
        // 2. section_id: Tells Shopify which section to render
        // 3. option_values: Comma-separated list of selected variant options
        // 4. selling_plan: Optional subscription plan ID (only added if present)
        return `${this.productURL}?section_id=${
          this.sectionID
        }&option_values=${this.getSelectedOptionsID().join(",")}${
          sellingPlanParam ? `&selling_plan=${sellingPlanParam}` : ""
        }`;
      },
    }));
  });

  window._mfrAlpineRegistered["MFRProductVariantSelector"] = true;
}