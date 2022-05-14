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
        <div className="bin-card">
            {bins?.map(bin => {
                return (<Bin key={bin._id} bin={bin} />)
            })}
        </div>
    )
}

export default GetAllBin;
