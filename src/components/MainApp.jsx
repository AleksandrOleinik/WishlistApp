import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Item from './Item';
import WishlistMenu from './WishlistMenu';
import Header from './Header';

const MainApp = ({ LoginStatus }) => {
    const [items, setItems] = useState([]);
    const [activeWishlistId, setActiveWishlistId] = useState(null);
    const [refreshItems, setRefreshItems] = useState(false);
    const [wishlists, setWishlists] = useState([]);
    const [refreshWishlists, setRefreshWishlists] = useState(false);
    const baseURL_deploy ="https://wishlistapp.onrender.com"
    const baseURL_locally = "http://localhost:3001"
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 6; 

    const navigate = useNavigate();

    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchItems = async () => {
            if (!activeWishlistId || !user?.user_id) {
                return; 
            }

            try {
                console.log(
                    'Fetching items for activeWishlistId:',
                    activeWishlistId,
                    'and user_id:',
                    user.user_id
                );
                const response = await axios.get(`${baseURL_deploy}/items`, {
                    params: { wishlist_id: activeWishlistId, user_id: user.user_id },
                });
                setItems(response.data);
                setCurrentPage(1); 
            } catch (error) {
                console.error('Error fetching items', error);
            }
        };

        fetchItems();
    }, [activeWishlistId, refreshItems, user]);

    useEffect(() => {
        const fetchWishlists = async () => {
            try {
                const response = await axios.get(`${baseURL_deploy}/wishlists`, {
                    params: { user_id: user.user_id },
                });
                setWishlists(response.data);
                if (activeWishlistId === null && response.data.length > 0) {
                    setActiveWishlistId(response.data[0].wishlist_id);
                }
            } catch (error) {
                console.error('Error fetching wishlists', error);
            }
        };
        if (user) fetchWishlists();
    }, [refreshWishlists, user, activeWishlistId]);

    const handleRefreshItems = (wishlistId) => {
        setActiveWishlistId(wishlistId);
        setRefreshItems((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div>
            <Header Logout={handleLogout} user={user} />
            <div className="main_page">
                <div className="main_container">
                    <WishlistMenu
                        wishlists={wishlists}
                        onFormSubmit={() => setRefreshWishlists((prev) => !prev)}
                        refreshItems={handleRefreshItems}
                        user_id={user.user_id}
                        activeWishlistId={activeWishlistId}
                    />
                    <div>
                        <div className="items_selection">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
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
                                <p>Let it shine and add wishes</p>
                            )}
                            <div className="pagination">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span className='pagination_num'>
                                {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainApp;
