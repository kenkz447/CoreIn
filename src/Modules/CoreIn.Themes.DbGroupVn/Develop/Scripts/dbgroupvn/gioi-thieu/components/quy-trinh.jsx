const { Container } = require('reactstrap');
const { Title } = require('../../shared/components');

module.exports = class extends React.Component {
    componentDidMount() {
        $(".cd-timeline-block").each(function (index) {
            const $this = $(this);
            var objPrev = $this.prev('.cd-timeline-block');
            if (objPrev.hasClass('odd')) {
                $this.find('.cd-timeline-content p').attr('data-aos', 'zoom-in');
                $this.find('.cd-timeline-content h2').attr('data-aos', 'zoom-in');

                $this.addClass('even');
            } else {
                $this.find('.cd-timeline-content p').attr('data-aos', 'zoom-in');
                $this.find('.cd-timeline-content h2').attr('data-aos', 'zoom-in');
                $this.addClass('odd');
            }
        });
    }

    render() {

        const { items, title } = this.props;

        var array = items.map(item => {
            var strs = String(item.value).split('\n');
            var obj = {};
            for (var i in strs) {
                var str = strs[i].split(':');
                if (str.length == 2) {
                    var kv = str;
                    var k = kv[0].trim();
                    var v = kv[1].trim();
                    obj[k] = v;
                }
            }
            return obj;
        });

        return (
            <Container>
                <Title>{title}</Title>
                <section id="cd-timeline">
                    {
                        array.map((item, index) => {
                            if (!item.content) {
                                return (
                                    <p className="cd-timeline-title">
                                        <span className="text">
                                            {item.label}
                                        </span>
                                    </p>
                                );
                            }
                            return (
                                <div className="cd-timeline-block clearfix">
                                    <div className="cd-timeline-dot" />
                                    <div className="cd-timeline-content clearfix">
                                        <h2>{item.label}</h2>
                                        <p>{item.content}</p>
                                        <div className="cd-icon">
                                            <img src={item.icon} alt={item.title} />
                                        </div>
                                    </div>
                                </div>
                            );

                        })
                    }
                </section>
            </Container>
        );
    }
}
