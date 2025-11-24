/**
 * Mental Health Checker - Utility Functions
 */

// Validasi input form
function validatePredictionForm() {
    const nama = document.getElementById('nama').value.trim();
    const usia = parseInt(document.getElementById('usia').value);
    const jamBelajar = parseFloat(document.getElementById('jam_belajar').value);
    const durasiTidur = parseFloat(document.getElementById('durasi_tidur').value);

    // Validasi nama
    if (!nama) {
        showAlert('Nama mahasiswa tidak boleh kosong', 'error');
        return false;
    }

    // Validasi usia
    if (isNaN(usia) || usia < 15 || usia > 50) {
        showAlert('Usia harus antara 15-50 tahun', 'error');
        return false;
    }

    // Validasi jam belajar
    if (isNaN(jamBelajar) || jamBelajar < 0 || jamBelajar > 24) {
        showAlert('Jam belajar harus antara 0-24 jam', 'error');
        return false;
    }

    // Validasi durasi tidur
    if (isNaN(durasiTidur) || durasiTidur < 0 || durasiTidur > 24) {
        showAlert('Durasi tidur harus antara 0-24 jam', 'error');
        return false;
    }

    return true;
}

// Tampilkan alert/notifikasi
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    const bgColor = {
        'error': 'bg-red-100 border-red-400 text-red-700',
        'success': 'bg-green-100 border-green-400 text-green-700',
        'warning': 'bg-yellow-100 border-yellow-400 text-yellow-700',
        'info': 'bg-blue-100 border-blue-400 text-blue-700'
    };

    alertDiv.className = `border-l-4 p-4 mb-4 ${bgColor[type] || bgColor['info']}`;
    alertDiv.innerHTML = `<p>${message}</p>`;

    // Insert di awal form
    const form = document.getElementById('predictionForm');
    if (form) {
        form.parentNode.insertBefore(alertDiv, form);
        // Auto remove after 5 seconds
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

// Format number dengan separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showAlert('Teks berhasil dicopy ke clipboard', 'success');
    }).catch(() => {
        showAlert('Gagal copy ke clipboard', 'error');
    });
}

// Download hasil sebagai text
function downloadResult() {
    const studentName = document.querySelector('p:contains("Nama")').textContent;
    const content = document.body.innerText;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `mental-health-result-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Print hasil
function printResult() {
    window.print();
}

// Reset form dengan konfirmasi
function resetFormWithConfirm() {
    if (confirm('Apakah Anda yakin ingin mereset semua data form?')) {
        document.getElementById('predictionForm').reset();
        showAlert('Form berhasil direset', 'info');
    }
}

// API call untuk prediksi (alternative JSON)
async function predictViaAPI(formData) {
    try {
        const response = await fetch('https://rayency.pythonanywhere.com/predict/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error melakukan prediksi: ' + error.message, 'error');
        return null;
    }
}

// Check browser compatibility
function checkBrowserCompatibility() {
    const isIE = /MSIE|Trident/.test(navigator.userAgent);
    if (isIE) {
        console.warn('Internet Explorer terdeteksi. Gunakan browser modern untuk pengalaman terbaik.');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkBrowserCompatibility();
    
    // Form validation on submit
    const form = document.getElementById('predictionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validatePredictionForm()) {
                e.preventDefault();
            }
        });
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl+Enter untuk submit form
        if (e.ctrlKey && e.key === 'Enter') {
            const form = document.getElementById('predictionForm');
            if (form) {
                form.submit();
            }
        }
    });
});

// Utility untuk smooth scroll
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Progress bar untuk form (visual feedback)
function updateFormProgress() {
    const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
    const filled = document.querySelectorAll('input[required]:valid, select[required]:valid, textarea[required]:valid');
    const progress = (filled.length / inputs.length) * 100;
    
    const progressBar = document.querySelector('.form-progress-bar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// Track form changes
document.addEventListener('change', function() {
    updateFormProgress();
});

// Debounce function untuk form input
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Export untuk digunakan di HTML
window.MentalHealthUtils = {
    validatePredictionForm,
    showAlert,
    formatNumber,
    copyToClipboard,
    downloadResult,
    printResult,
    resetFormWithConfirm,
    predictViaAPI,
    smoothScroll,
    updateFormProgress
};

