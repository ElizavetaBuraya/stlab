import React from 'react';
import Sidebar from './Sidebar.jsx';
import Tabs from './Tabs.jsx';
import { Link } from 'react-router-dom';

export default class NewSurvey extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            survey_title:"",
            questions_list:{"page_1" : null},
            survey_page:"page_1",
            numberOfPages: 1,
            numberOfQuestions: 0,
            is_anonymous: false,
            questions_are_numbered: true,
            pages_are_numbered: true,
            randomized: false,
            required_fields: true,
            progress_bar: false,
            navtabs: [
                { 'href':'#page_1', 'id':'page_1', 'name':'Страница 1', 'active':true }
            ]
        };
        this.handleTogglePanel = this.handleTogglePanel.bind(this);
        this.handleAddQuestion = this.handleAddQuestion.bind(this);
        this.handleUpdateQuestion = this.handleUpdateQuestion.bind(this);
        this.handleDragQuestion = this.handleDragQuestion.bind(this);
        this.handleDeleteQuestion = this.handleDeleteQuestion.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleAddPage = this.handleAddPage.bind(this);
        this.handleChangePageName = this.handleChangePageName.bind(this);
        this.handleDeletePage = this.handleDeletePage.bind(this);
        this.handleSaveSurvey = this.handleSaveSurvey.bind(this);
    }

    componentDidMount() {
        if (this.props.currentPage !== '/new_survey')
        {
            this.props.handleChangePage('/new_survey');
        }
    }

    handleTogglePanel() {
        if ($('#sidebarCollapse').hasClass('active-bar')) {
            $('#sidebar, #sidebarCollapse').removeClass('active-bar');
            $('.overlay').fadeOut();
        } else {
            $('#sidebar, #sidebarCollapse').addClass('active-bar');
            $('.overlay').fadeIn();
        }
    }

    handleAddQuestion(questionType) {
        let newQuestionsList = this.state.questions_list;
        let surveyPage = this.state.survey_page;
        let newNumberOfQuestions = this.state.numberOfQuestions + 1;

        let questionsArray = (newQuestionsList[surveyPage])
            ? newQuestionsList[surveyPage]
            : [];

        let answersArray = (questionType === 'multi-choice'
        || questionType === 'single-choice')
            ? [ 'Ответ 1', 'Ответ 2', 'Ответ 3']
            : [];

        let newQuestion = {
            'id': (new Date).getTime(),
            'title': 'Новый вопрос',
            'type': questionType,
            'required': true,
            'answers': answersArray
        };

        questionsArray.push(newQuestion);
        newQuestionsList[surveyPage] = questionsArray;

        this.setState({
            questions_list:newQuestionsList,
            numberOfQuestions:newNumberOfQuestions
        })
    }

    handleUpdateQuestion(newQuestions) {
        let newQuestionsList = this.state.questions_list;
        let surveyPage = this.state.survey_page;
        newQuestionsList[surveyPage] = newQuestions;

        this.setState({
            questions_list: newQuestionsList,
        })
    }

    handleDragQuestion(dragIndex, hoverIndex, dragQuestion) {
        let newQuestionsList = this.state.questions_list;
        let surveyPage = this.state.survey_page;

        newQuestionsList[surveyPage].splice(dragIndex, 1);
        newQuestionsList[surveyPage].splice(hoverIndex, 0, dragQuestion);

        this.setState({
            questions_list: newQuestionsList
        });
    }

    handleDeleteQuestion(id) {
        let deleteQuestion = confirm('Вы уверены, что хотите удалить вопрос?');

        if(deleteQuestion) {
            let newQuestionsList = this.state.questions_list;
            let surveyPage = this.state.survey_page;
            let newNumberOfQuestions = this.state.numberOfQuestions - 1;

            let newArray = newQuestionsList[surveyPage].filter((question) => question.id !== id);
            newQuestionsList[surveyPage] = newArray;

            this.setState ({
                questions_list: newQuestionsList,
                numberOfQuestions:newNumberOfQuestions
            });

            $('.edit-question').show();
        }
    }

    handleChangePage(page) {
        this.setState({
            survey_page: page,
        })
    }

    handleAddPage() {
        if (this.state.numberOfPages === 5) {
            alert("В опросе не может быть более 5 страниц");
            return;
        }
        let newTabs = this.state.navtabs;
        let newQuestionsList = this.state.questions_list;
        let newPageNumber = this.state.numberOfPages + 1;

        let prevPage = newTabs[newTabs.length - 1].name;
        const prevPageNumber = (parseInt(prevPage.replace(/[^0-9\.]/g, ''), 10));

        let pageName = (isNaN(prevPageNumber))
            ? 'Страница ' + newPageNumber
            : 'Страница ' + (prevPageNumber + 1);

        let newPage = {
            'href':'#page_' + (new Date).getTime(),
            'id':'page_' + (new Date).getTime(),
            'name':pageName,
            'active':false
        };

        //create new tab
        newTabs.push(newPage);

        //create page in questions_list
        newQuestionsList[newPage['id']] = null;

        this.setState({
            navtabs: newTabs,
            numberOfPages: newPageNumber,
            questions_list: newQuestionsList,
        });
    }

    handleChangePageName(value, tabId) {
        let navTabs = this.state.navtabs;
        let defaultName = null;

        navTabs.map((tab) => {
            if (tab.id === tabId) {
                defaultName = tab.name;
                tab.name = value;
                if (value.length === 0) {
                    tab.name = defaultName;
                }
            }
        });

        this.setState({
            navtabs: navTabs,
        })
    }

    handleDeletePage(tabId) {
        let deletePage = confirm('Вы уверены, что хотите удалить страницу?');

        if (deletePage) {
            let questionsList = this.state.questions_list;
            let surveyPage = this.state.survey_page;
            let navTabs = this.state.navtabs;
            let newPageIndex = this.state.numberOfPages - 1;
            let newQuestionsNumber = (questionsList[surveyPage])
                ? this.state.numberOfQuestions - questionsList[surveyPage].length
                : this.state.numberOfQuestions;

            //delete tab
            let newNavs = navTabs.filter((tab) => tab.id !== tabId);

            //delete page from questions_list
            questionsList[tabId] = undefined;
            questionsList = JSON.parse(JSON.stringify(questionsList));

            this.setState({
                navtabs: newNavs,
                questions_list: questionsList,
                numberOfPages: newPageIndex,
                numberOfQuestions: newQuestionsNumber,
                survey_page: newNavs[newNavs.length - 1].id
            });
        }
    }

    handleSaveSurvey(template) {
        if (this.state.survey_title.length === 0) {
            alert("Введите название опроса!");
            return;
        }

        let description = prompt("Введите описание опроса");

        let dateChanged = new Date();
        let day = dateChanged.getDate();
        let month = dateChanged.getMonth()+1;
        let year = dateChanged.getFullYear();
        day = (day < 10) ? '0' + day : day;
        month = (month < 10) ? '0' + month : month;
        dateChanged = day + '.' + month + '.' + year;

        let surveyId = (new Date).getTime();

        let isTemplate = !!(template);

        let newSurvey = {
            "id": surveyId,
            "name": this.state.survey_title,
            "changed": dateChanged,
            "answers": 0,
            "link": "/survey/" + surveyId,
            "results": "/survey/" + surveyId + "/results",
            "template": isTemplate,
            "pages": this.state.numberOfPages,
            "questions": this.state.numberOfQuestions,
            "is_anonymous": this.state.is_anonymous,
            "questions_are_numbered": this.state.questions_are_numbered,
            "pages_are_numbered": this.state.pages_are_numbered,
            "randomized": this.state.randomized,
            "required_fields": this.state.required_fields,
            "progress_bar": this.state.progress_bar,
            "description": description,
        };

        Object.assign(newSurvey, this.state.questions_list);

        $.ajax({
            url: 'http://localhost:3000/surveys',
            method: 'POST',
            data: JSON.stringify(newSurvey),
            headers: { 'Content-Type': 'application/json' },
            success: function() {
                alert("Опрос создан успешно");
            }.bind(this)
        });
    }

    render() {
        return (
            <main className='d-flex flex-row'>
                <Sidebar
                    currentPage = {this.props.currentPage}
                />
                <div className='main-content survey d-flex flex-column'>
                    <div className='page-head'>
                        <label htmlFor='new_survey'><p className='survey-title'>Новый опрос:</p></label>
                        <input type='text' name='new-survey' id='new_survey' onChange={(e) => {this.setState({survey_title:e.target.value})}}/><br/>
                        <div className='survey-stats'>
                            <p className='question-number'>Вопросов: <span>{this.state.numberOfQuestions}</span>,</p>
                            <p className='page-number'>cтраниц: <span>{this.state.numberOfPages}</span></p>
                        </div>
                        <div className='survey-command-panel'>
                            <a href='#' onClick = {this.handleSaveSurvey}>Сохранить</a>
                            <a href='#' onClick = {() => this.handleSaveSurvey("template")}>Сохранить как шаблон</a>
                            <Link to="/about">Отмена</Link>
                            <a href='#' onClick = {this.handleAddPage}>Новая страница</a>
                        </div>
                    </div>
                    <Tabs questions_list = {this.state.questions_list}
                          survey_page = {this.state.survey_page}
                          currentPage = '/new_survey'
                          navtabs={this.state.navtabs}
                          handleUpdateQuestion = {this.handleUpdateQuestion}
                          handleDragQuestion = {this.handleDragQuestion}
                          handleDeleteQuestion = {this.handleDeleteQuestion}
                          handleChangePage = {this.handleChangePage}
                          handleChangePageName = {this.handleChangePageName}
                          handleDeletePage = {this.handleDeletePage}
                    />
                    <aside className='survey-sidebar' id='sidebar'>
                        <a className='survey-sidebar-collapse' id='sidebarCollapse' onClick={this.handleTogglePanel}/>
                        <div className='params'>
                            <p>Тип вопроса</p>
                            <ul className='question-type-list'>
                                <li className='single-answer' onClick={() => this.handleAddQuestion('single-choice')}>Варианты ответа (один)</li>
                                <li className='multiple-answer' onClick={() => this.handleAddQuestion('multi-choice')}>Варианты ответа (несколько)</li>
                                <li className='text-answer' onClick={() => this.handleAddQuestion('text')}>Текст</li>
                                <li className='file-answer' onClick={() => this.handleAddQuestion('file')}>Файл</li>
                                <li className='star-answer' onClick={() => this.handleAddQuestion('rating')}>Рейтинг в звездах</li>
                                <li className='range-answer' onClick={() => this.handleAddQuestion('scale')}>Шкала</li>
                            </ul>
                        </div>
                        <div className='params'>
                            <p>Параметры опроса</p>
                            <ul className='survey-params-list'>
                                <li>
                                    <input type='checkbox' id='anonymous'
                                           onChange={(e) => this.setState({
                                               is_anonymous: e.target.checked
                                           })} />
                                    <label htmlFor='anonymous'>Анонимный опрос</label>
                                </li>
                                <li>
                                    <input type='checkbox' id='questions-are-numbered'
                                           onChange={(e) => this.setState({
                                               questions_are_numbered: e.target.checked
                                           })} />
                                    <label htmlFor='questions-are-numbered'>Номера вопросов</label>
                                </li>
                                <li>
                                    <input type='checkbox' id='pages-are-numbered'
                                           onChange={(e) => this.setState({
                                               pages_are_numbered: e.target.checked
                                           })} />
                                    <label htmlFor='pages-are-numbered'>Номера страниц</label>
                                </li>
                                <li>
                                    <input type='checkbox' id='random-order'
                                           onChange={(e) => this.setState({
                                               randomized: e.target.checked
                                           })} />
                                    <label htmlFor='random-order'>Случайный порядок вопросов</label>
                                </li>
                                <li>
                                    <input type='checkbox' id='compulsory'
                                           onChange={(e) => this.setState({
                                               required_fields: e.target.checked
                                           })} />
                                    <label htmlFor='compulsory'>Звездочки обязательных полей</label>
                                </li>
                                <li>
                                    <input type='checkbox' id='progress'
                                          onChange={(e) => this.setState({
                                               progress_bar: e.target.checked
                                           })} />
                                    <label htmlFor='progress'>Индикатор выполнения</label>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
                <div className='overlay' onClick={this.handleTogglePanel}/>
            </main>
        )
    }
}