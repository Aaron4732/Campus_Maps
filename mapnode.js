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

    get_connectednodes()
    {
        return this.connectedNodes;
    }
    compare_mapnodes(nodetocompare)
    {
        return this.id == nodetocompare;
    }
    
    
   
}
module.exports = MapNode;


 
