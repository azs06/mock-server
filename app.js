const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')
const express = require('express');
const cors = require('cors');



const server = express();
const router = jsonServer.router('./db/db.json')
const userdb = JSON.parse(fs.readFileSync('./db/users.json', 'UTF-8'))

server.use(cors());
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

const expiresIn = '12h'

// Create a token from a payload 
function createToken(payload){
  return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token 
function verifyToken(token){
  return  jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ?  decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}){
  return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1;
}

function initAuth(){
    server.post('/auth/login', (req, res) => {
	  const {email, password} = req.body
	  if (isAuthenticated({email, password}) === false) {
	    const status = 401
	    const message = 'Incorrect email or password'
	    res.status(status).json({status, message})
	    return
	  }
	  const access_token = createToken({email, password})
	  res.status(200).json({access_token})
	})

	server.use(/^(?!\/auth).*$/,  (req, res, next) => {
	  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
	    const status = 401
	    const message = 'Error in authorization format'
	    res.status(status).json({status, message})
	    return
	  }
	  try {
	     verifyToken(req.headers.authorization.split(' ')[1])
	     next()
	  } catch (err) {
	    const status = 401
	    const message = 'Error access_token is revoked'
	    res.status(status).json({status, message})
	  }
	})
}

var myArgs = process.argv.slice(2)[0];
if(myArgs == 'enable-auth'){
	initAuth();
}

server.use(router)

server.listen(4000, () => {
  console.log('Running server on port 4000')
})