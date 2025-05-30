// Global state
let currentPanel = "manage-users"
let users = []
let items = []
let pendingReturns = []
let announcements = []

// Check admin authentication
function checkAdminAuth() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user.isAdmin) {
        showNotification('Access denied. Please log in as admin.', 'error');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        return false;
    }
    return true;
}

// Initialize admin dashboard with authentication check
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdminAuth()) return;
    initializeAdminDashboard()
    setupEventListeners()
    loadSampleData()
})

function initializeAdminDashboard() {
  // Set initial panel
  showPanel("manage-users")

  // Initialize data
  loadSampleData()

  // Render initial content
  renderUsersTable()
  renderItemsTable()
  renderPendingReturns()
  renderAnnouncements()
}

function setupEventListeners() {
  // Sidebar navigation
  const navItems = document.querySelectorAll(".nav-item[data-panel]")
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const panel = this.getAttribute("data-panel")
      showPanel(panel)
      setActiveNavItem(this)
    })
  })

  // Form submissions
  setupFormHandlers()

  // Modal close events
  setupModalEvents()
}

function showPanel(panelName) {
  // Hide all panels
  const panels = document.querySelectorAll(".panel")
  panels.forEach((panel) => {
    panel.classList.remove("active")
  })

  // Show selected panel
  const targetPanel = document.getElementById(`${panelName}-panel`)
  if (targetPanel) {
    targetPanel.classList.add("active")
    currentPanel = panelName

    // Trigger panel-specific animations
    animatePanelContent(panelName)
  }
}

function setActiveNavItem(activeItem) {
  // Remove active class from all nav items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.classList.remove("active")
  })

  // Add active class to clicked item
  activeItem.classList.add("active")
}

function animatePanelContent(panelName) {
  const panel = document.getElementById(`${panelName}-panel`)
  if (!panel) return

  // Add entrance animation
  panel.style.opacity = "0"
  panel.style.transform = "translateY(20px)"

  setTimeout(() => {
    panel.style.transition = "all 0.5s ease"
    panel.style.opacity = "1"
    panel.style.transform = "translateY(0)"
  }, 50)
}

function loadSampleData() {
  // Sample users data based on database schema
  users = [
    {
      user_id: 1,
      student_id: "STU123456",
      fullname: "John Doe",
      gmail: "john.doe@university.edu",
      phone_number: "+1 (555) 123-4567",
      socials: '{"facebook": "john.doe", "instagram": "@johndoe"}',
      profile_picture: "/images/user1.jpg",
      merit_point: 1250,
      created_at: "2023-09-15",
    },
    {
      user_id: 2,
      student_id: "STU789012",
      fullname: "Sarah Johnson",
      gmail: "sarah.j@university.edu",
      phone_number: "+1 (555) 234-5678",
      socials: '{"facebook": "sarah.johnson", "instagram": "@sarahj"}',
      profile_picture: "/images/user2.jpg",
      merit_point: 850,
      created_at: "2023-10-02",
    },
    {
      user_id: 3,
      student_id: "STU345678",
      fullname: "Mike Chen",
      gmail: "mike.chen@university.edu",
      phone_number: "+1 (555) 345-6789",
      socials: '{"facebook": "mike.chen", "instagram": "@mikechen"}',
      profile_picture: "/images/user3.jpg",
      merit_point: 420,
      created_at: "2023-08-20",
    },
  ]

  // Sample items data based on database schema
  items = [
    {
      lost_item_id: 1,
      user_id: 1,
      title: "iPhone 13",
      description: "Black iPhone 13, 128GB with blue case",
      location: "Library A1",
      lost_date: "2023-12-15",
      image_url: "/images/iphone.jpg",
      type: "lost",
      status: "pending",
      category: "electronics",
    },
    {
      found_item_id: 2,
      user_id: 2,
      title: "Car Keys",
      description: "Toyota keys with blue keychain",
      location: "Parking Lot B",
      found_date: "2023-12-14",
      image_url: "/images/keys.jpg",
      type: "found",
      status: "found",
      category: "accessories",
    },
    {
      lost_item_id: 3,
      user_id: 3,
      title: "Textbook",
      description: "Mathematics textbook, 3rd edition",
      location: "Study Hall C",
      lost_date: "2023-12-13",
      image_url: "/images/textbook.jpg",
      type: "lost",
      status: "returned",
      category: "books",
    },
  ]

  // Sample pending returns
  pendingReturns = [
    {
      id: 1,
      matchDate: "2023-12-16",
      lostItem: {
        id: 1,
        name: "iPhone 13",
        description: "Black iPhone 13, 128GB",
        location: "Library A1",
        reporter: "john.doe@university.edu",
      },
      foundItem: {
        id: 4,
        name: "Phone",
        description: "Black smartphone",
        location: "A1, 612",
        reporter: "sarah.j@university.edu",
      },
      confidence: "95%",
    },
  ]

  // Sample announcements
  announcements = [
    {
      id: 1,
      title: "System Maintenance",
      content: "The lost and found system will be under maintenance on Sunday from 2-4 AM.",
      priority: "medium",
      dateCreated: "2023-12-16",
    },
  ]
}

