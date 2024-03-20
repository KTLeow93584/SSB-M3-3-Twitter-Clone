// ====================================================================
import axios from "axios";
const inhouseServerMainURL = "https://ca9aecee-4d16-4734-9572-bda971ac7cfc-00-2x0vw49owtfq6.picard.replit.dev/";
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
/**
 * @param string        subURL                     The API's name. (E.g. login, logout, register).
 * @param string        method                     Request Type (GET, POST, PUT, PATCH, DELETE).
 * @param string        body                       The JSON content of the request.
 * @param function      onSuccessfulCallback       Callback when API succeeded.
 * @param function      onFailedCallback           Callback when API failed.
 */
export async function callServerAPI(subURL, method = "GET", body = {},
    onSuccessfulCallback = null, onFailedCallback = null) {
    const fullURL = inhouseServerMainURL + subURL;

    // Debug
    //console.log("[On API Request] URL:", fullURL);
    try {
        let result = null;
        const headers = {
            "Content-Type": "application/json",
            "Accept": "*/*",
            /*"User-Agent": "React.js Web",*/
            "Authorization": sessionToken ? ("Bearer " + sessionToken) : null
        };

        // Debug
        //console.log("[On API Request] Header.", headers);
        //console.log("[On API Request] Body.", body);

        switch (method) {
            case "GET":
                result = await axios.get(fullURL, { headers });
                break;
            case "POST":
                result = await axios.post(fullURL, body ? body : {}, { headers });
                break;
            case "PUT":
                result = await axios.put(fullURL, body ? body : {}, { headers });
                break;
            case "PATCH":
                result = await axios.patch(fullURL, body ? body : {}, { headers });
                break;
            case "DELETE":
                result = await axios.delete(fullURL, { headers, data: body ? body : {} });
                break;
        }

        // Debug
        //console.log("[On API Request Successful] Result.", result);

        const data = result.data;
        if (result.status === 200 || result.status === 201) {
            if (onSuccessfulCallback)
                onSuccessfulCallback(result.status === 201 ? null : data.client_data);
        }
        else {
            if (onFailedCallback)
                onFailedCallback({
                    code: result.code,
                    status: result.status,
                    message: result && result.data && result.data.message ? result.data.message : "N/A"
                });
        }

        return data;
    }
    catch (error) {
        // Debug
        //console.log("[On API Request Failed] Error.", error);

        // End Loader class at the end of an API.
        //onAPIEnd();

        if (onFailedCallback)
            onFailedCallback({
                code: error.code,
                status: error.request.status,
                message: error && error.data && error.data.message ? error.data.message : "N/A"
            });

        return error;
    }
}
// ====================================================================
/**
 * @param string        subURL                     The API's name. (E.g. login, logout, register).
 * @param string        method                     Request Type (GET, POST, PUT, PATCH, DELETE).
 * @param string        headers                    The Request Headers (E.g. Authorization, Content Type, etc.).
 * @param string        body                       The JSON content of the request.
 * @param function      onSuccessfulCallback       Callback when API succeeded.
 * @param function      onFailedCallback           Callback when API failed.
 */
export async function callTPServerAPI(url, method = "GET", headers = {}, body = {},
    onSuccessfulCallback = null, onFailedCallback = null) {
    // Debug
    //console.log("[On Third Party API Request] URL:", url);
    
    try {
        let result = null;

        // Debug
        //console.log("[On Third Party API Request] Header.", headers);
        //console.log("[On Third Party API Request] Body.", body);

        switch (method) {
            case "GET":
                result = await axios.get(url, { headers });
                break;
            case "POST":
                result = await axios.post(url, body ? body : {}, { headers });
                break;
            case "PUT":
                result = await axios.put(url, body ? body : {}, { headers });
                break;
            case "PATCH":
                result = await axios.patch(url, body ? body : {}, { headers });
                break;
            case "DELETE":
                result = await axios.delete(url, { headers, data: body ? body : {} });
                break;
        }

        // Debug
        //console.log("[On Third Party API Request Successful] Result.", result);

        const data = result.data;
        if (result.status === 200 || result.status === 201) {
            if (onSuccessfulCallback)
                onSuccessfulCallback(result.status === 201 ? null : data);
        }
        else {
            if (onFailedCallback)
                onFailedCallback({
                    code: result.code,
                    status: result.status,
                    message: result && result.data && result.data.message ? result.data.message : "N/A"
                });
        }

        return data;
    }
    catch (error) {
        // Debug
        //console.log("[On Third Party API Request Failed] Error.", error);

        if (onFailedCallback)
            onFailedCallback({
                code: error.code,
                status: error.request.status,
                message: error && error.data && error.data.message ? error.data.message : "N/A"
            });

        return error;
    }
}
// ====================================================================