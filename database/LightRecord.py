from datetime import datetime

class LightRecord:
    user_id: str
    light: float
    timestamp: datetime
    
    def __init__(self, user_id: str, light: float, timestamp: datetime = None):
        self.user_id = user_id
        self.light = light
        self.timestamp = timestamp if timestamp is not None else datetime.now()
        
    def __str__(self):
        return f"User ID: {self.user_id}, light: {self.light}, Timestamp: {self.timestamp}"