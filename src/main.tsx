import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { BoardProvider } from "./contexts/BoardContext.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <BrowserRouter>
         <BoardProvider>
            <App />
         </BoardProvider>
      </BrowserRouter>
   </React.StrictMode>
)
