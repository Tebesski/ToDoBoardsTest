import { useState } from "react"
import {
   Alert,
   Button,
   Dialog,
   DialogContent,
   DialogTitle,
   Fade,
   MenuItem,
   Select,
   TextField,
   SelectChangeEvent,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"

import { useBoard } from "../../contexts/BoardContext"
import { CardData } from "../../types/contextTypes"
import { addNewCard } from "../../api/api"

export default function AddCardModal({
   columnType,
}: {
   columnType: "todoCards" | "progressCards" | "doneCards"
}) {
   const { currentBoard, addCard } = useBoard()
   const [open, setOpen] = useState(false)
   const [cardData, setCardData] = useState<CardData>({
      title: "",
      content: "",
      status: "",
      id: "",
   })
   const [alert, setAlert] = useState(false)

   const handleOpenAddCardModal = () => {
      setCardData({
         ...cardData,
         status: columnType,
      })
      setOpen(true)
   }

   const handleSetNewCard = async () => {
      if (!cardData.title || !cardData.content) {
         setAlert(true)
         setTimeout(() => {
            setAlert(false)
         }, 3000)
         return
      }
      try {
         const newCard = await addNewCard(cardData, currentBoard.id)
         addCard(newCard)
         setOpen(false)
      } catch (error) {
         console.error("Error adding card:", error)
      }
   }

   const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.target
      setCardData({
         ...cardData,
         [id]: value,
      })
   }

   const handleSelectChange = (event: SelectChangeEvent) => {
      setCardData({
         ...cardData,
         status: event.target.value,
      })
   }

   return (
      <>
         <Button variant="outlined" onClick={handleOpenAddCardModal}>
            <AddIcon fontSize="large" />
         </Button>
         <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            fullWidth={true}
            sx={{
               display: "flex",
               flexDirection: "column",
               justifyContent: "center",
            }}
         >
            <DialogTitle>ADD NEW CARD</DialogTitle>
            <DialogContent
               sx={{
                  display: "flex",
                  flexDirection: "column",
               }}
            >
               <TextField
                  autoFocus
                  margin="dense"
                  id="title"
                  label="TITLE *"
                  type="text"
                  onChange={handleOnChange}
                  value={cardData.title}
                  size="small"
               />
               <TextField
                  id="content"
                  label="Task details"
                  multiline
                  rows={4}
                  placeholder="Enter task details here..."
                  variant="filled"
                  onChange={handleOnChange}
               />
               <Select
                  sx={{ mt: 2 }}
                  id="status"
                  defaultValue={columnType}
                  onChange={handleSelectChange}
               >
                  <MenuItem value="todoCards">TO DO</MenuItem>
                  <MenuItem value="progressCards">IN PROGRESS</MenuItem>
                  <MenuItem value="doneCards">DONE</MenuItem>
               </Select>
               <Button size="large" sx={{ mt: 1 }} onClick={handleSetNewCard}>
                  ADD A NEW CARD
               </Button>
            </DialogContent>
            {alert && (
               <Fade in={alert}>
                  <Alert severity="error">
                     Please, fill out card's title and content!
                  </Alert>
               </Fade>
            )}
         </Dialog>
      </>
   )
}
