import { expect, test, type Locator, type Page } from "@playwright/test";

const column = (page: Page, name: string) => page.getByRole("region", { name, exact: true });
const card = (scope: Locator, title: string) => scope.getByTestId("card").filter({ hasText: title });

async function drag(page: Page, source: Locator, target: Locator, yOffset = 0.5) {
  const from = (await source.boundingBox())!;
  const to = (await target.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + 20);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + 30, { steps: 5 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height * yOffset, { steps: 20 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height * yOffset + 2, { steps: 5 });
  await page.mouse.up();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("loads the board with dummy data", async ({ page }) => {
  await expect(page).toHaveTitle("Kanban");
  await expect(page.getByRole("heading", { name: "Product Launch" })).toBeVisible();
  await expect(page.getByTestId("column")).toHaveCount(5);
  await expect(page.getByTestId("card")).toHaveCount(10);
  for (const name of ["Backlog", "To Do", "In Progress", "Review", "Done"]) {
    await expect(column(page, name)).toBeVisible();
  }
});

test("renames a column", async ({ page }) => {
  await page.getByRole("button", { name: "In Progress" }).click();
  const input = page.getByRole("textbox", { name: "Column name" });
  await input.fill("Doing");
  await input.press("Enter");
  await expect(column(page, "Doing")).toBeVisible();
  await expect(card(column(page, "Doing"), "Write API documentation")).toContainText("Doing");
});

test("adds a card", async ({ page }) => {
  const todo = column(page, "To Do");
  await todo.getByRole("button", { name: "Add a card" }).click();
  await todo.getByRole("textbox", { name: "Card title" }).fill("Plan launch event");
  await todo.getByRole("textbox", { name: "Card details" }).fill("Venue, guests and agenda");
  await todo.getByRole("button", { name: "Add card" }).click();
  await expect(card(todo, "Plan launch event")).toContainText("Venue, guests and agenda");
  await expect(todo.getByTestId("column-count")).toHaveText("3");
});

test("deletes a card", async ({ page }) => {
  const target = card(page.locator("body"), "Set up repository");
  await target.hover();
  await page.getByRole("button", { name: "Delete Set up repository" }).click();
  await expect(target).toHaveCount(0);
  await expect(page.getByTestId("card")).toHaveCount(9);
});

test("drags a card to another column and updates its band color", async ({ page }) => {
  const source = card(column(page, "Backlog"), "Draft Q3 roadmap");
  await drag(page, source, card(column(page, "Review"), "Refine colour palette"), 0.9);

  const moved = card(column(page, "Review"), "Draft Q3 roadmap");
  await expect(moved).toBeVisible();
  await expect(moved).toContainText("Review");
  await expect(card(column(page, "Backlog"), "Draft Q3 roadmap")).toHaveCount(0);
  await expect(moved.getByTestId("card-band")).toHaveCSS("background-color", "rgb(0, 184, 217)");
});

test("drags a card into an empty column", async ({ page }) => {
  const review = column(page, "Review");
  await card(review, "Refine colour palette").hover();
  await page.getByRole("button", { name: "Delete Refine colour palette" }).click();
  await expect(review.getByTestId("card")).toHaveCount(0);

  await drag(page, card(column(page, "Done"), "Project kickoff"), review.getByTestId("column-count").locator(".."), 3);
  await expect(card(review, "Project kickoff")).toBeVisible();
});

test("reorders cards within a column", async ({ page }) => {
  const backlog = column(page, "Backlog");
  await drag(page, card(backlog, "Research competitor onboarding"), card(backlog, "Audit accessibility"), 0.8);
  await expect(backlog.getByTestId("card").last()).toContainText("Research competitor onboarding");
});