// Users Management
function renderUsersTable() {
  const tbody = document.getElementById("usersTableBody")
  tbody.innerHTML = ""

  users.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
  <td>${user.user_id}</td>
  <td>${user.fullname}</td>
  <td>${user.student_id}</td>
  <td>${user.phone_number || "N/A"}</td>
  <td>${user.merit_point}</td>
  <td>
    <div class="action-buttons">
      <button class="btn-edit" onclick="editUser(${user.user_id})">Edit</button>
    </div>
  </td>
`
    tbody.appendChild(row)
  })
}

function openAddUserModal() {
  document.getElementById("addUserModal").style.display = "block"
  document.body.style.overflow = "hidden"
}

function addUser(userData) {
  const newUser = {
    user_id: users.length + 1,
    student_id: userData.studentId,
    fullname: userData.fullName,
    gmail: userData.email,
    phone_number: userData.phone,
    socials: userData.socials || "{}",
    profile_picture: userData.profilePicture || "",
    merit_point: Number.parseInt(userData.meritPoints) || 0,
    created_at: new Date().toISOString().split("T")[0],
  }

  users.push(newUser)
  renderUsersTable()
  showNotification("User added successfully!", "success")
}

function editUser(userId) {
  const user = users.find((u) => u.user_id === userId)
  if (!user) return

  const modalTitle = document.getElementById("editModalTitle")
  const modalBody = document.getElementById("editModalBody")

  modalTitle.textContent = "Edit User"
  modalBody.innerHTML = `
    <form id="editUserForm">
      <div class="form-group">
        <label for="editUserFullName">Full Name</label>
        <input type="text" id="editUserFullName" value="${user.fullname}" required>
      </div>
      <div class="form-group">
        <label for="editUserStudentId">Student ID</label>
        <input type="text" id="editUserStudentId" value="${user.student_id}" required>
      </div>
      <div class="form-group">
        <label for="editUserEmail">Gmail</label>
        <input type="email" id="editUserEmail" value="${user.gmail}" required>
      </div>
      <div class="form-group">
        <label for="editUserPhone">Phone Number</label>
        <input type="tel" id="editUserPhone" value="${user.phone_number || ""}">
      </div>
      <div class="form-group">
        <label for="editUserSocials">Socials (JSON)</label>
        <textarea id="editUserSocials" rows="3">${user.socials}</textarea>
      </div>
      <div class="form-group">
        <label for="editUserProfilePicture">Profile Picture URL</label>
        <input type="url" id="editUserProfilePicture" value="${user.profile_picture || ""}">
      </div>
      <div class="form-group">
        <label for="editUserMeritPoints">Merit Points</label>
        <input type="number" id="editUserMeritPoints" value="${user.merit_point}">
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="closeModal('editModal')">Cancel</button>
        <button type="button" class="btn-danger" onclick="deleteUser(${userId})">Delete User</button>
        <button type="submit" class="btn-primary">Update User</button>
      </div>
    </form>
  `

  document.getElementById("editModal").style.display = "block"
  document.body.style.overflow = "hidden"

  // Handle form submission
  document.getElementById("editUserForm").onsubmit = (e) => {
    e.preventDefault()

    const updatedUser = {
      ...user,
      fullname: document.getElementById("editUserFullName").value,
      student_id: document.getElementById("editUserStudentId").value,
      gmail: document.getElementById("editUserEmail").value,
      phone_number: document.getElementById("editUserPhone").value,
      socials: document.getElementById("editUserSocials").value,
      profile_picture: document.getElementById("editUserProfilePicture").value,
      merit_point: Number.parseInt(document.getElementById("editUserMeritPoints").value),
    }

    const index = users.findIndex((u) => u.user_id === userId)
    users[index] = updatedUser
    renderUsersTable()
    closeModal("editModal")
    showNotification("User updated successfully!", "success")
  }
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    users = users.filter((u) => u.user_id !== userId)
    renderUsersTable()
    closeModal("editModal")
    showNotification("User deleted successfully!", "success")
  }
}

// Items Management
function renderItemsTable() {
  const tbody = document.getElementById("itemsTableBody")
  tbody.innerHTML = ""

  items.forEach((item) => {
    const itemId = item.lost_item_id || item.found_item_id
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${itemId}</td>
      <td>${item.title}</td>
      <td>${item.category}</td>
      <td>${item.location}</td>
      <td><span class="status-badge status-${item.type}">${item.type}</span></td>
      <td><span class="status-badge status-${item.status}">${item.status}</span></td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editItem(${itemId}, '${item.type}')">Edit</button>
        </div>
      </td>
    `
    tbody.appendChild(row)
  })
}

