require('dotenv').config();
const  express =  require('express');
const cookieParser = require('cookie-parser'); 
const session =  require('express-session');
// const mongoStore = require('connect-mongo');
const app =  express();
const router =  require('./routes/route')
const expresslayout =require('express-ejs-layouts');
const { render } = require('ejs');
const  PORT = 4000 || process.env.PORT;
const connect = require('./DB/DB');
// const main =  require('./router/main');
// const admin = require('./router/admin')

app.use(express.json()); // Middleware to parse JSON body
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
app.use(cookieParser());
// app.use(cookieParser());
// const methodOverride = require('method-override');
// app.use(methodOverride('_method'));

// connect()
// TEMPLETE ENGENE
app.use(expresslayout);
app.set('view engine','ejs');
app.use('/',router);
// app.use('/',admin)
// app.use('/register',admin)
// app.use('/dashboard',admin);
app.set('layout','./layouts/main');

app.get('/test-cookie', (req, res) => {
    const token = req.cookies.token;
    console.log(token);
    if (token) {
      res.send(`Token from cookie: ${token}`);
    } else {
      res.send('No token found in cookies');
    }
  });





app.listen(PORT, ()=>console.log("application is running on port "+PORT))