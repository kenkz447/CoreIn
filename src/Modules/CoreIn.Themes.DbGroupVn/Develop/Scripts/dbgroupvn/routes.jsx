
import TrangChu from './trang-chu/index'
import VeChungToi from './gioi-thieu/index'
import CongTrinh from './cong-trinh/index'
import BoSuuTap from './bo-suu-tap/index'
import DuAn from './du-an/index'
import ThuVien from './thu-vien/index'
import HoiDap from './hoi-dap/index'
import LienHe from './lien-he/index'
import { DEFAULT_MENU } from './shared/reducers/app-routes'

const routes = ({
    exact: true,
    path: '/',
    name: 'trang-chu',
    label: localizationString.getString('Trang chủ'),
    menuOrders: {
        [ DEFAULT_MENU ]: 1,
        footer: 3
    },
    component: TrangChu,
    childRoutes: [
        {
            exact: true,
            path: '/ve-chung-toi',
            name: 've-chung-toi',
            defaultLabel: localizationString.getString('Về chúng tôi'),
            menuOrders: {
                [ DEFAULT_MENU ]: 2,
            },
            component: VeChungToi
        },
        {
            path: '/cong-trinh',
            name: 'cong-trinh',
            defaultLabel: localizationString.getString('Công trình'),
            menuOrders: {
                [ DEFAULT_MENU ]: 3,
            },
            component: CongTrinh,
            redirectToChild: 1,
            childRoutes: [
                {
                    path: '/chi-tiet/:entity',
                    name: 'cong-trinh-chi-tiet',
                },
                {
                    exact: false,
                    path: '/:category',
                    name: 'cong-trinh-category',
                    defaultLocation: '/tat-ca',
                }
            ]
        },
        {
            path: '/bo-suu-tap',
            name: 'bo-suu-tap',
            defaultLabel: localizationString.getString('Bộ sưu tập'),
            menuOrders: {
                [ DEFAULT_MENU ]: 4,
            },
            component: BoSuuTap,
            redirectToChild: 1,
            childRoutes: [
                {
                    path: '/chi-tiet/:entity',
                    name: 'bo-suu-tap-chi-tiet',
                },
                {
                    exact: false,
                    path: '/:category',
                    name: 'bo-suu-tap-category',
                    defaultLocation: '/tat-ca',
                }
            ]
        },
        {
            path: '/du-an',
            name: 'du-an',
            defaultLabel: localizationString.getString('Dự án'),
            menuOrders: {
                [ DEFAULT_MENU ]: 5,
            },
            component: DuAn,
            redirectToChild: 1,
            childRoutes: [
                {
                    path: '/du-an/ban-do/:category',
                    name: 'ban-do-du-an',
                },
                {
                    path: '/du-an/loai-cong-trinh/:category',
                    name: 'du-an-category',
                    defaultLocation: '/loai-cong-trinh/tat-ca',
                },
                {
                    path: '/du-an/chi-tiet/:du-an',
                    name: 'du-an-chi-tiet',
                }
            ]
        },
        {
            path: '/thu-vien',
            name: 'thu-vien',
            redirectToChild: 1,
            defaultLabel: localizationString.getString('Thư viện'),
            component: ThuVien,
            menuOrders: {
                [ DEFAULT_MENU ]: 6,
            },
            childRoutes: [
                {
                    path: '/chi-tiet/:blog',
                    name: 'thu-vien-chi-tiet',
                },
                {
                    exact: false,
                    path: '/:category',
                    name: 'thu-vien-category',
                    defaultLocation: '/tat-ca',
                }
            ]
        },
        {
            path: '/hoi-dap',
            name: 'hoi-dap',
            defaultLabel: localizationString.getString('Hỏi đáp'),
            menuOrders: {
                [ DEFAULT_MENU ]: 7,
                footer: 2
            },
            component: HoiDap
        },
        {
            path: '/lien-he',
            name: 'lien-he',
            defaultLabel: localizationString.getString('Liên hệ'),
            menuOrders: {
                [ DEFAULT_MENU ]: 8,
            },
            component: LienHe
        },
        {
            path: '/phuong-phap',
            name: 'phuong-phap',
            defaultLabel: localizationString.getString('Liên hệ'),
            menuOrders: {
                footer: 1
            },
            component: LienHe
        },
    ]
})

export default routes