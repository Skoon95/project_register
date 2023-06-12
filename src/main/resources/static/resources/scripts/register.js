const registerForm = document.getElementById('registerForm');
const dialogCover = document.getElementById('dialogCover');
const addressLayer = document.getElementById('addressLayer');
const button = document.querySelector('.button.next');
const agreeAllCheckbox = document.querySelector('input[name="agreeAll"]');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const nextButton = document.querySelector('.button-container input.next');

// agreeAllCheckbox의 변경 이벤트 리스너를 추가합니다.
agreeAllCheckbox.addEventListener('change', function() {
    var isChecked = agreeAllCheckbox.checked;

    // 모든 체크박스의 상태를 agreeAllCheckbox와 동일하게 변경합니다.
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = isChecked;
    }

    // 필요한 경우 버튼 상태를 변경합니다.
    updateNextButtonState();
});

// 필수 체크박스와 선택 체크박스의 상태 변경을 감지하여 버튼 상태를 업데이트합니다.
for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function() {
        // 필요한 경우 선택 체크박스의 상태를 동기화합니다.
        syncOptionalCheckboxes();

        // 버튼 상태를 업데이트합니다.
        updateNextButtonState();
    });
}

// 선택 체크박스의 상태를 필요에 따라 동기화합니다.
function syncOptionalCheckboxes() {
    var isAllChecked = true;
    var isOptionalChecked = true;
    var essentialCheckedCount = 0;

    for (var i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            isAllChecked = false;
            if (checkboxes[i].name === 'checkRealName') {
                isOptionalChecked = false;
            }
        } else {
            if (checkboxes[i].classList.contains('essential')) {
                essentialCheckedCount++;
            }
        }
    }

    if (isAllChecked) {
        agreeAllCheckbox.checked = true;
    }

    if (isOptionalChecked && essentialCheckedCount === 2) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].name === 'checkRealName') {
                checkboxes[i].checked = true;
            }
        }
    }
}
// 버튼 상태를 업데이트합니다.
function updateNextButtonState() {
    var isCheckedAll = agreeAllCheckbox.checked;
    var essentialCheckedCount = 0;

    // 필수 체크박스 개수를 확인합니다.
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].classList.contains('essential') && checkboxes[i].checked) {
            essentialCheckedCount++;
        }
    }

    // agreeAllCheckbox와 essential 체크박스의 상태를 확인하여 버튼 상태를 업데이트합니다.
    if (isCheckedAll && essentialCheckedCount === 2) {
        nextButton.removeAttribute('disabled');
        nextButton.classList.add('_blue');
    } else {
        nextButton.setAttribute('disabled', 'disabled');
        nextButton.classList.remove('_blue');
    }
}


// 페이지 전환시 초기화
registerForm.show = () => {
    // registerForm['agreeServiceTerm'].checked = false;
    // registerForm['agreePrivacyTerm'].checked = false;
    // registerForm.termWarning.hide();
    //
    // registerForm['email'].value = '';
    // registerForm.emailWarning.hide();
    //
    // registerForm['password'].value = '';
    // registerForm['passwordCheck'].value = '';
    // registerForm.passwordWarning.hide();
    //
    // registerForm['nickname'].value = '';
    // registerForm.nicknameWarning.hide();

    registerForm['contact'].value = '';
    registerForm['contact'].removeAttribute('disabled');
    registerForm['contactSend'].removeAttribute('disabled');
    registerForm['contactCode'].value = '';
    registerForm['contactCode'].setAttribute('disabled', 'disabled');
    registerForm['contactVerify'].setAttribute('disabled', 'disabled');
    registerForm['contactSalt'].value = '';

    registerForm.classList.remove('step-1', 'step-2', 'step-3');
    registerForm.classList.add('step-1', 'visible');
};

// 다음 주소 API
addressLayer.show = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            registerForm['addressPostal'].value = data.zonecode;
            registerForm['addressPrimary'].value = data.address;
            registerForm['addressSecondary'].value = '';
            registerForm['addressSecondary'].focus();
            dialogCover.hide();
            addressLayer.hide();
        }
    }).embed(addressLayer);
    addressLayer.classList.add('visible');
};
addressLayer.hide = () => addressLayer.classList.remove('visible');

