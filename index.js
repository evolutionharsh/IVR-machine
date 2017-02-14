'use strict'
const express = require('express')
const path= require('path')
const bodyParser = require('body-parser')
const twilio = require('twilio')
const getUni = require('./lib/uni.js')
const app = express()

app.use(express.static(path.join(__dirname, '/assets')))
app.use(bodyParser.urlencoded({ extended: false}))

app.get('/',(req,res) => {
    res.send('Hello Rashmi!!I Love You so much!!!')
})

app.post('/ivr/welcome', (req,res) => {
    let twiml = new twilio.TwimlResponse()
    twiml.gather({
        numDigits: 1,
        action: '/ivr/menu'
        
        }, node => {
            node.play('/audio/(webmusic.in)_Its-The-Time-To-Disco.mp3')
       // this.say('Hello, Please press 1 to continue', {
         //   voice:'alice',
           // language:'en-IN'
            //})
    })
    
            res.send(twiml.toString())
           
});

app.post('/ivr/menu', (req,res) => {
    //let digit = req.body.Digits
  
    let twiml = new twilio.TwimlResponse()
    twiml.gather({
        numDigits: 1,
        action: '/ivr/step1'
        }, node =>
                 {
              node.say('Please tell me why are you calling.Select from the following options.')      
              node.say('Press 1 If u you are sick.')
              node.say('Press 2 If u want to know nearest college where you can find doctor')
                 })
    
    res.send(twiml.toString())
})

app.post('/ivr/step1',(req,res) => {
    let digit = parseInt(req.body.Digits)
    let twiml = new twilio.TwimlResponse()
    
    if (!digit) {
        twiml.say("I didn't get any response.Gudbye")
        twiml.redirect('/ivr/menu')
        return res.send(twiml.toString())
    }
    
    if (digit === 1) {
       twiml = Iwanttohavesex(twiml)
         res.send(twiml.toString())
    } else if (digit === 2) {
        
        Ibecomesexpredator(req.body.FromZip)
        .then(uni => {
            
            twiml.say(`I think the ${uni} is nearby. Go there and find good doctor to cure your illness`);
            res.send(twiml.toString())
        })
    }
    
})

function Iwanttohavesex(twiml)
{   twiml.gather({action:'/ivr/step2', timeout: 8}, node =>{
     node.say('I know that you would like to meet Doctor.You are feeling feverish due to same.GoodBye')
     node.say('On a scale of 1 to 10,Let us know how much fever do you have?,Please enter a digit ') 
})
   
     return twiml
}
function Ibecomesexpredator(zip)
{
    return getUni(zip)
}

app.post('/ivr/step2',(req,res) => {
    let digits = parseInt(req.body.Digits)
    let twiml = new twilio.TwimlResponse()
    if (!digits) {
        twiml.say('I didnt get any response')
        twiml.redirect('/ivr/step1')
        return res.send(twiml.toString())
    }
    
  
     //let twiml = new twilio.TwimlResponse()
    if(digits <=3){
        twiml.say('Rest up.You will be ok after one cough syrup!!!');
    } else if (digits <=7)
    {
        twiml.say('You will feel ok after steam and one cough syrup');
    } else if (digits <=9)
    {
        twiml.say('oh my god!!if you feeling high temperature!you should not be late and visit nearest Doctor as much as early u can');
    } else {
        twiml.say('I am sorry.You will die of fever if you dont visit faster to nearest Doctor');
    }
   
    
    //twiml = respMap[digit](twiml)
    res.send(twiml.toString())
})
app.listen(3000)
