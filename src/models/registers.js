const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique:[true,"Email id already used"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
   username:{
        type:String,
        required:true,
        minlength:3,
    },
   password:{
        type:String,
        required:true,
        minlength:3,
    },
    conpassword:{
        type:String,
        required:true,
        minlength:3,
    },
    userType:{
        type:String,
        required:true,
        enum:["Normal-User"],
    },

});
// const messOwnerSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required:true,
//         unique:[true,"Email id already used"],
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error("Email is invalid");
//             }
//         }
//     },
//    username:{
//         type:String,
//         required:true,
//         minlength:3,
//     },
//    password:{
//         type:String,
//         required:true,
//         minlength:3,
//     },
//     conpassword:{
//         type:String,
//         required:true,
//         minlength:3,
//     },
//     userType:{
//         type:String,
//         enum:["Mess-Owner"],
//         required:true,
//     },
//     messName:{
//         type:String,
//         maxlength:15
//     },
//     cnumber:{
//         type:Number,
//         maxlength:10,
//         minlength:10
//     },
//     foodServing:{
//         type:String,
//         // required:true
//     },

// });

const messOwnerSchema2= new mongoose.Schema({
    email: {
        type: String,
        required:true,
        // unique:[true,"Email id already used"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
   username:{
        type:String,
        required:true,
        minlength:3,
    },
   password:{
        type:String,
        required:true,
        minlength:3,
    },
    conpassword:{
        type:String,
        required:true,
        minlength:3,
    },
    userType:{
        type:String,
        enum:["Mess-Owner"],
        required:true,
    },

    cnumber:{
        type:Number,
        maxlength:10,
        minlength:10
    },
    foodServing:{
        type:String,
        // required:true
    }  ,
    dailymenu: [
        {
          date: {
            type: Date,
            
          },
          messsName:{
            type:String,
        },
          meal: {
            type: String,
            // required: true,
            enum: ["lunch", "dinner"],
          },
          riceplate: {
            type: String,
            // required: true,
          },
          subji1: {
            type: String,
            // required: true,
          },
          subji2: {
            type: String,
            // required: true,
          },
          subji3: {
            type: String,
            // required: true,
          },
          rice: {
            type: String,
            // required: true,
          },
},
],
    });
// we will create a new collection
const User = new mongoose.model('User',UserSchema);
const MessOwner = new mongoose.model('MessOwner',messOwnerSchema2);


module.exports = {
    User,
    MessOwner,
};


    // const MessOwnerMenu = mongoose.model("MessOwnerMenu", messOwnerMenuSchema);
    // module.exports= MessOwnerMenu;