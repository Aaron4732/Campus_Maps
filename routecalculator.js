const fs = require('fs');
const path = require('path');

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
    // Hilfsfunktionen
    function heuristic(nodeA, nodeB) {
        // Euklidische Distanz als Heuristik
        const dx = Math.abs(nodeA.x - nodeB.x);
        const dy = Math.abs(nodeA.y - nodeB.y);
        return Math.sqrt(dx * dx + dy * dy);
    }

    function reconstructPath(cameFrom, current) {
        let totalPath = [current];
        while (current in cameFrom) {
            current = cameFrom[current];
            totalPath.unshift(current);
        }
        return totalPath;
    }

    // Initialisierung
    let openSet = new Set([startId]);
    let cameFrom = {};
    let gScore = {}; // Kosten vom Startknoten bis zum aktuellen Knoten
    let fScore = {}; // Geschätzte Kosten vom Start bis zum Ziel über diesen Knoten

    nodes.forEach(node => {
        gScore[node.id] = Infinity;
        fScore[node.id] = Infinity;
    });

    gScore[startId] = 0;
    fScore[startId] = heuristic(nodes[startId], nodes[endId]);

    while (openSet.size > 0) {
        let current = Array.from(openSet).reduce((a, b) => fScore[a] < fScore[b] ? a : b);

        if (current === endId) {
            return reconstructPath(cameFrom, current);
        }

        openSet.delete(current);
        let neighbors = nodes[current].connections;

        neighbors.forEach((neighbor) => {
            let tentative_gScore = gScore[current] + heuristic(nodes[current], nodes[neighbor]);
            if (tentative_gScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentative_gScore;
                fScore[neighbor] = gScore[neighbor] + heuristic(nodes[neighbor], nodes[endId]);
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                }
            }
        });
    }

    return []; // Kein Pfad gefunden
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



