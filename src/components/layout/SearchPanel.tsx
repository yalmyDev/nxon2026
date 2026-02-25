import React from 'react';

export default function SearchPanel() {
    return (
        <div className="panel-sidebar">
        <div className="sidebar-header">SEARCH</div>
        <div style={{ padding: '10px' }}>
            <input type="text" placeholder="Search" style={{ width: '100%', backgroundColor: '#3c3c3c', border: '1px solid #555', color: 'white', padding: '4px' }} />
        </div>
        </div>
    );
}