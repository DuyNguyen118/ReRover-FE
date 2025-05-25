// Global state
let currentPanel = "matches"
let isDarkMode = false
let currentLanguage = "en"

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
  setupEventListeners()
  loadUserPreferences()
})

function initializeDashboard() {
  // Set initial panel
  showPanel("matches")

  // Load user data
  loadUserData()

  // Initialize animations
  animateElements()
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

  // Profile photo change
  const photoInput = document.getElementById("photoInput")
  if (photoInput) {
    photoInput.addEventListener("change", handlePhotoChange)
  }

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

function animateElements() {
  // Animate merit points counter
  const pointsElement = document.getElementById("totalPoints")
  if (pointsElement) {
    animateCounter(pointsElement, 0, 1250, 2000)
  }

  // Animate progress bars
  const progressBars = document.querySelectorAll(".progress-fill")
  progressBars.forEach((bar) => {
    const width = bar.style.width
    bar.style.width = "0%"
    setTimeout(() => {
      bar.style.width = width
    }, 500)
  })
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

function animateCounter(element, start, end, duration) {
  const startTime = performance.now()

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    const current = Math.floor(start + (end - start) * progress)
    element.textContent = current.toLocaleString()

    if (progress < 1) {
      requestAnimationFrame(updateCounter)
    }
  }

  requestAnimationFrame(updateCounter)
}

// Match functionality
function viewMatchDetails(matchId) {
  const modal = document.getElementById("matchModal")
  const modalBody = document.getElementById("modalBody")

  // Sample match data
  const matchData = {
    1: {
      yourItem: {
        name: "iPhone 13",
        description: "Black iPhone 13, 128GB with blue case",
        location: "Library A1",
        date: "Dec 15, 2023",
        image: "/placeholder.svg?height=200&width=200",
        reporter: "You",
      },
      matchedItem: {
        name: "Phone",
        description: "Black smartphone found near study area",
        location: "A1, 612",
        date: "Dec 15, 2023",
        image: "/placeholder.svg?height=200&width=200",
        reporter: "Sarah Johnson",
      },
      confidence: "95%",
      status: "Pending Confirmation",
    },
    2: {
      yourItem: {
        name: "Car Keys",
        description: "Toyota keys with blue keychain",
        location: "Parking Lot B",
        date: "Dec 14, 2023",
        image: "/placeholder.svg?height=200&width=200",
        reporter: "You",
      },
      matchedItem: {
        name: "Keys",
        description: "Set of car keys found in parking area",
        location: "Near Building B",
        date: "Dec 14, 2023",
        image: "/placeholder.svg?height=200&width=200",
        reporter: "Mike Chen",
      },
      confidence: "78%",
      status: "Under Review",
    },
  }

  const match = matchData[matchId]
  if (!match) return

  modalBody.innerHTML = `
        <div class="match-details">
            <div class="match-info-header">
                <h4>Match Confidence: ${match.confidence}</h4>
                <span class="status-badge">${match.status}</span>
            </div>
            
            <div class="detailed-comparison">
                <div class="item-detail-card">
                    <h5>Your Item</h5>
                    <img src="${match.yourItem.image}" alt="${match.yourItem.name}">
                    <div class="item-info-detailed">
                        <p><strong>Name:</strong> ${match.yourItem.name}</p>
                        <p><strong>Description:</strong> ${match.yourItem.description}</p>
                        <p><strong>Location:</strong> ${match.yourItem.location}</p>
                        <p><strong>Date:</strong> ${match.yourItem.date}</p>
                        <p><strong>Reported by:</strong> ${match.yourItem.reporter}</p>
                    </div>
                </div>
                
                <div class="item-detail-card">
                    <h5>Matched Item</h5>
                    <img src="${match.matchedItem.image}" alt="${match.matchedItem.name}">
                    <div class="item-info-detailed">
                        <p><strong>Name:</strong> ${match.matchedItem.name}</p>
                        <p><strong>Description:</strong> ${match.matchedItem.description}</p>
                        <p><strong>Location:</strong> ${match.matchedItem.location}</p>
                        <p><strong>Date:</strong> ${match.matchedItem.date}</p>
                        <p><strong>Reported by:</strong> ${match.matchedItem.reporter}</p>
                    </div>
                </div>
            </div>
            
            <div class="match-actions-detailed">
                <button class="btn-secondary" onclick="closeModal()">Close</button>
                <button class="btn-secondary" onclick="contactReporter('${match.matchedItem.reporter}')">Contact Reporter</button>
                <button class="btn-primary" onclick="confirmMatch(${matchId})">Confirm This Match</button>
            </div>
        </div>
    `

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function confirmMatch(matchId) {
  // Show confirmation animation
  showNotification("Match confirmed! You will be contacted with pickup details.", "success")

  // Update UI to show confirmed status
  const matchCard = document.querySelector(`[data-match-id="${matchId}"]`)
  if (matchCard) {
    matchCard.style.opacity = "0.7"
    matchCard.querySelector(".match-status").textContent = "Confirmed"
    matchCard.querySelector(".match-status").style.background = "#4CAF50"
  }

  closeModal()
}

function contactReporter(reporterName) {
  showNotification(`Contact request sent to ${reporterName}`, "info")
}

function closeModal() {
  const modal = document.getElementById("matchModal")
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

function setupModalEvents() {
  const modal = document.getElementById("matchModal")

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal()
    }
  })
}