function openAddItemModal() {
  document.getElementById("addItemModal").style.display = "block"
  document.body.style.overflow = "hidden"
}

function addItem(itemData) {
  const newItem = {
    [itemData.type === "lost" ? "lost_item_id" : "found_item_id"]: items.length + 1,
    user_id: Number.parseInt(itemData.userId),
    title: itemData.title,
    description: itemData.description,
    location: itemData.location,
    [itemData.type === "lost" ? "lost_date" : "found_date"]: itemData.date,
    image_url: itemData.imageUrl || "",
    type: itemData.type,
    status: "pending",
    category: itemData.category || "other",
    created_at: new Date().toISOString().split("T")[0],
  }

  items.push(newItem)
  renderItemsTable()
  showNotification("Item added successfully!", "success")
}

function editItem(itemId, itemType) {
  const item = items.find((i) => i.lost_item_id === itemId || i.found_item_id === itemId)
  if (!item) return

  const modalTitle = document.getElementById("editModalTitle")
  const modalBody = document.getElementById("editModalBody")

  modalTitle.textContent = "Edit Item"
  modalBody.innerHTML = `
    <form id="editItemForm">
      <div class="form-group">
        <label for="editItemTitle">Title</label>
        <input type="text" id="editItemTitle" value="${item.title}" required>
      </div>
      <div class="form-group">
        <label for="editItemDescription">Description</label>
        <textarea id="editItemDescription" rows="3">${item.description || ""}</textarea>
      </div>
      <div class="form-group">
        <label for="editItemLocation">Location</label>
        <input type="text" id="editItemLocation" value="${item.location}" required>
      </div>
      <div class="form-group">
        <label for="editItemDate">${item.type === "lost" ? "Lost" : "Found"} Date</label>
        <input type="date" id="editItemDate" value="${item.lost_date || item.found_date}" required>
      </div>
      <div class="form-group">
        <label for="editItemImageUrl">Image URL</label>
        <input type="url" id="editItemImageUrl" value="${item.image_url || ""}">
      </div>
      <div class="form-group">
        <label for="editItemUserId">User ID</label>
        <input type="number" id="editItemUserId" value="${item.user_id}" required>
      </div>
      <div class="form-group">
        <label for="editItemCategory">Category</label>
        <select id="editItemCategory">
          <option value="electronics" ${item.category === "electronics" ? "selected" : ""}>Electronics</option>
          <option value="clothing" ${item.category === "clothing" ? "selected" : ""}>Clothing</option>
          <option value="accessories" ${item.category === "accessories" ? "selected" : ""}>Accessories</option>
          <option value="books" ${item.category === "books" ? "selected" : ""}>Books</option>
          <option value="other" ${item.category === "other" ? "selected" : ""}>Other</option>
        </select>
      </div>
      <div class="form-group">
        <label for="editItemStatus">Status</label>
        <select id="editItemStatus">
          <option value="pending" ${item.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="found" ${item.status === "found" ? "selected" : ""}>Found</option>
          <option value="returned" ${item.status === "returned" ? "selected" : ""}>Returned</option>
        </select>
      </div>
      <div class="form-actions">
        <button type="button" class="btn-secondary" onclick="closeModal('editModal')">Cancel</button>
        <button type="button" class="btn-delete" onclick="deleteItem(${itemId}, '${itemType}')">Delete Item</button>
        <button type="submit" class="btn-primary">Update Item</button>
      </div>
    </form>
  `

  document.getElementById("editModal").style.display = "block"
  document.body.style.overflow = "hidden"

  // Handle form submission
  document.getElementById("editItemForm").onsubmit = (e) => {
    e.preventDefault()

    const updatedItem = {
      ...item,
      title: document.getElementById("editItemTitle").value,
      description: document.getElementById("editItemDescription").value,
      location: document.getElementById("editItemLocation").value,
      [item.type === "lost" ? "lost_date" : "found_date"]: document.getElementById("editItemDate").value,
      image_url: document.getElementById("editItemImageUrl").value,
      user_id: Number.parseInt(document.getElementById("editItemUserId").value),
      category: document.getElementById("editItemCategory").value,
      status: document.getElementById("editItemStatus").value,
    }

    const index = items.findIndex((i) => i.lost_item_id === itemId || i.found_item_id === itemId)
    items[index] = updatedItem
    renderItemsTable()
    closeModal("editModal")
    showNotification("Item updated successfully!", "success")
  }
}

