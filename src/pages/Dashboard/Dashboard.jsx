import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Navbar from '../../components/Navbar/Navbar';
import './Dashboard.css';

const Dashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={`app-container ${isCollapsed ? 'is-collapsed' : ''}`}>
            {/* Sidebar stays fixed to the left */}
            <Sidebar isCollapsed={isCollapsed} />
            
            {/* Main content area that shifts with the sidebar */}
            <div className="main-viewport">
                <Navbar onToggle={() => setIsCollapsed(!isCollapsed)} />
                
                <main className="content-scroll-area">
                    {/* Your dynamic content goes here */}
                    <div className="placeholder-content">
                        {/* CRM Content will be added here */}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;