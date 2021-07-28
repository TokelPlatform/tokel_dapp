<div align="center">
  <img src="assets/tokel-header.png" width="100%" />
</div>

## About

Tokel Platform is Komodo ecosystem's token platform.
It consists of :

- TOKEL coin wallet - release 1
- Token wallet
- NFT marketplace
- DEX

At the moment the app is in development of release 1.

For more information about the project please join our [Discord](https://discord.gg/QzWaDNd4N5) or check out [tokel web](https://tokel.io)

## Install

```bash
yarn
```

The application is using [libnspv](https://github.com/KomodoPlatform/libnspv).


## Starting Development

We do not commit libnspv to the github coz git modifies the binaries, so you need to add binaries, seed folder and a coins file to `include/binaries/libnspv`. It should have the following structure. Ask about the current coin config for the chain in our [Discord](https://discord.gg/QzWaDNd4N5).

Setting for RPC port and the coin ticker name to connect to are in `src/vars/defines.ts` file

WINDOWS
```
libwinpthread-1.dll (win dependency)
msvcrt.dll (win dependecy)
nspv.exe
coins (libnspv config file, can be copied from the libnspv repo)
seeds (libnspv specific, can be copied from the libnspv repo)
```
[windows.zip](https://github.com/TokelPlatform/tokel_app/files/6893320/windows.zip)



LINUX
```
nspv-linux
coins (libnspv config file, can be copied from the libnspv repo)
seeds (libnspv specific, can be copied from the libnspv repo)
```

[linux.zip](https://github.com/TokelPlatform/tokel_app/files/6893322/linux.zip)


MAC
```
nspv-mac
coins (libnspv config file, can be copied from the libnspv repo)
seeds (libnspv specific, can be copied from the libnspv repo)
```

[mac.zip](https://github.com/TokelPlatform/tokel_app/files/6893324/mac.zip)


Start the app in the `dev` environment:

```bash
yarn dev
```

## Packaging for Production

To package apps for the local platform:

```bash
yarn package
```

## Docs

### Libnspv

[SPV technology](https://hackernoon.com/spv-proofs-explained-qd1p3r1q)
[Bitcoin Wiki - SPV](https://en.bitcoin.it/wiki/Scalability#Simplified_payment_verification)

articles by Jl777

[nSPV a simple approach to superlight clients leveraging notarizations](https://medium.com/@jameslee777/nspv-a-simple-approach-to-superlight-clients-leveraging-notarizations-75d7ef5a37a9)

[nSPV reference cli client](https://medium.com/@jameslee777/nspv-reference-cli-client-cf1ffdc03631)

[libnspv: evolution of nSPV](https://medium.com/@jameslee777/libnspv-evolution-of-nspv-ed157f8b159d)

Komodo docs
[nSPV](https://developers.komodoplatform.com/basic-docs/smart-chains/smart-chain-setup/nspv.html#spend)

## License

MIT ©
