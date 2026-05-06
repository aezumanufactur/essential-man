# Tailwind Migration Progress

> Mark files `🔄 In Progress` before editing, `✅ Done` when complete, `⚠️ Needs Fix` when a visual issue is spotted, `🗑️ Removed` when deleted (unused). Update summary counts each time.

---

## Summary
- ✅ Done: 200
- 🔄 In Progress: 0
- ⏳ Pending: 0

| Folder | Total | ✅ Done | 🔄 In Progress | ⏳ Pending |
|--------|-------|---------|----------------|------------|
| `sections/` | 50 | 50 | 0 | 0 |
| `blocks/` | 70 | 70 | 0 | 0 |
| `snippets/` | 80 | 80 | 0 | 0 |

---

## SCSS Reference Shortcuts

Use these references before searching. Keep this compact: do **not** add a SCSS column to every row unless a file is an exception to these rules.

**Default lookup rules**
- Section: `sections/name.liquid` usually maps to `styles/sections/name.scss`
- Shared blocks: check `styles/core/blocks.scss`, then component refs below
- Third-party/generated DOM: `styles/plugins/*.scss` (`flickity`, `gsap`, `klaviyo`, `lottie`, `lozad`, `okendo`, `shopify-app-blocks`, `shopify-option-selectors`; Alpine excluded)
- Global wrappers/settings: `styles/core/section-content.scss`, `styles/core/section-spacer.scss`, `styles/core/layout.scss`, `styles/core/typography.scss`, `styles/core/forms.scss`

**Pending section exceptions**
| Liquid file | SCSS reference |
|-------------|----------------|
| `sections/cart-template.liquid` | `styles/templates/cart.scss`, cart/product component SCSS |
| `sections/footer.liquid` / `sections/footer__socket.liquid` | `styles/footer.scss`, `styles/components/social-links.scss`, `styles/plugins/klaviyo.scss`, `styles/plugins/lottie.scss` |
| `sections/header.liquid` | `styles/header.scss`, `styles/components/mega-menu.scss`, `styles/components/dropdown-menu.scss`, `styles/components/search.scss`, `styles/plugins/lottie.scss` |
| `sections/header__announcement-bar.liquid` | `styles/components/announcement-bar.scss`, `styles/header.scss` |
| `sections/header__mobile-menu.liquid` | `styles/header__mobile-menu.scss`, `styles/header.scss`, `styles/components/mega-menu.scss`, `styles/components/dropdown-menu.scss` |
| `sections/main-404.liquid` | `styles/pages/page-404.scss` |
| `sections/mfr-password__section.liquid` | `styles/pages/password.scss` |
| `sections/mfr-product__top.liquid` | `styles/sections/mfr-product__top.scss`, `styles/templates/product.scss`, `styles/components/product-*.scss`, `styles/plugins/flickity.scss`, `styles/plugins/okendo.scss` |
| `sections/mfr-search__predictive.liquid` | `styles/components/predictive-search.scss`, `styles/components/search.scss`, `styles/header.scss` |
| `sections/offcanvas-login.liquid` | `styles/components/mfr-offcanvas.scss`, `styles/core/forms.scss` |
| `sections/offcanvas-product-form.liquid` | `styles/templates/product.scss`, `styles/components/product-*.scss`, `styles/components/variant-selector.scss`, `styles/components/subscription*.scss` |
| `sections/offcanvas-search.liquid` | `styles/components/mfr-offcanvas.scss`, `styles/components/search.scss`, `styles/components/predictive-search.scss` |
| `sections/preloader.liquid` | inline section styles/scripts; `styles/plugins/gsap.scss` only if generated GSAP wrapper styling is needed |

