const express = require('express');
const app = express();
const MongoDB = require('./config/connectDB');
const bodyParser = require('body-parser');
const User = require('./models/userSchema');
const cors = require('cors');
const port = 3000;
MongoDB()
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => res.send('Hello Worljd!'));
// const User
app.post('/register', async (req,res) =>{
    const {name, email,password} = req.body;
    try{
        const user = new User({name,email,password});
        await user.save();
        res.status(201).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
})
app.post('/login', async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(404).json({message: 'User not found'})
        }else{
            if(user.password === password){
                
                return res.status(200).json(user)
            }else{
                return res.status(401).json({message: 'Incorrect Password'})
            }

                
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message: err.message});
    }
})


app.listen(port, () => console.log(`App listening on port ${port}!`));
