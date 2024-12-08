const express = require("express");

const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "succesful",
  });
});

app.listen(PORT, () => {
  console.log("Server running on ", PORT);
});
