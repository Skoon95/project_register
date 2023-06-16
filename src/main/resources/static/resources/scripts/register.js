const registerForm = document.getElementById('registerForm');
const dialogCover = document.getElementById('dialogCover');
const addressLayer = document.getElementById('addressLayer');
const agreeAllCheckbox = document.querySelector('input[name="agreeAll"]'); //모두 체크 버튼
const checkboxes = document.querySelectorAll('input[type="checkbox"]'); //1페이지의 체크박스들 반복문을 돌리기 위해 사용
const nextButton = document.querySelector('.button-container input.next');
// nextButton버튼 1페이지에서 2페이지로 넘어가는 버튼
const completeButton = document.querySelector('.button-container input.complete');
// 2페이지에서 3페이지로 넘어가는 버튼
const step1 = document.querySelector('.main.step-1');
const step2 = document.querySelector('.main.step-2');
const step3 = document.querySelector('.main.step-3');





// agreeAllCheckbox의 변경 이벤트 리스너를 추가합니다.
// agreeAllCheckbox가 체크되면 모든 체크박스들이 체크된 상태가 됨
// essential = [필수]항목들로 2개 모두 체크 되어 있어야만 다음 버튼이 활성화 됨
// essential의 체크된 상태에 따라 다음버튼이 활성화/비활성화 됨
// 활성화 = nextbutton의 disabled를 제거하고 _blue라는 클래스를 추가해줌으로써 활성화 시킨다.
agreeAllCheckbox.addEventListener('change', function () {
    var isChecked = agreeAllCheckbox.checked;

    // 모든 체크박스의 상태를 agreeAllCheckbox와 동일하게 변경합니다.
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = isChecked;
    }

    // 필요한 경우 버튼 상태를 변경합니다.
    updateButtonState();
});

// 필수 체크박스와 선택 체크박스의 상태 변경을 감지하여 버튼 상태를 업데이트합니다.
for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('change', function () {
        // 필요한 경우 선택 체크박스의 상태를 동기화합니다.
        syncOptionalCheckboxes();

        // 버튼 상태를 업데이트합니다.
        updateButtonState();
    });
}

// 선택 체크박스의 상태를 필요에 따라 동기화합니다.
function syncOptionalCheckboxes() {
    var isAllChecked = true;
    var isEssentialChecked = true;

    for (var i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            isAllChecked = false;
            if (checkboxes[i].classList.contains('essential')) {
                isEssentialChecked = false;
            }
        }
    }

    // agreeAllCheckbox와 필수 체크박스의 상태를 확인하여 동기화합니다.
    if (isAllChecked) {
        agreeAllCheckbox.checked = true;
    } else {
        agreeAllCheckbox.checked = false;
    }

    if (isEssentialChecked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].classList.contains('essential')) {
                checkboxes[i].checked = true;
            }
        }
    }
}

// 버튼 상태를 업데이트합니다.
function updateButtonState() {
    var isAllChecked = true;
    var isEssentialChecked = true;

    for (var i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            isAllChecked = false;
            if (checkboxes[i].classList.contains('essential')) {
                isEssentialChecked = false;
            }
        }
    }

    if (isAllChecked || isEssentialChecked) {
        nextButton.removeAttribute('disabled');
        nextButton.classList.add('_blue');
    } else {
        nextButton.setAttribute('disabled', 'disabled');
        nextButton.classList.remove('_blue');
    }
}


