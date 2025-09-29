import { useEffect, useState } from "react"

const Card = ({ title }) => {
   const [count, setCount] = useState(0)
   const [hasLiked, setHasLiked] = useState(false)

   useEffect(() => {
      console.log(`${title} has been liked: ${hasLiked}`)
   }, [hasLiked])

   useEffect(() => {
      console.log('CARD RENDERED')
   }, [])
   
   return (
      <div onClick={() => setCount(count + 1)}>
         <h2>{title} <br/> {count}</h2>

         <button onClick={() => setHasLiked(true)}>
            {hasLiked ? '❤️' : '🤍'}
         </button>
      </div>
   )
}

const App = () => {

   return (
      <div className="card">
         <Card title="Harry Potter" />
         <Card title="Dr. Who" />
         <Card title="The Originals" />        
      </div>
   )
}

export default App
