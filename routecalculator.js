// const fs = require('fs');
// const path = require('path');
const mapnode = require('./mapnode');

class queue {
    constructor(mapnodes_list, start_map_node_name, end_map_node_name) {
        this.nodes = {};
        this.next_node_id = 0;
        this.open_nodes = {};
        this.path = [];
        this.mapnodes_list = mapnodes_list;
        this.start_map_node = this.get_map_node_by_name(start_map_node_name);
        this.end_map_node = this.get_map_node_by_name(end_map_node_name);
    }
    reset() {
        this.nodes = {};
        this.next_node_id = 0;
        this.open_nodes = {};
        this.path = [];
    }
    set_first_node() {
        this.nodes[this.next_node_id] = new node(this.next_node_id, null, 0, this.start_map_node); //später
        this.open_nodes[this.next_node_id] = this.nodes[this.next_node_id];
        this.next_node_id += 1;
    }
    find_cheapest_node() {
        let cheapest_node = null;
        let cheapest_node_id = null;
        for (let node_id in this.open_nodes) {
            let node = this.open_nodes[node_id];
            if (cheapest_node === null || node.cost < cheapest_node.cost) {
                cheapest_node = node;
                cheapest_node_id = node_id;
            }
        }
        return cheapest_node_id;
    }
    add_node(parent_id, mapnode) { //mapnode ist id hier
        this.nodes[this.next_node_id] = new node(this.next_node_id, this.nodes[parent_id], this.nodes[parent_id].cost, mapnode); //später
        this.open_nodes[this.next_node_id] = this.nodes[this.next_node_id];
        this.next_node_id += 1;
    }
    check_if_node_exists(mapnode) {
        for (let node_id in this.nodes) {
            let node = this.nodes[node_id];
            if (node.mapnode.compare_mapnodes(mapnode)) { 
                return true;
            }
        }
        return false;
    }
    expand_node(node_id) {
        delete this.open_nodes[node_id];
        let parent_node = this.nodes[node_id];
        for (let mapnode_id of parent_node.mapnode.get_connectednodes()) { 
            if (!parent_node.mapnode.compare_mapnodes(mapnode_id)) {
                if (!this.check_if_node_exists(mapnode_id)) {
                    this.add_node(node_id, this.mapnodes_list[mapnode_id]);
                }
            }
        }
    }
    get_path(node_id) {
        let path = [];
        let pathData = []; 
        while (node_id > 0) {
            path.push(node_id);
            let currentNode = this.nodes[node_id];
            pathData.push({
                x: currentNode.mapnode.x,
                y: currentNode.mapnode.y,
                type: currentNode.mapnode.node_type,
                floor: currentNode.mapnode.floor
            });
            node_id = currentNode.parent_node.node_id;
        }
        this.number_of_moves = path.length - 1;
        return pathData.reverse(); 
    }
  
    find_solution() {
        this.reset();
        this.set_first_node();
        let cheapest_node_id = 0;
        while (true) {
            if (cheapest_node_id === null) {
                return null;
            }
            
            if (this.nodes[cheapest_node_id].mapnode.id == this.end_map_node.id) {
                this.path = this.get_path(cheapest_node_id);
                return this.path;
            }
            this.expand_node(cheapest_node_id);
            cheapest_node_id = this.find_cheapest_node();
        }
    }

    get_map_node_by_name(name)
    {
        for (let a in this.mapnodes_list)
        {
        
            if (this.mapnodes_list[a].name == name)
            {
                return this.mapnodes_list[a]
            }
        
        }
    }

    get_path_for_frontend()
    {
        
    }


}
class node {
    constructor(node_id, parent_node, cost, mapnode) {
        this.node_id = node_id;
        this.parent_node = parent_node;
        this.mapnode = mapnode;
        if (parent_node == null)
        {
            this.cost = 0;
        }
        else
        {
            this.cost =  this.get_cost(cost);
        }
    }

    get_cost(parentcost)
    {
        let cost = 0;
        cost = cost+Math.abs(this.mapnode.x-this.parent_node.mapnode.x);
        cost = cost+Math.abs(this.mapnode.y-this.parent_node.mapnode.y);
        cost = cost+parentcost;
        return cost;

    }

     //this.next_node_id, parent_id, this.nodes[parent_id].cost, mapnode
}

module.exports = { 
    queue, 
    node,
  };