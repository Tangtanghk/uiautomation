// fixtures.ts
import { test as base } from "@playwright/test";

const test = base.extend<{ page: any }>({
    page: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await use(page);
    },
});

export default test;
