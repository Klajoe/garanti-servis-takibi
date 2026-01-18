// HP Servis Takip Sistemi - Profesyonel JS
const DATA_KEY = 'hp-service-data';
let allData = [];

document.addEventListener('DOMContentLoaded', () => {
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (dateDisplay) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.innerText = new Date().toLocaleDateString('tr-TR', options);
    }
    initSystem();
});

// 1. Veri Başlatma ve Zengin Örnek Veriler
function initSystem() {
    const savedData = localStorage.getItem(DATA_KEY);
    const simdi = Date.now();
    const birGun = 86400000;

    // Her zaman yeni örneklerle başlatmak isterseniz LocalStorage'ı temizleyebilirsiniz
    if (!savedData || JSON.parse(savedData).length === 0) {
        const sampleData = [
            // KIRMIZI VERİLER (15 Günü Geçmiş)
            {
                id: simdi - (20 * birGun),
                date: "29.12.2025",
                caseId: "5099991111",
                sn: "CND-CRITICAL-01",
                model: "HP EliteBook 840 G10",
                user: "Murat Öz",
                onsite: "Ahmet Demir",
                priority: "Yüksek",
                status: "Parça Bekliyor",
                desc: "20 GÜNLÜK: Kritik gecikme, tam kırmızı.",
                timestamp: simdi - (20 * birGun)
            },
            {
                id: simdi - (16 * birGun),
                date: "02.01.2026",
                caseId: "5088882222",
                sn: "CND-OVERDUE-02",
                model: "HP ProBook 450 G9",
                user: "Ayşe Er",
                onsite: "Bora Aras",
                priority: "Orta",
                status: "Kayıt Açıldı",
                desc: "16 GÜNLÜK: Süre aşılmış, kırmızı.",
                timestamp: simdi - (16 * birGun)
            },
            // RENK GEÇİŞLİ VERİLER (15 Güne Yaklaşanlar)
            {
                id: simdi - (14 * birGun),
                date: "04.01.2026",
                caseId: "5077771111",
                sn: "CND-TEST-03",
                model: "HP ZBook Firefly",
                user: "Canan Y.",
                onsite: "Ali Veli",
                priority: "Yüksek",
                status: "Parça Bekliyor",
                desc: "14 GÜNLÜK: Turuncu/Kırmızı geçişi.",
                timestamp: simdi - (14 * birGun)
            },
            {
                id: simdi - (10 * birGun),
                date: "08.01.2026",
                caseId: "5066662222",
                sn: "CND-TEST-04",
                model: "HP EliteBook 830",
                user: "Selin G.",
                onsite: "Ahmet Demir",
                priority: "Orta",
                status: "Kayıt Açıldı",
                desc: "10 GÜNLÜK: Turuncu/Sarı geçişi.",
                timestamp: simdi - (10 * birGun)
            },
            {
                id: simdi - (7 * birGun),
                date: "11.01.2026",
                caseId: "5055553333",
                sn: "CND-TEST-05",
                model: "HP ProBook 440",
                user: "Mert Ak",
                onsite: "Bora Aras",
                priority: "Düşük",
                status: "Tamamlandı",
                desc: "7 GÜNLÜK: Tam sarı.",
                timestamp: simdi - (7 * birGun)
            },
            {
                id: simdi - (5 * birGun),
                date: "13.01.2026",
                caseId: "5044444444",
                sn: "CND-TEST-06",
                model: "HP Victus 16",
                user: "Deniz S.",
                onsite: "Ali Veli",
                priority: "Yüksek",
                status: "Kayıt Açıldı",
                desc: "5 GÜNLÜK: Fıstık yeşili.",
                timestamp: simdi - (5 * birGun)
            },
            {
                id: simdi - (3 * birGun),
                date: "15.01.2026",
                caseId: "5033335555",
                sn: "CND-TEST-07",
                model: "HP Elite Dragonfly",
                user: "Eren K.",
                onsite: "Ahmet Demir",
                priority: "Orta",
                status: "Parça Bekliyor",
                desc: "3 GÜNLÜK: Açık yeşil.",
                timestamp: simdi - (3 * birGun)
            },
            {
                id: simdi - (1 * birGun),
                date: "17.01.2026",
                caseId: "5022226666",
                sn: "CND-TEST-08",
                model: "HP ZBook Studio",
                user: "Zeynep B.",
                onsite: "Bora Aras",
                priority: "Düşük",
                status: "Tamamlandı",
                desc: "1 GÜNLÜK: Parlak yeşil.",
                timestamp: simdi - (1 * birGun)
            },
            {
                id: simdi - (0.5 * birGun),
                date: "18.01.2026",
                caseId: "5011117777",
                sn: "CND-TEST-09",
                model: "HP Pavilion",
                user: "Teknik Ofis",
                onsite: "Ali Veli",
                priority: "Orta",
                status: "Kayıt Açıldı",
                desc: "BUGÜN: En koyu yeşil.",
                timestamp: simdi - (0.5 * birGun)
            },
            {
                id: simdi - (0.1 * birGun),
                date: "18.01.2026",
                caseId: "5000008888",
                sn: "CND-TEST-10",
                model: "HP ProDesk 600",
                user: "Lojistik",
                onsite: "Ahmet Demir",
                priority: "Düşük",
                status: "Kayıt Açıldı",
                desc: "YENİ: Parlak yeşil.",
                timestamp: simdi - (0.1 * birGun)
            }
        ];
        allData = sampleData;
        verileriKaydet();
    } else {
        allData = JSON.parse(savedData);
    }
    verileriYukle();
}

