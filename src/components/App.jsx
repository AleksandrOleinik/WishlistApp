import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Item from './Item';
import WishlistMenu from './WishlistMenu';
import Header from './Header';

import '../App.css';

const App = () => {
    const [items, setItems] = useState([]);
    const [activeWishlistId, setActiveWishlistId] = useState(null);
    const [refreshItems, setRefreshItems] = useState(false);
    const [wishlists, setWishlists] = useState([]);
    const [refreshWishlists, setRefreshWishlists] = useState(false);
    const [user_id, setUser] = useState({
        state: false,
        username: '',
        password: '',
    });

    
    const Login = async (username, password) => {
        try {
            // add login logic here
            if (username === 'admin' && password === 'password') {
                setUser({ state: true, username, password });
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Error during login', error);
        }
    };

    
    useEffect(() => {
        if (user_id.state) {
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
        }
    }, [user_id.state, activeWishlistId, refreshItems]);

    useEffect(() => {
        if (user_id.state) {
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
        fetchWishlists();}
    }, [user_id.state, refreshWishlists]);

    const handleRefreshItems = (wishlistId) => {
        if (user_id.state) {
        
        setActiveWishlistId(wishlistId);
        setRefreshItems((prev) => !prev);}
    };

    return (
        <div>
            {user_id.state ? (
                <div className='main_page'>
                <Header onSubmit={Login}/>
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
            </div>) : 
            (<h1>Access declined</h1>)}
         </div>  
    );
};

export default App;
