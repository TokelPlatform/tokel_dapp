const IPFS = require('ipfs-core');
const { Multiaddr } = require('multiaddr');

const tar = require('tar-stream');
const toStream = require('it-to-stream');
const FileType = require('file-type');

const IpfsAction = {
  GET_IPFS_IMAGE_DATA: 'get',
  STOP: 'stop',
};

// TODO move to user settings?
const IPFS_SEED_PEERS = [
  '/ip6/2606:4700:60::6/tcp/4009/ipfs/QmcfgsJsMtx6qJb74akCw1M24X1zFwgGo11h1cuhwQjtJP',
  '/ip4/172.65.0.13/tcp/4009/ipfs/QmcfgsJsMtx6qJb74akCw1M24X1zFwgGo11h1cuhwQjtJP',
  '/ip4/145.40.69.133/tcp/4001/ipfs/12D3KooWMZmMp9QwmfJdq3aXXstMbTCCB3FTWv9SNLdQGqyPMdUw',
  '/ip4/147.75.32.99/tcp/4001/ipfs/12D3KooWMSrRXHgbBTsNGfxG1E44fLB6nJ5wpjavXj4VGwXKuz9X',
  '/ip4/145.40.69.171/tcp/4001/ipfs/12D3KooWCpu8Nk4wmoXSsVeVSVzVHmrwBnEoC9jpcVpeWP7n67Bt',
  '/dnsaddr/nyc1-2.hostnodes.pinata.cloud/ipfs/QmPySsdmbczdZYBpbi2oq2WMJ8ErbfxtkG8Mo192UHkfGP',
  '/dnsaddr/fra1-1.hostnodes.pinata.cloud/ipfs/QmWaik1eJcGHq1ybTWe7sezRfqKNcDRNkeBaLnGwQJz1Cj',
  '/dns4/nft-storage-am6.nft.dwebops.net/tcp/18402/ipfs/12D3KooWCRscMgHgEo3ojm8ovzheydpvTEqsDtq7Vby38cMHrYjt',
  '/ip4/139.178.69.155/tcp/4001/ipfs/12D3KooWR19qPPiZH4khepNjS3CLXiB7AbrbAD4ZcDjN1UjGUNE1',
];

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

      log('Adding IPFS peers');
      IPFS_SEED_PEERS.forEach(peer => this.node.swarm.connect(new Multiaddr(peer)));
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
      const stream = toStream(this.node.get(ipfsId));

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
