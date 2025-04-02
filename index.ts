import { parseClassListing, type CourseListing } from "./parser";
import fs from "fs";

const filePath = "data/test";
const fileContent = fs.readFileSync(filePath, "utf8");
const classes = parseClassListing(fileContent);
console.log(classes);
fs.writeFileSync("data/test.json", JSON.stringify(classes), "utf8");

const courseListings = JSON.parse(
  fs.readFileSync("data/test.json", "utf8"),
) as CourseListing;

const PORT = 3000;

const ok = (data: any) =>
  new Response(JSON.stringify(data ?? "Nothing found"), {
    headers: { "Content-Type": "application/json" },
  });

// Create and start the server
Bun.serve({
  port: PORT,
  routes: {
    "/": () => new Response("Welcome to the Course Listings API"),
    "/semesters": () => ok(Object.keys(courseListings)),
    "/semesters/:semester": (req) => {
      const { semester } = req.params;
      const fieldsOfStudy = courseListings[semester]?.fieldsOfStudy.map(
        (fos) => fos.deptAbbr,
      );
      return ok(fieldsOfStudy);
    },
    "/semesters/:semester/:fieldOfStudy": (req) => {
      const { semester, fieldOfStudy } = req.params;
      const courses = courseListings[semester]?.fieldsOfStudy
        .find((fos) => fos.deptAbbr === fieldOfStudy)
        ?.courses.map((course) => course.courseNumber);
      return ok(courses);
    },

    "/semesters/:semester/:fieldOfStudy/:course": (req) => {
      const { semester, fieldOfStudy, course } = req.params;
      const topics = courseListings[semester]?.fieldsOfStudy
        .find((fos) => fos.deptAbbr === fieldOfStudy)
        ?.courses.find((c) => c.courseNumber === course)?.topics;

      if (topics?.length === 1) {
        return ok(topics[0]);
      }
      return ok(topics?.map((topic) => topic.topicNumber));
    },
    "/semesters/:semester/:fieldOfStudy/:course/:topic": (req) => {
      const { semester, fieldOfStudy, course, topic } = req.params;
      const sections = courseListings[semester]?.fieldsOfStudy
        .find((fos) => fos.deptAbbr === fieldOfStudy)
        ?.courses.find((c) => c.courseNumber === course)
        ?.topics.find((t) => t.topicNumber === topic)
        ?.sections.map((section) => section.uniqueNumber);
      return ok(sections);
    },
    "/semesters/:semester/:fieldOfStudy/:course/:topic/:section": (req) => {
      const { semester, fieldOfStudy, course, topic, section } = req.params;
      const sectionData = courseListings[semester]?.fieldsOfStudy
        .find((fos) => fos.deptAbbr === fieldOfStudy)
        ?.courses.find((c) => c.courseNumber === course)
        ?.topics.find((t) => t.topicNumber === topic)
        ?.sections.find((s) => s.uniqueNumber === section);
      return ok(sectionData);
    },
  },
  error(error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  },
});

console.log(`Server is running at http://localhost:${PORT}`);
