import React, { Component } from 'react';
import { Input } from 'reactstrap'
import { SidebarWidget, GoogleMap } from '../../shared/components'

const cities = {
    'Hà Nội': {
        center: [ 21.0227431, 105.8194541 ],
        zoom: 11
    },
    'Đà nẵng': {
        center: [ 16.0646499, 108.2296327 ],
        zoom: 11
    },
    'Hồ Chí Minh': {
        center: [ 10.6917996, 106.6503763 ],
        zoom: 9
    }
}

class SearchCity extends Component {
    onCityChange(e) {
        const value = e.target.value
        this.props.onCityChange(value != "0" && value, cities[ value ])
    }

    render() {
        const { onCityChange } = this.props
        return (
            <SidebarWidget noBorder noCollapse title={ localizationString.getString('Vị trí') }>
                <div className="no-left-space">
                    <Input type="select" onChange={ this.onCityChange.bind(this) }>
                        <option value={ 0 }>{ localizationString.getString('Chọn thành phố') }</option>
                        {
                            $.map(cities, (city, index) => {
                                return (
                                    <option key={ index } value={ index }>{ index }</option>
                                )
                            })
                        }
                    </Input>
                </div>
            </SidebarWidget>
        );
    }
}

export default SearchCity;