function deleteItem(itemId, itemType) {
  if (confirm("Are you sure you want to delete this item?")) {
    items = items.filter((i) => !(i.lost_item_id === itemId || i.found_item_id === itemId))
    renderItemsTable()
    closeModal("editModal")
    showNotification("Item deleted successfully!", "success")
  }
}

// Approve Returns Management
function renderPendingReturns() {
  const container = document.getElementById("returnsGrid")
  container.innerHTML = ""

  if (pendingReturns.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #666;">
        <h3>No pending returns</h3>
        <p>All item matches have been processed.</p>
      </div>
    `
    return
  }

  pendingReturns.forEach((returnItem) => {
    const card = document.createElement("div")
    card.className = "return-card"
    card.innerHTML = `
      <div class="return-header">
        <span class="return-id">Match #${returnItem.id}</span>
        <span class="return-date">${formatDate(returnItem.matchDate)}</span>
      </div>
      
      <div class="linked-items">
        <div class="item-info">
          <h4>Lost Item</h4>
          <p><strong>Name:</strong> ${returnItem.lostItem.name}</p>
          <p><strong>Description:</strong> ${returnItem.lostItem.description}</p>
          <p><strong>Location:</strong> ${returnItem.lostItem.location}</p>
          <p><strong>Reporter:</strong> ${returnItem.lostItem.reporter}</p>
        </div>
        
        <div class="link-arrow">↔️</div>
        
        <div class="item-info">
          <h4>Found Item</h4>
          <p><strong>Name:</strong> ${returnItem.foundItem.name}</p>
          <p><strong>Description:</strong> ${returnItem.foundItem.description}</p>
          <p><strong>Location:</strong> ${returnItem.foundItem.location}</p>
          <p><strong>Reporter:</strong> ${returnItem.foundItem.reporter}</p>
        </div>
      </div>
      
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="background: var(--primary-color); color: var(--text-color); padding: 6px 12px; border-radius: 15px; font-weight: 600;">
          ${returnItem.confidence} Match Confidence
        </span>
      </div>
      
      <div class="return-actions">
        <button class="btn-danger" onclick="rejectReturn(${returnItem.id})">Reject</button>
        <button class="btn-primary" onclick="approveReturn(${returnItem.id})">Approve Return</button>
      </div>
    `
    container.appendChild(card)
  })
}

function approveReturn(returnId) {
  if (
    confirm(
      "Are you sure you want to approve this return? Both items will be marked as returned and removed from active listings.",
    )
  ) {
    const returnItem = pendingReturns.find((r) => r.id === returnId)
    if (returnItem) {
      // Update item statuses to returned
      const lostItemIndex = items.findIndex((i) => i.lost_item_id === returnItem.lostItem.id)
      const foundItemIndex = items.findIndex((i) => i.found_item_id === returnItem.foundItem.id)

      if (lostItemIndex !== -1) {
        items[lostItemIndex].status = "returned"
      }
      if (foundItemIndex !== -1) {
        items[foundItemIndex].status = "returned"
      }

      // Remove from pending returns
      pendingReturns = pendingReturns.filter((r) => r.id !== returnId)

      // Update displays
      renderPendingReturns()
      renderItemsTable()

      showNotification("Return approved successfully! Items marked as returned.", "success")
    }
  }
}

function rejectReturn(returnId) {
  if (confirm("Are you sure you want to reject this return? Both items will be returned to active listings.")) {
    const returnItem = pendingReturns.find((r) => r.id === returnId)
    if (returnItem) {
      // Update item statuses back to active
      const lostItemIndex = items.findIndex((i) => i.lost_item_id === returnItem.lostItem.id)
      const foundItemIndex = items.findIndex((i) => i.found_item_id === returnItem.foundItem.id)

      if (lostItemIndex !== -1) {
        items[lostItemIndex].status = "pending"
      }
      if (foundItemIndex !== -1) {
        items[foundItemIndex].status = "found"
      }

      // Remove from pending returns
      pendingReturns = pendingReturns.filter((r) => r.id !== returnId)

      // Update displays
      renderPendingReturns()
      renderItemsTable()

      showNotification("Return rejected. Items returned to active listings.", "info")
    }
  }
}

// Announcements Management
function renderAnnouncements() {
  const container = document.getElementById("announcementsList")
  container.innerHTML = ""

  if (announcements.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 20px; color: #666;">
        <p>No announcements published yet.</p>
      </div>
    `
    return
  }

  announcements.forEach((announcement) => {
    const item = document.createElement("div")
    item.className = "announcement-item"
    item.innerHTML = `
      <div class="announcement-meta">
        <h4 class="announcement-title">${announcement.title}</h4>
        <span class="announcement-priority priority-${announcement.priority}">${announcement.priority}</span>
      </div>
      <div class="announcement-content">${announcement.content}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666;">
        <span>Published: ${formatDate(announcement.dateCreated)}</span>
        <div class="announcement-actions">
          <button class="btn-edit" onclick="editAnnouncement(${announcement.id})">Edit</button>
          <button class="btn-delete" onclick="deleteAnnouncement(${announcement.id})">Delete</button>
        </div>
      </div>
    `
    container.appendChild(item)
  })
}

