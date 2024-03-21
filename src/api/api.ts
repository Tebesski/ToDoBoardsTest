import { CardData } from "../types/contextTypes"

export async function updateCardStatus(id: string, newStatus: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/cards/${id}/status`,
      {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ status: newStatus }),
      }
   )

   if (!response.ok) {
      throw new Error(`Error updating card status: ${response.statusText}`)
   }

   return response.json()
}

export async function removeCard(boardId: string, cardId: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/boards/${boardId}/cards/${cardId}`,
      {
         method: "DELETE",
      }
   )

   if (!response.ok) {
      throw new Error(`Error removing card: ${response.statusText}`)
   }

   return response.json()
}

export async function addNewCard(cardData: CardData, boardId: string) {
   const response = await fetch(`${process.env.API_URL}/api/cards`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         ...cardData,
         board_id: boardId,
      }),
   })

   if (!response.ok) {
      throw new Error(`Failed to add card: ${response.statusText}`)
   }

   return response.json()
}

export async function fetchCardsCountByBoard(boardId: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/boards/${boardId}/cards-count`
   )

   if (!response.ok) {
      throw new Error(`Failed to fetch cards count: ${response.statusText}`)
   }

   const data = await response.json()
   return data.cards_count
}

export async function removeBoard(boardId: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/boards/${boardId}`,
      {
         method: "DELETE",
      }
   )

   if (!response.ok) {
      throw new Error(`Failed to delete board: ${response.statusText}`)
   }

   return response.json()
}

export async function updateBoardTitle(boardId: string, newTitle: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/boards/${boardId}`,
      {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ boardName: newTitle }),
      }
   )

   if (!response.ok) {
      throw new Error(`Failed to update board title: ${response.statusText}`)
   }

   return response.json()
}

export async function addNewBoard(boardName: string) {
   const response = await fetch(`${process.env.API_URL}/api/boards`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({ boardName }),
   })

   if (!response.ok) {
      throw new Error(`Failed to add new board: ${response.statusText}`)
   }

   return response.json()
}

export async function updateCardTitle(id: string, newTitle: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/cards/${id}/title`,
      {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ title: newTitle }),
      }
   )

   if (!response.ok) {
      throw new Error(`Failed to update card title: ${response.statusText}`)
   }

   return response
}

export async function updateCardContent(id: string, newContent: string) {
   const response = await fetch(
      `${process.env.API_URL}/api/cards/${id}/content`,
      {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ content: newContent }),
      }
   )

   if (!response.ok) {
      throw new Error(`Failed to update card content: ${response.statusText}`)
   }

   return response.json()
}

export async function fetchAllCards(boardId: string) {
   const result = await fetch(
      `${process.env.API_URL}/api/boards/${boardId}/cards`
   )
   const cards = await result.json()

   return cards
}

export async function fetchAllBoards() {
   const result = await fetch(`${process.env.API_URL}/api/boards`)
   const boards = await result.json()

   return boards
}
