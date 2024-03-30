import React from "react";
import { ethers } from "ethers";
import lighthouse from "@lighthouse-web3/sdk";

function App() {
  const [fileURL, setFileURL] = React.useState(null);
  const [fileBlob, setFileBlob] = React.useState(null);
  const [blobUrl, setBlobUrl] = React.useState("");

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const createBlobUrl = () => {
    if (fileBlob instanceof Blob) {
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
    } else {
      console.error("Invalid blob object");
    }
  };

  console.log(lighthouse.applyAccessCondition);

  /* Decrypt file */
  const decrypt = async () => {
    // Fetch file encryption key
    const cid = "QmczuYxp7R73rBgkzrxrv4Jxwo23gsDqDvgdk4Q7dZUHBc"; //replace with your IPFS CID
    const { publicKey, signedMessage } = await encryptionSignature();
    /*
      fetchEncryptionKey(cid, publicKey, signedMessage)
        Parameters:
          CID: CID of the file to decrypt
          publicKey: public key of the user who has access to file or owner
          signedMessage: message signed by the owner of publicKey
    */
    const keyObject = await lighthouse.fetchEncryptionKey(
      cid,
      publicKey,
      signedMessage
    );

    // Decrypt file
    /*
      decryptFile(cid, key, mimeType)
        Parameters:
          CID: CID of the file to decrypt
          key: the key to decrypt the file
          mimeType: default null, mime type of file
    */

    const fileType = "application/pdf";
    const decrypted = await lighthouse.decryptFile(
      cid,
      keyObject.data.key,
      fileType
    );
    console.log(decrypted);
    setFileBlob(decrypted);
    createBlobUrl();
    /*
      Response: blob
    */

    //       const reader = new FileReader();

    // // Set up the FileReader onload event
    // reader.onload = function(event) {
    //   // Once the FileReader has loaded the Blob content
    //   const arrayBuffer = reader.result; // Get the content as an ArrayBuffer

    //   // Convert ArrayBuffer to Blob
    //   const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });

    //   // Create a URL for the Blob object
    //   const pdfUrl = URL.createObjectURL(pdfBlob);

    //   // Create a link element to download the PDF
    //   const link = document.createElement('a');
    //   link.href = pdfUrl;
    //   link.download = 'document.pdf'; // Set the file name
    //   link.click(); // Trigger the download
    // };

    // // Read the content of the Blob as ArrayBuffer
    // reader.readAsArrayBuffer(blob);
    //     // View File
    const url = URL.createObjectURL(decrypted);
    console.log(url);
    setFileURL(url);
  };

  return (
    <div className="App">
      <button onClick={() => decrypt()}>decrypt</button>
      {fileURL ? (
        <a href={fileURL} target="_blank">
          viewFile
        </a>
      ) : null}
      {fileURL && <iframe src={fileURL} width="100%" height="500px" />}
    </div>
  );
}

export default App;
