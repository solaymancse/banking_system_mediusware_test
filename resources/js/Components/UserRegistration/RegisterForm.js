import React, { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [accountType, setAccountType] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users', {
                name,
                account_type: accountType
            });
            console.log(response.data); // Handle success response
        } catch (error) {
            console.error(error); // Handle error response
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label>Account Type:</label>
                <input type="text" value={accountType} onChange={(e) => setAccountType(e.target.value)} />
            </div>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
