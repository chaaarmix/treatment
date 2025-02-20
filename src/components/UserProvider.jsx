import React, {createContext, useEffect, useState} from 'react';

export const UserContext = createContext();

const initialUserData = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    userType: 'unauthorized',
};

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(() => {
        const storedData = localStorage.getItem('userData');
        return storedData ? JSON.parse(storedData) : initialUserData;
    });

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
