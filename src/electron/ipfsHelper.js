const IPFS = require('ipfs-core');

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
  async get({ url }) {
    console.log('------', url);
    const testUrl = 'QmPoQ9xypTGknGTkxkCoHafo7ec2565irzYj9Q3oGKxQ4s';
    let data = '';

    const d = this.node.get(testUrl);
    // AsyncIterable<Uint8Array>

    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of d) {
      data += chunk;
    }
    const stream = toStream(
      this.node.cat(testUrl, {
        length: 100, // or however many bytes you need
      })
    );

    const type = await FileType.fromStream(stream);
    console.log('Filetype: ', type);

    return {
      filedata: data,
      ...type,
    };
  }

  async [IpfsAction.STOP]() {
    this.node.stop();
  }
}

const ipfsNodeInstance = new IpfsNodeSingleton();
export default ipfsNodeInstance;
