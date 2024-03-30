const express= require("express");
const parser=require("body-parser");
const mongo=require("mongoose");
const _=require("lodash");
const app=express();
app.set("view engine","ejs");
app.use(parser.urlencoded({extended:true}));
app.use(express.static("public"));
mongo.connect("mongodb+srv://admin:admin123@cluster0.cyp1fs8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/todolistDB");
const itemsSchema={content:String};
const Item =mongo.model("Item",itemsSchema);
const listSchema={name:String,items:[itemsSchema]};
const List =mongo.model("List",listSchema);

const item1 = new Item({content: "Welcome to your todolist!"});
const item2 = new Item({content: "Hit the + button to add a new item."});  
const item3 = new Item({content: "<-- Hit this to delete an item."});
const defaultItems = [item1, item2, item3];





app.get("/",async function(req,res){
    try {
        const foundItems = await Item.find({});
        if (foundItems.length === 0){
            await Item.insertMany(defaultItems);
            res.redirect("/");
        }else{
            res.render("list", { title:"Today", item: foundItems });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred while retrieving items");
    }
});

app.get("/:customListName",async function(req,res) {
    let listName=_.capitalize(req.params.customListName);    
    try {
        const foundList= await List.findOne({name:listName})
        if(!foundList){
            const list=new List({name:listName,items:defaultItems});
            list.save();
            res.redirect("/"+listName);
        }else{
            res.render("list",{ title: listName, item:foundList.items  })
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred while making list");
    }
})

app.post("/",async function(req,res){
    const inputItem=req.body.newItem;
    let listName=req.body.list;
    const item=new Item({content:inputItem});
    try{
        if(listName ==="Today"){
            item.save();
            res.redirect("/");
        }else{
            const foundList= await List.findOne({name:listName});
            await foundList.items.push(item);
            await foundList.save();
            res.redirect("/"+listName);
        }
    }catch(err){
        console.log(err);
        res.status(500).send("Error occurred while retrieving list");
    }
})

app.post("/delete",async function(req,res){
    const checked=req.body.checkbox;
    const listName=req.body.listName;
    try {
        if(listName==="Today"){
            await Item.findByIdAndDelete(checked);
            res.redirect("/");
        }else{
            await List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checked}}});
            res.redirect("/"+listName);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error occurred while deleting items");
    }
})



app.listen(3000,function(){
    console.log("server is running on port 3000.");
});