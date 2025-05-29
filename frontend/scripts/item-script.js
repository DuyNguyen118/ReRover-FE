// Global variables
let currentItems = []
let filteredItems = []
let currentPage = "lost" // 'lost' or 'found'

// Sample data - in a real app, this would come from an API
const sampleItems = {
  lost: [
    {
      id: 1,
      name: "iPhone 13",
      category: "electronics",
      location: "A1, 612",
      description: "Black iPhone 13 with blue case",
      image: "images/phone.jpg",
      date: "2023-12-01",
      contact: "john@example.com",
    },
    {
      id: 2,
      name: "Leather Wallet",
      category: "accessories",
      location: "Library, 2nd Floor",
      description: "Brown leather wallet with cards",
      image: "images/phone.jpg",
      date: "2023-12-02",
      contact: "jane@example.com",
    },
    {
      id: 3,
      name: "MacBook Pro",
      category: "electronics",
      location: "Computer Lab B",
      description: "13-inch MacBook Pro, Space Gray",
      image: "images/phone.jpg",
      date: "2023-12-03",
      contact: "mike@example.com",
    },
    {
      id: 4,
      name: "Red Backpack",
      category: "accessories",
      location: "Cafeteria",
      description: "Red Nike backpack with laptop compartment",
      image: "images/phone.jpg",
      date: "2023-12-04",
      contact: "sarah@example.com",
    },
    {
      id: 5,
      name: "Car Keys",
      category: "keys",
      location: "Parking Lot C",
      description: "Toyota car keys with blue keychain",
      image: "images/phone.jpg",
      date: "2023-12-05",
      contact: "david@example.com",
    },
    {
      id: 6,
      name: "Textbook",
      category: "books",
      location: "Classroom 301",
      description: "Mathematics textbook, 3rd edition",
      image: "images/phone.jpg",
      date: "2023-12-06",
      contact: "lisa@example.com",
    },
  ],
  found: [
    {
      id: 7,
      name: "Samsung Galaxy",
      category: "electronics",
      location: "A2, 515",
      description: "White Samsung Galaxy with cracked screen",
      image: "images/phone.jpg",
      date: "2023-12-01",
      contact: "finder1@example.com",
    },
    {
      id: 8,
      name: "Blue Jacket",
      category: "clothing",
      location: "Gym",
      description: "Blue denim jacket, size M",
      image: "images/phone.jpg",
      date: "2023-12-02",
      contact: "finder2@example.com",
    },
    {
      id: 9,
      name: "Wireless Earbuds",
      category: "electronics",
      location: "Study Hall",
      description: "Apple AirPods in white case",
      image: "images/phone.jpg",
      date: "2023-12-03",
      contact: "finder3@example.com",
    },
    {
      id: 10,
      name: "Student ID",
      category: "documents",
      location: "Main Entrance",
      description: "Student ID card for John Smith",
      image: "images/phone.jpg",
      date: "2023-12-04",
      contact: "finder4@example.com",
    },
    {
      id: 11,
      name: "Water Bottle",
      category: "other",
      location: "Sports Field",
      description: "Stainless steel water bottle with stickers",
      image: "images/phone.jpg",
      date: "2023-12-05",
      contact: "finder5@example.com",
    },
    {
      id: 12,
      name: "Sunglasses",
      category: "accessories",
      location: "Parking Lot A",
      description: "Ray-Ban sunglasses in black case",
      image: "images/phone.jpg",
      date: "2023-12-06",
      contact: "finder6@example.com",
    },
  ],
}

// Initialize items page
function initializeItemsPage(pageType) {
  currentPage = pageType
  currentItems = sampleItems[pageType] || []
  filteredItems = [...currentItems]

  setupEventListeners()
  renderItems()

  console.log(`ReRover ${pageType} Items Page loaded successfully`)
}

// Setup event listeners
function setupEventListeners() {
  // Search functionality
  const searchBtn = document.querySelector(".search-btn")
  const searchInput = document.querySelector(".search-input")

  if (searchBtn) {
    searchBtn.addEventListener("click", handleSearch)
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })

    // Real-time search
    searchInput.addEventListener("input", debounce(handleSearch, 300))
  }

  // Category filter
  const categorySelects = document.querySelectorAll(".category-select")
  categorySelects.forEach((select) => {
    select.addEventListener("change", function () {
      if (this.id === "sort-select") {
        handleSort()
      } else {
        handleFilter()
      }
    })
  })

  // Add loading animations
  addLoadingAnimations()
}

// Search functionality
function handleSearch() {
  const searchInput = document.querySelector(".search-input")
  const searchTerm = searchInput.value.trim().toLowerCase()

  if (searchTerm === "") {
    filteredItems = [...currentItems]
  } else {
    filteredItems = currentItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm),
    )
  }

  renderItems()
  console.log("Searching for:", searchTerm)
}

