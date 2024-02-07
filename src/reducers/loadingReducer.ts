import {
   LoadingReducerState,
   LoadingReducerAction,
} from "../types/contextTypes"

export const initialLoadingState: LoadingReducerState = {
   boardsLoading: true,
   todoCardsLoading: false,
   progressCardsLoading: false,
   doneCardsLoading: false,
}

export function loadingReducer(
   state = initialLoadingState,
   action: LoadingReducerAction
) {
   switch (action.type) {
      case "SET_BOARDS_LOADING":
         return { ...state, boardsLoading: action.payload }
      case "SET_TODO_CARDS_LOADING":
         return { ...state, todoCardsLoading: action.payload }
      case "SET_PROGRESS_CARDS_LOADING":
         return { ...state, progressCardsLoading: action.payload }
      case "SET_DONE_CARDS_LOADING":
         return { ...state, doneCardsLoading: action.payload }

      default:
         return state
   }
}
