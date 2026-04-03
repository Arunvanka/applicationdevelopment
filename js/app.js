// ===== State =====
const orders = JSON.parse(localStorage.getItem('orders') || '[]');

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

document.addEventListener('DOMContentLoaded', function () {
    // ===== Login =====
    var loginPage = document.getElementById('login-page');
    var mainApp = document.getElementById('main-app');
    var loginForm = document.getElementById('login-form');
    var loginError = document.getElementById('login-error');
    var logoutBtn = document.getElementById('logout-btn');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        var username = document.getElementById('username').value.trim();
        var password = document.getElementById('password').value;

        if (username === 'admin' && password === 'password') {
            loginError.hidden = true;
            loginPage.classList.remove('active');
            mainApp.hidden = false;
            initMainApp();
            showPage('home-page');
        } else {
            loginError.hidden = false;
        }
    });

    // ===== Main App (initialized after login) =====
    var mainAppInitialized = false;

    function initMainApp() {
        if (mainAppInitialized) return;
        mainAppInitialized = true;

        var orderForm = document.getElementById('order-form');
        var cancelBtn = document.getElementById('cancel-btn');
        var ordersSection = document.getElementById('orders-section');
        var ordersTableBody = document.querySelector('#orders-table tbody');

        // Order Form Submit
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var order = {
                name: document.getElementById('customer-name').value.trim(),
                address: document.getElementById('customer-address').value.trim(),
                item1: document.getElementById('item1').value.trim(),
                qty1: parseInt(document.getElementById('qty1').value) || 0,
                item2: document.getElementById('item2').value.trim(),
                qty2: parseInt(document.getElementById('qty2').value) || 0
            };

            orders.push(order);
            saveOrders();
            renderOrders();
            orderForm.reset();
            showToast('Order submitted successfully!');
        });

        // Cancel
        cancelBtn.addEventListener('click', function () {
            orderForm.reset();
        });

        // Render Orders Table
        function renderOrders() {
            ordersTableBody.innerHTML = '';
            orders.forEach(function (order, index) {
                var row = document.createElement('tr');
                row.innerHTML =
                    '<td>' + (index + 1) + '</td>' +
                    '<td>' + escapeHtml(order.name) + '</td>' +
                    '<td>' + escapeHtml(order.address) + '</td>' +
                    '<td>' + escapeHtml(order.item1) + '</td>' +
                    '<td>' + order.qty1 + '</td>' +
                    '<td>' + escapeHtml(order.item2) + '</td>' +
                    '<td>' + order.qty2 + '</td>';
                ordersTableBody.appendChild(row);
            });
            ordersSection.hidden = orders.length === 0;
        }

        // Render any previously saved orders
        renderOrders();
    }

    // ===== Logout =====
    logoutBtn.addEventListener('click', function () {
        mainApp.hidden = true;
        loginPage.classList.add('active');
        loginForm.reset();
        loginError.hidden = true;
    });

    // ===== Navigation =====
    var navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var targetPage = this.getAttribute('data-page');
            showPage(targetPage);
        });
    });

    function showPage(pageId) {
        var allPages = document.querySelectorAll('#main-app .page');
        allPages.forEach(function (page) {
            page.classList.remove('active');
        });
        document.getElementById(pageId).classList.add('active');

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            }
        });

        if (pageId === 'reports-page') {
            updateReports();
        }
    }

    // ===== Reports =====
    function updateReports() {
        var totalOrders = orders.length;
        var totalItems = 0;
        orders.forEach(function (order) {
            totalItems += order.qty1 + order.qty2;
        });
        document.getElementById('report-total-orders').textContent = 'Total Orders: ' + totalOrders;
        document.getElementById('report-total-items').textContent = 'Total Items Ordered: ' + totalItems;
    }
});

// ===== Toast Notification =====
function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
        toast.classList.add('show');
    });

    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 300);
    }, 2500);
}

// ===== Escape HTML to prevent XSS =====
function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}
