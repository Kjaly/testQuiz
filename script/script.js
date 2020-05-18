// Обработчки событий, отслеживание загрузки страницы
document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const modalWrap = document.querySelector('.modal');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const sendBtn = document.getElementById('send');
    const modalDialog = document.querySelector('.modal-dialog');

    const firebaseConfig = {
        apiKey: "AIzaSyBcZn1sHSEh1J-u5zQbL7K-2xFALnGWP-4",
        authDomain: "testquiz-c138b.firebaseapp.com",
        databaseURL: "https://testquiz-c138b.firebaseio.com",
        projectId: "testquiz-c138b",
        storageBucket: "testquiz-c138b.appspot.com",
        messagingSenderId: "989042803016",
        appId: "1:989042803016:web:312302a859095c540ff37d",
        measurementId: "G-KDJ48MHMLN"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);

    //Функция получения данных
    const getData = () =>{
        formAnswers.textContent = 'LOAD';
        nextBtn.classList.add('d-none');
        prevBtn.classList.add('d-none');

        firebase.database().ref().child('questions').once('value')
            .then(snap => playTest(snap.val()))
    }




    let count = -100;
    modalDialog.style.top = count + '%';
    const animateModal = () =>{
        modalDialog.style.top = count + '%';
        count+= 3;

        if (count < 0) {
            requestAnimationFrame(animateModal);
        } else {
            count = -100;
        }
    }


    let  clientWidth =document.documentElement.clientWidth;
    if (clientWidth < 768){
        burgerBtn.style.display = 'flex';
    } else {
        burgerBtn.style.display = 'none';
    }

    // Обработчкии событий открытие и закрытие окна
    window.addEventListener('resize',function () {
        clientWidth =document.documentElement.clientWidth;
        if (clientWidth < 768){
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }

    })

    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    })


    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        getData();
    })

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    })

    document.addEventListener('click', function (event) {
        if (!event.target.closest('.modal-dialog') &&
            !event.target.closest('#btnOpenModal') &&
            !event.target.closest('.burger')
        ) {
            modalBlock.classList.remove('d-block');
            if (burgerBtn.classList.contains('active')){
                burgerBtn.classList.remove('active');
            }
        }
    });

    // функция начало тестирования
    const playTest = (questions) => {
        const obj = {};
        const  finalAnswers = [];
        // переменная с номером вопроса
        let numberQuestions = 0;

        // функция рендера ответов
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer, index, arr) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="'${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                  <img class="answerImg" src=${answer.url} alt="burger">
                  <span>${answer.title}</span>
                </label>
                `
                formAnswers.appendChild(answerItem);
            })
            // console.log(numberQuestions);
        }

        // функция рендера вопросов и ответов
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = ``;

            if(numberQuestions >= 0 && numberQuestions <= questions.length - 1){
                questionTitle.textContent = `${questions[indexQuestion].question}`;

                renderAnswers(indexQuestion);
                sendBtn.classList.add('d-none');
                prevBtn.classList.remove('d-none');
                nextBtn.classList.remove('d-none');
            }

            switch (numberQuestions) {
                case 0:
                    prevBtn.classList.add('d-none');
                    break;
                case questions.length:
                    questionTitle.textContent='';
                    nextBtn.classList.add('d-none');
                    prevBtn.classList.add('d-none');
                    sendBtn.classList.remove('d-none');
                    formAnswers.innerHTML = `
            <div class= 'form-group'>
            <label for="numberPhone">Enter your number</label>
            <input type="phone" class="form-control" id="numberPhone">
            `;

                const numberPhone = document.getElementById('numberPhone');
                numberPhone.addEventListener('input',(event) => {
                    event.target.value =  event.target.value.replace(/[^0-9+-]/,'')
                })
                    break;
                case questions.length+1:
                    formAnswers.textContent = 'Спасибо за пройденный опрос!';
                    sendBtn.classList.add('d-none');


                    for(let key in obj){
                        let newObj = {};
                        newObj[key]=obj[key];
                        finalAnswers.push(newObj);

                    }


                    setTimeout(()=>{
                        modalBlock.classList.remove('d-block') }, 2000);
                    break;

            }

        }
        // запуск рендера
        renderQuestions(numberQuestions);

        const checkAnswer = () =>{
            const inputs = [...formAnswers.elements].filter((input)=> input.checked || input.id ==='numberPhone');
            inputs.forEach((input, index)=>{
                if(numberQuestions >= 0 && numberQuestions <= questions.length - 1){
                    obj[`${index}_${questions[numberQuestions].question}`] = input.value;
                }
                if (numberQuestions === questions.length){
                    obj['Номер телефона'] = input.value;
                }
            });

            // finalAnswers.push(obj);
        }
        //Обработчики событий кнопок next и prev
        nextBtn.onclick = () => {
            checkAnswer();
            numberQuestions++;
            renderQuestions(numberQuestions);
        }
        prevBtn.onclick = () => {
            numberQuestions--;
            renderQuestions(numberQuestions);

        }


        sendBtn.onclick = () =>{
            checkAnswer();
            numberQuestions++;
            renderQuestions(numberQuestions);
            firebase
                .database()
                .ref()
                .child('contacts')
                .push(finalAnswers)
        }
    }



});