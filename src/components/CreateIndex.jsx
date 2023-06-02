import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Field, Form, Formik } from "formik";

import * as PropTypes from "prop-types";

CreateIndex.propTypes = {
  server: PropTypes.object.isRequired,
  indexes: PropTypes.array.isRequired,
  setIndexesState: PropTypes.func.isRequired,
};

export default function CreateIndex(props) {
  const { server, indexes, setIndexesState } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const validateName = async (value) => {
    let error;
    if (!value) {
      error = "Name is required";
    } else if (!/^[a-z0-9-_]+$/i.test(value)) {
      error =
        "Name must be alphanumeric, without spaces or special chars. Hyphens and underscores are allowed.";
    }

    if (
      indexes.find((index) => {
        return index.uid === value;
      })
    ) {
      error = "Index already exists";
    }

    return error;
  };

  const createIndex = async (name) => {
    return await server
      .createIndex(name)
      .then((data) => {
        toast({
          title: "Index created.",
          description: `Index ${name} created successfully`,
          status: "success",
        });
        setIndexesState(new Date().getTime());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Button colorScheme="teal" variant="outline" onClick={onOpen}>
        Add new index
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{ name: "" }}
            onSubmit={(values, actions) => {
              createIndex(values.name).then(() => {
                onClose();
              });
            }}
          >
            {(props) => (
              <Form>
                <ModalHeader>Create a new index</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel>Index name</FormLabel>
                        <Input placeholder="Index name" {...field} />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme="teal" mr={3} type={"submit"}>
                    Create
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}
