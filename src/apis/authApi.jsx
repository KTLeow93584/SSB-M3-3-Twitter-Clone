// ====================================================================
import axios from "axios";

const url = "https://ca9aecee-4d16-4734-9572-bda971ac7cfc-00-2x0vw49owtfq6.picard.replit.dev/";
// ====================================================================
let sessionToken = null;

export function updateSessionToken(token) {
    sessionToken = token;
    return token;
}

export function getSessionToken() {
    return sessionToken;
}
// ====================================================================
function onAPIStart() {
    const apiEvent = new CustomEvent("On Loading Start");
    window.dispatchEvent(apiEvent);
}

function onAPIEnd() {
    const apiEvent = new CustomEvent("On Loading End");
    window.dispatchEvent(apiEvent);
}
// ====================================================================
/**
 * @param string        subURL                     The API's name. (E.g. login, logout, register).
 * @param string        method                     Request Type (GET, POST, PUT, PATCH, DELETE).
 * @param string        body                       The JSON content of the request.
 * @param function      onSuccessfulCallback       Callback when API succeeded.
 * @param function      onFailedCallback           Callback when API failed.
 */
export async function callServerAPI(subURL, method = "GET", body = {},
    onSuccessfulCallback = null, onFailedCallback = null) {
    // Start Loader class at the beginning of an API.
    onAPIStart();

    const fullURL = url + subURL;

    // Debug
    //console.log("URL:", fullURL);
    try {
        let result = null;
        const headers = {
            headers: {
                "Content-Type": "application/json",
                "Accept": "*/*",
                /*"User-Agent": "React.js Web",*/
                "Authorization": sessionToken ? ("Bearer " + sessionToken) : null
            },
        };

        // Debug
        //console.log("Header.", headers);
        //console.log("Body.", body);

        switch (method) {
            case "GET":
                result = await axios.get(fullURL, headers);
                break;
            case "POST":
                result = await axios.post(fullURL, body, headers);
                break;
            case "PUT":
                result = await axios.put(fullURL, body, headers);
                break;
            case "PATCH":
                result = await axios.patch(fullURL, body, headers);
                break;
            case "DELETE":
                result = await axios.delete(fullURL, body, headers);
                break;
        }

        // Debug
        console.log("Result.", result);

        const data = result.data;
        if (result.status === 200 || result.status === 201) {
            if (onSuccessfulCallback)
                onSuccessfulCallback(result.status === 201 ? null : data.clientData);
        }
        else {
            if (onFailedCallback)
                onFailedCallback({
                    code: result.code,
                    status: result.status,
                    message: result && result.data && result.data.message ? result.data.message : "N/A"
                });
        }

        // End Loader class at the end of an API.
        onAPIEnd();
    }
    catch (error) {
        // Debug
        // console.log("[On API] Yielded an error.", error);

        // End Loader class at the end of an API.

        if (onFailedCallback)
            onFailedCallback({
                code: error.code,
                status: error.request.status,
                message: error && error.data && error.data.message ? error.data.message : "N/A"
            });
        onAPIEnd();
    }

}

export { sessionToken };
// ====================================================================