if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const router = require("./routes");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
