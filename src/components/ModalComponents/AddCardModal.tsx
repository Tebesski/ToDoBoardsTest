import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

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
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useBoard } from "../../contexts/BoardContext"
import { CardData } from "../CardComponent/Card"
import { BoardDataType } from "../../contexts/BoardContext"
import { SelectChangeEvent } from "@mui/material"

export default function AddCardModal({ columnType }: { columnType: string }) {
   const { isLoading, setIsLoading, BASE_URL, currentBoard } = useBoard()
   const [alert, setAlert] = useState(false)

   const [open, setOpen] = useState(false)
   const [cardData, setCardData] = useState<CardData>({
      data: {
         title: "",
         content: "",
         status: "",
      },
      id: "",
   })
   const [newCard, setNewCard] = useState<CardData>(cardData)

   const handleOpenAddCardModal = () => setOpen(true)
   const handleCloseAddCardModal = () => setOpen(false)

   function handleSetNewCard() {
      if (cardData.data.title.length < 1 && cardData.data.status) {
         setAlert(true)

         setTimeout(() => {
            setAlert(false)
         }, 3000)
         return
      }
      setCardData({
         data: {
            ...cardData.data,
         },
         id: uuidv4(),
      })

      setOpen(false)
   }

   async function handleAddCardToDb(url: string) {
      setIsLoading(true)
      const cardJson = JSON.stringify(newCard)

      await fetch(`${BASE_URL}/${url}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: cardJson,
      })

      const oldBoardJson = await fetch(
         `${BASE_URL}/boardsList/${currentBoard.id}`
      )
      const oldBoard: BoardDataType = await oldBoardJson.json()

      const updatedBoard: BoardDataType = {
         ...oldBoard,
         data: {
            ...oldBoard.data,
            cards: [...oldBoard.data.cards, newCard.id],
         },
      }

      await fetch(`${BASE_URL}/boardsList/${currentBoard.id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedBoard),
      })

      setIsLoading(false)
   }

   useEffect(() => {
      if (cardData.id.length > 0) {
         setNewCard(cardData)
      }
   }, [cardData.id])

   useEffect(() => {
      if (newCard.id) {
         handleAddCardToDb(columnType)
         setNewCard({
            data: {
               title: "",
               content: "",
               status: "",
            },
            id: "",
         })
      }
   }, [newCard.id])

   function handleOnChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
      const value = event.target.value
      const fieldId = event.target.id

      switch (fieldId) {
         case "cardTitle":
            setCardData({
               data: {
                  ...cardData.data,
                  title: value,
               },
               id: "",
            })
            break
         case "cardContent":
            setCardData({
               data: {
                  ...cardData.data,
                  content: value,
               },
               id: "",
            })
            break

         default:
            break
      }
   }

   function handleSelectChange(event: SelectChangeEvent) {
      if (event.target.value === null) return
      setCardData({
         data: {
            ...cardData.data,
            status: event.target.value,
         },
         id: "",
      })
   }

   useEffect(() => {
      if (open) {
         setCardData({
            data: {
               ...cardData.data,
               status: columnType,
            },
            id: "",
         })
      }
   }, [open])

   return (
      <>
         {isLoading ? null : (
            <Button
               variant="outlined"
               onClick={handleOpenAddCardModal}
               id="creature_add_button"
            >
               <AddIcon fontSize="large" />
            </Button>
         )}
         <Dialog
            open={open}
            onClose={handleCloseAddCardModal}
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
                  id="cardTitle"
                  label="TITLE *"
                  type="text"
                  onChange={handleOnChange}
                  value={cardData.data.title}
                  size="small"
               />

               <TextField
                  id="cardContent"
                  label="Task details"
                  multiline
                  rows={4}
                  placeholder="Enter task details here..."
                  variant="filled"
                  onChange={handleOnChange}
               />

               <Select
                  sx={{ mt: 2 }}
                  id="cardStatus"
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

            {alert ? (
               <Fade in={alert}>
                  <Alert severity="error">Please, enter card's title</Alert>
               </Fade>
            ) : null}
         </Dialog>
      </>
   )
}
