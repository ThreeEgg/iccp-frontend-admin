const GlobalModel = {
  namespace: 'app',
  state: {
    collapsed: false,
    notices: [],
  },
  effects: {},
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
