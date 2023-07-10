import { useEffect, useState } from "react";

export default function ServerInfo(props) {
  const { server } = props;
  const [version, setVersion] = useState({});

  useEffect(() => {
    server.getVersion().then((version) => {
      setVersion(version);
    });
  }, []);

  return (
    <>
      <div>Meilisearch V {version.pkgVersion}</div>
      <div>Host: {server.config.host}</div>
    </>
  );
}
