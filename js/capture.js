// source code from https://github.com/mdn/samples-server/tree/master/s/webrtc-capturestill
// https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/gum/js/main.js

(function() {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.createElement('canvas') || document.getElementById('canvasDL');
      photo = document.getElementById('photoDL');
      startbutton = document.getElementById('startbutton');
  
      // navigator.getMedia = ( navigator.getUserMedia ||
      //                        navigator.webkitGetUserMedia ||
      //                        navigator.mozGetUserMedia ||
      //                        navigator.msGetUserMedia);
  
      
      function handleSuccess(stream) {
        // if (navigator.mozGetUserMedia) {
        //   video.mozSrcObject = stream;
        // } else {
        //   var vendorURL = window.URL || window.webkitURL;
        //   video.src = vendorURL.createObjectURL(stream);
        // }
        // video.play();

        var videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', constraints);
        console.log('Using video device: ' + videoTracks[0].label);
        stream.oninactive = function() {
          console.log('Stream inactive');
        };
        window.stream = stream; // make variable available to browser console
        video.srcObject = stream;
      }

      function handleError(msg, error) {
        console.log('Error: ', msg, error)
      }

      var constrains = window.constraints = { audio: false, video: { facingMode: "environment" }};
      // var constraints = window.constraints = {
      //   audio: false,
      //   video: true
      // };

      navigator.mediaDevices.getUserMedia(constraints).
        then(handleSuccess).catch(handleError);
  
      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (4/3);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', function(ev){
        takepicture();
        ev.preventDefault();
      }, false);
      
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takepicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
      
        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
        doScan($('#photoDL')[0])
      } else {
        clearphoto();
      }
    }
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
  })();