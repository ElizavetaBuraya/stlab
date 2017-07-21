import React from 'react';
import { Link } from 'react-router-dom';

export default class Sidebar extends React.Component {
    render() {
        return(
            <div className="d-flex flex-column sidebar hidden-sm-down">
                <Link to='/new_survey' className="sidebar-nav">Новый опрос</Link>
                <Link to='/surveys' className="sidebar-nav">Мои опросы</Link>
                <Link to='/templates' className="sidebar-nav">Шаблоны опросов</Link>
                <Link to='/users' className="sidebar-nav">Пользователи</Link>
            </div>
        )
    }
}