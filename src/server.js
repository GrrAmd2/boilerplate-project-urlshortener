import dotenv from "dotenv"
import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import { isValid, UrlShort } from './Shortener.js';
import { nanoid } from 'nanoid';

const app = express();
dotenv.config()
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true})

// Basic Configuration
const port = process.env.PORT || 3000;
app.use(express.urlencoded({extended: false}))
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', async (req, res) => {
  const {url} = req.body;
  if(isValid(url)){

      const urlObj = await UrlShort.create({
        original_url: url,
        short_url: nanoid(5)
      });
      return res.json(urlObj)
  }
  return res.json({error: 'invalid url'})
});

app.get('/api/shorturl/:short', async(req, res) => {
  const short = req.params.short;
  const exist = await UrlShort.findOne({short_url: short}).exec();
  if(exist){
    return res.redirect(exist.original_url)
  }
  return res.json({error: 'invalid url'})
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
