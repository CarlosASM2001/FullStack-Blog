require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret  = 'dfbdfbd5f644ergerg45brtbr';

app.use(cors({credentials: true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

//desarrollo
/*
mongoose.connect('mongodb://bloguser:blogpass@localhost:27017/blogdb?authSource=admin').then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));*/

// Producción

mongoose.connect(process.env.MONGO_URI || 'mongodb://bloguser:blogpass@mongo:27017/blogdb?authSource=admin')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));


//mongoose.connect('mongodb+srv://calsemo2001:CJhdawB8lV8p1oyK@cluster0.1nl0brg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');


//CJhdawB8lV8p1oyK - clave
//calsemo2001 - usuario





app.post('/register', async (req,res) => {
    const {username, password} = req.body;

    try{

        const userDoc = await User.create({
            username,
            password : bcrypt.hashSync(password,salt)
        });
        res.json(userDoc);

    }catch(e){
        res.status(400).json(e);
    }
    

    

})


app.post('/login', async (req, res) =>{

    const {username,password} = req.body;

    try {
        const userDoc = await User.findOne({username})

        const passOk = bcrypt.compareSync(password, userDoc.password);

        if(passOk){
            //logged in
            jwt.sign({username, id: userDoc._id}, secret, {}, (err,token) =>{
                if(err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username,
                });
            })

        }else{
            res.status(400).json('Wrong credentials');
        }
        
        
    } catch (error) {
        console.log(error);
    }


});



app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  
  // Si no hay token, devuelve un error 401
  if (!token) {
    return res.status(401).json({ error: "No autorizado: token no proporcionado" });
  }

  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }
    res.json(info);
  });
});


app.get('/post', async (req, res) => {

  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20));
  
});

/*
app.get('/profile', (req,res) =>{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info)=>{
        if(err) throw err;

        res.json(info);
    })


});
*/

app.post('/post',uploadMiddleware.single('file'), async (req, res) => {

  const {originalname, path} = req.file;

  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath); // Renombrar el archivo con su extensión original

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    const {title, summary, content} = req.body;

    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id
    });

    res.json(postDoc);

  });
  
});


app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});


app.post('/logout' , (req,res) => {
    res.cookie('token' , '').json('ok');
})






//desarrollo
// Agrega esto en index.js (solo para desarrollo)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.listen(4000);


//mongodb+srv://calsemo2001:CJhdawB8lV8p1oyK@cluster0.1nl0brg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

