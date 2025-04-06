import type { Context } from "hono";
import type { SemesterCourseListing } from "../types";

/**
 * rootHandler.ts
 *
 * This is responsible for handling root api routes.
 * It serves as the entry point for the API and handles the main routes.
 */
export const rootHandler = {
  /**
   * Handles the request to get the API page
   * @param ctx - The context object
   * @returns A Text response containing the API page
   */
  getRoot: (ctx: Context, courseListings: SemesterCourseListing[]) => {
    const formattedSemesters = courseListings
      .map((listing) => {
        const { semesterId, reportDate } = listing;
        const semesterName = listing.courses[0]?.semesterName;
        const lastUpdated = new Date(reportDate).toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return `- ${semesterName} (${semesterId}): Last updated ${lastUpdated}`;
      })
      .join("\n");

    return ctx.text(`
Welcome to UT Reg-it Course Listings API!

Available Semesters:
${formattedSemesters}

This API provides access to UT course listings data with the following endpoints:

- GET /docs                                                API documentation in HTML format
- GET /semesters                                           List all available semesters
- GET /semesters/:semester                                 Get details for a specific semester
- GET /semesters/:semester/:fieldOfStudy                   List all courses in a field of study
- GET /semesters/:semester/:fieldOfStudy/:course           Get all sections of a specific course
- GET /semesters/:semester/:fieldOfStudy/:course/:section  Get details for a specific section

For complete documentation, visit the /docs endpoint.
`);
  },
};
