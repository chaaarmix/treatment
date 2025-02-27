import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserProvider';
import Navbar from "../components/Navbar";

const UserAccount = () => {
    const { userData, setUserData } = useContext(UserContext);
    const navigate = useNavigate();
    const handleLogout=() =>{
        setUserData(null);
        localStorage.removeItem('userData');
        navigate('/');
    };
    return (
        <div className="App enter">
            Аккаунт
            <button className="btn btn-primary" onClick={handleLogout}>Выйти из аккаунта</button>
            <Navbar/>
        </div>
    );
};

export default UserAccount;