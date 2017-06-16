
const $ = require('jquery');
const OwlCarousel = require('react-owl-carousel2');

class Slider extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            slides: []
            /* Chú ý: slides không phải là một array của hình ảnh.
            Ví dụ cho 'slides'
                slides: [
                    {
                        "image": {
                            "urlThumb": "uploads/2/2017/6/slider-2-2017-6-9-310_thumb.jpg",
                            "dimension": "Size [ Width=1058, Height=463 ]",
                            "title": "slider-2",
                            "description": null,
                            "fileName": null,
                            "url": "uploads/2/2017/6/slider-2-2017-6-9-310.jpg",
                            "type": "Image",
                            "extension": ".jpg",
                            "size": "194 KB",
                            "taxonomyTypes": null
                        }
                    },...
                ]
            Hình ảnh('image') chỉ là một prop của 'slide', và còn một số prop khác như caption, etc... sẽ được thêm vào sau này nếu cần thiết.
            */,
            options: {
                items: 1,
                nav: false,
                rewind: false,
                autoplay: true
            }
        };
        $.get(
            "/album/getsingle?entityName=home-slider",
            (response) => {
                this.setState({slides: response.details.images})
            }
        );
    }

    componentWillUpdate(){
    }

    render(){
        return (
            <div className={this.props.className}>
                { this.state.slides.length && 
                    <OwlCarousel ref={owl => {this.owl = owl;}} options={this.state.options}>
                    {
                        this.state.slides.map((slide, index) => {
                            return(
                                <div key={index} id={`slide${index}`}>
                                    <img src={slide.image.url} alt={slide.image.description} title={slide.image.title}/>
                                </div>
                            )
                        })
                    }
                    </OwlCarousel>
                }
            </div>
        );
    }
};

module.exports = Slider;