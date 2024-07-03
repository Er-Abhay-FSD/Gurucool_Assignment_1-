const jwt = require('jsonwebtoken');

const JWT_SECRET = '2eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsInVzZXJuYW1lIjoidGVzdFVzZXIiLCJpYXQiOjE3MTk4NjcxODcsImV4cCI6MTcxOTg3MDc4N30.5BXCAQ-iVh4gGmCF74r6oj8Ncqn83jcGUPXEdBcPoxw';
const userId = '6683cf92289ad02f0e5f7579';

const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
console.log('JWT Token:', token);

