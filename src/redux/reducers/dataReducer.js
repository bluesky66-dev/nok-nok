const INITIAL_STATE = {
  avatar: '',
  uid: '',
  phoneNumber:'',
  location: {lat: 0, long: 0},

};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...state,
        ...action.payload,
      };
      case 'SET_LOCATION':
        return {
          ...state,
          ...action.payload,
        };
        case 'SET_USER_DATA':
        return {          
          ...action.payload,
        };
    default:
      // Return the initial state when no action types match.
      return state;
  }
};
