import React from "react";

const Header = ({Logout, user,baseURL_deploy}) => {
    //console.log(user);
  return (
    <header>
            <button onClick={Logout}>Log out</button>
            <p>{`${baseURL_deploy}/View/${user.user_id}`}</p>
            <h1>{user.username}</h1>
            
        
    </header>
  );
};


export default Header;
