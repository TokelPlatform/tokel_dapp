/* eslint-disable jest/expect-expect, jest/no-done-callback */

import { Selector } from 'testcafe';

fixture`Login Tests`.page('../src/electron/index.html');

const TEST_KEY =
  'scrap execute squeeze balance bronze velvet uniform choice region whisper rough first local wall record unable bullet evoke satisfy shell ladder slice traffic';

const wifInput = Selector('[data-tid="wif-input"]');
const loginButton = Selector('[data-tid="login-button"]');
const sideMenu = Selector('[data-tid="sidemenu"]');

test('WIF input is present', async t => {
  await t.expect(wifInput.exists).ok();
});

test('Can login with valid WIF', async t => {
  await t
    .typeText(wifInput, TEST_KEY)
    .click(loginButton)
    .expect(sideMenu.exists)
    .ok({ timeout: 10000 });
});
