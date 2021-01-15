import React, { useState } from "react";
import {
  HStack,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
} from "@chakra-ui/react";

import "./Bets.css";

export default function Bets() {
  const [betAmount, setBetAmount] = useState(0);
  return (
    <Stack className="bets">
      <FormControl id="betsForm">
        <FormLabel>Enter the total number of bets </FormLabel>
        <Input type="text" />
      </FormControl>
      <Button>Submit</Button>
    </Stack>
  );
}
