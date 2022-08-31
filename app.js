const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 8080;
let items = [];
let workItems = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  const today = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  const day = today.toLocaleDateString("en-US", options);

  res.render("list", { listTitle: day, items: items });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;
  if (req.body.list == "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", items: workItems });
});

app.get("/about",function(req, res){
  res.render("about");
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
