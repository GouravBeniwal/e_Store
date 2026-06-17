from shipping import shipping_test
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
def payment_test_cod():
    chrome = shipping_test()
    time.sleep(2)
    # element = chrome.find_element('xpath','//*[@id="root"]/div/main/form/div[1]/label[1]')
    # element.click()
    time.sleep(2)
    element = chrome.find_element('class name','btn-primary')
    element.click()
    time.sleep(2)
    print('Payment via cash on delivery test completed.')
    return chrome
if __name__ == '__main__':payment_test_cod()