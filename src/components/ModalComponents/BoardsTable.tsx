import * as React from "react"
import Box from "@mui/material/Box"
import Collapse from "@mui/material/Collapse"
import IconButton from "@mui/material/IconButton"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { BoardDataType, useBoard } from "../../contexts/BoardContext"
import { Button } from "@mui/material"
import { useRef, useState } from "react"
import EditBoardModal from "./EditBoardModal"

function Row(props: { row: BoardDataType; setViewBoardOpen: Function }) {
   const { row, setViewBoardOpen } = props
   const [open, setOpen] = useState(false)
   const [boardEdit, setBoardEdit] = useState(false)
   const nameRef = useRef<HTMLElement>()
   const { BASE_URL, boardsList } = useBoard()

   async function handleDeleteBoard() {
      if (nameRef) {
         const board = boardsList.find(
            (board) => board.id === nameRef.current?.dataset.boardid
         )

         await fetch(`${BASE_URL}/boardsList/${board!.id}`, {
            method: "DELETE",
         })

         setViewBoardOpen(false)
      }
   }

   return (
      <React.Fragment>
         <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell
               component="th"
               scope="row"
               align="left"
               ref={nameRef}
               data-boardid={row.id}
            >
               {row.data.boardName}
            </TableCell>
            <TableCell align="center">{row.data.cards.length}</TableCell>
            <TableCell align="center">
               <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(!open)}
               >
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
               </IconButton>
            </TableCell>
         </TableRow>
         <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
               <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                     <Table
                        size="small"
                        aria-label="purchases"
                        sx={{ borderColor: "black" }}
                     >
                        <TableHead>
                           <TableRow>
                              <TableCell
                                 sx={{ borderBottom: "none" }}
                                 align="center"
                              >
                                 <Button
                                    color="success"
                                    onClick={() => setBoardEdit(true)}
                                 >
                                    <b>Edit table</b>
                                 </Button>
                              </TableCell>
                              <TableCell
                                 sx={{ borderBottom: "none" }}
                                 align="center"
                              >
                                 <Button
                                    color="error"
                                    onClick={() => handleDeleteBoard()}
                                 >
                                    <b>Delete table</b>
                                 </Button>
                              </TableCell>
                           </TableRow>
                        </TableHead>
                     </Table>
                  </Box>
               </Collapse>
            </TableCell>
         </TableRow>

         <EditBoardModal
            boardEdit={boardEdit}
            setBoardEdit={setBoardEdit}
            currentId={nameRef.current?.dataset.boardid}
         />
      </React.Fragment>
   )
}

export default function BoardsTable(props: { setViewBoardOpen: Function }) {
   const { boardsList } = useBoard()
   const rows = boardsList

   return (
      <TableContainer component={Paper}>
         <Table aria-label="collapsible table">
            <TableHead>
               <TableRow>
                  <TableCell>Board name</TableCell>
                  <TableCell align="center">Cards quantity</TableCell>
                  <TableCell align="center">Manage board</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {rows.map((row) => (
                  <Row
                     key={row.id + `1`}
                     row={row}
                     setViewBoardOpen={props.setViewBoardOpen}
                  />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   )
}
