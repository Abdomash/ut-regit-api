# UT Reg-it API

A REST API and parser for UT Austin's FTP server for course listings data. It provides structured access to semesters, fields of study, courses, and sections.

> [!NOTE]
> You need to download the course listing data from UT's ftp server to use this project. The data is not included in this repo.
> The course data is available at: `ftp://anonymous@reg-it.austin.utexas.edu`, which is only accessible from the UT network.
> I plan to provide a script to download the data automatically soon.

## Overview

This project provides two main tools:

1. **Parser**: Converts UT Austin's course listing text files into structured JSON data
2. **API Server**: Serves the parsed course data through a REST API

The API allows browsing the course catalog hierarchy:
- Semesters
- Fields of Study (departments)
- Courses
- Sections

## Installation

```bash
# Clone the repository
git clone https://github.com/abdomash/ut-regit-api.git
cd ut-regit-api

# Install dependencies
bun install
```

## Usage

### Parsing Course Listings

To convert a course listing text file into JSON format:

```bash
bun parse <path-to-input-file> <path-to-output-file>
```

Example:
```bash
bun parse data/Current_Semester_Report data/course-listings.json
```

When parsing multiple files:
- If the output file already exists, the parser will merge the new data with existing data
- If a semester already exists in the output file, it will be replaced with the new data

### Running the API Server

To start the API server:

```bash
bun serve <path-to-json-file>
```

Example:
```bash
bun serve data/course-listings.json
```

The server will start on port 3000 by default (can be changed with the PORT environment variable).

## Data Structure

The project uses a hierarchical data model:

- **SemesterCourseListing**: Contains all course data for a specific semester
  - **Course**: Represents a single course section with detailed information

For a full description of the data model, see the `/docs` endpoint or the `api-docs.md` file.

### Key Data Fields

Each course section includes:
- Basic course information (department, number, title, description)
- Instructor information
- Schedule information (days, times, location)
- Enrollment information (capacity, seats taken)
- Cross-listing information (if applicable)

For summer courses, the first character of the course number indicates the session:
- `F`: First Session
- `S`: Second Session
- `N`: Nine Week Session
- `W`: Whole Semester

## API Endpoints

The API provides the following endpoints:

- `GET /`: Welcome message and basic info
- `GET /docs`: HTML documentation
- `GET /semesters`: List all available semesters
- `GET /semesters/:semester`: Get semester details
- `GET /semesters/:semester/:fieldOfStudy`: List courses for a field of study
- `GET /semesters/:semester/:fieldOfStudy/:course`: Get course details
- `GET /semesters/:semester/:fieldOfStudy/:course/:section`: Get section details

For a full description of the API endpoints, see the `/docs` endpoint or the `api-docs.md` file.

## Parser Details

The parser handles the following tasks:
- Extracts report date and time from the course listing file
- Parses tab-delimited data into structured JSON
- Handles special cases like summer session codes
- Extracts cross-listing information
- Organizes data into a hierarchical structure

When merging course listings, the parser will:
- Replace existing semesters with new data if they have the same ID
- Add new semesters if they don't already exist

## Examples

### Parsing a Course Listing

```bash
bun parse data/data/Current_Semester_Report data/course-listings.json
```

Output:
```
Successfully parsed course data from data/spring2025.txt
Merged course data with existing data in data/course-listings.json
Successfully saved course data to data/course-listings.json
```

### Starting the API Server

```bash
bun serve data/course-listings.json
```

Output:
```
Successfully loaded course data from /path/to/data/course-listings.json
Server is running at http://localhost:3000
```

### API Request Examples

Get a list of all semesters:
```
GET http://localhost:3000/semesters
```

Get information about a specific semester:
```
GET http://localhost:3000/semesters/20252
```

Get all Computer Science courses for Spring 2025:
```
GET http://localhost:3000/semesters/20252/C%20S
```

Get details for a specific course:
```
GET http://localhost:3000/semesters/20252/C%20S/439
```

Get details for a specific section:
```
GET http://localhost:3000/semesters/20252/C%20S/439/50885
```
