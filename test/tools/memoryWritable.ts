import { Writable } from 'stream';

export class MemoryWritable extends Writable {
  private chunks: Uint8Array[];

  constructor(options = {}) {
    super(options);
    this.chunks = []; 
  }

  _write(chunk: Uint8Array, _: BufferEncoding, callback: (error?: Error | null) => void) {
    this.chunks.push(chunk);
    callback();
  }

  getData() {
    return Buffer.concat(this.chunks);
  }
}
