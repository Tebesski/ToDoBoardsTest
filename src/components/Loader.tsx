import { Blocks } from "react-loader-spinner"

export default function Loader() {
   return (
      <div
         style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
         }}
      >
         <Blocks
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            visible={true}
         />
      </div>
   )
}
