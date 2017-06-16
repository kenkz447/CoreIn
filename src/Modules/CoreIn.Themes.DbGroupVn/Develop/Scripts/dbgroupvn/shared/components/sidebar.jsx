class Sidebar extends React.Component {
    render() {
        const { children } = this.props
        return (
            <aside className="sidebar mr-lg-4">
                { children }
            </aside>
        )
    }
}

export default Sidebar