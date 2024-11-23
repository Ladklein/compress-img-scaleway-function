import express from 'express';
import * as middlewares from './middlewares';
import { MessageResponse } from './interfaces';
import * as fs from 'fs';

import path from 'path';
import { ImageConverter } from './tools/compress/imageConverter';


const app = express();

app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.post<{}, MessageResponse>('/compress', async (req, res) => {
  let readStream = fs.createReadStream(path.join(__dirname, 'test.png'));
  let writer = fs.createWriteStream(path.join(__dirname, 'test5.webp'));

  await ImageConverter.toWebp(readStream, writer);

  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});


app.get<{}, MessageResponse>('/compress/download', (req, res) => {
  const file = path.join(__dirname, 'test3.webp');
  res.download(file); 
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;