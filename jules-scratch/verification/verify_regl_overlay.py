import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        try:
            # Navigate to the running application
            await page.goto("http://localhost:5173", timeout=60000) # Increased timeout

            # Wait for 2 seconds to ensure any initial animations or loading can complete
            await page.wait_for_timeout(2000)

            # Take a screenshot of the initial page state
            await page.screenshot(path="../jules-scratch/verification/initial_page_load.png")

            print("Successfully captured screenshot of the initial page load.")

        except Exception as e:
            print(f"An error occurred during Playwright verification: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())