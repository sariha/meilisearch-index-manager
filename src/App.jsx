import { useEffect, useState } from "react";
import { Container } from "@chakra-ui/react";
import Login from "./components/login.jsx";
import Indexes from "./components/Indexes.jsx";
import "./App.css";

function App() {
  const [server, setServer] = useState(false);

  useEffect(() => {
    if (server) {
      server.getVersion().then((version) => {
        console.log(`MeiliSearch version: ${version.pkgVersion}`);
      });
    }
  }, [server]);

  return (
    <Container minH={"100vh"} width={"100%"} maxWidth={"100%"}>
      {!server && <Login setServer={setServer} />}
      {server && <Indexes server={server} setServer={setServer} />}
    </Container>
  );
}

export default App;
