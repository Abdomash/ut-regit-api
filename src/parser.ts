import type { Course, SemesterCourseListing } from "./types";

/**
 * Parses a course listing text file
 * @param fileContent The content of the course listing text file
 * @returns A structured object containing the course data for a specific semester
 */
export function parseCourseListing(fileContent: string): SemesterCourseListing {
  // Split into lines
  const lines = fileContent.split("\n");

  // Find the report date and time line and data start line
  let reportDate = new Date();
  let dataStartIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();

    if (!line) continue; // Skip empty lines

    // Extract report date and time
    if (line.startsWith("Report of all active classes for")) {
      const match = line.match(
        /Report of all active classes for \d+ as of (.+) at (.+)/,
      );

      if (!match) {
        console.error(
          `Failed to parse report date and time from line: ${line}`,
        );
        continue;
      }

      const date = match[1]?.trim(); // e.g., "04/02/2025"
      const time = match[2]?.trim(); // e.g., "00:19:30.1"
      if (!date || !time) {
        console.error(`Failed to parse date/time from line: ${line}`);
        continue;
      }
      const [month, day, year] = date.split("/");
      const [hour, minute, second] = time.split(":");
      if (!month || !day || !year || !hour || !minute || !second) {
        console.error(
          `Failed to parse date/time components from line: ${line}`,
        );
        continue;
      }
      reportDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseFloat(second),
      );
    }

    // Find the line with column headers (Year, Semester, etc.)
    if (line.startsWith("Year")) {
      dataStartIndex = i + 1; // Data starts right after the headers
      break;
    }
  }

  // Parse each data line
  const rawData: any[] = [];
  for (let i = dataStartIndex; i < lines.length; i++) {
    const line = lines[i]?.trim();

    // Skip empty lines
    if (!line) continue;

    // Split by tabs
    const fields = line.split("\t");

    // Skip if we don't have enough fields
    if (fields.length < 15) continue;

    try {
      rawData.push({
        year: fields[0]?.trim() || "",
        semester: fields[1]?.trim() || "",
        deptAbbr: fields[2]?.trim() || "",
        deptName: fields[3]?.trim() || "",
        courseNbr: fields[4]?.trim() || "",
        topic: fields[5]?.trim() || "",
        unique: fields[6]?.trim() || "",
        constSectNbr: fields[7]?.trim() || "",
        title: fields[8]?.trim() || "",
        crsDesc: fields[9]?.trim() || "",
        instructor: fields[10]?.trim() || "",
        days: fields[11]?.trim() || "",
        from: fields[12]?.trim() || "",
        to: fields[13]?.trim() || "",
        building: fields[14]?.trim() || "",
        room: fields[15]?.trim() || "",
        maxEnrollment: fields[16]?.trim() || "",
        seatsTaken: fields[17]?.trim() || "",
        totalXListings: fields[18]?.trim() || "",
        xListPointer: fields[19]?.trim() || "",
        xListings: fields[20]?.trim() || "",
      });
    } catch (error) {
      console.error(`Error parsing line ${i}: ${line}`);
      console.error(error);
    }
  }

  // Skip if no data was found
  if (rawData.length === 0) {
    throw new Error("No course data found in the file");
  }

  // Get common data for all courses
  const year = rawData[0].year as string;
  const semester = rawData[0].semester as "2" | "6" | "9";
  const semesterId = `${year}${semester}`;

  // Determine semester name
  let semesterName = "";
  switch (semester) {
    case "2":
      semesterName = `Spring ${year}`;
      break;
    case "6":
      semesterName = `Summer ${year}`;
      break;
    case "9":
      semesterName = `Fall ${year}`;
      break;
  }

  // Extract unique fields of study
  const fieldsOfStudyMap = new Map<
    string,
    { "Dept-Abbr": string; "Dept-Name": string }
  >();

  rawData.forEach((data) => {
    if (data.deptAbbr && !fieldsOfStudyMap.has(data.deptAbbr)) {
      fieldsOfStudyMap.set(data.deptAbbr, {
        "Dept-Abbr": data.deptAbbr,
        "Dept-Name": data.deptName,
      });
    }
  });

  // Transform raw data into Course objects
  const courses: Course[] = rawData.map((data) => {
    // Extract summer session code if present (for summer courses)
    let summerSession: "F" | "S" | "N" | "W" | "" = "";
    let cleanCourseNbr = data.courseNbr;

    if (semester === "6" && data.courseNbr) {
      const firstChar = data.courseNbr.charAt(0);
      if (["F", "S", "N", "W"].includes(firstChar)) {
        summerSession = firstChar as "F" | "S" | "N" | "W";
        cleanCourseNbr = data.courseNbr.substring(1);
      }
    }

    // Parse X-Listings as an array
    const xListings: string[] = data.xListings
      ? data.xListings
          .split(",")
          .map((x: string) => x.trim())
          .filter(Boolean)
      : [];

    // Create the Course object
    const course: Course = {
      reportDate: reportDate.toISOString(),
      Year: data.year,
      Semester: data.semester as "2" | "6" | "9",
      semesterId,
      semesterName,
      "Dept-Abbr": data.deptAbbr,
      "Dept-Name": data.deptName,
      "Course Nbr": data.courseNbr,
      fullCourseNumber: `${data.deptAbbr} ${data.courseNbr}`,
      fullCourseName: `${data.deptAbbr} ${data.courseNbr} - ${data.title}`,
      summerSession,
      Topic: data.topic,
      Unique: data.unique,
      "Const Sect Nbr": data.constSectNbr,
      Title: data.title,
      "Crs Desc": data.crsDesc,
      Instructor: data.instructor,
      Days: data.days,
      From: data.from,
      To: data.to,
      Building: data.building,
      Room: data.room,
      "Max Enrollment": data.maxEnrollment,
      "Seats Taken": data.seatsTaken,
      "Total X-listings": data.totalXListings,
      "X-List Pointer": data.xListPointer,
      "X-Listings": xListings,
    };

    return course;
  });

  // Create and return the SemesterCourseListing object
  return {
    reportDate: reportDate.toISOString(),
    Year: year,
    Semester: semester,
    semesterId,
    fieldsOfStudy: Array.from(fieldsOfStudyMap.values()),
    courses,
  };
}

/**
 * Merges a course listing to an array of course listings
 *
 * @param courseListing - The course listing to add
 * @param courseListings - The list of course listings
 *
 * The new course listing will replace the old one if it has the same semesterId.
 *
 * @returns The updated list of course listings
 */
export function mergeCourseListing(
  courseListing: SemesterCourseListing,
  courseListings: SemesterCourseListing[],
): SemesterCourseListing[] {
  const existingIndex = courseListings.findIndex(
    (listing) => listing.semesterId === courseListing.semesterId,
  );

  if (existingIndex !== -1) {
    // Replace the existing course listing
    courseListings[existingIndex] = courseListing;
  } else {
    // Add the new course listing
    courseListings.push(courseListing);
  }

  return courseListings;
}
