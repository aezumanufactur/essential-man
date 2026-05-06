window._mfrAlpineRegistered = window._mfrAlpineRegistered || {};

if (!window._mfrAlpineRegistered["MFRArticlesFetcher"]) {
  document.addEventListener("alpine:init", () => {
    Alpine.data(
      "MFRArticlesFetcher",
      ({
        blogTitle,
        excludeTaggedWith = [],
        showOnlyTaggedWith = [],
        includeTagsUseAny = false,
        pageSize = 50,
        metafields = [],
        appendMode = false, // ← toggle: true = append, false = replace
      }) => ({
        VERSION: "2025-07",
        API_URL: null,
        TOKEN: "58186b44f75c0208944765a0a2b4cdb0",
        QUERY: `
        query($first:Int!, $after:String, $q:String!, $metafields:[HasMetafieldsIdentifier!]!) {
          articles(first: $first, after: $after, query: $q, sortKey: PUBLISHED_AT, reverse: true) {
            edges {
              cursor
              node {
                id
                handle
                title
                blog { handle }
                tags
                publishedAt
                image {
                  height
                  width
                  url(transform: {maxWidth: 720, preferredContentType: WEBP})
                }
                ${
                  metafields.length
                    ? `
                    metafields(identifiers: $metafields) {
                      key
                      value
                    }`
                    : ""
                }
              }
            }
            pageInfo { hasNextPage }
          }
        }
      `,
        term: "",
        blogTitle: blogTitle,
        excludeTaggedWith,
        showOnlyTaggedWith,
        includeTagsUseAny,
        pageSize,
        appendMode, // ← store toggle

        // UI state
        shownArticles: [],
        loading: false,
        error: "",
        noResult: false,

        // Paging state
        page: 1, // ← change me to fetch a page
        hasNext: false,
        hasPrev: false,
        _pageItems: Object.create(null), // pageNumber -> items[]
        _pageCursors: { 1: null }, // pageNumber -> "after" cursor (page 1 = null)
        _hasNextMap: Object.create(null), // pageNumber -> boolean

        mfKeys: ["read_time"],
        _saved: Object.create(null),

        metafieldIdentifiers() {
          return (
            this.mfKeys && this.mfKeys.length ? this.mfKeys : ["nice_title"]
          ).map((e) => ({ namespace: "mfr_fields", key: e }));
        },

        _termKey() {
          return [
            (this.blogTitle || "").toLowerCase(),
            (this.term || "").trim().toLowerCase(),
            (this.excludeTaggedWith || [])
              .map((t) => String(t).toLowerCase())
              .sort()
              .join(","),
            (this.showOnlyTaggedWith || [])
              .map((t) => String(t).toLowerCase())
              .sort()
              .join(","),
            this.includeTagsUseAny ? "any" : "all",
            String(this.pageSize),
          ].join("|");
        },

        _getSaved(key) {
          return this._saved[key] || null;
        },
        _save(key, payload) {
          this._saved[key] = payload;
        },

        init() {
          this.API_URL = `/api/${this.VERSION}/graphql.json`;

          // React to inputs
          this.$watch("term", () => this.searchFirstPage());
          this.$watch("excludeTaggedWith", () => this.searchFirstPage());
          this.$watch("showOnlyTaggedWith", () => this.searchFirstPage());
          this.$watch("includeTagsUseAny", () => this.searchFirstPage());

          // React to pagination + update mode
          this.$watch("page", (p) => this.fetchPage({ page: Number(p) || 1 }));
          // this.$watch("appendMode", () => this.fetchPage({ page: this.page }));

          this.searchFirstPage();
        },

        // Build Shopify query
        buildQuery(
          term,
          blogTitle = "",
          excludes = [],
          includes = [],
          includeAny = false
        ) {
          const quote = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
          const tokens = [];
          if (blogTitle) tokens.push(`blog_title:${quote(blogTitle)}`);
          if (term) tokens.push(`${term}*`);

          const inc = (includes || []).filter(Boolean);
          if (inc.length) {
            if (includeAny) {
              const orGroup = inc
                .map((tag) => `tag:${quote(tag)}`)
                .join(" OR ");
              tokens.push(`(${orGroup})`);
            } else {
              inc.forEach((tag) => tokens.push(`tag:${quote(tag)}`));
            }
          }

          (excludes || [])
            .filter(Boolean)
            .forEach((tag) => tokens.push(`NOT tag:${quote(tag)}`));
          return tokens.join(" ").trim();
        },

        async sf(query, variables = {}) {
          const res = await axios.post(
            this.API_URL,
            { query, variables },
            {
              headers: {
                "Content-Type": "application/json",
                "X-Shopify-Storefront-Access-Token": this.TOKEN,
              },
            }
          );
          const { data, errors } = res.data || {};
          if (errors) throw errors;
          return data;
        },

        // Low-level: fetch one server "page" by after-cursor
        async _fetchServerPage(after) {
          const q = this.buildQuery(
            this.term,
            this.blogTitle,
            this.excludeTaggedWith,
            this.showOnlyTaggedWith,
            this.includeTagsUseAny
          );

          const vars = {
            first: this.pageSize,
            after,
            q,
            metafields: this.metafieldIdentifiers(),
          };

          const { articles } = await this.sf(this.QUERY, vars);

          let nodes = (articles.edges || []).map((e) => {
            const n = e.node;
            const blog = n.blog?.handle || this.blogTitle || "";
            const url = blog ? `/blogs/${blog}/${n.handle}` : null;
            let metafields;
            if (n.metafields) {
              metafields =
                n.metafields.length && n.metafields[0]
                  ? Object.fromEntries(
                      (n.metafields || []).map((m) => [m.key, m.value])
                    )
                  : [];
            }
            return { ...n, url, metafields };
          });

          // Fallback filters (if server query didn't fully filter)
          if (this.excludeTaggedWith?.length) {
            const excludes = new Set(
              this.excludeTaggedWith.map((t) => String(t).toLowerCase())
            );
            nodes = nodes.filter(
              (n) =>
                !(n.tags || []).some((t) =>
                  excludes.has(String(t).toLowerCase())
                )
            );
          }
          if (this.showOnlyTaggedWith?.length) {
            const includes = this.showOnlyTaggedWith.map((t) =>
              String(t).toLowerCase()
            );
            nodes = nodes.filter((n) => {
              const tagSet = new Set(
                (n.tags || []).map((t) => String(t).toLowerCase())
              );
              return this.includeTagsUseAny
                ? includes.some((t) => tagSet.has(t))
                : includes.every((t) => tagSet.has(t));
            });
          }

          const endCursor = articles.edges.at(-1)?.cursor ?? null;
          const hasNext = !!articles.pageInfo?.hasNextPage;

          return { items: nodes, endCursor, hasNext };
        },

        // Ensure we know the "after" cursor for a given page (walk sequentially if needed)
        async _ensureCursorForPage(targetPage) {
          if (this._pageCursors[targetPage] !== undefined)
            return this._pageCursors[targetPage];

          // Find the nearest known page < target
          const knownPages = Object.keys(this._pageCursors)
            .map(Number)
            .filter((n) => n < targetPage)
            .sort((a, b) => b - a);
          let startPage = knownPages[0] || 1;
          let after = this._pageCursors[startPage];

          // Walk forward filling cursors and cache items
          for (let p = startPage; p < targetPage; p++) {
            const { items, endCursor, hasNext } = await this._fetchServerPage(
              after
            );
            this._pageItems[p] = items;
            this._hasNextMap[p] = hasNext;
            this._pageCursors[p + 1] = endCursor; // cursor to get the NEXT page
            after = endCursor;
            if (!items.length && !hasNext) break;
          }
          return this._pageCursors[targetPage];
        },

        // Public: fetch a specific page, then update shownArticles according to appendMode
        async fetchPage({ page = 1 } = {}) {
          page = Math.max(1, Number(page) || 1);
          if (this.loading) return;

          this.loading = true;
          this.error = "";

          try {
            // Make sure we have the cursor leading into this page
            const after = await this._ensureCursorForPage(page);

            // If we already cached items for this page, use them; else fetch now
            let items = this._pageItems[page];
            let hasNext;

            if (!items) {
              const result = await this._fetchServerPage(after);
              items = result.items;
              hasNext = result.hasNext;
              this._pageItems[page] = items;
              this._hasNextMap[page] = !!hasNext;
              this._pageCursors[page + 1] = result.endCursor;
            }

            // Update UI
            this.page = page; // normalize
            this.hasPrev = page > 1;
            this.hasNext = !!this._hasNextMap[page];

            if (this.appendMode) {
              this.shownArticles = [...this.shownArticles, ...items];
            } else {
              this.shownArticles = items;
            }

            this.noResult = this.shownArticles.length === 0;

            // Cache per-term
            if (page === 1) {
              this._save(this._termKey(), {
                pageSize: this.pageSize,
                page1Items: items,
                page1HasNext: !!this._hasNextMap[1],
                page1EndCursor: this._pageCursors[2] ?? null,
              });
            }

            this.$nextTick(() => {
              if (ScrollTrigger && ScrollTrigger.refresh)
                ScrollTrigger.refresh();
            });
          } catch (err) {
            this.error = "Something went wrong loading articles.";
            console.error(err);
          } finally {
            this.loading = false;
          }
        },

        // Reset caches and load page 1
        async searchFirstPage() {
          this._pageItems = Object.create(null);
          this._pageCursors = { 1: null };
          this._hasNextMap = Object.create(null);
          this.shownArticles = [];
          this.appendMode = false;
          this.page = 1;

          const key = this._termKey();
          const saved = this._getSaved(key);

          if (
            saved &&
            saved.pageSize === this.pageSize &&
            Array.isArray(saved.page1Items)
          ) {
            this._pageItems[1] = saved.page1Items;
            this.shownArticles = saved.page1Items;
            this.noResult = this.shownArticles.length === 0;

            // optimistic so Load More button appears; corrected after first fetch
            this._hasNextMap[1] = saved.page1HasNext ?? true;

            // if we cached page1 endCursor earlier, reuse it so page 2 doesn't refetch page 1
            if (saved.page1EndCursor != null)
              this._pageCursors[2] = saved.page1EndCursor;

            this.$nextTick(() => {
              if (window.ScrollTrigger && window.ScrollTrigger.refresh)
                window.ScrollTrigger.refresh();
            });
          } else {
            await this.fetchPage({ page: 1 });
          }
        },

        // Convenience helpers
        async nextPage() {
          if (this.loading) return;
          const known = this._hasNextMap[this.page];
          if (known === false) return; // only block when explicitly no next
          this.page = this.page + 1; // watcher triggers fetch
        },
        async prevPage() {
          if (this.loading) return;
          if (this.page <= 1) return;
          this.page = this.page - 1; // watcher will fetch
        },
      })
    );
  });

  window._mfrAlpineRegistered["MFRArticlesFetcher"] = true;
}