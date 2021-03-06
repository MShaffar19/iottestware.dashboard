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
import {InputText} from 'primereact/inputtext'

export default class PortInput extends React.Component {
  constructor (props) {
    super(props)

    this.setDefaultValue = this.setDefaultValue.bind(this)
  }

  setDefaultValue (event, defaultValue, inputHandler) {
    if (defaultValue) {
      event.target.value = defaultValue
      event.target.id = 'port'
      inputHandler(event)
    }
  }

  render () {
    return (
      <div className='p-col-12 p-md-6'>
        <div className='p-inputgroup'>
          <span className='p-inputgroup-addon'>
            <i className='fa fa-plug'
              onClick={e => this.setDefaultValue(e, this.props.defaultValue, this.props.handleChange)} />
          </span>
          <InputText placeholder='Port'
            tooltip='port number (1..65535)'
            value={this.props.value}
            onChange={this.props.handleChange}
            id={'port'}
            keyfilter={/^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])/} />
        </div>
      </div>
    )
  }
}