**Pending block/snippet component refs**
| Liquid group | SCSS reference |
|--------------|----------------|
| `blocks/_card*.liquid`, `snippets/partial__*card*.liquid` | `styles/components/card.scss`, `styles/components/product-card.scss`, `styles/components/product-card-large.scss`, `styles/components/collection-card.scss`, `styles/components/blog-card.scss`, `styles/components/review-card.scss` |
| `blocks/_add-to-cart.liquid`, `snippets/component__add-to-cart-button.liquid`, `snippets/product-top__*.liquid` | `styles/templates/product.scss`, `styles/components/buttons.scss`, `styles/components/quantity-*.scss`, `styles/components/variant-selector.scss`, `styles/components/subscription*.scss`, `styles/components/product-*.scss` |
| `blocks/_contact-form__*.liquid` | `styles/core/forms.scss`, `styles/sections/mfr-core__form-section.scss` |
| `blocks/_icon-text*.liquid` | `styles/components/icon-text.scss` |
| `blocks/_image-banner.liquid`, image/video snippets | `styles/components/background.scss`, `styles/components/image-placeholders.scss`, `styles/components/video.scss`, `styles/components/responsive-video.scss` |
| `blocks/_list-item.liquid` | `styles/components/list.scss` |
| `blocks/_product-specifications.liquid`, `_product-ugc.liquid`, `_product_faqs.liquid` | `styles/templates/product.scss`, `styles/components/accordion.scss`, `styles/plugins/okendo.scss` as needed |
| `blocks/_review-card.liquid`, `snippets/partial__review-card.liquid` | `styles/components/review-card.scss` |
| `blocks/_section-content__icon-text-item.liquid` | `styles/core/section-content.scss`, `styles/components/icon-text.scss` |
| `blocks/_stacked-card*.liquid` | `styles/components/card.scss` |
| `blocks/_table__row.liquid` | `styles/sections/mfr-core__table-section.scss` |
| `snippets/component__button.liquid`, `renderer__block-button.liquid` | `styles/components/buttons.scss` |
| `snippets/component__header-logo.liquid`, `footer__logo.liquid` | `styles/header.scss`, `styles/footer.scss`, `styles/plugins/lottie.scss` |
| `snippets/component__lazyload-image.liquid`, responsive image snippets | `styles/plugins/lozad.scss`, `styles/components/image-placeholders.scss` |
| `snippets/component__play-pause.liquid`, video snippets | `styles/components/play-pause-button.scss`, `styles/components/video.scss`, `styles/components/responsive-video.scss` |
| `snippets/component__product-badges.liquid`, rating, price | `styles/components/product-badges.scss`, `styles/components/price.scss`, `styles/plugins/okendo.scss` |
| `snippets/component__quantity-selector-v2.liquid` | `styles/components/quantity-selector.scss`, `styles/components/quantity-picker.scss` |
| `snippets/component__section-dividers.liquid` | `styles/components/section-dividers.scss`, `styles/plugins/lottie.scss` |
| `snippets/component__social-links.liquid`, footer social snippets | `styles/components/social-links.scss`, `styles/footer.scss` |
| `snippets/footer__*.liquid` | `styles/footer.scss`, `styles/plugins/klaviyo.scss`, `styles/plugins/lottie.scss` |
| `snippets/header__*.liquid`, `search__form.liquid` | `styles/header.scss`, `styles/components/search.scss`, `styles/components/predictive-search.scss`, `styles/components/mega-menu.scss` |
| `snippets/mfr-component__*.liquid` | matching `styles/components/mfr-*.scss` or component SCSS (`accordion`, `dropdown-menu`, `mfr-carousel`, `mfr-offcanvas`, `mfr-popup`, `mfr-tab`) |
| `snippets/icon__*.liquid`, `schema__*.liquid`, `script*.liquid`, `meta-tags.liquid`, `preload__fonts.liquid`, `quickload-css.liquid`, `style-tags*.liquid` | usually no migration styling; inspect only if classes are present |

---

## Sections (`sections/`) (50 files: all done)

