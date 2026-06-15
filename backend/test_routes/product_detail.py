from search_bar import search_bar_test
from selenium.webdriver.common.by import By
from driver import Driver
import time
def product_detail_test():
    chrome = search_bar_test("shirt")
    product = chrome.find_element(By.CLASS_NAME, "product-img")
    product.click()
    time.sleep(2)
    title = chrome.find_element(By.XPATH, "//*[@id='root']/div/main/div/div[2]/h1").text
    price = chrome.find_element(By.CLASS_NAME, "product-detail-price").text
    desc = chrome.find_element(By.CLASS_NAME, "product-description").text
    assert title != "", "Product title is missing."
    assert price != "", "Product price is missing."
    assert desc != "", "Product description is missing."
    print("Product detail test passed.")
    return chrome
if __name__ == '__main__':
    product_detail_test()