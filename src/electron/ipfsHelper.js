const IPFS = require('ipfs-core');

const tar = require('tar-stream');
const toStream = require('it-to-stream');
const FileType = require('file-type');

const IpfsAction = {
  GET_IPFS_IMAGE_DATA: 'get',
  STOP: 'stop',
};

const log = (...messages) => {
  console.group('IPFS NODE (IPFS HELPER)');
  console.log(...messages);
  console.groupEnd();
};

class IpfsNodeSingleton {
  node;

  constructor() {
    this.node = null;
    log('IPFS class initiated');
    this.initNode();
  }

  async initNode() {
    try {
      const node = await IPFS.create();
      log('IPFS node created');
      this.node = node;
      return 0;
    } catch (e) {
      log('IPFS node creation error', e);
      return e;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  get({ ipfsId }) {
    return new Promise((resolve, reject) => {
      if (!this.node) reject(Error('IPFS node is not defined'));

      const extract = tar.extract();

      let type;
      const files = [];

      extract.on('entry', (header, stream, next) => {
        log('Receiving piece of stream');
        const buffers = [];

        stream.on('data', chunk => buffers.push(chunk));

        stream.on('end', () => {
          files.push(Buffer.concat(buffers));
          next();
        });

        stream.resume();
      });

      extract.on('finish', async () => {
        log('Finishing stream');
        type = await FileType.fromBuffer(files[0]);
        const base64 = `data:${type.mime};base64,${files[0].toString('base64')}`;
        log('Resolving base64', type);
        resolve({ filedata: base64, type });
      });

      log('Starting stream', ipfsId);
      const stream = toStream(
        this.node.get(ipfsId, {
          length: 100,
        })
      );

      stream.pipe(extract);
    });
  }

  async [IpfsAction.STOP]() {
    log('Stopping IPFS node');
    this.node.stop();
  }
}

const ipfsNodeInstance = new IpfsNodeSingleton();
export default ipfsNodeInstance;
