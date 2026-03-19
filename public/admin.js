document.addEventListener('DOMContentLoaded', () => {
    // Basic Access Control
    const ADMIN_PASS = 'admin123'; // Change this as needed
    const userPass = prompt('Enter Admin Password:');
    
    if (userPass !== ADMIN_PASS) {
        document.body.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100vh; font-family:sans-serif; flex-direction:column;"><h1>Access Denied</h1><a href="index.html">Return to Site</a></div>';
        return;
    }

    const tableBody = document.getElementById('table-body');
    const loading = document.getElementById('loading');
    const noData = document.getElementById('no-data');
    const totalCount = document.getElementById('total-count');
    const recentCount = document.getElementById('recent-count');
    const refreshBtn = document.getElementById('refresh-btn');

    // Modal
    const modal = document.getElementById('message-modal');
    const closeBtn = document.querySelector('.close');

    const fetchEnquiries = async () => {
        loading.style.display = 'block';
        tableBody.innerHTML = '';
        noData.style.display = 'none';

        try {
            // Using relative path to work on any domain (local or production)
            const response = await fetch('/api/enquiries');
            const data = await response.json();

            loading.style.display = 'none';

            if (!data || data.length === 0) {
                noData.style.display = 'block';
                return;
            }

            // Stats
            totalCount.innerText = data.length;
            const today = new Date().toISOString().split('T')[0];
            const recent = data.filter(e => e.created_at.startsWith(today)).length;
            recentCount.innerText = recent;

            // Render Table
            data.forEach(item => {
                const row = document.createElement('tr');
                const date = new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                row.innerHTML = `
                    <td style="font-weight: 500;">${date}</td>
                    <td style="font-weight: 600;">${item.name}</td>
                    <td>${item.email}</td>
                    <td>${item.subject || 'General'}</td>
                    <td><span class="msg-snippet">${item.message}</span></td>
                `;

                row.addEventListener('click', () => openModal(item));
                tableBody.appendChild(row);
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            loading.innerText = 'Error loading data. Make sure backend is running.';
        }
    };

    const openModal = (item) => {
        document.getElementById('modal-name').innerText = item.name;
        document.getElementById('modal-email').innerText = item.email;
        document.getElementById('modal-message').innerText = item.message;
        modal.style.display = 'flex';
    };

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };

    refreshBtn.addEventListener('click', fetchEnquiries);

    // Initial load
    fetchEnquiries();
});
