# from driver import get_driver
from selenium import webdriver
# import sys
# import os

# sys.path.append(
#     os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# )

# from backend.driver import Driver

def test_driver():
    # driver = Driver()
    chrome = webdriver.Chrome()
    chrome.get("https://www.google.com")
    chrome.maximize_window()
    print(chrome.title)
    chrome.quit()
if __name__ == "__main__":    test_driver()