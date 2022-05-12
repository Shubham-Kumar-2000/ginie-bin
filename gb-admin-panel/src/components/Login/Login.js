import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';
import binService from '../../services/binService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const auth = getAuth(getApp());
    const googleProvider = new GoogleAuthProvider()

    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then((res) => {
            const user = res.user;
            user.getIdTokenResult()
                .then(async (token) => {
                    await binService.login(token.token);
                    navigate('/dashboard');
                });
        })
    };

    return (
        <>
            <button style={{ textAlign: "center" }} onClick={() => signInWithGoogle()}> Sign in</button>
        </>
    )
}

export default Login;
