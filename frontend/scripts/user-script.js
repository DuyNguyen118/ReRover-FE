// Global state
let currentPanel = "matches"
let isDarkMode = false
let currentLanguage = "en"


// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard()
  setupEventListeners()
  loadUserPreferences()
  
  toggleFormFields(false);
  
  // Set up edit button
  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    editBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleFormFields(true);
    });
  }
  
  // Set up form submission
  const form = document.getElementById('profile-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await updateProfile(e);
      // After successful update, keep the form locked
      toggleFormFields(false);
    });
  }
});

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

async function updateProfile(event) {
  if (event) {
    event.preventDefault();
  }
  
  if (!window.currentUser || !window.currentUser.id) {
    showNotification('Please log in to update your profile', 'error');
    return;
  }

  // Get the form elements
  const fullname = document.getElementById("fullname");
  const email = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");
  const studentId = document.getElementById("student_id");
  
  // Lock the form during submission
  const form = document.getElementById('profile-form');
  if (form) {
    const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
    inputs.forEach(input => {
      input.disabled = true;
    });
  }

  const formData = {
    id: window.currentUser.id,
    fullname: fullname?.value || '',
    email: email?.value || '',
    phoneNumber: phoneNumber?.value || '',
    studentId: studentId?.value || '',
    createdAt: window.currentUser.createdAt,
    meritPoint: window.currentUser.meritPoint
  };

  try {
    const response = await fetch(`http://localhost:8080/api/user/${window.currentUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    
    // Handle redirects
    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser = await response.json();
    window.currentUser = { ...window.currentUser, ...updatedUser };
    
    // Update session storage
    const sessionUser = JSON.parse(sessionStorage.getItem('user') || '{}');
    sessionStorage.setItem('user', JSON.stringify({ ...sessionUser, ...updatedUser }));
    
    updateUIWithUserData(window.currentUser);
    showNotification("Profile updated successfully!", "success");

  } catch (error) {
    console.error('Error updating profile:', error);
    showNotification(error.message || 'Failed to update profile. Please try again.', 'error');
    
    // If there's an error, re-enable the form for editing
    if (form) {
      const inputs = form.querySelectorAll('input:not([type="hidden"]), textarea, select');
      inputs.forEach(input => {
        input.disabled = false;
      });
    }
  }
}

// Remove any duplicate event listeners
document.getElementById('profile-form')?.removeEventListener('submit', updateProfile);
document.getElementById('profile-form')?.addEventListener('submit', updateProfile);

function changeProfilePhoto() {
  document.getElementById("photoInput").click()
}

function showNotification(message, type = 'info') {
  // You can implement this or use an existing notification system
  alert(`${type.toUpperCase()}: ${message}`);
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

// Settings management
function toggleDarkMode() {
  isDarkMode = !isDarkMode
  document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light")

  // Save preference
  sessionStorage.setItem("darkMode", isDarkMode)

  showNotification(`${isDarkMode ? "Dark" : "Light"} mode enabled`, "info")
}

function changeLanguage() {
  const select = document.getElementById("languageSelect")
  currentLanguage = select.value

  // Save preference
  sessionStorage.setItem("language", currentLanguage)

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

  // Save to sessionStorage
  Object.keys(settings).forEach((key) => {
    sessionStorage.setItem(key, settings[key])
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
  const savedDarkMode = sessionStorage.getItem("darkMode")
  if (savedDarkMode === "true") {
    isDarkMode = true
    document.getElementById("darkModeToggle").checked = true
    document.body.setAttribute("data-theme", "dark")
  }

  // Load language preference
  const savedLanguage = sessionStorage.getItem("language")
  if (savedLanguage) {
    currentLanguage = savedLanguage
    document.getElementById("languageSelect").value = savedLanguage
  }

  // Load other preferences
  const emailNotifications = sessionStorage.getItem("emailNotifications")
  if (emailNotifications !== null) {
    document.getElementById("emailNotifications").checked = emailNotifications === "true"
  }

  const pushNotifications = sessionStorage.getItem("pushNotifications")
  if (pushNotifications !== null) {
    document.getElementById("pushNotifications").checked = pushNotifications === "true"
  }

  const privacy = sessionStorage.getItem("privacy")
  if (privacy) {
    document.getElementById("privacySelect").value = privacy
  }
}

async function loadUserData() {
  try {
    // Get user data from session storage
    const userData = JSON.parse(sessionStorage.getItem('user'));
    
    if (!userData || !userData.id) {
      throw new Error('No user data found');
    }

    // If we have the full user data in session, use it
    if (userData.fullname && userData.email) {
      window.currentUser = userData;
      updateUIWithUserData(userData);
      return userData;
    }

    // Otherwise, fetch fresh data from the server
    const response = await fetch(`http://localhost:8080/api/users/${userData.id}`, {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to load user data');
    }

    const freshUserData = await response.json();
    
    // Update session storage with fresh data
    sessionStorage.setItem('user', JSON.stringify(freshUserData));
    window.currentUser = freshUserData;
    updateUIWithUserData(freshUserData);
    return freshUserData;

  } catch (error) {
    console.error('Error loading user data:', error);
    // If we're not on the login page, redirect there
    if (!window.location.pathname.endsWith('login.html')) {
      window.location.href = '/login.html';
    }
    return null;
  }
}

