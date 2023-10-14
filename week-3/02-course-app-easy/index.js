const express = require('express');
const app = express();
const cors = require("cors");


app.use(cors);
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let isUser = (req,res,next)=>{
  const {username,password} = req.headers;
  const user = USERS.find((user)=>user.username==username && user.password==password);
  if(user){
    req.user=user;
    next();
  }
  else{
    res.status(404).send("Invalid credential");
  }
}

let isAdmin = (req,res,next)=>{
  const {username,password} = req.headers;
  const user = ADMINS.find((user)=>user.username==username && user.password==password);
  if(user){
    next();
  }
  else{
    res.status(404).send("Invalid credential");
  }
}
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username,password} = req.headers;

  const admin = ADMINS.find(u => u.username==username && u.password==password);

  if(admin){
    req.status(404).json({ message: 'Admin already exists' })
  }else{
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login',isAdmin, (req, res) => {
  // logic to log in admin
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  
});

app.put('/admin/courses/:courseId',isAdmin, (req, res) => {
  // logic to edit a course

});

app.get('/admin/courses',isAdmin, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username,password} = req.body;
  const index = USERS.findIndex((user) => user.username==username && user.password==password);
  if(index!=-1){
    res.status(404).send("User already exist.")
  }
  else{
    let user = {
      username,
      password,
      purchasedCourses:[]
    }
    USERS.push(user)
    res.status(200).send("User created successfully");
  }

});



app.post('/users/login',isUser, (req, res) => {
  // logic to log in user
  res.status(200).send("Logged in successfully");
});

app.get('/users/courses',isAdmin, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post('/users/courses/:courseId',isUser, (req, res) => {
  // logic to purchase a course
  const id  = Number(req.params.id);
  const purchasedCourses = req.user.purchasedCourses;
  const course = COURSES.find(course=>course.id==id);

  if(course){
    req.user.purchasedCourses.push(id);
    res.json({ message: 'Course purchased successfully' });
  }else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', isUser,(req, res) => {
  // logic to view purchased courses
  const ids = req.user.purchasedCourses;
  let courses = [];
  for(let i=0;i<COURSES.length;i++){
    if(ids.indexOf(i)!=-1){
      courses.push(COURSES[i]);
    }
  }
  res.json(courses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
