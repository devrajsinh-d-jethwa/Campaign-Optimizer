// Function to dynamically add new channel row with remove button
function addChannel() {
    const table = document.getElementById("channelsTable").getElementsByTagName('tbody')[0];
    const row = document.createElement("tr");
    row.innerHTML = `
        <td><input type="text" class="form-control" name="channelName" placeholder="e.g., Social Media" required></td>
        <td><input type="number" class="form-control" name="cost" placeholder="e.g., 500" required></td>
        <td><input type="number" class="form-control" name="reach" placeholder="e.g., 1000" required></td>
        <td><button onclick="removeChannel(this)" class="btn btn-danger btn-sm">Remove</button></td>
    `;
    table.appendChild(row);
}

// Function to remove a specific channel row
function removeChannel(button) {
    const row = button.closest("tr");
    row.remove();
}
    
// Function to collect input and calculate optimal selection
async function calculateOptimalSelection() {
    try {
        const budget = parseInt(document.getElementById("budget").value);
        const channels = [];

        const rows = document.getElementById("channelsTable").getElementsByTagName('tbody')[0].rows;
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].cells;
            channels.push({
                name: cells[0].querySelector("input").value,
                cost: parseInt(cells[1].querySelector("input").value),
                reach: parseInt(cells[2].querySelector("input").value),
            });
        }

        const response = await fetch('http://localhost:3000/optimize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ budget, channels })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("result").textContent = `Maximized Reach: ${data.maxReach}\nSelected Channels:\n${data.selectedChannels.map(channel => `Name: ${channel.name}, Cost: ${channel.cost}, Reach: ${channel.reach}`).join('\n')}`;
    } catch (error) {
        console.error("Error in calculateOptimalSelection:", error);
        alert("An error occurred. Please check the console for details.");
    }
}
