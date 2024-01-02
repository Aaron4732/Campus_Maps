const fs = require('fs');
const path = require('path');

//wird im controller schonmal eingelesen '/initalize'
//sollte eig nicht so sein, hier sollten einfach nur die erstellten nodes verwendet werden
//funktioniert nicht wrkl Von B.1.3 nach B.1.13 geht, nur sehr wenige routen gehen,
//rückwärts von zb x.x.16 nach x.x.2 gehts nicht

//im circles.json ist nicht ganz ersichtlich was womit gemeint ist
function loadNodes() {
    const filePath = path.join(__dirname, '..', 'Campus_Maps', 'Editor', 'circles.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    return jsonData;
}

function heuristic(nodeA, nodeB) {
    // Example: Manhattan distance
    return Math.abs(nodeA.x - nodeB.x) + Math.abs(nodeA.y - nodeB.y);
}

function getNeighbors(nodeId, nodes) {
    // Assuming each node has a list of connections (neighbor IDs)
    return nodes[nodeId].connections.map(neighborId => nodes[neighborId]);
}
// Converts "B.1.1.x" to a numeric ID
function convertToNumericId(nodeId) {
    return parseInt(nodeId.split('.').pop(), 10);
}

// Converts a numeric ID to "B.1.1.x"
function convertToFormattedId(numericId) {
  return `B.1.1.${numericId}`;
}

function aStar(startId, endId, nodes) {
    let openSet = new Set([startId]);
    let cameFrom = new Map();

    let gScore = {};
    Object.keys(nodes).forEach(nodeId => gScore[nodeId] = Infinity);
    gScore[startId] = 0;

    let fScore = {};
    Object.keys(nodes).forEach(nodeId => fScore[nodeId] = Infinity);
    fScore[startId] = heuristic(nodes[startId], nodes[endId]);

    while (openSet.size > 0) {
        let current = Array.from(openSet).reduce((a, b) => fScore[a] < fScore[b] ? a : b);

        if (current === endId) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);
        getNeighbors(current, nodes).forEach(neighbor => {
            let tentativeGScore = gScore[current] + heuristic(nodes[current], neighbor);

            if (tentativeGScore < gScore[neighbor.id]) {
                cameFrom.set(neighbor.id, current);
                gScore[neighbor.id] = tentativeGScore;
                fScore[neighbor.id] = tentativeGScore + heuristic(neighbor, nodes[endId]);

                if (!openSet.has(neighbor.id)) {
                    openSet.add(neighbor.id);
                }
            }
        });
    }

    return false;
}

function reconstructPath(cameFrom, current) {
    let totalPath = [current];
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        totalPath.unshift(current);
    }
    return totalPath;
}

module.exports = { 
    aStar, 
    loadNodes, 
    convertToNumericId, 
    convertToFormattedId,
  };



