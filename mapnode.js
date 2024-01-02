class MapNode {
    constructor(data) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.node_type = data.node_type;
        this.floor = data.floor;
        this.connectedNodes = data.connections;
        this.name = data.name;
    }
}
module.exports = MapNode;

// const NodeType = { // es gibt kein enum in js lol
//     RAUM: "Raum",
//     WC: "WC",
//     KAFFEEMASCHINE: "Kaffeemaschine",
//     HOERSAAL: "Hörsaal",
//     CAFETERIA: "Cafeteria",
//     //..
//   };

// class MapNode {
//     static nextId = 0;
//     constructor(buildingNumber, floor, type) { //andere parameter müssen dann auch gesetzt werden
//         this.id = `${buildingNumber}${floor}${MapNode.formatId(MapNode.nextId++)}`; //`${buildingNumber}|${floor}|${uniqueId}`; XX|XX|0001
//         this.connectedNodes = [];
//         this.location = null;
//         this.type = NodeType[type] || null; // Setzt den Typ, wenn er gültig ist, sonst null
//         this.floor = floor;
//         this.name = '';
//   }


    // static formatId(id) {
    //     return String(id).padStart(4, '0');
    //   }
    
    //   connectNode(node) {
    //       if (!this.connectedNodes.includes(node)) {
    //           this.connectedNodes.push(node);
    //       }
    //   }
    
    //   removeNode(node) {
    //       const index = this.connectedNodes.indexOf(node);
    //       if (index > -1) {
    //           this.connectedNodes.splice(index, 1);
    //       }
    //   }
    
    //   getPosition() {
    //       return this.location;
    //   }
      
    //   setPosition(coordinates) {
    //       this.location = coordinates;
    //   }
    
    //   setType(type) {
    //       this.type = type;
    //   }
    
    //   setName(name) {
    //       this.name = name;
    //   }
    // ... restliche Methoden ...

  //can prob use this:
  //https://github.com/ajbrickhouse/AStar_JS ; https://dev.to/codesphere/pathfinding-with-javascript-the-a-algorithm-3jlb


  //generateId Methode machen, um die id zu generieren
  //generateId(building, floor, ID)
  //{
  //}

 
