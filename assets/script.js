/**
 * CityLink Cyber Café — Main JavaScript File
 * Handles: 
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Booking form with validation
 * - Dynamic service selection
 * - Receipt generation
 * - Accessibility features
 */

class CityLinkApp {
  constructor() {
    // DOM Elements
    this.elements = {
      hamburger: document.getElementById('hamburger'),
      mobileMenu: document.getElementById('mobile-menu'),
      bookingForm: document.getElementById('booking-form'),
      formStatus: document.getElementById('form-status'),
      currentYear: document.getElementById('current-year'),
      backToTop: document.querySelector('.back-to-top'),
      serviceTypeSelect: document.getElementById('service-type'),
      serviceDetailsSelect: document.getElementById('service-details'),
      receiptSection: document.getElementById('receipt')
    };

    // Service mappings with prices
    this.SERVICE_OPTIONS = {
      printing: [
        { value: 'bw_printing', label: 'B&W Printing', price: 10 },
        { value: 'color_printing', label: 'Color Printing', price: 30 },
        { value: 'scanning', label: 'Scanning', price: 20 },
        { value: 'binding', label: 'Binding', price: 150 },
        { value: 'lamination', label: 'Lamination', price: 50 }
      ],
      portal: [
        { value: 'kra', label: 'KRA Services', price: 200 },
        { value: 'kuccps', label: 'KUCCPS Placement', price: 300 },
        { value: 'ntsa', label: 'NTSA Services', price: 250 },
        { value: 'helb', label: 'HELB Applications', price: 200 },
        { value: 'ecitizen', label: 'eCitizen Services', price: 150 },
        { value: 'tsc', label: 'TSC Portal', price: 200 }
      ],
      typing: [
        { value: 'typing', label: 'Typing Service', price: 100 },
        { value: 'cv', label: 'CV Preparation', price: 300 },
        { value: 'thesis', label: 'Thesis Formatting', price: 30 },
        { value: 'editing', label: 'Document Editing', price: 20 }
      ],
      it: [
        { value: 'internet_setup', label: 'Internet Setup', price: 500 },
        { value: 'router_config', label: 'Router Configuration', price: 300 },
        { value: 'software_install', label: 'Software Installation', price: 200 },
        { value: 'email_setup', label: 'Email Setup', price: 200 },
        { value: 'virus_removal', label: 'Virus Removal', price: 400 }
      ],
      other: [
        { value: 'research', label: 'Research Assistance', price: 200 },
        { value: 'training', label: 'Computer Training', price: 500 },
        { value: 'other', label: 'Other Service', price: 0 }
      ]
    };

    // Initialize the app
    this.init();
  }

  /**
   * Initialize the application
   */
  init() {
    // Set current year in footer
    this.setCurrentYear();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Initialize components
    this.setupAccessibility();
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Mobile menu toggle
    if (this.elements.hamburger && this.elements.mobileMenu) {
      this.setupMobileMenu();
    }
    
    // Smooth scrolling for anchor links
    document.addEventListener('click', this.handleSmoothScroll.bind(this));
    
    // Service type and details selection
    if (this.elements.serviceTypeSelect && this.elements.serviceDetailsSelect) {
      this.setupServiceSelection();
    }
    
    // Booking form handling
    if (this.elements.bookingForm) {
      this.setupBookingForm();
    }
    
    // Back to top button
    if (this.elements.backToTop) {
      this.setupBackToTop();
    }
  }

  /**
   * Set current year in footer
   */
  setCurrentYear() {
    if (this.elements.currentYear) {
      this.elements.currentYear.textContent = new Date().getFullYear();
    }
  }

