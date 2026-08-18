document.addEventListener('DOMContentLoaded', () => {
  const toastEl = document.getElementById('appToast');
  const toastMessage = document.getElementById('toastMessage');
  const toast = new bootstrap.Toast(toastEl, { delay: 2200 });

  const showToast = (message) => {
    toastMessage.textContent = message;
    toast.show();
  };

  // Sidebar navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.remove('open');
    });
  });

  // Mobile sidebar
  document.getElementById('mobileMenu').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Theme toggle
  document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark');
    showToast(document.body.classList.contains('dark') ? 'Dark mode enabled' : 'Light mode enabled');
  });

  // Period dropdown
  document.querySelectorAll('.period-option').forEach(option => {
    option.addEventListener('click', () => {
      document.getElementById('periodBtn').firstChild.textContent = option.textContent;
      showToast(`Showing data for ${option.textContent.toLowerCase()}`);
    });
  });

  // Search appointments
  const search = document.getElementById('globalSearch');
  const sideSearch = document.getElementById('sideSearch');
  const filterRows = (value) => {
    const term = value.trim().toLowerCase();
    document.querySelectorAll('#appointmentTable tbody tr').forEach(row => {
      row.style.display = row.dataset.name.toLowerCase().includes(term) ? '' : 'none';
    });
  };
  search.addEventListener('input', e => filterRows(e.target.value));
  sideSearch.addEventListener('input', e => {
    search.value = e.target.value;
    filterRows(e.target.value);
  });

  // Keyboard shortcut
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      search.focus();
    }
  });

  // Appointment date selection
  document.querySelectorAll('.date').forEach(date => {
    date.addEventListener('click', () => {
      document.querySelectorAll('.date').forEach(d => d.classList.remove('selected-date'));
      date.classList.add('selected-date');
      showToast(`Appointments loaded for December ${date.textContent}`);
    });
  });

  // Table actions
  document.querySelectorAll('.blue-action').forEach(btn => {
    btn.addEventListener('click', () => showToast('Patient report opened'));
  });
  document.querySelectorAll('.red-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const name = row.dataset.name;
      row.remove();
      showToast(`${name}'s appointment removed`);
    });
  });

  // Export appointments as CSV
  document.getElementById('exportBtn').addEventListener('click', () => {
    const rows = [['Patient', 'Doctor', 'Time', 'Date', 'Disease']];
    document.querySelectorAll('#appointmentTable tbody tr').forEach(row => {
      if (row.style.display === 'none') return;
      const cells = row.querySelectorAll('td');
      rows.push([
        row.dataset.name,
        cells[1].querySelector('strong')?.textContent || '',
        cells[2].querySelector('strong')?.textContent || '',
        cells[2].querySelector('small')?.textContent || '',
        cells[3].textContent.trim()
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clinicflow-appointments.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Appointments exported to CSV');
  });

  document.getElementById('reportBtn').addEventListener('click', () => {
    showToast('Clinic report generated successfully');
  });

  document.getElementById('logoutBtn').addEventListener('click', () => {
    showToast('Demo logout action');
  });
});
