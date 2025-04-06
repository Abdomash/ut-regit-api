import type { Context } from "hono";
import apiDocs from "../../api-docs.md" with { type: "text" };

/**
 * docsHandler.ts
 *
 * This is responsible for handling documentation api routes.
 */
export const docsHandler = {
  /**
   * Handles the request to get the API documentation
   * @param ctx - The context object
   * @returns A JSON response containing the API documentation
   */
  getDocs: (ctx: Context) => {
    return ctx.html(
      `<!DOCTYPE html>
          <html>
            <head>
              <title>UT Reg-it Course Listings API Documentation</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body id="content">
              <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
              <script>
                document.getElementById('content').innerHTML = marked.parse(\`${apiDocs.replace(/`/g, "\\`")}\`);
              </script>
            </body>
          </html>`,
    );
  },
};
