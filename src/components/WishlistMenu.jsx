import React, { useState } from 'react';
import Wishlist from './Wishlist';
import AddWishlistBTN from './AddWishlistBTN.jsx';


const WishlistMenu = ({ wishlists, user_id, onFormSubmit }) => {
    
    const deleteWishlist = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/wishlist/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete wishlist');
            }

            console.log(`Wishlist ${id} deleted successfully`);
            onFormSubmit(); // Refresh wishlists after deletion
        } catch (error) {
            console.error('Error deleting wishlist:', error.message);
        }
    };

    const editWishlist = async (id, newName) => {
        try {
            const response = await fetch(`http://localhost:3001/wishlist/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) {
                throw new Error('Failed to edit wishlist');
            }

            console.log(`Wishlist ${id} updated successfully`);
            onFormSubmit(); // Refresh wishlists after edit
        } catch (error) {
            console.error('Error editing wishlist:', error.message);
        }
    };

    const activateWishlist = async (id) => {};

    return (
        <div className="wishlist-menu">
            <button>New Item</button>
            <p>NameOfTheActiveWishlist</p>
            <h2>Select a Wishlist</h2>
            <div className="wishlist-buttons">
                {wishlists.map((wishlist) => (
                    <Wishlist
                        key={wishlist.wishlist_id}
                        name={wishlist.name}
                        id={wishlist.wishlist_id}
                        user_id={wishlist.user_id}
                        onDelete={deleteWishlist}
                        onEdit={editWishlist}
                        />
                ))}
            </div>
            <AddWishlistBTN 
                        user_id={user_id} 
                        onFormSubmit={onFormSubmit}   
                        wishlists={wishlists} 
                        />
            
        </div>
    );
};

export default WishlistMenu;
