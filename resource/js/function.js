// Function to convert JSON to Base64
function jsonToBase64(jsonObject) {
    try {
        // Convert JSON object to a string
        const jsonString = JSON.stringify(jsonObject);

        // Encode JSON string to Base64
        const base64Encoded = btoa(jsonString);

        return base64Encoded;
    } catch (error) {
        console.error('Error encoding JSON to Base64:', error);
        return null;
    }
}

// Function to decode Base64 to JSON
function base64ToJson(base64String) {
    try {
        // Decode Base64 to JSON string
        const jsonString = atob(base64String);

        // Parse JSON string to JSON object
        const jsonObject = JSON.parse(jsonString);

        return jsonObject;
    } catch (error) {
        console.error('Error decoding Base64 to JSON:', error);
        return null;
    }
}

function fetchData(data) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        var apiUrl = 'http://localhost/api?data=' + jsonToBase64(data); // Example API endpoint

        xhr.open('GET', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var response = base64ToJson(xhr.responseText);
                resolve(response);
            } else {
                console.error('Request failed. Status:', xhr.status);
                reject('Error: ' + xhr.status);
            }
        };

        xhr.onerror = function() {
            console.error('Request failed.');
            reject('Request failed.');
        };

        xhr.send();
    });
}