const ticketRule = {
  state: {
    ruleData: {},
    policyList: [],
  },

  mutations: {
    SET_DATA: (state, data) => {
      state.ruleData = data;
    },
    SET_POLICY: (state, data) => {
      state.policyList = data;
    },
  },

  actions: {},
};

export default ticketRule;
