const fs = require("fs");
const slugify = require("slugify");
const date = require("date-and-time");

function convertTimestampToReadableDate(timestamp) {
  const date = new Date(parseInt(timestamp));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const types = {
  "5da0d55c423741375098bdd8": "video",
  "5da0d562423741375098bdd9": "track",
  "5da0d555423741375098bdd7": "news",
};

// const timestamp = "1575318033329";

function addElementToEntries(inputFile, slug, type_, date_, outputFile) {
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      return;
    }

    try {
      const jsonData = JSON.parse(data);

      // console.log("jsonData.slice(0, 3)", jsonData.slice(0, 3));
      // console.log(
      //   jsonData.slice(0, 3).map((t) => {
      //     t[newElementKey] = slugify(t.title);
      //   })
      // );
      console.log(typeof [jsonData]);
      // Add the new element to each entry
      jsonData
        .sort(
          (a, b) => a.createdAt.date.numberLong - b.createdAt.date.numberLong
        )
        .map((entry) => {
          const readableDate = convertTimestampToReadableDate(
            entry.createdAt.date.numberLong
          );
          const type = types[entry.type.oid];
          slugify.extend({ "?": "-", ",": "-", "'": "-" });
          const slug = slugify(entry.title, {
            // remove: /[*+~.,()'"!:@]/g,
            // strict:true
            trim: false,
          });
          // console.log(readableDate);
          // console.log(
          //   " entry.createdAt._date.numberLong",
          //   entry.createdAt._date.numberLong * 1000
          // );

          entry["fullSlug"] = `${type}/${readableDate}/${slug}`;
          entry["hcType"] = type;
          entry["hcDate"] = readableDate;
          entry["hcSlug"] = slug;
        });

      // Save the updated data to a new JSON file
      fs.writeFile(
        outputFile,
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing to the file:", err);
          } else {
            console.log("New JSON file created successfully!");
          }
        }
      );
    } catch (err) {
      console.error("Error parsing JSON:", err);
    }
  });
}

// Usage example:
const inputFile = "BSONpost1.json";
const outputFile = "hc2Posts.json";
const slug = "quebra_slug";
const type_ = "quebra_type";
const date_ = "quebra_date";
// const newElementValue = 'newValue';

addElementToEntries(inputFile, slug, type_, date_, outputFile);
