import React, { Component } from 'react'
import { Input, Label } from 'reactstrap'
import { SidebarWidget } from '../../shared/components'

class AreaSearch extends Component {
    constructor(props) {
        super(props);
        this.ranges = [
            { form: 1, to: 3 },
            { form: 4, to: 6 },
            { form: 7, to: 9 }
        ]
    }

    render() {
        const { onSearch } = this.props
        return (
            <SidebarWidget className="custom-controls-stacked" title={ localizationString.getString("Diện tích") }>
                <label className="custom-control custom-radio">
                    <input id="radioStacked1" name="radio-stacked" type="radio" className="custom-control-input" onChange={ () => {
                        onSearch(-1, -1)
                    } } />
                    <span className="custom-control-indicator"></span>
                    <span className="custom-control-description">
                        { `${localizationString.getString('Mọi diện tích')}` }
                    </span>
                </label>
                {
                    this.ranges.map(({ form, to }, index) => (
                        <label key={ index } className="custom-control custom-radio">
                            <input id="radioStacked1" name="radio-stacked" type="radio" className="custom-control-input" data-from={ form } data-to={ to } onChange={ () => {
                                onSearch(form, to)
                            } } />
                            <span className="custom-control-indicator"></span>
                            <span className="custom-control-description">
                                { `${localizationString.getString('từ')} ${form} ${localizationString.getString('đến')} ${to}` }
                            </span>
                        </label>
                    ))
                }
            </SidebarWidget>
        );
    }
}

export default AreaSearch;