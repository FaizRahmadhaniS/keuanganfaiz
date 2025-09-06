document.addEventListener('DOMContentLoaded', () => {

    // Helper Functions
    const formatRupiah = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    const loadData = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const saveData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // Data Models
    let dataHarian = loadData('dataHarian');
    let dataBulanan = loadData('dataBulanan');
    let dataTahunan = loadData('dataTahunan');

    // Render Function
    const render = () => {
        renderTable('tabel-harian', dataHarian, ['tanggal', 'keterangan', 'pemasukan', 'pengeluaran'], 'harian');
        renderTable('tabel-bulanan', dataBulanan, ['bulan', 'keterangan', 'pemasukan', 'pengeluaran'], 'bulanan');
        renderTable('tabel-tahunan', dataTahunan, ['tahun', 'keterangan', 'pemasukan', 'pengeluaran'], 'tahunan');
        updateDashboard();
    };

    const renderTable = (tbodyId, data, columns, type) => {
        const tbody = document.getElementById(tbodyId);
        tbody.innerHTML = '';
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            columns.forEach(col => {
                const cell = document.createElement('td');
                cell.textContent = (col === 'pemasukan' || col === 'pengeluaran') ? formatRupiah(item[col]) : item[col];
                row.appendChild(cell);
            });
            const actionCell = document.createElement('td');
            actionCell.className = 'actions-cell';
            
            const editBtn = document.createElement('button');
            editBtn.innerHTML = "<i class='bx bxs-edit'></i>";
            editBtn.className = 'edit-btn';
            editBtn.onclick = () => editItem(type, index);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = "<i class='bx bxs-trash'></i>";
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteItem(type, index);

            actionCell.appendChild(editBtn);
            actionCell.appendChild(deleteBtn);
            row.appendChild(actionCell);
            tbody.appendChild(row);
        });
    };
    
    // UPDATE DASHBOARD FUNCTION
    const updateDashboard = () => {
        const calculateTotals = (data) => {
            const pemasukan = data.reduce((sum, item) => sum + item.pemasukan, 0);
            const pengeluaran = data.reduce((sum, item) => sum + item.pengeluaran, 0);
            return { pemasukan, pengeluaran, bersih: pemasukan - pengeluaran };
        };

        const totalHarian = calculateTotals(dataHarian);
        const totalBulanan = calculateTotals(dataBulanan);
        const totalTahunan = calculateTotals(dataTahunan);

        document.getElementById('pemasukan-harian-total').textContent = formatRupiah(totalHarian.pemasukan);
        document.getElementById('pengeluaran-harian-total').textContent = formatRupiah(totalHarian.pengeluaran);
        document.getElementById('total-bersih-harian').textContent = formatRupiah(totalHarian.bersih);

        document.getElementById('pemasukan-bulanan-total').textContent = formatRupiah(totalBulanan.pemasukan);
        document.getElementById('pengeluaran-bulanan-total').textContent = formatRupiah(totalBulanan.pengeluaran);
        document.getElementById('total-bersih-bulanan').textContent = formatRupiah(totalBulanan.bersih);

        document.getElementById('pemasukan-tahunan-total').textContent = formatRupiah(totalTahunan.pemasukan);
        document.getElementById('pengeluaran-tahunan-total').textContent = formatRupiah(totalTahunan.pengeluaran);
        document.getElementById('total-bersih-tahunan').textContent = formatRupiah(totalTahunan.bersih);
        
        const grandTotalPemasukan = totalHarian.pemasukan + totalBulanan.pemasukan + totalTahunan.pemasukan;
        const grandTotalPengeluaran = totalHarian.pengeluaran + totalBulanan.pengeluaran + totalTahunan.pengeluaran;
        const grandTotalBersih = grandTotalPemasukan - grandTotalPengeluaran;

        document.getElementById('grand-total-pemasukan').textContent = formatRupiah(grandTotalPemasukan);
        document.getElementById('grand-total-pengeluaran').textContent = formatRupiah(grandTotalPengeluaran);
        document.getElementById('grand-total-amount').textContent = formatRupiah(grandTotalBersih);
    };

    // Event Handlers
    document.getElementById('form-harian').addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('edit-index-harian').value;
        const newData = {
            tanggal: document.getElementById('tanggal').value,
            keterangan: document.getElementById('ket-harian').value,
            pemasukan: parseInt(document.getElementById('pemasukan-harian').value) || 0,
            pengeluaran: parseInt(document.getElementById('pengeluaran-harian').value) || 0
        };
        if (index == -1) dataHarian.push(newData); else dataHarian[index] = newData;
        saveData('dataHarian', dataHarian);
        resetForm('harian');
        render();
    });

    document.getElementById('form-bulanan').addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('edit-index-bulanan').value;
        const newData = {
            bulan: document.getElementById('bulan').value,
            keterangan: document.getElementById('ket-bulanan').value,
            pemasukan: parseInt(document.getElementById('pemasukan-bulanan').value) || 0,
            pengeluaran: parseInt(document.getElementById('pengeluaran-bulanan').value) || 0
        };
        if (index == -1) dataBulanan.push(newData); else dataBulanan[index] = newData;
        saveData('dataBulanan', dataBulanan);
        resetForm('bulanan');
        render();
    });
    
    document.getElementById('form-tahunan').addEventListener('submit', (e) => {
        e.preventDefault();
        const index = document.getElementById('edit-index-tahunan').value;
        const newData = {
            tahun: document.getElementById('tahun').value,
            keterangan: document.getElementById('ket-tahunan').value,
            pemasukan: parseInt(document.getElementById('pemasukan-tahunan').value) || 0,
            pengeluaran: parseInt(document.getElementById('pengeluaran-tahunan').value) || 0
        };
        if (index == -1) dataTahunan.push(newData); else dataTahunan[index] = newData;
        saveData('dataTahunan', dataTahunan);
        resetForm('tahunan');
        render();
    });
    
    // Edit Function
    window.editItem = (type, index) => {
        if (type === 'harian') {
            const item = dataHarian[index];
            document.getElementById('edit-index-harian').value = index;
            document.getElementById('tanggal').value = item.tanggal;
            document.getElementById('ket-harian').value = item.keterangan;
            document.getElementById('pemasukan-harian').value = item.pemasukan;
            document.getElementById('pengeluaran-harian').value = item.pengeluaran;
            const btn = document.getElementById('btn-harian');
            btn.innerHTML = "<i class='bx bxs-save'></i><span>Simpan Perubahan</span>";
            btn.classList.add('editing');
        } else if (type === 'bulanan') {
            const item = dataBulanan[index];
            document.getElementById('edit-index-bulanan').value = index;
            document.getElementById('bulan').value = item.bulan;
            document.getElementById('ket-bulanan').value = item.keterangan;
            document.getElementById('pemasukan-bulanan').value = item.pemasukan;
            document.getElementById('pengeluaran-bulanan').value = item.pengeluaran;
            const btn = document.getElementById('btn-bulanan');
            btn.innerHTML = "<i class='bx bxs-save'></i><span>Simpan Perubahan</span>";
            btn.classList.add('editing');
        } else if (type === 'tahunan') {
            const item = dataTahunan[index];
            document.getElementById('edit-index-tahunan').value = index;
            document.getElementById('tahun').value = item.tahun;
            document.getElementById('ket-tahunan').value = item.keterangan;
            document.getElementById('pemasukan-tahunan').value = item.pemasukan;
            document.getElementById('pengeluaran-tahunan').value = item.pengeluaran;
            const btn = document.getElementById('btn-tahunan');
            btn.innerHTML = "<i class='bx bxs-save'></i><span>Simpan Perubahan</span>";
            btn.classList.add('editing');
        }
    };

    // Reset Form Function
    const resetForm = (type) => {
        const formId = `form-${type}`;
        const indexId = `edit-index-${type}`;
        const btnId = `btn-${type}`;
        
        document.getElementById(formId).reset();
        document.getElementById(indexId).value = -1;
        const btn = document.getElementById(btnId);
        btn.innerHTML = "<i class='bx bx-plus'></i><span>Tambah Catatan</span>";
        btn.classList.remove('editing');
    };

    // Delete Function
    window.deleteItem = (type, index) => {
        if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;
        if (type === 'harian') { dataHarian.splice(index, 1); saveData('dataHarian', dataHarian); resetForm('harian'); } 
        else if (type === 'bulanan') { dataBulanan.splice(index, 1); saveData('dataBulanan', dataBulanan); resetForm('bulanan'); } 
        else if (type === 'tahunan') { dataTahunan.splice(index, 1); saveData('dataTahunan', dataTahunan); resetForm('tahunan'); }
        render();
    };

    // Tab Logic
    window.openTab = (tabName, elmnt) => {
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');
        elmnt.classList.add('active');
    };

    // Initial Render
    render();
    document.querySelector('.tab-button').click();
});