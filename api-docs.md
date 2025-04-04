# UT Reg-it Course Listings API

## Overview

This UT Reg-it Course Listings API provides a REST-API style access to UT Austin's course listings data. It allows users to browse semesters, fields of study (departments), courses, topics, and sections.

## Data Models

### Section

Represents a class section with details about meeting times, instructor, location, and enrollment.

```json
{
  "uniqueNumber": "12345",       // Unique number for the section
  "constSectNbr": "1",           // Constant section number
  "instructor": "Smith, J",      // Instructor last name and initial
  "days": "MWF",                 // Days of the week (e.g., "MWF")
  "from": "1300",                // Start time
  "to": "1500",                  // End time
  "building": "GDC",             // Building code
  "room": "2.216",               // Room number
  "maxEnrollment": 100,          // Maximum enrollment capacity
  "seatsTaken": 75,              // Current enrollment count
  "totalXListings": null,        // Cross-listing count
  "xListPointer": null,          // Cross-listing reference
  "xListings": null              // Cross-listed sections
}
```

### Topic

Represents a course topic with sections and description. A course may contain multiple topics in it. For example, the CS course `378` typically have multiple topics under it, each with its own course description and sections. However, in most cases there is only one topic with id `0` under each course.

> [!NOTE]
> This `topic` field is an unnecessary extra level of hierarchy in the data model. It is not needed for most courses, as they typically have only one topic with id `0`. However, it is included here for a more accurate reflection of the actual data structure in the UT Reg-it system. In the future, I plan to remove this `topic` level and either create separate courses for each topic or merge all topics into one course. This will hopefully simplify the data model and make it easier to work with.

```json
{
  "topicNumber": "0",                                // Topic number
  "title": "Introduction to Computer Science",       // Topic title
  "courseDescription": "An intro to compute...",     // Description of the topic
  "sections": [                                      // Available sections for this topic
    {
      "uniqueNumber": "12345",
      "constSectNbr": "1",
      "instructor": "Smith, J",
      "days": "MWF",
      "from": "1000",
      "to": "1100",
      "building": "GDC",
      "room": "2.216",
      "maxEnrollment": 80,
      "seatsTaken": 45,
      "totalXListings": null,
      "xListPointer": null,
      "xListings": null
    }
  ]
}
```

### Course

Represents a course with multiple potential topics.

```json
{
  "courseNumber": "375",        // Course number
  "topics": [                   // Topics offered under this course
    {
      "topicNumber": "0",
      "title": "Compilers",
      "courseDescription": "CS 375 covers the design of Compilers, which translate programming languages that are easy for humans to use (Java, C++, etc.)...",
      "sections": [
        {
          "uniqueNumber": "12345",
          "constSectNbr": "1",
          "instructor": "Novak, G",
          "days": "MWF",
          "from": "1230",
          "to": "1400",
          "building": "GDC",
          "room": "2.216",
          "maxEnrollment": 100,
          "seatsTaken": 75,
          "totalXListings": null,
          "xListPointer": null,
          "xListings": null
        }
      ]
    }
  ]
}
```

### Field of Study

Represents an academic department or field.

```json
{
  "deptAbbr": "C S",              // Department abbreviation (e.g., "C S")
  "deptName": "Computer Science", // Full department name
  "courses": [                    // Courses offered by this department
    {
      "courseNumber": "375",
      "topics": [
        {
          "topicNumber": "0",
          "title": "Compilers",
          "courseDescription": "CS 375 covers the design of Compilers, which translate programming languages that are easy for humans to use (Java, C++, etc.)...",
          "sections": [
            {
              "uniqueNumber": "12345",
              "constSectNbr": "1",
              "instructor": "Novak, G",
              "days": "MWF",
              "from": "1230",
              "to": "1400",
              "building": "GDC",
              "room": "2.216",
              "maxEnrollment": 100,
              "seatsTaken": 75,
              "totalXListings": null,
              "xListPointer": null,
              "xListings": null
            }
          ]
        }
      ]
    }
  ]
}
```

### Semester

The top-level structure containing all course data in a semester. A semester is identified as a string of "YYYYX" where YYYY is the year and X is the semester (2 for spring, 6 for summer, 9 for fall). For example "20252" represents Spring 2025, "20259" represents Fall 2025, etc.

