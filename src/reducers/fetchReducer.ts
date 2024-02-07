import { FetchReducerState, FetchReducerActions } from "../types/contextTypes"
import ACTIONS from "../types/actionTypes"

export const initialFetchReducerState: FetchReducerState = {
   todoCards: [],
   progressCards: [],
   doneCards: [],
   boardsList: [],
}

export function fetchReducer(
   state = initialFetchReducerState,
   action: FetchReducerActions
) {
   switch (action.type) {
      case ACTIONS.SET_TODO:
         if (!state.todoCards.find((card) => card.id === action.payload.id)) {
            return { ...state, todoCards: [...state.todoCards, action.payload] }
         }
         return state

      case ACTIONS.SET_PROGRESS:
         if (
            !state.progressCards.find((card) => card.id === action.payload.id)
         ) {
            return {
               ...state,
               progressCards: [...state.progressCards, action.payload],
            }
         }
         return state

      case ACTIONS.SET_DONE:
         if (!state.doneCards.find((card) => card.id === action.payload.id)) {
            return { ...state, doneCards: [...state.doneCards, action.payload] }
         }
         return state

      case ACTIONS.SET_BOARDS_LIST:
         return {
            ...state,
            boardsList: action.payload,
         }

      case ACTIONS.RESET:
         return { ...state, todoCards: [], progressCards: [], doneCards: [] }

      case ACTIONS.REMOVE_CARD:
         return {
            ...state,
            todoCards: state.todoCards.filter(
               (card) => card.id !== action.payload.cardId
            ),
            progressCards: state.progressCards.filter(
               (card) => card.id !== action.payload.cardId
            ),
            doneCards: state.doneCards.filter(
               (card) => card.id !== action.payload.cardId
            ),
         }

      case ACTIONS.EDIT_CARD:
         return {
            ...state,
            todoCards: state.todoCards.map((card) =>
               card.id === action.payload.cardId
                  ? action.payload.updatedCard
                  : card
            ),
            progressCards: state.progressCards.map((card) =>
               card.id === action.payload.cardId
                  ? action.payload.updatedCard
                  : card
            ),
            doneCards: state.doneCards.map((card) =>
               card.id === action.payload.cardId
                  ? action.payload.updatedCard
                  : card
            ),
         }

      case ACTIONS.CHANGE_CARD_STATUS:
         const { cardId, newStatus } = action.payload

         const cardInTodo = state.todoCards.find((card) => card.id === cardId)
         const cardInProgress = state.progressCards.find(
            (card) => card.id === cardId
         )
         const cardInDone = state.doneCards.find((card) => card.id === cardId)

         const cardToUpdate = cardInTodo || cardInProgress || cardInDone

         if (!cardToUpdate) {
            throw new Error(`Card with id ${cardId} not found`)
         }

         const updatedCard = { ...cardToUpdate, status: newStatus }

         return {
            ...state,
            todoCards:
               newStatus === "todoCards"
                  ? [...state.todoCards, updatedCard]
                  : state.todoCards.filter((card) => card.id !== cardId),
            progressCards:
               newStatus === "progressCards"
                  ? [...state.progressCards, updatedCard]
                  : state.progressCards.filter((card) => card.id !== cardId),
            doneCards:
               newStatus === "doneCards"
                  ? [...state.doneCards, updatedCard]
                  : state.doneCards.filter((card) => card.id !== cardId),
         }

      default:
         throw new Error("Unknown action")
   }
}
