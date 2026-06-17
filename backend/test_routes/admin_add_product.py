from admin import admin
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select,WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
def product_add_test():
    chrome = admin()
    chrome.find_element('xpath','//*[@id="root"]/div/main/div/div[1]/button').click()
    time.sleep(1)
    # Form filling
    chrome.find_element('xpath','//*[@id="root"]/div/main/div/div[2]/form/div[1]/input').send_keys('Condom')
    time.sleep(1)
    category = Select(chrome.find_element(By.XPATH,'//*[@id="root"]/div/main/div/div[2]/form/div[2]/select'))
    category.select_by_visible_text('Grocery')
    time.sleep(1)
    sub_category = Select(chrome.find_element(By.XPATH,'//*[@id="root"]/div/main/div/div[2]/form/div[3]/select'))
    sub_category.select_by_visible_text('Snacks')
    time.sleep(1)
    chrome.find_element('xpath','//*[@id="root"]/div/main/div/div[2]/form/div[4]/input').send_keys('Eatable')
    chrome.find_element('xpath','//*[@id="root"]/div/main/div/div[2]/form/div[5]/input').send_keys('200')
    chrome.find_element('xpath','//*[@id="root"]/div/main/div/div[2]/form/div[6]/input').send_keys('15')
    time.sleep(1)
    desc = chrome.find_element(By.TAG_NAME,'textarea')
    desc.send_keys('Chips are a popular snack made from thinly sliced potatoes or other ingredients that are fried or baked until crispy.')
    time.sleep(2)
    chrome.execute_script('window.scrollBy(0,300)')
    time.sleep(1)
    chrome.find_element(By.XPATH,'//*[@id="root"]/div/main/div/div[2]/form/div[9]/button[1]').click()
    element = WebDriverWait(chrome,200).until(
        EC.visibility_of_element_located((By.CLASS_NAME,'toast'))
    )
    print(element.text)
    time.sleep(2)

    print('Product add test completed.')
if __name__ == '__main__': product_add_test()