// Helper function to update UI with user data
function updateUIWithUserData(userData) {
  if (!userData) return;
  
  // Update form fields
  const fields = {
    'fullname': userData.fullname || '',
    'email': userData.email || '',
    'student_id': userData.studentId || '',
    'phoneNumber': userData.phoneNumber || ''
  };
  
  Object.entries(fields).forEach(([id, value]) => {
    const element = document.getElementById(id);
    if (element) {
      element.value = value;
    }
  });
  
  // Update any other UI elements as needed
  if (userData.profilePicture) {
    const profilePhoto = document.getElementById('profilePhoto');
    if (profilePhoto) {
      profilePhoto.src = userData.profilePicture;
    }
  }
}

function updateUserStats(userData) {
  // Update points and stats in the UI if elements exist
  const pointsElement = document.getElementById('userPoints');
  const itemsReturnedElement = document.getElementById('itemsReturned');
  const itemsReportedElement = document.getElementById('itemsReported');
  
  if (pointsElement) pointsElement.textContent = userData.points || 0;
  if (itemsReturnedElement) itemsReturnedElement.textContent = userData.itemsReturned || 0;
  if (itemsReportedElement) itemsReportedElement.textContent = userData.itemsReported || 0;
  
  // Update profile picture if available
  const profilePic = document.getElementById('profilePic');
  if (profilePic && userData.profilePicture) {
    profilePic.src = userData.profilePicture;
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

async function logout() {
  try {
      // Clear all client-side storage first
      sessionStorage.clear();
      localStorage.clear();

      // Clear all cookies
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          const [name] = cookie.split('=');
          // Clear with and without domain
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      }

      // Call server-side logout
      try {
          await fetch('http://localhost:8080/api/auth/logout', {
              method: 'POST',
              credentials: 'include',
              headers: {
                  'Cache-Control': 'no-cache, no-store, must-revalidate',
                  'Pragma': 'no-cache',
                  'Expires': '0'
              }
          });
      } catch (e) {
          console.error('Logout API call failed:', e);
          // Continue with redirect even if API call fails
      }

      // Clear storage again to be safe
      sessionStorage.clear();
      localStorage.clear();

      // Add a small delay to ensure everything is cleared
      await new Promise(resolve => setTimeout(resolve, 100));

      // Redirect to login with a timestamp to prevent caching
      window.location.href = `/login.html?t=${new Date().getTime()}`;
      
  } catch (error) {
      console.error('Logout error:', error);
      // Final cleanup and redirect
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login.html';
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

// Add this function to handle form field toggling
function toggleFormFields(enable) {
  const form = document.getElementById('profile-form');
  if (!form) return;
  
  // Get all form inputs except hidden ones and buttons
  const inputs = form.querySelectorAll(`
    input:not([type="hidden"]):not([type="button"]):not([type="submit"]), 
    textarea, 
    select
  `);
  
  inputs.forEach(input => {
    input.disabled = !enable;
  });
}
