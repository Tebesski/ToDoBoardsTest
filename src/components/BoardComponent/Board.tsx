import React, { useEffect } from "react"
import { AppBar, Divider, Grid, List, Paper, Typography } from "@mui/material"
import { Blocks } from "react-loader-spinner"

import Card from "../CardComponent/Card"
import { useBoard } from "../../contexts/BoardContext"

import AddCardModal from "../ModalComponents/AddCardModal"

type ColumnProps = {
   name: string
   id: "todoCards" | "progressCards" | "doneCards"
   key: string

   children: React.ReactNode
}

export default function Board() {
   const {
      progressArray,
      todoArray,
      doneArray,
      isLoading,
      currentBoard,
      boardsList,
   } = useBoard()

   useEffect(() => {
      if (currentBoard.id.length > 0) {
      }
   }, [currentBoard])

   //   const isCardInBoard = (cardId, boardId) => {
   //      const board = boardsList.find((board) => board.id === boardId)

   //      return board && board.data.cards.includes(cardId)
   //   }

   const Column = function (props: ColumnProps) {
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
                  justifyContent: `${isLoading ? "center" : "space-between"}`,
                  alignItems: `${isLoading ? "center" : ""}`,
               }}
            >
               <List sx={{ overflowY: "auto", overflowX: "hidden" }}>
                  {isLoading ? null : (
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

                  {isLoading ? null : <Divider sx={{ mb: 1 }} />}
                  {children}
               </List>

               <AddCardModal columnType={id} />
            </Paper>
         </Grid>
      )
   }

   return (
      <Grid sx={{ flexGrow: 1 }} container spacing={3} direction="column">
         <Grid item alignSelf="center">
            <Typography
               variant="h5"
               sx={{
                  color: "whitesmoke",
                  textShadow: "0px 1px 4px #23430C",
               }}
            >
               YOU ARE USING A '{currentBoard.data.boardName}' BOARD
            </Typography>
         </Grid>

         {/* TO DO */}
         <Grid item container spacing={6}>
            <Column name="TO DO" id="todoCards" key="toDoCol">
               {isLoading ? (
                  <Blocks
                     height="80"
                     width="80"
                     color="#4fa94d"
                     ariaLabel="blocks-loading"
                     wrapperClass="blocks-wrapper"
                     visible={true}
                  />
               ) : (
                  todoArray.map((card) => {
                     const isInBoard = boardsList
                        .find((board) => board.id === currentBoard.id)
                        ?.data.cards.includes(card.id)

                     if (isInBoard) {
                        return (
                           <Card data={card.data} id={card.id} key={card.id} />
                        )
                     }
                  })
               )}
            </Column>

            {/* IN PROGRESS */}
            <Column name="IN PROGRESS" id="progressCards" key="progressCol">
               {isLoading ? (
                  <Blocks
                     height="80"
                     width="80"
                     color="#4fa94d"
                     ariaLabel="blocks-loading"
                     wrapperClass="blocks-wrapper"
                     visible={true}
                  />
               ) : (
                  progressArray.map((card) => {
                     const isInBoard = boardsList
                        .find((board) => board.id === currentBoard.id)
                        ?.data.cards.includes(card.id)

                     if (isInBoard) {
                        return (
                           <Card data={card.data} id={card.id} key={card.id} />
                        )
                     }
                  })
               )}
            </Column>

            {/* DONE */}
            <Column name="DONE" id="doneCards" key="doneCol">
               {isLoading ? (
                  <Blocks
                     height="80"
                     width="80"
                     color="#4fa94d"
                     ariaLabel="blocks-loading"
                     wrapperClass="blocks-wrapper"
                     visible={true}
                  />
               ) : (
                  doneArray.map((card) => {
                     const isInBoard = boardsList
                        .find((board) => board.id === currentBoard.id)
                        ?.data.cards.includes(card.id)

                     if (isInBoard) {
                        return (
                           <Card data={card.data} id={card.id} key={card.id} />
                        )
                     }
                  })
               )}
            </Column>
         </Grid>
      </Grid>
   )
}
