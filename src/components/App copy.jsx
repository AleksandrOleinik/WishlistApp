import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [wishlists, setWishlists] = useState([]);

    useEffect(() => {
        const fetchWishlists = async () => {
            try {
                const response = await axios.get('http://localhost:3001/wishlists');
                console.log('Fetched wishlists:', response.data); // Debugging line
                setWishlists(response.data);
            } catch (error) {
                console.error('Error fetching wishlists', error);
            }
        };

        fetchWishlists();
    }, []);

    return (
        <div>
            <h1>Wishlists</h1>
            <ul>
                {wishlists.length > 0 ? (
                    wishlists.map(wishlist => (
                        <li key={wishlist._id}>
                            <h2>{wishlist.name}</h2>
                            <p>User ID: {wishlist.user_id}</p>
                            <p>Wishlist ID: {wishlist.wishlist_id}</p>
                            <p>Link: {wishlist.link}</p>
                            <p>Items: {wishlist.items.join(', ')}</p>
                        </li>
                    ))
                ) : (
                    <p>No wishlists available</p>
                )}
            </ul>
        </div>
    );
};

export default App;