import {
  Badge,
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";

import propTypes from "prop-types";
import CreateKeys from "./CreateKeys.jsx";

Keys.propTypes = {
  index: propTypes.object.isRequired,
  server: propTypes.object.isRequired,
  setIndexesState: propTypes.func.isRequired,
};

export default function Keys(props) {
  const { index, setIndexesState, server } = props;
  const toast = useToast();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      isClosable: true,
    });
  };

  return (
    <>
      <Box mb={4}>
        <CreateKeys
          index={index}
          setIndexesState={setIndexesState}
          server={server}
        />
      </Box>
      <Stack>
        {index.keys.length > 0 &&
          index.keys.map((key) => (
            <Card key={key.uid} variant={"outline"}>
              <CardBody
                onClick={() => {
                  copyToClipboard(key.key);
                }}
              >
                <Heading size={"md"}>
                  {key.name}
                  <Badge ml={2} colorScheme="green">
                    created {key.createdAtRelative}
                  </Badge>
                  <Badge ml={2} colorScheme="orange">
                    expires {key.expiresAtRelative}
                  </Badge>
                </Heading>
                <Tooltip
                  label="Click to copy"
                  aria-label="Click to copy"
                  hasArrow
                >
                  <Box>
                    <Text>{key.key}</Text>
                  </Box>
                </Tooltip>
              </CardBody>
            </Card>
          ))}
      </Stack>
    </>
  );
}
