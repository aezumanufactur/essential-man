window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRProductSubscriptionSelector"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data(
      "MFRProductSubscriptionSelector",
      ({ sellingPlanType = "one-time", sellingPlanId, originalPrice = 0 }) => ({
        // Global Variables here

        // DOM selector strings used to query elements within the component
        selectors: {
          planOption: "[name='selling_plan_id']:checked", // Finds the currently selected selling plan radio button
        },

        // Stores the ID of the currently selected selling plan
        sellingPlanId: null,

        // Defines the type of purchase: "one-time" for single purchases or "subscription" for recurring orders
        sellingPlanType,

        // Duplicate property that stores the selling plan ID (note: this shadows the one above)
        sellingPlanId,

        // Holds the calculated discount percentage as a decimal (e.g., 0.15 for 15% off)
        preselectedDiscount: 0,

        // The base price of the product before any subscription discounts are applied
        originalPrice,

        // Lifecycle hook that runs when the component is initialized
        init() {
          // Waits for the next DOM update cycle to ensure all elements are fully rendered
          this.$nextTick(() => {
            // Calculates and stores the initial discount for the selected plan
            const discount = this.getDiscount(this);
          });
        },

        // Global Functions here

        /**
         * Calculates the discount percentage based on the selected selling plan
         * Supports three discount types: percentage, fixed amount, and absolute price
         *
         * @param {Object} subscriptionSelector - The component instance containing plan data
         * @returns {number} The discount as a decimal (0-1 range) or 0 for one-time purchases
         */
        getDiscount(subscriptionSelector) {
          // Retrieves the currently selected selling plan object
          const sellingPlan =
            subscriptionSelector.getSelectedPlan(subscriptionSelector);

          // Returns 0 if no plan is found
          if (!sellingPlan) return 0;

          // Extracts the first price adjustment rule from the selling plan
          const priceAdjustment = sellingPlan.price_adjustments[0];

          // Returns 0 if no price adjustment exists
          if (!priceAdjustment) return 0;

          // Will store the final calculated discount percentage
          let discountPercentage;

          // Handles percentage-based discounts (e.g., "Save 15%")
          if (priceAdjustment.value_type == "percentage") {
            // Converts the percentage to a decimal (15 becomes 0.15)
            discountPercentage = priceAdjustment.value / 100;
          }
          // Handles fixed amount discounts (e.g., "Save $10")
          else if (priceAdjustment.value_type == "fixed_amount") {
            // Calculates what percentage the fixed amount represents of the original price
            // Example: $10 off a $50 item = (10/50)*100 = 20%, then /100 = 0.20
            discountPercentage =
              parseFloat(
                (priceAdjustment.value / subscriptionSelector.originalPrice) *
                  100
              ).toFixed(2) / 100;
          }
          // Handles absolute price discounts (e.g., "Now $40" when original was $50)
          else if (priceAdjustment.value_type == "price") {
            // Calculates the discount by comparing the new price to the original
            // Uses Math.abs() to ensure a positive percentage value
            // Example: ($40 - $50) / $50 * 100 = -20%, abs() = 20%, then /100 = 0.20
            discountPercentage = Math.abs(
              parseFloat(
                ((priceAdjustment.value - subscriptionSelector.originalPrice) /
                  subscriptionSelector.originalPrice) *
                  100
              ).toFixed(2) / 100
            );
          }

          // Stores the calculated discount in the component for later use
          subscriptionSelector.preselectedDiscount = discountPercentage;

          // Returns 0 for one-time purchases (no subscription discount), otherwise returns the calculated discount
          return this.sellingPlanType == "one-time" ? 0 : discountPercentage;
        },

        /**
         * Retrieves the currently selected selling plan from the DOM
         * Locates the checked radio button and extracts its Alpine.js data
         *
         * @param {Object} subscriptionSelector - The component instance (optional, defaults to 'this')
         * @returns {Object|null} The selling plan JSON object or null if none selected
         */
        getSelectedPlan(subscriptionSelector) {
          // Uses the provided instance or defaults to the current component context
          subscriptionSelector = subscriptionSelector ?? this;

          // Queries the DOM for the checked selling plan radio button within this component
          const $planOption = subscriptionSelector.$el.querySelector(
            subscriptionSelector.selectors.planOption
          );

          // Returns undefined if no radio button is currently checked
          if (!$planOption) return;

          // Retrieves the Alpine.js data object attached to the radio button element
          const alpineData = Alpine.$data($planOption);

          // Returns the plan JSON data if available, otherwise returns null
          return alpineData.planJSON ?? null;
        },
      })
    );
  });

  window._mfrAlpineRegistered["MFRProductSubscriptionSelector"] = true;
}
