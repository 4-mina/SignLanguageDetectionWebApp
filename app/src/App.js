// Importing dependencies + our utility function
import React, { useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
import { draw } from "./drawing";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);


  const runCoco = async () => {
    // Load our model from IBM Cloud
    const ntw= await tf.loadGraphModel('https://mrmodel.s3.eu-de.cloud-object-storage.appdomain.cloud/model.json')
    //  detection interval
    setInterval(() => {
      detect(ntw);
    }, 10); //Might depend on the device: change this in case detection is not smooth
  };

  const detect = async (ntw) => {
    //check you actually have data, don't make the same mistake as in jupyter notebook!
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      //get video properties to set its width and height
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // set the canvas height and width to that of vid
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const img= tf.browser.fromPixels(video)
      const imgResized= tf.image.resizeBilinear(img, [640,480])
      const imgCasted = imgResized.cast('int32')
      const imgExpanded = imgCasted.expandDims(0)
      const object = await ntw.executeAsync(imgExpanded)
      // we need to check which position boxes, scores and classes
      //These position can change!
      //console.log( await object[2].array())

      const boxes = await object[2].array()//done=2
      const classes = await object[4].array()//done=4
      const scores = await object[0].array()// done=0 bteween 0 and 7 which contains values between 0,1
      
      const ctx = canvasRef.current.getContext("2d");
      //We only display a detection if it's above the threshold!
      requestAnimationFrame(()=>{draw(boxes[0], classes[0],scores[0], 0.8, videoWidth,videoHeight,ctx)})
      //YOU BETTER MANAGE YOUR MEMORY AND CLEAR YOUR OBJECTS!!!!
      tf.dispose(img)
      tf.dispose(imgResized)
      tf.dispose(imgCasted)
      tf.dispose(imgExpanded)
      tf.dispose(object)
    }
  };

  useEffect(()=>{runCoco(
    
  )},[]);

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

export default App;
