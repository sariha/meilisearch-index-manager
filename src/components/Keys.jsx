import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";

import propTypes from "prop-types";
import CreateKeys from "./CreateKeys.jsx";
import React, { useEffect, useState } from "react";
import { DeleteIcon } from "@chakra-ui/icons";

Keys.propTypes = {
  index: propTypes.object.isRequired,
  server: propTypes.object.isRequired,
  setIndexesState: propTypes.func.isRequired,
  indexes: propTypes.array.isRequired,
};

export default function Keys(props) {
  const { index, setIndexesState, server, indexes } = props;
  const [keys, setKeys] = useState([]);
  const [currentKey, setCurrentKey] = useState({});
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const toast = useToast();
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      status: "success",
      isClosable: true,
    });
  };

  const handleDeleteKey = (key) => {
    setIsOpenDelete(true);
    setCurrentKey(key);
  };

  useEffect(() => {
    const foundIndex = indexes.find((i) => i.uid === index.uid).keys;
    setKeys(foundIndex);
  }, [indexes]);

  return (
    <>
      <Box mb={4}>
        <CreateKeys
          index={index}
          setIndexesState={setIndexesState}
          indexes={indexes}
          server={server}
        />
      </Box>
      <Stack>
        {keys.length > 0 &&
          keys.map((key) => (
            <Card key={key.uid} variant={"outline"}>
              <CardBody>
                <Heading size={"md"}>
                  {key.name}
                  <Badge ml={2} colorScheme="green">
                    created {key.createdAtRelative}
                  </Badge>
                  <Badge ml={2} colorScheme="orange">
                    expires {key.expiresAtRelative}
                  </Badge>
                </Heading>
                <Flex minWidth={"max-content"} gap={"2"} alignItems="center">
                  <Box>
                    <Tooltip
                      label="UID: click to copy"
                      aria-label="UID: Click to copy"
                      hasArrow
                    >
                      <Box
                        onClick={() => {
                          copyToClipboard(key.uid);
                        }}
                      >
                        <Text>UID: {key.uid}</Text>
                      </Box>
                    </Tooltip>
                    <Tooltip
                      label="API key : Click to copy"
                      aria-label="API key : Click to copy"
                      hasArrow
                    >
                      <Box
                        onClick={() => {
                          copyToClipboard(key.key);
                        }}
                      >
                        <Text>API key: {key.key}</Text>
                      </Box>
                    </Tooltip>
                  </Box>
                  <Spacer />
                  <ButtonGroup>
                    <Button
                      size={"sm"}
                      colorScheme="red"
                      onClick={() => {
                        handleDeleteKey(key);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </ButtonGroup>
                </Flex>
              </CardBody>
            </Card>
          ))}
      </Stack>

      <AlertDialog isOpen={isOpenDelete} onClose={() => setIsOpenDelete(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Key <strong>{currentKey.name}</strong> ?
            </AlertDialogHeader>

            <AlertDialogBody>
              {`Are you sure? You can't undo this action afterwards.`}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={() => setIsOpenDelete(false)}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  server
                    .deleteKey(currentKey.uid)
                    .then(() => {
                      setIsOpenDelete(false);
                      setIndexesState(new Date().getTime());
                      toast({
                        title: "Key deleted.",
                        description: `Key ${currentKey.name} has been deleted.`,
                        status: "success",
                      });
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                }}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
