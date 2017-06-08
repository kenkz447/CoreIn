const { NavLink } = require('react-router-dom');

const menuData = [
    {
        title: "trang chủ",
        url: "/"
    },
    {
        title: "về chúng tôi",
        url: "/ve-chung-toi"
    },
    {
        title: "công trình",
        url: "#"
    },
    {
        title: "dự án",
        url: "#"
    },
    {
        title: "bộ sưu tập",
        url: "#"
    },
    {
        title: "thư viện",
        url: "#"
    },
    {
        title: "hỏi đáp",
        url: "#"
    },
    {
        title: "liên hệ",
        url: "#"
    },
];

class Menu extends React.Component {
    render() {
        return (
            <ul className="menu text-uppercase pl-0 mb-0">
                {
                    menuData.map((menuItem, index) => {
                        return (
                            <li key={index} className="menu-item d-inline-block">
                                <NavLink to={menuItem.url} activeClassName="current">
                                    <span>{menuItem.title}</span>
                                </NavLink>
                            </li>)
                    })
                }
            </ul>
        );
    }
}

module.exports = Menu;