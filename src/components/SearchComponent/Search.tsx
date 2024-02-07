import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Autocomplete, Box, ListItemButton, TextField } from "@mui/material"

import Cookies from "js-cookie"
import { v4 as uuiv4 } from "uuid"

import { useBoard } from "../../contexts/BoardContext"

export default function Search() {
   const { boardsList, setCurrentBoard, currentBoard } = useBoard()
   const [searchOpen, setSearchOpen] = useState(false)

   const navigate = useNavigate()

   function onLinkClick(event: React.MouseEvent<HTMLAnchorElement>) {
      const target = event.target as HTMLAnchorElement
      const boardId = target.dataset.boardid
      setSearchOpen(false)

      if (boardId) {
         const currentBoard = boardsList.find((board) => board.id === boardId)

         if (currentBoard) {
            setCurrentBoard(currentBoard)

            if (Cookies.get("IlyaSemikashevKanbanBoard_BoardId")) {
               Cookies.remove("IlyaSemikashevKanbanBoard_BoardId")
            }

            Cookies.set(
               "IlyaSemikashevKanbanBoard_BoardId",
               `${currentBoard.id}`,
               {
                  expires: 7,
               }
            )

            // Navigate to the new route after the currentBoard state is updated
            navigate(`/boards/${currentBoard.id}`)
         }
      }
   }
   return (
      <>
         {
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
                           (board) => board.board_name === option
                        )
                        return (
                           <li key={uuiv4()}>
                              <Link
                                 to="#"
                                 style={{
                                    textDecoration: "none",
                                    color: "black",
                                 }}
                                 onClick={onLinkClick}
                              >
                                 <ListItemButton data-boardid={`${board?.id}`}>
                                    {board?.board_name}
                                 </ListItemButton>
                              </Link>
                           </li>
                        )
                     } else return null
                  }}
                  options={
                     boardsList.length > 0
                        ? boardsList.map((board) => board.board_name)
                        : []
                  }
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                     <TextField {...params} label="Available boards" />
                  )}
                  value={
                     boardsList.some((board) => board.id === currentBoard.id)
                        ? currentBoard.board_name
                        : ""
                  }
                  autoComplete
                  autoHighlight
               />
            </Box>
         }
      </>
   )
}

{
}
