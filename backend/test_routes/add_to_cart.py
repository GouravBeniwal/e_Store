from login import login_test
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
def add_to_cart_test():
    chrome = login_test('user@shop.com','User@123')
    element = chrome.find_element(By.CLASS_NAME, "shop-menu")
    element.click()
    time.sleep(4)
    filters = chrome.find_elements(By.CLASS_NAME, "filter-btn")
    print("Available filters:", [filter.text for filter in filters])
    for filter in filters:
        if filter.text == "TECHNOLOGY":
            filter.click()
            break
    time.sleep(4)
    product = chrome.find_element(By.CLASS_NAME, "product-img")
    product.click()
    time.sleep(2)
    qty = chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div[2]/div[5]/div/button[2]")
    qty.click()
    chrome.execute_script("window.scrollBy(0, 200);")
    time.sleep(1)
    add_to_cart = chrome.find_element(By.CLASS_NAME, "add-to-cart-btn")
    add_to_cart.click()
    wait = WebDriverWait(chrome,20)
    element = wait.until(EC.visibility_of_element_located((By.CLASS_NAME,"toast")))
    # element = chrome.find_element(By.CLASS_NAME,"toast")
    print(element.text)
    time.sleep(3)
    print("Add to cart test completed.")
    return chrome
if __name__ == "__main__":    add_to_cart_test()