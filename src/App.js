import React from "react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import Trivia from "./Trivia";
import "./App.css";

const config = {
  useSystemColorMode: false,
  initialColorMode: "dark",
};

const customTheme = extendTheme({ config });

function App() {
  return (
    <div className="App">
      <div className="Content">
        <ChakraProvider theme={customTheme}>
          <Trivia />
          <div className='wave'></div>
        </ChakraProvider>
      </div>
    </div>
  );
}

export default App;
