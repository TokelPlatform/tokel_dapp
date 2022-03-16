export default {
  explorers: {
    KMD: () => 'https://kmd.explorer.dexstats.info',
    TKL: path => `https://explorer.tokel.io/${path}`,
    TKLTEST: path => `http://explorer.komodoplatform.com:20000/${path}/TKLTEST`,
    TKLTEST2: path => `http://explorer.komodoplatform.com:20000/${path}/TKLTEST2`,
  },
  insightApi: {
    TKL: 'https://tokel.explorer.dexstats.info/insight-api-komodo',
    KMD: 'https://kmd.explorer.dexstats.info/insight-api-komodo',
    TKLTEST: 'https://explorer.komodoplatform.com:10000/tkltest/api/',
  },
  discord: 'https://discord.gg/MHxJZVFkqa',
  website: 'https://tokel.io',
  websiteRoadmap: 'https://tokel.io/roadmap',
  githubIssue:
    'https://github.com/TokelPlatform/tokel_app/issues/new?assignees=&labels=bug&template=1-Bug_report.md',
  devEmail: 'mailto:support@tokel.io',
  security: 'https://coinsutra.com/store-private-keys-seed-key/',
};
