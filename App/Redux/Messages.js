export const APPEND = 'messages/APPEND';
export const SET_ROOM_ID = 'messages/SET_ROOM_ID';
export const START_POLLING = 'messages/START_POLLING';
export const SEND_MESSAGE = 'messages/SEND_MESSAGE';

const INITIAL_STATE = {
  roomId: null,
  data: []
};

export const startPollingMessages = ({ address, exploratoryMessage }) => ({
  type: START_POLLING,
  payload: { address, exploratoryMessage }
});

export const stopPollingMessages = () => setRoomId(null);

export const setRoomId = roomId => ({
  type: SET_ROOM_ID,
  payload: { roomId }
});

export const appendMessages = ({ data }) => ({
  type: APPEND,
  payload: { data }
});

export const sendMessage = ({ toPersonEmail, text, files }) => ({
  type: SEND_MESSAGE,
  payload: { toPersonEmail, text, files }
});

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_ROOM_ID:
      return { ...INITIAL_STATE, roomId: action.payload.roomId };

    case APPEND:
      return { ...state, data: state.data.concat(action.payload.data) };

    default:
      return state;
  }
}
