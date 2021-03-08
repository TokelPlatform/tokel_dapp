<img src="http://libbtc.github.io/images/libbtc/logo@2x.png" alt="Icon" style="width:64px;"/>

**Documentation update in progress**

libnspv – a portable C library for creating and manipulating data structures and interacting with the p2p network on
Komodo-compatible Smart Chains including the KMD main chain.

**Based on Libbtc**

=============================================================

[![Build Status](https://travis-ci.org/libbtc/libbtc.svg?branch=master)](https://travis-ci.org/libbtc/libbtc) [![Coverage Status](https://coveralls.io/repos/libbtc/libbtc/badge.svg?branch=master&service=github)](https://coveralls.io/github/libbtc/libbtc?branch=master)

## What is libbtc?

Libbtc is a very portable C library for creating and manipulating bitcoin data structures and interacting with the p2p network.

## Current features

- Generating and storing private and public keys
- ECDSA secp256k1 signing and verification (through [libsecp256k1](https://github.com/bitcoin-core/secp256k1) included as git subtree)
- Generate recoverable signatures (and recover pubkey from signatures)
- BIP32 hierarchical deterministic key derivation
- Transaction generation, manipulation, signing and ser-/deserialization including P2PKH, P2SH, multisig
- Address generation
- Base58check encoding
- Native implementation of SHA256, SHA512, SHA512_HMAC, RIPEMD-160 including NIST testvectors
- Native constant time AES (+256CBC) cipher implementation including NIST testvectors
- Keystore (wallet) databases (through logdb https://github.com/liblogdb/liblogdb)
- Event based bitcoin P2P client capable of connecting to multiple nodes in a single thread (requires [libevent](https://github.com/libevent/libevent))

## Advantages of libbtc?

- No dependencies in case no p2p network client is required (only dependency is [libsecp256k1](https://github.com/bitcoin-core/secp256k1) added as git subtree)
- The only dependency for the p2p network client is [libevent](https://github.com/libevent/libevent) (very portable)
- optimized for MCU and low mem environments
- ~full test coverage
- mem leak free (valgrind check during CI)

## The bitcointool CLI

##### Generate a new privatekey WIF and HEX encoded:

    ./bitcointool -command genkey
    > privatekey WIF: KwmAqzEiP7nJbQi6ofQywSEad4j5b9BXDJvyypQDDLSvrV6wACG8
    > privatekey HEX: 102f1d9d91fa1c8d816ef469e74c1153a6b453d2a991e77fe187e5514a7b18ac

##### Generate the public key and p2pkh address from a WIF encoded private key

    /bitcointool -command pubfrompriv -p KwmAqzEiP7nJbQi6ofQywSEad4j5b9BXDJvyypQDDLSvrV6wACG8
    > pubkey: 023d86ca58e2519cce1729b4d36dfe5a053ad5f4ae6f7ef9360bee4e657f7e41c9
    > p2pkh address: 1N5ZkjyabcZLLHMweJrSkn3qedsPGzAx9m

##### Generate the P2PKH address from a hex encoded compact public key

    ./bitcointool -command addrfrompub -pubkey 023d86ca58e2519cce1729b4d36dfe5a053ad5f4ae6f7ef9360bee4e657f7e41c9
    > p2pkh address: 1N5ZkjyabcZLLHMweJrSkn3qedsPGzAx9m

##### Generate new BIP32 master key

    ./bitcointool -command hdgenmaster
    > masterkey: xprv9s21ZrQH143K3C5hLMq2Upsh8mf9Z1p5C4QuXJkiodSSihp324YnWpFfRjvP7gqocJKz4oakVwZn5cUgRYTHtNRvGqU5DU2Gn8MPM9jHvfC

##### Print HD node

    ./bitcointool -command hdprintkey -privkey xprv9s21ZrQH143K3C5hLMq2Upsh8mf9Z1p5C4QuXJkiodSSihp324YnWpFfRjvP7gqocJKz4oakVwZn5cUgRYTHtNRvGqU5DU2Gn8MPM9jHvfC
    > ext key: xprv9s21ZrQH143K3C5hLMq2Upsh8mf9Z1p5C4QuXJkiodSSihp324YnWpFfRjvP7gqocJKz4oakVwZn5cUgRYTHtNRvGqU5DU2Gn8MPM9jHvfC
    > depth: 0
    > p2pkh address: 1Fh1zA8mD6S2LBbCqdViEGuV3oDhggX3k4
    > pubkey hex: 0394a83fcfa131afc47a3fcd1d32db399a0ffa7e68844546b2df7ed9f5ebd07b09
    > extended pubkey: xpub661MyMwAqRbcFgAASPN2qxpRgoVdxUXvZHLWKhALMxyRbW9BZbs34ca9H3LrdsKxdMD4o5Fc7eqDg19cRTj3V9dCCeM4R1DRn8DvUq3rMva

##### Derive child key (second child key at level 1 in this case)

    ./bitcointool -command hdderive -keypath m/1h -privkey xprv9s21ZrQH143K3C5hLMq2Upsh8mf9Z1p5C4QuXJkiodSSihp324YnWpFfRjvP7gqocJKz4oakVwZn5cUgRYTHtNRvGqU5DU2Gn8MPM9jHvfC
    > ext key: xprv9v5qiRbzrbhUzAVBdtfqi1tQx5tiRJ2jpNtAw8bRec8sTivLw55H85SoRTizNdx2JSVL4sNxmjvseASZkwpUopby3iGiJWnVH3Wjg2GkjrD
    > depth: 1
    > p2pkh address: 1DFBGZdcADGTcWwDEgf15RGPqnjmW2gokC
    > pubkey hex: 0203a85ec401e66a218bf1583112599ee2a1268ebc90d91b7f457c87a50f2b011b
    > extended pubkey: xpub695C7w8tgyFnCeZejvCr59q9W7jCpkkbBbomjX13CwfrLXFVUcPXfsmHGiSfpYds2JuHrXAFEoikMX6725W8VgrVL5x4ojBw9QFAPgtdw1G

## The bitcoin-send-tx CLI

This tools can be used to broadcast a raw transaction to peers retrived from a dns seed or specified by ip/port.
The application will try to connect to max 6 peers, send the transaction two two of them and listens on the remaining ones if the transaction has been relayed back.

##### Send a raw transaction to random peers on mainnet

    ./bitcoin-send-tx <txhex>

##### Send a raw transaction to random peers on testnet and show debug infos

    ./bitcoin-send-tx -d -t <txhex>

##### Send a raw transaction to specific peers on mainnet and show debug infos use a timeout of 5s

    ./bitcoin-send-tx -d -s 5 -i 192.168.1.110:8333,127.0.0.1:8333 <txhex>

## How to Build libnspv with libbtc and tools

You will need to have some dev tools prior to building libnspv for your system.

## Prepare system before building

#### MacOS

```shell
# Install brew
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
# Install Xcode, opens a pop-up window to install CLT without installing the entire Xcode package
xcode-select --install
# Update brew and install dependencies
brew update
brew upgrade
brew install libsodium libevent automake libtool git wget
```

##### Install using brew

```shell
brew tap jl777/homebrew-libnspv
brew install libnspv
```

#### Android

```shell
# Install Termux
https://play.google.com/store/apps/details?id=com.termux
# Open and run the following commands
pkg upgrade
pkg install build-essential git wget libsodium libevent
```

#### Linux

```shell
sudo apt-get -y install build-essential pkg-config libc6-dev m4 autoconf \
libtool unzip git wget automake
```

## Clone repository using Git

Once prepared your system, get the source code:

```shell
git clone https://github.com/jl777/libnspv/
cd libnspv
```

## Now you can follow the next instructions to compile and update

### First build cryptoconditions library

#### MacOS & Linux

```
cd ./src/tools/cryptoconditions
./autogen.sh
./configure
make
```

#### Windows

```
cd ./src/tools/cryptoconditions
./build_win.sh
```

### Full libnspv library including CLI tool and wallet database

Go to libnspv directory and run:

On Linux and MacOS:

```
./autogen.sh
./configure
make check
```

On Windows run

```
./build_win.sh
```

### Pure library without wallet support

Go to libnspv directory and run:

```
./autogen.sh
./configure --disable-wallet --disable-tools
make check
```

#### Updating libnspv

```shell
cd libnspv
git pull
./autogen.sh
./configure
make
```

## Running nspv

libnspv does all the above, it also can launch a superlite nSPV client

`./nspv KMD` launches a KMD superlite

`./nspv BTC` launches the normal libbtc headers only SPV mode

for superlite clients, it will daemonize the nspv executable and it is accessible via JSON requests sent into the localhost
rpc port. you can specify any available rpc port with -p <port> option at the end.

there is a coins JSON file that comes from the https://github.com/jl777/coins/coins which will define the default behavior
of the superlite if it is a komodo "asset" and also has the following fields:

```
"p2p": 12985,
"magic":"feb4cb23",
"nSPV":"5.9.102.210, 5.9.253.195, 5.9.253.196, 5.9.253.197, 5.9.253.198, 5.9.253.199, 5.9.253.200, 5.9.253.201, 5.9.253.202, 5.9.253.203"
```

the "p2p" field is the coin's peer to peer port, the "magic" is the netmagic of that chain. the decimal value of this can be
obtained from the getinfo call, convert to hex and serialize it into the 4 hexbytes. if you got the direction wrong, just flip it around.
finally, the "nSPV" field is a list of one or more ip addresses of a nSPV fullnode

the JSON api is very simple and almost a direct mapping of the nSPV=1 rpc commands in the komodod, the testvectors
file at ~/libnspv/src/tools/testvectors will show specifically how to call it using curl. any other method to post the JSON
to the rpc port will suffice.

https://docs.komodoplatform.com/nSPV has initial docs

## How To build in Termux on Android:

#### Check if your device will use the new Termux repos: https://github.com/termux/termux-packages#information-for-android-7-users

#### Update and install required packages

```shell
pkg upgrade && pkg install build-essential git wget libsodium libevent
```

_Other packages may be required._

#### Clone and enter the repo

```shell
git clone https://github.com/jl777/libnspv/
cd libnspv
```

#### Update scripts so target environment determined (from https://wiki.termux.com/wiki/Building_packages):

```shell
find . -name 'config.sub' -exec chmod u+w '{}' \; -exec cp -f "${PREFIX}/share/libtool/build-aux/config.sub" '{}' \;
find . -name 'config.guess' -exec chmod u+w '{}' \; -exec cp -f "${PREFIX}/share/libtool/build-aux/config.guess" '{}' \;
```

#### To build libnspv and tools for Android use one time script:

```
./androidonetime.sh
```

#### Running nspv on Android

Start nspv<br>
Then visit 127.0.0.1:7771 in your Android browser.
