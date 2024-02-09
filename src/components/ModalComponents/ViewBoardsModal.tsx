import { useState } from "react"
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
import BoardsTable from "./BoardsTable"
import { addNewBoard } from "../../api/api"

type ViewBoardsModalPropsType = {
   viewBoardOpen: boolean
   setViewBoardOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ViewBoardsModal({
   viewBoardOpen,
   setViewBoardOpen,
}: ViewBoardsModalPropsType) {
   const { setBoardsList, boardsList } = useBoard()

   const [boardName, setBoardName] = useState("")
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(false)

   // ADD NEW BOARD
   async function handleAddNewBoard(name: string) {
      if (!boardName) {
         setError(true)
         setTimeout(() => {
            setError(false)
         }, 1000)
         return
      }
      try {
         const newBoard = await addNewBoard(name)

         if (newBoard.success) {
            setBoardName("")
            setSuccess(true)
            setTimeout(() => {
               setSuccess(false)
            }, 1000)

            setBoardsList([
               ...boardsList,
               {
                  id: newBoard.boardId,
                  board_name: name,
               },
            ])
         }
      } catch (error) {
         console.error("Error creating new board:", error)
      }
   }

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
                  onChange={(e) => setBoardName(e.target.value)}
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
                     onClick={() => handleAddNewBoard(boardName)}
                  >
                     ADD A NEW BOARD
                  </Button>
               )}
            </Box>
            <Divider sx={{ borderBottomWidth: 3, mt: 2, mb: 2 }} />
            <Box>
               <Typography variant="h6">YOUR BOARDS:</Typography>
               <BoardsTable />
            </Box>
         </DialogContent>
      </Dialog>
   )
}
