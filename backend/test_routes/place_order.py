from selenium.webdriver.common.by import By
import time
from add_to_cart import add_to_cart_test
def place_order_test():
    chrome = add_to_cart_test()  # Call the add to cart test first
    time.sleep(2)
    chrome.find_element(By.LINK_TEXT, "View Cart →").click()
    time.sleep(2)
    chrome.find_element(By.XPATH, "//*[@id='root']/div/main/div/div/div[2]/button").click()
    time.sleep(2)
    print("Place order test passed.")
    return chrome
if __name__ == "__main__":    place_order_test()