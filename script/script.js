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

    const questions = [
        {
            question: "Какого цвета бургер?",
            answers: [
                {
                    title: 'Стандарт',
                    url: './image/burger.png'
                },
                {
                    title: 'Черный',
                    url: './image/burgerBlack.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Из какого мяса котлета?",
            answers: [
                {
                    title: 'Курица',
                    url: './image/chickenMeat.png'
                },
                {
                    title: 'Говядина',
                    url: './image/beefMeat.png'
                },
                {
                    title: 'Свинина',
                    url: './image/porkMeat.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Дополнительные ингредиенты?",
            answers: [
                {
                    title: 'Помидор',
                    url: './image/tomato.png'
                },
                {
                    title: 'Огурец',
                    url: './image/cucumber.png'
                },
                {
                    title: 'Салат',
                    url: './image/salad.png'
                },
                {
                    title: 'Лук',
                    url: './image/onion.png'
                }
            ],
            type: 'checkbox'
        },
        {
            question: "Добавить соус?",
            answers: [
                {
                    title: 'Чесночный',
                    url: './image/sauce1.png'
                },
                {
                    title: 'Томатный',
                    url: './image/sauce2.png'
                },
                {
                    title: 'Горчичный',
                    url: './image/sauce3.png'
                }
            ],
            type: 'radio'
        }
    ];


    let  clientWidth =document.documentElement.clientWidth;
    if (clientWidth < 768){
        burgerBtn.style.display = 'flex';
    } else {
        burgerBtn.style.display = 'none';
    }
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
        modalBlock.classList.add('d-block');
        playTest();
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


    const playTest = () => {
        let numberQuestions = 0;
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer, index, arr) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'flex-column');
                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                  <img class="answerImg" src=${answer.url} alt="burger">
                  <span>${answer.title}</span>
                </label>
                `
                formAnswers.appendChild(answerItem);
            })
            console.log(questions.length);
        }
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = ``;
            questionTitle.textContent = `${questions[indexQuestion].question}`;
            renderAnswers(indexQuestion);
            if (numberQuestions == 0){
                prevBtn.style.display = 'none'
            } else {
                prevBtn.style.display = 'flex';
            }

            if (numberQuestions == questions.length-1) {
                nextBtn.style.display = 'none';
            } else {
                nextBtn.style.display = 'flex';
            }
        }
        renderQuestions(numberQuestions);

        nextBtn.onclick = () => {
            numberQuestions++;
            renderQuestions(numberQuestions);
        }
        prevBtn.onclick = () => {
            numberQuestions--;
            renderQuestions(numberQuestions);

        }

    }



});