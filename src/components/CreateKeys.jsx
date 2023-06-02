import {
  Button,
  Checkbox,
  CheckboxGroup,
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
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Field, Form, Formik } from "formik";
import { SingleDatepicker } from "chakra-dayzed-datepicker";

import PropTypes from "prop-types";
import { useState } from "react";

CreateKeys.propTypes = {
  server: PropTypes.object.isRequired,
  index: PropTypes.object.isRequired,
  setIndexesState: PropTypes.func.isRequired,
};
export default function CreateKeys(props) {
  const { index, setIndexesState, server } = props;
  const aYearFromNow = new Date();
  aYearFromNow.setFullYear(aYearFromNow.getFullYear() + 1);
  const [date, setDate] = useState(aYearFromNow);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const addKey = async (name, description, index, type, expireAt) => {
    const actions =
      type === "search"
        ? ["search"]
        : [
            "search",
            "documents.add",
            "documents.get",
            "documents.delete",
            "settings.get",
            "settings.update",
            "stats.get",
            "version",
          ];
    try {
      return server
        .createKey({
          name: name,
          description: description,
          actions: actions,
          indexes: [index],
          expiresAt: expireAt,
        })
        .then((data) => {
          setIndexesState(Date.now());
          return data;
        })
        .catch((error) => {
          console.log(error.message);
          return error;
        });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Button colorScheme="green" onClick={onOpen}>
        Add new set of keys
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              expireAt: aYearFromNow,
              keyTypes: ["public", "private"],
            }}
            onSubmit={(values, actions) => {
              console.log(values, date);
              setIndexesState(new Date().getTime());
            }}
          >
            {(props) => (
              <Form>
                <ModalHeader>Create a new set of keys</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <Stack spacing={[2, 5]} direction={["column"]}>
                    <Field name={"expireAt"}>
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel>Expiration date</FormLabel>
                          <SingleDatepicker
                            date={date}
                            onDateChange={(date) => {
                              form.setFieldValue("expireAt", date);
                            }}
                          />
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field type={"checkbox"} name={"keyTypes"}>
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={form.errors.name && form.touched.name}
                        >
                          <FormLabel>Keys to create</FormLabel>
                          <CheckboxGroup
                            colorScheme="green"
                            defaultValue={["public", "private"]}
                            {...field}
                            onChange={(value) => {
                              form.setFieldValue("keyTypes", value);
                            }}
                          >
                            <Stack spacing={[2, 5]} direction={["column"]}>
                              <Checkbox value="public">Public</Checkbox>
                              <Checkbox value="private">Private</Checkbox>
                            </Stack>
                          </CheckboxGroup>
                          <FormErrorMessage>
                            {form.errors.name}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Stack>
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
