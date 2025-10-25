// components/RightSidebar.jsx
import React from 'react';

const RecentActivityItem = ({ item }) => {
  const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#374151] transition-colors">
      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
        <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{item.title}</p>
        <p className="text-gray-400 text-xs">{item.status} in {item.location}</p>
      </div>
      <span className="text-xs text-gray-500">{date}</span>
    </div>
  );
};

const RightSidebar = ({ lostCount, foundCount, recentItems, openReportModal }) => (
  <aside className="bg-black p-6 border-l border-palette overflow-y-auto">
    <div className="text-center mb-8">
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <i className="bx bx-search-alt text-3xl text-white"></i>
      </div>
      <h3 className="font-bold text-lg text-white mb-2">Lost & Found</h3>
      <p className="text-sm text-gray-400">Dashboard Overview</p>
    </div>

    <div className="space-y-4 mb-8">
      <div id="lostCount" className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-red-500/20 transition-all duration-200">
        <div className="text-2xl font-bold text-red-400">{lostCount}</div>
        <div className="text-sm text-red-300">Lost Items</div>
      </div>
      <div id="foundCount" className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4 text-center hover:shadow-lg hover:shadow-green-500/20 transition-all duration-200">
        <div className="text-2xl font-bold text-green-400">{foundCount}</div>
        <div className="text-sm text-green-300">Found Items</div>
      </div>
    </div>

    <div className="space-y-3">
      <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-3">Quick Actions</h4>
      <button 
        onClick={() => openReportModal()}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 transform hover:scale-105"
      >
        <i className="bx bx-plus"></i>
        Report Item
      </button>
    </div>

    <div className="mt-8">
      <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-3">Recent Activity</h4>
      <div id="recentActivity" className="space-y-3 text-sm">
        {recentItems.length === 0 ? (
          <p className="text-gray-500 text-center">No recent activity</p>
        ) : (
          recentItems.map(item => <RecentActivityItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  </aside>
);

export default RightSidebar;