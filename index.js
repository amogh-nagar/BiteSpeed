const { init } = require("./utils/connection");
const express = require("express");
const app = express();
require("dotenv").config();
app.use(express.json());

app.use("/", require("./routes"));

app.use((error, req, res, next) => {
  return res.status(500).json({
    message: "Some error occurred",
    error,
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server Listening on PORT ${process.env.PORT}`);
  init();
});
