const express = require("express")
const app = express();
require("dotenv").config()
require("./Connection/connection")
const cors=require("cors");
const UserAPI=require("./routes/user")
const TaskAPI=require("./routes/task")


app.use(cors())
app.use(express.json())


app.use('/api/v1',UserAPI);//localhost:1000/api/v1/sign-in
app.use('/api/v2',TaskAPI);//localhost:1000/api/v1/create-task

app.use('/',(req,res)=>{
    res.send("Hello from TaskBot")
})
const PORT=1000;
app.listen(PORT,()=>{
    console.log('Server is running');
    
})