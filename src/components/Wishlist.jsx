import React, { useState } from 'react';

const Wishlist = ({ name, id, user_id, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleEdit = () => {
        onEdit(id, newName);
        setIsEditing(false);
    };

    return (
        <div className="wishlist" wishlist_id={id} onClick={() => {console.log(id)}}>
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
