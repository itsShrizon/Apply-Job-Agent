import React from 'react';
import { Outlet } from 'react-router-dom';
import Modal from './Modal.jsx';
import Navbar from './Navbar.jsx';

const Layout = () => {
    return (
        <div>
           <Navbar/>
            <Outlet/>
            <Modal />
        </div>
    );
};

export default Layout;