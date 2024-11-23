import path from 'node:path';
import fs from 'node:fs';
import { ImageConverter } from '../../../src/tools/compress/imageConverter';
import { MemoryWritable } from '../../tools/memoryWritable';
import http from 'node:http';

describe('ImageConverter class', () => {

  it('ImageConverter.toWebp', async () => {
    let readStream = fs.createReadStream(path.resolve(__dirname, '../../assets/test_img.jpeg'));

    const writableStream = new MemoryWritable();

    const closeWirtableStream = (err?: unknown) => {
      writableStream.end();
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error('Error');
      }
    };

    writableStream.on('close', () => {
      closeWirtableStream();
    });

    writableStream.on('error', closeWirtableStream);

    writableStream.on('finish',  () => {
      const result = writableStream.getData();
      
      expect(result.length).toBeTruthy();

      closeWirtableStream();
    });

    await ImageConverter.toWebp(readStream, writableStream);
  });
});