document.querySelectorAll('a').forEach(link => {
    if(
        link.href &&
        link.hostname === location.hostname &&
        !link.href.includes('#') &&
        link.target !== '_blank'
    ){
        link.addEventListener('click', function(e){
            e.preventDefault();
            const dest = this.href;
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = dest;
            }, 280);
        });
    }
});