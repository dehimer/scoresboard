import React, { Component } from 'react'
import { connect } from 'react-redux';

import { post } from 'axios';

import MenuBar from '../../components/MenuBar'
import {Button, Card, CardContent, Snackbar} from '@material-ui/core';


import './index.scss'

class ImportCSV extends Component {
  state = {
    file: null,
    showSnackbar: false,
    inInport: false
  };

  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.setState({ inInport: true }, () => {
      this.fileUpload(this.state.file);
    })
  }

  fileUpload(file) {
    const url = '/csv-import';
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      // headers: {
      //   'content-type': 'text/csv'
      // }
    };

    return post(url, formData, config)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.players_import_ts !== this.props.players_import_ts) {
      this.setState({
        showSnackbar: true,
        inInport: false
      });
    }
  }

  handleCloseSnackbar() {
    this.setState({
      showSnackbar: false
    })
  }

  render() {
    const { showSnackbar, inInport } = this.state;

    return (
      <div>
        <MenuBar/>
        <div className='import-csv-wrapper'>
          <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            open={showSnackbar}
            autoHideDuration={6000}
            onClose={::this.handleCloseSnackbar}
            ContentProps={{
              'aria-describedby': 'message-id'
            }}
            message={<span id='message-id'>Импорт прошёл успешно</span>}
          />
          <Card>
            <CardContent>
              <form className='import-csv' onSubmit={::this.onFormSubmit}>
                <h3 className='import-csv__header'>Импорт CSV</h3>

                <input
                  className='import-csv__input' type='file' accept='.csv' onChange={::this.onChange}
                />

                <div className='import-csv__spacer'/>

                <Button disabled={!this.state.file || inInport} type='submit' className='import-csv__input' variant='contained' color='primary'>
                  Импорт
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}


const mapStateToProps = function (state) {
  const { players_import_ts } = state.server;

  return {
    players_import_ts
  }
};

const mapDispatchToProps = (/*dispatch*/) => {
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ImportCSV);

