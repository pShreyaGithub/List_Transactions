const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const connectDB = require("./config/db");
const app = express();

connectDB();


// * Cors
app.use(cors());

// * Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("short"));

// * Api routes
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("*", (req, res) => {
  res.status(404).send("Route not found");
});

let PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
