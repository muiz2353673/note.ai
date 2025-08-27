// Utility to check if demo features should be visible
export const isDevMode = (): boolean => {
  // Check if we're in development environment
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Check if developer has explicitly enabled demo mode
  const devModeEnabled = localStorage.getItem('devMode') === 'true';
  
  // Check if we're on localhost (additional safety)
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  
  return isDevelopment && (devModeEnabled || isLocalhost);
};

// Function to toggle dev mode
export const toggleDevMode = (): void => {
  const currentMode = localStorage.getItem('devMode') === 'true';
  localStorage.setItem('devMode', (!currentMode).toString());
  // Reload the page to apply changes
  window.location.reload();
};

// Function to enable dev mode
export const enableDevMode = (): void => {
  localStorage.setItem('devMode', 'true');
};

// Function to disable dev mode
export const disableDevMode = (): void => {
  localStorage.setItem('devMode', 'false');
};
