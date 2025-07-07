 
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');   

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

dotenv.config();  

connectDB(); 

const app = express();


app.use(express.json());  
app.use(cors());  

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

 
app.get('/', (req, res) => {
    res.send('Movie API is running...');
});

  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
