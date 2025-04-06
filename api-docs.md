# UT Reg-it Course Listings API

## Overview

This UT Reg-it Course Listings API provides a REST-API style access to UT Austin's course listings data. It allows users to browse semesters, fields of study (departments), courses, and sections.

## Data Models

### Course

Represents a single course section with detailed information about the course, instructor, schedule, and enrollment.

#### Structure

```json
{
  "reportDate": "2024-04-05T14:30:00.000Z",
  "Year": "2025",
  "Semester": "2",
  "semesterId": "20252",
  "semesterName": "Spring 2025",
  "Dept-Abbr": "C S",
  "Dept-Name": "Computer Science",
  "Course Nbr": "439",
  "fullCourseNumber": "C S 439",
  "fullCourseName": "C S 439 - PRINCIPLES OF COMPUTER SYS-C S",
  "summerSession": "",
  "Topic": "0",
  "Unique": "50885",
  "Const Sect Nbr": "100352",
  "Title": "PRINCIPLES OF COMPUTER SYS-C S",
  "Crs Desc": "Introduction to computing including bits and operations on bits, number for...",
  "Instructor": "SCOTT, M",
  "Days": "MWF",
  "From": "1000",
  "To": "1100",
  "Building": "GDC",
  "Room": "2.216",
  "Max Enrollment": "100",
  "Seats Taken": "75",
  "Total X-listings": "",
  "X-List Pointer": "",
  "X-Listings": []
}
```

| **Field**           | **Description**                                              |
|---------------------|--------------------------------------------------------------|
| `reportDate`        | Date when data was extracted (ISO 8601 format)               |
| `Year`              | Year of the course                                           |
| `Semester`          | Semester code (2=Spring, 6=Summer, 9=Fall)                   |
| `semesterId`        | Combined year and semester (e.g., "20252")                   |
| `semesterName`      | Human-readable semester name (e.g., "Spring 2025")           |
| `Dept-Abbr`         | Department abbreviation (e.g., "C S")                        |
| `Dept-Name`         | Full department name (e.g., "Computer Science")              |
| `Course Nbr`        | Course number (e.g., "439" or "408D")                        |
| `fullCourseNumber`  | Department and course number (e.g., "C S 439")               |
| `fullCourseName`    | Full course name with title                                  |
| `summerSession`     | Summer session code (F/S/N/W, empty if not summer)           |
| `Topic`             | Topic number within course                                   |
| `Unique`            | Unique number for the section                                |
| `Const Sect Nbr`    | Constant section number                                      |
| `Title`             | Course title                                                 |
| `Crs Desc`          | Course description                                           |
| `Instructor`        | Instructor name (format: "LASTNAME, INITIAL")                |
| `Days`              | Days of the week (e.g., "MWF", "TTH")                        |
| `From`              | Start time in 24-hour format                                 |
| `To`                | End time in 24-hour format                                   |
| `Building`          | Building code                                                |
| `Room`              | Room number                                                  |
| `Max Enrollment`    | Maximum enrollment capacity                                  |
| `Seats Taken`       | Current enrollment count                                     |
| `Total X-listings`  | Number of cross-listed courses                               |
| `X-List Pointer`    | Lowest unique number in cross-listed group                   |
| `X-Listings`        | Array of unique numbers for cross-listed courses             |

For more information on these fields, refer to the `src/types.ts` file in the source code.

#### Summer Session Codes

For summer semesters (semester codes that end with `6`), the `summerSession` field and a prefix on the `Course Nbr` indicate which session the course covers:

| Code | Meaning           |
|------|-------------------|
| `F`  | First Session     |
| `S`  | Second Session    |
| `N`  | Nine Week Session |
| `W`  | Whole Semester    |

### SemesterCourseListing

The top-level structure containing all course data for a specific semester.

#### Structure

```json
{
  "reportDate": "2024-04-05T14:30:00.000Z",
  "Year": "2025",
  "Semester": "2",
  "semesterId": "20252",
  "fieldsOfStudy": [
    {
      "Dept-Abbr": "C S",
      "Dept-Name": "Computer Science"
    },
    {
      "Dept-Abbr": "M",
      "Dept-Name": "Mathematics"
    }
  ],
  "courses": [
    {
      // Course object (see above)
    }
  ]
}
```

| **Field**       | **Description**                                   |
|-----------------|---------------------------------------------------|
| `reportDate`    | Date when data was extracted (ISO 8601 format)    |
| `Year`          | Year of the semester                              |
| `Semester`      | Semester code (2=Spring, 6=Summer, 9=Fall)        |
| `semesterId`    | Combined year and semester (e.g., "20252")        |
| `fieldsOfStudy` | Array of departments available in this semester   |
| `courses`       | Array of all courses offered in this semester     |

## Input Format

The data should be in a json file as SemesterCourseListing[].

## API Endpoints

### Root Endpoint

```
GET /
```

Returns a welcome message to the Course Listings API.

**Response Example:**
```
Welcome to UT Reg-it Course Listings API!

Available endpoints:
	- `/docs`:      for documentation (in html)
	- `/semesters`: for semesters data
```

### API Documentation

```
GET /docs
```

Returns HTML documentation for the API.

### List All Semesters

```
GET /semesters
```

Returns a list of all available semester IDs.

**Response Example:**
```json
[
  "20242",
  "20249",
  "20252"
]
```

### Get Semester Details

```
GET /semesters/:semester
```

Returns details about a specific semester, including fields of study, but not the courses.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20252")

**Response Example:**
```json
{
  "reportDate": "2024-04-05T14:30:00.000Z",
  "Year": "2025",
  "Semester": "2",
  "semesterId": "20252",
  "fieldsOfStudy": [
    {
      "Dept-Abbr": "C S",
      "Dept-Name": "Computer Science"
    },
    {
      "Dept-Abbr": "M",
      "Dept-Name": "Mathematics"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: Missing semester parameter
- `400 Bad Request`: Semester not found

### List Courses for a Field of Study

```
GET /semesters/:semester/:fieldOfStudy
```

Returns all courses for a specific field of study in a semester.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20252")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")

**Response Example:**
```json
[
  {
    "reportDate": "2024-04-05T14:30:00.000Z",
    "Year": "2025",
    "Semester": "2",
    "semesterId": "20252",
    "semesterName": "Spring 2025",
    "Dept-Abbr": "C S",
    "Dept-Name": "Computer Science",
    "Course Nbr": "439",
    "fullCourseNumber": "C S 439",
    "fullCourseName": "C S 439 - PRINCIPLES OF COMPUTER SYS-C S",
    "summerSession": "",
    "Topic": "0",
    "Unique": "50885",
    "Const Sect Nbr": "100352",
    "Title": "PRINCIPLES OF COMPUTER SYS-C S",
    "Crs Desc": "Introduction to computing including bits and operations on bits, number for...",
    "Instructor": "SCOTT, M",
    "Days": "MWF",
    "From": "1000",
    "To": "1100",
    "Building": "GDC",
    "Room": "2.216",
    "Max Enrollment": "100",
    "Seats Taken": "75",
    "Total X-listings": "",
    "X-List Pointer": "",
    "X-Listings": []
  }
]
```

**Error Responses:**
- `400 Bad Request`: Missing semester parameter
- `400 Bad Request`: Missing field of study parameter
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found

### Get Course Details

```
GET /semesters/:semester/:fieldOfStudy/:course
```

Returns all sections of a specific course.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20252")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")
- `course` - Course number (e.g., "439")

**Response Example:**
```json
[
  {
    "reportDate": "2024-04-05T14:30:00.000Z",
    "Year": "2025",
    "Semester": "2",
    "semesterId": "20252",
    "semesterName": "Spring 2025",
    "Dept-Abbr": "C S",
    "Dept-Name": "Computer Science",
    "Course Nbr": "439",
    "fullCourseNumber": "C S 439",
    "fullCourseName": "C S 439 - PRINCIPLES OF COMPUTER SYS-C S",
    "summerSession": "",
    "Topic": "0",
    "Unique": "50885",
    "Const Sect Nbr": "100352",
    "Title": "PRINCIPLES OF COMPUTER SYS-C S",
    "Crs Desc": "Introduction to computing including bits and operations on bits, number for...",
    "Instructor": "SCOTT, M",
    "Days": "MWF",
    "From": "1000",
    "To": "1100",
    "Building": "GDC",
    "Room": "2.216",
    "Max Enrollment": "100",
    "Seats Taken": "75",
    "Total X-listings": "",
    "X-List Pointer": "",
    "X-Listings": []
  }
]
```

**Error Responses:**
- `400 Bad Request`: Missing semester parameter
- `400 Bad Request`: Missing field of study parameter
- `400 Bad Request`: Missing course parameter
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found
- `400 Bad Request`: Course not found

### Get Section Details

```
GET /semesters/:semester/:fieldOfStudy/:course/:section
```

Returns detailed information about a specific section.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20252")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")
- `course` - Course number (e.g., "439")
- `section` - Unique section number (e.g., "50885")

**Response Example:**
```json
[
  {
    "reportDate": "2024-04-05T14:30:00.000Z",
    "Year": "2025",
    "Semester": "2",
    "semesterId": "20252",
    "semesterName": "Spring 2025",
    "Dept-Abbr": "C S",
    "Dept-Name": "Computer Science",
    "Course Nbr": "439",
    "fullCourseNumber": "C S 439",
    "fullCourseName": "C S 439 - PRINCIPLES OF COMPUTER SYS-C S",
    "summerSession": "",
    "Topic": "0",
    "Unique": "50885",
    "Const Sect Nbr": "100352",
    "Title": "PRINCIPLES OF COMPUTER SYS-C S",
    "Crs Desc": "Introduction to computing including bits and operations on bits, number for...",
    "Instructor": "SCOTT, M",
    "Days": "MWF",
    "From": "1000",
    "To": "1100",
    "Building": "GDC",
    "Room": "2.216",
    "Max Enrollment": "100",
    "Seats Taken": "75",
    "Total X-listings": "",
    "X-List Pointer": "",
    "X-Listings": []
  }
]
```

**Error Responses:**
- `400 Bad Request`: Missing semester parameter
- `400 Bad Request`: Missing field of study parameter
- `400 Bad Request`: Missing course parameter
- `400 Bad Request`: Missing section parameter
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found
- `400 Bad Request`: Course not found
- `400 Bad Request`: Section not found

## Error Handling

All API errors return a JSON response with an error message:

```json
{
  "error": "Error message here"
}
```

Server errors (500) include additional details in development mode:

```json
{
  "error": "Internal Server Error",
  "message": "Error details (only in development mode)"
}
```
