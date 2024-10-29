// function copyURL(button) {

//     navigator.clipboard.writeText(window.location.href);

//     const copyImg = button.querySelector('#copyString');
//     const copiedImg = button.querySelector('#copiedString');
    
//     copyImg.style.opacity = '0';
//     copiedImg.style.opacity = '1';
    
//     setTimeout(() => {
        
//         copyImg.style.opacity = '1';
//         copiedImg.style.opacity = '0';

//     }, 1500);

// }

async function universalCopyURL(button) {
    const currentUrl = window.location.href;

    const copyImg = button.querySelector('#copyString');
    const copiedImg = button.querySelector('#copiedString');
    
    copyImg.style.opacity = '0';
    copiedImg.style.opacity = '1';
    
    setTimeout(() => {
        
        copyImg.style.opacity = '1';
        copiedImg.style.opacity = '0';

    }, 1500);
    
    
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentUrl);
    } else {
        const tempInput = document.createElement('input');
        tempInput.style.position = 'absolute';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.value = currentUrl;
        tempInput.contentEditable = true;
        tempInput.readOnly = false;
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      };

    };
