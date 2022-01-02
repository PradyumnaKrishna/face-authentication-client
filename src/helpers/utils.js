import axios from "axios";


export function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}


export class API {
    constructor(apiBase) {
        this.apiBase = apiBase;
    }

    createUser(data) {
        return axios({
            method: "post",
            url: `${this.apiBase}/api/v1/users/`,
            data: data,
            headers: { "Content-Type": "multipart/form-data" },
        })
    }

    authenticateUser(data) {
        return axios({
            method: "post",
            url: `${this.apiBase}/api/v1/authorize`,
            data: data,
            headers: { "Content-Type": "multipart/form-data" },
        })
    }

    verifyUser(username) {
        return axios({
            method: "get",
            url: `${this.apiBase}/api/v1/users/${username}`,
        })
    }

    getUser(token) {
        return axios({
            method: "get",
            url: `${this.apiBase}/api/v1/users/me`,
            headers: { "Authorization": `Bearer ${token}` },
        })
    }
}


export function errorHandler(error) {
    if (error.response) {
        console.log(error.response.data);
        return JSON.stringify(error.response.data.detail);
    } else {
        return "API error occur";
    }
}
