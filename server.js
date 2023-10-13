require('dotenv').config()
const express = require('express');
const app = express();
const MongoDB = require('./config/connectDB');
const bodyParser = require('body-parser');
const User = require('./models/userSchema');
const Products = require('./models/productSchema');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tokens = require('./models/token');
var cookieParser = require('cookie-parser')
const hashPassword = require('./config/bcrypt');

const port = process.env.PORT;
MongoDB()
app.use(bodyParser.json())
app.use(cors(
    origin = process.env.ORIGIN,
    credentials = true,
    methods = ['GET', 'POST', 'PUT', 'DELETE'],
));
app.use(cookieParser())

app.get('/', (req, res) => res.send('Hello Worljd!'));

app.get('/token', async (req,res) => {
    const user = jwt.verify(req.cookies.cookie, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({name: user.user.name, email: user.user.email, id: user.user._id})
    
})
app.get('/products', async (req,res) => {
    const products = await Products.find();
    res.status(200).json(products)
    
})
app.get('/token', async (req,res) => {
    const users = await User.find();
    res.status(200).json(users);
})
app.post('/register', async (req,res) =>{
    const {name, email,password} = req.body;
    try{
        
        
        const hashpassword = await hashPassword(password);
        const user = new User({name,email, hashpassword});
        const usernameTaken = await User.usenameTaken(name)
        const emailTaken = await User.emailTaken(email)
        if(usernameTaken) return res.status(400).json({message: 'Username is already taken'});

        if(emailTaken) return res.status(401).json({message: 'Email is already taken'});
        
        
        

        await user.save();
        res.status(201).json(user);
    }catch(err){
        res.status(500).json({message: err.message})
    }
})
app.post('/login', async (req,res) =>{
    const {email,password} = req.body;
    try{
        const user = await User.findOne({email: email})
        if(!user){
            return res.status(402).json({message: 'User not found'})
        }else{
            
            if(bcrypt.compareSync(password, user.hashpassword)){
                
                const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET)
                const accessToken =jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET , { expiresIn: ACCESS_TOKEN_EXPIRE_TIME })
                const token = await Tokens({id: user._id, refreshToken: refreshToken})
                await token.save();

                  
                
                res.status(200).cookie("cookie",accessToken, {expires: new Date(Date.now() + (10*24*60*60*1000)), httpOnly: true}).json({success: "succcess"})


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
