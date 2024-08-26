function makeKingdomCard(data) {
    const res = `<div class="card">
                    <h3>${data.name}</h3>
                    <p>Continent: ${data.continent}</p>
                    <p>Total Points: ${data.total}</p>
                </div>`;
    return res;
}

async function lokFormRequest(event) {
    event.preventDefault();

    const landId = document.querySelector("#landId").value;
    const startDate = document.querySelector("#startDate").value;
    const endDate = document.querySelector("#endDate").value;

    if (new Date(startDate) > new Date(endDate)) {
        alert("Start date cannot be after end date.");
        return;
    }

    const URL = `https://api-lok-live.leagueofkingdoms.com/api/stat/land/contribution?from=${startDate}&to=${endDate}&landId=${landId}`;
    console.log(URL);

    const settings = {
        method: "GET"
    };

    const resultsDiv = document.querySelector(".results");
    resultsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch(URL, settings);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const contributeData = await response.json();

        resultsDiv.innerHTML = "";

        if (contributeData.contribution.length === 0) {
            resultsDiv.innerHTML = "<p>No contributions found for the given date range and land ID.</p>";
            return;
        }

        let totalPoints = 0;

        for (let i = 0; i < contributeData.contribution.length; i++) {
            const currContributor = contributeData.contribution[i];
            console.log(currContributor);
            totalPoints += currContributor.total;
            resultsDiv.innerHTML += makeKingdomCard(currContributor);
        }

        // Update the total points in the top-right corner
        document.getElementById('totalDisplay').textContent = 'Total Points: ' + totalPoints;

    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Attach the form submit event to the lokFormRequest function
document.getElementById("lokForm").addEventListener("submit", lokFormRequest);
