window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRProductTop"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRProductTop", () => ({
      // Global Variables here
      selectors: {
        selectedVariant: "[data-selected-variable]",
      },
      currentQuantity: 1,
      price: 0,
      currentPriceValue: 0,
      currentPriceValueRaw: 0,
      currentCompareAtPrice: 0,
      discount: 0,
      formLoading: false,
      init() {
        this.selectedVariantScript = this.$el.querySelector(
          this.selectors.selectedVariant
        );
        this.setVariables(this.selectedVariantScript);
        this.setCurrentPrice();
        ["currentQuantity", "price", "discount"].forEach((v) => {
          this.$watch(v, () => {
            this.setCurrentPrice();
          });
        });
      },
      // Global Functions here
      increaseQuantity() {
        this.currentQuantity += 1;
      },
      decreaseQuantity() {
        this.currentQuantity -= 1;
      },
      setQuantity(quantity) {
        this.currentQuantity = quantity;
      },
      setCurrentPrice() {
        const price = this.price * this.currentQuantity;
        const discountedPrice = price * this.discount;
        const finalPrice = price - discountedPrice;

        this.currentPriceValue = Alpine.store("cart")?.formatMoney(finalPrice);
        this.currentCompareAtPrice =
          this.discount > 0 ? Alpine.store("cart")?.formatMoney(price) : null;
      },
      setVariables(script) {
        const jsonData = () => {
          try {
            const jsonString = script.textContent;
            const jsonData = JSON.parse(jsonString);
            return jsonData;
          } catch (error) {
            console.error("Error parsing JSON from script tag:", error);
            return null;
          }
        };

        if (!jsonData()) return;
        const variantID = jsonData().id;
        if (variantID) {
          if (
            document
              .querySelector("body")
              .classList.contains("template-product")
          ) {
            this.updateUrl("variant", variantID);
          }
        }

        this.price = jsonData().price;
      },
      updateVariables(productFormData) {
        const root = productFormData ?? this;
        root.selectedVariantScript = root.$el.querySelector(
          root.selectors.selectedVariant
        );
        root.setVariables(root.selectedVariantScript);
      },
      startLoading() {
        this.formLoading = true;
      },
      endLoading() {
        this.formLoading = false;
      },
      replaceHTML(html) {
        const toReplaceElements = html.querySelectorAll("[data-replace]");

        toReplaceElements.forEach((element) => {
          const replacementID = element.dataset.replace;
          const elementToReplace = document.querySelector(
            `[data-replace="${replacementID}"]`
          );
          if (!elementToReplace) return;
          if (elementToReplace.innerHTML) elementToReplace.replaceWith(element);
          else if (elementToReplace.textContent)
            elementToReplace.textContent = element.textContent;

          Alpine.initTree(elementToReplace);
        });
      },
      setDiscount(discount) {
        this.discount = discount;
      },
      updateUrl(property, value) {
        if ("URLSearchParams" in window) {
          if (value) {
            const url = new URL(window.location);
            url.searchParams.set(property, value);
            history.pushState(null, "", url);
          } else {
            const url = new URL(window.location);
            url.searchParams.delete(property);
            history.pushState(null, "", url);
          }
        }
      },
    }));
  });

  window._mfrAlpineRegistered["MFRProductTop"] = true;
}