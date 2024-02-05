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
} from "@mui/material"
import { SelectChangeEvent } from "@mui/material"
import React from "react"
import { CardData } from "../CardComponent/Card"

type ViewCardModalType = CardData & {
   isExpanded: boolean
   openViewCard: React.MouseEventHandler
   closeViewCard: React.MouseEventHandler
   editCard: React.MouseEventHandler
   isBeingEdited: boolean
   exitEdit: React.MouseEventHandler
   submitChanges: React.MouseEventHandler
   changeContent: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
   changeTitle: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
   changeStatus: (event: SelectChangeEvent) => void
   content: {
      title: string
      content: string
      status: string
   }
}

export default function ViewCardModal(props: ViewCardModalType) {
   const {
      data,
      isExpanded,
      changeContent,
      changeTitle,
      changeStatus,
      closeViewCard,
      editCard,
      isBeingEdited,
      exitEdit,
      submitChanges,
      content,
   } = props

   return (
      <Dialog
         open={isExpanded}
         onClose={closeViewCard}
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
            <AppBar
               position={`${isBeingEdited ? "static" : "sticky"}`}
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
                  {isBeingEdited ? (
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
                           value={content.title}
                           onChange={changeTitle}
                        />
                        <div>
                           <Tooltip title="Apply all changes">
                              <IconButton
                                 color="inherit"
                                 sx={{ p: 1 }}
                                 onClick={submitChanges}
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
                                 onClick={exitEdit}
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
                        <Typography variant="h6">{data.title}</Typography>
                        <IconButton
                           size="small"
                           color="inherit"
                           edge="end"
                           sx={{ p: 1 }}
                           onClick={editCard}
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
               {isBeingEdited ? (
                  <TextField
                     multiline
                     sx={{ minWidth: 520 }}
                     value={content.content}
                     onChange={changeContent}
                  ></TextField>
               ) : (
                  <Typography variant="body1">{data.content}</Typography>
               )}
            </Paper>

            <Select
               sx={{ mt: 2 }}
               id="cardStatus"
               defaultValue={data.status}
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
