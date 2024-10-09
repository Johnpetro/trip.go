const express =  require('express');
const { Pool } = require('pg');
const pool =  require('../DB/DB')
const Joi = require('joi')
const {check , validationResult} =  require('express-validator')
const bcrypt =  require('bcrypt');
const  jwt =  require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const salt =  process.env.MY_SECRET ;

const router = express.Router();

// authentification

const authMiddleware =(req,res,next)=>{
    const token = req.cookies.token;
//   console.log("TOKEN...........: " + token);

  if (!token) {
    return res.status(401).render('error')
  }

  try {
    const decoded = jwt.verify(token, salt); // Verifying the token with the secret key
    req.user = decoded; // Attaching decoded token payload to the request object
    console.log(decoded)
    console.log(token);
    next(); // Proceed to the next middleware or route handler
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
}
// authMiddleware();






router.get('/',(req,res)=>{
    res.render('index');
})
router.get('/login',(req,res)=>{
    const error = "";
    res.render('login', { error });
})
router.get('/home',authMiddleware,(req,res)=>{
    res.render('home');
})
router.get('/register',(req,res)=>{
    // res.render('register');
    // let result = null; // Set result to null or any other value
    
    res.render('register', { errors: {} });
})
router.post('/register',
    [
        check('username').notEmpty().withMessage('Username should not be empty'),
        check('email').isEmail().withMessage('Email  Is Required'),
        check('password').notEmpty().withMessage('Password should not be empty'),
        check('phone').notEmpty().withMessage('Enter the phone number')

    ],async(req,res)=>{

    const {username,password,email,phone} = req.body;
    // consider validation
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.render('register',{errors:errors.mapped()});
    }
    
    try{
        const  hashedpassword = await  bcrypt.hash(password,10)
        
        const result = await  pool.query(`INSERT INTO customer("username","password","email","phone") VALUES($1,$2,$3,$4) RETURNING  *`,[username,hashedpassword,email,phone]);
        if(!result)return res.status(400).res.json({message:"fail to register"});
       return res.redirect('/login');
    }catch(ex){
        console.log(ex.message)
    }
})

router.post('/login',[
    check('email').notEmpty().withMessage('Message is Required'),
    check('password').notEmpty().withMessage("Password is Required")
],async(req,res)=>{
const errors =  validationResult(req);
    const {email,password} =  req.body;

try{

    const result =  await pool.query('SELECT * FROM customer WHERE email = $1',[email]);
    if(!result)return res.status(401).send('invalid credential')
     const getPassword =  result.rows[0].password;
    const isvalid = await bcrypt.compare(password,getPassword);
    if(isvalid){
        const token =  jwt.sign({userId:result.rows[0].id},salt);
        res.cookie('token',token,{httpOnly:true});
        console.log(token)
        res.status(201).redirect('/home')

    }else{
        const error ="incorrect email or password"

        res.render('login',  {error});
    }
}catch(ex){
    const error ="incorrect email or password"

    res.render('login',  {error});
console.log(ex.message)
}

})

module.exports = router