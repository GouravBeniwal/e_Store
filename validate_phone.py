import re 
class validate_phone:
    def __init__(self):
        self.pattern = r"^[6-9]\d{9}$"

    def is_valid(self, phone):
        return re.match(self.pattern, phone) is not None