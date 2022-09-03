"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");


const app = express();
const port = 8080;


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema =  new mongoose.Schema({
  name : {
    type : String,
    required : true
  }
});

const Item = mongoose.model("items",itemsSchema);

const item1 = new Item({
  name: "Welcome!"
})
const item2 = new Item({
  name: "Hit the + button to add a new item"
})

const item3 = new Item({
  name: "<--- Hit this to delete an item"
})

const defaultItems = [item1,item2,item3]

Item.insertMany(defaultItems, function(err){
  if (err){
    console.log(err);
  }else{
    console.log("Succeeded to insert 3 default items");
  }
});


app.get("/", function (req, res) {
  const day = date.getDate();
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

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
