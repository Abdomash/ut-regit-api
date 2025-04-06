/**
 * Course data type
 *
 * Represents the course data extracted from the reg-it course listing.
 *
 * This type contains both the original fields extracted from the course listing and additional fields added for convenience.
 * Some fields are marked as "Maybe empty", meaning they could be empty string in some cases.
 *
 */
export type Course = {
  /**
   * Report date
   *
   * The date when this course data was extracted from the course listing.
   *
   * Format: ISO 8601 date string
   *
   * e.g., "2024-04-05T14:30:00.000Z"
   */
  reportDate: string;

  /**
   * Year of the course, e.g., "2025"
   */
  Year: string;

  /**
   * Semester of the course, "2" for Spring, "6" for Summer, "9" for Fall
   */
  Semester: "2" | "6" | "9";

  /**
   * Semester Id
   *
   * A single string that encapsulate the year and semester number
   *
   * e.g., "20252" for Spring 2025, "20256" for Summer 2025
   *
   * @NOTE: This is ADDED to the course data for convenience.
   */
  semesterId: string;

  /**
   * Semester name, e.g., "Spring 2025", "Summer 2025", or "Fall 2025"
   *
   * @NOTE: This is ADDED to the course data for convenience.
   */
  semesterName: string;

  /**
   * Department abbreviation, e.g., "C S", "M", or "ECE"
   */
  "Dept-Abbr": string;

  /**
   * Department name, e.g., "Computer Science", "Mathematics", or "Electrical and Computer Engineering"
   */
  "Dept-Name": string;

  /**
   * Course number, e.g., "439", "408D", or "306H"
   *
   * For the summer semesters, this course number will have a prefix noting which session this course covers:
   * - "F" for First session
   * - "S" for Second session
   * - "N" for Nine week session
   * - "W" for Whole semester
   *
   * For example, "F408D" covers first summer session, while "N408D" covers the Nine week session
   */
  "Course Nbr": string;

  /**
   * Full course number, e.g., "C S 439H", "M 408D", or "ECE W306"
   *
   * Format: [Dept-Abbr] + " " + [Course Nbr]
   *
   * e.g., "C S 439H" for "C S" department and "439H" course number.
   *
   * @NOTE: This is ADDED to the course data for convenience.
   */
  fullCourseNumber: string;

  /**
   * Full course name, e.g., "C S 439H - PRINCIPLES OF COMPUTER SYS-C S" or "ECE 306 - INTRODUCTION TO COMPUTING"
   *
   * Format: [Dept-Abbr] + " " + [Course Nbr] + " - " + [Title]
   *
   * @NOTE: This is ADDED to the course data for convenience.
   */
  fullCourseName: string;

  /**
   * Summer session code
   *
   * - "F" for First session
   * - "S" for Second session
   * - "N" for Nine week session
   * - "W" for Whole semester
   *
   * This field is only used for summer courses, and it will be empty for all other semesters.
   *
   * e.g., for the course "F408D", this field will be "F".
   *
   * @NOTE: This is ADDED to the course data for convenience.
   */
  summerSession: "F" | "S" | "N" | "W" | "";

  /**
   * Topic number, e.g., "0", "13", or "1"
   *
   * In some courses (e.g. "C S 378"), there are multiple topics offered under the same course number. Each topic has a different number.
   * For example, "C S 378 - Cloud Computing" may have topic "0" and "C S 378 - Symbolic Programming" have "13".
   *
   * However, the majority of courses have only one topic, so this field is usually "0".
   */
  Topic: string;

  /**
   * Unique number for the course, e.g., "50885"
   */
  Unique: string;

  /**
   * Constant section number. e.g., "100352"
   *
   * This is a 6-digit id for all courses in the given semester course catalog report.
   * It starts at "100001" and increments by 1 for all courses in the report.
   */
  "Const Sect Nbr": string;

  /**
   * Course title, e.g., "PRINCIPLES OF COMPUTER SYS-C S" or "INTRODUCTION TO COMPUTING"
   */
  Title: string;

  /**
   * Course description, e.g., "Introduction to computing including bits and operations on bits, number for..."
   *
   * @NOTE: Maybe empty
   */
  "Crs Desc": string;

  /**
   * Instructor name
   *
   * format: "LASTNAME, INITIAL"
   *
   * e.g., "DOE, J" or "SCOTT, M"
   *
   * @NOTE: Maybe empty
   */
  Instructor: string;

  /**
   * Days of the week when the course is offered,
   *
   * e.g., "MWF", "TTH", or "MTWF"
   *
   * @NOTE: Maybe empty
   */
  Days: string;

  /**
   * Start time of the lecture in 24-hour format
   *
   * e.g., "0800", "1200", or "1400"
   *
   * @NOTE: Maybe empty
   */
  From: string;

  /**
   * End time of the lecture in 24-hour format
   *
   * e.g., "0900", "1300", or "1500"
   *
   * @NOTE: Maybe empty
   */
  To: string;

  /**
   * The Building name of the lectures
   *
   * e.g., "GDC", "WEL", or "CPE"
   *
   * @NOTE: Maybe empty
   */
  Building: string;

  /**
   * Room number of the lectures
   *
   * e.g., "1.302", "2.102", or "3.202"
   *
   * @NOTE: Maybe empty
   */
  Room: string;

  /**
   * Maximum student enrollment for the course
   *
   * e.g., "30", "50", or "100"
   */
  "Max Enrollment": string;

  /**
   * Number of students enrolled in the course
   *
   * e.g., "25", "50", or "100"
   */
  "Seats Taken": string;

  /**
   * The total number of courses cross-listed with this course (not including this course)
   *
   * It doesn't counts this course, so if only one other cross-listed course exists, this field will be "1".
   * If there are no cross-listings, this field will be EMPTY.
   *
   * e.g., "1", "4", or "8"
   *
   * @WARN: This field is not reliable. In some cases, a course A might list course B as cross-listed, but course B doesn't list course A.
   *
   * @NOTE: Maybe empty
   */
  "Total X-listings": string;

  /**
   * The lowest unique number in a group of cross-listed courses
   *
   * If this course is cross-listed with other courses, this field will contain the lowest unique number of all of them.
   *
   * e.g., "50885", "50895", or "50800"
   *
   * @WARN: This field is not reliable. In some cases, a course A might list course B as cross-listed, but course B doesn't list course A.
   *
   * @NOTE: Maybe empty
   */
  "X-List Pointer": string;

  /**
   * The list of unique numbers of a group of cross-listed courses
   *
   * It doesn't this course, only lists the other cross-listed courses.
   *
   * @WARN: This field is not reliable. In some cases, a course A might list course B as cross-listed, but course B doesn't list course A.
   *
   * @NOTE: Maybe empty
   */
  "X-Listings": string[];
};

