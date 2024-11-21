// server.js

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Knapsack function to maximize reach within budget and minimize cost when reach is equal
function knapsack(budget, channels) {
    const n = channels.length;
    const dp = Array(n + 1).fill().map(() => Array(budget + 1).fill([0, Infinity]));

    // Initialize DP table
    for (let j = 0; j <= budget; j++) dp[0][j] = [0, 0];

    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= budget; j++) {
            const { cost, reach } = channels[i - 1];
            dp[i][j] = dp[i - 1][j]; // Skip the current channel by default
            if (j >= cost) {
                const newReach = dp[i - 1][j - cost][0] + reach;
                const newCost = dp[i - 1][j - cost][1] + cost;
                if (
                    newReach > dp[i][j][0] || 
                    (newReach === dp[i][j][0] && newCost < dp[i][j][1])
                ) {
                    dp[i][j] = [newReach, newCost];
                }
            }
        }
    }

    // Find maximum reach and minimum cost
    let maxReach = 0;
    let minCost = Infinity;
    for (let j = 0; j <= budget; j++) {
        if (dp[n][j][0] > maxReach || (dp[n][j][0] === maxReach && dp[n][j][1] < minCost)) {
            maxReach = dp[n][j][0];
            minCost = dp[n][j][1];
        }
    }

    // Trace back to find the selected channels
    const selectedChannels = [];
    let remainingBudget = budget;
    for (let i = n; i > 0 && maxReach > 0; i--) {
        const { cost, reach, name } = channels[i - 1];
        if (
            remainingBudget >= cost &&
            dp[i][remainingBudget][0] === dp[i - 1][remainingBudget - cost][0] + reach &&
            dp[i][remainingBudget][1] === dp[i - 1][remainingBudget - cost][1] + cost
        ) {
            selectedChannels.push({ name, cost, reach });
            remainingBudget -= cost;
            maxReach -= reach;
        }
    }

    return {
        maxReach: dp[n][budget][0],
        minCost: dp[n][budget][1],
        selectedChannels: selectedChannels.reverse()
    };
}

app.post('/optimize', (req, res) => {
    const { budget, channels } = req.body;
    const result = knapsack(budget, channels);
    res.json(result);
});

app.use(express.static('.')); // Serves static files from the current directory

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
