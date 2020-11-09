const  mongoose  = require("mongoose");
const  chatSchema  =  mongoose.Schema(
    {
    message: String,
    sender:  String
    },
        {
    timestamps: true
});

module.exports  =  mongoose.model("Chat", chatSchema);