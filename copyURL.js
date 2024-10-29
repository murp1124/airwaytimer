function copyURL(button) {

    navigator.clipboard.writeText(window.location.href);

    const copyImg = button.querySelector('#copyString');
    const copiedImg = button.querySelector('#copiedString');
    
    copyImg.style.opacity = '0';
    copiedImg.style.opacity = '1';
    
    setTimeout(() => {
        
        copyImg.style.opacity = '1';
        copiedImg.style.opacity = '0';

    }, 1500);

}