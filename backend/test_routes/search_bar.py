from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from product_check import product_check_test
from driver import Driver
import time
def search_bar_test(item="laptop"):
    product_check_test()
    driver = Driver()
    chrome = driver.getDriver()
    wait = WebDriverWait(chrome, 200)
    search_bar = wait.until(
    EC.visibility_of_element_located((By.CLASS_NAME, "search-input"))
)
    search_bar.send_keys(item)
    time.sleep(1)
    # chrome.execute_script("window.scrollBy(0, 400);")  # Scroll down 500 pixels
    # chrome.execute_script("window.scrollTo(0, document.body.scrollHeight);")
    assert chrome.find_element(By.CLASS_NAME,"autocomplete-dropdown").is_displayed(), "Search suggestions not displayed."
    search_button = chrome.find_element(By.XPATH, "//*[@id='root']/div/main/div[1]/form/button")
    search_button.click()
    chrome.execute_script("window.scrollBy(0, 20);")  # Scroll down 20 pixels
    time.sleep(2)
    results = chrome.find_elements(By.CLASS_NAME, "product-img")
    assert len(results) > 0, f"No search results found for '{item}'."
    print("Search bar test passed.")
    return chrome
if __name__ == "__main__":    search_bar_test()