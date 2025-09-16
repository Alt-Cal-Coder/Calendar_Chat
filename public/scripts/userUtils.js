/**
 * User Utilities for accessing user data across the application
 */

// Get current user data from localStorage
function getCurrentUser() {
  const userDataString = localStorage.getItem('userData');
  return userDataString ? JSON.parse(userDataString) : null;
}

// Check if current user is admin
function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem('isCreator') === 'true' && !!getCurrentUser();
}

// Listen for user data changes
function onUserDataLoaded(callback) {
  document.addEventListener('userDataLoaded', (event) => {
    callback(event.detail);
  });
}

// Refresh user data from server
async function refreshUserData() {
  const userId = document.cookie
    .split('; ')
    .find(row => row.startsWith('creatorId='))
    ?.split('=')[1];
    
  if (userId) {
    try {
      const response = await fetch(`/user/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem("userData", JSON.stringify(data.user));
        return data.user;
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  }
  return null;
}