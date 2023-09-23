import { useState, useEffect } from "react";
import axios from 'axios';
import CryptoJS from 'crypto-js';

const UseAuth = () => {
    const [auth, setAuth] = useState(false);
    const [name, setName] = useState('');
    const [level, setLevel] = useState('');
    const [userId, setUserId] = useState(null); // Initialize userId as null
    const secretKey = 'your-secret-key';

    useEffect(() => {
        const encryptedLevel = localStorage.getItem('encryptedUserLevel');
        if (encryptedLevel) {
            // Decrypt the level from local storage
            const decryptedLevel = CryptoJS.AES.decrypt(encryptedLevel, secretKey).toString(CryptoJS.enc.Utf8);
            setLevel(decryptedLevel);
            setAuth(true);
        } else {
            axios.get('http://localhost:8081', { withCredentials: true })
                .then(res => {
                    if (res.data.status === 'Success') {
                        console.log('Server Response:', res.data);
                        setAuth(true);
                        setName(res.data.name);
                        setLevel(res.data.level);
                        console.log('Server Response:', res.data);

                        // Set userId here
                        setUserId(res.data.id);

                        // Encrypt and store the level in local storage
                        const encryptedData = CryptoJS.AES.encrypt(res.data.level, secretKey).toString();
                        localStorage.setItem('encryptedUserLevel', encryptedData);
                    } else {
                        setAuth(false);
                    }
                });
        }
    }, []);

    return {
        auth,
        name,
        level,
        userId // Return userId
    };
};

export default UseAuth;
