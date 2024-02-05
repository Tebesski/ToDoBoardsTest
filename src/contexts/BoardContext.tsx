import React, {
   useReducer,
   createContext,
   useContext,
   useState,
   useEffect,
} from "react"
import Cookies from "js-cookie"

import { CardData } from "../components/CardComponent/Card"

export type BoardDataType = {
   data: {
      boardName: string
      cards: string[]
   }
   id: string
}

type BoardContextType = {
   todoArray: CardData[]
   progressArray: CardData[]
   doneArray: CardData[]
   setArray: React.Dispatch<BoardReducerActions>
   boardsList: BoardDataType[]
   currentBoard: BoardDataType
   setBoard: React.Dispatch<React.SetStateAction<BoardDataType>>
   isLoading: boolean
   setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
   BASE_URL: string
}

type BoardProviderProps = {
   children: React.ReactElement
}

type BoardReducerState = {
   todoCards: CardData[]
   progressCards: CardData[]
   doneCards: CardData[]
   boardsList: BoardDataType[]
}

type BoardReducerActions =
   | { type: "setTodo"; payload: CardData[] }
   | { type: "setProgress"; payload: CardData[] }
   | { type: "setDone"; payload: CardData[] }
   | { type: "setBoardsList"; payload: BoardDataType[] }

const BASE_ULR = "http://localhost:9000"

const BoardContext = createContext<BoardContextType>({
   todoArray: [],
   progressArray: [],
   doneArray: [],
   boardsList: [],
   currentBoard: { data: { boardName: "", cards: [] }, id: "" },
   setBoard: () => {},
   setIsLoading: () => {},
   isLoading: false,
   BASE_URL: BASE_ULR,
   setArray: function (): void {},
})

const initialState: BoardReducerState = {
   todoCards: [],
   progressCards: [],
   doneCards: [],
   boardsList: [],
}

function reducer(state = initialState, action: BoardReducerActions) {
   switch (action.type) {
      case "setTodo":
         return { ...state, todoCards: [...state.todoCards, ...action.payload] }

      case "setProgress":
         return {
            ...state,
            progressCards: [...state.progressCards, ...action.payload],
         }

      case "setDone":
         return { ...state, doneCards: [...state.doneCards, ...action.payload] }

      case "setBoardsList":
         return {
            ...state,
            boardsList: [...state.boardsList, ...action.payload],
         }

      default:
         throw new Error("Unknown action")
   }
}

function BoardProvider({ children }: BoardProviderProps) {
   const [isLoading, setIsLoading] = useState(true)
   const [currentBoard, setCurrentBoard] = useState<BoardDataType>({
      data: { boardName: "", cards: [] },
      id: "",
   })

   const [{ todoCards, progressCards, doneCards, boardsList }, dispatch] =
      useReducer(reducer, initialState)

   async function fetchCards() {
      let urls = [
         { url: "http://localhost:9000/todoCards", type: "todo" },
         { url: "http://localhost:9000/progressCards", type: "progress" },
         { url: "http://localhost:9000/doneCards", type: "done" },
         { url: "http://localhost:9000/boardsList", type: "boards" },
      ]

      let requests = urls.map((item) =>
         fetch(item.url).then((response) => response.json())
      )

      Promise.all(requests).then((responses) =>
         responses.forEach((value, i) => {
            const url = urls[i]
            switch (url.type) {
               case "todo":
                  dispatch({
                     type: "setTodo",
                     payload: value,
                  })
                  break

               case "progress":
                  dispatch({
                     type: "setProgress",
                     payload: value,
                  })
                  break

               case "done":
                  dispatch({
                     type: "setDone",
                     payload: value,
                  })
                  break

               case "boards":
                  dispatch({
                     type: "setBoardsList",
                     payload: value,
                  })
                  setIsLoading(false)
                  break

               default:
                  throw new Error("No such action")
            }
         })
      )
   }

   useEffect(
      function () {
         if (isLoading && boardsList.length < 1) {
            const timeout = setTimeout(() => {
               fetchCards()
            }, 0)

            return () => {
               clearTimeout(timeout)
            }
         }
      },
      [isLoading, boardsList, todoCards, progressCards, doneCards]
   )

   useEffect(() => {
      if (Cookies.get("IlyaSemikashevKanbanBoard_BoardId") !== undefined) {
         const currentBoard = boardsList.find(
            (board) =>
               board.id === Cookies.get("IlyaSemikashevKanbanBoard_BoardId")
         )
         if (currentBoard !== undefined) {
            setCurrentBoard(currentBoard)
         }
      } else if (boardsList.length > 0) {
         setCurrentBoard(boardsList[0])
      }
   }, [boardsList.length, currentBoard])

   return (
      <BoardContext.Provider
         value={{
            todoArray: todoCards,
            progressArray: progressCards,
            doneArray: doneCards,
            setArray: dispatch,
            boardsList: boardsList,
            isLoading: isLoading,
            currentBoard: currentBoard,
            setBoard: setCurrentBoard,
            setIsLoading: setIsLoading,
            BASE_URL: BASE_ULR,
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
