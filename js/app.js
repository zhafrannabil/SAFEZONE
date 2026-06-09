async function sendQuestion(){

    const q =
        document
        .getElementById("question")
        .value
        .trim();

    if(q === ""){
        return;
    }

    document
        .getElementById("ask-card")
        .classList.add("hidden");

    document
        .getElementById("answer-card")
        .classList.remove("hidden");

    const answer =
        document
        .getElementById("answer-content");

    answer.innerHTML =
        "Menganalisis data...";

    try{

        const response =
            await fetch(
                "/api/chat",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({
                        question:q
                    })
                }
            );

        const data =
            await response.json();

        answer.innerHTML =
            data.answer.replace(/\n/g, "<br>");

    }
    catch(error){

        answer.innerHTML =
            "Gagal terhubung ke backend.";

        console.error(error);

    }

}

function selectPrompt(select){

    if(select.value !== ""){
        document
            .getElementById("question")
            .value = select.value;
    }

}

function closeAnswer(){

    document
        .getElementById("answer-card")
        .classList.add("hidden");

    document
        .getElementById("ask-card")
        .classList.remove("hidden");

    document
        .getElementById("question")
        .value = "";

    document
        .getElementById("prompt-select")
        .value = "";

}