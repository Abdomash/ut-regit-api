import type { Context } from "hono";
import type { SemesterCourseListing } from "../types";

/**
 * semesterHandler.ts
 *
 * This is responsible for handling semesters api routes.
 */
export const semesterHandler = {
  /**
   * Handles the request to get all semesters
   * @param ctx - The context object
   * @param courseListings - The course listings data
   * @returns A JSON response containing the list of semesters
   */
  getSemesters: (ctx: Context, courseListings: SemesterCourseListing[]) => {
    const semesters = courseListings.map((listing) => listing.semesterId);
    return ctx.json(semesters);
  },

  /**
   * Handles the request to get a specific semester
   * @param ctx - The context object
   * @param courseListings - The course listings data
   * @returns A JSON response containing the semester data
   */
  getSemester: (ctx: Context, courseListings: SemesterCourseListing[]) => {
    const { semester } = ctx.req.param();

    if (!semester) {
      return ctx.json({ error: "Missing semester parameter" }, 400);
    }

    const courseListing = courseListings.find(
      (listing) => listing.semesterId === semester,
    );

    if (!courseListing) {
      return ctx.json({ error: `Semester '${semester}' not found` }, 404);
    }

    const { courses, ...data } = courseListing;

    return ctx.json(data);
  },

  /**
   * Handles the request to get all courses in a field of study in a semester
   * @param ctx - The context object
   * @param courseListings - The course listings data
   * @returns A JSON response containing the courses data
   */
  getCourses: (ctx: Context, courseListings: SemesterCourseListing[]) => {
    const { semester, fieldOfStudy } = ctx.req.param();

    if (!semester) {
      return ctx.json({ error: "Missing semester parameter" }, 400);
    }

    if (!fieldOfStudy) {
      return ctx.json({ error: "Missing field of study parameter" }, 400);
    }

    const courseListing = courseListings.find(
      (listing) => listing.semesterId === semester,
    );

    if (!courseListing) {
      return ctx.json({ error: `Semester '${semester}' not found` }, 404);
    }

    const fos = courseListing.fieldsOfStudy.find(
      (fos) => fos["Dept-Abbr"] === fieldOfStudy,
    );

    if (!fos) {
      return ctx.json(
        {
          error: `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
        },
        404,
      );
    }

    const courses = courseListing.courses.filter(
      (course) => course["Dept-Abbr"] === fieldOfStudy,
    );

    return ctx.json(courses);
  },

  /**
   * Handles the request to get all sections in a course in a field of study in a semester
   * @param ctx - The context object
   * @param courseListings - The course listings data
   * @returns A JSON response containing the sections data
   */
  getSections: (ctx: Context, courseListings: SemesterCourseListing[]) => {
    const { semester, fieldOfStudy, courseNbr } = ctx.req.param();

    if (!semester) {
      return ctx.json({ error: "Missing semester parameter" }, 400);
    }

    if (!fieldOfStudy) {
      return ctx.json({ error: "Missing field of study parameter" }, 400);
    }

    if (!courseNbr) {
      return ctx.json({ error: "Missing course number parameter" }, 400);
    }

    const courseListing = courseListings.find(
      (listing) => listing.semesterId === semester,
    );

    if (!courseListing) {
      return ctx.json({ error: `Semester '${semester}' not found` }, 404);
    }

    const fos = courseListing.fieldsOfStudy.find(
      (fos) => fos["Dept-Abbr"] === fieldOfStudy,
    );

    if (!fos) {
      return ctx.json(
        {
          error: `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
        },
        404,
      );
    }

    const courses = courseListing.courses.filter(
      (course) =>
        course["Dept-Abbr"] === fieldOfStudy &&
        course["Course Nbr"] === courseNbr,
    );

    return ctx.json(courses);
  },

  /**
   * Handles the request to get a specific section in a field of study in a semester
   * @param ctx - The context object
   * @param courseListings - The course listings data
   * @returns A JSON response containing the course data
   */
  getSection: (ctx: Context, courseListings: SemesterCourseListing[]) => {
    const { semester, fieldOfStudy, courseNbr, section } = ctx.req.param();

    if (!semester) {
      throw new Error("Missing semester parameter");
    }

    if (!fieldOfStudy) {
      throw new Error("Missing field of study parameter");
    }

    if (!courseNbr) {
      throw new Error("Missing course number parameter");
    }

    if (!section) {
      throw new Error("Missing section parameter");
    }

    const courseListing = courseListings.find(
      (listing) => listing.semesterId === semester,
    );

    if (!courseListing) {
      return ctx.json({ error: `Semester '${semester}' not found` }, 404);
    }

    const fos = courseListing.fieldsOfStudy.find(
      (fos) => fos["Dept-Abbr"] === fieldOfStudy,
    );

    if (!fos) {
      return ctx.json(
        {
          error: `Field of study '${fieldOfStudy}' not found in semester '${semester}'`,
        },
        404,
      );
    }

    const courses = courseListing.courses.filter(
      (course) => course["Unique"] === section,
    );

    return ctx.json(courses);
  },
};
