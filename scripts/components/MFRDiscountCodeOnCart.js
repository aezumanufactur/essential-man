window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRDiscountCodeOnCart"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data("MFRDiscountCodeOnCart", () => ({
      discountInput: "",
      discountState: { error: null, loading: false },

      init() {},

      async applyDiscount(code) {
        this.discountState = { error: null, loading: true };
        this.$store.cart.cartState.updating = true;
        try {
          const res = await fetch("/cart/update.js", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({ discount: code }),
          });
          const data = await res.json();
          this.$store.cart.cartData = data;
          const applied = code && (data.discount_codes || []).find(
            (d) => d.code.toUpperCase() === code.toUpperCase()
          );
          this.discountState = {
            error: code && !applied ? "Discount code is invalid or not applicable." : null,
            loading: false,
          };
        } catch {
          this.discountState = { error: "Could not apply discount code.", loading: false };
        }
        this.$store.cart.cartState.updating = false;
      },

      async removeDiscount(code) {
        const remaining = (this.$store.cart.cartData.discount_codes || [])
          .filter((d) => d.code !== code)
          .map((d) => d.code);
        await this.applyDiscount(remaining.length ? remaining[0] : "");
      },
    }));
  });

  window._mfrAlpineRegistered["MFRDiscountCodeOnCart"] = true;
}
