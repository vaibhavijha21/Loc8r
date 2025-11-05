import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Mail, MapPin, Tag, Calendar, X, Search, Plus, List, AlertTriangle, CheckCircle, Smartphone, Map } from 'lucide-react';
import Sidebar from './Sidebar';
import apiService from '../services/api';

// Constants
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

// Custom hook for local storage persistence
const useLocalStorageState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error("Error reading localStorage key " + key + ":", error);
            return defaultValue;
        }
    });

    const prevStateRef = useRef();

    useEffect(() => {
        // Only update localStorage if state actually changed
        const currentStateString = JSON.stringify(state);
        if (prevStateRef.current !== currentStateString) {
            try {
                localStorage.setItem(key, currentStateString);
                prevStateRef.current = currentStateString;
            } catch (error) {
                console.error("Error writing to localStorage key " + key + ":", error);
            }
        }
    }, [key, state]);

    return [state, setState];
};

// Nested Components
const FilterButton = ({ label, value, isSelected, onClick, activeColor, hoverColor, shadowColor }) => {
    const selectedClasses = `${activeColor} border-current shadow-lg ring-2 ring-offset-2 ring-offset-slate-900/50 ring-opacity-50`;
    const unselectedClasses = `bg-slate-700 hover:bg-slate-600 border-slate-700 ${hoverColor} ${shadowColor}`;
    const classes = `px-4 py-2 text-white rounded-lg transition-all duration-200 border text-sm flex-shrink-0 font-medium`;

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
    const badgeColor = item.Item_status === "lost" ? "bg-red-600" : "bg-green-600";
    const badgeIcon = item.Item_status === "lost" ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />;
    const formattedDate = new Date(item.Lost_Date || item.Reported_Date || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div
            className="bg-gray-700 rounded-xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => openModal(item)}
        >
            <div className="relative">
                <div className="w-full h-48 overflow-hidden">
                    {item.ThumbUrl ? (
                        <img
                            src={apiService.getUploadUrl(item.ThumbUrl)}
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                            alt={item.Item_name}
                        />
                    ) : (
                        <img
                            src={getPlaceholderImage('Other')}
                            className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                            alt={item.Item_name}
                        />
                    )}
                </div>
                <div className={`absolute top-3 right-3 ${badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-md capitalize`}>
                    {badgeIcon}
                    {item.Item_status}
                </div>
                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                    {formattedDate}
                </div>
            </div>
            <div className="p-4 space-y-3">
                <h3 className="font-bold text-white text-lg line-clamp-1">{item.Item_name}</h3>
                <p className="text-gray-300 text-sm line-clamp-2">{item.Item_description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{item.PossibleLocation || item.Location || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">Item</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ItemGrid = ({ items, openModal, totalCount }) => (
    <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-black">All Items</h2>
            <div className="flex items-center font-bold gap-2 text-sm text-gray-900">
                <span className="font-bold text-blue-900">{totalCount}</span> item(s) reported
            </div>
        </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 bg-gray-100 border border-black shadow-lg  p-6 rounded-xl">
            {items.length > 0 ? (
                items.map(item => (
                    <ItemCard key={item.ItemID} item={item} openModal={openModal} />
                ))
            ) : (
                <div className="col-span-full text-center py-12 bg-slate-800 rounded-xl border border-slate-700">
                    <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No items match your criteria</h3>
                    <p className="text-gray-500">Try removing some filters or broadening your search term.</p>
                </div>
            )}
        </div>
    </div>
);

const RightSidebar = ({ lostCount, foundCount, recentItems, openReportModal }) => (
    <aside className="bg-gray-900 p-6 border-l border-gray-700 overflow-y-auto max-sm:order-1">
        <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-blue-500/20">
                <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Loc8r</h3>
            <p className="text-sm text-gray-300">Real-Time Overview</p>
        </div>

        <div className=" mb-8 flex flex-row gap-7 max-sm:flex-col ">
            <div className="flex-1 bg-gradient-to-br from-red-500/20 to-red-600/30 border border-red-400/40 rounded-xl p-4 text-center shadow-lg hover:shadow-red-500/25 transition-shadow">
                <div className="text-3xl font-bold text-red-400">{lostCount}</div>
                <div className="text-sm text-red-300 font-medium ">Lost Items </div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-500/20 to-green-600/30 border border-green-400/40 rounded-xl p-4 text-center shadow-lg hover:shadow-green-500/25 transition-shadow">
                <div className="text-3xl font-bold text-green-400">{foundCount}</div>
                <div className="text-sm text-green-300 font-medium ">Found Items</div>
            </div>
        </div>

        <button
            onClick={() => openReportModal('found')}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/25"
        >
            <Plus className="w-5 h-5" />
            Report Item
        </button>

        <div className="mt-8">
            <h4 className="font-semibold text-white text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
                Recent Activity
            </h4>
            <div className="space-y-4 text-sm">
                {recentItems.map(item => (
                    <div key={item.ItemID} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:shadow-md hover:bg-gray-750 transition-all">
                        <span className={`${item.Item_status === 'lost' ? 'text-red-400' : 'text-green-400'} pt-1`}>
                            {item.Item_status === 'lost' ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </span>
                        <div>
                            <p className="text-white font-medium line-clamp-1">{item.Item_name}</p>
                            <p className="text-gray-400 text-xs capitalize">{item.Item_status} in {item.PossibleLocation || item.Location || 'Unknown'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </aside>
);

const ItemModal = ({ item, onClose }) => {
    if (!item) return null;

    const statusColor = item.Item_status === "lost" ? "text-red-400 bg-red-500/10" : "text-green-400 bg-green-500/10";
    const statusIcon = item.Item_status === "lost" ? AlertTriangle : CheckCircle;
    const formattedDate = new Date(item.Lost_Date || item.Reported_Date || new Date()).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const IconComponent = statusIcon;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl transition-all duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-700 pb-4">
                        <h3 className="text-3xl font-extrabold text-white">{item.Item_name}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl transition-colors">
                            <X className="w-7 h-7" />
                        </button>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="w-full h-80 overflow-hidden rounded-lg border-2 border-slate-700">
                                    {item.images && item.images.length ? (
                                        <img
                                            src={apiService.getUploadUrl(item.images[0].Url)}
                                            className="w-full h-full object-cover"
                                            alt={item.Item_name}
                                        />
                                    ) : (
                                        <img 
                                            src={getPlaceholderImage('Other')} 
                                            className="w-full h-full object-cover" 
                                            alt={item.Item_name}
                                        />
                                    )}
                                </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                            <DetailPill label="Status" value={item.Item_status} color={statusColor} Icon={IconComponent} />
                            <DetailPill label="Category" value="Item" color="text-purple-400 bg-purple-500/10" Icon={Tag} />
                            <DetailPill label="Location" value={item.PossibleLocation || item.Location || 'Unknown'} color="text-green-400 bg-green-500/10" Icon={MapPin} />
                            <DetailPill label="Date" value={formattedDate} color="text-blue-400 bg-blue-500/10" Icon={Calendar} />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400 flex items-center gap-2"><List className="w-4 h-4"/> Detailed Description</label>
                            <p className="text-white bg-slate-700 p-4 rounded-lg border border-slate-600 text-sm">{item.Item_description}</p>
                        </div>
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

const ReportFormModal = ({ isOpen, onClose, addItem }) => {
    const [formData, setFormData] = useState({
        Item_name: '', 
        Item_description: '', 
        Item_status: '', 
        Lost_Date: new Date().toISOString().split('T')[0], 
        PossibleLocation: '', 
        Reported_Date: new Date().toISOString().split('T')[0], 
        Location: '',
        images: []
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                Item_name: '', 
                Item_description: '', 
                Item_status: '', 
                Lost_Date: new Date().toISOString().split('T')[0], 
                PossibleLocation: '', 
                Reported_Date: new Date().toISOString().split('T')[0], 
                Location: '',
                images: []
            });
            setError('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, images: Array.from(files) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const requiredFields = ['Item_name', 'Item_description', 'Item_status'];
        const missingFields = requiredFields.filter(field => !formData[field].trim());

        if (missingFields.length > 0) {
            setError("Please fill out all required fields (*).");
            setLoading(false);
            return;
        }

        try {
            const response = await apiService.createItem(formData);
            alert("✅ Item reported successfully!");
            onClose();
            // Refresh the items list
            window.location.reload();
        } catch (error) {
            setError(error.message || "Failed to create item");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">Report Item</h3>
                            <p className="text-gray-400 text-sm">Enter details for your item below.</p>
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

                        {/* Item Type Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Item Type *</label>
                            <div className="flex gap-4 p-3 bg-slate-700 rounded-lg border border-slate-600">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="Item_status" value="lost" checked={formData.Item_status === 'lost'} onChange={handleChange} className="text-red-600 focus:ring-red-500" required />
                                    <span className="text-white">Lost Item</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="Item_status" value="found" checked={formData.Item_status === 'found'} onChange={handleChange} className="text-green-600 focus:ring-green-500" required />
                                    <span className="text-white">Found Item</span>
                                </label>
                            </div>
                        </div>

                        {/* Title and Description */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Item Name *" name="Item_name" placeholder="e.g., Black Backpack" value={formData.Item_name} onChange={handleChange} required />
                            <FormInput label="Date *" name={formData.Item_status === 'lost' ? 'Lost_Date' : 'Reported_Date'} type="date" value={formData.Item_status === 'lost' ? formData.Lost_Date : formData.Reported_Date} onChange={handleChange} required />
                        </div>

                        <FormTextarea label="Description *" name="Item_description" placeholder="Provide detailed description of the item..." value={formData.Item_description} onChange={handleChange} required />

                        {/* Location */}
                        <FormInput label={formData.Item_status === 'lost' ? 'Possible Location' : 'Found Location'} name={formData.Item_status === 'lost' ? 'PossibleLocation' : 'Location'} placeholder="e.g., Library, Cafeteria" value={formData.Item_status === 'lost' ? formData.PossibleLocation : formData.Location} onChange={handleChange} />

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Item Images (Optional)</label>
                            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                                <input type="file" name="images" accept="image/*" multiple className="hidden" id="imageInput" onChange={handleChange} />
                                <label htmlFor="imageInput" className="cursor-pointer flex flex-col items-center">
                                    <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-gray-400">Click to upload images or drag and drop</p>
                                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
                                </label>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-slate-700">
                            <button type="button" onClick={onClose} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50">
                                {loading ? 'Submitting...' : 'Submit Report'}
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

// Main Application Component
const BackendLostAndFoundDashboard = ({ setIsAuthenticated }) => {
    // State for main data and filtering
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for modals
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Load items from backend
    useEffect(() => {
        const loadItems = async () => {
            try {
                setLoading(true);
                const data = await apiService.getItems();
                setItems(data);
            } catch (error) {
                console.error('Failed to load items:', error);
                alert('Failed to load items. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    // Filter Logic
    const filteredItems = useMemo(() => {
        return items
            .filter(item => {
                const q = searchTerm.toLowerCase();
                const queryMatch = q === '' ||
                    (item.Item_name && item.Item_name.toLowerCase().includes(q)) ||
                    (item.Item_description && item.Item_description.toLowerCase().includes(q)) ||
                    (item.PossibleLocation && item.PossibleLocation.toLowerCase().includes(q)) ||
                    (item.Location && item.Location.toLowerCase().includes(q));

                const statusMatch = !selectedStatus || item.Item_status === selectedStatus;

                const categoryMatch = !selectedCategory || (
                    (item.Item_category && item.Item_category.toLowerCase() === selectedCategory.toLowerCase()) ||
                    (item.Item_name && item.Item_name.toLowerCase().includes(selectedCategory.toLowerCase())) ||
                    (item.Item_description && item.Item_description.toLowerCase().includes(selectedCategory.toLowerCase()))
                );

                const locationMatch = !selectedLocation || (
                    (item.PossibleLocation && item.PossibleLocation.toLowerCase() === selectedLocation.toLowerCase()) ||
                    (item.Location && item.Location.toLowerCase() === selectedLocation.toLowerCase()) ||
                    (item.PossibleLocation && item.PossibleLocation.toLowerCase().includes(selectedLocation.toLowerCase())) ||
                    (item.Location && item.Location.toLowerCase().includes(selectedLocation.toLowerCase()))
                );

                return queryMatch && statusMatch && categoryMatch && locationMatch;
            })
            .sort((a, b) => new Date(b.Lost_Date || b.Reported_Date || 0) - new Date(a.Lost_Date || a.Reported_Date || 0));
    }, [items, searchTerm, selectedStatus, selectedCategory, selectedLocation]);

    // Derived Counts
    const lostCount = useMemo(() => filteredItems.filter(i => i.Item_status === 'lost').length, [filteredItems]);
    const foundCount = useMemo(() => filteredItems.filter(i => i.Item_status === 'found').length, [filteredItems]);
    const recentItems = useMemo(() => filteredItems.slice(0, 5), [filteredItems]);

    // Handlers
    const toggleFilter = useCallback((key, value, setter) => {
        setter(prev => (prev === value ? null : value));
    }, []);

    const openReportModal = useCallback((presetType = null) => {
        setIsReportModalOpen(true);
    }, []);

    const closeReportModal = useCallback(() => setIsReportModalOpen(false), []);
    const openItemDetailModal = useCallback(async (item) => {
        try {
            // fetch full details (images, claims, lost/found info)
            const data = await apiService.getItem(item.ItemID);
            // backend returns { item, lost, found, images, claims }
            const combined = {
                ...data.item,
                Lost_Date: data.lost ? data.lost.Lost_Date : data.item.Lost_Date,
                Reported_Date: data.found ? data.found.Reported_Date : data.item.Reported_Date,
                PossibleLocation: data.lost ? data.lost.PossibleLocation : data.item.PossibleLocation,
                Location: data.found ? data.found.Location : data.item.Location,
                images: data.images || [],
                claims: data.claims || []
            };
            setSelectedItem(combined);
        } catch (err) {
            console.error('Failed to load item details', err);
            // fallback to minimal item
            setSelectedItem(item);
        }
    }, []);
    const closeItemDetailModal = useCallback(() => setSelectedItem(null), []);
    
    const handleLogout = useCallback(() => {
        apiService.clearToken();
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        window.location.href = '/';
    }, [setIsAuthenticated]);
    
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

    if (loading) {
        return (
            <div style={{ backgroundColor: '#40404dff' }} className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xl">Loading items...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            <div className="grid grid-cols-[4rem_1fr_20rem] h-screen max-lg:grid-cols-[1fr_20rem] max-sm:grid-cols-1">
                <Sidebar onLogout={handleLogout} />
                {/* Main Content */}
                <main className="p-6 flex flex-col gap-6 overflow-y-auto max-sm:order-2 bg-white">
                    
                    {/* Search Bar & Report Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-center rounded-xl p-4 bg-gray-800 border border-gray-300 shadow-lg gap-4 sticky top-0 z-10">
                        <div className="flex items-center gap-3 flex-1 w-full max-w-full">
                            <div className="relative flex-1">
                                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input 
                                    type="text" 
                                    placeholder="Search for lost or found items..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg outline-none text-black placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={() => openReportModal('lost')}
                            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            <AlertTriangle className="w-5 h-5 inline-block mr-2" />Report Lost Item
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-gray-100 rounded-xl p-6 border border-black shadow-lg">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-purple-700"><List /> Status</h4>
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
                            {/* Category Filter */}
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-blue-700"><Tag /> Category</h4>
                                <div className="flex flex-wrap gap-3">
                                    {CATEGORIES.map(cat => (
                                        <FilterButton
                                            key={cat}
                                            label={cat}
                                            value={cat}
                                            isSelected={selectedCategory === cat}
                                            onClick={() => toggleFilter('category', cat, setSelectedCategory)}
                                            activeColor={'bg-purple-600'}
                                            hoverColor={'hover:border-purple-500/50'}
                                            shadowColor={'hover:shadow-purple-500/20'}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div className="space-y-3">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-green-600"><MapPin /> Location</h4>
                                <div className="flex flex-wrap gap-3">
                                    {LOCATIONS.map(loc => (
                                        <FilterButton
                                            key={loc}
                                            label={loc}
                                            value={loc}
                                            isSelected={selectedLocation === loc}
                                            onClick={() => toggleFilter('location', loc, setSelectedLocation)}
                                            activeColor={'bg-blue-600'}
                                            hoverColor={'hover:border-blue-500/50'}
                                            shadowColor={'hover:shadow-blue-500/20'}
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
                addItem={() => {}} // This will be handled by the form submission
            />
        </div>
    );
};

export default BackendLostAndFoundDashboard;