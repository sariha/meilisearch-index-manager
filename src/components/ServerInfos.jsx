import { useEffect, useState } from "react";
import {Box, Button, Center, Flex, Heading, Spacer, useToast} from "@chakra-ui/react";

export default function ServerInfo(props) {
  const { server, setServer } = props;
  const [version, setVersion] = useState({});


  const toast = useToast();

  useEffect(() => {
    server.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  return (
    <Flex p={"4"}>
      <Box>
          <Heading>Meilisearch {version.pkgVersion}</Heading>
          <div>Host: {server.config.host}</div>
      </Box>
      <Spacer />
      <Box>
        <Button onClick={()=>{
            setServer(false);
            toast({
                    title: "Disconnected",
                    status: "success",
                }
            );
        }}>
          Disconnect
        </Button>
      </Box>

    </Flex>
  );
}
