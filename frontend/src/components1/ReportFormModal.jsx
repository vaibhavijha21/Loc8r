// components/ReportFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ALL_CATEGORIES, LOCATIONS } from '../data';
import apiService from '../services/api';

const formDefault = {
  itemType: '',
  date: new Date().toISOString().split('T')[0],
  title: '',
  category: '',
  location: '',
  specificLocation: '',
  description: '',
  contact: '',
  phone: '',
  additionalDetails: '',
};

const ReportFormModal = ({ isOpen, onClose, onSubmit, presetType }) => {
  const [formData, setFormData] = useState(formDefault);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    // Reset form and set presetType when modal opens or presetType changes
    setFormData({ 
      ...formDefault, 
      itemType: presetType || '', 
      date: new Date().toISOString().split('T')[0] // Always set current date
    });
    setImageFile(null);
    setImagePreviewUrl('');
  }, [isOpen, presetType]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        e.target.value = "";
        setImageFile(null);
        setImagePreviewUrl('');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreviewUrl(previewUrl);
      console.log('Image preview set:', previewUrl);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build payload compatible with apiService.createItem
    const payload = {
      ...formData,
      // backend expects files under `images` array
      images: imageFile ? [imageFile] : []
    };

    // If parent provides onSubmit, pass the payload so parent can handle upload
    if (typeof onSubmit === 'function') {
      onSubmit(payload);
      return;
    }

    // Otherwise, handle submission here using apiService (frontend-only change)
    (async () => {
      try {
        await apiService.createItem(payload);
        alert('✅ Item reported successfully!');
        onClose();
        // reload to refresh list (parent may handle this better)
        window.location.reload();
      } catch (err) {
        console.error('Failed to submit item', err);
        alert(err.message || 'Failed to submit item');
      }
    })();

  };

  const modalTitle = presetType === 'lost' ? "Report Lost Item" 
    : presetType === 'found' ? "Report Found Item" 
    : "Report Item";
  
  const modalSubtitle = presetType === 'lost' ? "Help us find your lost item by providing detailed information" 
    : presetType === 'found' ? "Help return a found item to its owner by providing details" 
    : "Fill in the details below to report your item";

  return (
    <div 
      className="fixed inset-0  bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1e293b] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-palette">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">{modalTitle}</h3>
              <p className="text-gray-400">{modalSubtitle}</p>
            </div>
            <button className="text-gray-400 hover:text-white text-2xl" onClick={onClose}>
              <i className="bx bx-x"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Item Type Selection & Date */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Item Type *</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="lost" 
                      checked={formData.itemType === 'lost'}
                      onChange={handleChange}
                      className="text-blue-600" 
                      required 
                    />
                    <span className="text-white">Lost Item</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="itemType" 
                      value="found" 
                      checked={formData.itemType === 'found'}
                      onChange={handleChange}
                      className="text-blue-600" 
                      required 
                    />
                    <span className="text-white">Found Item</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Date *</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                />
              </div>
            </div>

            {/* Title and Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Item Title *</label>
                <input 
                  type="text" 
                  name="title" 
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Black Backpack, iPhone 13" 
                  required 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Category *</label>
                <select 
                  name="category" 
                  value={formData.category}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                >
                  <option value="">Select Category</option>
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location and Specific Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Location *</label>
                <select 
                  name="location" 
                  value={formData.location}
                  onChange={handleChange}
                  required 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                >
                  <option value="">Select Location</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Specific Location</label>
                <input 
                  type="text" 
                  name="specificLocation" 
                  value={formData.specificLocation}
                  onChange={handleChange}
                  placeholder="e.g., Room 201, Near entrance" 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Description *</label>
              <textarea 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed description of the item, when you lost/found it, any identifying features..." 
                required 
                rows="3" 
                className="w-full px-4 py-3 bg-[#0f1419] border border-white rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none form-input"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Item Image</label>
              <div style={{
                border: '2px dashed #ffffffff',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                textAlign: 'center',
                minHeight: '250px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.3s'
              }} className="hover:border-blue-500 image-upload-area">
                <input type="file" name="images" accept="image/*" style={{display: 'none'}} id="imageInput" onChange={handleImageChange} />
                {imagePreviewUrl && imagePreviewUrl.length > 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%'}}>
                    <img 
                      src={imagePreviewUrl} 
                      style={{
                        maxHeight: '200px',
                        maxWidth: '280px',
                        width: 'auto',
                        objectFit: 'contain',
                        borderRadius: '0.5rem',
                        border: '1px solid #64748b',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }} 
                      alt="Image Preview" 
                    />
                    <label htmlFor="imageInput" style={{cursor: 'pointer', fontSize: '0.875rem', color: '#60a5fa', fontWeight: 500}}>
                      ✎ Click to change image
                    </label>
                  </div>
                ) : (
                  <label htmlFor="imageInput" style={{cursor: 'pointer', width: '100%'}}>
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                      <div style={{fontSize: '3.5rem', color: '#9ca3af', marginBottom: '1rem'}}>📷</div>
                      <p style={{color: '#9ca3af', fontWeight: 500}}>Click to upload image or drag and drop</p>
                      <p style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem'}}>PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Contact Email *</label>
                <input 
                  type="email" 
                  name="contact" 
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="your.email@example.com" 
                  required 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567" 
                  className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all form-input"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Additional Details</label>
              <textarea 
                name="additionalDetails" 
                value={formData.additionalDetails}
                onChange={handleChange}
                placeholder="Any other relevant information, reward offered, special instructions..." 
                rows="2" 
                className="w-full px-4 py-3 bg-[#0f1419] border border-palette rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none form-input"
              ></textarea>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t border-palette">
              <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                <i className="bx bx-send mr-2"></i>Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFormModal;