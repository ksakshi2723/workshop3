const express = require('express');
const app = express();
const uuid = require('uuid');
const multer = require("multer");
const path = require("path");
const { profile } = require('console');
const { request } = require('http');

// storage engine 

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000
    }
})
app.use('/profile', express.static('upload/images'));
app.put("/upload", upload.single('profile'), (req, res) => {
    const id=uuid.v1();
    console.log("ID:"+id);

    res.json({
        id:id,
        
        success: 1,
        
        profile_url: `http://localhost:4000/profile/${req.file.filename}`
    })

})

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
    
            success: 0,
            message: err.message
        })
    }
}
app.use(errHandler);
app.listen(3000, () => {
    console.log("server up and running");
})

app.delete("profile/:id",function(req,res){
    profile.deleteOne({id:req.params.id}).then((result)=>{
res.status(200).json(result)

    }).catch((err)=>{console.warn(err)})
    

})