// 2. Arayüz ve Dinamik Renk Hesaplama
function updateStats(data) {
    const total = data.length;
    const completed = data.filter(x => x.status === 'Tamamlandı').length;
    const overdue = data.filter(x => {
        const diff = Math.floor((Date.now() - x.timestamp) / 86400000);
        return diff >= 15 && x.status !== 'Tamamlandı';
    }).length;

    document.getElementById('statTotal').innerText = total;
    document.getElementById('statCompleted').innerText = completed;
    document.getElementById('statPending').innerText = total - completed;
    document.getElementById('statOverdue').innerText = overdue;
}

function renderTable(data) {
    const listBody = document.getElementById('ticketList');
    if (!listBody) return;
    listBody.innerHTML = '';
    
    data.sort((a,b) => b.timestamp - a.timestamp).forEach((item) => {
        const daysPassed = (Date.now() - item.timestamp) / 86400000;
        
        // RENK ALGORİTMASI:
        // 0.gün: 120 (Yeşil)
        // 7.gün: 60 (Sarı)
        // 11.gün: 30 (Turuncu)
        // 15.gün: 0 (Kırmızı)
        let hue = 120 - (daysPassed * 8); 
        if (hue < 0) hue = 0; // 15 günden sonrası hep kırmızı kalır

        const dynamicColor = `hsl(${hue}, 85%, 45%)`;
        const pClass = `priority-${item.priority.toLowerCase().replace('ü','u').replace('ş','s')}`;
        const hCount = allData.filter(x => x.sn === item.sn && x.id !== item.id).length;

        listBody.innerHTML += `
            <tr>
                <td class="ps-4"><input type="checkbox" class="form-check-input"></td>
                <td>
                    <div class="date-container">
                        <div class="day-circle" style="background-color: ${dynamicColor}; box-shadow: 0 0 10px ${dynamicColor}88;"></div>
                        <span class="fw-bold small">${item.date}</span>
                    </div>
                </td>
                <td><span class="text-primary fw-bold">${item.caseId}</span></td>
                <td><div class="fw-semibold">${item.model}</div><small class="text-muted">${item.sn}</small></td>
                <td>${item.user}</td>
                <td>${item.onsite || '-'}</td>
                <td><span class="history-badge ${hCount === 0 ? 'no-history' : ''}" onclick="${hCount > 0 ? `showHistory('${item.sn}')` : ''}">${hCount}</span></td>
                <td><span class="badge-custom ${pClass}">${item.priority}</span></td>
                <td><span class="badge ${item.status === 'Tamamlandı' ? 'bg-success' : 'bg-warning text-dark'}">${item.status}</span></td>
                <td class="text-center">
                    <button onclick="showDetail(${item.id})" class="btn btn-sm btn-light border"><i class="bi bi-eye"></i></button>
                    <button onclick="kayitSil(${item.id})" class="btn btn-sm btn-light border text-danger ms-1"><i class="bi bi-trash"></i></button>
                </td>
            </tr>`;
    });
}

