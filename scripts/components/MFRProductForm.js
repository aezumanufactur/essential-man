window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRProductForm"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRProductForm", () => ({
      init() {
        this.$el.addEventListener("submit", this.submit.bind(this));
      },

      async submit(event) {
        event.preventDefault();

        const formData = new FormData(this.$el);

        try {
          const response = await axios.post("/cart/add.js", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
          });

          this.$dispatch("mfr-product-form:success", { item: response.data });
          mfrCart.getCartData();
        } catch (error) {
          console.error("MFRProductForm submit error:", error);
          this.$dispatch("mfr-product-form:error", { error });
        }
      },
    }));
  });

  window._mfrAlpineRegistered["MFRProductForm"] = true;
}
