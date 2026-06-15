from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from login import login_test
from driver import Driver
import time
def logout_test():
    chrome = login_test()  # Call the login test first
    print("Before logout, token is:")
    token = chrome.execute_script("""
    return window.localStorage.getItem('token');""")
    print(token)
    # chrome.maximize_window()
    print(chrome.title)
    menu = WebDriverWait(chrome, 100).until(EC.element_to_be_clickable((By.CLASS_NAME, 'nav-account')))
    ActionChains(chrome).move_to_element(menu).perform()
    submenu = WebDriverWait(chrome, 10).until(EC.element_to_be_clickable((By.CLASS_NAME, 'logout-button')))
    submenu.click()    
    print("Logout test completed.",chrome.current_url)
    time.sleep(3)
    print("After logout, token is:")
    token = chrome.execute_script("""
    return window.localStorage.getItem('token');""")
    print(token)
    locater = chrome.find_element('class name', 'nav-icon')
    locater.click()
    time.sleep(1)
    chrome.quit()
if __name__ == "__main__":    logout_test()