// 3. Standart Yardımcı Fonksiyonlar
function verileriYukle() { renderTable(allData); updateStats(allData); }
function verileriKaydet() { localStorage.setItem(DATA_KEY, JSON.stringify(allData)); }

document.getElementById('sheetForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const yeni = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        caseId: document.getElementById('caseId').value,
        sn: document.getElementById('sn').value,
        model: document.getElementById('model').value,
        user: document.getElementById('user').value,
        onsite: document.getElementById('onsite').value,
        priority: document.getElementById('priority').value,
        status: document.getElementById('status').value,
        desc: document.getElementById('desc').value,
        timestamp: Date.now()
    };
    allData.push(yeni);
    verileriKaydet();
    bootstrap.Modal.getInstance(document.getElementById('newRecordModal')).hide();
    this.reset();
    verileriYukle();
});

function kayitSil(id) {
    if (confirm('Kaydı silmek istiyor musunuz?')) {
        allData = allData.filter(x => x.id !== id);
        verileriKaydet();
        verileriYukle();
    }
}

function filterTable() {
    const q = document.getElementById('searchBox').value.toLowerCase();
    const filtered = allData.filter(x => x.sn.toLowerCase().includes(q) || x.caseId.toLowerCase().includes(q) || x.user.toLowerCase().includes(q));
    renderTable(filtered);
}

function showReports() {
    document.getElementById('dashboardView').style.display = 'none';
    document.getElementById('reportsView').style.display = 'block';
    const total = allData.length || 1;
    const completed = allData.filter(x => x.status === 'Tamamlandı').length;
    document.getElementById('statusReportContent').innerHTML = `
        <div class="mb-4">
            <div class="d-flex justify-content-between mb-1"><span>Çözüm Oranı</span><span>%${Math.round(completed/total*100)}</span></div>
            <div class="progress" style="height:12px;"><div class="progress-bar bg-success" style="width:${completed/total*100}%"></div></div>
        </div>`;
    const counts = {};
    allData.forEach(x => { const n = x.onsite || 'Belirsiz'; counts[n] = (counts[n] || 0) + 1; });
    const barContainer = document.getElementById('onsiteReportContent');
    barContainer.innerHTML = '';
    const maxVal = Math.max(...Object.values(counts), 1);
    Object.entries(counts).forEach(([name, count]) => {
        const h = (count / maxVal) * 100;
        barContainer.innerHTML += `<div class="report-bar" style="height:${h}%" data-label="${name}" data-value="${count}"></div>`;
    });
}

function showDashboard() {
    document.getElementById('dashboardView').style.display = 'block';
    document.getElementById('reportsView').style.display = 'none';
    verileriYukle();
}

function showHistory(sn) {
    const history = allData.filter(x => x.sn === sn).sort((a,b) => b.timestamp - a.timestamp);
    document.getElementById('historyTimeline').innerHTML = history.map(h => `
        <div class="p-3 border-bottom mb-2 bg-light rounded">
            <div class="fw-bold text-primary">${h.date}</div>
            <div class="small"><b>Durum:</b> ${h.status}</div>
        </div>`).join('');
    new bootstrap.Modal(document.getElementById('historyModal')).show();
}

function showDetail(id) {
    const item = allData.find(x => x.id === id);
    if(!item) return;
    document.getElementById('detailContent').innerHTML = `<h5>${item.model}</h5><p>SN: ${item.sn}</p><hr><p>${item.desc || 'Açıklama yok.'}`;
    new bootstrap.Modal(document.getElementById('detailModal')).show();
}

function excelIndir() {
    let csv = '\uFEFFTarih;Case;SN;Model;Durum\n';
    allData.forEach(x => csv += `${x.date};${x.caseId};${x.sn};${x.model};${x.status}\n`);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.download = 'HP_Servis_Raporu.csv';
    link.click();
}
