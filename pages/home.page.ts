import { type Page, type Locator } from "@playwright/test";
import BasePage from "./base.page";

export default class HomePage extends BasePage {
  readonly path: string;
  readonly textWalletNotConnected: Locator;
  readonly tableCitizens: Locator;
  readonly textTotalRecordsCount: Locator;
  readonly lastAddedCitizenID: Locator;
  readonly paginationItems: Locator;
  readonly paginationRow: Locator;
  readonly notePopuUpText: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/";

    // Locators
    this.textWalletNotConnected = this.page.getByTestId(
      "walletNotConnectedText"
    );
    this.tableCitizens = this.page.getByTestId("citizensTable");
    this.textTotalRecordsCount = this.page.getByTestId("totalRecordsCount");
    this.paginationItems = this.page.locator(".pagination-item");
    this.paginationRow = this.page.locator("tfoot tr");
    this.notePopuUpText = this.page.locator(
      "//html/body/div[2]/div/div[2]/div/p[2]"
    );
    this.closeButton = this.page.getByText("Close");
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async getWalletNotConnectedText(): Promise<string> {
    const text = (await this.textWalletNotConnected.textContent()) as string;
    return text;
  }

  async getTotalRecordsCount(): Promise<number> {
    const countText = await this.textTotalRecordsCount.textContent();
    const count = Number(countText);
    return count;
  }

  async getLastAddedCitizenData(): Promise<{
    id: number;
    name: string;
    age: number;
    city: string;
    note: string;
  }> {
    const paginationItems = this.paginationRow.locator("td");
    const secondToLastItem = paginationItems.nth(
      (await paginationItems.count()) - 2
    );
    await secondToLastItem.click();
    await this.page.waitForSelector('[data-testid="citizensTable"]');
    const lastRow = this.page.locator('[data-testid^="citizenRow-"]').last();
    const lastRowId = await lastRow.locator("td:first-child").textContent();
    const ID = Number(lastRowId);
    const lastRowName = await lastRow.locator("td:nth-child(2)").textContent();
    const Name = String(lastRowName);
    const lastRowAge = await lastRow.locator("td:nth-child(3)").textContent();
    const Age = Number(lastRowAge);
    const lastRowCity = await lastRow.locator("td:nth-child(4)").textContent();
    const City = String(lastRowCity);
    await this.page.locator('[data-testid^="citizenRow-"]').last().click();
    const lastRowNote = await this.notePopuUpText.textContent();
    const Note = String(lastRowNote);
    await this.closeButton.click();

    return {
      id: ID,
      name: Name,
      age: Age,
      city: City,
      note: Note,
    };
  }
}
