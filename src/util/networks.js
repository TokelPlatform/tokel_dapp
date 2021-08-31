const networks = {
  tkltest: {
    messagePrefix: '\x18TKLTEST asset chain:\n',
    bech32: 'R',
    bip32: {
      // base58 'xpub'
      public: 0x0488b21e,
      // base58 'xprv'
      private: 0x0488ade4,
    },
    pubKeyHash: 0x3c,
    scriptHash: 0x55,
    wif: 0xbc,
    consensusBranchId: {
      1: 0x00,
      2: 0x00,
      3: 0x5ba81b19,
      4: 0x76b809bb, // (old Sapling branch id - used in kmd)
      // 4: 0x2bb40e60
      // 4: 0xf5b9230b
    },
    coin: 'zec',
    komodoAssetNet: true,
    magic: 0xf6475548,
  },
};

module.exports = networks;