// Account management
function changeProfilePhoto() {
  document.getElementById("photoInput").click()
}

function handlePhotoChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const profilePhoto = document.getElementById("profilePhoto")
      const sidebarAvatar = document.getElementById("sidebarAvatar")

      if (profilePhoto) profilePhoto.src = e.target.result
      if (sidebarAvatar) sidebarAvatar.src = e.target.result

      showNotification("Profile photo updated successfully!", "success")
    }
    reader.readAsDataURL(file)
  }
}

function updateProfile() {
  const formData = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    studentId: document.getElementById("studentId").value,
    phone: document.getElementById("phone").value,
    currentPassword: document.getElementById("currentPassword").value,
    newPassword: document.getElementById("newPassword").value,
    confirmPassword: document.getElementById("confirmPassword").value,
  }

  // Validate form
  if (!validateProfileForm(formData)) {
    return
  }

  // Simulate API call
  setTimeout(() => {
    showNotification("Profile updated successfully!", "success")

    // Clear password fields
    document.getElementById("currentPassword").value = ""
    document.getElementById("newPassword").value = ""
    document.getElementById("confirmPassword").value = ""
  }, 1000)
}

function validateProfileForm(data) {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    showNotification("New passwords do not match!", "error")
    return false
  }

  if (data.newPassword && !data.currentPassword) {
    showNotification("Current password is required to change password!", "error")
    return false
  }

  return true
}

function resetForm() {
  const form = document.querySelector(".profile-form")
  const inputs = form.querySelectorAll('input[type="password"]')
  inputs.forEach((input) => (input.value = ""))

  showNotification("Password fields cleared", "info")
}

// Settings management
function toggleDarkMode() {
  isDarkMode = !isDarkMode
  document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light")

  // Save preference
  localStorage.setItem("darkMode", isDarkMode)

  showNotification(`${isDarkMode ? "Dark" : "Light"} mode enabled`, "info")
}

function changeLanguage() {
  const select = document.getElementById("languageSelect")
  currentLanguage = select.value

  // Save preference
  localStorage.setItem("language", currentLanguage)

  showNotification(`Language changed to ${getLanguageName(currentLanguage)}`, "info")
}

function getLanguageName(code) {
  const languages = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    zh: "中文",
  }
  return languages[code] || "English"
}

function saveSettings() {
  const settings = {
    darkMode: isDarkMode,
    language: currentLanguage,
    emailNotifications: document.getElementById("emailNotifications").checked,
    pushNotifications: document.getElementById("pushNotifications").checked,
    privacy: document.getElementById("privacySelect").value,
  }

  // Save to localStorage
  Object.keys(settings).forEach((key) => {
    localStorage.setItem(key, settings[key])
  })

  showNotification("Settings saved successfully!", "success")
}

function resetSettings() {
  // Reset to defaults
  document.getElementById("darkModeToggle").checked = false
  document.getElementById("languageSelect").value = "en"
  document.getElementById("emailNotifications").checked = true
  document.getElementById("pushNotifications").checked = true
  document.getElementById("privacySelect").value = "public"

  // Apply defaults
  isDarkMode = false
  currentLanguage = "en"
  document.body.setAttribute("data-theme", "light")

  showNotification("Settings reset to default", "info")
}

