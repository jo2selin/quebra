export default function handler(req, res) {
  const reqBody = JSON.parse(req.body);
  console.log("reqBody", reqBody);

  var S3Zipper = require("aws-s3-zipper");
  // {
  //   accessKeyId: [Your access id],
  //   secretAccessKey: [your access key],
  //   region: [the region of your S3 bucket],
  //   bucket: [your bucket name],
  //   endpoint: [optional, for use with S3-compatible services]
  // }
  var config = {
    accessKeyId: `${process.env.S3_UPLOAD_KEY}`,
    secretAccessKey: `${process.env.S3_UPLOAD_SECRET}`,
    region: `${process.env.S3_UPLOAD_REGION}`,
    bucket: `${process.env.S3_UPLOAD_BUCKET}`,
  };
  var zipper = new S3Zipper(config);

  // zipper.filterOutFiles = function (file) {
  //   if (file.Key.indexOf(".tmp") >= 0)
  //     // filter out temp files
  //     return null;
  //   else return file;
  // };

  /// if no path is given to S3 zip file then it will be placed in the same folder
  zipper.zipToS3File(
    {
      s3FolderName: `projects/${reqBody.path_s3}`,
      // , startKey: 'keyOfLastFileIZipped' // optional
      s3ZipFileName: `${reqBody.path_s3}.zip`,
      // , tmpDir: "/tmp" // optional, defaults to node_modules/aws-s3-zipper
    },
    function (err, result) {
      if (err) console.error(err);
      else {
        console.log("result zipToS3File", result);
        // var lastFile = result.zippedFiles[result.zippedFiles.length - 1];
        // if (lastFile) console.log("last key ", lastFile.Key); // next time start from here
        res.status(200).json({ res: "Zip done" });
      }
    }
  );
}
