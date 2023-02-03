const express = require("express");
const dbConnect = require("./dbConnect");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));


const itemsRoute = require("./routes/itemsRoute");
const usersRoute = require("./routes/userRoute");
const billsRoute = require("./routes/billsRoute");
const cashierRoute = require("./routes/cashiersRoute");
app.use("/api/items", itemsRoute);
app.use("/api/users", usersRoute);
app.use("/api/bills/", billsRoute);
app.use("/api/cashiers", cashierRoute);
const path = require("path");


if (process.env.NODE_ENV === "production") {
  app.use("/", express.static("client/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
  
}
const port = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Helo node ${port} `));
