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
