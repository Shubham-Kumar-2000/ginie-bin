import React, { useState } from 'react';
import { getCodes } from 'country-list';
import { Form, Button } from 'react-bootstrap';
import MapPicker from 'react-google-map-picker';
import './AddBin.css'

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

const AddBin = () => {

    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [country, setCountry] = useState("IN");
    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    function handleCountryChange(event) {
        setCountry(event.target.value);
    }

    function handleChangeLocation(lat, lng) {
        setLocation({ lat: lat, lng: lng });
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }

    function handleResetLocation() {
        setDefaultLocation({ ...DefaultLocation });
        setZoom(DefaultZoom);
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        console.log("submitted");
    }

    return (
        <div>
            <Form style={{ width: "30vw" }} className='addBinform' onSubmit={handleFormSubmit}>
                <Form.Label htmlFor='name'>
                    Bin Name:
                </Form.Label>
                <Form.Control type="text" required></Form.Control>

                <Form.Label htmlFor='locationName'>
                    Name:
                </Form.Label>
                <Form.Control type="text" required></Form.Control>
                <Form.Label htmlFor='address'>
                    Address:
                </Form.Label>
                <Form.Control type="text" required></Form.Control>

                <Form.Label htmlFor='city'>
                    City:
                </Form.Label>
                <Form.Control type="text" required></Form.Control>

                <Form.Label htmlFor='state'>
                    State:
                </Form.Label>
                <Form.Control type="text" required></Form.Control>

                <Form.Label htmlFor='pincode'>
                    PinCode:
                </Form.Label>
                <Form.Control type="text" required></Form.Control>

                <Form.Label htmlFor='geoLocation'>
                    Country:
                    <select value={country} onChange={handleCountryChange}>
                        {getCodes().map((c, index) => {
                            return <option key={index} value={c}>{c}</option>
                        })}
                    </select>
                </Form.Label>
                <Form.Control type="text" required></Form.Control>

                <Form.Label>Latitute:</Form.Label><Form.Control type='text' value={location.lat} disabled />
                <Form.Label>Longitute:</Form.Label><Form.Control type='text' value={location.lng} disabled />
                <br></br>
                <MapPicker defaultLocation={defaultLocation}
                    zoom={zoom}
                    mapTypeId="roadmap"
                    style={{ height: '70vh', width: '70vw' }}
                    onChangeLocation={handleChangeLocation}
                    onChangeZoom={handleChangeZoom}
                    apiKey='AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8' />
                <br></br>
                <Button onClick={handleResetLocation}>Reset Location</Button>
                <br></br>
                <br></br>
                <Button type="submit">Save </Button>
            </Form>
        </div>
    );
}

export default AddBin