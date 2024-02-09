export type BoardDataType = {
   board_name: string
   id: string
}

export type CardData = {
   title: string
   content: string
   status: string
   id: string
}

export type BoardContextType = {
   todoArray: CardData[]
   progressArray: CardData[]
   doneArray: CardData[]
   boardsList: BoardDataType[]
   currentBoard: BoardDataType
   setCurrentBoard: React.Dispatch<React.SetStateAction<BoardDataType>>
   API_URL: string
   boardsLoading: boolean
   todoCardsLoading: boolean
   progressCardsLoading: boolean
   doneCardsLoading: boolean
   dispatchCardsArray: React.Dispatch<FetchReducerActions>
   addCard: (newCard: CardData) => void
   editCard: (cardId: string, updatedCard: CardData) => void
   changeCardStatus: (cardId: string, newStatus: string) => void
   deleteBoard: (boardId: string) => void
   setBoardsList: (newBoardsList: BoardDataType[]) => void
}

export type BoardProviderProps = {
   children: React.ReactElement
}

export type FetchReducerState = {
   todoCards: CardData[]
   progressCards: CardData[]
   doneCards: CardData[]
   boardsList: BoardDataType[]
}

export type FetchReducerActions =
   | { type: "SET_TODO"; payload: CardData }
   | { type: "SET_PROGRESS"; payload: CardData }
   | { type: "SET_DONE"; payload: CardData }
   | { type: "SET_BOARDS_LIST"; payload: BoardDataType[] }
   | { type: "REMOVE_CARD"; payload: { cardId: string } }
   | { type: "RESET" }
   | { type: "EDIT_CARD"; payload: { cardId: string; updatedCard: CardData } }
   | {
        type: "CHANGE_CARD_STATUS"
        payload: { cardId: string; newStatus: string }
     }

export type LoadingReducerState = {
   boardsLoading: boolean
   todoCardsLoading: boolean
   progressCardsLoading: boolean
   doneCardsLoading: boolean
}

export enum LoadingActionTypes {
   SET_BOARDS_LOADING = "SET_BOARDS_LOADING",
   SET_TODO_CARDS_LOADING = "SET_TODO_CARDS_LOADING",
   SET_PROGRESS_CARDS_LOADING = "SET_PROGRESS_CARDS_LOADING",
   SET_DONE_CARDS_LOADING = "SET_DONE_CARDS_LOADING",
}

export type LoadingReducerAction =
   | { type: LoadingActionTypes.SET_BOARDS_LOADING; payload: boolean }
   | { type: LoadingActionTypes.SET_TODO_CARDS_LOADING; payload: boolean }
   | { type: LoadingActionTypes.SET_PROGRESS_CARDS_LOADING; payload: boolean }
   | { type: LoadingActionTypes.SET_DONE_CARDS_LOADING; payload: boolean }
