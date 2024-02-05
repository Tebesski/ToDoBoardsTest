import { Box, Button, Modal, TextField } from "@mui/material"
import DoneOutlineIcon from "@mui/icons-material/DoneOutline"
import BlockIcon from "@mui/icons-material/Block"

import { BoardDataType, useBoard } from "../../contexts/BoardContext"
import { useState } from "react"

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

export default function EditBoardModal(props: {
   boardEdit: boolean
   setBoardEdit: Function
   currentId: string | null | undefined
}) {
   const { boardEdit, setBoardEdit, currentId } = props
   const [boardTitle, setBoardTitle] = useState<string>()

   const { BASE_URL, boardsList } = useBoard()

   function handleCloseModal() {
      setBoardEdit(false)
      setBoardTitle("")
   }

   function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setBoardTitle(event.target.value)
   }

   async function handleSubmitBoardEditing() {
      if (boardTitle) {
         const board = boardsList.find((board) => board.id === currentId)

         async function updateBoardTitle() {
            const response = await fetch(`${BASE_URL}/boardsList/${board?.id}`)
            const existingData = await response.json()

            const updatedData: BoardDataType = {
               ...existingData,
               data: {
                  ...existingData.data,
                  boardName: boardTitle,
               },
            }

            await fetch(`${BASE_URL}/boardsList/${board?.id}`, {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(updatedData),
            })

            setBoardTitle("")
            setBoardEdit(false)
         }
         updateBoardTitle()
      } else {
      }
   }

   return (
      <Modal
         open={boardEdit}
         onClose={() => handleCloseModal()}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
      >
         <Box sx={style} display="flex" alignItems="center">
            <TextField
               placeholder="Enter new title..."
               size="small"
               autoFocus
               onChange={handleChangeTitle}
               value={boardTitle}
            />
            <div style={{ marginLeft: "3px" }}>
               <Button
                  color="success"
                  size="small"
                  onClick={() => handleSubmitBoardEditing()}
               >
                  <DoneOutlineIcon />
               </Button>
               <Button
                  color="error"
                  size="small"
                  onClick={() => handleCloseModal()}
               >
                  <BlockIcon />
               </Button>
            </div>
         </Box>
      </Modal>
   )
}
