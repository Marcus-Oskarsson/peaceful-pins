from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Ignore self-signed certificate errors
    context = browser.new_context(ignore_https_errors=True)
    page = context.new_page()

    # Set a mobile viewport
    page.set_viewport_size({"width": 375, "height": 667})

    page.goto("https://localhost:5181/")

    # Click the hamburger menu button
    hamburger_button = page.locator(".hamburger-react")
    expect(hamburger_button).to_be_visible(timeout=5000)
    hamburger_button.click()

    # Wait for the menu to be open
    nav_menu = page.locator(".nav-main")
    expect(nav_menu).not_to_have_class("hidden")

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
