import React, { useEffect, useState } from 'react';
import { getCodes } from 'country-list';
import { Form, Button } from 'react-bootstrap';
import MapPicker from 'react-google-map-picker';
import './AddBin.css'
import binService from '../../services/binService';
import { NotificationManager } from 'react-notifications';

const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

const AddBin = () => {
    const [name, setName] = useState("");
    const [locationName, setLocationName] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [country, setCountry] = useState("IN");
    const [location, setLocation] = useState(defaultLocation);
    const [zoom, setZoom] = useState(DefaultZoom);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        });
    }, [])

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

    async function handleFormSubmit(e) {
        e.preventDefault();
        const responseBody = {
            name: name,
            location: {
                name: locationName,
                address: address,
                city: city,
                state: state,
                pincode: pincode,
                country: country,
                geoLocation: {
                    type: "Point",
                    coordinates: [DefaultLocation.lng, DefaultLocation.lat]
                }
            }
        }
        try {
            const response = await binService.addBin(responseBody);
            switch (response.status) {
                case 201:
                    NotificationManager.success("Bin created successfully!");
                    break;
                case 401:
                    NotificationManager.warning("Not Authorized to add bin!");
                    break
                default:
                    NotificationManager.error("Something went wrong!");
            }
        } catch (e) {
            console.error(e);
            NotificationManager.error("Sorry... Either the Network Connectivity is Lost or the Server is currently Unavailable. Please Try Again Later");
        }
    }

    return (
        <div>
            <Form style={{ width: "100%" }} onSubmit={handleFormSubmit}>
                <div className='row'>
                    <div className='col-md-5'>
                        <Form.Label htmlFor='name'>
                            Bin Name:
                        </Form.Label>
                        <Form.Control type="text" onChange={(e) => setName(e.target.value)} required></Form.Control>

                        <Form.Label htmlFor='locationName'>
                            Location:
                        </Form.Label>
                        <Form.Control type="text" onChange={(e) => setLocationName(e.target.value)} required></Form.Control>
                        <Form.Label htmlFor='address'>
                            Address:
                        </Form.Label>
                        <Form.Control type="text" onChange={(e) => setAddress(e.target.value)} required></Form.Control>

                        <Form.Label htmlFor='city'>
                            City:
                        </Form.Label>
                        <Form.Control type="text" onChange={(e) => setCity(e.target.value)} required></Form.Control>

                        <Form.Label htmlFor='state'>
                            State:
                        </Form.Label>
                        <Form.Control type="text" onChange={(e) => setState(e.target.value)} required></Form.Control>
                    </div>
                    <div className='col-md-2'></div>
                    <div className='col-md-5'>
                        <Form.Label htmlFor='pincode'>
                            PinCode:
                        </Form.Label>
                        <Form.Control type="text" onChange={(e) => setPincode(e.target.value)} required></Form.Control>
                        <br></br>

                        <Form.Label htmlFor='geoLocation'>
                            Country:&nbsp;&nbsp;
                            <select style={{ color: "white", background: "transparent" }} value={country} onChange={(e) => setCountry(e.target.value)}>
                                {getCodes().map((c, index) => {
                                    return <option style={{ color: "black" }} key={index} value={c}>{c}</option>
                                })}
                            </select>
                        </Form.Label>
                        <br></br>
                        <Form.Label>Latitute:</Form.Label><Form.Control type='text' value={location.lat} disabled />
                        <Form.Label>Longitute:</Form.Label><Form.Control type='text' value={location.lng} disabled />
                        <br></br>
                    </div>
                </div>
                <MapPicker defaultLocation={defaultLocation}
                    zoom={zoom}
                    mapTypeId="roadmap"
                    style={{ height: '70vh', width: '100%' }}
                    onChangeLocation={handleChangeLocation}
                    onChangeZoom={handleChangeZoom}
                    apiKey='AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8' />
                <br></br>
                <Button onClick={handleResetLocation}>Reset Location</Button>
                <br></br>
                <br></br>
                <Button type="submit">Save </Button>
            </Form>
            <hr></hr>
        </div>
    );
}

export default AddBin;
