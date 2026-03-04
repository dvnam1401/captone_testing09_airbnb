import { Page, expect } from "@playwright/test";

export async function expectNoSuccessResponse(
  page: Page,
  action: () => Promise<void>
) {
  const [response] = await Promise.all([
    page.waitForResponse(
      resp => resp.status() === 200,
      { timeout: 2000 } // tránh treo test
    ).catch(() => null),
    action()
  ]);

  expect(response).toBeNull();
}