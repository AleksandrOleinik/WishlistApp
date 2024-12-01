import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import '../ViewPage.css'

const ViewPage = () => {
    const [items, setItems] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [activeWishlistId, setActiveWishlistId] = useState(null);
    const [username, setUsername] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1);  
    const itemsPerPage = 6; 
    const baseURL_deploy ="https://wishlistapp-backend.onrender.com"
    const baseURL_deploy2 = "http://localhost:3001"

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndWishlists = async () => {
            try {
            
                const response = await axios.post(`${baseURL_deploy}/view/${id}`);
                const { user, wishlists } = response.data;

                setUsername(user.username); 
                setWishlists(wishlists); 

                if (wishlists.length > 0) {
                    setActiveWishlistId(wishlists[0].wishlist_id);
                }
            } catch (error) {
                console.error('Error fetching user and wishlists:', error);
            }
        };

        fetchUserAndWishlists();
    }, [id]);

    useEffect(() => {
        const fetchItems = async () => {
            if (!activeWishlistId) return;

            try {
                const response = await axios.get(`${baseURL_deploy}/items`, {
                    params: { wishlist_id: activeWishlistId },
                });
                setItems(response.data);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [activeWishlistId]);

    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div>
            <Header Logout={() => navigate('/login')} user={{ username }} />
            <div className="main_page_view">
                <div className="main_container">
                    <div className="wishlist_menu_view">
                        <h2>Wishlists for {username}</h2>
        
                            {wishlists.map((wishlist) => (
                                <div
                                    key={wishlist.wishlist_id}
                                    className={wishlist.wishlist_id === activeWishlistId ? 'wishlist active' : 'wishlist normal' }
                                    onClick={() => setActiveWishlistId(wishlist.wishlist_id)}
                                
                                >
                                    
                                    {wishlist.name}
                                </div>
                            ))}

                    </div>
                    <div>
                        <div className="items_selection">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <div key={item._id} className="wishlist_item">
                                        <h3>{item.name}</h3>
                                        <p>Price: ${item.price}</p>
                                        {/*<p>Description: {item.description}</p>*/}
                                        {item.photo && <img src={item.photo} alt={item.name} className='item_photo'/>}
                                        <p className='buy_link'>
                                            <a href={item.link_shop} target="_blank" rel="noopener noreferrer">
                                                Buy Here
                                            </a>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No items available in this wishlist.</p>
                            )}

                            <div className="pagination">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span>
                                    Page {currentPage} of {totalPages}
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

export default ViewPage;
