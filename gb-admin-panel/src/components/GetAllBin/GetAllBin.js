import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import binService from '../../services/binService';
import './GetAllBin.css';

const GetAllBin = () => {
    const [bins, setBins] = useState([]);

    const loadAllBins = async () => {
        try {
            const response = await binService.getBin();

            switch (response.status) {
                case 200:
                    NotificationManager.success("Bins fetched successfully!");
                    setBins(response.data.bins);
                    break;
                case 401:
                    NotificationManager.warning("Not AUthorized");
                    break;
                default:
                    NotificationManager.error("Something went wrong");
            }
        } catch (e) {
            NotificationManager.error("Sorry... Either the Network Connectivity is Lost or the Server is currently Unavailable. Please Try Again Later");
        }
    }

    useEffect(() => {
        loadAllBins();
    }, [])

    return (
        <table className="table table-dark table-striped table-content custom-table">
            <thead>
                <tr>
                    <th scope="col">Bin Name</th>
                    <th scope="col">Status</th>
                    <th scope="col">Capacity</th>
                    <th scope="col">Location</th>
                </tr>
            </thead>
            <tbody>
                {bins?.map(bin => {
                    return (<tr key={bin._id}>
                        <td>{bin.name}</td>
                        <td>{bin.status}</td>
                        <td>{(parseInt(bin.filled) / parseInt(bin.height)) * 100}</td>
                        {/* {(bin.public) ? <td><img alt="correct" src="https://img.icons8.com/officel/25/000000/checkmark--v2.png" /></td> : <td><img alt="wrong" src="https://img.icons8.com/color/25/000000/close-window.png" /></td>
                        } */}
                    </tr>)
                })}
            </tbody>
        </table>
    )
}

export default GetAllBin