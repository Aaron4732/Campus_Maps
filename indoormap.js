class IndoorMap {
    constructor() {
      this.listOfRooms = [];
    }
  
    // displayMapFor(floor) { 
    // }
  
    // getRoomsForFloor(floor) {
    //   return this.listOfRooms.filter(room => room.floor === floor);
    // }
  
    getRoomInfo(roomId) {
      return this.listOfRooms.find(room => room.roomId === roomId);
    }
  }
  