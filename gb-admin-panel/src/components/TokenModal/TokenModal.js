import React from 'react'
import { Button, Modal } from 'react-bootstrap';
import './TokenModal.css';

const TokenModal = ({ showModal, handleTokenModal, token }) => {
    const handleClose = () => {
        handleTokenModal(false);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
    }

    return (
        <Modal show={showModal} onHide={handleClose}>
            {console.log("Modal")}
            <Modal.Header closeButton>
                <Modal.Title>Kindly copy the token for future use!</Modal.Title>
            </Modal.Header>
            <Modal.Body>{token}</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="outline-primary" onClick={handleCopy}>
                    Copy
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default TokenModal;
