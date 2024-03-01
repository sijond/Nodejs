const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3005;

// MongoDB connection URI for remote host
const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}`;

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema for student document
const studentSchema = new mongoose.Schema({
  studentName: String,
  emailAddress: String,
  phoneNumber: String,
  studentRollNumber: String,
  fatherName: String,
  bookIssuedName: String
});

// Create model from schema
const Student = mongoose.model('Student', studentSchema);

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/signup', async (req, res) => {
  const { studentName, emailAddress, phoneNumber, studentRollNumber, fatherName, bookIssuedName } = req.body;

  try {
    // Create new student document
    const student = new Student({ studentName, emailAddress, phoneNumber, studentRollNumber, fatherName, bookIssuedName });
    // Save student document to MongoDB
    await student.save();
    res.redirect('/success.html');
  } catch (error) {
    console.error('Error inserting student data:', error);
    res.status(500).send('Error inserting student data');
  }
});

// Serve registered user details
app.get('/registeredDetails', async (req, res) => {
  try {
    // Find all student documents in the collection
    const allStudents = await Student.find({});
    res.json(allStudents);
  } catch (error) {
    console.error('Error retrieving registered details:', error);
    res.status(500).send('Error retrieving registered details');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
