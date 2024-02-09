import React, { useState } from "react"
import {
   AppBar,
   Dialog,
   DialogContent,
   Icon,
   IconButton,
   MenuItem,
   Paper,
   Select,
   TextField,
   Toolbar,
   Tooltip,
   Typography,
   SelectChangeEvent,
   Alert,
   Fade,
} from "@mui/material"

import { useBoard } from "../../contexts/BoardContext"
import { updateCardContent, updateCardTitle } from "../../api/api"

type ViewCardModalType = {
   viewCard: boolean
   setViewCard: React.Dispatch<boolean>
   handleStartEditCard: React.MouseEventHandler
   startEditCard: boolean
   setStartEditCard: React.Dispatch<boolean>
   changeContent: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
   changeTitle: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
   changeStatus: (event: SelectChangeEvent) => void
   editData: {
      title: string
      content: string
      status: string
   }
   viewData: {
      title: string
      content: string
      status: string
   }
   cardId: string
}

export default function ViewCardModal(props: ViewCardModalType) {
   const {
      editData,
      viewData,
      cardId,
      viewCard,
      setViewCard,
      startEditCard,
      setStartEditCard,
      handleStartEditCard,
      changeContent,
      changeTitle,
      changeStatus,
   } = props

   const { editCard } = useBoard()
   const [alert, setAlert] = useState(false)

   function handleCloseViewCard() {
      setViewCard(false)
      setStartEditCard(false)
   }

   async function handleSubmitEditChanges() {
      if (editData.title.length < 1 || editData.content.length < 1) {
         setAlert(true)
         setTimeout(() => {
            setAlert(false)
         }, 3000)
         return
      }
      try {
         await updateCardTitle(cardId, editData.title)

         await updateCardContent(cardId, editData.content)

         const updatedCard = { ...editData, id: cardId }
         editCard(cardId, updatedCard)

         setStartEditCard(false)
      } catch (error) {
         console.error("Error updating card title:", error)
      }
   }

   return (
      <Dialog
         open={viewCard}
         onClose={handleCloseViewCard}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
         fullWidth={true}
         sx={{
            ".MuiPaper-root": {
               padding: 1,
            },
         }}
      >
         <DialogContent
            style={{
               height: "600px",
               display: "flex",
               flexDirection: "column",
            }}
         >
            {alert && (
               <Fade in={alert}>
                  <Alert severity="error">
                     Please, fill out card's title and content!
                  </Alert>
               </Fade>
            )}
            <AppBar
               position={`${startEditCard ? "static" : "sticky"}`}
               sx={{
                  userSelect: "none",
                  fontSize: 18,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  p: 1,
                  mb: 2,
               }}
            >
               <Toolbar
                  variant="dense"
                  sx={{ justifyContent: "space-between" }}
               >
                  {startEditCard ? (
                     <>
                        <TextField
                           variant="standard"
                           size="medium"
                           autoFocus
                           sx={{
                              "& .MuiInput-underline:before": {
                                 borderBottomColor: "#f8f8ff",
                              },
                              "& .MuiInput-underline:after": {
                                 borderBottomColor: "#f8f8ff",
                              },
                              input: { color: "#f8f8ff" },
                           }}
                           value={editData.title}
                           onChange={changeTitle}
                        />
                        <div>
                           <Tooltip title="Apply all changes">
                              <IconButton
                                 color="inherit"
                                 sx={{ p: 1 }}
                                 onClick={handleSubmitEditChanges}
                              >
                                 <Icon
                                    baseClassName="fas"
                                    className="fa-regular fa-circle-check"
                                    color="inherit"
                                 />
                              </IconButton>
                           </Tooltip>
                           <Tooltip title="Cancel all changes">
                              <IconButton
                                 color="inherit"
                                 sx={{ p: 1 }}
                                 onClick={() => setStartEditCard(false)}
                              >
                                 <Icon
                                    baseClassName="fas"
                                    className="fa-regular fa-circle-xmark"
                                 />
                              </IconButton>
                           </Tooltip>
                        </div>
                     </>
                  ) : (
                     <>
                        <Typography variant="h6">{viewData.title}</Typography>
                        <IconButton
                           size="small"
                           color="inherit"
                           edge="end"
                           sx={{ p: 1 }}
                           onClick={handleStartEditCard}
                        >
                           <Icon
                              baseClassName="fas"
                              className="fa-pen-to-square"
                           />
                        </IconButton>
                     </>
                  )}
               </Toolbar>
            </AppBar>

            <Paper>
               {startEditCard ? (
                  <TextField
                     multiline
                     sx={{ minWidth: 520 }}
                     value={editData.content}
                     onChange={changeContent}
                  ></TextField>
               ) : (
                  <Typography variant="body1">{viewData.content}</Typography>
               )}
            </Paper>

            <Select
               sx={{ mt: 2 }}
               id="cardStatus"
               defaultValue={viewData.status}
               onChange={changeStatus}
            >
               <MenuItem value="todoCards">TO DO</MenuItem>
               <MenuItem value="progressCards">IN PROGRESS</MenuItem>
               <MenuItem value="doneCards">DONE</MenuItem>
            </Select>
         </DialogContent>
      </Dialog>
   )
}
