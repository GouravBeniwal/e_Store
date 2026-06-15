import time
from driver import Driver
from selenium.webdriver.common.by import By
def shop_filter_test(category,sub_category):
    driver = Driver()
    chrome = driver.getDriver()
    element = chrome.find_element(By.CLASS_NAME, "shop-menu")
    element.click()
    time.sleep(4)
    filters = chrome.find_elements(By.CLASS_NAME, "filter-btn")
    print("Available filters:", [filter.text for filter in filters])
    for filter in filters:
        if filter.text == category:
            filter.click()
            break
    time.sleep(4)
    sub_filters = chrome.find_elements(By.CLASS_NAME,'filter-sub')
    print('Available sub filters:',[sub_filter.text for sub_filter in sub_filters])
    for filter in sub_filters:
        if filter.text == sub_category:
            filter.click()
            break
    time.sleep(2)
    element = chrome.find_element('class name','product-info')
    print(element.text)
if __name__=='__main__': shop_filter_test('FASHION','KIDS')