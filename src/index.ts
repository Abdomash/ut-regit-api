import fs from "fs";
import path from "path";
import { type SemesterCourseListing } from "./types";
import { serveCourseListingApi } from "./api/routes";
import { mergeCourseListing, parseCourseListing } from "./parser";

/**
 * Main function to serve the API
 *
 * @param filePath - The path to the JSON file containing course listings
 */
function serveAPI(filePath: string) {
  // Resolve the absolute path
  const absolutePath = path.resolve(filePath);

  // Check if file exists
  if (!fs.existsSync(absolutePath)) {
    console.error(`Error: File not found: ${absolutePath}`);
    process.exit(1);
  }

  let courseListings: SemesterCourseListing[] = [];

  try {
    // Load and parse the JSON file
    const fileContent = fs.readFileSync(absolutePath, "utf8");
    courseListings = JSON.parse(fileContent) as SemesterCourseListing[];
    console.log(`Successfully loaded course data from ${absolutePath}`);
  } catch (err: unknown) {
    console.error(
      `Error loading course data: ${err instanceof Error ? err.message : err}`,
    );
    process.exit(1);
  }

  // Start the server
  serveCourseListingApi(courseListings);
}

/**
 * Main function to parse a course listing file
 *
 * @param inputPath - The path to the input file
 * @param outputPath - The path to the output file
 */
function parseFile(inputPath: string, outputPath: string) {
  // Resolve the absolute paths
  const absoluteInputPath = path.resolve(inputPath);
  const absoluteOutputPath = path.resolve(outputPath);

  // Check if input file exists
  if (!fs.existsSync(absoluteInputPath)) {
    console.error(`Error: Input file not found: ${absoluteInputPath}`);
    process.exit(1);
  }

  let courseListing: SemesterCourseListing;

  try {
    // Load and parse the input file
    const fileContent = fs.readFileSync(absoluteInputPath, "utf8");
    courseListing = parseCourseListing(fileContent);
    console.log(`Successfully parsed course data from ${inputPath}`);
  } catch (err: unknown) {
    console.error(
      `Error parsing course data: ${err instanceof Error ? err.message : err}`,
    );
    process.exit(1);
  }

  // If output file is already a SemesterCourseListing[], append the new data
  let existingData: SemesterCourseListing[] = [];
  try {
    const fileContent = fs.readFileSync(absoluteOutputPath, "utf8");
    existingData = JSON.parse(fileContent) as SemesterCourseListing[];
  } catch (err: unknown) {
    console.log(
      `No valid existing data found in ${outputPath}. Creating a new file.`,
    );
    existingData = [];
  }

  if (Array.isArray(existingData)) {
    mergeCourseListing(courseListing, existingData);
    console.log(`Merged course data with existing data in ${outputPath}`);
  } else {
    existingData = [courseListing] as SemesterCourseListing[];
    console.log(
      `No valid existing data found. Overrwritten ${outputPath} with new course data`,
    );
  }

  // Write the merged data to the output file
  fs.writeFileSync(
    absoluteOutputPath,
    JSON.stringify(existingData, null, 2),
    "utf8",
  );
  console.log(`Successfully saved course data to ${outputPath}`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 2 || args.length > 3) {
    console.error("Usage: bun run index.ts --serve <path-to-json-file>");
    console.error(
      "Usage: bun run index.ts --parse <path-to-input-file> <path-to-output-file>",
    );
    process.exit(1);
  }

  const [command, inputfile = "", outputfile = "", ..._rest] = args;
  switch (command) {
    case "--serve":
      serveAPI(inputfile);
      break;
    case "--parse":
      parseFile(inputfile, outputfile);
      break;
    default:
      console.error(`Unknown command: ${command}`);
      process.exit(1);
  }
}

main();
