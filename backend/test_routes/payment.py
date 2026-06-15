from shipping import shipping_test
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
def payment_test():
    chrome = shipping_test()
    time.sleep(2)
    element = chrome.find_element('xpath','//*[@id="root"]/div/main/form/div[1]/label[2]')
    element.click()
    time.sleep(2)
    upi = WebDriverWait(chrome,200).until(EC.visibility_of_element_located((By.XPATH,'//*[@id="root"]/div/main/form/div[1]/div/input')))
    upi.send_keys("user@bank.in")
    time.sleep(2)
    element = chrome.find_element('class name','btn-primary')
    element.click()
    time.sleep(2)
    print('Payment Test completed.')
    return chrome
if __name__ == '__main__':payment_test()