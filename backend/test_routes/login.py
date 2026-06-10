from selenium import webdriver
import time
def login_test(mail="test@mail.com", password="Test@123"):
    chrome = webdriver.Chrome()
    chrome.get("http://localhost:3000")
    chrome.maximize_window()
    print(chrome.title)
    locater = chrome.find_element('class name', 'nav-icon')
    locater.click()
    chrome.find_element('xpath',"//*[@id='root']/div/main/div/div/form/div[1]/input").send_keys(mail)
    time.sleep(1)
    chrome.find_element('xpath',"//*[@id='root']/div/main/div/div/form/div[2]/input").send_keys(password)
    time.sleep(1)
    chrome.find_element('class name', 'btn-auth').click()
    time.sleep(3)
    print("Login test completed.",chrome.current_url)
    time.sleep(5)
    return chrome
if __name__ == "__main__":    login_test()
