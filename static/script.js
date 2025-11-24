/**
 * Mental Health Checker - Utility Functions
 */

async function predictViaAPI(formData) {
    try {
        const response = await fetch('https://rayency.pythonanywhere.com/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Gagal menghubungi server');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error:', error);
        showAlert('Error melakukan prediksi: ' + error.message, 'error');
        return null;
    }
}

// ✅ VALIDASI FORM
function validatePredictionForm() {
    const nama = document.getElementById('nama').value.trim();
    const usia = parseInt(document.getElementById('usia').value);
    const jamBelajar = parseFloat(document.getElementById('jam_belajar').value);
    const durasiTidur = parseFloat(document.getElementById('durasi_tidur').value);

    if (!nama) {
        showAlert('Nama mahasiswa tidak boleh kosong', 'error');
        return false;
    }

    if (isNaN(usia) || usia < 15 || usia > 50) {
        showAlert('Usia harus antara 15-50 tahun', 'error');
        return false;
    }

    if (isNaN(jamBelajar) || jamBelajar < 0 || jamBelajar > 24) {
        showAlert('Jam belajar harus antara 0-24 jam', 'error');
        return false;
    }

    if (isNaN(durasiTidur) || durasiTidur < 0 || durasiTidur > 24) {
        showAlert('Durasi tidur harus antara 0-24 jam', 'error');
        return false;
    }

    return true;
}

// ✅ NOTIFIKASI
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    const bgColor = {
        'error': 'bg-red-100 border-red-400 text-red-700',
        'success': 'bg-green-100 border-green-400 text-green-700',
        'warning': 'bg-yellow-100 border-yellow-400 text-yellow-700',
        'info': 'bg-blue-100 border-blue-400 text-blue-700'
    };

    alertDiv.className = `border-l-4 p-4 mb-4 ${bgColor[type]}`;
    alertDiv.innerHTML = `<p>${message}</p>`;

    const form = document.getElementById('predictionForm');
    form.parentNode.insertBefore(alertDiv, form);

    setTimeout(() => alertDiv.remove(), 5000);
}

// ✅ FORM HANDLER
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('predictionForm');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!validatePredictionForm()) return;

            const formData = Object.fromEntries(new FormData(form));

            const result = await predictViaAPI(formData);

            if (result) {
                window.location.href = `/hasil.html?status=${result.prediction_label}&confidence=${result.confidence}`;
            }
        });
    }
});
