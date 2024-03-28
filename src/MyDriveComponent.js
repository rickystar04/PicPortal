import { useGoogleApi } from "react-gapi";

export function MyDriveComponent() {
  const gapi = useGoogleApi({
    discoveryDocs: [
      "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
    ],
    scopes: ["https://www.googleapis.com/auth/drive.metadata.readonly"],
  });

  console.log(gapi);
  if (!gapi) {
    return <div>Some loading screen</div>;
  }

  // access the Drive API per gapi.client.drive
}
