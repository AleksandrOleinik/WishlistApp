import React from 'react';

const WishlistMenu = ({wishlists}) => {
    return (
        <div className="wishlist-menu">
            <button>New Item</button>
            <p>NameOfTheWishlist</p>
            <h2>Select a Wishlist</h2>
            <div className="wishlist-buttons">
                {wishlists.map(wishlist => (
                    <button key={wishlist.wishlist_id}>
                        {wishlist.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default WishlistMenu;