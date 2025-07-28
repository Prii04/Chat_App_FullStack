// App.js
import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Homepage from "./Pages/HomePage"; 

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Homepage />
      </div>
    </ChakraProvider>
  );
}

export default App;


