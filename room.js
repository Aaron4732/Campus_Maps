class Room {
    constructor(roomId, name, location, floor) {
      this.roomId = roomId;
      this.name = name;
      this.location = location;
      this.floor = floor;
    }
  
    getRoomInfo() {
      return `${this.name} is located on floor ${this.floor}`;
    }
  }
  