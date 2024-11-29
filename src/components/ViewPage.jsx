import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';

const ViewPage = () => {
    const [items, setItems] = useState([]);
    const [wishlists, setWishlists] = useState([]);
    const [activeWishlistId, setActiveWishlistId] = useState(null);
    const [username, setUsername] = useState(''); // State to store username
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const itemsPerPage = 6; // Items per page

    const { id } = useParams(); // Extract user_id from URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserAndWishlists = async () => {
            try {
                // Fetch user data and associated wishlists
                const response = await axios.post(`http://localhost:3001/view/${id}`);
                const { user, wishlists } = response.data;

                setUsername(user.username); // Set the username
                setWishlists(wishlists); // Set the wishlists

                // Automatically set the active wishlist
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
                const response = await axios.get('http://localhost:3001/items', {
                    params: { wishlist_id: activeWishlistId },
                });
                setItems(response.data);
                setCurrentPage(1); // Reset to first page
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };

        fetchItems();
    }, [activeWishlistId]);

    // Calculate items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    // Pagination controls
    const totalPages = Math.ceil(items.length / itemsPerPage);

    return (
        <div>
            <Header Logout={() => navigate('/login')} user={{ username }} />
            <div className="main_page">
                <div className="main_container">
                    <div className="wishlist-menu">
                        <h2>Wishlists for {username}</h2>
                        <ul>
                            {wishlists.map((wishlist) => (
                                <li
                                    key={wishlist.wishlist_id}
                                    className={wishlist.wishlist_id === activeWishlistId ? 'active' : ''}
                                    onClick={() => setActiveWishlistId(wishlist.wishlist_id)}
                                >
                                    {wishlist.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h1>Items List</h1>
                        <div className="items_selection">
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <div key={item._id} className="item">
                                        <h3>{item.name}</h3>
                                        <p>Price: ${item.price}</p>
                                        <p>Description: {item.description}</p>
                                        {item.photo && <img src={item.photo} alt={item.name} />}
                                        <p>
                                            <a href={item.link_shop} target="_blank" rel="noopener noreferrer">
                                                Buy Here
                                            </a>
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>No items available in this wishlist.</p>
                            )}
                        </div>
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
    );
};

export default ViewPage;
