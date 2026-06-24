from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from login import login_test
def order_history_test():
    chrome = login_test('user@shop.com','User@123')
    menu = WebDriverWait(chrome, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, 'nav-account')))
    ActionChains(chrome).move_to_element(menu).perform()
    time.sleep(2)
    submenu = WebDriverWait(chrome, 10).until(EC.element_to_be_clickable((By.LINK_TEXT, 'My Orders')))
    if submenu:
        submenu.click() 
    else:
        print("User don't have access to orders.")
    time.sleep(1)
    chrome.execute_script('window.scrollBy(0,200)')

    time.sleep(2)
    print('Order history test completed.')
if __name__ == '__main__': order_history_test()

