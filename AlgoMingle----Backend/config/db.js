const mongoose = require("mongoose");
module.exports = function(){
    
    mongoose.connect("mongodb+srv://algomingle:maawanisin11@cluster0.anlxofe.mongodb.net/?retryWrites=true&w=majority")
    .then(console.log("DB connected Successfully :)")).catch((err) => {
        console.log("Error in Connecting DB ", err , process.env.DB_URL );
    })
}