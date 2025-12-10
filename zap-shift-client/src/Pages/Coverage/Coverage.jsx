import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';

const Coverage = () => {

    const position = [23.6850, 90.3563]
    const serviceCenters = useLoaderData();
    const mapRef = useRef(null);

    const handleSearch = (event) => {
        event.preventDefault();
        const location = event.target.location.value;
        const district = serviceCenters.find(center => center.district.toLowerCase().includes(location.toLowerCase()));

        if (district) {
            const coords = [district.latitude, district.longitude];
            console.log('Found district:', district.district, 'at coordinates:', coords);
            // going to the location on the map
            mapRef.current.flyTo(coords, 14);
            // can also use setView() same ouptut
        }
    }

    return (
        <div>
            <h3>We are available in 64 districts</h3>
            <div>
                {/* search */}
                <form onSubmit={handleSearch}>
                    <label className="input">
                        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                strokeWidth="2.5"
                                fill="none"
                                stroke="currentColor"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </g>
                        </svg>
                        <input name='location' type="search" className="grow" placeholder="Search" />
                    </label>
                </form>
            </div>
            <div>
                <MapContainer center={position} zoom={8} scrollWheelZoom={false} style={{ height: "500px", width: "100%" }}
                ref={mapRef}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        serviceCenters.map((center, index) => (
                            <Marker position={[center.latitude, center.longitude]} key={index}>
                                <Popup>
                                    <strong>{center.district}</strong><br />
                                    {center.address}<br />
                                    Service Area: {center.covered_area.join(', ')}
                                </Popup>
                            </Marker>
                        )
                        )
                    }
                </MapContainer>
            </div>
        </div>
    );
};

export default Coverage;