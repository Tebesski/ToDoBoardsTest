const ACTIONS = {
   SET_TODO: "SET_TODO",
   SET_PROGRESS: "SET_PROGRESS",
   SET_DONE: "SET_DONE",
   EDIT_CARD: "EDIT_CARD",
   CHANGE_CARD_STATUS: "CHANGE_CARD_STATUS",
   SET_BOARDS_LIST: "SET_BOARDS_LIST",
   RESET: "RESET",
   REMOVE_CARD: "REMOVE_CARD",
   SET_BOARDS_LOADING: "SET_BOARDS_LOADING",
   SET_TODO_CARDS_LOADING: "SET_TODO_CARDS_LOADING",
   SET_PROGRESS_CARDS_LOADING: "SET_PROGRESS_CARDS_LOADING",
   SET_DONE_CARDS_LOADING: "SET_DONE_CARDS_LOADING",
} as const

export default ACTIONS
