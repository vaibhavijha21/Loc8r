// components/ItemModal.jsx
import React from 'react';

const ItemModal = ({ item, onClose }) => {
  if (!item) return null;

  const statusColor = item.status === "lost" ? "text-red-400" : "text-green-400";
  const statusIcon = item.status === "lost" ? "bx-time" : "bx-check-circle";
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1e293b] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-palette">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
            <button className="text-gray-400 hover:text-white text-2xl" onClick={onClose}>
              <i className="bx bx-x"></i>
            </button>
          </div>
          <div className="space-y-4">
            {/* ... Modal Content based on item details ... */}
            <div className="space-y-6">
              <div className="w-full h-64 overflow-hidden rounded-lg">
                <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Status</label>
                  <div className="flex items-center gap-2">
                    <i className={`bx ${statusIcon} ${statusColor}`}></i>
                    <span className="text-white capitalize">{item.status}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Category</label>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-category text-blue-400"></i>
                    <span className="text-white">{item.category}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Location</label>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-map-pin text-green-400"></i>
                    <span className="text-white">{item.location}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Date</label>
                  <div className="flex items-center gap-2">
                    <i className="bx bx-calendar text-purple-400"></i>
                    <span className="text-white">{formattedDate}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Description</label>
                <p className="text-white bg-[#0f1419] p-3 rounded-lg">{item.description}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Contact</label>
                <p className="text-blue-400">{item.contact}</p>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                  <i className="bx bx-envelope mr-2"></i>Contact Owner
                </button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                  <i className="bx bx-share mr-2"></i>Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemModal;