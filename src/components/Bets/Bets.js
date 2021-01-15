import React, { useState } from "react";
import {
  HStack,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  VStack,
} from "@chakra-ui/react";

import "./Bets.css";

export default function Bets() {
  const [betAmount, setBetAmount] = useState(0);
  const [displayBetAmount, setDisplayBetAmount] = useState(0);
  return (
    <HStack>
      <Stack className="bets">
        <FormControl id="betsForm">
          <FormLabel>Enter the total number of bets </FormLabel>
          <Input onChange={(e) => setBetAmount(e.target.value)} type="text" />
        </FormControl>
        <Button onClick={() => setDisplayBetAmount(betAmount)}>Submit</Button>
      </Stack>
      <div>{displayBetAmount}</div>
    </HStack>
  );
}
