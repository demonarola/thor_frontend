import { environment } from '../environments/environment';

export const rootConfig = {
    title: 'Thorium',
    menu: {
        selectedColor: 'White',
        selectedClass: 'menu-item-selected',
        groups: [
            {
                items: [
                    {
                        id: 11,
                        label: 'map',
                        route: '/map',
                        icon: 'map',
                        scope: environment.scopes.map
                    },

                ],
                divider: true
            },
            {
                items: [
                    {
                        id: 21,
                        label: 'vehicles',
                        route: '/vehicles',
                        icon: 'directions_boat',
                        scope: environment.scopes.vehicles
                    },
                    {
                        id: 22,
                        label: 'locations',
                        route: '/locations',
                        icon: 'gps_fixed',
                        scope: environment.scopes.locations
                    },
                    {
                        id: 23,
                        label: 'modules',
                        route: '/modules',
                        icon: 'view_module',
                        scope: environment.scopes.hw_modules
                    },
                ],
                divider: true
            },
            {
                items: [
                    {
                        id: 31,
                        label: 'console',
                        route: '/console',
                        icon: 'code',
                        scope: environment.scopes.console
                    }
                ],
            },
            {
                items: [
                    {
                        id: 61,
                        label: 'report',
                        route: '/report',
                        icon: 'report',
                        scope: environment.scopes.report
                    }
                ],
                // divider: true
            },
            {
                items: [
                    {
                        id: 42,
                        label: 'rebate',
                        route: '/rebate',
                        icon: 'redeem',
                        scope: environment.scopes.rebate
                    },
                    {
                        id: 41,
                        label: 'subscription',
                        route: '/subscription',
                        icon: 'subscriptions',
                        scope: environment.scopes.subscription
                    }
                ],
                divider: true
            },
            {
                items: [
                    {
                        id: 43,
                        label: 'support',
                        route: '/support',
                        icon: 'bug_report',
                        scope: environment.scopes.support
                    }
                ],
                divider: true
            },
            {
                items: [
                    {
                        id: 71,
                        label: 'rent',
                        route: '/rent',
                        icon: 'assignment',
                        scope: environment.scopes.rent
                    }
                ],
                divider: true
            },
            {
                items: [
                    {
                        id: 51,
                        label: 'user-management',
                        route: '/user-management',
                        icon: 'person',
                        scope: environment.scopes.user_management
                    }
                ],
            },
        ]
    },
    navbar: {
        icon: 'assets:navbar-icon'
    }
};
