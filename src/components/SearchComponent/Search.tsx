import React, { useState } from "react"
import { Autocomplete, Box, ListItemButton, TextField } from "@mui/material"
import { useBoard } from "../../contexts/BoardContext"
import Cookies from "js-cookie"
import { v4 as uuiv4 } from "uuid"
import { Link } from "react-router-dom"

export default function Search() {
   const { boardsList, isLoading, setBoard, currentBoard } = useBoard()
   const [searchOpen, setSearchOpen] = useState(false)

   function onLinkClick(event: React.MouseEvent<HTMLDivElement>) {
      const target = event.target as HTMLDivElement
      const boardName = target.dataset.boardname
      setSearchOpen(false)

      if (boardName) {
         const currentBoard = boardsList.find(
            (board) => board.data.boardName === boardName
         )

         if (currentBoard !== undefined) {
            setBoard(currentBoard)

            if (
               Cookies.get("IlyaSemikashevKanbanBoard_BoardId") !== undefined
            ) {
               Cookies.remove("IlyaSemikashevKanbanBoard_BoardId")
            }

            Cookies.set(
               "IlyaSemikashevKanbanBoard_BoardId",
               `${currentBoard.id}`,
               {
                  expires: 7,
               }
            )
         }
      }
   }

   return (
      <>
         {isLoading ? null : (
            <Box>
               <Autocomplete
                  onOpen={() => setSearchOpen(true)}
                  onClose={() => setSearchOpen(false)}
                  open={searchOpen}
                  id="search-board"
                  noOptionsText={"You haven't created any board, yet"}
                  renderOption={(_props, option) => {
                     if (boardsList.length > 0) {
                        const board = boardsList.find(
                           (board) => board.data.boardName === option
                        )
                        return (
                           <li key={uuiv4()}>
                              <Link
                                 to={`/boards/${board?.id}`}
                                 style={{
                                    textDecoration: "none",
                                    color: "black",
                                 }}
                              >
                                 <ListItemButton
                                    onClick={onLinkClick}
                                    data-boardname={`${board?.data.boardName}`}
                                 >
                                    {board?.data.boardName}
                                 </ListItemButton>
                              </Link>
                           </li>
                        )
                     } else return null
                  }}
                  options={
                     boardsList.length > 0
                        ? boardsList.map((board) => board.data.boardName)
                        : []
                  }
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                     <TextField {...params} label="Available boards" />
                  )}
                  value={
                     currentBoard.id.length > 0
                        ? currentBoard.data.boardName
                        : ""
                  }
                  autoComplete
                  autoHighlight
               />
            </Box>
         )}
      </>
   )
}

{
}
