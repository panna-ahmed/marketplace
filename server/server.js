import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
import mongoose from 'mongoose';
//import csrf from 'csrf';
const morgan = require('morgan');
require('dotenv').config();

const app = express();
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB Connection Error:', err));

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));
//app.use(csrf({ cookie: true }));
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: req.csrfToken() });
// });
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on ${port}`));
