import { useState } from "react"
import {
   Card as CardMUI,
   CardContent,
   IconButton,
   Typography,
   Icon,
   Box,
   Grid,
   Paper,
   Divider,
   CardActionArea,
   TextField,
   SelectChangeEvent,
   Alert,
} from "@mui/material"

import { useBoard } from "../../contexts/BoardContext"
import ViewCardModal from "../ModalComponents/ViewCardModal"

import { CardData } from "../../types/contextTypes"
import ACTIONS from "../../types/actionTypes"
import { removeCard, updateCardStatus, updateCardTitle } from "../../api/api"

export default function Card({ content, status, title, id }: CardData) {
   const { changeCardStatus, dispatchCardsArray, currentBoard } = useBoard()

   const [titleEdit, setTitleEdit] = useState({ on: false, title: "" })
   const [card, setCard] = useState({
      title: title,
      content: content,
      status: status,
   })

   const [viewCard, setViewCard] = useState(false)
   const [startEditCard, setStartEditCard] = useState(false)
   const [titleError, setTitleError] = useState(false)

   const Card = (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
         }}
      >
         <CardContent sx={{ maxHeight: 120, backgroundColor: "whitesmoke" }}>
            {titleEdit.on ? (
               <div style={{ display: "flex" }}>
                  <TextField
                     variant="filled"
                     size="small"
                     autoFocus
                     onChange={handleChangeTitle}
                     value={titleEdit.title}
                     InputProps={{
                        disableUnderline: true,
                     }}
                     hiddenLabel
                     sx={{ outline: "1px solid lightblue" }}
                  />
                  <IconButton onClick={handleSubmitPreviewTitleEdit}>
                     <Icon baseClassName="fas" className="fa-circle-check" />
                  </IconButton>
                  <IconButton onClick={handleExitTitleEdit}>
                     <Icon baseClassName="fas" className="fa-circle-xmark" />
                  </IconButton>
               </div>
            ) : (
               <CardActionArea
                  onClick={
                     titleError ? () => {} : handleStartPreviewTitleEditing
                  }
               >
                  {titleError ? (
                     <Alert severity="error">Title cannot be blank!</Alert>
                  ) : (
                     <Typography sx={{ p: 1 }}>{title}</Typography>
                  )}
               </CardActionArea>
            )}

            <Divider sx={{ mb: 1, bgcolor: titleEdit.on ? "lightblue" : "" }} />

            <CardActionArea onClick={() => setViewCard(true)}>
               <Paper
                  variant="outlined"
                  square
                  sx={{
                     overflow: "hidden",
                     p: 1,
                     maxHeight: 35,
                     borderColor: "rgba(0,0,0,0.5)",
                  }}
               >
                  <Typography sx={{ fontSize: 14 }}>{content}</Typography>
               </Paper>
            </CardActionArea>

            <Box
               sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
               }}
            >
               <IconButton onClick={handleRemoveCard}>
                  <Icon baseClassName="fas" className="fa-trash-can" />
               </IconButton>
               <IconButton onClick={handleStartEditCard}>
                  <Icon baseClassName="fas" className="fa-pen-to-square" />
               </IconButton>
            </Box>
         </CardContent>
      </Box>
   )

   // START EDITING CARD FROM PEN TO SQUARE VIA CARD'S PREVIEW
   function handleStartEditCard() {
      setCard({
         title: title,
         content: content,
         status: status,
      })
      setViewCard(true)
      setStartEditCard(true)
   }

   // START CHANING CARD CONTENT VIA CARD MODAL
   function handleChangeContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setCard((oldValue) => {
         return {
            title: oldValue.title,
            content: event.target.value,
            status: oldValue.status,
         }
      })
   }

   // START CHANGING CARD TITLE VIA CARD MODAL
   function handleChangeContentTitle(
      event: React.ChangeEvent<HTMLTextAreaElement>
   ) {
      setCard((oldValue) => {
         return {
            title: event.target.value,
            content: oldValue.content,
            status: oldValue.status,
         }
      })
   }

   // CHANGE STATUS
   function handleChangeContentStatus(event: SelectChangeEvent) {
      const newStatus = event.target.value

      setCard((oldValue) => {
         return {
            ...oldValue,
            status: newStatus,
         }
      })

      async function handleSubmitNewStatus() {
         try {
            await updateCardStatus(id, newStatus)
            changeCardStatus(id, newStatus)
         } catch (error) {
            console.error("Error updating card status:", error)
         }
      }

      handleSubmitNewStatus()
   }

   // REMOVE CARD VIA CARD'S PREVIEW INTERFACE
   async function handleRemoveCard() {
      try {
         await removeCard(currentBoard.id, id)

         dispatchCardsArray({
            type: ACTIONS.REMOVE_CARD,
            payload: { cardId: id },
         })
      } catch (error) {
         console.error("Error removing card:", error)
      }
   }

   // EDIT TITLE VIA CARD'S PREVIEW INTERFACE
   function handleStartPreviewTitleEditing() {
      setTitleEdit(() => {
         return { title: title, on: true }
      })
   }

   // EXIT TITLE EDIT VIA CARD'S PREVIEW INTERFACE AND SAVE PREVIOUS TITLE
   function handleExitTitleEdit() {
      setTitleEdit((oldValue) => {
         return { ...oldValue, on: false }
      })
   }

   // START CHANGING TITLE VIA CARD'S PREVIEW INTERFACE
   function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setTitleEdit((oldValue) => {
         return { ...oldValue, title: event.target.value }
      })
   }

   // SUBMIT TITLE CHANGES VIA CARD'S PREVIEW INTERFACE TO DB
   async function handleSubmitPreviewTitleEdit() {
      try {
         if (titleEdit.title.length > 0) {
            const response = await updateCardTitle(id, titleEdit.title)

            if (response.ok) {
               const updatedCard = {
                  content: card.content,
                  status: card.status,
                  title: titleEdit.title,
                  id: id,
               }

               dispatchCardsArray({
                  type: ACTIONS.EDIT_CARD,
                  payload: { cardId: id, updatedCard },
               })

               setTitleEdit((oldValue) => ({ ...oldValue, on: false }))
            }
         } else {
            setTitleError(true)
            setTimeout(() => {
               setTitleError(false)
            }, 1000)
            setTitleEdit((oldValue) => ({ ...oldValue, on: false }))
         }
      } catch (error) {
         console.error("Error updating card title:", error)
      }
   }

   const Expand = (
      <ViewCardModal
         viewData={{ title: title, content: content, status: status }}
         editData={{ ...card }}
         cardId={id}
         viewCard={viewCard}
         setViewCard={setViewCard}
         handleStartEditCard={handleStartEditCard}
         setStartEditCard={setStartEditCard}
         startEditCard={startEditCard}
         changeContent={handleChangeContent}
         changeTitle={handleChangeContentTitle}
         changeStatus={handleChangeContentStatus}
      />
   )

   return (
      <Grid container direction="column">
         <CardMUI variant="outlined" square={true} sx={{ mt: 1 }}>
            {Card}
            {Expand}
         </CardMUI>
      </Grid>
   )
}
