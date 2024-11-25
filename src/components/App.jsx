import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Item from './Item'; // Import the Item component
import WishlistMenu from './WishlistMenu';
import '../App.css';

const App = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('http://localhost:3001/Items');
                console.log('Fetched items:', response.data); // Debugging line
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching Items', error);
            }
        };
        fetchItems();
    }, []);


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
        <div className="main_container">
            <WishlistMenu wishlists={wishlists} />
            <div>
                <h1>Items List</h1>
                {items.length > 0 ? (
                    items.map(item => (
                        <Item id={item._id} 
                            name={item.name} 
                            price={item.price} 
                            description={item.description} 
                            user_id={item.user_id} 
                            wishlist_id={item.wishlist_id} 
                            image_link={item.photo}/>
                    ))
                ) : (
                    <p>No items available</p>
                )}
            </div>
        </div>
    );
};

export default App;