// 다음 눌럿을때 넘기기
registerForm.onsubmit = e => {
    e.preventDefault();
    if (registerForm.classList.contains('step-1')){
        registerForm.classList.remove('step-1');
        registerForm.classList.add('step-2');

        var step1 = document.querySelector('.main.step-1');
        step1.style.display = 'none';

        // step-2 요소를 보여줍니다.
        var step2 = document.querySelector('.main.step-2');
        step2.style.display = 'block';

    }
};

// 주소찾기 클릭했을 때
registerForm['addressFind'].onclick = () => {
    dialogCover.show();
    addressLayer.show();
};

// contactWarning
registerForm.contactWarning = registerForm.querySelector('[rel="contactWarning"]');
registerForm.contactWarning.show = (text) => {
    registerForm.contactWarning.innerText = text;
    registerForm.contactWarning.classList.add('visible');
};
registerForm.contactWarning.hide = () => registerForm.contactWarning.classList.remove('visible');

// 인증번호 전송
registerForm['contactSend'].addEventListener('click', () => {
    registerForm.contactWarning.hide();
    if (registerForm['contact'].value === '') {
        registerForm.contactWarning.show('연락처를 입력해 주세요.');
        registerForm['contact'].focus();
        return;
    }
    if (!new RegExp('^(010)(\\d{8})$').test(registerForm['contact'].value)) {
        registerForm.contactWarning.show('올바른 연락처를 입력해 주세요.');
        registerForm['contact'].focus();
        registerForm['contact'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/register/contactCode?contact=${registerForm['contact'].value}`);
    // /user/contactCode?contact=01012345678
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure_duplicate':
                        registerForm.contactWarning.show('해당 연락처는 이미 사용 중입니다.');
                        registerForm['contact'].focus();
                        registerForm['contact'].select();
                        break;
                    case 'success':
                        registerForm['contact'].setAttribute('disabled', 'disabled');
                        registerForm['contactSend'].setAttribute('disabled', 'disabled');
                        registerForm['contactCode'].removeAttribute('disabled');
                        registerForm['contactVerify'].removeAttribute('disabled');
                        registerForm['contactCode'].focus();
                        registerForm['contactSalt'].value = responseObject.salt;
                        registerForm.contactWarning.show('입력하신 연락처로 인증번호를 전송하였습니다. 5분 이내로 입력해 주세요.');
                        break;
                    default:
                        registerForm.contactWarning.show('서버가 알 수 없는 응답을 반환했습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                registerForm.contactWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send();
});


// 인증번호 확인
registerForm['contactVerify'].addEventListener('click', () => {
    registerForm.contactWarning.hide();
    if (registerForm['contactCode'].value === '') {
        registerForm.contactWarning.show('인증번호를 입력해 주세요.');
        registerForm['contactCode'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(registerForm['contactCode'].value)) {
        registerForm.contactWarning.show('올바른 인증번호를 입력해 주세요.');
        registerForm['contactCode'].focus();
        registerForm['contactCode'].select();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('contact', registerForm['contact'].value);
    formData.append('salt', registerForm['contactSalt'].value);
    formData.append('code', registerForm['contactCode'].value);
    xhr.open('PATCH', '/register/contactCode');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure_expired':
                        registerForm.contactWarning.show('해당 인증번호는 만료되었습니다. 처음부터 다시 진행해 주세요.');
                        break;
                    case 'success':
                        registerForm['contactCode'].setAttribute('disabled', 'disabled');
                        registerForm['contactVerify'].setAttribute('disabled', 'disabled');
                        registerForm.contactWarning.show('인증이 완료되었습니다.');
                        break;
                    default:
                        registerForm['contactCode'].focus();
                        registerForm['contactCode'].select();
                        registerForm.contactWarning.show('인증번호가 올바르지 않습니다. 다시 확인해 주세요.');
                }
            } else {
                registerForm.contactWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
});


