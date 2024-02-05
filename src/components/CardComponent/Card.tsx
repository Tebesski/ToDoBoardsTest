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
} from "@mui/material"
import { SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react"
import { BoardDataType, useBoard } from "../../contexts/BoardContext"
import ViewCardModal from "../ModalComponents/ViewCardModal"

export type CardData = {
   data: {
      title: string
      content: string
      status: string
   }
   id: string
}

export default function Card({ data, id }: CardData) {
   const { BASE_URL, currentBoard } = useBoard()
   const [titleEdit, setTitleEdit] = useState({ on: false, title: "" })
   const [changeStatus, setChangeStatus] = useState(false)
   const [content, setContent] = useState({
      title: "",
      content: "",
      status: "",
   })

   const [viewCard, setViewCard] = useState(false)
   const [editCard, setEditCard] = useState(false)

   const card = (
      <Box
         sx={{
            display: "flex",
            flexDirection: "column",
         }}
         id={id}
      >
         <CardContent sx={{ maxHeight: 120, backgroundColor: "whitesmoke" }}>
            {titleEdit.on ? (
               <div style={{ display: "flex" }}>
                  <TextField
                     variant="standard"
                     size="small"
                     autoFocus
                     onChange={handleChangeTitle}
                     value={titleEdit.title}
                  />
                  <IconButton onClick={handleSubmitTitleEdit}>
                     <Icon baseClassName="fas" className="fa-circle-check" />
                  </IconButton>
                  <IconButton onClick={handleExitTitleEdit}>
                     <Icon baseClassName="fas" className="fa-circle-xmark" />
                  </IconButton>
               </div>
            ) : (
               <CardActionArea onClick={handleStartTitleEditing}>
                  <Typography sx={{ fontSize: 14, p: 1 }}>
                     {data.title}
                  </Typography>
               </CardActionArea>
            )}

            <Divider sx={{ mb: 1 }} />

            <CardActionArea onClick={handleExpandCard}>
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
                  <Typography sx={{ fontSize: 14 }}>{data.content}</Typography>
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

   function handleStartEditCard() {
      setContent({
         title: data.title,
         content: data.content,
         status: data.status,
      })
      setViewCard(true)
      setEditCard(true)
   }

   function handleExitEditCard() {
      setEditCard(false)
   }

   function handleChangeContent(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setContent((oldValue) => {
         return {
            title: oldValue.title,
            content: event.target.value,
            status: oldValue.status,
         }
      })
   }

   function handleChangeContentTitle(
      event: React.ChangeEvent<HTMLTextAreaElement>
   ) {
      setContent((oldValue) => {
         return {
            title: event.target.value,
            content: oldValue.content,
            status: oldValue.status,
         }
      })
   }

   function handleChangeContentStatus(event: SelectChangeEvent) {
      setContent((oldValue) => {
         return {
            title: oldValue.title,
            content: oldValue.content,
            status: event.target.value,
         }
      })

      async function handleSubmitNewStatus() {
         const response = await fetch(`${BASE_URL}/${data.status}/${id}`)
         const existingData = await response.json()

         const updatedData = await {
            ...existingData,
            data: {
               ...existingData.data,
               status: event.target.value,
            },
         }

         await fetch(`${BASE_URL}/${data.status}/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
         })

         setChangeStatus(true)
      }

      handleSubmitNewStatus()
   }

   async function handleSubmitEditChanges() {
      const response = await fetch(`${BASE_URL}/${data.status}/${id}`)
      const existingData = await response.json()

      const updatedData = {
         ...existingData,
         data: {
            ...existingData.data,
            title: content.title,
            content: content.content,
            status: content.status,
         },
      }

      await fetch(`${BASE_URL}/${data.status}/${id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedData),
      })

      setEditCard(false)
   }

   function handleOpenViewCard() {
      setViewCard(true)
   }

   function handleCloseViewCard() {
      setViewCard(false)
      setEditCard(false)
   }

   async function handleRemoveCard() {
      const boardJson = await fetch(`${BASE_URL}/boardsList/${currentBoard.id}`)
      const boardData: BoardDataType = await boardJson.json()

      const index = boardData.data.cards.findIndex((card) => card === id)

      const _cards = boardData.data.cards
         .slice(0, index)
         .concat(boardData.data.cards.slice(index + 1))

      const updatedCards: BoardDataType = {
         ...boardData,
         data: {
            ...boardData.data,
            cards: _cards,
         },
      }

      await fetch(`${BASE_URL}/${data.status}/${id}`, {
         method: "DELETE",
      })

      await fetch(`${BASE_URL}/boardsList/${currentBoard.id}`, {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(updatedCards),
      })
   }

   function handleStartTitleEditing() {
      setTitleEdit(() => {
         return { title: data.title, on: true }
      })
   }

   function handleExitTitleEdit() {
      setTitleEdit((oldValue) => {
         return { ...oldValue, on: false }
      })
   }

   function handleChangeTitle(event: React.ChangeEvent<HTMLTextAreaElement>) {
      setTitleEdit((oldValue) => {
         return { ...oldValue, title: event.target.value }
      })
   }

   function handleSubmitTitleEdit() {
      async function updateTitle() {
         const response = await fetch(`${BASE_URL}/${data.status}/${id}`)
         const existingData = await response.json()

         const updatedData = {
            ...existingData,
            data: {
               ...existingData.data,
               title: titleEdit.title,
            },
         }

         await fetch(`${BASE_URL}/${data.status}/${id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
         })

         setTitleEdit((oldValue) => {
            return { ...oldValue, on: false }
         })
      }

      if (titleEdit.title.length > 0) {
         updateTitle()
      }
   }

   function handleExpandCard() {
      setViewCard(true)
   }

   useEffect(() => {
      if (changeStatus) {
         async function handleSubmitNewStatus() {
            const response = await fetch(`${BASE_URL}/${data.status}/${id}`)
            const existingData = await response.json()
            console.log(existingData)

            fetch(`${BASE_URL}/${data.status}/${id}`, {
               method: "DELETE",
            })

            fetch(`${BASE_URL}/${content.status}`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(existingData),
            })
         }
         handleSubmitNewStatus()
         setChangeStatus(false)
      }
   }, [changeStatus])

   const expand = (
      <ViewCardModal
         data={data}
         id={id}
         isExpanded={viewCard}
         openViewCard={handleOpenViewCard}
         closeViewCard={handleCloseViewCard}
         editCard={handleStartEditCard}
         exitEdit={handleExitEditCard}
         isBeingEdited={editCard}
         submitChanges={handleSubmitEditChanges}
         changeContent={handleChangeContent}
         changeTitle={handleChangeContentTitle}
         changeStatus={handleChangeContentStatus}
         content={content}
      />
   )

   return (
      <Grid container direction="column">
         <CardMUI variant="outlined" square={true} sx={{ mt: 1 }}>
            {card}
            {expand}
         </CardMUI>
      </Grid>
   )
}
