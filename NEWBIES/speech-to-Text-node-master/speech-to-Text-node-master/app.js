var http = require("http");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var indexRouter = require("./routes/index");
var siofu = require("socketio-file-upload");

var app = express();
var whitelist = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://anubhav.openode.io",
  undefined
];
var corsOptions = {
  origin: function(origin, callback) {
    console.log(origin);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log("Not allowed by CORS");
      callback(new Error("Not allowed by CORS"));
    }
  }
};
app.use(cors(corsOptions));
var port = normalizePort(process.env.PORT || "4000");
app.set("port", port);

var server = http.createServer(app);
server.listen(port, () => {
  console.log("listning at port " + port);
});

app.use(logger("dev"));
app.use(siofu.router);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "public/static")));
var Chat = require("./routes/chat")(server, siofu);
app.use("/", indexRouter);
app.use("/chat", Chat);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("<h1>ERROR 404</h1>");
});
function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;
