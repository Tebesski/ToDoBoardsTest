import NoBoardsPage from "./components/BoardComponent/NoBoardsPage"
import Board from "./components/BoardComponent/Board"
import Search from "./components/SearchComponent/Search"

import { Fade, Grid, IconButton, Tooltip } from "@mui/material"
import AssignmentIcon from "@mui/icons-material/Assignment"

import { useBoard } from "./contexts/BoardContext"
import { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router"
import ViewBoardsModal from "./components/ModalComponents/ViewBoardsModal"

function App() {
   const { isLoading, boardsList, currentBoard } = useBoard()
   const navigate = useNavigate()

   const [viewBoardOpen, setViewBoardOpen] = useState(false)

   useEffect(() => {
      if (boardsList.length > 0 && currentBoard.id.length > 0) {
         navigate(`/boards/${currentBoard.id}`)
      } else {
         navigate(`/boards`)
      }
   }, [boardsList.length, currentBoard.id.length])

   async function handleOpenViewBoardModal() {
      setViewBoardOpen(true)
   }

   // function renderRoutes() {}

   return (
      <Grid
         container
         direction="column"
         justifyContent="space-between"
         alignContent="center"
         sx={{ gap: 1 }}
      >
         <Grid item alignSelf="center" xs={6} sx={{ display: "flex" }}>
            <Search />

            {isLoading ? null : (
               <Tooltip
                  title="Manage your boards"
                  disableInteractive
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  placement="right"
               >
                  <IconButton
                     onClick={handleOpenViewBoardModal}
                     id="addBoardButton"
                     sx={{ ml: 1 }}
                  >
                     <AssignmentIcon fontSize="large" />
                  </IconButton>
               </Tooltip>
            )}
         </Grid>

         <Grid
            item
            xs={8}
            sx={{ backgroundColor: "lightgray", p: 2, borderRadius: 2 }}
         >
            <Routes>
               <Route path="boards">
                  <Route index={true} element={<NoBoardsPage />} />
                  <Route path=":boardId" element={<Board />} />
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
