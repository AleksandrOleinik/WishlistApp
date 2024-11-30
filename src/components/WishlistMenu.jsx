import React from 'react';
import Wishlist from './Wishlist';
import AddWishlistBTN from './AddWishlistBTN.jsx';
import AddItem from './AddItem.jsx';

const WishlistMenu = ({ wishlists, onFormSubmit, refreshItems, user_id, activeWishlistId }) => {
    const deleteWishlist = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/wishlist/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete wishlist');
            onFormSubmit();
        } catch (error) {
            console.error('Error deleting wishlist:', error.message);
        }
    };

    const editWishlist = async (id, newName) => {
        try {
            const response = await fetch(`http://localhost:3001/wishlist/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName }),
            });
            if (!response.ok) throw new Error('Failed to edit wishlist');
            onFormSubmit();
        } catch (error) {
            console.error('Error editing wishlist:', error.message);
        }
    };

    return (

        <div className="wishlist_menu">
            <div className='wishlist_menu_top'>
            <AddItem user_id={user_id} activeWishlistId={activeWishlistId} refreshItems={refreshItems}/>
            <h2>Wishlists:</h2>
            <div className="wishlist-buttons">
                {wishlists.map((wishlist) => (
                    <Wishlist
                        key={wishlist.wishlist_id}
                        name={wishlist.name}
                        id={wishlist.wishlist_id}
                        onDelete={deleteWishlist}
                        onEdit={editWishlist}
                        refreshItems={refreshItems}
                        user_id={user_id}
                        activeWishlistId={activeWishlistId}
                    />
                ))}
            </div>
            </div>
            <AddWishlistBTN onFormSubmit={onFormSubmit} user_id={user_id}/>
        </div>

    );
};

export default WishlistMenu;
