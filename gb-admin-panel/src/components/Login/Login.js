import React, { useContext, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';
import binService from '../../services/binService';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext/AuthContext';
import { Button } from 'react-bootstrap';

const Login = () => {
    const navigate = useNavigate();
    const auth = getAuth(getApp());
    const googleProvider = new GoogleAuthProvider()
    const [token, setToken] = useContext(AuthContext);

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then((res) => {
            const user = res.user;
            user.getIdTokenResult()
                .then(async (token) => {
                    const userToken = await binService.login(token.token);
                    setToken(userToken);
                });
        })
    };

    useEffect(() => {
        if (token)
            navigate("/dashboard");
    }, [token]);

    return (
        <>{token ? (
            <>
                <Button variant='outline-primary' onClick={() => navigate("/dashboard")} style={{ margin: "0 10px", }}>Dashboard</Button>
                <Button variant='outline-danger' onClick={() => setToken(null)} style={{ margin: "0 10px", }}>Logout</Button>
            </>
        ) :
            <Button variant='outline-primary' onClick={() => signInWithGoogle()}>Login</Button>}
        </>
    )
}

export default Login;
