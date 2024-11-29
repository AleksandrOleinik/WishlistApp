import React from "react";

const Header = ({Logout, user}) => {
    //console.log(user);
  return (
    <header>
            <h1>{user.username}</h1>
            <button onClick={Logout}>Logout</button>
        
    </header>
  );
};


export default Header;