| Status | Liquid File |
|--------|-------------|
| ✅ Done | `sections/footer.liquid` |
| ✅ Done | `sections/footer__socket.liquid` |
| ✅ Done | `sections/header.liquid` |
| ✅ Done | `sections/header__announcement-bar.liquid` |
| ✅ Done | `sections/header__mobile-menu.liquid` |
| ✅ Done | `sections/main-404.liquid` |
| ✅ Done | `sections/main-page.liquid` |
| ✅ Done | `sections/mfr-accounts__addresses.liquid` |
| ✅ Done | `sections/mfr-accounts__dashboard.liquid` |
| ✅ Done | `sections/mfr-accounts__login.liquid` |
| ✅ Done | `sections/mfr-accounts__register.liquid` |
| ✅ Done | `sections/mfr-article__comments.liquid` |
| ✅ Done | `sections/mfr-article__content.liquid` |
| ✅ Done | `sections/mfr-article__header.liquid` |
| ✅ Done | `sections/mfr-article__related-articles.liquid` |
| ✅ Done | `sections/mfr-blog__carousel.liquid` |
| ✅ Done | `sections/mfr-blog__featured-article.liquid` |
| ✅ Done | `sections/mfr-blog__grid.liquid` |
| ✅ Done | `sections/mfr-collection__carousel.liquid` |
| ✅ Done | `sections/mfr-collection__highlights.liquid` |
| ✅ Done | `sections/mfr-collection__list.liquid` |
| ✅ Done | `sections/mfr-collection__product-grid.liquid` |
| ✅ Done | `sections/mfr-core__accordion-section.liquid` |
| ✅ Done | `sections/mfr-core__banner-with-box.liquid` |
| ✅ Done | `sections/mfr-core__customer-testimonials.liquid` |
| ✅ Done | `sections/mfr-core__embed-section.liquid` |
| ✅ Done | `sections/mfr-core__form-section.liquid` |
| ✅ Done | `sections/mfr-core__hero-banner.liquid` |
| ✅ Done | `sections/mfr-core__image-video-banner.liquid` |
| ✅ Done | `sections/mfr-core__image-video-text-section.liquid` |
| ✅ Done | `sections/mfr-core__media-section.liquid` |
| ✅ Done | `sections/mfr-core__scrolling-bar.liquid` |
| ✅ Done | `sections/mfr-core__table-section.liquid` |
| ✅ Done | `sections/mfr-core__text-section.liquid` |
| ✅ Done | `sections/mfr-metaobjects__metaobject-grid.liquid` |
| ✅ Done | `sections/mfr-password__section.liquid` |
| ✅ Done | `sections/mfr-product__carousel.liquid` |
| ✅ Done | `sections/mfr-product__reviews.liquid` |
| ✅ Done | `sections/mfr-product__top.liquid` |
| ✅ Done | `sections/mfr-search__results.liquid` |
| ✅ Done | `sections/modal.liquid` |
| ✅ Done | `sections/offcanvas-cart.liquid` |
| ✅ Done | `sections/offcanvas-contact.liquid` |
| ✅ Done | `sections/offcanvas-menu.liquid` |
| ✅ Done | `sections/mfr-search__predictive.liquid` |
| ✅ Done | `sections/offcanvas-product-form.liquid` |
| ✅ Done | `sections/offcanvas-search.liquid` |
| ✅ Done | `sections/offcanvas-login.liquid` |
| ✅ Done | `sections/cart-template.liquid` |
| ✅ Done | `sections/preloader.liquid` |
---

## Blocks (`blocks/`) (70 files: all done)

