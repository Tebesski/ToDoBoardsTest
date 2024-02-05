import { Typography } from "@mui/material"

export default function NoBoardsPage() {
   return (
      <div
         style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
         }}
      >
         <Typography variant="h6">
            CURRENTLY, YOU HAVE NO BOARDS CREATED
         </Typography>
         <p></p>
         <Typography variant="h6">
            PLEASE, GENTLY PRESS ON THIS BIG BEAUTIFUL{" "}
            <b>MANAGE BOARDS BUTTON</b> ABOVE ;)
         </Typography>
      </div>
   )
}
