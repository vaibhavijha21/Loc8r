// data.js

export const initialItems = [
  {
    id: 1,
    title: "Black Backpack",
    image: "https://genietravel.com/cdn/shop/files/13_c457f37a-da03-4025-bc90-0e405b21b44b.jpg?v=1720518555",
    description: "Lost near library",
    category: "Bags",
    location: "Square1",
    status: "lost",
    date: "2024-01-15",
    contact: "john.doe@email.com"
  },
  {
    id: 2,
    title: "Water Bottle",
    image: "https://oceanbottle.co/cdn/shop/products/OceanBottle_BOB_Front_Ocean-Blue_2048px_927b4df9-48ca-4e74-81e0-9de65cad057c.jpg?v=1661510139&width=720",
    description: "Found near cafeteria",
    category: "Bottle",
    location: "Turing",
    status: "found",
    date: "2024-01-14",
    contact: "jane.smith@email.com"
  },
  {
    id: 3,
    title: "Phone Charger",
    image: "https://img.freepik.com/free-photo/charger-usb-cable-type-c-white-isolated-background_58702-4501.jpg",
    description: "Lost lenovo charger in classroom",
    category: "Charger",
    location: "Explo",
    status: "lost",
    date: "2024-01-13",
    contact: "mike.wilson@email.com"
  },
  {
    id: 4,
    title: "ID Card",
    image: "https://northeastregistries.sfo2.digitaloceanspaces.com/wp-content/uploads/2022/01/22182207/identificationcard.jpg",
    description: "Found in parking lot",
    category: "IDCard",
    location: "Square1",
    status: "found",
    date: "2024-01-12",
    contact: "sarah.jones@email.com"
  },
  {
    id: 5,
    title: "Keys",
    image: "https://covenantsecurityequipment.com/cdn/shop/files/CSE-AS-ExtraKeys_700x700.png?v=1713479233",
    description: "Found in Square one first floor",
    category: "Keys",
    location: "Square1",
    status: "found",
    date: "2024-01-11",
    contact: "david.brown@email.com"
  },
  {
    id: 6,
    title: "Water Bottle",
    image: "https://oceanbottle.co/cdn/shop/files/Frame19_e1d4f3d4-12ac-4b4d-be96-20dca2604844.png?v=1730371025&width=720",
    description: "Found near cafeteria",
    category: "Bottle",
    location: "Turing",
    status: "found",
    date: "2024-01-10",
    contact: "emma.davis@email.com"
  },
  {
    id: 7,
    title: "Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Lost MacBook Pro in lecture hall",
    category: "Electronics",
    location: "Newton",
    status: "lost",
    date: "2024-01-09",
    contact: "alex.turner@email.com"
  },
  {
    id: 8,
    title: "Wallet",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    description: "Found in student center",
    category: "Personal",
    location: "DeMorgan",
    status: "found",
    date: "2024-01-08",
    contact: "lisa.garcia@email.com"
  }
];

export function getPlaceholderImage(category) {
  const placeholderImages = {
    'Bags': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Charger': 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Bottle': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'IDCard': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Keys': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Electronics': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Personal': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    'Other': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
  };
  
  return placeholderImages[category] || placeholderImages['Other'];
}

export const CATEGORIES = ["Bags", "Charger", "Bottle", "ID Card", "Phone", "Keys"];
export const LOCATIONS = ["Square1", "Turing", "Explo", "Newton", "DeMorgan", "Picasso", "Other"];
export const STATUSES = [
  { label: "Lost Items", value: "lost" },
  { label: "Found Items", value: "found" }
];
export const ALL_CATEGORIES = ["Bags", "Charger", "Bottle", "IDCard", "Phone", "Keys", "Electronics", "Personal", "Other"];

// Function to handle success message (DOM manipulation, isolated from components)
export function showSuccessMessage(itemData) {
  const notification = document.createElement("div");
  notification.className = "fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full";
  notification.style.animation = "slideInRight 0.3s forwards"; // Use CSS animation from HTML file
  notification.innerHTML = `
    <div class="flex items-center gap-3">
      <i class="bx bx-check-circle text-2xl"></i>
      <div>
        <h4 class="font-semibold">Item Reported Successfully!</h4>
        <p class="text-sm opacity-90">Your ${itemData.status} item "${itemData.title}" has been added to the system.</p>
      </div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s forwards";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}