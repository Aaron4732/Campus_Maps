class circle:
    def __init__(self, x, y, node_type, floor, id = 1, name = "") -> None:
        self.x = x
        self.y = y

        self.node_type = node_type
        self.id = id
        self.connections = []
        self.floor = floor
        self.name = name

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