// Filter functionality
function handleFilter() {
  const categorySelect = document.querySelector(".category-select:not(#sort-select)")
  const selectedCategory = categorySelect.value

  if (selectedCategory === "") {
    filteredItems = [...currentItems]
  } else {
    filteredItems = currentItems.filter((item) => item.category === selectedCategory)
  }

  // Apply search filter if there's a search term
  const searchInput = document.querySelector(".search-input")
  const searchTerm = searchInput.value.trim().toLowerCase()
  if (searchTerm !== "") {
    filteredItems = filteredItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm),
    )
  }

  renderItems()
  console.log("Category changed to:", selectedCategory)
}

// Sort functionality
function handleSort() {
  const sortSelect = document.getElementById("sort-select")
  const sortBy = sortSelect.value

  switch (sortBy) {
    case "recent":
      filteredItems.sort((a, b) => new Date(b.date) - new Date(a.date))
      break
    case "oldest":
      filteredItems.sort((a, b) => new Date(a.date) - new Date(b.date))
      break
    case "az":
      filteredItems.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "za":
      filteredItems.sort((a, b) => b.name.localeCompare(a.name))
      break
  }

  renderItems()
  console.log("Sort changed to:", sortBy)
}

// Render items
function renderItems() {
  const container = document.getElementById("items-container")
  const loadingSpinner = document.getElementById("loading-spinner")
  const noItems = document.getElementById("no-items")

  // Show loading
  loadingSpinner.style.display = "block"
  container.style.display = "none"
  noItems.style.display = "none"

  // Simulate loading delay
  setTimeout(() => {
    loadingSpinner.style.display = "none"

    if (filteredItems.length === 0) {
      noItems.style.display = "block"
      container.style.display = "none"
    } else {
      noItems.style.display = "none"
      container.style.display = "grid"

      container.innerHTML = filteredItems.map((item) => createItemCard(item)).join("")

      // Add event listeners to new cards
      addItemCardListeners()
    }
  }, 500)
}

// Create item card HTML
function createItemCard(item) {
  const tagText = currentPage === "lost" ? "Lost" : "Found"

  return `
        <div class="item-card" data-item-id="${item.id}">
            <div class="item-tag">${tagText}</div>
            <img src="${item.image}" alt="${tagText} ${item.name}" class="item-image">
            <div class="item-info">
                <h3 class="item-name">Name: ${item.name}</h3>
                <p class="item-location">Location: ${item.location}</p>
                <div class="item-actions">
                    <button class="view-detail-btn" onclick="viewItemDetail(${item.id})">View detail</button>
                    <button class="claim-btn" onclick="claimItem(${item.id})">Claim</button>
                </div>
            </div>
        </div>
    `
}

// Add event listeners to item cards
function addItemCardListeners() {
  const viewDetailBtns = document.querySelectorAll(".view-detail-btn")
  const claimBtns = document.querySelectorAll(".claim-btn")

  viewDetailBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  })

  claimBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  })
}

// View item detail
function viewItemDetail(itemId) {
  const item = currentItems.find((i) => i.id === itemId)
  if (item) {
    // In a real app, this would navigate to a detail page
    alert(
      `View detail for: ${item.name}\n\nDescription: ${item.description}\nLocation: ${item.location}\nContact: ${item.contact}\nDate: ${item.date}`,
    )
    console.log("View detail for item:", item)
  }
}

// Claim item
function claimItem(itemId) {
  const item = currentItems.find((i) => i.id === itemId)
  if (item) {
    // In a real app, this would open a claim form
    const confirmed = confirm(
      `Do you want to claim this item?\n\nItem: ${item.name}\nLocation: ${item.location}\n\nYou will be contacted for verification.`,
    )
    if (confirmed) {
      alert("Claim submitted successfully! You will be contacted soon.")
      console.log("Claim submitted for item:", item)
    }
  }
}

// Profile menu toggle
function toggleProfileMenu() {
  console.log("Profile menu clicked")
  // In a real app, this would show a dropdown menu
  alert("Profile menu functionality would open here")
}

// Newsletter subscription
function subscribeNewsletter() {
  const email = document.getElementById("newsletterEmail").value
  if (email) {
    alert("Thank you for subscribing!")
    document.getElementById("newsletterEmail").value = ""
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add loading animations
function addLoadingAnimations() {
  const sections = document.querySelectorAll(".content-panel, .items-list")

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(30px)"
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(section)
  })
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})

// Export functions for global access
window.initializeItemsPage = initializeItemsPage
window.viewItemDetail = viewItemDetail
window.claimItem = claimItem
window.toggleProfileMenu = toggleProfileMenu
window.subscribeNewsletter = subscribeNewsletter
