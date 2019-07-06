var express = require("express");
var router = express.Router();
//var upload = require("./modules/upload");

/* GET home page. */
// router.get("/", async function(req, res, next) {
//   res.send("this is just a backend api");
// });
router.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
/*
router.post("/", async function(req, res, next) {
  try {
    const audioBytes = req.body.data;
    //console.log(convert)
    fs.writeFileSync("./public/test1.wav", audioBytes);
    const file = fs.readFileSync("./public/test1.wav").toString("base64");

    var a = await convert(audioBytes);
    res.json({ a });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});

router.post("/voice", async (req, res) => {
  try {
    var nameOfFile = "anubhav-" + Date.now();
    upload("blob", nameOfFile, req, res, async function(err) {
      if (err) {
        res.json({ response: "fail" });
        console.log(err);
      } else {
        const audioBytes = fs.readFileSync(req.file.path).toString("base64");
        var data = await convert(audioBytes);
        console.log(data);
        res.json({
          from: "me",
          time: new Date(Date.now()).toLocaleString(),
          message: data
        });
      }
    });
  } catch (err) {
    console.log(err);
    res.send("error");
  }
});*/

module.exports = router;