| Status | Liquid File |
|--------|-------------|
| ✅ Done | `blocks/_accent-graphic.liquid` |
| ✅ Done | `blocks/_accent-graphics.liquid` |
| ✅ Done | `blocks/_accordion.liquid` |
| ✅ Done | `blocks/_accordions.liquid` |
| ✅ Done | `blocks/_add-to-cart.liquid` |
| ✅ Done | `blocks/_article-comments__form.liquid` |
| ✅ Done | `blocks/_article-header__media.liquid` |
| ✅ Done | `blocks/_article-related-articles__carousel.liquid` |
| ✅ Done | `blocks/_article-related-articles__item.liquid` |
| ✅ Done | `blocks/_banner-with-box.liquid` |
| ✅ Done | `blocks/_blog-carousel.liquid` |
| ✅ Done | `blocks/_blog-featured-article.liquid` |
| ✅ Done | `blocks/_blog-grid.liquid` |
| ✅ Done | `blocks/_blog-grid__filter.liquid` |
| ✅ Done | `blocks/_card-button.liquid` |
| ✅ Done | `blocks/_card-image.liquid` |
| ✅ Done | `blocks/_card-text.liquid` |
| ✅ Done | `blocks/_card-title.liquid` |
| ✅ Done | `blocks/_card-video.liquid` |
| ✅ Done | `blocks/_card.liquid` |
| ✅ Done | `blocks/_collection-carousel__carousel.liquid` |
| ✅ Done | `blocks/_collection-highlights.liquid` |
| ✅ Done | `blocks/_collections-grid.liquid` |
| ✅ Done | `blocks/_contact-form.liquid` |
| ✅ Done | `blocks/_contact-form__dropdown.liquid` |
| ✅ Done | `blocks/_contact-form__email.liquid` |
| ✅ Done | `blocks/_contact-form__field.liquid` |
| ✅ Done | `blocks/_contact-form__submit.liquid` |
| ✅ Done | `blocks/_customer-testimonials__carousel.liquid` |
| ✅ Done | `blocks/_customer-testimonials__item-v2.liquid` |
| ✅ Done | `blocks/_customer-testimonials__item-v3.liquid` |
| ✅ Done | `blocks/_customer-testimonials__item.liquid` |
| ✅ Done | `blocks/_hero-section__icon-text.liquid` |
| ✅ Done | `blocks/_hero-section__slide.liquid` |
| ✅ Done | `blocks/_hero-section__slides.liquid` |
| ✅ Done | `blocks/_image-video-banner__carousel.liquid` |
| ✅ Done | `blocks/_image-video-banner__image-slide.liquid` |
| ✅ Done | `blocks/_image-video-banner__video-slide.liquid` |
| ✅ Done | `blocks/_image-video-text__carousel.liquid` |
| ✅ Done | `blocks/_image-video-text__image-slide.liquid` |
| ✅ Done | `blocks/_image-video-text__video-slide.liquid` |
| ✅ Done | `blocks/_image.liquid` |
| ✅ Done | `blocks/_liquid-embed.liquid` |
| ✅ Done | `blocks/_list-item.liquid` |
| ✅ Done | `blocks/_list-wrapper.liquid` |
| ✅ Done | `blocks/_metaobjects-grid.liquid` |
| ✅ Done | `blocks/_product-carousel.liquid` |
| ✅ Done | `blocks/_product-carousel__carousel.liquid` |
| ✅ Done | `blocks/_product-grid.liquid` |
| ✅ Done | `blocks/_product_faqs.liquid` |
| ✅ Done | `blocks/_scrolling-bar__carousel.liquid` |
| ✅ Done | `blocks/_scrolling-bar__icon-text-item.liquid` |
| ✅ Done | `blocks/_section-content.liquid` |
| ✅ Done | `blocks/_section-content__button.liquid` |
| ✅ Done | `blocks/_section-content__divider.liquid` |
| ✅ Done | `blocks/_section-content__icon-text-item.liquid` |
| ✅ Done | `blocks/_section-content__icon-text-wrapper.liquid` |
| ✅ Done | `blocks/_section-content__icon.liquid` |
| ✅ Done | `blocks/_section-content__liquid-html.liquid` |
| ✅ Done | `blocks/_section-content__small-text.liquid` |
| ✅ Done | `blocks/_section-content__spacer.liquid` |
| ✅ Done | `blocks/_section-content__text.liquid` |
| ✅ Done | `blocks/_section-content__title.liquid` |
| ✅ Done | `blocks/_star-rating-text.liquid` |
| ✅ Done | `blocks/_table-section__media.liquid` |
| ✅ Done | `blocks/_table.liquid` |
| ✅ Done | `blocks/_table__item.liquid` |
| ✅ Done | `blocks/_table__row.liquid` |
| ✅ Done | `blocks/_video-with-controls.liquid` |
| ✅ Done | `blocks/_wrapped-text.liquid` |
---

## Snippets (`snippets/`) (80 files: 43 done, 37 pending)

