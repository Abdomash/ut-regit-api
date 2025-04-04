# UT Reg-it Course Listings API

## Overview

This UT Reg-it Course Listings API provides a REST-API style access to UT Austin's course listings data. It allows users to browse semesters, fields of study (departments), courses, topics, and sections.

## Data Models

### Section

Represents a class section with details about meeting times, instructor, location, and enrollment.

#### Structure

```json
{
  "uniqueNumber": "12345",
  "constSectNbr": "1",
  "instructor": "Smith, J",
  "days": "MWF",
  "from": "1300",
  "to": "1500",
  "building": "GDC",
  "room": "2.216",
  "maxEnrollment": 100,
  "seatsTaken": 75,
  "totalXListings": null,
  "xListPointer": null,
  "xListings": null
}
```

| **Field**         | **Comment**                      |
|------------------|----------------------------------|
| `uniqueNumber`   | Unique number for the section    |
| `constSectNbr`   | Constant section number          |
| `instructor`     | Instructor last name and initial |
| `days`           | Days of the week (e.g., "MWF")   |
| `from`           | Start time                       |
| `to`             | End time                         |
| `building`       | Building code                    |
| `room`           | Room number                      |
| `maxEnrollment`  | Maximum enrollment capacity      |
| `seatsTaken`     | Current enrollment count         |
| `totalXListings` | Cross-listing count              |
| `xListPointer`   | Cross-listing reference          |
| `xListings`      | Cross-listed sections            |

### Topic

Represents a course topic with sections and description. A course may contain multiple topics in it. For example, the CS course `378` typically have multiple topics under it, each with its own course description and sections. However, in most cases there is only one topic with id `0` under each course.

#### Why is there a `topic` field?

This `topic` field is an extra level of hierarchy in the data model that shouldn't exist. It is added by UT to handle courses where there are multiple topics offered under the same course number. For example, `C S 378` typically hold many different CS topics (e.g. Symbolic Programming, NLP, Cloud Computing, etc.). In my opinion, these are distinct courses and should have separate course numbers. In fact, this `topic` level is not used for most UT courses, so they get assigned a single topic with `topicNumber=0`. In the current implementation, I kept this same structure for consistency, but I plan to remove it in the future. I will either create a separate course for each topic or merge all topics into one course. This will hopefully simplify the data model and make it easier to work with.

#### Structure

```json
{
  "topicNumber": "0",
  "title": "Introduction to Computer Science",
  "courseDescription": "An intro to compute...",
  "sections": [
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

| **Field**           | **Comment**                     |
|---------------------|---------------------------------|
| `topicNumber`       | Topic number                    |
| `title`             | Title of the topic              |
| `courseDescription` | Description of the topic        |
| `sections`          | List of sections for this topic |


### Course

Represents a course with multiple potential topics.

#### Prefixed Course Numbers

For Summer semesters (semesters IDs that end with `6`), the first character of `courseNumber` indicates the session. For example, `N349` is a nine-week session course, while `W370` is a whole semester course.

| Prefix | Meaning           |
|--------|-------------------|
| `N`    | Nine Week Session |
| `F`    | First Session     |
| `S`    | Second Session    |
| `W`    | Whole Semester    |


#### Structure

```json
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
```

| **Field**      | **Comment**                    |
|----------------|--------------------------------|
| `courseNumber` | Course number                  |
| `topics`       | List of topics for this course |

### Field of Study

Represents an academic department or field.

#### Structure

```json
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
```

| **Field**  | **Comment**                   |
|------------|-------------------------------|
| `deptAbbr` | Department abbreviation       |
| `deptName` | Full department name          |
| `courses`  | List of courses in this field |

### Semester

The top-level structure containing all course data in a semester. A semester is identified as a string of "YYYYX" where YYYY is the year and X is the semester (2 for spring, 6 for summer, 9 for fall). For example "20252" represents Spring 2025, "20259" represents Fall 2025, etc.

#### Structure

```json
{
  "20252": {
    "reportDate": "2025-04-15T00:00:00.000Z",
    "fieldsOfStudy": [
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
  }
}
```

| **Field**       | **Comment**                                             |
|-----------------|---------------------------------------------------------|
| `semester`      | Semester identifier (e.g., "20252")                     |
| `reportDate`    | Date the data was reported                              |
| `fieldsOfStudy` | List of fields of study (departments) for this semester |


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
