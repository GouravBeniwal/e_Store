from selenium import webdriver
from selenium.webdriver.common.by import By
import time
def product_check_test():
    chrome = webdriver.Chrome()
    chrome.get("http://localhost:3000/")
    chrome.maximize_window()
    element = chrome.find_element(By.CLASS_NAME, "shop-menu")
    element.click()
    time.sleep(4)
    products = chrome.find_elements(By.CLASS_NAME, "product-card")
    assert len(products) > 0, "No products found on the shop page."
    print("Product check test passed.")
    return chrome
if __name__ == "__main__":    product_check_test()