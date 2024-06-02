import axios from 'axios';


const instance = axios.create({
    baseURL: "http://127.0.0.1:5001/challenge-b396c/us-central1/api"  // The api url {cloud}
});


export default instance;