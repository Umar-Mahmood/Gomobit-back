
const express = require('express');
var MongoClient = require('mongodb').MongoClient;
const app = express();
const port = 3001;

var mongo_url = "mongodb://localhost:27017"
const client =new MongoClient(mongo_url);


async function GetData(){
    let result = await client.connect();
    let db = result.db('gomobit');
    let collection = db.collection('User')
    let response = await collection.find({}).toArray()
    return response;

}

async function InsertData(data){
    let result = await client.connect();
    let db = result.db('gomobit');
    let collection = db.collection('User')
    let check = await collection.findOne({mail: data.mail})
    if(!check){
        let response = await collection.insertOne({name: data.name, mail: data.mail, tel: data.tel, age:data.age , Created_at: new Date() , Is_Deleted: false })
        if(response.acknowledged){
            console.log('User added');
            return "User Added succesfully!";
        }
        else{
            console.log('Some Error Occured');
        }
    }
    else{
        console.log('User Already exists');
        return "User Already exist!";

    }
}

var bodyParser = require('body-parser');
const e = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/main', (req, res) => {
    GetData().then(result =>{
        res.set('Content-Type', 'application/json');
    var data = {
        users: result
     }
     console.log(data);
    res.json( data );
    });
});

app.post('/add_user', (req, res) => {
    console.log(req.headers);
    data = req.body;
    InsertData(data).then(result =>{
        res.set('Content-Type', 'application/json');
    var data = {
        user: result
     }
     console.log(data);
    res.json( data );
    })
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