// 페이지 전환시 초기화
// 이전 버튼이 없어서 필요하지 않을 수도 있는데 혹시 몰라서 넣어둠
registerForm.show = () => {

    registerForm['name'].value='';
    registerForm.nameWarning.hide();

    registerForm['birth'].value='';
    registerForm.birthWarning.hide();



    // gender는 체크박스라서 조금 달라서 추후 예정
    // registerForm['gender'].value='';
    // registerForm.genderWarning.hide();

    registerForm['email'].value = '';
    registerForm.emailWarning.hide();

    registerForm['nickname'].value='';
    registerForm.nicknameWarning.hide();

    registerForm['password'].value = '';
    registerForm['passwordCheck'].value = '';
    registerForm.passwordWarning.hide();

    registerForm['addressPostal'].value='';
    registerForm['addressPrimary'].value='';
    registerForm['addressSecondary'].value='';
    registerForm.addressWarning.hide();




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

// 주소찾기 클릭했을 때
registerForm['addressFind'].onclick = () => {
    dialogCover.show();
    addressLayer.show();
};

//1페이지 넘기기
nextButton.addEventListener('click', function() {
    step1.style.display = 'none';
    step2.style.display = 'block';
});

// 2페이지 warning&회원가입
registerForm.onsubmit = e =>{
    e.preventDefault();

    if (getComputedStyle(step2).display === "block") {
        if (registerForm['name'].value === '') {
            // 이름 미입력
            registerForm.nameWarning.show('이름을 입력해 주세요.');
            registerForm['name'].focus();
            return;
        }
        if (registerForm['birth'].value === '') {
            // 생년월일 미입력
            registerForm.birthWarning.show('생년월일을 입력해 주세요.');
            registerForm['birth'].focus();
            return;
        }
        if (!registerForm['gender1'].checked && !registerForm['gender2'].checked){
            // 성별이 하나도 선택되어 있지 않을 경우 하나라도 선택
            registerForm.genderWarning.show('성별을 선택해 주세요');

        }
        if (registerForm['email'].value === '') {
            // email 미입력
            registerForm.emailWarning.show('이메일을 입력해 주세요.');
            registerForm['email'].focus();
            return;
        }

        if (!new RegExp('^(?=.{10,50}$)([\\da-zA-Z\\-_]{5,25})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2})?$').test(registerForm['email'].value)) {
            registerForm.emailWarning.show('올바른 이메일을 입력해 주세요.');
            // 이메일 형식이 틀렸을 경우
            registerForm['email'].focus();
            registerForm['email'].select();
            return;
        }
        if (registerForm['nickname'].value === '') {
            // 별명 미입력
            registerForm.nicknameWarning.show('별명을 입력해 주세요.');
            registerForm['nickname'].focus();
            return;
        }
        if (!new RegExp('^([가-힣]{2,10})$').test(registerForm['nickname'].value)) {
            registerForm.nicknameWarning.show('올바른 별명을 입력해 주세요.');
            // 별명의 형식 2글자 이상 영어 대소문자,한글
            registerForm['nickname'].focus();
            registerForm['nickname'].select();
            return;
        }
        if (registerForm['password'].value === '') {
            registerForm.passwordWarning.show('비밀번호를 입력해 주세요.');
            //비밀번호 미입력
            registerForm['password'].focus();
            return;
        }
        if (!new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]};:\'",<.>/?]{8,50})$').test(registerForm['password'].value)) {
            registerForm.passwordWarning.show('올바른 비밀번호를 입력해 주세요.');
            // 비밀번호 형식 특수문자 포함 영어대소문자 8글자~50글자
            registerForm['password'].focus();
            registerForm['password'].select();
            return;
        }


    }

    // 회원가입
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    // 회원가입시 입력된 값들을 보낼때 code salt도 보내야된다
    // salt를 보내야만 암호화된 값 비교가능
    formData.append('email', registerForm['email'].value);
    formData.append('name', registerForm['name'].value);
    formData.append('nickname', registerForm['nickname'].value);
    formData.append('contact', registerForm['contact'].value);
    formData.append('code', registerForm['contactCode'].value);
    formData.append('salt', registerForm['contactSalt'].value);
    formData.append('birthStr', registerForm['birth'].value);
    formData.append('addressPostal', registerForm['addressPostal'].value);
    formData.append('addressPrimary', registerForm['addressPrimary'].value);
    formData.append('addressSecondary', registerForm['addressSecondary'].value);
    formData.append('gender', registerForm['gender'].value);
    formData.append('password', registerForm['password'].value);
    xhr.open('POST', '/register/register');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status >= 200 && xhr.status < 300) {
                const responseObject = JSON.parse(xhr.responseText);
                switch (responseObject.result) {
                    case 'failure':
                        registerForm.contactWarning.show('알 수 없는 이유로 가입하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
                        break;
                    case 'failure_duplicate_email':
                        registerForm.emailWarning.show('해당 이메일은 이미 사용 중입니다.');
                        registerForm['email'].focus();
                        registerForm['email'].select();
                        break;
                    case 'failure_duplicate_nickname':
                        registerForm.nicknameWarning.show('해당 별명은 이미 사용 중입니다.');
                        registerForm['nickname'].focus();
                        registerForm['nickname'].select();
                        break;
                    case 'failure_duplicate_contact':
                        registerForm.contactWarning.show('해당 연락처는 이미 사용 중입니다.');
                        registerForm['contact'].focus();
                        registerForm['contact'].select();
                        break;
                    case 'success':
                        step2.style.display = 'none';
                        step3.style.display = 'block';
                        break;
                    default:
                        registerForm.contactWarning.show('서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.');
                }
            } else {
                registerForm.contactWarning.show('서버와 통신하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
            }
        }
    };
    xhr.send(formData);
}





// warningList
// warning문구들을 뛰우기 위한 정의 + show 와 hide의 정의들

