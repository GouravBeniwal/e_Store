from login import login_test
def admin():
    chrome = login_test("admin@shop.com","admin123")
    print("Admin login test passed.")
    return chrome
if __name__ == "__main__":    admin()