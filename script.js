// JavaScript for the food delivery app

// =====================================================================================
// DATA: Food Items & Cart
// =====================================================================================

/**
 * @description Array of available food items.
 * Each item is an object with: id, name, image, description, price, category, badge (optional).
 */
const foodItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        image: 'images/Margherita-Pizza.png',
        description: 'Classic cheese and tomato pizza.',
        price: 12.99,
        category: 'Pizza',
        badge: 'Bestseller'
    },
    {
        id: 2,
        name: 'Cheeseburger',
        image: 'images/Cheeseburger.png',
        description: 'Beef patty with cheese, lettuce, and tomato.',
        price: 8.99,
        category: 'Burger'
    },
    {
        id: 3,
        name: 'Sushi Platter',
        image: 'images/Sushi Platter.png',
        description: 'Assorted sushi rolls and nigiri.',
        price: 18.50,
        category: 'Sushi'
    },
    {
        id: 4,
        name: 'Chocolate Cake',
        image: 'images/Chocolate Cake.png',
        description: 'Rich decadent chocolate cake slice.',
        price: 6.00,
        category: 'Dessert',
        badge: 'New'
    },
    {
        id: 5,
        name: 'Pepperoni Pizza',
        image: 'images/Pepperoni Pizza.png',
        description: 'Pizza with spicy pepperoni topping.',
        price: 14.99,
        category: 'Pizza'
    },
    {
        id: 6,
        name: 'Veggie Burger',
        image: 'images/Veggie Burger.png',
        description: 'Plant-based patty with fresh vegetables.',
        price: 9.50,
        category: 'Burger'
    },
    {
        id: 7,
        name: 'California Roll',
        image: 'images/California Roll.png',
        description: 'Crab meat, avocado, and cucumber.',
        price: 7.50,
        category: 'Sushi'
    },
    {
        id: 8,
        name: 'Tiramisu',
        image: 'images/Tiramisu.png',
        description: 'Classic Italian coffee-flavored dessert.',
        price: 7.00,
        category: 'Dessert'
    }
];

/**
 * @description Array to hold items currently in the shopping cart.
 * Loaded from localStorage. Initialized as empty and populated by `loadCart()`.
 */
let cart = [];

// =====================================================================================
// INITIALIZATION & DOMContentLoaded
// =====================================================================================

/**
 * @description Main event listener that fires when the HTML document is fully loaded.
 * Initializes page-specific functionalities and common features like dark mode and cart loading.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load cart data from localStorage. This is done early as other functions might depend on it.
    loadCart();

    // Apply dark mode if previously saved. This affects visual styling first.
    loadDarkModePreference();

    // Page-specific initializations based on elements present on the page.
    if (document.getElementById('food-items')) { // Checks if on Menu Page (index.html)
        populateCategoryFilters();     // Set up category filter options.
        renderMenuItems(foodItems);    // Display all food items initially.
        setupSearchListener();         // Enable search functionality.
        setupCategoryFilterListener(); // Enable category filtering.
    }

    if (document.getElementById('cart-items')) { // Checks if on Cart Page (cart.html)
        loadCartPage(); // Load and display cart contents.
    }

    // Update cart item count in the header (common to all pages).
    updateCartIcon();

    // Setup Dark Mode Toggle Button Listener (common to all pages).
    const darkModeToggleButton = document.getElementById('dark-mode-toggle');
    if (darkModeToggleButton) {
        darkModeToggleButton.addEventListener('click', toggleDarkMode);
    }
});

// =====================================================================================
// DARK MODE
// =====================================================================================

/**
 * @description Toggles dark mode on the website.
 * Updates the body class and saves the preference to localStorage.
 * Also updates the toggle button icon.
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkModeEnabled', isDarkMode);
    // Update toggle button text/icon if needed
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

function loadDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
    // Update toggle button text/icon based on loaded preference
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.textContent = darkModeEnabled ? '☀️' : '🌙';
    }
}

// =====================================================================================
// MENU PAGE (index.html) - Search, Filter, Display
// =====================================================================================

/**
 * @description Sets up the event listener for the search input field on the menu page.
 * Filters items by name (while respecting the current category filter) and re-renders the menu.
 */
