import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';
import { BiMapPin } from 'react-icons/bi';
import './Bin.css';

const Bin = ({ bin }) => {
    const handleOnClick = () => {
        window.open(`http://www.google.com/maps/place/${bin.location.geoLocation.coordinates[1]},${bin.location.geoLocation.coordinates[0]}`, "_blank");
    }

    return (<>
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{bin.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{bin.status}</Card.Subtitle>
                <div className='row main-body'>
                    <div className='col-md-5'>
                        <ProgressBar className="vertical" now={(bin.filled) / (bin.height > 0 ? bin.height : 1) * 100} label={`${(bin.filled) / (bin.height > 0 ? bin.height : 1) * 100}%`} />
                    </div>
                    <div className='col-md-2'></div>
                    <div className='col-md-5'>
                        <BiMapPin size={26} onClick={handleOnClick} style={{ cursor: "pointer" }} />
                    </div>
                </div>
            </Card.Body>
        </Card>
    </>
    )
}

export default Bin;
