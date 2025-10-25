import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Mail, MapPin, Tag, Calendar, X, Search, Plus, List, AlertTriangle, CheckCircle, Smartphone, Map } from 'lucide-react';
import Sidebar from './Sidebar';

// --- DATA AND CONSTANTS ---
const initialItems = [
    {
        id: 1,
        title: "Black Backpack (Textbooks/Charger)",
        image: "https://genietravel.com/cdn/shop/files/13_c457f37a-da03-4025-bc90-0e405b21b44b.jpg?v=1720518555",
        description: "Lost near the main library entrance, contains textbooks and a laptop charger. It has a distinctive red zipper pull.",
        category: "Bags",
        location: "Square1",
        status: "lost",
        date: "2024-01-15",
        contact: "john.doe@example.com",
        phone: "+1 555-555-1234",
    },
    {
        id: 2,
        title: "Blue Water Bottle (Dented)",
        image: "https://oceanbottle.co/cdn/shop/products/OceanBottle_BOB_Front_Ocean-Blue_2048px_927b4df9-48ca-4e74-81e0-9de65cad057c.jpg?v=1661510139&width=720",
        description: "Found near cafeteria on the third floor, has a slight dent on the bottom and a black carabiner clip.",
        category: "Bottle",
        location: "Turing",
        status: "found",
        date: "2024-01-14",
        contact: "jane.smith@example.com"
    },
    {
        id: 3,
        title: "Lenovo Laptop Charger (USB-C)",
        image: "https://img.freepik.com/free-photo/charger-usb-cable-type-c-white-isolated-background_58702-4501.jpg",
        description: "Lost a white Lenovo USB-C charger in classroom 302, Explo Building.",
        category: "Charger",
        location: "Explo",
        status: "lost",
        date: "2024-01-13",
        contact: "mike.wilson@example.com"
    },
    {
        id: 4,
        title: "Student ID Card (Sarah Jones)",
        image: "https://northeastregistries.sfo2.digitaloceanspaces.com/wp-content/uploads/2022/01/22182207/identificationcard.jpg",
        description: "Found a student ID card with the name Sarah Jones on it, found in parking lot near the west entrance.",
        category: "ID Card",
        location: "Square1",
        status: "found",
        date: "2024-01-12",
        contact: "sarah.jones@example.com"
    },
];

const CATEGORIES = ["Bags", "Charger", "Bottle", "ID Card", "Phone", "Keys", "Electronics", "Personal", "Other"];
const LOCATIONS = ["Square1", "Turing", "Explo", "Newton", "DeMorgan", "Picasso", "Other"];
const STATUSES = [
    { label: "Lost Items", value: "lost" },
    { label: "Found Items", value: "found" }
];

const getPlaceholderImage = (category) => {
    const placeholders = {
        'Bags': 'https://placehold.co/600x400/374151/ffffff?text=BAG',
        'Charger': 'https://placehold.co/600x400/374151/ffffff?text=CHARGER',
        'Bottle': 'https://placehold.co/600x400/374151/ffffff?text=BOTTLE',
        'ID Card': 'https://placehold.co/600x400/374151/ffffff?text=ID+CARD',
        'Phone': 'https://placehold.co/600x400/374151/ffffff?text=PHONE',
        'Keys': 'https://placehold.co/600x400/374151/ffffff?text=KEYS',
        'Electronics': 'https://placehold.co/600x400/374151/ffffff?text=ELECTRONICS',
        'Personal': 'https://placehold.co/600x400/374151/ffffff?text=PERSONAL',
        'Other': 'https://placehold.co/600x400/374151/ffffff?text=ITEM',
    };
    return placeholders[category] || placeholders['Other'];
};

const showSuccessMessage = (itemData) => {
    // In a single-file React app, we use state for notifications
    // but for simplicity, we'll keep the function signature and rely on component state
    console.log(`Successfully reported: ${itemData.title}`);
};

// --- Custom hook for local storage persistence ---
const useLocalStorageState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error reading localStorage key “" + key + "”:", error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to localStorage key “" + key + "”:", error);
        }
    }, [key, state]);

    return [state, setState];
};

// --- NESTED COMPONENTS ---