```json
{
  "20252": {                    // Semester identifier (e.g., "20252")
    "reportDate": "2025-04-15T00:00:00.000Z", // Date the data was reported
    "fieldsOfStudy": [          // All fields of study for this semester
        {
          "deptAbbr": "C S",
          "deptName": "Computer Science",
          "courses": [
            {
              "courseNumber": "375",
              "topics": [
                {
                  "topicNumber": "0",
                  "title": "Compilers",
                  "courseDescription": "CS 375 covers the design of Compilers, which translate programming languages that are easy for humans to use (Java, C++, etc.)...",
                  "sections": [
                    {
                      "uniqueNumber": "12345",
                      "constSectNbr": "1",
                      "instructor": "Novak, G",
                      "days": "MWF",
                      "from": "1230",
                      "to": "1400",
                      "building": "GDC",
                      "room": "2.216",
                      "maxEnrollment": 100,
                      "seatsTaken": 75,
                      "totalXListings": null,
                      "xListPointer": null,
                      "xListings": null
                    }
                  ]
                }
              ]
            }
          ]
        }
    ]
  },
  "20256": {
    // Another semester's data
  }
}
```

## API Endpoints

### Root Endpoint

```
GET /
```

Returns a welcome message to the Course Listings API.

**Response Example:**
```
Welcome to the Course Listings API
```

### List All Semesters

```
GET /semesters
```

Returns a list of all available semesters.

**Response Example:**
```json
[
  "20242",
  "20256",
  "20269"
]
```

### List Fields of Study for a Semester

```
GET /semesters/:semester
```

Returns all fields of study (departments) available for a specific semester.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20232")

**Response Example:**
```json
[
  {
    "deptAbbr": "C S",
    "deptName": "Computer Science"
  },
  {
    "deptAbbr": "M",
    "deptName": "Mathematics"
  }
]
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
- `semester` - Semester identifier (e.g., "20256")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")

**Response Example:**
```json
[
  "N303E",
  "N313E",
  "N326E",
  "N327E",
  "N329E",
  "N349",
  "W370",
  "W370F",
]
```

**Error Responses:**
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found

### List Topics for a Course

```
GET /semesters/:semester/:fieldOfStudy/:course
```

Returns all topics for a specific course.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20256")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")
- `course` - Course number (e.g., "N349")

**Response Example:**
```json
[
  {
    "topicNumber": "0",
    "topicTitle": "CONTEMP ISSUES IN COMPUTER SCI"
  }
]
```

**Error Responses:**
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found
- `400 Bad Request`: Course not found

### List Sections for a Topic

```
GET /semesters/:semester/:fieldOfStudy/:course/:topic
```

Returns all sections for a specific topic.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20256")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")
- `course` - Course number (e.g., "N349")
- `topic` - Topic number (e.g., "0")

**Response Example:**
```json
[
  {
    "uniqueNumber": "84950"
  },
]
```

**Error Responses:**
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found
- `400 Bad Request`: Course not found
- `400 Bad Request`: Topic not found

### Get Section Details

```
GET /semesters/:semester/:fieldOfStudy/:course/:topic/:section
```

Returns detailed information about a specific section.

**Path Parameters:**
- `semester` - Semester identifier (e.g., "20256")
- `fieldOfStudy` - Department abbreviation (e.g., "C S")
- `course` - Course number (e.g., "N349")
- `topic` - Topic number (e.g., "0")
- `section` - Unique section number (e.g., "84950")

**Response Example:**
```json
{
  "uniqueNumber": "84950",
  "constSectNbr": "101869",
  "instructor": "QUIMBY, M",
  "days": "MWF",
  "from": "1300",
  "to": "1500",
  "building": "GDC",
  "room": "4.302",
  "maxEnrollment": 42,
  "seatsTaken": 0,
  "totalXListings": null,
  "xListPointer": null,
  "xListings": null
}
```

**Error Responses:**
- `400 Bad Request`: Semester not found
- `400 Bad Request`: Field of study not found
- `400 Bad Request`: Course not found
- `400 Bad Request`: Topic not found
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