| Status | Liquid File |
|--------|-------------|
| ✅ Done | `snippets/block__icon.liquid` |
| ✅ Done | `snippets/block__title.liquid` |
| ✅ Done | `snippets/cart__additional-fee.liquid` |
| ✅ Done | `snippets/cart__footer-message.liquid` |
| ✅ Done | `snippets/cart__form.liquid` |
| ✅ Done | `snippets/cart__note.liquid` |
| ✅ Done | `snippets/cart__price-progress-bar.liquid` |
| ✅ Done | `snippets/cart__product-upsell.liquid` |
| ✅ Done | `snippets/cart__product.liquid` |
| ✅ Done | `snippets/cart__quantity-progress-bar.liquid` |
| ✅ Done | `snippets/cart__scripts.liquid` |
| ✅ Done | `snippets/cart__submit.liquid` |
| ✅ Done | `snippets/cart__tax-note.liquid` |
| ✅ Done | `snippets/component__accent-graphics.liquid` |
| ✅ Done | `snippets/component__add-to-cart-button.liquid` |
| ✅ Done | `snippets/component__button.liquid` |
| ✅ Done | `snippets/component__gradient-bg-styles.liquid` |
| ✅ Done | `snippets/component__lazyload-image.liquid` |
| ✅ Done | `snippets/component__product-badges.liquid` |
| ✅ Done | `snippets/component__product-rating.liquid` |
| ✅ Done | `snippets/component__responsive-image-v2.liquid` |
| ✅ Done | `snippets/component__responsive-image.liquid` |
| ✅ Done | `snippets/component__section-dividers.liquid` |
| ✅ Done | `snippets/component__seo-page-title.liquid` |
| ✅ Done | `snippets/component__svg-encoder.liquid` |
| ✅ Done | `snippets/component__video-with-controls.liquid` |
| ✅ Done | `snippets/component__video.liquid` |
| ✅ Done | `snippets/css-variables.liquid` |
| ✅ Done | `snippets/footer__social-links.liquid` |
| ✅ Done | `snippets/foundation-min.liquid` |
| ✅ Done | `snippets/header__mega-menu.liquid` |
| ✅ Done | `snippets/header__search.liquid` |
| ✅ Done | `snippets/loading-spinner.liquid` |
| ✅ Done | `snippets/meta-tags.liquid` |
| ✅ Done | `snippets/mfr-component__accordion.liquid` |
| ✅ Done | `snippets/mfr-component__carousel-marquee.liquid` |
| ✅ Done | `snippets/mfr-component__carousel.liquid` |
| ✅ Done | `snippets/mfr-component__offcanvas.liquid` |
| ✅ Done | `snippets/mfr-component__popup.liquid` |
| ✅ Done | `snippets/mfr-component__tab.liquid` |
| ✅ Done | `snippets/offcanvas-menu__inner-menus.liquid` |
| ✅ Done | `snippets/pagination.liquid` |
| ✅ Done | `snippets/partial__account-login.liquid` |
| ✅ Done | `snippets/partial__alpine-metaobject-card.liquid` |
| ✅ Done | `snippets/partial__blog-card.liquid` |
| ✅ Done | `snippets/partial__collection-card.liquid` |
| ✅ Done | `snippets/partial__product-card.liquid` |
| ✅ Done | `snippets/preload__fonts.liquid` |
| ✅ Done | `snippets/price.liquid` |
| ✅ Done | `snippets/product-form__hidden-input.liquid` |
| ✅ Done | `snippets/product-form__subscription-selector.liquid` |
| ✅ Done | `snippets/product-form__variant-selector.liquid` |
| ✅ Done | `snippets/product-top__addon.liquid` |
| ✅ Done | `snippets/product-top__contained-products.liquid` |
| ✅ Done | `snippets/product-top__description.liquid` |
| ✅ Done | `snippets/product-top__form-caption.liquid` |
| ✅ Done | `snippets/product-top__form.liquid` |
| ✅ Done | `snippets/product-top__images-carousel.liquid` |
| ✅ Done | `snippets/product-top__related-products.liquid` |
| ✅ Done | `snippets/product-top__scripts.liquid` |
| ✅ Done | `snippets/product-top__submit.liquid` |
| ✅ Done | `snippets/product-top__tab.liquid` |
| ✅ Done | `snippets/quickload-css.liquid` |
| ✅ Done | `snippets/renderer__block-button.liquid` |
| ✅ Done | `snippets/renderer__block-icon.liquid` |
| ✅ Done | `snippets/renderer__color-scheme.liquid` |
| ✅ Done | `snippets/schema__all.liquid` |
| ✅ Done | `snippets/schema__article.liquid` |
| ✅ Done | `snippets/schema__breadcrumbs.liquid` |
| ✅ Done | `snippets/schema__product.liquid` |
| ✅ Done | `snippets/schema__store.liquid` |
| ✅ Done | `snippets/script__section.liquid` |
| ✅ Done | `snippets/scripts__deferred-tags.liquid` |
| ✅ Done | `snippets/scripts__initializers.liquid` |
| ✅ Done | `snippets/search__form.liquid` |
| ✅ Done | `snippets/search__item-card.liquid` |
| ✅ Done | `snippets/search__results.liquid` |
| ✅ Done | `snippets/section__settings-styles.liquid` |
| ✅ Done | `snippets/style-tags.liquid` |
| ✅ Done | `snippets/style-tags__section.liquid` |
---
