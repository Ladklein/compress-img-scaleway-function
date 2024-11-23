import { Readable, PassThrough, Writable } from 'stream';
import { spawn } from 'node:child_process';

const COMPRESS_FFMPEG_CONFIG = [
  '-i', 'pipe:0',
  '-loop', '0',  
  '-f', 'webp',   
  '-frames:v', '1',
  '-q:v', '1',
  'pipe:1',  
];

const WrongBytesPositionNumber = 4;
const RigthBytesPosition = 4;

export class ImageConverter {

  static toWebp(source: Readable, destination: Writable):  Promise<void> {

    const collectStream = ImageConverter.collectData(destination);
    return new Promise((resolve, reject) => {
      
      const ffmpegProcess = spawn('ffmpeg', COMPRESS_FFMPEG_CONFIG,  { stdio: 'pipe' });
      source.pipe(ffmpegProcess.stdin);

      ffmpegProcess.stdout.pipe(collectStream);

      ffmpegProcess.stdout.on('error', reject);

      ffmpegProcess.stderr.on('end', function () {
        console.log('file has been converted succesfully');
      });

      ffmpegProcess.stderr.on('exit', function () {
        console.log('child process exited');
      });

      ffmpegProcess.stderr.on('close', () => {console.log('ici');  resolve();} );

      ffmpegProcess.on('error', (error) => {
        console.error(`Erreur lors de l'exécution de la commande : ${error.message}`);
      });
    });
  }

  // the pipe from spawn make some 4 bytes on ending stream.
  static fixeBufferFromFfmpeg(data: Buffer) {
    const wrongPositionChar = data.subarray(data.length - WrongBytesPositionNumber);
    return Buffer.concat([
      data.subarray(0, RigthBytesPosition),
      wrongPositionChar,
      data.subarray(RigthBytesPosition + WrongBytesPositionNumber),
    ]);
  }
  
  static collectData(destination: Writable) {
    let collectedData = Buffer.alloc(0); 
  
    const passThroughStream = new PassThrough();
  
    passThroughStream.on('data', (chunk) => {
      collectedData = Buffer.concat([collectedData, chunk]);
    });
  
    passThroughStream.on('end', () => {
      destination.write(ImageConverter.fixeBufferFromFfmpeg(collectedData));
    });

    destination.on('finish', () => {
      passThroughStream.end();
    });
  
    return passThroughStream;
  }
}