'use strict';

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');

const server = express();

require('dotenv').config();
server.use(cors());
server.use(express.json());


const PORT = process.env.PORT;

mongoose.connect("mongodb://localhost:27017/digimon", { useNewUrlParser: true, useUnifiedTopology : true });



const DigimonSchema = new mongoose.Schema({

    name : String,
    img : String,
    level : String
})

const myDigimonModel = mongoose.model("Digimon", DigimonSchema);


server.get('/', testHandler);
server.get('/digimons', digimonsHandler);
server.post('/addToFav', addToFavHanhler);
server.get('/getAdd', getAddHandler);
server.delete('/delToFav/:name', delToFavHandler);
server.put('/updateDigimon/:name', updateDigimonHandler);

function  testHandler (req,res){
    res.send('Amaraaa')
}

function digimonsHandler (req,res){

   const url = `https://digimon-api.vercel.app/api/digimon`

    axios.get(url).then(result=>{
        const digimonsArray = result.data.map(item=>{
            return new Digimon(item);
        })
        // console.log(digimonsArray);
        res.send(digimonsArray)
    })
}

function addToFavHanhler (req,res){
 const {name, img, level} = req.body

 const newDigimon = new myDigimonModel({
     name : name,
    img : img,
    level : level
 })
 newDigimon.save();

}

function getAddHandler (req,res){
myDigimonModel.find({},(err,findData)=>{
    res.send(findData)
})
}

function delToFavHandler (req,res){
    const name = req.params.name;
    myDigimonModel.remove({name:name},(error,deldata)=>{
        myDigimonModel.find({},(err,data)=>{
            res.send(data)
        })
    })
}

function updateDigimonHandler (req,res) {
const name = req.params.name;
const {digimonName, digimonImg, digimonLevel} = req.body
myDigimonModel.findOne({name:name},(errorr,datas)=>{
    datas.name = digimonName, 
    datas.img = digimonImg,
    datas.level = digimonLevel,
    datas.save().then(()=>{
        myDigimonModel.find({},(ere,data)=>{
            res.send(data)
        })
    })
})
}

class Digimon {
    constructor (data){
        this.name = data.name;
        this.img = data.img;
        this.level = data.level

    }
}








server.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`);
})