  /**
   * Setup mobile menu toggle functionality
   */
  setupMobileMenu() {
    const { hamburger, mobileMenu } = this.elements;

    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.hidden = isExpanded;
      
      // Update aria-label
      const label = isExpanded ? 'Open menu' : 'Close menu';
      hamburger.setAttribute('aria-label', label);
    });

    // Close menu when clicking on links
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open menu');
        mobileMenu.hidden = true;
      }
    });
  }

  /**
   * Handle smooth scrolling for anchor links
   * @param {Event} e - Click event
   */
  handleSmoothScroll(e) {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Focus the target for keyboard users
      setTimeout(() => {
        targetElement.focus({ preventScroll: true });
      }, 600);
    }
  }

  /**
   * Setup service type and details selection
   */
  setupServiceSelection() {
    const { serviceTypeSelect, serviceDetailsSelect } = this.elements;

    serviceTypeSelect.addEventListener('change', (e) => {
      const selectedType = e.target.value;
      const options = this.SERVICE_OPTIONS[selectedType] || [];
      
      // Clear existing options
      serviceDetailsSelect.innerHTML = '';
      
      // Add default option
      const defaultOption = new Option('Select specific service', '', true, true);
      defaultOption.disabled = true;
      serviceDetailsSelect.add(defaultOption);
      
      // Add new options
      options.forEach(option => {
        const optElement = new Option(
          `${option.label} - KSh ${option.price}`,
          option.value
        );
        optElement.dataset.price = option.price;
        serviceDetailsSelect.add(optElement);
      });
    });
  }

  /**
   * Setup booking form validation and submission
   */
  setupBookingForm() {
    const { bookingForm, formStatus, serviceDetailsSelect } = this.elements;

    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous status
      this.resetFormStatus();
      
      // Validate form
      if (!this.validateBookingForm()) {
        this.showFormError('Please fix the errors above.');
        return;
      }
      
      try {
        // Disable submit button and show loading state
        this.setFormLoadingState(true);
        
        // Get form data
        const formData = this.getFormData();
        
        // Simulate network delay
        await this.simulateNetworkRequest();
        
        // Generate and show receipt
        this.generateReceipt(formData);
        
        // Show success message
        this.showFormSuccess('Booking submitted successfully! Your receipt is ready below.');
        
      } catch (error) {
        console.error('Form submission error:', error);
        this.showFormError('Error submitting form. Please try again or call us.');
      } finally {
        // Re-enable submit button
        this.setFormLoadingState(false);
      }
    });
  }

  /**
   * Reset form status message
   */
  resetFormStatus() {
    if (this.elements.formStatus) {
      this.elements.formStatus.textContent = '';
      this.elements.formStatus.className = 'form-status';
    }
  }

  /**
   * Show form error message
   * @param {string} message - Error message to display
   */
  showFormError(message) {
    if (this.elements.formStatus) {
      this.elements.formStatus.textContent = message;
      this.elements.formStatus.classList.add('error');
    }
  }

  /**
   * Show form success message
   * @param {string} message - Success message to display
   */
  showFormSuccess(message) {
    if (this.elements.formStatus) {
      this.elements.formStatus.textContent = message;
      this.elements.formStatus.classList.add('success');
    }
  }

  /**
   * Set form loading state
   * @param {boolean} isLoading - Whether form is loading
   */
  setFormLoadingState(isLoading) {
    const submitBtn = this.elements.bookingForm?.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="btn-loader"></span> Processing...';
    } else {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Booking';
    }
  }

  /**
   * Get form data as an object
   * @returns {Object} Form data
   */
  getFormData() {
    const { bookingForm, serviceDetailsSelect } = this.elements;
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());
    
    // Get selected service details
    const selectedOption = serviceDetailsSelect.options[serviceDetailsSelect.selectedIndex];
    data.servicePrice = selectedOption.dataset.price || 0;
    data.serviceLabel = selectedOption.textContent.split(' - ')[0];
    
    return data;
  }

  /**
   * Simulate network request with delay
   * @returns {Promise} Resolves after delay
   */
  simulateNetworkRequest() {
    return new Promise(resolve => setTimeout(resolve, 1500));
  }

  /**
   * Validate booking form fields
   * @returns {boolean} Whether form is valid
   */
  validateBookingForm() {
    let isValid = true;
    
    // Validate name
    const name = document.getElementById('cust-name');
    if (!name.value.trim()) {
      this.showFieldError('cust-name', 'Name is required');
      isValid = false;
    } else if (name.value.trim().length < 2) {
      this.showFieldError('cust-name', 'Name must be at least 2 characters');
      isValid = false;
    } else {
      this.clearFieldError('cust-name');
    }
    
    // Validate phone
    const phone = document.getElementById('cust-phone');
    const phoneRegex = /^[0-9]{9,12}$/;
    if (!phone.value.trim()) {
      this.showFieldError('cust-phone', 'Phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(phone.value.trim())) {
      this.showFieldError('cust-phone', 'Enter a valid phone number (9-12 digits)');
      isValid = false;
    } else {
      this.clearFieldError('cust-phone');
    }
    
    // Validate email (optional)
    const email = document.getElementById('cust-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() && !emailRegex.test(email.value.trim())) {
      this.showFieldError('cust-email', 'Enter a valid email address');
      isValid = false;
    } else {
      this.clearFieldError('cust-email');
    }
    
    // Validate service type
    const serviceType = document.getElementById('service-type');
    if (!serviceType.value) {
      this.showFieldError('service-type', 'Please select a service type');
      isValid = false;
    } else {
      this.clearFieldError('service-type');
    }
    
    // Validate service details
    const serviceDetails = document.getElementById('service-details');
    if (!serviceDetails.value) {
      this.showFieldError('service-details', 'Please select a specific service');
      isValid = false;
    } else {
      this.clearFieldError('service-details');
    }
    
    return isValid;
  }

  /**
   * Show error message for a form field
   * @param {string} fieldId - ID of the field
   * @param {string} message - Error message
   */
  showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('visible');
    }
  }

  /**
   * Clear error message for a form field
   * @param {string} fieldId - ID of the field
   */
  clearFieldError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('visible');
    }
  }

  /**
   * Generate and display receipt
   * @param {Object} data - Form data
   */
  generateReceipt(data) {
    const { receiptSection } = this.elements;
    if (!receiptSection) return;
    
    // Format current date and time
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    const formattedDate = now.toLocaleDateString('en-KE', options);
    
    // Create receipt HTML
    receiptSection.innerHTML = this.createReceiptHTML(data, formattedDate);
    receiptSection.hidden = false;
    receiptSection.setAttribute('aria-hidden', 'false');
    
    // Scroll to receipt
    setTimeout(() => {
      receiptSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    
    // Setup receipt buttons
    this.setupReceiptButtons();
  }

  /**
   * Create receipt HTML
   * @param {Object} data - Form data
   * @param {string} formattedDate - Formatted date string
   * @returns {string} HTML string for receipt
   */
  createReceiptHTML(data, formattedDate) {
    return `
      <div class="receipt-container">
        <header class="receipt-header">
          <h2>CityLink Cyber Café</h2>
          <p>Kenyatta Avenue, Nairobi</p>
          <p>Tel: 0726 550 759</p>
          <div class="receipt-divider"></div>
        </header>
        
        <div class="receipt-details">
          <div class="receipt-meta">
            <p><strong>Receipt #:</strong> ${Math.floor(100000 + Math.random() * 900000)}</p>
            <p><strong>Date:</strong> ${formattedDate}</p>
          </div>
          
          <div class="customer-info">
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${data['cust-name']}</p>
            <p><strong>Phone:</strong> ${data['cust-phone']}</p>
            ${data['cust-email'] ? `<p><strong>Email:</strong> ${data['cust-email']}</p>` : ''}
          </div>
          
          <div class="service-info">
            <h3>Service Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${data.serviceLabel}</td>
                  <td>KSh ${data.servicePrice}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>KSh ${data.servicePrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          ${data['booking-notes'] ? `
          <div class="notes">
            <h3>Customer Notes</h3>
            <p>${data['booking-notes']}</p>
          </div>
          ` : ''}
          
          <div class="receipt-footer">
            <p class="thank-you">Thank you for choosing CityLink Cyber Café</p>
            <p>Please present this receipt when you visit.</p>
            <p class="disclaimer">This is a computer-generated receipt. No signature required.</p>
          </div>
        </div>
      </div>
      
      <div class="receipt-actions">
        <button class="btn primary" data-action="print">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 14H6v8h12v-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Print Receipt
        </button>
        <button class="btn secondary" data-action="new-booking">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          New Booking
        </button>
      </div>
    `;
  }

  /**
   * Setup receipt buttons functionality
   */
  setupReceiptButtons() {
    const { receiptSection, bookingForm } = this.elements;
    
    // Print button
    const printBtn = receiptSection.querySelector('[data-action="print"]');
    if (printBtn) {
      printBtn.addEventListener('click', this.handlePrintReceipt.bind(this));
    }
    
    // New booking button
    const newBookingBtn = receiptSection.querySelector('[data-action="new-booking"]');
    if (newBookingBtn) {
      newBookingBtn.addEventListener('click', () => {
        bookingForm.reset();
        receiptSection.hidden = true;
        receiptSection.setAttribute('aria-hidden', 'true');
        receiptSection.innerHTML = '';
        document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  /**
   * Handle printing the receipt
   */
  handlePrintReceipt() {
    // Create print-specific styles
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        #receipt,
        #receipt * {
          visibility: visible;
        }
        #receipt {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
          margin: 0;
          border: none;
          box-shadow: none;
        }
        .receipt-actions {
          display: none !important;
        }
      }
    `;
    
    // Create style element
    const style = document.createElement('style');
    style.textContent = printStyles;
    document.head.appendChild(style);
    
    // Print the receipt
    window.print();
    
    // Remove the style after printing
    setTimeout(() => {
      document.head.removeChild(style);
    }, 1000);
  }

  /**
   * Setup back to top button
   */
  setupBackToTop() {
    const { backToTop } = this.elements;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      document.getElementById('main-content').focus();
    });
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    // Show focus outlines for keyboard users
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('show-focus');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
    
    // Add aria-live regions for dynamic content
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => {
      region.setAttribute('aria-atomic', 'true');
    });
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CityLinkApp();
});