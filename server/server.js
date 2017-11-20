const path = require("path");
const express = require("express");

var publicPath = path.join(__dirname, "../public");
const app = express();
const port = process.env.PORT || 3000;
console.log(port);
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Starting application on port ${port}`);
});
