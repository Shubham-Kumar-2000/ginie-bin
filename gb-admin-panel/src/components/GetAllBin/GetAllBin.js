import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import binService from '../../services/binService';
import './GetAllBin.css';
import Bin from "../Bin/Bin";

const GetAllBin = () => {
    const [bins, setBins] = useState([]);

    const loadAllBins = async () => {
        try {
            const response = await binService.getBin();
            console.log(response.data);
            switch (response.status) {
                case 200:
                    NotificationManager.success("Bins fetched successfully!");
                    setBins(response.data.bins);
                    break;
                case 401:
                    NotificationManager.warning("Not Authorized");
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
                    return (<Bin key={bin._id} bin={bin} />)
                })}
            </tbody>
        </table>
    )
}

export default GetAllBin;
