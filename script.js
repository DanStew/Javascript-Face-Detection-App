//Using the face-api.js library to built a face recognition app that uses your webcam

//Accessing the video element of the page
const video = document.getElementById("video")

//Loading the faceapi models
//Promise.all ensures that everything is loaded before continuing code
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

//Function used to start the webcam and display it onto the website
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

//Adding an event listener for when the video starts playing
video.addEventListener("play", () => {

    //Creating a canvas to display the markings onto the website and adding it to the website
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)

    //Collecting the display size of the video on the website, so you can add detections over it
    const displaySize = {width : video.width, height : video.height}

    //Matching canvas size to display size
    faceapi.matchDimensions(canvas,displaySize)

    //Function to make the code here run multiple times
    //Function needs to be async as faceapi is an asyncronis function (Spelt Wrong)
    // The async part means that the function has to wait for the await line in the function
    setInterval(async () => {
        //Parameters here are what video you want to use, and what you are using to detect the faces
        //Including all of the different detection algorithms that you want to include
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()

        //Resizing the detections to be the correct display size of the video
        const resizedDetections = faceapi.resizeResults(detections,displaySize)

        //Clearing the old canvas
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)

        //Drawing the resized detections to the screen
        faceapi.draw.drawDetections(canvas,resizedDetections)

        //Drawing additional details and features
        //Both these lines of code can add additional elements to the face, can cause it to lag though
        faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas,resizedDetections)
    },300)
})