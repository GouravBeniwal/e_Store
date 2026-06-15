from place_order import place_order_test
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
def shipping_test():
    chrome = place_order_test()  # Call the place order test first
    time.sleep(2)
    # form filling
    chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div/form/input[1]").send_keys("Test User") 
    chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div/form/input[2]").send_keys(8765032145) 
    chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div/form/textarea").send_keys('Moorish Holy Temple,Viginia,US')    
    chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div/form/input[3]").send_keys('Redwood')    
    chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div/form/input[4]").send_keys('Virginia')    
    chrome.find_element(By.XPATH,"//*[@id='root']/div/main/div/div/form/input[5]").send_keys(23222)
    time.sleep(2)
    chrome.execute_script('window.scrollBy(0,200)')
    # element = WebDriverWait(chrome,20).until(EC.visibility_of_element_located((By.TAG_NAME,'button')))
    time.sleep(1)
    element = chrome.find_element(By.XPATH,'//*[@id="root"]/div/main/div/div/form/button')
    element.click()
    print("Shipping test passed.")
    return chrome

if __name__ == "__main__":    shipping_test()