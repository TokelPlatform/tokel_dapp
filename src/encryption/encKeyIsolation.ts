// Use a closure and a WeakMap to emulate having a "private" variable to store the key, as using a
// TS class with the private keyword just warns that the variable shouldn't be accessed directly,
// but it's not actually "private" in a memory-safety sense. This doesn't really do anything at the
// moment, but the intention is to improve the ergonomics of doing things securely to prevent
// accidental key exposure / etc.

// // Not-as-useful class implementation, passed over for closure solution
// class EncKey {
//   private key?: Buffer;
//
//   constructor(key?: Buffer) {
//     if (key) {
//       this.key = key;
//     }
//   }
//
//   set(key: Buffer) {
//     this.key = key;
//   }
//
//   get(): Error | Buffer {
//     if (this.key === undefined) {
//       return new Error('key is not set');
//     }
//     return this.key;
//   }
//
//   delete() {
//     this.key = undefined;
//   }
// }

function EncKey() {
  const ekm = new WeakMap();

  return {
    get() {
      if (ekm.get(this) === undefined) {
        return new Error('key is not set');
      }
      return ekm.get(this);
    },
    set(key: Buffer) {
      ekm.set(this, key);
    },
    delete() {
      ekm.delete(this);
    },
  };
}

export default EncKey;
