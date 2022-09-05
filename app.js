"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
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

const listSchema = {
  name : String,
  items : [itemsSchema]
}

const List = mongoose.model("List", listSchema);




app.get("/", function (req, res) {
  const day = date.getDate();
  Item.find({}, function(err, items){
    if(items.length === 0){
      Item.insertMany(defaultItems, function(err){
        if (err){
          console.log(err);
        }else{
          console.log("Succeeded to insert 3 default items to DB");
        }
      });
      res.redirect('/');
    }else{
      res.render("list", { listTitle: day, items: items });
    }
  });
});

app.post("/", async function (req, res) {
  const listName = req.body.listTitle;
  const itemName = req.body.newItem;

  const item = new Item({
    name : itemName
  });

  if (listName === date.getDate()){
    item.save();
    res.redirect('/');
  }else{
    const listDoc = await List.findOne({name:listName}).exec();
    listDoc.items.push(item);
    await listDoc.save();
    res.redirect(`/${listName}`);
  }

});

app.post('/delete', async function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()){
    const deleteRes = await Item.deleteOne({_id:checkedItemId});
    if (deleteRes.deletedCount){
      console.log(`Successfully deleted one item! id : ${checkedItemId}`);
    }
    res.redirect('/');
  }else{
    await List.findOneAndUpdate({name: listName},{ $pull : { items : {_id : checkedItemId } } });

    res.redirect(`/${listName}`);
  }


});

app.get("/:customListName", async function(req, res){
  const customTitleName = _.capitalize(req.params.customListName);

  const isName = await List.findOne({name:customTitleName}).exec();
  if (!isName) {
    const list = new List({
      name : customTitleName,
      items : defaultItems
    });
    list.save();
    res.redirect(`/${customTitleName}`)
  }else{

    res.render('list',{listTitle: customTitleName, items : isName.items})
  }

})


app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