function publishAnnouncement() {
  const title = document.getElementById("announcementTitle").value
  const content = document.getElementById("announcementContent").value
  const priority = document.getElementById("announcementPriority").value

  if (!title || !content) {
    showNotification("Please fill in all required fields.", "error")
    return
  }

  const newAnnouncement = {
    id: announcements.length + 1,
    title,
    content,
    priority,
    dateCreated: new Date().toISOString().split("T")[0],
  }

  announcements.unshift(newAnnouncement)
  renderAnnouncements()
  clearAnnouncementForm()
  showNotification("Announcement published successfully!", "success")
}

function clearAnnouncementForm() {
  document.getElementById("announcementTitle").value = ""
  document.getElementById("announcementContent").value = ""
  document.getElementById("announcementPriority").value = "medium"
}

function editAnnouncement(announcementId) {
  const announcement = announcements.find((a) => a.id === announcementId)
  if (!announcement) return

  // Populate form with existing data
  document.getElementById("announcementTitle").value = announcement.title
  document.getElementById("announcementContent").value = announcement.content
  document.getElementById("announcementPriority").value = announcement.priority

  // Remove the old announcement
  announcements = announcements.filter((a) => a.id !== announcementId)
  renderAnnouncements()

  showNotification("Announcement loaded for editing. Make changes and publish again.", "info")
}