function setupSearchListener() {
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            const activeCategory = document.getElementById('filter').value; // Get current category from select

            // Start with items matching the search term
            let filteredItems = foodItems.filter(item => item.name.toLowerCase().includes(searchTerm));

            // If a specific category (not 'all') is selected, further filter by that category
            if (activeCategory !== 'all') {
                filteredItems = filteredItems.filter(item => item.category === activeCategory);
            }
            renderMenuItems(filteredItems); // Re-render the menu with the combined filters
        });
    }
}

/**
 * @description Populates the category filter select dropdown with unique categories from `foodItems`.
 * Also adds an "All" option to allow users to see items from all categories.
 */
function populateCategoryFilters() {
    const filterSelect = document.getElementById('filter');
    if (!filterSelect) return; // Exit if the filter select element doesn't exist on the page

    // Create a unique list of categories from foodItems, and prepend "all".
    const categories = ['all', ...new Set(foodItems.map(item => item.category))];

    filterSelect.innerHTML = ''; // Clear any pre-existing options

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        // Capitalize the first letter of the category for display purposes
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        filterSelect.appendChild(option);
    });
}

/**
 * @description Sets up the event listener for the category filter select dropdown on the menu page.
 * Filters items by the selected category (while respecting the current search term) and re-renders the menu.
 */
function setupCategoryFilterListener() {
    const filterSelect = document.getElementById('filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', (event) => {
            const selectedCategory = event.target.value;
            const searchTerm = document.getElementById('search').value.toLowerCase(); // Get current search term

            let filteredItems;

            // Filter by the selected category
            if (selectedCategory === 'all') {
                filteredItems = foodItems; // If "All" is selected, start with all items
            } else {
                filteredItems = foodItems.filter(item => item.category === selectedCategory);
            }

            // If there's a search term, further filter the category-filtered list
            if (searchTerm) {
                filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(searchTerm));
            }
            renderMenuItems(filteredItems); // Re-render the menu with combined filters
        });
    }
}

/**
 * @description Renders the provided array of food items onto the menu page (index.html).
 * Clears any existing items first. If `itemsToRender` is empty, displays a message.
 * Handles the case where the master `foodItems` list might be empty.
 * @param {Array<Object>} itemsToRender - An array of food item objects to be displayed.
 */
function renderMenuItems(itemsToRender) {
    const foodItemsContainer = document.getElementById('food-items');
    if (!foodItemsContainer) return; // Exit if the main container for food items is not found

    foodItemsContainer.innerHTML = ''; // Clear any previously displayed items

    // If the array of items to render is empty, show an appropriate message.
    if (itemsToRender.length === 0) {
        if (foodItems.length === 0) { // Check if the master list is empty
            foodItemsContainer.innerHTML = '<p class="empty-menu-message">No food items are available at the moment. Please check back later.</p>';
        } else {
            foodItemsContainer.innerHTML = '<p class="empty-menu-message">No food items match your current search or filter criteria.</p>';
        }
        return;
    }

    // Loop through each item and create its HTML card structure.
    itemsToRender.forEach(item => {
        const card = document.createElement('div');
        card.classList.add('food-item-card');
        // Populate card with item details. Badge is optional.
        card.innerHTML = `
            ${item.badge ? `<span class="badge">${item.badge}</span>` : ''}
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="description">${item.description}</p>
            <p class="price">$${item.price.toFixed(2)}</p>
            <button class="add-to-cart-btn" data-id="${item.id}">Add to Cart</button>
        `;
        // Attach an event listener to the "Add to Cart" button for this specific item.
        card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
            addToCart(item.id);
        });
        foodItemsContainer.appendChild(card); // Add the new card to the container.
    });
}

// =====================================================================================
// CART LOGIC (Common & Storage)
// =====================================================================================

/**
 * @description Adds a food item to the shopping cart or increments its quantity if already present.
 * @param {number} itemId - The ID of the food item to add.
 */
function addToCart(itemId) {
    const itemToAdd = foodItems.find(item => item.id === itemId);
    if (!itemToAdd) return; // Item not found in master list, should not happen if UI is correct

    const cartItem = cart.find(item => item.id === itemId);
    if (cartItem) {
        cartItem.quantity++; // Increment quantity if item already in cart
    } else {
        // Add new item to cart with quantity 1, copying all its details from foodItems
        cart.push({ ...itemToAdd, quantity: 1 });
    }
    saveCart(); // Persist updated cart to localStorage
    updateCartIcon(); // Update the cart item count in the header
    // Optionally, provide feedback to the user (e.g., an alert or a more subtle notification)
    // console.log(`${itemToAdd.name} added to cart. Current cart:`, cart);
}

