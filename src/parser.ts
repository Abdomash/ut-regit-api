import type { CourseListing, Section } from "./types";

/**
 * Parses a course listing text file
 * @param fileContent The content of the course listing text file
 * @returns Structured course data organized by year+semester, fields of study, courses, topics, and sections
 */
export function parseClassListing(fileContent: string): CourseListing {
  // Split into lines
  const lines = fileContent.split("\n");

  // Find the report date and time line and data start line
  let reportDate = new Date();
  let dataStartIndex = 0;
  let headerLineIndex = 0;

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
      headerLineIndex = i;
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
        year: fields[0]!.trim(),
        semester: fields[1]!.trim(),
        deptAbbr: fields[2]!.trim(),
        deptName: fields[3]!.trim(),
        courseNbr: fields[4]!.trim(),
        topic: fields[5]!.trim(),
        unique: fields[6]!.trim(),
        constSectNbr: fields[7]!.trim(),
        title: fields[8]!.trim(),
        crsDesc: fields[9]!.trim(),
        instructor: fields[10]!.trim(),
        days: fields[11]!.trim(),
        from: fields[12]!.trim(),
        to: fields[13]!.trim(),
        building: fields[14]!.trim(),
        room: fields[15]!.trim(),
        maxEnrollment: parseInt(fields[16]!.trim()) || 0,
        seatsTaken: parseInt(fields[17]!.trim()) || 0,
        totalXListings:
          fields[18] && fields[18].trim() ? parseInt(fields[18].trim()) : null,
        xListPointer:
          fields[19] && fields[19].trim() ? fields[19].trim() : null,
        xListings: fields[20] && fields[20].trim() ? fields[20].trim() : null,
      });
    } catch (error) {
      console.error(`Error parsing line ${i}: ${line}`);
      console.error(error);
    }
  }

  // Organize data into the nested structure
  const result: CourseListing = {};

  // Group data by year+semester, department, course, topic, and section
  rawData.forEach((entry) => {
    const yearSemester = `${entry.year}${entry.semester}`;

    // Create year+semester entry if it doesn't exist
    if (!result[yearSemester]) {
      result[yearSemester] = {
        reportDate: reportDate,
        fieldsOfStudy: [],
      };
    }

    // Find or create field of study
    let fieldOfStudy = result[yearSemester].fieldsOfStudy.find(
      (fos) => fos.deptAbbr === entry.deptAbbr,
    );

    if (!fieldOfStudy) {
      fieldOfStudy = {
        deptAbbr: entry.deptAbbr,
        deptName: entry.deptName,
        courses: [],
      };
      result[yearSemester].fieldsOfStudy.push(fieldOfStudy);
    }

    // Find or create course
    let course = fieldOfStudy.courses.find(
      (c) => c.courseNumber === entry.courseNbr,
    );

    if (!course) {
      course = {
        courseNumber: entry.courseNbr,
        topics: [],
      };
      fieldOfStudy.courses.push(course);
    }

    // Find or create topic (using topic number, title, and description as identifiers)
    const topicKey = `${entry.topic}:${entry.title}:${entry.crsDesc}`;
    let topic = course.topics.find(
      (t) => `${t.topicNumber}:${t.title}:${t.courseDescription}` === topicKey,
    );

    if (!topic) {
      topic = {
        topicNumber: entry.topic,
        title: entry.title,
        courseDescription: entry.crsDesc,
        sections: [],
      };
      course.topics.push(topic);
    }

    // Create section
    const section: Section = {
      uniqueNumber: entry.unique,
      constSectNbr: entry.constSectNbr,
      instructor: entry.instructor,
      days: entry.days,
      from: entry.from,
      to: entry.to,
      building: entry.building,
      room: entry.room,
      maxEnrollment: entry.maxEnrollment,
      seatsTaken: entry.seatsTaken,
      totalXListings: entry.totalXListings,
      xListPointer: entry.xListPointer,
      xListings: entry.xListings,
    };

    // Add section to topic
    topic.sections.push(section);
  });

  return result;
}

/**
 * Example usage:
 *
 * // Read file content (in Node.js)
 * const fs = require('fs');
 * const fileContent = fs.readFileSync('classes.txt', 'utf8');
 *
 * // Parse the content
 * const coursesData = parseClassListing(fileContent);
 *
 * // Access data for a specific semester
 * const spring2025 = coursesData['20252'];
 * console.log(`Report date: ${spring2025.reportDate}`);
 *
 * // Get information about a specific department
 * const arch = spring2025.fieldsOfStudy.find(fos => fos.deptAbbr === 'ARC');
 * console.log(`${arch.deptName} has ${arch.courses.length} courses`);
 *
 * // Find a specific course
 * const design1 = arch.courses.find(c => c.courseNumber === 'F310K');
 * if (design1 && design1.topics.length > 0) {
 *   const sections = design1.topics[0].sections;
 *   console.log(`Design I has ${sections.length} sections with instructor ${sections[0].instructor}`);
 * }
 */
