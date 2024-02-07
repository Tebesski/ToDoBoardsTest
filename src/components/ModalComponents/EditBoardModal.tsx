import { useState } from "react"

import { Box, Button, Modal, TextField } from "@mui/material"
import DoneOutlineIcon from "@mui/icons-material/DoneOutline"
import BlockIcon from "@mui/icons-material/Block"

import { useBoard } from "../../contexts/BoardContext"

const style = {
   position: "absolute" as "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   bgcolor: "background.paper",
   border: "2px solid #000",
   boxShadow: 24,
   p: 2,
}

type EditBoardModalType = {
   boardEdit: boolean
   setBoardEdit: Function
   currentId: string | null | undefined
}

export default function EditBoardModal(props: EditBoardModalType) {
   const { boardEdit, setBoardEdit, currentId } = props
   const [boardName, setBoardName] = useState<string>("")
   const { BASE_URL, setBoardsList, boardsList } = useBoard()

   function handleCloseModal() {
      setBoardEdit(false)
      setBoardName("")
   }

   async function handleSubmitBoardEditing() {
      if (boardName) {
         try {
            await fetch(`${BASE_URL}/api/boards/${currentId}`, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ boardName }),
            })

            const updatedBoardsList = boardsList.map((board) =>
               board.id === currentId
                  ? { ...board, board_name: boardName }
                  : board
            )
            setBoardsList(updatedBoardsList)
            setBoardName("")
            setBoardEdit(false)
         } catch (error) {
            console.error("Error updating board title:", error)
         }
      } else {
         return
      }
   }

   return (
      <Modal
         open={boardEdit}
         onClose={handleCloseModal}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
      >
         <Box sx={style} display="flex" alignItems="center">
            <TextField
               placeholder="Enter new title..."
               size="small"
               autoFocus
               onChange={(e) => setBoardName(e.target.value)}
               value={boardName}
            />
            <div style={{ marginLeft: "3px" }}>
               <Button
                  color="success"
                  size="small"
                  onClick={handleSubmitBoardEditing}
               >
                  <DoneOutlineIcon />
               </Button>
               <Button color="error" size="small" onClick={handleCloseModal}>
                  <BlockIcon />
               </Button>
            </div>
         </Box>
      </Modal>
   )
}
