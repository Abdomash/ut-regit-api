/**
 * UT Reg-it Course Listings API Server
 *
 * This server provides access to course listings data loaded from a JSON file.
 * It exposes endpoints to browse semesters, fields of study, courses, and sections.
 */

import { type Server } from "bun";
import type { SemesterCourseListing } from "./types";
import apiDocs from "../api-docs.md" with { type: "text" };

/**
 * Default port for the server
 */
const DEFAULT_PORT = 3000;

/**
 * Creates a successful JSON response
 * @param data - The data to be returned in the response
 * @returns A Response object with the JSON data
 */
const okResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data ?? null, null, 2), {
    headers: { "Content-Type": "application/json" },
    status,
  });
};

/**
 * Creates an error JSON response
 * @param message - The error message
 * @param status - The HTTP status code
 * @returns A Response object with the error message
 */
const errorResponse = (message: string, status = 400) => {
  return new Response(
    JSON.stringify({
      error: message,
    }),
    {
      headers: { "Content-Type": "application/json" },
      status,
    },
  );
};

/**
 * Main function to start the server
 */
export function serveCourseListingApi(courseListings: SemesterCourseListing[]) {
  // Get port from environment variable or use default
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

  // Create and start the server
  const server: Server = Bun.serve({
    port: PORT,
    routes: {
      /**
       * Root endpoint - Welcome message
       */
      "/": new Response(
        "Welcome to UT Reg-it Course Listings API!\n\n" +
          "Available endpoints:\n" +
          "\t- `/docs`:      for documentation (in html)\n" +
          "\t- `/semesters`: for semesters data",
        {
          headers: { "Content-Type": "text/plain" },
        },
      ),

      /**
       * API documentation
       */
      "/docs": new Response(
        `
        <!DOCTYPE html>
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
        {
          headers: { "Content-Type": "text/html" },
        },
      ),

      /**
       * Lists all available semesters
       */
      "/semesters": okResponse(
        courseListings.map((listing) => listing.semesterId),
      ),
      "/semesters/": (req) => Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists the details of a specific semester without the courses
       */
      "/semesters/:semester": (req) => {
        const { semester } = req.params;

        if (!semester || semester.trim() === "") {
          return errorResponse("Missing semester parameter");
        }

        const courseListing = courseListings.find(
          (listing) => listing.semesterId === semester,
        );

        if (!courseListing) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const { courses, ...data } = courseListing;

        return okResponse(data);
      },
      "/semesters/:semester/": (req) => Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists all courses for a specific field of study in a semester
       */
      "/semesters/:semester/:fieldOfStudy": (req) => {
        const { semester, fieldOfStudy } = req.params;

        if (!semester || semester.trim() === "") {
          return errorResponse("Missing semester parameter");
        }

        if (!fieldOfStudy || fieldOfStudy.trim() === "") {
          return errorResponse("Missing field of study parameter");
        }

        const courseListing = courseListings.find(
          (listing) => listing.semesterId === semester,
        );

        if (!courseListing) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListing.fieldsOfStudy.find(
          (fos) => fos["Dept-Abbr"] === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courses = courseListing.courses.filter(
          (course) => course["Dept-Abbr"] === fieldOfStudy,
        );

        return okResponse(courses);
      },
      "/semesters/:semester/:fieldOfStudy/": (req) =>
        Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists the details for all sections with a specific course number
       */
      "/semesters/:semester/:fieldOfStudy/:course": (req) => {
        const { semester, fieldOfStudy, course } = req.params;

        if (!semester || semester.trim() === "") {
          return errorResponse("Missing semester parameter");
        }

        if (!fieldOfStudy || fieldOfStudy.trim() === "") {
          return errorResponse("Missing field of study parameter");
        }

        if (!course || course.trim() === "") {
          return errorResponse("Missing course parameter");
        }

        const courseListing = courseListings.find(
          (listing) => listing.semesterId === semester,
        );

        if (!courseListing) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListing.fieldsOfStudy.find(
          (fos) => fos["Dept-Abbr"] === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courseData = courseListing.courses.find(
          (c) => c["Course Nbr"] === course,
        );

        if (!courseData) {
          return errorResponse(
            `Course '${course}' not found in '${fieldOfStudy}'`,
          );
        }

        const coursesData = courseListing.courses.filter(
          (c) => c["Dept-Abbr"] === fieldOfStudy && c["Course Nbr"] === course,
        );

        return okResponse(coursesData);
      },
      "/semesters/:semester/:fieldOfStudy/:course/": (req) =>
        Response.redirect(req.url.slice(0, -1)),

      /**
       * Gets detailed information about a specific section
       */
      "/semesters/:semester/:fieldOfStudy/:course/:section": (req) => {
        const { semester, fieldOfStudy, course, section } = req.params;

        if (!semester || semester.trim() === "") {
          return errorResponse("Missing semester parameter");
        }

        if (!fieldOfStudy || fieldOfStudy.trim() === "") {
          return errorResponse("Missing field of study parameter");
        }

        if (!course || course.trim() === "") {
          return errorResponse("Missing course parameter");
        }

        if (!section || section.trim() === "") {
          return errorResponse("Missing section parameter");
        }

        const courseListing = courseListings.find(
          (listing) => listing.semesterId === semester,
        );

        if (!courseListing) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListing.fieldsOfStudy.find(
          (fos) => fos["Dept-Abbr"] === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courseData = courseListing.courses.find(
          (c) => c["Course Nbr"] === course,
        );

        if (!courseData) {
          return errorResponse(
            `Course '${course}' not found in '${fieldOfStudy}'`,
          );
        }

        const sectionData = courseListing.courses.filter(
          (c) =>
            c["Dept-Abbr"] === fieldOfStudy &&
            c["Course Nbr"] === course &&
            c["Unique"] === section,
        );

        if (!sectionData) {
          return errorResponse(
            `Section '${section}' not found in course '${course}'`,
          );
        }

        return okResponse(sectionData);
      },
      "/semesters/:semester/:fieldOfStudy/:course/:section/": (req) =>
        Response.redirect(req.url.slice(0, -1)),
    },

    /**
     * Global error handler for the server
     */
    error(error) {
      console.error("Server error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message:
            process.env.NODE_ENV === "development" ? error.message : undefined,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    },
  });

  console.log(`Server is running at http://localhost:${PORT}`);

  return server;
}
