import React from "react"
import { AppBar, Divider, Grid, List, Paper, Typography } from "@mui/material"
// import { Blocks } from "react-loader-spinner"

import Card from "../CardComponent/Card"
import { useBoard } from "../../contexts/BoardContext"

import AddCardModal from "../ModalComponents/AddCardModal"
import Loader from "../Loader"

// Update BoardDataType
export type BoardDataType = {
   board_name: string
   id: string
}

// Update CardData
export type CardData = {
   title: string
   content: string
   status: string
   id: string
}

// Adjust ColumnProps
type ColumnProps = {
   name: string
   id: "todoCards" | "progressCards" | "doneCards"
   children: React.ReactNode
}

export default function Board() {
   const {
      progressArray,
      todoArray,
      doneArray,
      boardsLoading,
      currentBoard,
      doneCardsLoading,
      progressCardsLoading,
      todoCardsLoading,
   } = useBoard()

   const Column: React.FC<ColumnProps> = function (props) {
      const { name, id, children } = props

      return (
         <Grid
            item
            xs={4}
            sx={{ overflowY: "hidden", overflowX: "hidden", pr: 1 }}
            id={id}
         >
            <Paper
               sx={{
                  height: "70vh",
                  width: 300,
                  p: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
               }}
            >
               <List sx={{ overflowY: "auto", overflowX: "hidden" }}>
                  {boardsLoading ? null : (
                     <AppBar
                        position="sticky"
                        sx={{
                           userSelect: "none",
                           fontSize: 18,
                           backgroundColor: "rgba(0,0,0,0.5)",
                           p: 1,
                        }}
                     >
                        {name}
                     </AppBar>
                  )}

                  {boardsLoading ? null : <Divider sx={{ mb: 1 }} />}
                  {children}
               </List>

               <AddCardModal columnType={id} />
            </Paper>
         </Grid>
      )
   }

   return (
      <Grid container spacing={3} direction="column">
         <Grid item alignSelf="center">
            <Typography
               variant="h5"
               sx={{
                  color: "whitesmoke",
                  textShadow: "0px 1px 4px #23430C",
               }}
            >
               {boardsLoading
                  ? null
                  : `YOU ARE USING A ${currentBoard.board_name}
               BOARD`}
            </Typography>
         </Grid>

         {/* TO DO */}
         <Grid item container spacing={6}>
            <Column name="TO DO" id="todoCards" key="todoCol">
               {todoCardsLoading ? (
                  <Loader />
               ) : (
                  todoArray.map((card) => (
                     <Card
                        content={card.content}
                        status={card.status}
                        title={card.title}
                        id={card.id}
                        key={card.id}
                     />
                  ))
               )}
            </Column>

            {/* IN PROGRESS */}
            <Column name="IN PROGRESS" id="progressCards" key="progressCol">
               {progressCardsLoading ? (
                  <Loader />
               ) : (
                  progressArray.map((card) => (
                     <Card
                        content={card.content}
                        status={card.status}
                        title={card.title}
                        id={card.id}
                        key={card.id}
                     />
                  ))
               )}
            </Column>

            {/* DONE */}
            <Column name="DONE" id="doneCards" key="doneCol">
               {doneCardsLoading ? (
                  <Loader />
               ) : (
                  doneArray.map((card) => (
                     <Card
                        content={card.content}
                        status={card.status}
                        title={card.title}
                        id={card.id}
                        key={card.id}
                     />
                  ))
               )}
            </Column>
         </Grid>
      </Grid>
   )
}
