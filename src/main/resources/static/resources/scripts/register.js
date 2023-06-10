const registerForm = document.getElementById('registerForm');
const dialogCover = document.getElementById('dialogCover');
const addressLayer = document.getElementById('addressLayer');

const showAddressLayer = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            registerForm['addressPostal'].value = data.zonecode;
            registerForm['addressPrimary'].value = data.address;
            registerForm['addressSecondary'].value = '';
            registerForm['addressSecondary'].focus();
            hideDialogCover();
            hideAddressLayer();
        }
    }).embed(addressLayer);
    addressLayer.classList.add('visible');
};

const hideDialogCover = () => {
    dialogCover.style.opacity = '0';
    dialogCover.style.pointerEvents = 'none';
};

const hideAddressLayer = () => {
    addressLayer.style.opacity = '0';
    addressLayer.style.pointerEvents = 'none';
    addressLayer.style.transform = 'scale(90%) translate(-50%, -50%)';
};

registerForm.onsubmit = e => {
    e.preventDefault();
    if (registerForm.classList.contains('step-1')){
        registerForm.classList.remove('step-1');
        registerForm.classList.add('step-2');
    }
};

registerForm['addressFind'].onclick = () => {
    dialogCover.style.opacity = '1';
    dialogCover.style.pointerEvents = 'all';
    showAddressLayer();
};

