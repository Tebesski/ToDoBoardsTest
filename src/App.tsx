import NoBoardsPage from "./components/BoardComponent/NoBoardsPage"
import Board from "./components/BoardComponent/Board"
import Search from "./components/SearchComponent/Search"

import { Fade, Grid, IconButton, Tooltip } from "@mui/material"
import AssignmentIcon from "@mui/icons-material/Assignment"

import { useBoard } from "./contexts/BoardContext"
import { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router"
import ViewBoardsModal from "./components/ModalComponents/ViewBoardsModal"
import Loader from "./components/Loader"

function App() {
   const { boardsLoading, boardsList, currentBoard } = useBoard()
   const navigate = useNavigate()

   const [viewBoardOpen, setViewBoardOpen] = useState(false)

   useEffect(() => {
      if (!boardsLoading) {
         if (boardsList.length > 0 && currentBoard.id) {
            navigate(`/boards/${currentBoard.id}`)
         } else if (boardsList.length === 0) {
            navigate(`/boards/0`)
         }
      }
   }, [boardsList, currentBoard.id, boardsLoading])

   return boardsLoading ? (
      <Loader />
   ) : (
      <Grid
         container
         direction="column"
         justifyContent="space-between"
         alignContent="center"
         sx={{ gap: 1 }}
      >
         <Grid item alignSelf="center" xs={6} sx={{ display: "flex" }}>
            <Search />

            {
               <Tooltip
                  title="Manage your boards"
                  disableInteractive
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 500 }}
                  placement="right"
               >
                  <IconButton
                     onClick={() => setViewBoardOpen(true)}
                     id="addBoardButton"
                     sx={{ ml: 1 }}
                  >
                     <AssignmentIcon fontSize="large" />
                  </IconButton>
               </Tooltip>
            }
         </Grid>

         <Grid
            item
            xs={8}
            sx={{ backgroundColor: "lightgray", p: 2, borderRadius: 2 }}
         >
            <Routes>
               <Route path="boards">
                  <Route path=":boardId" element={<Board />} />
                  <Route path="0" element={<NoBoardsPage />} />
               </Route>
            </Routes>

            <ViewBoardsModal
               viewBoardOpen={viewBoardOpen}
               setViewBoardOpen={setViewBoardOpen}
            />
         </Grid>
      </Grid>
   )
}

export default App
