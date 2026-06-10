async function sendQuestion(){
    const q = document.getElementById("question").value.trim();
    
    if(q === "" || q.includes("...")){
        alert("Harap lengkapi pertanyaan Anda (pilih tahun/provinsi).");
        return;
    }

    document.getElementById("ask-card").classList.add("hidden");
    document.getElementById("answer-card").classList.remove("hidden");

    const answer = document.getElementById("answer-content");
    answer.innerHTML = "Menganalisis data...";

    try{
        const response = await fetch("http://localhost:5000/api/chat", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({ question:q })
        });

        const data = await response.json();
        
        // FUNGSI PENYAPU OVERLAP HYPERLINK
        // Mencari pola "KABUPATEN/KOTA [Nama] [Angka] events" secara case-insensitive
        let finalAnswer = data.answer.replace(/(KABUPATEN|KOTA|Kabupaten|Kota)\s+(.+?)(?=\s+\d+\s+events)/ig, function(match, awalan, namaKotor) {
            // 1. Bersihkan nama dari tag <a> provinsi yang salah sasaran
            let namaBersih = namaKotor.replace(/<[^>]+>/g, '').trim();
            namaBersih = namaBersih.replace(/\s+/g, ' '); // Normalisasi spasi
            
            // 2. Bungkus ulang menjadi tautan kabupaten yang utuh
            return `<a href="#" class="zoom-kabupaten" data-nama="${namaBersih}">${awalan} ${namaBersih}</a>`;
        });
        
        answer.innerHTML = finalAnswer.replace(/\n/g, "<br>");
    }
    catch(error){
        answer.innerHTML = "Gagal terhubung ke backend.";
        console.error(error);
    }
}

// Menangani kemunculan dropdown tahun dan provinsi
function handlePromptSelect() {
    const prompt = document.getElementById("prompt-select").value;
    const provWrapper = document.getElementById("prov-wrapper");
    const tahunWrapper = document.getElementById("tahun-wrapper");
    const provSelect = document.getElementById("prov-select");
    const tahunSelect = document.getElementById("tahun-select");

    // Reset isian sub-dropdown
    provSelect.value = "";
    tahunSelect.value = "";

    // Sembunyikan kembali
    provWrapper.classList.add("hidden");
    tahunWrapper.classList.add("hidden");

    // Tampilkan jika tag terdeteksi
    if (prompt.includes("[PROVINSI]")) {
        provWrapper.classList.remove("hidden");
    }
    if (prompt.includes("[TAHUN]")) {
        tahunWrapper.classList.remove("hidden");
    }
    
    buildQuestion();
}

// Merangkai kalimat akhir berdasarkan pilihan dropdown
function buildQuestion() {
    let prompt = document.getElementById("prompt-select").value;
    const prov = document.getElementById("prov-select").value;
    const tahun = document.getElementById("tahun-select").value;

    if (!prompt) {
        document.getElementById("question").value = "";
        return;
    }

    if (prompt.includes("[PROVINSI]")) {
        if (prov !== "") {
            prompt = prompt.replace("[PROVINSI]", prov);
        } else {
            prompt = prompt.replace("[PROVINSI]", "..."); // visual cue jika belum dipilih
        }
    }
    
    if (prompt.includes("[TAHUN]")) {
        if (tahun !== "") {
            prompt = prompt.replace("[TAHUN]", tahun);
        } else {
            prompt = prompt.replace("[TAHUN]", "..."); // visual cue jika belum dipilih
        }
    }

    document.getElementById("question").value = prompt;
}

function closeAnswer(){
    document.getElementById("answer-card").classList.add("hidden");
    document.getElementById("ask-card").classList.remove("hidden");
    document.getElementById("question").value = "";

    // Reset semua dropdown ke state awal
    const promptSelect = document.getElementById("prompt-select");
    if(promptSelect){
        promptSelect.value = "";
        handlePromptSelect(); // Trigger fungsi agar sub-dropdown tersembunyi
    }
}

// Menangkap klik pada hyperlink provinsi & kabupaten yang dihasilkan backend
document.getElementById("answer-content").addEventListener("click", function(event) {
    if (event.target && event.target.classList.contains("zoom-provinsi")) {
        event.preventDefault(); 
        
        const namaProvinsi = event.target.getAttribute("data-nama");
        const mapIframe = document.querySelector(".map-iframe");
        
        if (mapIframe && mapIframe.contentWindow) {
            mapIframe.contentWindow.postMessage({
                tipe: "ZOOM_PROV",
                provinsi: namaProvinsi
            }, "*");
        }
    } 
    else if (event.target && event.target.classList.contains("zoom-kabupaten")) {
        event.preventDefault(); 
        
        const namaKabupaten = event.target.getAttribute("data-nama");
        const mapIframe = document.querySelector(".map-iframe");
        
        if (mapIframe && mapIframe.contentWindow) {
            mapIframe.contentWindow.postMessage({
                tipe: "ZOOM_KAB",
                kabupaten: namaKabupaten
            }, "*");
        }
    }
});