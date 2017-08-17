import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

function getCaret(direction) {
    return direction === 'desc'
        ?  <span className='sort-up'/>
        :  <span className='sort-down'/>;
}

const hiddenColumns = ['id','template', 'pages','questions', 'description', 'is_anonymous', 'questions_are_numbered',
    'pages_are_numbered', 'randomized', 'required_fields', 'progress_bar', 'questions_list', 'navtabs', 'surveys'];

export default class Table extends React.Component {
    render() {
        let columns = null;
        if (this.props.data.length > 0) {
            columns = Object.keys(this.props.data[0]);
        } else {
            columns = this.props.columnNames;
        }

        const selectRowProp = {
            mode: 'checkbox',
            onSelect: this.props.onRowSelect,
            onSelectAll: this.props.onSelectAll
        };

        const cellEditProp = {
            mode: 'click',
            blurToSave: true,
            afterSaveCell: this.props.afterSaveCell
        };

        return (
            <BootstrapTable data={this.props.data}
                            options={ this.props.options }
                            ref='table'
                            searchPlaceholder={'Поиск'}
                            cellEdit={ cellEditProp }
                            selectRow={(this.props.data.length > 0)
                                ? selectRowProp
                                : false}
                            deleteRow={ true }
                            search
                            hover
                            pagination
            >
                {columns.map((key, index) =>
                    <TableHeaderColumn
                        key={index}
                        isKey={(key === 'id')}
                        dataField = {key}
                        dataFormat = {(key === 'link' || key === 'results') ? this.props.surveyLink : undefined}
                        thStyle={ { 'text-align': 'center' } }
                        tdStyle={ { 'text-align': 'center' } }
                        width='120'
                        editable={(key === 'name')
                            ? true
                            : (key === 'role')
                                ? { type: 'select', options: { values: this.props.roles }}
                                : false }
                        dataSort = {(key === 'name')}
                        caretRender={ (key === 'name') ? getCaret : null }
                        hidden = {hiddenColumns.includes(key)}
                    >{this.props.columnNames[index]}</TableHeaderColumn>
                )}
            </BootstrapTable>
        )
    }
}