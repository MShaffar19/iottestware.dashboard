/********************************************************************************
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0
 *
 * SPDX-License-Identifier: EPL-2.0 4
 ********************************************************************************/
import React from 'react'
import update from 'immutability-helper'
import {Button} from 'primereact/button'
import {Growl} from 'primereact/growl'
import {Tooltip} from 'primereact/tooltip'
import {Spinner} from 'primereact/spinner'
import {Dropdown} from 'primereact/dropdown'
import HostInput from './inputs/HostInput'

export default class PingForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 5,
      interval: 1,
      interfaces: [],
      selectedInterface: null
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onInterfaceChange = this.onInterfaceChange.bind(this)
  }

  componentDidMount () {
    fetch('/v1/tools/ifconfig')
      .then(response => response.json())
      .then(data => {
        const interfaces = []
        Object.keys(data).forEach((item) => {
          // TODO: do the filtering in the backend
          // TODO: similar code in NetworkInterfaces.js
          if (item !== 'lo' && item !== 'lo0' && data[item].length > 0) {
            data[item].forEach((ifItem) => {
              if (ifItem.family === 'IPv4') {
                interfaces.push({name: item, address: ifItem.address, netmask: ifItem.netmask})
              }
            })
          }
        })
        return interfaces
      }).then(ifItems => {
        this.setState(update(this.state, {
          'interfaces': {$set: ifItems}
        }))
      })
  }

  onInterfaceChange (e) {
    this.setState({selectedInterface: e.value})
  }

  handleChange (event) {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.id

    let newInputState = update(this.state, {
      [name]: {$set: value}
    })

    this.setState(newInputState)
  }

  handleSubmit (event) {
    const jsonRequest = JSON.stringify(this.state)

    fetch('/v1/tools/ping', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonRequest
    }).then(async response => {
      if (response.status !== 200) {
        const errorMessage = await response.json()
        throw errorMessage
      }

      return response.json()
    }).then(payload => {
      this.props.nextViewState()
    }).catch(error => {
      this.growl.show({severity: 'error', summary: 'Incorrect Input', detail: error.message})
    })

    // prevent the default behaviour of <form> which would reload the whole page
    event.preventDefault()
  }

  render () {
    return (
      <div className='form'>
        <Growl ref={(el) => this.growl = el} />
        <form onSubmit={event => { this.handleSubmit(event) }}>
          <h3 className='first'>Host</h3>
          <div className='ui-g ui-fluid'>
            <HostInput handleChange={this.handleChange} />
          </div>
          <div className='ui-g ui-fluid'>
            <div className='ui-g-12 ui-md-2'>
              <Tooltip for={'#count'}
                title='Ping count'
                tooltipEvent='hover'
                showDelay={1000}
                hideDelay={500} />
              <Spinner id='count' value={this.state.count} onChange={(e) => this.setState({state: e.value})} min={1} max={15} />
            </div>
            <div className='ui-g-12 ui-md-10'>
              <Tooltip for={'#ifSelector'}
                title='Available Network Interfaces'
                tooltipEvent='hover'
                showDelay={1000}
                hideDelay={500} />
              <Dropdown id='ifSelector' value={this.state.selectedInterface} options={this.state.interfaces} onChange={this.onInterfaceChange} style={{width: '200px'}} placeholder='Select Interface' optionLabel='name' />
            </div>
          </div>
          <div className='ui-g ui-fluid'>
            <div className='ui-g-12 ui-md-2'>
              <Button icon='fa fa-play' label='Run' type='submit' />
            </div>
          </div>
        </form>
      </div>
    )
  }
}
