import {
   useReducer,
   createContext,
   useContext,
   useState,
   useEffect,
} from "react"

import Cookies from "js-cookie"

import {
   BoardDataType,
   CardData,
   BoardContextType,
   BoardProviderProps,
   LoadingActionTypes,
} from "../types/contextTypes"

import { loadingReducer, initialLoadingState } from "../reducers/loadingReducer"
import {
   fetchReducer,
   initialFetchReducerState,
} from "../reducers/fetchReducer"
import ACTIONS from "../types/actionTypes"

const BASE_URL = "http://localhost:9000"

const BoardContext = createContext<BoardContextType>({
   todoArray: [],
   progressArray: [],
   doneArray: [],
   boardsList: [],
   currentBoard: { board_name: "", id: "" },
   setCurrentBoard: () => {},
   BASE_URL: BASE_URL,
   boardsLoading: false,
   todoCardsLoading: false,
   progressCardsLoading: false,
   doneCardsLoading: false,
   dispatchCardsArray: () => {},
   addCard: () => {},
   editCard: () => {},
   changeCardStatus: () => {},
   deleteBoard: () => {},
   setBoardsList: () => {},
})

// BOARD PROVIDER

function BoardProvider({ children }: BoardProviderProps) {
   const [currentBoard, setCurrentBoard] = useState<BoardDataType>({
      board_name: "",
      id: "",
   })

   const [{ todoCards, progressCards, doneCards, boardsList }, dispatch] =
      useReducer(fetchReducer, initialFetchReducerState)

   const [hasFetchedBoards, setHasFetchedBoards] = useState(false)

   const dispatchLoading = (type: LoadingActionTypes, payload: boolean) => {
      dispatchLoadingState({
         type: ACTIONS[type],
         payload,
      })
   }

   const dispatchMultipleLoading = (
      types: LoadingActionTypes[],
      payload: boolean
   ) => {
      types.forEach((type) => {
         dispatchLoading(type, payload)
      })
   }

   const addCard = (newCard: CardData) => {
      switch (newCard.status) {
         case "todoCards":
            dispatch({ type: ACTIONS.SET_TODO, payload: newCard })
            break
         case "progressCards":
            dispatch({ type: ACTIONS.SET_PROGRESS, payload: newCard })
            break
         case "doneCards":
            dispatch({ type: ACTIONS.SET_DONE, payload: newCard })
            break
         default:
            throw new Error("Invalid card status")
      }
   }

   const editCard = (cardId: string, updatedCard: CardData) => {
      dispatch({ type: ACTIONS.EDIT_CARD, payload: { cardId, updatedCard } })
   }

   const changeCardStatus = (cardId: string, newStatus: string) => {
      dispatch({
         type: ACTIONS.CHANGE_CARD_STATUS,
         payload: { cardId, newStatus },
      })
   }

   const deleteBoard = (boardId: string) => {
      dispatch({
         type: ACTIONS.SET_BOARDS_LIST,
         payload: boardsList.filter((board) => board.id !== boardId),
      })

      fetchBoards()
   }

   const setBoardsList = (newBoardsList: BoardDataType[]) => {
      dispatch({ type: ACTIONS.SET_BOARDS_LIST, payload: newBoardsList })
      console.log(newBoardsList)

      fetchBoards()
   }

   const [
      {
         boardsLoading,
         todoCardsLoading,
         progressCardsLoading,
         doneCardsLoading,
      },
      dispatchLoadingState,
   ] = useReducer(loadingReducer, initialLoadingState)

   async function fetchCards(boardId: string) {
      dispatchMultipleLoading(
         [
            ACTIONS.SET_TODO_CARDS_LOADING,
            ACTIONS.SET_PROGRESS_CARDS_LOADING,
            ACTIONS.SET_DONE_CARDS_LOADING,
         ],
         true
      )

      try {
         const result = await fetch(`${BASE_URL}/api/boards/${boardId}/cards`)
         const cards = await result.json()

         cards.forEach((value: CardData) => {
            switch (value.status) {
               case "todoCards":
                  dispatch({
                     type: ACTIONS.SET_TODO,
                     payload: value,
                  })
                  break

               case "progressCards":
                  dispatch({
                     type: ACTIONS.SET_PROGRESS,
                     payload: value,
                  })
                  break

               case "doneCards":
                  dispatch({
                     type: ACTIONS.SET_DONE,
                     payload: value,
                  })
                  break

               default:
                  throw new Error("No such action")
            }
         })
      } catch (error) {
         console.error("Failed to fetch cards:", error)
      } finally {
         dispatchMultipleLoading(
            [
               ACTIONS.SET_TODO_CARDS_LOADING,
               ACTIONS.SET_PROGRESS_CARDS_LOADING,
               ACTIONS.SET_DONE_CARDS_LOADING,
            ],
            false
         )
      }
   }

   async function fetchBoards() {
      dispatchLoading(ACTIONS.SET_BOARDS_LOADING, true)
      console.log(boardsLoading)

      try {
         const res = await fetch(`${BASE_URL}/api/boards`)
         const data = await res.json()

         dispatch({
            type: ACTIONS.SET_BOARDS_LIST,
            payload: data,
         })
      } catch (error) {
         console.error("Failed to fetch boards:", error)
      } finally {
         dispatchLoading(ACTIONS.SET_BOARDS_LOADING, false)
         console.log(boardsLoading)
      }
   }

   useEffect(() => {
      if (currentBoard.id) {
         dispatch({ type: ACTIONS.RESET })
         fetchCards(currentBoard.id)
      }
   }, [currentBoard])

   useEffect(() => {
      if (boardsLoading && boardsList.length < 1 && !hasFetchedBoards) {
         fetchBoards()
         setHasFetchedBoards(true)
      }
   }, [boardsLoading, hasFetchedBoards])

   useEffect(() => {
      const boardId = Cookies.get("IlyaSemikashevKanbanBoard_BoardId")
      if (boardId !== undefined) {
         const currentBoard = boardsList.find((board) => board.id === boardId)
         if (currentBoard !== undefined) {
            setCurrentBoard(currentBoard)
         }
      } else if (boardsList.length > 0) {
         setCurrentBoard(boardsList[0])
      }
   }, [boardsList])

   return (
      <BoardContext.Provider
         value={{
            todoArray: todoCards,
            progressArray: progressCards,
            doneArray: doneCards,
            boardsList: boardsList,
            currentBoard: currentBoard,
            setCurrentBoard: setCurrentBoard,
            BASE_URL: BASE_URL,
            boardsLoading: boardsLoading,
            todoCardsLoading: todoCardsLoading,
            progressCardsLoading: progressCardsLoading,
            doneCardsLoading: doneCardsLoading,
            dispatchCardsArray: dispatch,
            addCard: addCard,
            editCard: editCard,
            changeCardStatus: changeCardStatus,
            deleteBoard: deleteBoard,
            setBoardsList: setBoardsList,
         }}
      >
         {children}
      </BoardContext.Provider>
   )
}

function useBoard() {
   const context = useContext(BoardContext)
   if (context === undefined) {
      throw new Error("BoardContext was used outside the BoardProvider")
   }
   return context
}

export { BoardProvider, useBoard }
