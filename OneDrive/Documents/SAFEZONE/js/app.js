function showPage(pageId, btn){

document
.querySelectorAll('.page')
.forEach(page=>{
page.classList.remove('active-page');
});

document
.querySelectorAll('.nav-btn')
.forEach(button=>{
button.classList.remove('active');
});

document
.getElementById(pageId)
.classList.add('active-page');

btn.classList.add('active');
}

function goDashboard(){

document
.querySelectorAll('.page')
.forEach(page=>{
page.classList.remove('active-page');
});

document
.getElementById('dashboard')
.classList.add('active-page');

document
.querySelectorAll('.nav-btn')
.forEach(btn=>{
btn.classList.remove('active');
});

document
.querySelectorAll('.nav-btn')[1]
.classList.add('active');

}

function askPrompt(button){

document
.getElementById('question')
.value = button.innerText;

}

function sendQuestion(){

const q =
document.getElementById('question').value;

const answer =
document.getElementById('answer-content');

if(q === ''){

answer.innerHTML =
'Masukkan pertanyaan terlebih dahulu';

return;

}

answer.innerHTML = `
🤖 SafeZone Agent

<br><br>

Pertanyaan:
<b>${q}</b>

<br><br>

Ini adalah jawaban dummy.

Nantinya data akan berasal
dari backend Python yang
sedang dikembangkan.
`;

}