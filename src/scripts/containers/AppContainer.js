import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logIn, createUser } from '../actions/authActionCreators';
import { getUserData,
        deleteUserData,
        editUserData,
        loadUser } from '../actions/userActionCreators';
import { getSurveyData,
        deleteSurveyData,
        editSurveyData,
        deleteTemplate,
        createSurvey,
        updateSurvey } from '../actions/surveyActionCreators';
import { toggleRegistered, updateCurrentPage } from '../actions/actionCreators';
import App from '../components/App.jsx';

const mapStateToProps = (state) => {
    return {
        isFetching: state.renderApp.isFetching,
        isAuthorized: state.renderApp.isAuthorized,
        loggedInAs: state.renderApp.loggedInAs,
        isRegistered: state.renderApp.isRegistered,
        currentPage: state.renderApp.currentPage,
        userData: state.renderApp.userData,
        surveyData: state.renderApp.surveyData,
        redirect: state.renderApp.redirect,
        redirectPath: state.renderApp.path
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleLogInClick:
            bindActionCreators(logIn, dispatch),
        handleCreateUserClick:
            bindActionCreators(createUser, dispatch),
        handleLoadUserData:
            bindActionCreators(getUserData, dispatch),
        handleLoadSurveyData:
            bindActionCreators(getSurveyData, dispatch),
        handleDeleteUserData:
            bindActionCreators(deleteUserData, dispatch),
        handleDeleteSurveyData:
            bindActionCreators(deleteSurveyData, dispatch),
        handleDeleteTemplate:
            bindActionCreators(deleteTemplate, dispatch),
        handleEditUserData:
            bindActionCreators(editUserData, dispatch),
        handleEditSurveyData:
            bindActionCreators(editSurveyData, dispatch),
        handleRegisteredClick:
            bindActionCreators(toggleRegistered, dispatch),
        handleChangePage:
            bindActionCreators(updateCurrentPage, dispatch),
        handleCreateSurvey:
            bindActionCreators(createSurvey, dispatch),
        handleUpdateSurvey:
            bindActionCreators(updateSurvey, dispatch),
        handleLoadUser:
            bindActionCreators(loadUser, dispatch)
    }
};

export default
connect(mapStateToProps, mapDispatchToProps)(App)
