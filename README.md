<div align="center">


<img src="https://user-images.githubusercontent.com/2395326/128694831-8df4ae6f-7547-45e4-88f9-685ccb51fd66.png" width="20%"/>
  <h1>The Future of Tokenization</h1>
	<br>
	<a title="Total Downloads" href="https://github.com/TokelPlatform/tokel_app/releases/latest">
		<img src="https://img.shields.io/github/downloads/TokelPlatform/tokel_app/total.svg">
	</a>
	<a title="Latest Release Downloads" href="https://github.com/TokelPlatform/tokel_app/releases/latest">
		<img src="https://img.shields.io/github/downloads/TokelPlatform/tokel_dapp/latest/total">
	</a>
	<a title="Release" href="https://github.com/TokelPlatform/tokel_app/releases/latest">
		<img src="https://badgen.net/github/release/tokelPlatform/tokel_app">
	</a>
	<a title="Follow on Twitter" target="_blank" href="https://twitter.com/TokelPlatform">
		<img src="https://img.shields.io/twitter/follow/TokelPlatform.svg?style=social&label=Follow">
	</a>
	<br>
	<br>
<img width="1240" alt="nft" src="https://user-images.githubusercontent.com/2395326/128871421-cdb733a0-376a-44c7-b2c9-761a499efe3b.png">
</div>

## About

Tokel Platform is Komodo ecosystem's token platform.
It consists of :

- TOKEL coin wallet - release 1
- Token wallet - release 2
- Token creation tool
- NFT marketplace
- DEX

[Download the latest release here](https://github.com/TokelPlatform/tokel_app/releases)

For more information about the project please join our [Discord](https://discord.gg/QzWaDNd4N5) or check out [tokel web](https://tokel.io)

## How it works

<img src="https://user-images.githubusercontent.com/2395326/129310169-b3459ac0-1114-43e6-87f6-04f80ed1336d.png" width="60%"/>


## Git branches and development
The default branch in the Github repo is `development`. However, releases are cut from the `main` branch. In general, PRs should be made against the `development` branch and reviewed by at least one other person before being merged. When ready for a release, a PR should be made from `development` to `main` and reviewed. Once happy with the PR, it can be merged and then a [release can be drafted for distribution](#automatic-github-distribution).

## Installing & Contributing

Make sure you are runing node 16. You can use [nvm](https://github.com/nvm-sh/nvm) to manage your node versions. Now, just go to the root directory and run:

```bash
yarn install
```

This will install all dependencies located in ```package.json``` and ```src/electron/package.json```

Note: The application is using [nspv-js](https://github.com/tokelPlatform/nspv-js/). Feel free to take a look at it and understand what it does.

To contribute with the project's development you can fork the repo and develop your changes in a new branch there. Try naming it like `feature/awesome-feature-name` or `bug/succinct-name-here` to make things easier. Once you're done with your changes, you can trigger a Pull Request to the main repo, on the `development` branch and someone will take a look at it.

### **Starting Development**

Start the app in the `dev` environment:

```bash
yarn dev
```

The app will automatically connect to a test network, in which you can just "create an account" by typing anything you want in the `Seed Phrase` input. Later you can use this same *Key* you just used here to login and your information will be loaded again.

### **Tests**

We currently have very little tests in our dApp, so do feel free to help us out with testing or by developing tests for your own changes if you're submitting a PR. We are using [Jest](https://jestjs.io/) for component testing and [Testcafe](https://testcafe.io/) for end-to-end UI testing as our test libraries.

## Packaging for Production

To package apps for the local platform:

```bash
yarn build && yarn package
```

## Automatic Github Distribution
The `tokel_app` project has a Github Action which allows builds for Linux/Mac/Windows to be automatically built and attached as assets to a Github Release. The process is as follows:
1. Push commits as normal to Github
2. Merge `development` into `main`
3. Create a new **pre-release** release in [Releases](/TokelPlatform/tokel_app/releases). **Important**: the pre-release needs to be tagged with the same version number in `src/electron/package.json`, but with a `v` prepended. So if the version in `package.json` is `0.5.1`, the release should be tagged as `v0.5.1` (the release name can be whatever you want).
4. Creating a pre-release will trigger the `publish` Github Action, which in turn uses [Electron Builder](/electron-userland/electron-builder) to automatically build distributables for Linux/Mac/Windows and attach them to the previously created pre-release (this is why the release tag matching the package version is important).
5. Once the Github Action completes, the platform-specific packages can be downloaded/test. Once happy, change the release from a pre-release to **released**.

## Docs

### nSPV

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
