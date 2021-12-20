const app = require("./app");
const dotenv = require("dotenv");

//setting up env path
dotenv.config({path:'config/config.env'});

// Handling uncaught Exception

process.on("uncaughtException",err=>{
    console.log(`Error:${err.message}`);
    console.log("Shutting down server due to uncaught exception");
    process.exit(1);
})

// creating server to listen to port 
const server = app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`);
});

// Handling unhandled exceptions

process.on("unhandledRejection",err=>{
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down server due to unhandled rejection");
    server.close(()=>{
        process.exit(1);
    })
})