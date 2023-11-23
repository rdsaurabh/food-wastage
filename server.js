const express = require('express');
const app = express();
const port = 3001;

const bodyParser = require('body-parser')
const cors = require('cors')

const mongoose = require('mongoose');




app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'], // Add other methods you're using
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
}));

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect("mongodb://127.0.0.1:27017/chatdb",options).then(()=>{
  console.log("Successfully connected to DB");
}).catch((error)=>{
  console.log("Connection Failed " + error);
});


const snacksSchema = new mongoose.Schema({
    monday:{type: Number,
        required: true},

    tuesday:{type: Number,
            required: true},
    wednesday:{type: Number,
                required: true},
    thursday:{type: Number,
            required: true},
    friday:{type: Number,
                required: true},
    year:{
        type:Number,
        required:true   
    },
    weekInYear :{
        type:Number,
        required:true
    }
});

const lunchSchema = new mongoose.Schema({
    monday:{type: Number,
        required: true},

    tuesday:{type: Number,
            required: true},
    wednesday:{type: Number,
                required: true},
    thursday:{type: Number,
            required: Number},
    friday:{type: Number,
                required: true} ,
    year:{
        type:Number,
        required:true   
    },
    weekInYear :{
        type:Number,
        required:true
    }
});

const LUNCH = mongoose.model('lunch',lunchSchema);
const SNACKS = mongoose.model('snacks',snacksSchema);




function getCurrentWeek() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
   
    const diff = today - startOfYear;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNumber = Math.floor(diff / oneWeek);
  
    return weekNumber;
  }
  
  function getCurrentYear(){
    const today = new Date();
    return today.getFullYear();
  }


app.post("/lunch",(req,res)=>{
    const {monday,tuesday,wednesday,thursday,friday} = req.body;
    
    LUNCH.findOne({$and : [{year:getCurrentYear()},{weekInYear:getCurrentWeek()}]}).then(lunchData =>{
        
        if(lunchData){
            LUNCH.updateOne({"monday": monday ? lunchData.monday + 1 : lunchData.monday,
                                "tuesday": tuesday ? lunchData.tuesday + 1 : lunchData.tuesday,
                                "wednesday" : wednesday ? lunchData.wednesday + 1 : lunchData.wednesday,
                                "thursday" : thursday ? lunchData.thursday + 1 : lunchData.thursday,
                                "friday" : friday ? lunchData.friday + 1 : lunchData.friday,
                                "year" : lunchData.year,
                                "weekInYear" : lunchData.weekInYear
                }).then(updateLunch => res.json({message:"Your Response was added successfully"}))
                .catch(()=>{
                    res.json({message:"Your Response could not be recorded try again"})
                })
        }else{
            LUNCH.create({
                monday,tuesday,wednesday,thursday,friday,
                weekInYear:getCurrentWeek(),
                year:getCurrentYear()
              }).then((newLunch)=>{
                res.status(201).json({message:`New Entry for lunch created successfully.`});
              }).catch((err)=>{
                res.status(500).send({message:`Failed To Save Entry for Lunch , Try Again`});  
              })
        }
    }).catch(err =>{
        res.send(err);
    })

 
    
})


app.post("/snacks",(req,res)=>{
    const {monday,tuesday,wednesday,thursday,friday} = req.body;
    
    SNACKS.findOne({$and : [{year:getCurrentYear()},{weekInYear:getCurrentWeek()}]}).then(snacksData =>{
        
        if(snacksData){
            SNACKS.updateOne({"monday": monday ? snacksData.monday + 1 : snacksData.monday,
                                "tuesday": tuesday ? snacksData.tuesday + 1 : snacksData.tuesday,
                                "wednesday" : wednesday ? snacksData.wednesday + 1 : snacksData.wednesday,
                                "thursday" : thursday ? snacksData.thursday + 1 : snacksData.thursday,
                                "friday" : friday ? snacksData.friday + 1 : snacksData.friday,
                                "year" : snacksData.year,
                                "weekInYear" : snacksData.weekInYear
                }).then(() => res.json({message:"Your Response was added successfully"}))
                .catch(()=>{
                    res.json({message:"Your Response could not be recorded try again"})
                })

        }else{
            SNACKS.create({
                monday,tuesday,wednesday,thursday,friday,
                weekInYear:getCurrentWeek(),
                year:getCurrentYear()
              }).then(()=>{
                res.status(201).json({message:`New Entry for lunch created successfully.`});
              }).catch((err)=>{
                res.status(500).send({message:`Failed To Save Entry for Lunch , Try Again`});  
              })
        }
    }).catch(err =>{
        res.send(err);
    })
 
})


app.get("/lunch",(req,res)=>{
    
    LUNCH.find().then(lunchData =>{
        res.json(lunchData);
    })

})

app.get("/snacks",(req,res)=>{
    SNACKS.find().then(snacksData =>{
        res.json(snacksData);
    })

})



const server = app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})