/**
 * SemesterCourseListing data type
 *
 * Represents the course data extracted from the reg-it course listing for a specific semester.
 *
 *
 */
export type SemesterCourseListing = {
  /**
   * The report date when this course data was extracted from the course listing.
   *
   * Format: ISO 8601 date string
   *
   * e.g., "2024-04-05T14:30:00.000Z"
   */
  reportDate: string;

  /**
   * Year of the course, e.g., "2025"
   */
  Year: string;

  /**
   * Semester of the course, "2" for Spring, "6" for Summer, "9" for Fall
   */
  Semester: "2" | "6" | "9";

  /**
   * Semester Id
   *
   * A single string that encapsulate the year and semester number
   *
   * e.g., "20252" for Spring 2025, "20256" for Summer 2025
   */
  semesterId: string;

  /**
   * Fields of study
   *
   * This is a list of all the fields of study available in the course listing.
   *
   * Each field of study is represented by a `Dept-Abbr` and `Dept-Name` pair.
   */
  fieldsOfStudy: {
    /**
     * The department abbreviation, e.g., "C S", "M", or "ECE"
     */
    "Dept-Abbr": string;

    /**
     * The department name, e.g., "Computer Science", "Mathematics", or "Electrical and Computer Engineering"
     */
    "Dept-Name": string;
  }[];

  /**
   * List of courses
   *
   * Each course is represented by a `Course` object.
   */
  courses: Course[];
};
