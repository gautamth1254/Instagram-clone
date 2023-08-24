const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const RequireLogin = require('../Middleware/RequireLogin');
const POST = mongoose.model("POST");

// Route

router.get("/allposts",RequireLogin,(req,res)=>{
    // konsa data chahiye uske model kya hai 
    POST.find()
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(posts=>res.json(posts))
    .catch(err=>console.log(err)); 
})


router.post('/createPost',RequireLogin,(req, res) => {
    const {body,pic} = req.body;
    if(!body || !pic){
        return res.status(422).json({error: "Please add all the fields"})
    }
    console.log(req.user)
    const post = new POST({
        
        body,
        photo:pic,  /// frontend -react se pic naam se aa rha hai photo
        postedBy: req.user
    })
    //res.json("OK")
    post.save().then((result) =>{
        return res.json({post:result})
    }).catch(err=>console.log(err))
})

router.get("/mypost",RequireLogin,(req, res)=>{
    POST.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(result=>{
        res.json(result);
    })
})

router.put("/like",RequireLogin,(req, res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put("/unlike",RequireLogin,(req, res)=>{
    POST.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true // isko bta de ki new update hai
    }).populate("postedBy","_id name")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put("/comment",RequireLogin,(req,res)=>{
    const comment={
        comment:req.body.text,
        postedBy:req.user._id
    }
    POST.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

module.exports= router;