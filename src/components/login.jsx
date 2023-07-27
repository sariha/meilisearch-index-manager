import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { MeiliSearch } from "meilisearch";
import { useState } from "react";

export default function Login(props) {
  const toast = useToast();

  const { setServer } = props;

  const [credentials, setCredentials] = useState(
    localStorage.getItem("credentials")
      ? JSON.parse(localStorage.getItem("credentials"))
      : { host: "", apiKey: "" }
  );

  const connect = async (credentials) => {
    try {
      const meilisearch = new MeiliSearch(credentials);

      meilisearch
        .getVersion()
        .then((version) => {
          toast({
            title: "Connected",
            status: "success",
            isClosable: true,
          });

          localStorage.setItem("credentials", JSON.stringify(credentials));
          setServer(meilisearch);
        })
        .catch((error) => {
          toast({
            title: "Server error",
            status: "error",
            isClosable: true,
            description: error.message,
          });
        });
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        isClosable: true,
        description: error.message,
      });
    }
  };

  const handleSubmit = () => {
    connect(credentials);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCredentials((values) => ({ ...values, [name]: value }));
  };

  return (
    <Flex align={"center"} justify={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Server Credentials</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            Enter the server credentials to continue. Credentials will be stored in browser only.
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="serverUrl">
              <FormLabel>Server Url</FormLabel>
              <Input
                type="url"
                name="host"
                onChange={handleChange}
                value={credentials.host}
              />
            </FormControl>
            <FormControl id="masterKey">
              <FormLabel>Master Key</FormLabel>
              <Input
                type="password"
                name="apiKey"
                onChange={handleChange}
                value={credentials.apiKey}
              />
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={handleSubmit}
              >
                Connect
              </Button>

              {credentials.host && credentials.apiKey && (
                  <Button onClick={()=>{
                        localStorage.removeItem("credentials");
                        setCredentials({ host: "", apiKey: "" });
                  }}>
                    Forget credentials
                  </Button>
              )}

            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}
