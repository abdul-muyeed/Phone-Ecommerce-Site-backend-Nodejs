require("dotenv").config();
const express = require("express");
const app = express();
const MongoDB = require("./config/connectDB");
const bodyParser = require("body-parser");
const User = require("./models/userSchema");
const Products = require("./models/productSchema");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Tokens = require("./models/token");
var cookieParser = require("cookie-parser");
const hashPassword = require("./config/bcrypt");

const port = process.env.PORT;
MongoDB();
app.use(bodyParser.json());
app.use(
  cors(
    (origin = process.env.ORIGIN),
    (credentials = true),
    (methods = ["GET", "POST", "PUT", "DELETE"])
  )
);
app.use(cookieParser());

app.get("/", (req, res) => res.send("Hello Worljd!"));

app.get("/logout/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const token = await Tokens.findOneAndDelete({ id: id })
        console.log(token);
       res.status(200).clearCookie("cookie").json({ message: "logout successfully" });
        // res.status(200).json({ message: "logout successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }


})

app.get("/refresh", async (req, res) => {
  try {
    const cookie = req.cookies.cookie;
    if (!cookie) return res.status(401).json({ message: "Unauthorized" });
    if (cookie) {
      const token = cookie.accessToken;

      const user = await jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decode) => {
          if (decode) return decode;

          if (err.message === "jwt expired") {
            console.log("expired");
          }
        }
      );

      if (user) {
        console.log(user, "user");
        return res.status(200).json({id: user.user._id,name: user.user.name,email: user.user.email});
      } else {
        const id = cookie.id;
        const refreshTokenobj = await Tokens.findOne({ id: id });
        const refreshuser = await jwt.verify(
          refreshTokenobj.refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        console.log(refreshuser, "refreshuser");
        const accessToken = jwt.sign(
          { user: refreshuser.user },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30m' }
        );
        return res.status(200).cookie("cookie",{ accessToken, id: refreshuser.user._id },{expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),httpOnly: true,}).json({id: refreshuser.user._id,name: refreshuser.user.name,email: refreshuser.user.email,});
      }
    }
  } catch (err) {
    console.log(err);
  }
});
app.get("/products", async (req, res) => {
  const products = await Products.find();
  res.status(200).json(products);
});
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashpassword = await hashPassword(password);
    const user = new User({ name, email, hashpassword });
    const usernameTaken = await User.usenameTaken(name);
    const emailTaken = await User.emailTaken(email);
    if (usernameTaken)
      return res.status(400).json({ message: "Username is already taken" });

    if (emailTaken)
      return res.status(401).json({ message: "Email is already taken" });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(402).json({ message: "User not found" });
    } else {
      if (bcrypt.compareSync(password, user.hashpassword)) {
        const refreshToken = jwt.sign(
          { user },
          process.env.REFRESH_TOKEN_SECRET
        );
        const accessToken = jwt.sign(
          { user },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '30m' }
        );
        const token = await Tokens({
          id: user._id,
          refreshToken: refreshToken,
        });
        await token.save();

        res
          .status(200)
          .cookie(
            "cookie",
            { accessToken, id: user.id },
            {
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            }
          )
          .json({ success: "succcess" });
      } else {
        return res.status(401).json({ message: "Incorrect Password" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
