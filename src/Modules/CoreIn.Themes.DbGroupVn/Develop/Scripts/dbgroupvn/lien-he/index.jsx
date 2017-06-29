//React/Redux
import React, { Component } from 'react'
import { connect } from 'react-redux'

//Actions
import { refreshRoutePath } from '../routes'

//Components
import { default as BasePage } from '../shared/_layout/main/base-page'
import { Image, GoogleMap } from '../shared/components'
import { Container, Row, Col } from 'reactstrap'

//Helper function
const { dataRequest, getOptions } = require('../shared/utilities')

//Page configuration
const pageConfigure = require('./configuration.js')

class LienHe extends Component {
    componentWillMount() {
        const { onError, onDataFetch, dispatch, contactOptions } = this.props

        if (!contactOptions)
            getOptions('lien-he').then(function (contactOptions) {
                const constBodyStyle = { background: `url(${contactOptions.cover_image.url})` }
                onDataFetch({ contactOptions, constBodyStyle }, 100)
            })

        dispatch(refreshRoutePath(pageConfigure.page))
    }

    render() {
        if (this.props.dataFetchProgress != 100)
            return null

        const { match, constBodyStyle, contactOptions: { cover_image, texts, address, call_us, form, google_map } } = this.props

        if (__DEV__) {
            console.log(pageConfigure.page + ' props: ')
            console.log(this.props)
        }
        const map = {
            center: [ parseFloat(google_map.lat), parseFloat(google_map.lng) ],
            zoom: 15,
            markers: [
                {
                    id: 1,
                    lat: google_map.lat,
                    lng: google_map.lng
                }
            ]
        }

        return (
            <div id="contact" className="contact pt-lg-5">
                <div className="contact-body mb-5">
                    <div className="contact-body-content p-5" style={ constBodyStyle }>
                        <Container>
                            <h1 className="contact-title text-center h2 mb-3">{ texts.text1 }</h1>
                            <h4 className="text-center">{ texts.text2 }</h4>
                            <Row className="mt-5">
                                <Col xs={ 12 } lg={ 7 } className="mb-2 mb-lg-0">
                                    <p className="h5 mb-4"><strong>{ texts.text3 }</strong></p>
                                    <dl className="mb-4 pt-2">
                                        <dd>{ address.text1 }</dd>
                                        <dd><address className="m-0">{ address.text2 }</address></dd>
                                        <dd>{ address.text3 }</dd>
                                    </dl>
                                    <p className="h5 mb-4 pt-2"><strong>{ texts.text5 }</strong></p>
                                    <div className="pt-2">
                                        {
                                            $.map(call_us, (call, index) => {
                                                const tellNumber = String(call).replace('(', '').replace(')', '').replace(/\s/g, "")
                                                return (
                                                    <p key={ index } className="call-us">
                                                        <a href={ `tel:${tellNumber}` } title="Click here to call..."><span className="icon">{ index }</span> { call } </a>
                                                    </p>
                                                )
                                            })
                                        }
                                    </div>
                                </Col>
                                <Col xs={ 12 } lg={ 5 } className="pt-2 pt-lg-0">
                                    <p className="h5 mb-4"><strong>{ texts.text4 }</strong></p>
                                    <form className="contact-from pt-2" method="POST" className="fro">
                                        <div className="from-group mb-3">
                                            <input className="form-control" placeholder={ form.full_name } />
                                        </div>
                                        <div className="from-group mb-3">
                                            <input className="form-control" placeholder={ form.email } />
                                        </div>
                                        <div className="from-group mb-3">
                                            <input className="form-control" placeholder={ form.phone } />
                                        </div>
                                        <div className="from-group mb-3">
                                            <textarea className="form-control" placeholder={ form.message } />
                                        </div>
                                        <button className="send" type="submit">
                                            <img className="w-100" src={ form.send_button_image_Url } alt="Send you message" />
                                        </button>
                                    </form>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </div>
                <Container className="">
                    <Row>
                        <div className="contact-map-container">
                            <div className="contact-map">
                                <GoogleMap {...map} renderMarkerContent={ (marker) => {
                                    return <span style={ { color: '#000' } }>{ google_map.marker_text }</span>
                                } } />
                            </div>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}

const ConnectedLienHe = connect()(LienHe)

module.exports = BasePage({ page: pageConfigure.page, showBreadcrumbs: pageConfigure.showBreadcrumbs })(ConnectedLienHe);