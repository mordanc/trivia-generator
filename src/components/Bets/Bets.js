import React, { useState } from "react";
import {
  HStack,
  Button,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

export const Bets = ({ updateBetAmount }) => {
  const [betAmount, setBetAmount] = useState(0);
  return (
    <HStack>
      {/* steppers have a weird overlap without this padding value */}
      <NumberInput
        value={betAmount}
        onChange={(value) => setBetAmount(value)}
        h="2.5rem"
      >
        <NumberInputField />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
      <Button onClick={() => updateBetAmount(Number(betAmount))}>
        Place Bets
      </Button>
    </HStack>
  );
};
