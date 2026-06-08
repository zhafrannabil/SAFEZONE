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

function askPrompt(button){
    document.getElementById("question").value = button.innerText;
}

function closeAnswer(){
    document.getElementById("answer-card").classList.add("hidden");
    document.getElementById("ask-card").classList.remove("hidden");
    document.getElementById("question").value = "";
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