//Using the face-api.js library to built a face recognition app that uses your webcam

//Accessing the video element of the page
const video = document.getElementById("video")

//Loading the faceapi models

Promise.all([
    //Allows it to work on small faces, speeds up the recognition model
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    //Recognises the key landmarks of your face
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    //Recognises the outline of the face
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    //Able to recognise face exspressions
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo())

function startVideo(){
    //Code to get the users webcam
    navigator.getUserMedia(
        //Video is the parameter that you are passing into this function
        { video: {} },
        //Stream runs if you are able to access video
        stream => video.srcObject = stream,
        //Otherwise the error function will run
        err => console.error(err))
}