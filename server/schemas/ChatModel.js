const  mongoose  = require("mongoose");
const  chatSchema  =  mongoose.Schema(
    {
    message: String,
    sender:  String,
    color: String
    },
        {
    timestamps: true
});

module.exports  =  mongoose.model("Chat", chatSchema);