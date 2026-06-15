from selenium import webdriver
class Driver:
    def __init__(self):
        self.chrome = webdriver.Chrome()
        self.chrome.get("http://localhost:3000")
        self.chrome.maximize_window()
    def getDriver(self):
        return self.chrome
    def addDriver(self, driver):
        self.chrome = driver