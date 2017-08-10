import React from 'react';
import Sidebar from './Sidebar.jsx';
import Table from './Table.jsx';

class MySearchPanel extends React.Component {
    render() {
        return (
            <div className="page-head d-flex justify-content-between align-items-center">
                <h1>Пользователи</h1>
                <div className="search-form">
                    { this.props.searchField }
                </div>
            </div>
        );
    }
}

function createCustomDeleteButton(onBtnClick) {
    return (
        <button className="delete-button" onClick={ onBtnClick }>Delete selected</button>
    );
}

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.afterSaveCell = this.afterSaveCell.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.handleDeletedRow = this.handleDeletedRow.bind(this);
        this.renderTotal = this.renderTotal.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.selectedRows = [];
        this.state = {
            data: [{"id":"нет данных","name":"нет данных","role":"нет данных","registered":"нет данных","surveys":"нет данных"}],
            roles: ['Администратор', 'Пользователь'],
            columnNames: ['id', 'Имя','Роль','Зарегистрирован','Опросы'],
        },
        this.options = {
            noDataText: 'Все записи удалены',
            deleteBtn: createCustomDeleteButton,
            sizePerPage: 10,
            hideSizePerPage: true,
            paginationShowsTotal: this.renderTotal,
            defaultSortName: 'name',  // default sort column name
            defaultSortOrder: 'asc',  // default sort order
            searchPanel: (props) => (<MySearchPanel { ...props }/>),
            afterDeleteRow: this.handleDeletedRow,
        };
    }

    componentDidMount() {
        this.onLoad();
        if (this.props.currentPage !== '/users')
        {
            this.props.handleChangePage('/users');
        }
    }

    onLoad() {
        $.ajax({
            url: 'http://localhost:3000/users',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    afterSaveCell(row) {
        $.ajax({
            url: 'http://localhost:3000/users/' + row.id,
            method: 'PUT',
            data: JSON.stringify(row),
            headers: { 'Content-Type': 'application/json' },
            success: function() {
                this.onLoad();
            }.bind(this)
        });
    }

    onRowSelect(row, isSelected) {
        (isSelected)
            ? this.selectedRows.push(row)
            : this.selectedRows.pop();
        let visibility = (this.selectedRows.length > 0)
            ? "visible"
            : "hidden";
        $(".delete-button").css("visibility", visibility);
    }

    onSelectAll(isSelected) {
        let visibility = (isSelected)
            ? "visible"
            : "hidden";
        $(".delete-button").css("visibility", visibility);
    }

    handleDeletedRow(row) {
        for (let index in row) {
            $.ajax({
                url: 'http://localhost:3000/users/' + row[index],
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                success: function() {
                    this.onLoad();
                }.bind(this)
            });
        }
        $(".delete-button").css("visibility", "hidden");
    }

    renderTotal() {
        return (
            <span className="users-number">
                Всего пользователей: { this.state.data.length }
            </span>
        );
    }

    render() {
        return (
            <main className="d-flex flex-row justify-content-start">
                <Sidebar
                    currentPage = {this.props.currentPage}
                />
                <div className="main-content d-flex flex-column">
                    <Table data={this.state.data}
                           roles={this.state.roles}
                           options={ this.options }
                           columnNames={ this.state.columnNames }
                           afterSaveCell = { this.afterSaveCell }
                           handleDeletedRow = { this.handleDeletedRow }
                           onRowSelect = { this.onRowSelect }
                           onSelectAll = { this.onSelectAll }
                    />
                </div>
            </main>
        )
    }
}