function loadUserPreferences() {
  // Load dark mode preference
  const savedDarkMode = localStorage.getItem("darkMode")
  if (savedDarkMode === "true") {
    isDarkMode = true
    document.getElementById("darkModeToggle").checked = true
    document.body.setAttribute("data-theme", "dark")
  }

  // Load language preference
  const savedLanguage = localStorage.getItem("language")
  if (savedLanguage) {
    currentLanguage = savedLanguage
    document.getElementById("languageSelect").value = savedLanguage
  }

  // Load other preferences
  const emailNotifications = localStorage.getItem("emailNotifications")
  if (emailNotifications !== null) {
    document.getElementById("emailNotifications").checked = emailNotifications === "true"
  }

  const pushNotifications = localStorage.getItem("pushNotifications")
  if (pushNotifications !== null) {
    document.getElementById("pushNotifications").checked = pushNotifications === "true"
  }

  const privacy = localStorage.getItem("privacy")
  if (privacy) {
    document.getElementById("privacySelect").value = privacy
  }
}

function loadUserData() {
  // Simulate loading user data
  const userData = {
    fullName: "John Doe",
    email: "john.doe@university.edu",
    studentId: "STU123456",
    phone: "+1 (555) 123-4567",
    totalPoints: 1250,
    itemsReturned: 5,
    itemsReported: 10,
  }

  // Populate form fields
  if (document.getElementById("fullName")) {
    document.getElementById("fullName").value = userData.fullName
  }
  if (document.getElementById("email")) {
    document.getElementById("email").value = userData.email
  }
  if (document.getElementById("studentId")) {
    document.getElementById("studentId").value = userData.studentId
  }
  if (document.getElementById("phone")) {
    document.getElementById("phone").value = userData.phone
  }
}

function setupFormHandlers() {
  // Profile form
  const profileForm = document.querySelector(".profile-form")
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()
      updateProfile()
    })
  }

  // Settings form
  const settingsForm = document.querySelector(".settings-content")
  if (settingsForm) {
    const inputs = settingsForm.querySelectorAll("input, select")
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        // Auto-save settings on change
        setTimeout(saveSettings, 500)
      })
    })
  }
}

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
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

function getNotificationIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  }
  return icons[type] || icons.info
}

function getNotificationColor(type) {
  const colors = {
    success: "#4CAF50",
    error: "#f44336",
    warning: "#ff9800",
    info: "#2196F3",
  }
  return colors[type] || colors.info
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    // Clear user data
    localStorage.clear()

    // Show logout message
    showNotification("Logging out...", "info")

    // Redirect to login page after delay
    setTimeout(() => {
      window.location.href = "login.html"
    }, 1500)
  }
}

function toggleProfile() {
  // Toggle profile dropdown or navigate to account panel
  showPanel("account")
  setActiveNavItem(document.querySelector('[data-panel="account"]'))
}

function subscribeNewsletter() {
  const email = document.getElementById("newsletterEmail").value
  if (email) {
    showNotification("Successfully subscribed to newsletter!", "success")
    document.getElementById("newsletterEmail").value = ""
  } else {
    showNotification("Please enter a valid email address", "error")
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
    
    .match-details {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }
    
    .match-info-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background: #f8f8f8;
        border-radius: 10px;
    }
    
    .status-badge {
        background: var(--primary-color);
        color: var(--text-color);
        padding: 8px 16px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
    }
    
    .detailed-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
    
    .item-detail-card {
        background: #f8f8f8;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
    }
    
    .item-detail-card h5 {
        margin-bottom: 15px;
        color: var(--text-color);
        font-weight: 600;
    }
    
    .item-detail-card img {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 15px;
    }
    
    .item-info-detailed {
        text-align: left;
    }
    
    .item-info-detailed p {
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .match-actions-detailed {
        display: flex;
        gap: 15px;
        justify-content: center;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
    }
    
    @media (max-width: 768px) {
        .detailed-comparison {
            grid-template-columns: 1fr;
        }
        
        .match-actions-detailed {
            flex-direction: column;
        }
    }
`
document.head.appendChild(style)
