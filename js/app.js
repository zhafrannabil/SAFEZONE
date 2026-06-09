async function sendQuestion(){
    const q = document.getElementById("question").value.trim();
    
    if(q === ""){
        return;
    }

    document.getElementById("ask-card").classList.add("hidden");
    document.getElementById("answer-card").classList.remove("hidden");

    const answer = document.getElementById("answer-content");
    answer.innerHTML = "Menganalisis data...";

    try{
        // URL dikembalikan ke alamat absolut backend Flask
        const response = await fetch("http://localhost:5000/api/chat", {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body:JSON.stringify({ question:q })
        });

        const data = await response.json();
        answer.innerHTML = data.answer.replace(/\n/g, "<br>");
    }
    catch(error){
        answer.innerHTML = "Gagal terhubung ke backend.";
        console.error(error);
    }
}

function selectPrompt(select){
    if(select.value !== ""){
        document.getElementById("question").value = select.value;
    }
}

function closeAnswer(){
    document.getElementById("answer-card").classList.add("hidden");
    document.getElementById("ask-card").classList.remove("hidden");
    document.getElementById("question").value = "";

    // Reset dropdown jika ada
    const promptSelect = document.getElementById("prompt-select");
    if(promptSelect){
        promptSelect.value = "";
    }
}

// Menangkap klik pada hyperlink provinsi yang dihasilkan backend
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
});