/**
 * @description Updates the cart icon in the header with the total number of items (sum of quantities) in the cart.
 */
function updateCartIcon() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return; // Exit if the cart count element is not found

    // Calculate total quantity of all items in the cart
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems; // Update the text content of the cart icon
}

/**
 * @description Saves the current state of the `cart` array to localStorage.
 * The cart is stored as a JSON string under the key 'foodDeliveryCart'.
 */
function saveCart() {
    localStorage.setItem('foodDeliveryCart', JSON.stringify(cart));
}

/**
 * @description Loads the cart data from localStorage into the global `cart` array.
 * If no cart data is found in localStorage, the `cart` array remains empty.
 */
function loadCart() {
    const storedCart = localStorage.getItem('foodDeliveryCart');
    if (storedCart) {
        cart = JSON.parse(storedCart); // Parse stored JSON data into the cart array
    }
    // If no cart in localStorage, `cart` (initialized as []) remains an empty array.
}

// =====================================================================================
// CART PAGE (cart.html) - Display, Update, Checkout
// =====================================================================================

// Placeholder for styling the empty menu message
// Add to style.css:
// .empty-menu-message { text-align: center; font-size: 1.2rem; color: var(--secondary-color); padding: 30px; }


/**
 * @description Main function for initializing the cart page (`cart.html`).
 * It loads and displays cart items, sets up the summary section, and handles empty cart scenarios.
 * Assumes `cart` array is already populated by `loadCart()` during `DOMContentLoaded`.
 */
function loadCartPage() {
    const cartItemsContainer = document.getElementById('cart-items'); // Container for cart item elements
    const cartSummarySection = document.getElementById('cart-summary'); // The entire summary section

    if (!cartItemsContainer) return; // Exit if not on the cart page (i.e., container not found)

    if (cart.length === 0) {
        // If the cart is empty, display a message and hide the summary section.
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="index.html">Go Shopping!</a></p>';
        if (cartSummarySection) cartSummarySection.style.display = 'none'; // Hide summary if cart is empty
    } else {
        // If there are items in the cart, ensure summary is visible and render items.
        if (cartSummarySection) cartSummarySection.style.display = 'block'; // Show summary
        renderCartItems(cart); // Display each item in the cart
        updateCartSummary(cart); // Calculate and display subtotal, tax, and total
    }
    updateCartIcon(); // Ensure the header cart icon is also up-to-date.
}

/**
 * @description Renders the items currently in the `cart` array into the cart page's item container.
 * Also attaches necessary event listeners for item manipulation (quantity changes, removal).
 * @param {Array<Object>} currentCart - The cart array containing items to be rendered.
 */
function renderCartItems(currentCart) {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return; // Exit if container not found

    cartItemsContainer.innerHTML = ''; // Clear any existing items to prevent duplication

    // Fallback message if cart is somehow empty here (though loadCartPage should handle it primarily)
    if (currentCart.length === 0 && !document.querySelector('.empty-cart-message')) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="index.html">Go Shopping!</a></p>';
        return;
    }

    currentCart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        // Populate HTML for the cart item.
        // Quantity input is readonly; +/- buttons control its value.
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn decrease-qty" data-id="${item.id}">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" readonly>
                <button class="quantity-btn increase-qty" data-id="${item.id}">+</button>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // After rendering all items, attach event listeners to their control buttons.
    attachCartItemEventListeners();
}

/**
 * @description Attaches event listeners to quantity change (+/-) and remove buttons for all cart items.
 * This function is called after `renderCartItems` to ensure listeners are added to newly created elements.
 */
function attachCartItemEventListeners() {
    document.querySelectorAll('.increase-qty').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.dataset.id); // Get item ID from data attribute
            const cartItem = cart.find(ci => ci.id === itemId);
            if (cartItem) updateCartItemQuantity(itemId, cartItem.quantity + 1);
        });
    });

    document.querySelectorAll('.decrease-qty').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.dataset.id);
            const cartItem = cart.find(ci => ci.id === itemId);
            if (cartItem) updateCartItemQuantity(itemId, cartItem.quantity - 1);
        });
    });

    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.dataset.id);
            removeCartItem(itemId);
        });
    });
}

