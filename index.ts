/**
 * UT Reg-it Course Listings API Server
 *
 * This server provides access to course listings data loaded from a JSON file.
 * It exposes endpoints to browse semesters, fields of study, courses, topics, and sections.
 */

import fs from "fs";
import path from "path";
import { type Server } from "bun";
import type { CourseListing } from "./types";

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
function main() {
  // Get the filepath from command line arguments
  const args = process.argv.slice(2);
  const filePath = args[0];

  if (!filePath) {
    console.error("Error: Missing file path argument");
    console.error("Usage: bun run script.ts <path-to-json-file>");
    process.exit(1);
  }

  // Resolve the absolute path
  const absolutePath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found: ${absolutePath}`);
    process.exit(1);
  }

  let courseListings: CourseListing;

  try {
    // Load and parse the JSON file
    const fileContent = fs.readFileSync(absolutePath, "utf8");
    courseListings = JSON.parse(fileContent) as CourseListing;
    console.log(`Successfully loaded course data from ${absolutePath}`);
  } catch (err: unknown) {
    console.error(
      `Error loading course data: ${err instanceof Error ? err.message : err}`,
    );
    process.exit(1);
  }

  // Get port from environment variable or use default
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : DEFAULT_PORT;

  // Create and start the server
  const server: Server = Bun.serve({
    port: PORT,
    routes: {
      /**
       * Root endpoint - Welcome message
       */
      "/": () =>
        new Response("Welcome to the Course Listings API", {
          headers: { "Content-Type": "text/plain" },
        }),

      /**
       * Lists all available semesters
       */
      "/semesters": () => {
        const semesters = Object.keys(courseListings);
        return okResponse(semesters);
      },
      "/semesters/": (req) => Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists all fields of study for a specific semester
       */
      "/semesters/:semester": (req) => {
        const { semester } = req.params;

        if (!semester || semester.trim() === "") {
          return errorResponse("Missing semester parameter");
        }

        if (!courseListings[semester]) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fieldsOfStudy = courseListings[semester].fieldsOfStudy.map(
          (fos) => ({
            deptAbbr: fos.deptAbbr,
            deptName: fos.deptName,
          }),
        );

        return okResponse(fieldsOfStudy);
      },
      "/semesters/:semester/": (req) => Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists all courses for a specific field of study in a semester
       */
      "/semesters/:semester/:fieldOfStudy": (req) => {
        const { semester, fieldOfStudy } = req.params;

        if (!courseListings[semester]) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListings[semester].fieldsOfStudy.find(
          (fos) => fos.deptAbbr === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courses = fos.courses.map((course) => course.courseNumber);
        return okResponse(courses);
      },
      "/semesters/:semester/:fieldOfStudy/": (req) =>
        Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists all topics for a specific course
       */
      "/semesters/:semester/:fieldOfStudy/:course": (req) => {
        const { semester, fieldOfStudy, course } = req.params;

        if (!courseListings[semester]) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListings[semester].fieldsOfStudy.find(
          (fos) => fos.deptAbbr === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courseData = fos.courses.find((c) => c.courseNumber === course);

        if (!courseData) {
          return errorResponse(
            `Course '${course}' not found in '${fieldOfStudy}'`,
          );
        }

        const topics = courseData.topics.map((topic) => ({
          topicNumber: topic.topicNumber,
          topicTitle: topic.title,
        }));

        return okResponse(topics);
      },
      "/semesters/:semester/:fieldOfStudy/:course/": (req) =>
        Response.redirect(req.url.slice(0, -1)),

      /**
       * Lists all sections for a specific topic
       */
      "/semesters/:semester/:fieldOfStudy/:course/:topic": (req) => {
        const { semester, fieldOfStudy, course, topic } = req.params;

        if (!courseListings[semester]) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListings[semester].fieldsOfStudy.find(
          (fos) => fos.deptAbbr === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courseData = fos.courses.find((c) => c.courseNumber === course);

        if (!courseData) {
          return errorResponse(
            `Course '${course}' not found in '${fieldOfStudy}'`,
          );
        }

        const topicData = courseData.topics.find(
          (t) => t.topicNumber === topic,
        );

        if (!topicData) {
          return errorResponse(
            `Topic '${topic}' not found in course '${course}'`,
          );
        }

        const sections = topicData.sections.map((section) => ({
          uniqueNumber: section.uniqueNumber,
        }));

        return okResponse(sections);
      },
      "/semesters/:semester/:fieldOfStudy/:course/:topic/": (req) =>
        Response.redirect(req.url.slice(0, -1)),

      /**
       * Gets detailed information about a specific section
       */
      "/semesters/:semester/:fieldOfStudy/:course/:topic/:section": (req) => {
        const { semester, fieldOfStudy, course, topic, section } = req.params;

        if (!courseListings[semester]) {
          return errorResponse(`Semester '${semester}' not found`);
        }

        const fos = courseListings[semester].fieldsOfStudy.find(
          (fos) => fos.deptAbbr === fieldOfStudy,
        );

        if (!fos) {
          return errorResponse(
            `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
          );
        }

        const courseData = fos.courses.find((c) => c.courseNumber === course);

        if (!courseData) {
          return errorResponse(
            `Course '${course}' not found in '${fieldOfStudy}'`,
          );
        }

        const topicData = courseData.topics.find(
          (t) => t.topicNumber === topic,
        );

        if (!topicData) {
          return errorResponse(
            `Topic '${topic}' not found in course '${course}'`,
          );
        }

        const sectionData = topicData.sections.find(
          (s) => s.uniqueNumber === section,
        );

        if (!sectionData) {
          return errorResponse(
            `Section '${section}' not found in topic '${topic}'`,
          );
        }

        return okResponse(sectionData);
      },
      "/semesters/:semester/:fieldOfStudy/:course/:topic/:section/": (req) =>
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

// Start the server
main();
