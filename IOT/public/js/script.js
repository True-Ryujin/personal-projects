const ctx = document.getElementById('activityChart').getContext('2d');

// Chart initialization
new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['Jan 01', 'Jan 02', 'Jan 03', 'Jan 04', 'Jan 05', 'Jan 06'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [20, 40, 60, 80, 60, 40],
        backgroundColor: 'rgba(26, 187, 156, 0.2)',
        borderColor: 'rgba(26, 187, 156, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: false
  },
});

// Submenu toggle logic
function toggleSubmenu(event) {
  event.preventDefault();
  const submenu = event.target.nextElementSibling;
  submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
}
