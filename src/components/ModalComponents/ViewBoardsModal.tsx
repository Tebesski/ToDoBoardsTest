import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

import {
   Box,
   Button,
   Dialog,
   DialogContent,
   DialogTitle,
   Divider,
   Grow,
   TextField,
   Typography,
} from "@mui/material"

import { useBoard } from "../../contexts/BoardContext"
import { BoardDataType } from "../../contexts/BoardContext"
import BoardsTable from "./BoardsTable"

type ViewBoardsModalPropsType = {
   viewBoardOpen: boolean
   setViewBoardOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewBoardsModal({
   viewBoardOpen,
   setViewBoardOpen,
}: ViewBoardsModalPropsType) {
   const { boardsList, setIsLoading, BASE_URL } = useBoard()

   const [newBoard, setNewBoard] = useState<BoardDataType>({
      data: {
         boardName: "",
         cards: [],
      },
      id: "",
   })

   const [boardName, setBoardName] = useState("")

   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   async function handleSetNewBoard() {
      if (boardName) {
         setSuccess(true)
         setTimeout(() => {
            setSuccess(false)
         }, 2000)

         setBoardName("")
         setNewBoard((oldValue) => {
            return { data: { ...oldValue.data }, id: uuidv4() }
         })
      } else {
         setError(true)
         setTimeout(() => {
            setError(false)
         }, 2000)
      }
   }

   useEffect(() => {
      if (newBoard.id) {
         async function handleAddNewBoard() {
            setIsLoading(true)
            const boardJson = JSON.stringify(newBoard)
            await fetch(`${BASE_URL}/boardsList`, {
               method: "POST",
               body: boardJson,
            })
            setIsLoading(false)
         }
         handleAddNewBoard()
      }
   }, [newBoard.id])

   const table = <BoardsTable setViewBoardOpen={setViewBoardOpen} />

   return (
      <Dialog
         open={viewBoardOpen}
         onClose={() => setViewBoardOpen(false)}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
         fullWidth={true}
         sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
         }}
      >
         <DialogTitle>MANAGE YOUR BOARDS</DialogTitle>
         <DialogContent
            sx={{
               display: "flex",
               flexDirection: "column",
            }}
         >
            <Box sx={{ display: "flex" }}>
               <TextField
                  value={boardName}
                  placeholder="Enter a title of the new board..."
                  sx={{ width: 1 / 2 }}
                  onChange={(e) => {
                     setBoardName(e.target.value)
                     setNewBoard((oldValue) => {
                        return {
                           ...oldValue,
                           data: {
                              ...oldValue.data,
                              boardName: e.target.value,
                           },
                        }
                     })
                  }}
               />
               {error ? (
                  <Grow in={error}>
                     <Button
                        disabled
                        variant="contained"
                        sx={{
                           minWidth: "160px",
                           ml: 1,
                           "&:disabled": {
                              backgroundColor: "#f44336",
                              color: "#fff",
                           },
                        }}
                     >
                        ENTER A TITLE
                     </Button>
                  </Grow>
               ) : success ? (
                  <Button
                     disabled
                     variant="contained"
                     sx={{
                        minWidth: "160px",
                        ml: 1,
                        "&:disabled": {
                           backgroundColor: "#4caf50",
                           color: "#fff",
                        },
                     }}
                  >
                     BOARD ADDED!
                  </Button>
               ) : (
                  <Button
                     sx={{ ml: 1, minWidth: "160px" }}
                     onClick={handleSetNewBoard}
                  >
                     ADD A NEW BOARD
                  </Button>
               )}
            </Box>
            <Divider sx={{ borderBottomWidth: 3, mt: 2, mb: 2 }} />
            <Box>
               <Typography variant="h6">YOUR BOARDS:</Typography>
               {boardsList.length > 0 ? (
                  table
               ) : (
                  <Typography>
                     You haven't created any board, yet. Let's fix it! ;)
                  </Typography>
               )}
            </Box>
         </DialogContent>
      </Dialog>
   )
}
