import axios from 'axios';

async function fetchUserInfo() {
    try {
        const response = await axios.get('http://localhost:8081', { withCredentials: true });
        if (response.data.status === 'Success') {
            return response.data.id;
        }
        return null;
    } catch (error) {
        return null;
    }
}

export default fetchUserInfo;