/**
 * @description Updates the quantity of a specific item in the cart.
 * If the new quantity is 0 or less, the item is removed from the cart.
 * After updating, it saves the cart, re-renders the cart items, and updates the summary and icon.
 * @param {number} itemId - The ID of the item to update.
 * @param {number} newQuantity - The new quantity for the item.
 */
function updateCartItemQuantity(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex === -1) return; // Item not found in cart

    if (newQuantity <= 0) {
        cart.splice(itemIndex, 1); // Remove item if quantity is 0 or less
    } else {
        cart[itemIndex].quantity = newQuantity; // Update quantity
    }
    saveCart(); // Persist changes to localStorage

    // If cart becomes empty, refresh the whole cart page view to show "empty" message.
    // Otherwise, just re-render items and update summary.
    if (cart.length === 0) {
        loadCartPage();
    } else {
        renderCartItems(cart); // Re-render items to reflect quantity changes
        updateCartSummary(cart); // Update summary figures
    }
    updateCartIcon(); // Update header cart icon
}

/**
 * @description Removes an item completely from the cart based on its ID.
 * After removal, it saves the cart, re-renders cart items, and updates the summary and icon.
 * @param {number} itemId - The ID of the item to remove.
 */
function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId); // Filter out the item to be removed
    saveCart(); // Persist changes

    if (cart.length === 0) {
        loadCartPage(); // If cart is now empty, reload page to show "empty" state
    } else {
        renderCartItems(cart); // Re-render remaining items
        updateCartSummary(cart); // Update summary
    }
    updateCartIcon(); // Update header cart icon
}

/**
 * @description Calculates and displays the cart summary: subtotal, tax (5%), and total amount.
 * Values are updated in the corresponding HTML elements on the cart page.
 * If the cart is empty, all summary values are set to '0.00'.
 * @param {Array<Object>} currentCart - The current cart array.
 */
function updateCartSummary(currentCart) {
    const subtotalElement = document.getElementById('subtotal-val');
    const taxElement = document.getElementById('tax-val');
    const finalTotalElement = document.getElementById('final-total-val');

    // Fallback to simple total if detailed elements aren't found (e.g. if HTML was not updated)
    const summaryTotalPriceElement = document.getElementById('total-price');
    if (!subtotalElement || !taxElement || !finalTotalElement) {
        if (summaryTotalPriceElement) {
             const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
             summaryTotalPriceElement.textContent = subtotal.toFixed(2); // Show subtotal as total
        }
        return;
    }

    if (currentCart.length === 0) {
        // If cart is empty, set all summary values to 0.00
        subtotalElement.textContent = '0.00';
        taxElement.textContent = '0.00';
        finalTotalElement.textContent = '0.00';
        return;
    }

    // Calculate subtotal, tax, and total
    const subtotal = currentCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const taxRate = 0.05; // 5% tax rate
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    // Update HTML elements with calculated values, formatted to 2 decimal places
    subtotalElement.textContent = subtotal.toFixed(2);
    taxElement.textContent = tax.toFixed(2);
    finalTotalElement.textContent = total.toFixed(2);
}

// =====================================================================================
// CHECKOUT
// =====================================================================================

// Event listener for the checkout button.
// This is set up once when the script loads, if the checkout button exists.
const checkoutButton = document.getElementById('checkout');
if (checkoutButton) { // Check ensures this only runs if checkout button is on the current page (cart.html)
    checkoutButton.addEventListener('click', () => {
        if (cart.length === 0) {
            alert("Your cart is empty! Please add items to your cart before checking out.");
            return;
        }

        // Recalculate total for accuracy at the point of checkout.
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const taxRate = 0.05;
        const tax = subtotal * taxRate;
        const totalAmount = subtotal + tax;

        alert(`Thank you for your order! Your total amount is $${totalAmount.toFixed(2)}.`);

        // Clear the cart after successful "checkout"
        cart = []; // Clear the local cart array
        saveCart(); // Clear cart from localStorage
        loadCartPage(); // Refresh the cart page (will show empty message and update summary)
        // updateCartIcon() is called within loadCartPage.
    });
}
