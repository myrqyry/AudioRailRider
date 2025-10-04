import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Launch the browser in headed mode
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()

        try:
            # Announce the plan
            print("Running in headed mode for manual debugging.")
            print("The browser window will open. Please open the developer console (F12) to inspect for errors.")

            # Navigate to the running application
            await page.goto("http://localhost:5173", timeout=30000)

            # Keep the browser open for 5 minutes for manual inspection
            print("Keeping the browser open for 300 seconds for debugging...")
            await page.wait_for_timeout(300000)
            print("Debugging time finished.")

        except Exception as e:
            print(f"An error occurred during Playwright verification: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())