// nameWarning
registerForm.nameWarning = registerForm.querySelector('[rel="nameWarning"]');
registerForm.nameWarning.show = (text) => {
    registerForm.nameWarning.innerText = text;
    registerForm.nameWarning.classList.add('visible');
};
registerForm.nameWarning.hide = () => registerForm.nameWarning.classList.remove('visible');

// birthWarning
registerForm.birthWarning = registerForm.querySelector('[rel="birthWarning"]');
registerForm.birthWarning.show = (text) => {
    registerForm.birthWarning.innerText = text;
    registerForm.birthWarning.classList.add('visible');
};
registerForm.birthWarning.hide = () => registerForm.birthWarning.classList.remove('visible');

// genderWarning
registerForm.genderWarning = registerForm.querySelector('[rel="genderWarning"]');
registerForm.genderWarning.show = (text) => {
    registerForm.genderWarning.innerText = text;
    registerForm.genderWarning.classList.add('visible');
};
registerForm.genderWarning.hide = () => registerForm.genderWarning.classList.remove('visible');

// emailWarning
registerForm.emailWarning = registerForm.querySelector('[rel="emailWarning"]');
registerForm.emailWarning.show = (text) => {
    registerForm.emailWarning.innerText = text;
    registerForm.emailWarning.classList.add('visible');
};
registerForm.emailWarning.hide = () => registerForm.emailWarning.classList.remove('visible');

//nicknameWarning
registerForm.nicknameWarning = registerForm.querySelector('[rel="nicknameWarning"]');
registerForm.nicknameWarning.show = (text) => {
    registerForm.nicknameWarning.innerText = text;
    registerForm.nicknameWarning.classList.add('visible');
};
registerForm.nicknameWarning.hide = () => registerForm.nicknameWarning.classList.remove('visible');

// passwordWarning
registerForm.passwordWarning = registerForm.querySelector('[rel="passwordWarning"]');
registerForm.passwordWarning.show = (text) => {
    registerForm.passwordWarning.innerText = text;
    registerForm.passwordWarning.classList.add('visible');
};
registerForm.passwordWarning.hide = () => registerForm.passwordWarning.classList.remove('visible');

// contactWarning
registerForm.contactWarning = registerForm.querySelector('[rel="contactWarning"]');
registerForm.contactWarning.show = (text) => {
    registerForm.contactWarning.innerText = text;
    registerForm.contactWarning.classList.add('visible');
};
registerForm.contactWarning.hide = () => registerForm.contactWarning.classList.remove('visible');

// addressWarning
registerForm.addressWarning = registerForm.querySelector('[rel="addressWarning"]');
registerForm.addressWarning.show = (text) => {
    registerForm.addressWarning.innerText = text;
    registerForm.addressWarning.classList.add('visible');
};
registerForm.addressWarning.hide = () => registerForm.addressWarning.classList.remove('visible');

// 인증번호 전송
registerForm['contactSend'].addEventListener('click', () => {
    registerForm.contactWarning.hide();
    if (registerForm['contact'].value === '') {
        // 전화번호가 비어있을 경우
        registerForm.contactWarning.show('연락처를 입력해 주세요.');
        registerForm['contact'].focus();
        return;
    }
    if (!new RegExp('^(010)(\\d{8})$').test(registerForm['contact'].value)) {
        registerForm.contactWarning.show('올바른 연락처를 입력해 주세요.');
        // 전화번호의 형식이 틀렸을 경우
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
                    //     성공시 전화번호 입력칸과 인증번호 보내기 칸 비활성화
                    //     인증번호 입력칸 인증번호 확인칸 활성화
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
        // 인증번호 미입력
        registerForm.contactWarning.show('인증번호를 입력해 주세요.');
        registerForm['contactCode'].focus();
        return;
    }
    if (!new RegExp('^(\\d{6})$').test(registerForm['contactCode'].value)) {
        registerForm.contactWarning.show('올바른 인증번호를 입력해 주세요.');
        // 인증번호 형식(숫자 6자리)이 틀렸을 경우
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
                        completeButton.removeAttribute('disabled');
                        completeButton.classList.add('_blue');
                        registerForm.contactWarning.show('인증이 완료되었습니다.');
                        // registerForm.contactWarning.add('green'); 추가예정
                        // 확인이 되었다면 warning의 색깔을 초록색으로 바꿀 예정
                        // 인증번호 확인 성공시 인증번호 입력칸+인증번호 확인 버튼 비활성화
                        // 비활성화 되어있는 완료버튼(completeButton)의 disabled를 제거하고 _blue 클래스를 추가하여 완료버튼 활성화
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






