import {
  Center,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignInButton from "./LoginWithEmailPassword";
import GoogleButton from "./SignInWithGoogle";
import SignUp from "./SignupWithEmailPassword";

const AuthorizationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const callback = (token) => {
    setToken(token);
    navigate("/home");
  };

  return (
    <Center p={4}>
      <VStack spacing={8}>
        <Heading>Authorization Form</Heading>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <VStack>
          <HStack>
            <SignInButton
              email={email}
              password={password}
              callback={callback}
            />
            <SignUp email={email} password={password} callback={callback} />
          </HStack>
          <HStack>
            <GoogleButton callback={callback} />
          </HStack>
        </VStack>
      </VStack>
    </Center>
  );
};

export default AuthorizationForm;
