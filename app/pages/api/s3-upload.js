// pages/api/s3-upload.js
import { APIRoute } from "next-s3-upload";

export default APIRoute.configure({
  key(req, filename) {
    // console.log(filename);
    // console.log("req", req.body);
    const fileExtension = filename.split(".").slice(-1);
    const fileName = req.body.coverName || req.body.trackName;
    // console.log("fileName", fileName);
    return `projects/${req.body.path_s3}/${fileName}.${fileExtension}`;
  },
});
