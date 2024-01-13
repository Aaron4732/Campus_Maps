import json

class c_circle:

    circles = {}
    next_id = 1

    def __init__(self, x, y, node_type, floor, cooridinates_absolute, name = "", connections = None) -> None:

        self.x = x
        self.y = y
        self.cooridinates_absolute = cooridinates_absolute
        self.node_type = node_type
        self.connections = connections if connections != None else []
        self.floor = floor
        self.name = name
        self.id = c_circle.next_id

        c_circle.circles[c_circle.next_id] = self

    def delet(self):
        for circle_id in self.connections:
            circle = c_circle.get_circle_whit_id(circle_id)
            circle.connections.remove(self.id)
        
        c_circle.circles.pop(self.id)
    
    def connect(self, other):
        self.connections.append(other.id)
        other.connections.append(self.id)

    def disconnect(self, other):
        self.connections.remove(other.id)
        other.connections.remove(self.id)

    def move(self, x, y):
        self.x = x
        self.y = y

    @staticmethod
    def get_circle_at_pos(pos):
        for i in c_circle.circles:
            if (c_circle.circles[i].x - pos[0]) ** 2 + (c_circle.circles[i].y - pos[1]) ** 2 <= 100:
                return c_circle.circles[i]
        return None
    
    def get_circle_whit_id(id):
        for i in c_circle.circles:
            if c_circle.circles[i].id == id:
                return c_circle.circles[i]

    @staticmethod
    def get_node_types():
        return [
            "Way",
            "Room",
            "Stairs",
            "Elevator",
            "Toilet",
            "Door",
            "Snacks",
            "Koffe"
        ]
    
    @staticmethod
    def new_circle(x, y, node_type, floor, cooridinates_absolute, name = "test", connections = None, id = None):

        connections = connections if connections != None else []
        if id != None:
            c_circle.next_id = id
        c_circle.circles[c_circle.next_id] = c_circle(x, y, node_type, floor, cooridinates_absolute, name, connections)
        c_circle.next_id += 1
        
    @staticmethod
    def load_file(path):
        try:
            with open('circles.json', 'r') as file:
                circles = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            circles = {} 

        for i in circles:
            c_circle.new_circle(circles[i]["x"], circles[i]["y"], circles[i]["node_type"], circles[i]["floor"], (circles[i]["x"], circles[i]["y"]), circles[i]["name"], circles[i]["connections"], circles[i]["id"])