from playwright.sync_api import sync_playwright, Page, expect

def verify_header_menu(page: Page):
    """
    This test verifies that the mobile menu in the header opens correctly.
    """
    # 1. Arrange: Go to the homepage.
    page.goto("https://localhost:5173")

    # 2. Act: Set viewport to mobile and take a screenshot.
    page.set_viewport_size({"width": 375, "height": 667})
    page.screenshot(path="jules-scratch/verification/verification_before_click.png")
    hamburger_button = page.locator('button[aria-label="Toggle menu"]')
    hamburger_button.click()

    # 3. Assert: Confirm the menu is visible.
    nav_menu = page.locator("nav.nav-main")
    expect(nav_menu).to_be_visible()

    # 4. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/verification_after_click.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors'])
    page = browser.new_page(ignore_https_errors=True)
    verify_header_menu(page)
    browser.close()
