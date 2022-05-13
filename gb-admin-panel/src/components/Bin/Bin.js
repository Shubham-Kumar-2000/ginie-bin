import React from 'react';
import { BiMapPin } from 'react-icons/bi';

const Bin = ({ bin }) => {
    const handleOnClick = () => {
        window.open(`http://www.google.com/maps/place/${bin.location.geoLocation.coordinates[1]},${bin.location.geoLocation.coordinates[0]}`, "_blank");
    }

    return (
        <tr key={bin._id}>
            <td>{bin.name}</td>
            <td>{bin.status}</td>
            <td>{(bin.filled) / (bin.height > 0 ? bin.height : 1) * 100}</td>
            <td><BiMapPin size={26} onClick={handleOnClick} style={{ cursor: "pointer" }} /></td>
        </tr>
    )
}

export default Bin;
