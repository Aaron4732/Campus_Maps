function getRoute() {
    fetch('/getRoute')
        .then(response => response.json())
        .then(data => alert(JSON.stringify(data)));
}

function initialize() {
    fetch('/initialize')
        .then(response => response.json())
        .then(data => alert(JSON.stringify(data)));
}

function getJsonData() {
    fetch('/getJsonData')
        .then(response => response.json())
        .then(data => alert("DATA AUS FILE: " + JSON.stringify(data)));
}

async function createAndShowAllNodeIds() {
            for (let i = 0; i < 10000; i++) {
                const response = await fetch('/createNode');
                const data = await response.json();
                console.log(data.nodeId, data.randomType);
            }
        }