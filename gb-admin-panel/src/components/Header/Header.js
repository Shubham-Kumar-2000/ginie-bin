import React from 'react';
import { Container, Navbar } from 'react-bootstrap';
import Login from '../Login/Login';

const Header = () => {

    return (
        <Navbar variant='dark'>
            <Container>
                <Navbar.Brand>Ginie Bin</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Login />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header;
