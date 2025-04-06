/**
 * UT Reg-it Course Listings API Server
 *
 * This server provides access to course listings data loaded from a JSON file.
 * It exposes endpoints to browse semesters, fields of study, courses, and sections.
 */

import { type Context, Hono } from "hono";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";

import type { SemesterCourseListing } from "../types";
import { rootHandler } from "./rootHandler";
import { semesterHandler } from "./semestersHandler";
import { docsHandler } from "./docsHandler";

/**
 * Default port for the server
 */
const DEFAULT_PORT = 3000;

/**
 * Main function to start the server
 */
export function serveCourseListingApi(courseListings: SemesterCourseListing[]) {
  // Get port from environment variable or use default
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

  const app = new Hono();
  app.use("*", trimTrailingSlash());
  app.use("*", cors());

  app.notFound((c) => c.text("404 Not Found", 404));
  app.onError((err, c) => {
    console.error(err);
    return c.text("500 Internal Server Error", 500);
  });

  app.get("/", (c: Context) => rootHandler.getRoot(c, courseListings));
  app.get("/docs", docsHandler.getDocs);

  app.get("/semesters", (c: Context) =>
    semesterHandler.getSemesters(c, courseListings),
  );

  app.get("/semesters/:semester", (c: Context) =>
    semesterHandler.getSemester(c, courseListings),
  );

  app.get("/semesters/:semester/:fieldOfStudy", (c: Context) =>
    semesterHandler.getCourses(c, courseListings),
  );

  app.get("/semesters/:semester/:fieldOfStudy/:course", (c: Context) =>
    semesterHandler.getSections(c, courseListings),
  );

  app.get("/semesters/:semester/:fieldOfStudy/:course/:section", (c: Context) =>
    semesterHandler.getSection(c, courseListings),
  );

  Bun.serve({
    fetch: app.fetch,
    port: PORT,
  });
}
