// components/ItemGrid.jsx
import React from 'react';

const ItemCard = ({ item, onClick }) => {
  const badgeColor = item.status === "lost" ? "bg-gradient-to-r from-red-500 to-red-600" : "bg-gradient-to-r from-green-500 to-green-600";
  const badgeIcon = item.status === "lost" ? "bx-time" : "bx-check-circle";
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div 
      className="bg-[#1e293b] rounded-xl border border-palette overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="relative">
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={item.image} 
            className="object-cover w-full h-full hover:scale-110 transition-transform duration-300" 
            alt={item.title} 
          />
        </div>
        <span className={`absolute top-3 right-3 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg`}>
          <i className={`bx ${badgeIcon}`}></i>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </span>
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
          {formattedDate}
        </div>
      </div>
      <div className="p-4 space-y-3">
        <h3 className="font-bold text-white text-lg line-clamp-1">{item.title}</h3>
        <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400">
            <i className="bx bx-map-pin"></i>
            <span className="text-sm">{item.location}</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <i className="bx bx-category"></i>
            <span className="text-sm">{item.category}</span>
          </div>
        </div>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

const ItemGrid = ({ items, openModal }) => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Items</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span id="totalCount">{items.length}</span> items found
        </div>
      </div>
  <div id="itemGrid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 bg-black p-6 rounded-lg">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="bx bx-search text-6xl text-gray-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          items.map(item => (
            <ItemCard key={item.id} item={item} onClick={openModal} />
          ))
        )}
      </div>
    </div>
  );
};

export default ItemGrid;