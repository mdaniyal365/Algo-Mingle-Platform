const Wrapper = require("../middlewares/Wrapper");
const {v4} = require("uuid");
const  Interview  = require("../models/interview")

exports.createARoom = Wrapper(async function(req , res , next){
    const interview = await Interview.create({
        interviewId : v4(),
        timeOfCreation : Date.now()
    })
    console.log("CreateRoom");
    res.status(200).json({
        msg : "Interview Session is Created Successfully",
        interview_room_id : interview.interviewId
    })
})
exports.isValidRoom = Wrapper(async function(req , res , next){
    const {roomId} = req.query;
    
    const result = await Interview.findOne({interviewId : roomId});
    if(!result){
        res.status(400).json({
            msg : "Invalid Interview Room"
        })        
    }else{
        res.status(200).json({
            msg : "Ok"
        })
    }
})