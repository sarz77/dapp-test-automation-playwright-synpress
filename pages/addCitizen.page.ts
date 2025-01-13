import { type Page, type Locator } from "@playwright/test";
import BasePage from "./base.page";
import * as metamask from "@synthetixio/synpress/commands/metamask";

export default class AddCitizenPage extends BasePage {
  readonly path: string;
  readonly inputName: Locator;
  readonly invalidNameMessage: Locator;
  readonly invalidAgeMessage: Locator;
  readonly invalidCityMessage: Locator;
  readonly invalidNoteMessage: Locator;
  readonly inputAge: Locator;
  readonly inputCity: Locator;
  readonly inputNote: Locator;
  readonly btnAdd: Locator;
  readonly msgCitizenAddedSuccess: Locator;
  readonly msgCitizenAddRejected: Locator;

  constructor(page: Page) {
    super(page);
    this.path = "/add-citizen";

    // Adding new locators for the error messages
    // Locators
    this.inputName = this.page.locator("input[name='name']");
    this.inputAge = this.page.locator("input[name='age']");
    this.inputCity = this.page.locator("input[name='city']");
    this.inputNote = this.page.locator("textarea[name='note']");
    this.btnAdd = this.page.getByTestId("addCitizenPage-addButton");
    this.msgCitizenAddedSuccess = this.page.getByText(
      "Citizen added successfully"
    );
    this.msgCitizenAddRejected = this.page.getByText(
      "MetaMask Tx Signature: User denied transaction signature."
    );
    this.invalidNameMessage = this.page.locator(
      "//html/body/div[1]/main/form/div[1]/p"
    );
    this.invalidAgeMessage = this.page.locator(
      "//html/body/div[1]/main/form/div[2]/p"
    );
    this.invalidCityMessage = this.page.locator(
      "//html/body/div[1]/main/form/div[3]/p"
    );
    this.invalidNoteMessage = this.page.locator(
      "//html/body/div[1]/main/form/div[4]/p"
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(this.path);
  }

  async enterName({ name }: { name: string }): Promise<void> {
    await this.inputName.clear();
    await this.inputName.fill(name);
  }

  async enterAge({ age }: { age: number }): Promise<void> {
    await this.inputAge.clear();
    await this.inputAge.fill(age.toString());
  }

  async enterCity({ city }: { city: string }): Promise<void> {
    await this.inputCity.clear();
    await this.inputCity.fill(city.toString());
  }

  async enterNote({ note }: { note: string }): Promise<void> {
    await this.inputNote.clear();
    await this.inputNote.fill(note.toString());
  }

  async addCitizen({
    name,
    age,
    city,
    note,
  }: {
    name: string;
    age: number;
    city: string;
    note: string;
  }): Promise<void> {
    await this.enterName({ name });
    await this.enterAge({ age });
    await this.enterCity({ city });
    await this.enterNote({ note });
    await this.btnAdd.click();
    await metamask.confirmTransaction();
  }

  async rejectCitizen({
    name,
    age,
    city,
    note,
  }: {
    name: string;
    age: number;
    city: string;
    note: string;
  }): Promise<void> {
    await this.enterName({ name });
    await this.enterAge({ age });
    await this.enterCity({ city });
    await this.enterNote({ note });
    await this.btnAdd.click();
    await metamask.rejectTransaction();
  }
}
