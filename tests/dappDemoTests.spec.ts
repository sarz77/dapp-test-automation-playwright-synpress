import { test, expect } from "../fixtures/pomSynpressFixture";
import * as metamask from "@synthetixio/synpress/commands/metamask";
import {
  citizenData,
  expectedValues,
  citizenDataSimple,
} from "../testData/dappDemoTestsData";

test.describe("Dapp Demo Tests", () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.connectWallet();
  });

  test("Connecting Wallet to the application is successful", async ({
    homePage,
  }) => {
    const connectedWalletAddress = await homePage.getConnectedWalletAddress();
    const connectedAddressMetamask = await metamask.getWalletAddress();
    expect(connectedAddressMetamask).toEqual(connectedWalletAddress);
    await expect(homePage.btnConnect).not.toBeVisible();
    await expect(homePage.textWalletNotConnected).not.toBeVisible();
    await expect(homePage.btnAddCitizenHeader).toBeVisible();
    expect(await homePage.getAddCitizenHeaderButtonText()).toEqual(
      expectedValues.addCitizenButtonTextExpected
    );
    expect(await homePage.getTotalRecordsCount()).not.toEqual(0);
    await expect(homePage.tableCitizens).toBeVisible();
  });

  test("Disconnecting Wallet from the application is successful", async ({
    homePage,
  }) => {
    await metamask.disconnectWalletFromDapp();
    await expect(homePage.btnAddCitizenHeader).not.toBeVisible();
    await expect(homePage.tableCitizens).not.toBeVisible();
    await expect(homePage.btnConnect).toBeVisible();
    expect(await homePage.getConnectButtonText()).toEqual(
      expectedValues.connectButtonTextExpected
    );
    expect(await homePage.getTotalRecordsCount()).toEqual(0);
    await expect(homePage.textWalletNotConnected).toBeVisible();
    expect(await homePage.getWalletNotConnectedText()).toEqual(
      expectedValues.walletNotConnectedTextExpected
    );
  });

  test("Adding new citizen is successful", async ({
    homePage,
    addCitizenPage,
  }) => {
    const totalCountBefore = await homePage.getTotalRecordsCount();
    await homePage.btnAddCitizenHeader.click();
    await addCitizenPage.addCitizen(citizenData);
    await expect(addCitizenPage.msgCitizenAddedSuccess).toBeVisible({
      timeout: 60000,
    });
    await homePage.navigate();
    await homePage.page.waitForSelector("[data-testid='citizenRow-1']");
    const totalCountAfter = await homePage.getTotalRecordsCount();
    expect(totalCountAfter).toBeGreaterThan(totalCountBefore);
  });

  test("Test ID - W3_2: Verify that the Citizen form with Missing Required Fileds is NOT submitted", async ({
    homePage,
    addCitizenPage,
  }) => {
    await homePage.btnAddCitizenHeader.click();
    await addCitizenPage.btnAdd.click();
    await expect(addCitizenPage.invalidAgeMessage).toBeVisible();
    await expect(addCitizenPage.invalidAgeMessage.textContent()).resolves.toBe(
      expectedValues.fieldRequiredMessage
    );
    await expect(addCitizenPage.invalidNameMessage.textContent()).resolves.toBe(
      expectedValues.fieldRequiredMessage
    );
    await expect(addCitizenPage.invalidNoteMessage.textContent()).resolves.toBe(
      expectedValues.fieldRequiredMessage
    );
    await expect(addCitizenPage.invalidCityMessage.textContent()).resolves.toBe(
      expectedValues.fieldRequiredMessage
    );
  });

  test("Test ID - W3_7: Verify that the error message is displayed when the user cancels the MetaMask transaction request and the citizen cound does NOT changed", async ({
    homePage,
    addCitizenPage,
  }) => {
    const totalCountBefore = await homePage.getTotalRecordsCount();
    await homePage.btnAddCitizenHeader.click();
    await addCitizenPage.rejectCitizen(citizenData);
    await expect(addCitizenPage.msgCitizenAddRejected).toBeVisible({
      timeout: 60000,
    });
    await homePage.navigate();
    const totalCountAfter = await homePage.getTotalRecordsCount();
    expect(totalCountAfter == totalCountBefore);
  });

  test("Test ID W3_1: Verify that the Citizen with Valid Data is added to the Citizens list", async ({
    homePage,
    addCitizenPage,
  }) => {
    const totalCountBefore = await homePage.getTotalRecordsCount();
    const lastAddedCitizenData = await homePage.getLastAddedCitizenData();
    await homePage.btnAddCitizenHeader.click();
    await addCitizenPage.addCitizen(citizenDataSimple);
    await expect(addCitizenPage.msgCitizenAddedSuccess).toBeVisible({
      timeout: 60000,
    });
    await homePage.navigate();
    await homePage.page.waitForSelector("[data-testid='citizenRow-1']");
    const totalCountAfter = await homePage.getTotalRecordsCount();
    expect(totalCountAfter).toBeGreaterThan(totalCountBefore);
    const newAddedCitizenData = await homePage.getLastAddedCitizenData();
    expect(lastAddedCitizenData.id).toBe(newAddedCitizenData.id - 1);
    expect(citizenDataSimple.name).toBe(newAddedCitizenData.name);
    expect(citizenDataSimple.age).toBe(newAddedCitizenData.age);
    expect(citizenDataSimple.city).toBe(newAddedCitizenData.city);
    expect(citizenDataSimple.note).toBe(newAddedCitizenData.note);
  });
});
