import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MovieOverview from "./pages/MovieOverview";


const App = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/movie/:id" element={<MovieOverview />} />
         </Routes>
      </BrowserRouter>
   );
};

export default App;