const FilterButton = ({ label, value, isSelected, onClick, activeColor, hoverColor, shadowColor }) => {
    const selectedClasses = `${activeColor} border-current shadow-lg ring-2 ring-offset-2 ring-offset-slate-900/50 ring-opacity-50`;
    const unselectedClasses = `bg-white hover:bg-blue-400 border-slate-700 ${hoverColor} ${shadowColor}`;
    const classes = `px-4 py-2 text-slate-700 rounded-lg transition-all duration-200 border text-sm flex-shrink-0 font-medium`;

    return (
        <button
            className={`${classes} ${isSelected ? selectedClasses : unselectedClasses}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

const ItemCard = ({ item, openModal }) => {
    const badgeColor = item.status === "lost" ? "bg-red-600" : "bg-green-600";
    const badgeIcon = item.status === "lost" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />;
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div
            className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => openModal(item)}
        >
            <div className="relative">
                <div className="w-full h-48 overflow-hidden">
                    <img
                        src={item.image || getPlaceholderImage(item.category)}
                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        alt={item.title}
                        onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(item.category); }}
                    />
                </div>
                <div className={`absolute top-3 right-3 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md capitalize`}>
                    {badgeIcon}
                    {item.status}
                </div>
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                    {formattedDate}
                </div>
            </div>
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-white text-lg line-clamp-1">{item.title}</h3>
                <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">{item.category}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItemGrid = ({ items, openModal, totalCount }) => (
    <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">All Items</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="font-semibold text-blue-400">{totalCount}</span> items reported
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.length > 0 ? (
                items.map(item => (
                    <ItemCard key={item.id} item={item} openModal={openModal} />
                ))
            ) : (
                <div className="col-span-full text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                    <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No items match your criteria</h3>
                    <p className="text-gray-500">Try removing some filters or broadening your search term.</p>
                </div>
            )}
        </div>
    </div>
);

const RightSidebar = ({ lostCount, foundCount, recentItems, openReportModal }) => (
    <aside className="bg-black p-6 border-l border-slate-700 overflow-y-auto max-sm:order-1">
        <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Lost & Found</h3>
            <p className="text-sm text-gray-400">Real-Time Overview</p>
        </div>

        <div className="space-y-4 mb-8">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{lostCount}</div>
                <div className="text-sm text-red-300">Lost Items Reported</div>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{foundCount}</div>
                <div className="text-sm text-green-300">Found Items Logged</div>
            </div>
        </div>

        <button
            onClick={() => openReportModal('found')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 font-semibold transform hover:scale-[1.02] shadow-xl shadow-blue-500/20"
        >
            <Plus className="w-5 h-5" />
            Report Found Item
        </button>

        <div className="mt-8">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-3">Recent Activity</h4>
            <div className="space-y-4 text-sm">
                {recentItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-700 rounded-lg">
                        <span className={`${item.status === 'lost' ? 'text-red-400' : 'text-green-400'} pt-1`}>
                            {item.status === 'lost' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </span>
                        <div>
                            <p className="text-white font-medium line-clamp-1">{item.title}</p>
                            <p className="text-gray-400 text-xs capitalize">{item.status} in {item.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </aside>
);

const ItemModal = ({ item, onClose }) => {
    if (!item) return null;

    const statusColor = item.status === "lost" ? "text-red-400 bg-red-500/10" : "text-green-400 bg-green-500/10";
    const statusIcon = item.status === "lost" ? AlertTriangle : CheckCircle;
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const IconComponent = statusIcon;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl transition-all duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-700 pb-4">
                        <h3 className="text-3xl font-extrabold text-white">{item.title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">
                            <X className="w-7 h-7" />
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="w-full h-80 overflow-hidden rounded-lg border-2 border-slate-700">
                            <img 
                                src={item.image || getPlaceholderImage(item.category)} 
                                className="w-full h-full object-cover" 
                                alt={item.title}
                                onError={(e) => { e.target.onerror = null; e.target.src = getPlaceholderImage(item.category); }}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                            <DetailPill label="Status" value={item.status} color={statusColor} Icon={IconComponent} />
                            <DetailPill label="Category" value={item.category} color="text-purple-400 bg-purple-500/10" Icon={Tag} />
                            <DetailPill label="Location" value={item.location} color="text-green-400 bg-green-500/10" Icon={MapPin} />
                            <DetailPill label="Date" value={formattedDate} color="text-blue-400 bg-blue-500/10" Icon={Calendar} />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><List className="w-4 h-4"/> Detailed Description</label>
                            <p className="text-white bg-slate-700 p-4 rounded-lg border border-slate-600 text-sm">{item.description}</p>
                        </div>
                        
                        <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                            <h4 className="font-semibold text-lg text-blue-400 mb-3">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                                <ContactRow label="Email" value={item.contact} Icon={Mail} type="email" />
                                {item.phone && <ContactRow label="Phone" value={item.phone} Icon={Smartphone} type="phone" />}
                                {item.specificLocation && <ContactRow label="Specific Location" value={item.specificLocation} Icon={Map} />}
                            </div>
                        </div>
                        
                        <a href={`mailto:${item.contact}`} className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 font-semibold text-lg transform hover:scale-[1.01]">
                            <Mail className="w-5 h-5 inline-block mr-2" /> Contact Owner/Finder
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailPill = ({ label, value, color, Icon }) => (
    <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">{label}</label>
        <div className={`flex items-center gap-2 ${color} p-3 rounded-lg border border-slate-700/50`}>
            <Icon className="w-4 h-4" />
            <span className="text-white capitalize">{value}</span>
        </div>
    </div>
);

const ContactRow = ({ label, value, Icon, type }) => {
    let content = <span className="text-white">{value}</span>;
    if (type === 'email') {
        content = <a href={`mailto:${value}`} className="text-blue-300 hover:text-blue-100">{value}</a>;
    } else if (type === 'phone') {
        content = <a href={`tel:${value}`} className="text-blue-300 hover:text-blue-100">{value}</a>;
    }
    
    return (
        <div className="flex justify-between border-b border-slate-600/50 pb-2 items-center">
            <span className="text-gray-400 flex items-center gap-2"><Icon className="w-4 h-4"/> {label}:</span>
            {content}
        </div>
    );
};

const ReportFormModal = ({ isOpen, onClose, addItem }) => {
    const [formData, setFormData] = useState({
        itemType: '', title: '', category: '', location: '', description: '', contact: '',
        date: new Date().toISOString().split('T')[0], phone: '', specificLocation: '', additionalDetails: '', imageFile: null
    });
    const [error, setError] = useState('');
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            // Reset form when closed
            setFormData({
                itemType: '', title: '', category: '', location: '', description: '', contact: '',
                date: new Date().toISOString().split('T')[0], phone: '', specificLocation: '', additionalDetails: '', imageFile: null
            });
            setImagePreviewUrl(null);
            setError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const file = files[0];
            if (file && file.size > 5 * 1024 * 1024) {
                setError("Image size must be less than 5MB.");
                e.target.value = ""; // Clear file input
                setImagePreviewUrl(null);
                return;
            }
            if (error) setError('');
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreviewUrl(file ? URL.createObjectURL(file) : null);
        } else {
            if (error) setError('');
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const requiredFields = ['itemType', 'title', 'category', 'location', 'description', 'contact'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            setError("Please fill out all required fields (*).");
            return;
        }

        const newItem = {
            id: Date.now(),
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            location: formData.location,
            status: formData.itemType,
            date: formData.date,
            contact: formData.contact.trim(),
            phone: formData.phone.trim(),
            specificLocation: formData.specificLocation.trim(),
            additionalDetails: formData.additionalDetails.trim(),
            image: imagePreviewUrl || getPlaceholderImage(formData.category), // Use preview URL as image source
        };

        addItem(newItem);
        onClose();
        showSuccessMessage(newItem);


        if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">{formData.itemType === 'lost' ? 'Report Lost Item' : formData.itemType === 'found' ? 'Report Found Item' : 'Report Item'}</h3>
                            <p className="text-gray-400 text-sm">{formData.itemType ? `Enter details for your ${formData.itemType} item below.` : 'Select item type and fill in the details below'}</p>
                        </div>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-900/50 border border-red-500 text-red-300 p-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5"/>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Item Type Selection & Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Item Type *</label>
                                <div className="flex gap-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="itemType" value="lost" checked={formData.itemType === 'lost'} onChange={handleChange} className="text-red-600 focus:ring-red-500" required />
                                        <span className="text-white">Lost Item</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="itemType" value="found" checked={formData.itemType === 'found'} onChange={handleChange} className="text-green-600 focus:ring-green-500" required />
                                        <span className="text-white">Found Item</span>
                                    </label>
                                </div>
                            </div>
                            <FormInput label="Date *" name="date" type="date" value={formData.date} onChange={handleChange} required />
                        </div>

                        {/* Title and Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Item Title *" name="title" placeholder="e.g., Black Backpack" value={formData.title} onChange={handleChange} required />
                            <FormSelect label="Category *" name="category" options={CATEGORIES} value={formData.category} onChange={handleChange} required />
                        </div>

                        {/* Location and Specific Location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormSelect label="General Location *" name="location" options={LOCATIONS} value={formData.location} onChange={handleChange} required />
                            <FormInput label="Specific Location" name="specificLocation" placeholder="e.g., Room 302, Bench near pond" value={formData.specificLocation} onChange={handleChange} />
                        </div>

                        {/* Description */}
                        <FormTextarea label="Description *" name="description" placeholder="Provide detailed description of the item, when you lost/found it, any identifying features..." value={formData.description} onChange={handleChange} required />
                        
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Item Image (Optional)</label>
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <input type="file" name="imageFile" accept="image/*" className="hidden" id="imageInput" onChange={handleChange} />
                                <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center">
                                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-gray-400">Click to upload image or drag and drop</p>
                                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                                </label>
                            </div>
                            {imagePreviewUrl && (
                                <div className="mt-3 flex items-center gap-3">
                                    <img src={imagePreviewUrl} className="w-20 h-20 object-cover rounded-lg border border-slate-600" alt="Image Preview" />
                                    <span className="text-sm text-gray-400">Image selected.</span>
                                </div>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Contact Email *" name="contact" type="email" placeholder="your.email@example.com" value={formData.contact} onChange={handleChange} required />
                            <FormInput label="Phone Number" name="phone" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={handleChange} />
                        </div>

                        {/* Additional Details */}
                        <FormTextarea label="Additional Details" name="additionalDetails" placeholder="Any other relevant information..." value={formData.additionalDetails} onChange={handleChange} />

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-slate-700">
                            <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                                Cancel
                            </button>
                            <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 font-semibold">
                                <CheckCircle className="w-5 h-5 inline-block mr-2" />Submit Report
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Simple reusable form components
const FormInput = ({ label, name, type = 'text', placeholder = '', value, onChange, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <input 
            type={type} 
            name={name} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            required={required}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
        />
    </div>
);

const FormSelect = ({ label, name, options, value, onChange, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <select 
            name={name} 
            value={value} 
            onChange={onChange} 
            required={required}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
        >
            <option value="" disabled>Select {label.replace('*', '').trim()}</option>
            {options.map(opt => <option key={opt} value={opt} className="bg-slate-700">{opt}</option>)}
        </select>
    </div>
);

const FormTextarea = ({ label, name, placeholder = '', value, onChange, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">{label}</label>
        <textarea 
            name={name} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            required={required}
            rows="3" 
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none outline-none"
        ></textarea>
    </div>
);


// --- MAIN APPLICATION COMPONENT ---

const App = () => {
    // State for main data and filtering
    const [items, setItems] = useLocalStorageState('lostAndFoundItems', initialItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);

    // State for modals
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Filter Logic
    const filteredItems = useMemo(() => {
        return items
            .filter(item => {
                const queryMatch = searchTerm.toLowerCase() === '' ||
                    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.category.toLowerCase().includes(searchTerm.toLowerCase());

                const categoryMatch = !selectedCategory || item.category === selectedCategory;
                const locationMatch = !selectedLocation || item.location === selectedLocation;
                const statusMatch = !selectedStatus || item.status === selectedStatus;

                return queryMatch && categoryMatch && locationMatch && statusMatch;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [items, searchTerm, selectedCategory, selectedLocation, selectedStatus]);

    // Derived Counts
    const lostCount = useMemo(() => filteredItems.filter(i => i.status === 'lost').length, [filteredItems]);
    const foundCount = useMemo(() => filteredItems.filter(i => i.status === 'found').length, [filteredItems]);
    const recentItems = useMemo(() => filteredItems.slice(0, 5), [filteredItems]);

    // Handlers
    const toggleFilter = useCallback((key, value, setter) => {
        setter(prev => (prev === value ? null : value));
    }, []);

    const addItem = useCallback((newItem) => {
        setItems(prev => [newItem, ...prev]);
    }, [setItems]);
    
    const openReportModal = useCallback((presetType = null) => {
        setIsReportModalOpen(true);
        // Pre-fill type if provided
        if (presetType) {
            // Logic handled within ReportFormModal on open/close
        }
    }, []);

    const closeReportModal = useCallback(() => setIsReportModalOpen(false), []);
    const openItemDetailModal = useCallback((item) => setSelectedItem(item), []);
    const closeItemDetailModal = useCallback(() => setSelectedItem(null), []);
    
    // Keyboard shortcut for closing modals
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (selectedItem) closeItemDetailModal();
                if (isReportModalOpen) closeReportModal();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, isReportModalOpen, closeItemDetailModal, closeReportModal]);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <div className="grid grid-cols-[4rem_1fr_20rem] h-screen max-lg:grid-cols-[1fr_20rem] max-sm:grid-cols-1">
            <Sidebar />
                {/* Main Content */}
                <main className="p-6 flex flex-col gap-6 overflow-y-auto max-sm:order-2 bg-black">
                    
                    {/* Search Bar & Report Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-4 bg-slate-800 border border-slate-700 shadow-xl gap-4 sticky top-0 z-10">
                        <div className="flex items-center gap-3 flex-1 w-full max-w-full">
                            <div className="relative flex-1">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="Search for lost or found items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg outline-none text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => openReportModal('lost')}
                            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-xl shadow-red-500/20"
                        >
                            <AlertTriangle className="w-5 h-5 inline-block mr-2" />Report Lost Item
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
                        <div className="space-y-6">
                            
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-blue-400"><Tag /> Category</h4>
                                <div className="flex flex-wrap gap-3">
                                    {CATEGORIES.map(category => (
                                        <FilterButton 
                                            key={category}
                                            label={category}
                                            value={category}
                                            isSelected={selectedCategory === category}
                                            onClick={() => toggleFilter('category', category, setSelectedCategory)}
                                            activeColor="bg-blue-600"
                                            hoverColor="hover:border-blue-500/50"
                                            shadowColor="hover:shadow-blue-500/20"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-green-400"><MapPin /> Location</h4>
                                <div className="flex flex-wrap gap-3">
                                    {LOCATIONS.map(location => (
                                        <FilterButton 
                                            key={location}
                                            label={location}
                                            value={location}
                                            isSelected={selectedLocation === location}
                                            onClick={() => toggleFilter('location', location, setSelectedLocation)}
                                            activeColor="bg-green-600"
                                            hoverColor="hover:border-green-500/50"
                                            shadowColor="hover:shadow-green-500/20"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-purple-400"><List /> Status</h4>
                                <div className="flex flex-wrap gap-3">
                                    {STATUSES.map(({ label, value }) => (
                                        <FilterButton 
                                            key={value}
                                            label={label}
                                            value={value}
                                            isSelected={selectedStatus === value}
                                            onClick={() => toggleFilter('status', value, setSelectedStatus)}
                                            activeColor={value === 'lost' ? 'bg-red-600' : 'bg-green-600'}
                                            hoverColor={value === 'lost' ? 'hover:border-red-500/50' : 'hover:border-green-500/50'}
                                            shadowColor={value === 'lost' ? 'hover:shadow-red-500/20' : 'hover:shadow-green-500/20'}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Item Grid */}
                    <ItemGrid 
                        items={filteredItems} 
                        openModal={openItemDetailModal}
                        totalCount={filteredItems.length}
                    />
                </main>

                {/* Right Sidebar */}
                <RightSidebar 
                    lostCount={lostCount} 
                    foundCount={foundCount} 
                    recentItems={recentItems}
                    openReportModal={openReportModal}
                />
            </div>

            {/* Modals */}
            <ItemModal 
                item={selectedItem} 
                onClose={closeItemDetailModal} 
            />
            <ReportFormModal 
                isOpen={isReportModalOpen} 
                onClose={closeReportModal}
                addItem={addItem}
            />
        </div>
    );
};

export default App;
