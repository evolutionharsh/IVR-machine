'use strict'
const express = require('express')
const path= require('path')
const bodyParser = require('body-parser')
const twilio = require('twilio')
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
        action: '/ivr/step1'
        
        }, function() {
            this.play('/audio/(webmusic.in)_Its-The-Time-To-Disco.mp3')
       // this.say('Hello, Please press 1 to continue', {
         //   voice:'alice',
           // language:'en-IN'
            //})
    })
    
            res.send(twiml.toString())
           
});

app.post('/ivr/step1', (req,res) => {
    let digit = req.body.Digits
    let twiml = new twilio.TwimlResponse()
    twiml.say(`You pressed the number ${digit}`)
    res.send(twiml.toString())
})
app.listen(3000)