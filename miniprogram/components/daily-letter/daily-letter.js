// components/daily-letter/daily-letter.js
Component({
    properties: {
        visible: {
            type: Boolean,
            value: false
        },
        content: {
            type: String,
            value: '星星之火，可以燎原。我们在黑暗中寻找光明，在荆棘中开辟道路。愿你接过这把火炬，照亮前行的路。'
        },
        quote: {
            type: String,
            value: '世界是你们的，也是我们的，但是归根结底是你们的。'
        },
        author: {
            type: String,
            value: '一位老兵'
        }
    },

    data: {
        isOpen: false,
        todayDate: ''
    },

    lifetimes: {
        attached() {
            const now = new Date();
            this.setData({
                todayDate: `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`
            });
        }
    },

    methods: {
        close() {
            this.triggerEvent('close');
            // 延迟重置状态，以便下次打开时仍是信封
            setTimeout(() => {
                this.setData({ isOpen: false });
            }, 300);
        },

        openLetter() {
            this.setData({ isOpen: true });
            // 播放拆信音效 (可选)
            wx.vibrateShort({ type: 'light' });
        },

        checkIn() {
            this.triggerEvent('checkin');
            this.close();
        },

        preventScroll() { }
    }
})
