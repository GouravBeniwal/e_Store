from selenium import webdriver
# url = 'https://e-store-frontend-7crz.onrender.com'
url = 'http://localhost:3000'
class Driver:
    def __init__(self):
        self.chrome = webdriver.Chrome()
        self.chrome.get(url)
        self.chrome.maximize_window()
    def getDriver(self):
        return self.chrome
    def addDriver(self, driver):
        self.chrome = driver