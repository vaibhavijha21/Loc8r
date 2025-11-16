import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Mail, MapPin, Tag, Calendar, X, Search, Plus, List, AlertTriangle, CheckCircle, Smartphone, Map, LayoutGrid, ChevronDown } from 'lucide-react';
import Sidebar from './Sidebar';
import apiService from '../services/api';
import { Menu } from "lucide-react";


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
const FilterButton = ({ label, value, isSelected, onClick }) => {
    return (
        <button
            className={`px-4 py-2 rounded-lg transition-all duration-200 text-md font-semibold font-medium ${
                isSelected 
                    ? 'bg-[#1e3a5f] text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
            }`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

const ItemCard = ({ item, openModal }) => {
    const badgeColor = item.Item_status === "lost" ? "bg-red-600" : "bg-[#1e3a5f]";
    const formattedDate = new Date(item.Lost_Date || item.Reported_Date || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

    return (
        <div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => openModal(item)}
        >
            <div className="p-6 space-y-2">
                <div className="w-full h-40 overflow-hidden rounded-md mb-3 bg-gray-50 flex items-center justify-center">
                    { (item.ThumbUrl || (item.images && item.images.length)) ? (
                        <img
                            src={apiService.getUploadUrl(item.ThumbUrl ? item.ThumbUrl : (item.images[0] && item.images[0].Url))}
                            className="w-full h-full object-cover"
                            alt={item.Item_name}
                        />
                    ) : (
                        <img src={getPlaceholderImage('Other')} className="w-full h-full object-cover" alt={item.Item_name} />
                    )}
                </div>
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-gray-900 text-lg flex-1 leading-tight mb-1">{item.Item_name}</h3>
                    <span className={`${badgeColor} text-white text-sm font-semibold px-3 py-1.5 rounded capitalize flex-shrink-0`}>
                        {item.Item_status}
                    </span>
                </div>
                <p className="text-gray-600 text-base leading-relaxed line-clamp-2">{item.Item_description}</p>
                <div className="space-y-2 text-sm text-gray-500 pt-2">
                    <div><span className=" font-bold text-gray-900">Category:</span> <span className="text-gray-600">{item.Item_category || 'Item'}</span></div>
                    <div><span className=" font-bold text-gray-900">Location:</span> <span className="text-gray-600">{item.PossibleLocation || item.Location || 'Unknown'}</span></div>
                    <div><span className="font-bold text-gray-900">Date:</span> <span className="text-gray-600">{formattedDate}</span></div>
                </div>
            </div>
        </div>
    );
};

const ItemGrid = ({ items, openModal }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.length > 0 ? (
            items.map(item => (
                <ItemCard key={item.ItemID} item={item} openModal={openModal} />
            ))
        ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No items match your criteria</h3>
                <p className="text-gray-500">Try removing some filters or broadening your search term.</p>
            </div>
        )}
    </div>
);


const ItemModal = ({ item, onClose, onOpenClaim }) => {
    if (!item) return null;

    const statusColor = item.Item_status === "lost" ? "text-red-400 bg-red-500/10" : "text-green-400 bg-green-500/10";
    const statusIcon = item.Item_status === "lost" ? AlertTriangle : CheckCircle;
    const formattedDate = new Date(item.Lost_Date || item.Reported_Date || new Date()).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const IconComponent = statusIcon;

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-100 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl transition-all duration-300">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-700 pb-4">
                        <h3 className="text-3xl font-extrabold text-gray-700">{item.Item_name}</h3>
                        <button onClick={onClose} className="text-gray-700 hover:text-gray-900 text-2xl transition-colors">
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
                            <DetailPill label="Category" value="Item" color="text-purple-700 bg-purple-700/10" Icon={Tag} />
                            <DetailPill label="Location" value={item.PossibleLocation || item.Location || 'Unknown'} color="text-green-700 bg-green-700/10" Icon={MapPin} />
                            <DetailPill label="Date" value={formattedDate} color="text-blue-700 bg-blue-700/10" Icon={Calendar} />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><List className="w-4 h-4"/> Detailed Description</label>
                            <p className="text-gray-700 bg-slate-100 p-4 rounded-lg border border-slate-600 text-sm font-semibold">{item.Item_description}</p>
                        </div>
                        {item.Item_status === 'found' && item.FoundID && (
                            <div className="pt-4 border-t border-slate-700">
                                <button
                                    onClick={() => onOpenClaim(item)}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors duration-200 font-semibold"
                                >
                                    Claim this item
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailPill = ({ label, value, color, Icon }) => (
    <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider block">{label}</label>
        <div className={`flex items-center gap-2 ${color} p-3 rounded-lg border border-slate-700/50`}>
            <Icon className="w-4 h-4" />
            <span className="text-gray-700 capitalize">{value}</span>
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
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');

    useEffect(() => {
        const defaults = {
            Item_name: '',
            Item_description: '',
            Item_status: '',
            Lost_Date: new Date().toISOString().split('T')[0],
            PossibleLocation: '',
            Reported_Date: new Date().toISOString().split('T')[0],
            Location: '',
            images: []
        };

        if (!isOpen) {
            setFormData(defaults);
            setError('');
            setImagePreviewUrl('');
            return;
        }

        // Modal opened: try to prefill contact info from localStorage user
        try {
            const userJson = localStorage.getItem('user');
            let contactEmail = '';
            let phoneNumber = '';
            if (userJson) {
                const u = JSON.parse(userJson);
                contactEmail = u.Email || u.email || u.Contact || u.contact || '';
                phoneNumber = u.Phone || u.phone || u.ContactNumber || u.contact_number || '';
            }
            setFormData(prev => ({ ...defaults, Contact_Email: contactEmail, Phone_Number: phoneNumber }));
            setError('');
            setImagePreviewUrl('');
        } catch (err) {
            console.error('Failed to prefill contact info:', err);
            setFormData(defaults);
            setError('');
            setImagePreviewUrl('');
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const fileArray = Array.from(files);
            setFormData(prev => ({ ...prev, images: fileArray }));
            // Create preview URL for the first image
            if (fileArray.length > 0) {
                const previewUrl = URL.createObjectURL(fileArray[0]);
                setImagePreviewUrl(previewUrl);
            }
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
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
            <div className="bg-slate-100 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-700 pb-3">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-1">Report Item</h3>
                            <p className="text-gray-700 text-sm">Enter details for your item below.</p>
                        </div>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900 text-2xl transition-colors">
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
                            <label className="text-sm font-medium text-gray-700">Item Type *</label>
                            <div className="flex gap-4 p-3 bg-slate-100 rounded-lg border border-slate-900">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="Item_status" value="lost" checked={formData.Item_status === 'lost'} onChange={handleChange} className="text-red-600 focus:ring-red-500" required />
                                    <span className="text-gray-700">Lost Item</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="Item_status" value="found" checked={formData.Item_status === 'found'} onChange={handleChange} className="text-green-600 focus:ring-green-500" required />
                                    <span className="text-gray-700">Found Item</span>
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
                            <label className="text-sm font-semibold text-gray-700">Item Images (Optional)</label>
                            <div style={{
                                border: '2px dashed #0f172a',
                                borderRadius: '0.5rem',
                                padding: '1.5rem',
                                textAlign: 'center',
                                minHeight: '250px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'border-color 0.3s',
                                cursor: 'pointer'
                            }} className="hover:border-blue-500">
                                <input type="file" name="images" accept="image/*" multiple style={{display: 'none'}} id="imageInput" onChange={handleChange} />
                                {imagePreviewUrl ? (
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
                                        <label htmlFor="imageInput" style={{cursor: 'pointer', fontSize: '0.875rem', color: '#3b82f6', fontWeight: 500}}>
                                            ✎ Click to change image
                                        </label>
                                    </div>
                                ) : (
                                    <label htmlFor="imageInput" style={{cursor: 'pointer', width: '100%'}}>
                                        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                            <div style={{fontSize: '2.5rem', marginBottom: '1rem'}}>📷</div>
                                            <p style={{color: '#9ca3af', fontWeight: 500}}>Click to upload images or drag and drop</p>
                                            <p style={{fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem'}}>PNG, JPG up to 5MB each</p>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormInput label="Contact Email" name="Contact_Email" type="email" placeholder="your.email@example.com" value={formData.Contact_Email || ''} onChange={handleChange} />
                            <FormInput label="Phone Number" name="Phone_Number" placeholder="+1 (555) 123-4567" value={formData.Phone_Number || ''} onChange={handleChange} />
                        </div>

                        {/* Additional Details */}
                        <FormTextarea label="Additional Details" name="Additional_Details" placeholder="Any other relevant information..." value={formData.Additional_Details || ''} onChange={handleChange} />

                        {/* Form Actions */}
                        <div className="flex gap-4 pt-6 border-t border-slate-700">
                            <button type="button" onClick={onClose} className="flex-1 bg-red-500 hover:bg-red-700 text-white py-3 rounded-lg transition-colors duration-200 font-medium">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 bg-blue-800 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors duration-200 font-semibold disabled:opacity-50">
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
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input 
            type={type} 
            name={name} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            required={required}
            className="w-full px-4 py-3 bg-slate-100 border border-gray-900 rounded-lg text-gray-700 placeholder-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
        />
    </div>
);

const FormTextarea = ({ label, name, placeholder = '', value, onChange, required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <textarea 
            name={name} 
            placeholder={placeholder} 
            value={value} 
            onChange={onChange} 
            required={required}
            rows="3" 
            className="w-full px-4 py-3 bg-slate-100 border border-slate-900 rounded-lg text-gray-700 placeholder-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none outline-none"
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
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // State for modals
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [claimTarget, setClaimTarget] = useState(null);
    const [claimMessage, setClaimMessage] = useState('');
    const [userName, setUserName] = useState('');

    // Load user name from localStorage
    useEffect(() => {
        try {
            const userJson = localStorage.getItem('user');
            if (userJson) {
                const user = JSON.parse(userJson);
                setUserName(user.User_name || user.name || user.Name || '');
            }
        } catch (err) {
            console.error('Failed to load user name:', err);
        }
    }, []);

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
    const totalReportedCount = useMemo(() => lostCount + foundCount, [lostCount, foundCount]);
    const [myReportsCount, setMyReportsCount] = useState(0);

    // Compute current user's reports by fetching item details (falls back if user id missing)
    useEffect(() => {
        const computeMyReports = async () => {
            try {
                const userJson = localStorage.getItem('user');
                if (!userJson) { setMyReportsCount(0); return; }
                const userObj = JSON.parse(userJson);
                const uid = userObj.UserID || userObj.id || userObj.UserId || userObj.userId || userObj.ID;
                if (!uid) { setMyReportsCount(0); return; }

                const checks = await Promise.allSettled(filteredItems.map(async (it) => {
                    try {
                        const data = await apiService.getItem(it.ItemID);
                        const lost = data.lost;
                        const found = data.found;
                        return (lost && (lost.UserID == uid)) || (found && (found.UserID == uid));
                    } catch (e) {
                        return false;
                    }
                }));

                const count = checks.reduce((acc, r) => acc + ((r.status === 'fulfilled' && r.value) ? 1 : 0), 0);
                setMyReportsCount(count);
            } catch (err) {
                console.error('Failed to compute my reports', err);
                setMyReportsCount(0);
            }
        };

        if (filteredItems && filteredItems.length) computeMyReports();
        else setMyReportsCount(0);
    }, [filteredItems]);

    // Handlers
    const toggleFilter = useCallback((key, value, setter) => {
        setter(prev => (prev === value ? null : value));
    }, []);

    const openReportModal = useCallback((presetType = null) => {
        setIsReportModalOpen(true);
    }, []);

    const closeReportModal = useCallback(() => setIsReportModalOpen(false), []);
    const openClaimModal = useCallback((item) => {
        setClaimTarget(item);
        setClaimMessage('');
        setIsClaimModalOpen(true);
    }, []);
    const closeClaimModal = useCallback(() => {
        setIsClaimModalOpen(false);
        setClaimTarget(null);
        setClaimMessage('');
    }, []);
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
                FoundID: data.found ? data.found.FoundID : (item.FoundID || null),
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

    const submitClaim = useCallback(async () => {
        if (!claimTarget || !claimTarget.FoundID) return;
        try {
            await apiService.submitClaim(claimTarget.FoundID, { message: claimMessage.trim() });
            alert('✅ Claim submitted to admin.');
            closeClaimModal();
        } catch (err) {
            console.error('Failed to submit claim', err);
            alert(err.message || 'Failed to submit claim');
        }
    }, [claimTarget, claimMessage, closeClaimModal]);
    
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
                if (isClaimModalOpen) closeClaimModal();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedItem, isReportModalOpen, isClaimModalOpen, closeItemDetailModal, closeReportModal, closeClaimModal]);

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
        <div className="min-h-screen bg-gray-100 bg-opacity-10 font-sans">
            <div className="flex h-screen">
                <Sidebar 
                    onLogout={handleLogout} 
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    openReportModal={openReportModal}
                />
                
                {/* Main Content */}
                <main 
                    className={`flex-1 overflow-y-auto bg-slate-100 transition-opacity duration-300 ${sidebarOpen ? 'opacity-50' : 'opacity-100'}`}
                    onClick={() => sidebarOpen && setSidebarOpen(false)}
                >
                    <div className="max-w-7xl mx-auto px-8 py-6 space-y-6" onClick={(e) => e.stopPropagation()}>
                        {/* Header with Dashboard title and sidebar toggle */}
                        <div className="flex items-center gap-3 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
                                    aria-label="Open sidebar"
                                >
                                    <Menu className="w-8 h-8 text-gray-700" />
                                </button>
                                {userName ? `Loc8r: ${userName} detected \uD83D\uDD0D` : 'Dashboard'}
                            </h1>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-7xl">
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                                <div className="text-5xl font-bold text-red-600 mb-2">{lostCount}</div>
                                <div className="text-base text-gray-600 font-medium">Lost Items</div>
                            </div>
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                                <div className="text-5xl font-bold text-[#1e3a5f] mb-2">{foundCount}</div>
                                <div className="text-base text-gray-600 font-medium">Found Items</div>
                            </div>
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                                <div className="text-5xl font-bold text-green-600 mb-2">{totalReportedCount}</div>
                                <div className="text-base text-gray-600 font-medium">Items Reported</div>
                            </div>
                            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                                <div className="text-5xl font-bold text-indigo-600 mb-2">{myReportsCount}</div>
                                <div className="text-base text-gray-600 font-medium">My Reports</div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="max-w-6xl">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1 max-w-7xl">
                                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                    <input 
                                        type="text" 
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg outline-none text-gray-900 placeholder-gray-400 focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => openReportModal()}
                                        className="px-4 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                                        aria-label="Report Item"
                                    >
                                        Report Item
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="max-w-6xl space-y-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium  text-gray-700">Status:</span>
                                    <div className="flex gap-2">
                                        <FilterButton 
                                            label="All"
                                            value="all"
                                            isSelected={!selectedStatus}
                                            onClick={() => setSelectedStatus(null)}
                                        />
                                        <FilterButton 
                                            label="Lost"
                                            value="lost"
                                            isSelected={selectedStatus === 'lost'}
                                            onClick={() => toggleFilter('status', 'lost', setSelectedStatus)}
                                        />
                                        <FilterButton 
                                            label="Found"
                                            value="found"
                                            isSelected={selectedStatus === 'found'}
                                            onClick={() => toggleFilter('status', 'found', setSelectedStatus)}
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Category:</span>
                                    <div className="relative">
                                        <select
                                            value={selectedCategory || ''}
                                            onChange={(e) => setSelectedCategory(e.target.value || null)}
                                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-md font-semibold text-gray-700 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20"
                                        >
                                            <option value="">All Categories</option>
                                            {CATEGORIES.map(cat => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-medium text-gray-700">Location:</span>
                                    <div className="relative">
                                        <select
                                            value={selectedLocation || ''}
                                            onChange={(e) => setSelectedLocation(e.target.value || null)}
                                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 font-semibold text-md text-gray-700 focus:outline-none focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20"
                                        >
                                            <option value="">All Locations</option>
                                            {LOCATIONS.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Item Grid */}
                        <div className="max-w-7xl">
                            <ItemGrid 
                                items={filteredItems} 
                                openModal={openItemDetailModal}
                            />
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <ItemModal 
                item={selectedItem} 
                onClose={closeItemDetailModal}
                onOpenClaim={openClaimModal}
            />
            <ReportFormModal 
                isOpen={isReportModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"></div>
)} 
                onClose={closeReportModal}
                addItem={() => {}} // This will be handled by the form submission
            />
            {isClaimModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-800 rounded-xl max-w-lg w-full border border-slate-700 shadow-2xl">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">Claim Item</h3>
                                <button onClick={closeClaimModal} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                <p className="text-gray-300">
                                    You are claiming: <span className="font-semibold text-white">{claimTarget?.Item_name}</span>
                                </p>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Message to admin (optionally include a link as proof)</label>
                                    <textarea
                                        value={claimMessage}
                                        onChange={(e) => setClaimMessage(e.target.value)}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none outline-none"
                                        placeholder="Describe how you can verify ownership (unique marks, serial no., or add a link to proof)."
                                    ></textarea>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button onClick={closeClaimModal} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg">
                                        Cancel
                                    </button>
                                    <button onClick={submitClaim} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
                                        Submit Claim
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BackendLostAndFoundDashboard;