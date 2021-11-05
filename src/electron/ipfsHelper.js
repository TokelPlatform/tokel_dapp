const IPFS = require('ipfs-core');

const tar = require('tar-stream');
const toStream = require('it-to-stream');
const FileType = require('file-type');

const IpfsAction = {
  GET_IPFS_IMAGE_DATA: 'get',
  STOP: 'stop',
};

class IpfsNodeSingleton {
  node;

  constructor() {
    this.node = null;
    console.log('Created IpfsNode class');
    this.initNode();
  }

  async initNode() {
    try {
      const node = await IPFS.create();
      console.log('NOOODE CREATEDDDD');
      this.node = node;
      return 0;
    } catch (e) {
      console.log('ipfs node creation error: ', e);
      console.log('cannot initiate node');
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
        const buffers = [];

        stream.on('data', chunk => buffers.push(chunk));

        stream.on('end', () => {
          files.push(Buffer.concat(buffers));
          next();
        });

        stream.resume();
      });

      extract.on('finish', async () => {
        type = await FileType.fromBuffer(files[0]);
        const base64 = `data:${type.mime};base64,${files[0].toString('base64')}`;
        resolve({ filedata: base64, type });
      });

      const stream = toStream(
        this.node.get(ipfsId, {
          length: 100,
        })
      );

      stream.pipe(extract);
    });
  }

  async [IpfsAction.STOP]() {
    this.node.stop();
  }
}

const ipfsNodeInstance = new IpfsNodeSingleton();
export default ipfsNodeInstance;
