import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

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
import { Button } from "@mui/material"

import { useBoard } from "../../contexts/BoardContext"
import EditBoardModal from "./EditBoardModal"
import { BoardDataType } from "../../types/contextTypes"
import { fetchCardsCountByBoard, removeBoard } from "../../api/api"

function Row(props: { row: BoardDataType }) {
   const { row } = props
   const navigate = useNavigate()

   const {
      boardsLoading,
      deleteBoard,
      boardsList,
      setCurrentBoard,
      currentBoard,
   } = useBoard()

   const [open, setOpen] = useState(false)
   const [boardEdit, setBoardEdit] = useState(false)
   const [cardsCount, setCardsCount] = useState<number>(0)

   const nameRef = useRef<HTMLElement>()

   // SET CARDS COUNT
   useEffect(() => {
      async function fetchData() {
         if (!boardsLoading) {
            const count = await fetchCardsCountByBoard(row.id)
            setCardsCount(count)
         }
      }
      fetchData()
   }, [row.id, boardsLoading])

   // DELETE BOARD
   async function handleDeleteBoard() {
      try {
         await removeBoard(row.id)

         const updatedBoardsList = boardsList.filter(
            (board) => board.id !== row.id
         )
         deleteBoard(updatedBoardsList.map((board) => board.id).join(","))

         const currentBoardIndex = boardsList.findIndex(
            (board) => board.id === currentBoard.id
         )
         let nextBoard = boardsList[currentBoardIndex + 1] // get next board

         // If next board doesn't exist, get the previous board
         if (!nextBoard) {
            nextBoard = boardsList[currentBoardIndex - 1]
         }

         if (nextBoard) {
            // If there's a next board, navigate to it
            setCurrentBoard(nextBoard)
            Cookies.set("IlyaSemikashevKanbanBoard_BoardId", nextBoard.id) // Update the cookie
            navigate(`/boards/${nextBoard.id}`)
         } else {
            // If there are no more boards, navigate to the root route
            setCurrentBoard({ id: "", board_name: "" })
            Cookies.remove("IlyaSemikashevKanbanBoard_BoardId") // Remove the cookie
            navigate("/0")
         }
      } catch (error) {
         console.error("Error deleting board:", error)
      }
   }

   return (
      <>
         <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell
               component="th"
               scope="row"
               align="left"
               ref={nameRef}
               data-boardid={row.id}
            >
               {row.board_name}
            </TableCell>
            <TableCell align="center">{cardsCount}</TableCell>
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
      </>
   )
}

export default function BoardsTable() {
   const { boardsList } = useBoard()

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
               {boardsList.map((row) => (
                  <Row key={row.id + `1`} row={row} />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   )
}
