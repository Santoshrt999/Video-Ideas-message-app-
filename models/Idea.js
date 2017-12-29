const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//creating schema
const IdeaSchema = new Schema({
    title:{
        type: String,
        requried: true
    },
    
        details:{
            type: String,
            required: true
        },
        date:{
            type:Date,
            default:Date.now
        }
    
});

mongoose.model('ideas', IdeaSchema);