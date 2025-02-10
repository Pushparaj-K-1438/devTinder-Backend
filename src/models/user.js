const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name:{ type:'string', required: true},
        password:{ type:'string', required: true},
        email:{ type:'string', required: true, unique: true},
        age:{ type:'number', required: true},
        gender:{ type:'string', required: false},
        skills:{ type:'array', required: true},
        profilePhoto:{ type:'string', required: false},
        about:{type:'string', required: false}
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema);