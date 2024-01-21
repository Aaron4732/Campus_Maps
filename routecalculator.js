
const mapnode = require('./mapnode');

// Die Klasse 'queue' für die Routenberechnung
class queue {
    // Konstruktor der Klasse
    constructor(mapnodes_list, start_map_node_name, end_map_node_name, is_barrierfree, extra_stops) {
        this.nodes = {}; 
        this.next_node_id = 0; 
        this.open_nodes = {}; 
        this.path = []; 
        this.mapnodes_list = mapnodes_list; 
        this.start_map_node = this.get_map_node_by_name(start_map_node_name); 
        this.end_map_node = this.get_map_node_by_name(end_map_node_name); 
        this.is_barrierfree = is_barrierfree; 
        this.extra_stops = extra_stops.split(', ')
            .filter(stopName => stopName && stopName.trim() !== '')
            .map(stopName => stopName.trim()); 
    }

    // Setzt die Klasse zurück für eine neue Routenberechnung
    reset() {
        this.nodes = {};
        this.next_node_id = 0;
        this.open_nodes = {};
        this.path = [];
    }

    // Setzt den ersten Knoten in der Routenberechnung
    set_first_node() {
        this.nodes[this.next_node_id] = new node(this.next_node_id, null, 0, this.start_map_node);
        this.open_nodes[this.next_node_id] = this.nodes[this.next_node_id];
        this.next_node_id += 1;
    }

    // Findet den günstigsten Knoten im aktuellen Kontext
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

    // Fügt einen neuen Knoten zur Routenberechnung hinzu
    add_node(parent_id, mapnode) { 
        this.nodes[this.next_node_id] = new node(this.next_node_id, this.nodes[parent_id], this.nodes[parent_id].cost, mapnode);
        this.open_nodes[this.next_node_id] = this.nodes[this.next_node_id];
        this.next_node_id += 1;
    }

    // Überprüft, ob ein bestimmter Knoten bereits existiert
    check_if_node_exists(mapnode) {
        for (let node_id in this.nodes) {
            let node = this.nodes[node_id];
            if (node.mapnode.compare_mapnodes(mapnode)) { 
                return true;
            }
        }
        return false;
    }

    // Erweitert einen Knoten, indem es verbundene Knoten prüft und hinzufügt
    // expand_node(node_id) {
    //     delete this.open_nodes[node_id];
    //     let parent_node = this.nodes[node_id];
    
    //     for (let mapnode_id of parent_node.mapnode.get_connectednodes()) {
    //         if (!parent_node.mapnode.compare_mapnodes(mapnode_id)) {
    //             if (!this.check_if_node_exists(mapnode_id)) {
    //                 this.add_node(node_id, this.mapnodes_list[mapnode_id]);
    //             }
    //         }
    //     }
    // }

    //läuft mit dem Code in Endlosschleife

    expand_node(node_id) {
        delete this.open_nodes[node_id];
        let parent_node = this.nodes[node_id];

        for (let mapnode_id of parent_node.mapnode.get_connectednodes()) {
            if (!parent_node.mapnode.compare_mapnodes(mapnode_id)) {
                let connected_node = this.mapnodes_list[mapnode_id];
                if (!this.check_if_node_exists(connected_node.id) && this.is_node_valid_for_path(connected_node)) {
                    this.add_node(node_id, connected_node);
                }
            }
        }
    }

    is_node_valid_for_path(node) {

        if (node.node_type === 'Elevator') {
            let testVariable = 0;
        }

        if (this.is_barrierfree === "Ja" && node.node_type === 'Stairs') {
            return false;
        }

         // Wenn barrierefrei deaktiviert ist, keine Aufzüge verwenden
        if (this.is_barrierfree === "Nein" && node.node_type === 'Elevator' ) {
            return false;
        }

        return true;
    }
    
    // Gibt den berechneten Pfad zurück
    get_path(node_id) {
        let path = [];
        let pathData = []; 
        while (true) {
            path.push(node_id);
            let currentNode = this.nodes[node_id];
            pathData.push({
                x: currentNode.mapnode.x,
                y: currentNode.mapnode.y,
                type: currentNode.mapnode.node_type,
                floor: currentNode.mapnode.floor
            });

            if (node_id == 0) {
                this.number_of_moves = path.length - 1;
                return pathData.reverse(); 
            }

            node_id = currentNode.parent_node.node_id;
        }
    }

    // Findet die Lösung für den gegebenen Pfad
    find_solution() {
        this.reset();
        this.set_first_node();
        let total_path = [];
        let stops = this.extra_stops.map(stopType => 
            this.find_nearest_special_stop_on_path(stopType, this.start_map_node, this.end_map_node));

        stops.push(this.end_map_node);

        let current_start = this.start_map_node;

        for (let stop of stops) {
            if (!stop) continue; 
            let path_segment = this.find_path_segment(current_start, stop);
            if (!path_segment) {
                console.error(`Kein Pfad gefunden von ${current_start.name} zu ${stop.name}.`);
                return null;
            }
            total_path.push(...path_segment);
            current_start = stop; 
        }

        return total_path;
    }
    
    // Findet den nächstgelegenen speziellen Halt auf dem Pfad
    find_nearest_special_stop_on_path(type, start_node, end_node) {
        let nearest_stop = null;
        let lowest_cost = 100000;

        for (let key in this.mapnodes_list) {
            let node = this.mapnodes_list[key];
            if (node.node_type === type) { 
                let cost_to_stop = this.calculate_total_cost(start_node, node);
                let cost_from_stop = this.calculate_total_cost(node, end_node);

                let total_cost = cost_to_stop + cost_from_stop;
                if (total_cost < lowest_cost) {
                    nearest_stop = node;
                    lowest_cost = total_cost;
                }
            }
        }
        return nearest_stop;
    }

    // Findet ein Pfadsegment zwischen zwei Knoten
    find_path_segment(start_node, end_node) {
        this.reset();
        this.start_map_node = start_node;
        this.set_first_node();

        let cheapest_node_id = this.find_cheapest_node();
        while (cheapest_node_id !== null) {
            if (this.nodes[cheapest_node_id].mapnode.id === end_node.id) {
                return this.get_path(cheapest_node_id);
            }
            this.expand_node(cheapest_node_id);
            cheapest_node_id = this.find_cheapest_node();
        }

        return null; 
    }
    

    
    // Berechnet die Gesamtkosten zwischen zwei Knoten
    calculate_total_cost(node1, node2) {
        let cost = Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
        if (node1.floor !== node2.floor) {
            cost += 1000; 
        }
        return cost;
    }

    // Gibt die Etage eines Knotens zurück
    get_floor_of_node(node) {
        return node.floor;
    }

    // Findet einen Kartenknoten anhand seines Namens
    get_map_node_by_name(name) {
        for (let a in this.mapnodes_list) {
            if (this.mapnodes_list[a].name == name) {
                return this.mapnodes_list[a];
            }
        }
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

}

module.exports = { 
    queue, 
    node,
  };