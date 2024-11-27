import React, { useState } from 'react';

const Wishlist = ({ name, id, onDelete, onEdit, refreshItems }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleEdit = () => {
        onEdit(id, newName);
        setIsEditing(false);
    };

    const handleSelectWishlist = () => {
        refreshItems(id);
    };

    return (
        <div className="wishlist" onClick={handleSelectWishlist}>
            {!isEditing ? (
                <>
                    <h3>{name}</h3>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={() => onDelete(id)}>Delete</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button onClick={handleEdit}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            )}
        </div>
    );
};

export default Wishlist;
