from login import login_test
from add_to_cart import add_to_cart_test
import time
def remove_cart_test():
    chrome = login_test("user@shop.com","User@123")
    element = chrome.find_element('class name','cart-badge')
    if int(element.text) > 0:
        element.click()

    else:
        add_to_cart_test()
        remove_cart_test()
    time.sleep(2)
    element = chrome.find_element('class name','cart-remove').click()
    time.sleep(2)
    print("Remove from cart test completed.")
if __name__ == "__main__": remove_cart_test()