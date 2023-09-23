import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './cards';

const baseURL = 'https://delightful-tan-scallop.cyclic.cloud';

function Tabs() {
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' is the default active tab

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
    };

    return (
        <div>
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 ${activeTab === 'profile' ? 'border-blue-500' : 'border-transparent'} rounded-t-lg`}
                            id="profile-tab"
                            data-tabs-target="#profile"
                            type="button"
                            role="tab"
                            aria-controls="profile"
                            aria-selected={activeTab === 'profile'}
                            onClick={() => handleTabClick('profile')}
                        >
                            Profile
                        </button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 ${activeTab === 'dashboard' ? 'border-blue-500' : 'border-transparent'} rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300`}
                            id="dashboard-tab"
                            data-tabs-target="#dashboard"
                            type="button"
                            role="tab"
                            aria-controls="dashboard"
                            aria-selected={activeTab === 'dashboard'}
                            onClick={() => handleTabClick('dashboard')}
                        >
                            Dashboard
                        </button>
                    </li>
                    {/* Repeat similar code for other tabs */}
                </ul>
            </div>
            <div id="myTabContent">
                <div
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === 'profile' ? 'block' : 'hidden'}`}
                    id="profile"
                    role="tabpanel"
                    aria-labelledby="profile-tab"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        This is some placeholder content.
                    </p>
                </div>
                <div
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${activeTab === 'dashboard' ? 'block' : 'hidden'}`}
                    id="dashboard"
                    role="tabpanel"
                    aria-labelledby="dashboard-tab"
                >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        This is some placeholder content.
                    </p>
                </div>
                {/* Repeat similar code for other tabs */}
            </div>
        </div>
    );
}

export default Tabs;
