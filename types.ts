/**
 * Represents a class section
 */
export interface Section {
  uniqueNumber: string;
  constSectNbr: string;
  instructor: string;
  days: string;
  from: string;
  to: string;
  building: string;
  room: string;
  maxEnrollment: number;
  seatsTaken: number;
  totalXListings: number | null;
  xListPointer: string | null;
  xListings: string | null;
}

/**
 * Represents a course topic
 */
export interface Topic {
  topicNumber: string;
  title: string;
  courseDescription: string;
  sections: Section[];
}

/**
 * Represents a course
 */
export interface Course {
  courseNumber: string;
  topics: Topic[];
}

/**
 * Represents a field of study (department)
 */
export interface FieldOfStudy {
  deptAbbr: string;
  deptName: string;
  courses: Course[];
}

/**
 * Represents the full course listing
 */
export interface CourseListing {
  [yearSemester: string]: {
    reportDate: Date;
    fieldsOfStudy: FieldOfStudy[];
  };
}
