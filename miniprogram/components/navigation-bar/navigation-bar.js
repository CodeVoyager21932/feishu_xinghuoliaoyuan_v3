const app = getApp();

Component({
    properties: {
        title: {
            type: String,
            value: '星火'
        },
        showBack: {
            type: Boolean,
            value: false
        },
        showHome: {
            type: Boolean,
            value: false
        },
        color: {
            type: String,
            value: '#000000'
        },
        backgroundColor: {
            type: String,
            value: 'transparent'
        },
        backgroundClass: {
            type: String,
            value: '' // 'glass', 'transparent', etc.
        },
        fixed: {
            type: Boolean,
            value: true
        }
    },

    data: {
        statusBarHeight: 0,
        navBarHeight: 0,
        menuHeight: 0,
        menuTop: 0
    },

    lifetimes: {
        attached() {
            const { statusBarHeight, navBarHeight, menuHeight, menuBottom } = app.globalData;
            const menuTop = menuBottom + statusBarHeight;

            this.setData({
                statusBarHeight,
                navBarHeight,
                menuHeight,
                menuTop
            });
        }
    },

    methods: {
        onBack() {
            wx.navigateBack({
                delta: 1
            });
        },
        onHome() {
            wx.reLaunch({
                url: '/pages/index/index'
            });
        }
    }
});
