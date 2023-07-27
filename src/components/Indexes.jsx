import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import propTypes from "prop-types";
import Keys from "./Keys.jsx";
import CreateIndex from "./CreateIndex.jsx";
import ServerInfo from "./ServerInfos.jsx";

dayjs.extend(relativeTime);

Indexes.propTypes = {
  server: propTypes.object.isRequired,
  setServer: propTypes.func.isRequired
};

export default function Indexes(props) {
  const { server, setServer } = props;
  const [indexesState, setIndexesState] = useState(new Date().getTime());
  const [indexes, setIndexes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState({});
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const cancelRef = React.useRef();
  const toast = useToast();

  const getKeys = async function () {
    return server
      .getKeys()
      .then(function (data) {
        return data.results.map((e) => {
          e.createdAtRelative = dayjs(e.createdAt).fromNow();
          e.expiresAtRelative = dayjs(e.expiresAt).fromNow();
          e.shortName = e.name.replace(e.indexes[0], "").trim();
          return e;
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getIndexes = async () => {
    const keysData = await getKeys();
    const keys = [];
    keysData.forEach((key) => {
      key.indexes.forEach((index) => {
        if (!keys[index]) {
          keys[index] = [];
        }
        keys[index].push(key);
      });
    });

    return await server.getStats().then(async (data) => {
      const tempIndex = [];
      Object.entries(data.indexes).map(async ([key, value]) => {
        value.uid = key;
        value.keys = keys[key] ? keys[key] : [];

        tempIndex.push(value);
      });

      return tempIndex;
    });
  };

  useEffect(() => {
    getIndexes().then((data) => {
      setIndexes(data);
    });
  }, [indexesState]);

  const viewKeys = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const deleteIndex = (index) => {
    setCurrentIndex(index);
    setIsOpenDelete(true);
  };

  return (
    //list of meilisearch keys
    <Box align={"left"} p={"4"}>


      <ServerInfo server={server} setServer={setServer} />

      <AlertDialog
        isOpen={isOpenDelete}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsOpenDelete(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete index <strong>{currentIndex.uid}</strong> ?
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
                    .deleteIndex(currentIndex.uid)
                    .then(() => {
                      setIsOpenDelete(false);
                      setIndexesState(new Date().getTime());
                      toast({
                        title: "Index deleted.",
                        description: `Index ${currentIndex.uid} has been deleted.`,
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

      <Box pt={25} align={"right"}>
        <CreateIndex
          server={server}
          indexes={indexes}
          setIndexesState={setIndexesState}
        />
      </Box>

      <Heading as="h2" size="3x1">
        Indexes
      </Heading>

      <TableContainer pt={25}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th w={200}>Name</Th>
              <Th w={10}>Count</Th>
              <Th></Th>
            </Tr>
          </Thead>

          <Tbody>
            {indexes.map((index) => (
              <Tr key={index.uid}>
                <Td>{index.uid}</Td>
                <Td isNumeric>{index.numberOfDocuments}</Td>
                <Td>
                  <Button
                    size="sm"
                    onClick={() => viewKeys(index)}
                    colorScheme={"teal"}
                  >
                    View keys
                  </Button>
                  <Button
                    size="sm"
                    ml={2}
                    colorScheme={"red"}
                    onClick={() => {
                      deleteIndex(index);
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Drawer
        size={"xl"}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading>
              Keys for <u>{currentIndex.uid}</u>
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <Keys
              index={currentIndex}
              indexes={indexes}
              setIndexesState={setIndexesState}
              server={server}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
