import React, { Component } from 'react'
import { post } from 'axios';

import MenuBar from '../../components/MenuBar'
import { Button, Card, CardContent } from '@material-ui/core';

import './index.scss'

export default class ImportCSV extends Component {
  state ={
    file: null
  };

  onChange(e) {
    this.setState({file:e.target.files[0]})
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.fileUpload(this.state.file).then((response)=>{
      console.log(response.data);
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

  render() {
    return (
      <div>
        <MenuBar/>
        <div className='import-csv-wrapper'>
          <Card>
            <CardContent>
              <form className='import-csv' onSubmit={::this.onFormSubmit}>
                <h3 className='import-csv__header'>Импорт CSV</h3>

                <input
                  className='import-csv__input' type='file' accept='.csv' onChange={::this.onChange}
                />

                <div className='import-csv__spacer'/>

                <Button disabled={!this.state.file} type='submit' className='import-csv__input' variant='contained' color='primary'>
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