function deleteAnnouncement(announcementId) {
  if (confirm("Are you sure you want to delete this announcement?")) {
    announcements = announcements.filter((a) => a.id !== announcementId)
    renderAnnouncements()
    showNotification("Announcement deleted successfully!", "success")
  }
}

// Form Handlers
function setupFormHandlers() {
  // Add User Form
  const addUserForm = document.getElementById("addUserForm")
  if (addUserForm) {
    addUserForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const userData = {
        fullName: document.getElementById("userFullName").value,
        studentId: document.getElementById("userStudentId").value,
        email: document.getElementById("userEmail").value,
        phone: document.getElementById("userPhone").value,
        socials: document.getElementById("userSocials").value,
        profilePicture: document.getElementById("userProfilePicture").value,
        meritPoints: document.getElementById("userMeritPoints").value,
      }

      addUser(userData)
      closeModal("addUserModal")
      this.reset()
    })
  }

  // Add Item Form
  const addItemForm = document.getElementById("addItemForm")
  if (addItemForm) {
    addItemForm.addEventListener("submit", function (e) {
      e.preventDefault()

      const itemData = {
        title: document.getElementById("itemTitle").value,
        description: document.getElementById("itemDescription").value,
        location: document.getElementById("itemLocation").value,
        type: document.getElementById("itemType").value,
        date: document.getElementById("itemDate").value,
        imageUrl: document.getElementById("itemImageUrl").value,
        userId: document.getElementById("itemUserId").value,
      }

      addItem(itemData)
      closeModal("addItemModal")
      this.reset()
    })
  }
}

// Modal Management
function setupModalEvents() {
  const modals = document.querySelectorAll(".modal")

  modals.forEach((modal) => {
    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal.id)
      }
    })
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModal = document.querySelector(".modal[style*='block']")
      if (openModal) {
        closeModal(openModal.id)
      }
    }
  })
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none"
  document.body.style.overflow = "auto"
}

// Profile dropdown functionality
function toggleProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown")
  const isVisible = dropdown.classList.contains("show")

  if (isVisible) {
    closeProfileDropdown()
  } else {
    openProfileDropdown()
  }
}

function openProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown")
  dropdown.classList.add("show")

  // Close dropdown when clicking outside
  setTimeout(() => {
    document.addEventListener("click", handleOutsideClick)
  }, 100)
}

function closeProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown")
  dropdown.classList.remove("show")
  document.removeEventListener("click", handleOutsideClick)
}

function handleOutsideClick(event) {
  const dropdown = document.getElementById("profileDropdown")
  const profileBtn = document.querySelector(".profile-btn")

  if (!dropdown.contains(event.target) && !profileBtn.contains(event.target)) {
    closeProfileDropdown()
  }
}

// Close dropdown when pressing Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProfileDropdown()
  }
})

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${getNotificationIcon()}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
    </div>
  `

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getNotificationColor(type)};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    z-index: 1001;
    animation: slideInRight 0.3s ease;
    max-width: 400px;
  `

  // Add to page
  document.body.appendChild(notification)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.animation = "slideOutRight 0.3s ease"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

function getNotificationIcon() {
  return ""
}

function getNotificationColor(type) {
  const colors = {
    success: "#28a745",
    error: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
  }
  return colors[type] || colors.info
}

function logout() {
    closeProfileDropdown();

    if (confirm("Are you sure you want to log out?")) {
        // Clear all storage
        sessionStorage.clear();
        localStorage.clear();

        // Clear cookies
        document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.trim().split('=');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        });

        // Show logout message
        showNotification("Logging out...", "info");

        // Redirect to login page after delay
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1500);
    }
}

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-left: auto;
  }
  
  .notification-close:hover {
    opacity: 0.7;
  }
`
document.head.appendChild(style)
