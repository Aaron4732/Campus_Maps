// const fs = require('fs');
// const path = require('path');

function setNodes(data) {
    nodesData = data;
  }
  
function getNodes() {
    return nodesData;
}

function distance(pointA, pointB) {
    const dx = pointA.x - pointB.x;
    const dy = pointA.y - pointB.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function astar(start, end, barrierFree, requiredNodes) {
    const openSet = [start];
    const cameFrom = {};
    const gScore = { [start]: 0 };
    const fScore = { [start]: distance(start, end) };

    while (openSet.length > 0) {
        openSet.sort((a, b) => fScore[a] - fScore[b]);
        const current = openSet.shift();

        if (current.x === end.x && current.y === end.y) {
            const path = [];
            let traceBack = current;
            while (traceBack) {
                path.unshift(traceBack);
                traceBack = cameFrom[traceBack];
            }
            return path;
        }

        const currentNodeId = Object.keys(nodesData).find(
            nodeId => nodesData[nodeId].x === current.x && nodesData[nodeId].y === current.y
        );

        if (!currentNodeId) {
            continue;
        }

        const currentConnections = nodesData[currentNodeId].connections.map(connectionId => {
            return {
                x: nodesData[connectionId].x,
                y: nodesData[connectionId].y
            };
        });

        for (const neighbor of currentConnections) {
            const tentativeGScore = gScore[current] + distance(current, neighbor);

            if (barrierFree) { //needs adjustments
                continue;
            }

            if (!gScore[neighbor] || tentativeGScore < gScore[neighbor]) {
                cameFrom[neighbor] = current;
                gScore[neighbor] = tentativeGScore;
                fScore[neighbor] = tentativeGScore + distance(neighbor, end);

                if (!openSet.some(point => point.x === neighbor.x && point.y === neighbor.y)) {
                    openSet.push(neighbor);
                }
            }
        }
    }

    return [];
}

module.exports = { 
    astar, 
    loadNodes: getNodes,
    setNodes,
  };



