import { parseClassListing } from "./parser";
import fs from "fs";

const filePath = "data/test";
const fileContent = fs.readFileSync(filePath, "utf8");
const classes = parseClassListing(fileContent);
console.log(classes);
fs.writeFileSync("data/test.json", JSON.stringify(classes, null, 2), "utf8");
