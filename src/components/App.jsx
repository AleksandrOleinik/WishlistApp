import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Item from './Item';
import WishlistMenu from './WishlistMenu';

import '../App.css';

const App = () => {
    const [items, setItems] = useState([]);
    const [activeWishlistId, setActiveWishlistId] = useState(null);
    const [refreshItems, setRefreshItems] = useState(false);
    const [wishlists, setWishlists] = useState([]);
    const [refreshWishlists, setRefreshWishlists] = useState(false);
    const user_id = '2';

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const params = activeWishlistId ? { params: { wishlist_id: activeWishlistId } } : {};
                const response = await axios.get('http://localhost:3001/items', params);
                setItems(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching items', error);
            }
        };
        fetchItems();
    }, [activeWishlistId, refreshItems]);

    useEffect(() => {
        const fetchWishlists = async () => {
            try {
                const response = await axios.get('http://localhost:3001/wishlists');
                console.log("Wishlist HEEEERE: ",response.data[0].wishlist_id);
                setWishlists(response.data);
                if (activeWishlistId === null && response.data.length > 0) {
                    setActiveWishlistId(response.data[0].wishlist_id);}
            } catch (error) {
                console.error('Error fetching wishlists', error);
            }
        };
        fetchWishlists();
    }, [refreshWishlists]);

    const handleRefreshItems = (wishlistId) => {
        
        setActiveWishlistId(wishlistId);
        setRefreshItems((prev) => !prev);
    };

    return (
        <div className="main_container">
            <WishlistMenu
                wishlists={wishlists}
                onFormSubmit={() => setRefreshWishlists((prev) => !prev)}
                refreshItems={handleRefreshItems}
                user_id={user_id}
                activeWishlistId={activeWishlistId}
            />
            <div>
                <h1>Items List</h1>
                <div className="items_selection">
                    {items.length > 0 ? (
                        items.map((item) => (
                            <Item
                                key={item._id}
                                id={item._id}
                                name={item.name}
                                price={item.price}
                                description={item.description}
                                user_id={item.user_id}
                                wishlist_id={item.wishlist_id}
                                image_link={item.photo}
                                link_shop={item.link_shop}
                                refreshItems={handleRefreshItems}
                                activeWishlistId={activeWishlistId}
                            />
                        ))
                    ) : (
                        <p>No items available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
