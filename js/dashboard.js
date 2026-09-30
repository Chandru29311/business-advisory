/* STACKLY Business Advisory - Dashboards Script */

document.addEventListener('DOMContentLoaded', () => {
  // Load and display logged-in User Email and Role from Login page
  const savedEmail = localStorage.getItem('userEmail');
  const savedRole = localStorage.getItem('userRole');
  const isAdminPage = window.location.pathname.includes('AdminDashboard.html') || document.title.includes('Admin');

  const displayEmail = savedEmail || (isAdminPage ? 'admin@stackly.com' : 'client@stackly.com');
  const displayRole = (savedRole || (isAdminPage ? 'Admin' : 'Client')) + ' Portal';

  // Compute avatar initials
  let initials = isAdminPage ? 'AD' : 'CL';
  if (savedEmail) {
    const emailPrefix = savedEmail.split('@')[0];
    const parts = emailPrefix.split(/[._-]/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (emailPrefix.length >= 2) {
      initials = emailPrefix.substring(0, 2).toUpperCase();
    } else if (emailPrefix.length === 1) {
      initials = emailPrefix[0].toUpperCase();
    }
  }

  document.querySelectorAll('.user-display-email-text').forEach(el => {
    el.textContent = displayEmail;
  });

  document.querySelectorAll('.user-display-role-text').forEach(el => {
    el.textContent = displayRole;
  });

  document.querySelectorAll('.user-avatar-icon').forEach(el => {
    el.textContent = initials;
  });

  // Extract first letter of email ID for mobile profile circle (Red marked area)
  const emailFirstLetter = displayEmail ? displayEmail.trim()[0].toUpperCase() : (isAdminPage ? 'A' : 'C');
  document.querySelectorAll('.user-avatar-firstletter').forEach(el => {
    el.textContent = emailFirstLetter;
  });

  // Mobile Sidebar Toggle Handling
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebar = document.querySelector('.sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const mobilePageTitle = document.getElementById('mobile-page-title');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeSidebar);
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  // Setup Tab Navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');
  const chartInstances = [];

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTabId = link.getAttribute('data-tab');

      // Update active state in sidebar links
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update mobile topbar page title (Green marked area)
      const menuTextEl = link.querySelector('span:not(.icon)');
      if (menuTextEl && mobilePageTitle) {
        mobilePageTitle.textContent = menuTextEl.textContent.trim();
      }

      // Close mobile sidebar on selection
      closeSidebar();

      // Hide all tabs & activate target tab
      tabContents.forEach(tab => {
        if (tab.id === targetTabId) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });

      // Resize all Chart.js instances inside newly active tab
      setTimeout(() => {
        chartInstances.forEach(chart => {
          if (chart && typeof chart.resize === 'function') {
            chart.resize();
          }
        });
      }, 50);
    });
  });

  if (typeof Chart === 'undefined') return;

  // Chart defaults for dark theme
  Chart.defaults.color = '#94a3b8';
  Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.08)';

  // Helper to create chart and push to instances array
  function buildChart(id, config) {
    const canvas = document.getElementById(id);
    if (canvas) {
      const instance = new Chart(canvas, config);
      chartInstances.push(instance);
      return instance;
    }
    return null;
  }

  // ================= ADMIN DASHBOARD CHARTS =================
  buildChart('adminRevenueChart', {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [{
        label: 'Advisory Revenue ($)',
        data: [120000, 145000, 160000, 185000, 210000, 240000, 280000, 310000, 345000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminClientChart', {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4 Target'],
      datasets: [
        { label: 'Startups', data: [35, 42, 58, 70], backgroundColor: '#10b981' },
        { label: 'SMEs', data: [40, 50, 65, 80], backgroundColor: '#34d399' },
        { label: 'Enterprises', data: [15, 20, 25, 35], backgroundColor: '#059669' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminSessionChart', {
    type: 'doughnut',
    data: {
      labels: ['Strategic Planning', 'Financial Advisory', 'Growth Consulting', 'Risk Management', 'Digital Transformation'],
      datasets: [{
        data: [35, 25, 20, 10, 10],
        backgroundColor: ['#10b981', '#34d399', '#059669', '#3b82f6', '#8b5cf6']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminPerformanceChart', {
    type: 'radar',
    data: {
      labels: ['Strategy Alignment', 'Cost Efficiency', 'Market Reach', 'Risk Preparedness', 'Digital Index'],
      datasets: [{
        label: 'Client Portfolio Average Score',
        data: [88, 92, 79, 95, 85],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.2)'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Admin Tab 2: Clients
  buildChart('adminClientRetentionChart', {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        { label: 'New Onboarded', data: [18, 24, 32, 40], borderColor: '#10b981', fill: false },
        { label: 'Retained Accounts', data: [16, 23, 31, 39], borderColor: '#3b82f6', fill: false }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminClientIndustryChart', {
    type: 'doughnut',
    data: {
      labels: ['Logistics', 'Fintech', 'Healthcare', 'E-Commerce', 'Artificial Intelligence'],
      datasets: [{
        data: [30, 28, 18, 14, 10],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Admin Tab 3: Advisory Services
  buildChart('adminServiceUtilizationChart', {
    type: 'bar',
    data: {
      labels: ['Strategic Growth', 'Financial Audit', 'Digital AI', 'Risk & Governance'],
      datasets: [{
        label: 'Hours Delivered',
        data: [450, 380, 320, 270],
        backgroundColor: '#10b981'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminServiceRevenueChart', {
    type: 'doughnut',
    data: {
      labels: ['Strategic Growth', 'Financial Advisory', 'Tech & AI', 'Risk Management'],
      datasets: [{
        data: [40, 25, 20, 15],
        backgroundColor: ['#10b981', '#34d399', '#3b82f6', '#fbbf24']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Admin Tab 4: Reports
  buildChart('adminReportTypeChart', {
    type: 'bar',
    data: {
      labels: ['Strategic', 'Financial', 'Market Intel', 'Tech Audit'],
      datasets: [{
        label: 'Reports Published',
        data: [85, 92, 64, 71],
        backgroundColor: '#3b82f6'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminComplianceScoreChart', {
    type: 'line',
    data: {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
      datasets: [{
        label: 'Compliance Index (%)',
        data: [91, 93, 95, 94, 98],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Admin Tab 5: Appointments
  buildChart('adminAppointmentVolumeChart', {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Sessions Scheduled',
        data: [8, 12, 10, 14, 9],
        backgroundColor: '#10b981'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('adminAdvisorLoadChart', {
    type: 'doughnut',
    data: {
      labels: ['Dr. Marcus Vance', 'Sarah Jenkins', 'David Chen', 'Elena Rostova'],
      datasets: [{
        data: [35, 28, 22, 15],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // ================= CLIENT DASHBOARD CHARTS =================
  buildChart('clientRevenueChart', {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        label: 'Revenue ($)',
        data: [450000, 580000, 720000, 950000],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientCustomerChart', {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'New Customers Acquired',
        data: [120, 190, 240, 310, 420, 560],
        backgroundColor: '#34d399'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientExpenseChart', {
    type: 'bar',
    data: {
      labels: ['R&D', 'Marketing', 'Operations', 'Advisory Services'],
      datasets: [
        { label: 'Budgeted', data: [100000, 150000, 120000, 50000], backgroundColor: '#64748b' },
        { label: 'Actual Spent', data: [85000, 140000, 110000, 48000], backgroundColor: '#10b981' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientKPIPerformanceChart', {
    type: 'doughnut',
    data: {
      labels: ['Milestones Completed', 'In Progress', 'Pending'],
      datasets: [{
        data: [75, 20, 5],
        backgroundColor: ['#10b981', '#fbbf24', '#ef4444']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Client Tab 2: My Business
  buildChart('clientDeptBudgetChart', {
    type: 'bar',
    data: {
      labels: ['NA Sales', 'APAC Ops', 'R&D AI', 'Supply Chain'],
      datasets: [
        { label: 'Budget ($)', data: [1200000, 850000, 650000, 500000], backgroundColor: '#3b82f6' },
        { label: 'Spent ($)', data: [1050000, 780000, 590000, 440000], backgroundColor: '#10b981' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientQuarterlyProfitChart', {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4 Est'],
      datasets: [{
        label: 'Profit Margin (%)',
        data: [18.5, 21.0, 24.5, 27.8],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Client Tab 3: Advisory Plan
  buildChart('clientPlanUsageChart', {
    type: 'doughnut',
    data: {
      labels: ['Hours Consumed', 'Hours Remaining'],
      datasets: [{
        data: [28, 12],
        backgroundColor: ['#10b981', '#334155']
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientPlanDeliverablesChart', {
    type: 'bar',
    data: {
      labels: ['Strategic Board', 'Financial Audit', 'AI Arch.'],
      datasets: [
        { label: 'Completed', data: [16, 8, 4], backgroundColor: '#10b981' },
        { label: 'Allocated Goal', data: [20, 10, 10], backgroundColor: '#64748b' }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Client Tab 4: Strategy
  buildChart('clientStrategyProgressChart', {
    type: 'bar',
    data: {
      labels: ['Tech & Ops', 'Governance', 'Supply Chain', 'Global Expansion'],
      datasets: [{
        label: 'Progress (%)',
        data: [82, 60, 88, 45],
        backgroundColor: '#10b981'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientRiskMatrixChart', {
    type: 'radar',
    data: {
      labels: ['Cybersecurity', 'Financial Risk', 'Market Volatility', 'Supply Chain', 'Compliance'],
      datasets: [{
        label: 'Preparedness Score',
        data: [92, 88, 76, 85, 95],
        borderColor: '#34d399',
        backgroundColor: 'rgba(52, 211, 153, 0.2)'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Client Tab 5: Reports
  buildChart('clientReportDownloadsChart', {
    type: 'bar',
    data: {
      labels: ['Financial', 'Strategy', 'Governance', 'Operations'],
      datasets: [{
        label: 'Downloads',
        data: [42, 68, 31, 25],
        backgroundColor: '#3b82f6'
      }]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  buildChart('clientBenchmarkChart', {
    type: 'line',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        { label: 'Our Company', data: [82, 86, 91, 94], borderColor: '#10b981', fill: false },
        { label: 'Industry Avg', data: [70, 72, 73, 75], borderColor: '#94a3b8', borderDash: [5, 5], fill: false }
      ]
    },
    options: { responsive: true, maintainAspectRatio: false }
  });

  // Debounced window resize handler for chart responsiveness
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      chartInstances.forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
          chart.resize();
        }
      });
    }, 150);
  });
});
