$(document).ready(function() {
  var snd1 = new Audio();
  // var src1 = document.createElement('source');
  // src1.type = 'audio/mpeg';
  // src1.src = './src/audio/karanokokoro-g.mp3';
  // src1.preload = 'auto';



  // snd1.type = 'audio/mpeg';
  snd1.src = './src/audio/karanokokoro-g.mp3';
  // snd1.preload = 'auto';
  snd1.id = "audio1";
  snd1.controls = true;
  snd1.loop = false;
  snd1.autoplay = false;
  snd1.volume = 0.8;
  snd1.oncanplay = function() {
    canPlayLiao('src1');
  };

  //snd1.appendChild(src1);

  var snd2 = new Audio();
  // var src2 = document.createElement('source');
  // src2.type = 'audio/mpeg';
  // src2.src = './src/audio/karanokokoro-ng.mp3';
  // src2.preload = 'auto';


  //snd2.type = 'audio/mpeg';
  snd2.src = './src/audio/karanokokoro-ng.mp3';
  //snd2.preload = 'auto';
  snd2.id = "audio2";
  snd2.controls = true;
  snd2.loop = false;
  snd2.autoplay = false;
  snd2.volume = 0.8;
  snd2.oncanplay = function() {
    canPlayLiao('src2');
  };
  // snd2.appendChild(src2);

  var audio1Ready = false;
  var audio2Ready = false;
  var bothReady = false;

  snd1.volume = 1;
  snd2.volume = 0;

  var playWithGuitar = true;

  function canPlayLiao(src) {
    console.log(src);

    

    if (src === 'src1') {
      console.log('src1 ready');
      audio1Ready = true;
      bothReady = true;
    } else if (src === 'src2') {
      console.log('src2 ready');
      audio2Ready = true;
    }

    if (audio1Ready && audio2Ready) {
      console.log('BOTH READY');
      bothReady = true;
      $('#play-button').css('opacity', '1');
    } else {
      $('#play-button').css('opacity', '0.3');
    }

    $('#debug').html("src1 = " + audio1Ready + " | src2 = " + audio2Ready + " | both = " + bothReady);
  }


  $('#debug3').html("JS LOADED - 0.99");

  $('#play-button').click(function() {
    console.log(snd1);
    console.log("^snd1");

    console.log(snd2);
    console.log("^snd2");

    $('#debug2').html("PLAY PRESSED");

    if (true) {
      console.log('if both ready');
      if (hcAudio.duration > 0 && !hcAudio.paused) {
        $('#play-button').html('PLAY');
        // snd1.load();
        // snd2.load();
        hcAudio.load();
        hcAudio2.load();
        $('#debug2').html("PLAY PRESSED - PLAY");
      } else {
        $('#play-button').html('STOP');
        $('#debug2').html("PLAY PRESSED - STOP");
        // snd1.play();
        // snd2.play();
        // $('#audio1').trigger('play');
        // $('#audio2').trigger('play');
        hcAudio.play();
        hcAudio2.play();
      }
    }
  });

  $('#switch-button').html('FLIP THAT SHIT');
  $('#switch-button').on('click', function() {
    if (playWithGuitar === true) {
      playWithGuitar = false;
      // snd1.volume = 0;
      // snd2.volume = 0.9;
      hcAudio.volume = 0;
      hcAudio2.volume = 0.9;
      $('#switch-button').html('Flip - Audio1');
    } else {
      playWithGuitar = true;
      // snd1.volume = 1;
      // snd2.volume = 0;
      hcAudio.volume = 1;
      hcAudio2.volume = 0;
      $('#switch-button').html('Flip - Audio2');
    }
  });

  var hcAudio = document.getElementById('hc-audio');
  var hcAudio2 = document.getElementById('hc-audio2');

  var sauce1 = document.getElementById('src1');
  var sauce2 = document.getElementById('src2');

  hcAudio.load();
  hcAudio2.load();

  hcAudio.volume = 1;
  hcAudio2.volume = 0;


  // $('#button-3').on('click', function(){
  //   console.log("BUTTON 3");
  //   $('#debug3').html("HC AUDIO PLAY");
  //   if( hcAudio.paused == true ){
  //     hcAudio.play();
  //     hcAudio2.play();
  //   }
  //   else{
  //     hcAudio.pause();
  //     hcAudio2.pause();
  //   }
  //   //$('#hc-audio').trigger('play');
  // });

  $('#button-4').on('click' , function(){
    //yokai.mp3
    hcAudio.pause();
    hcAudio2.pause();
    sauce1.src = './src/audio/yokai.mp3'

    hcAudio.load();
    hcAudio2.load();
    $('#play-button').html('PLAY');
    $('#button-4').html('SAUCE CHANGED');

  })


  /* 
    AUDIO 2.0
  */


  var audio = new Audio();
  var audio2 = new Audio();

  audio.src = './src/audio/karanokokoro-g.mp3'; //'audio/' + playlist[currentPlaylistIndex] + extension;
  audio.controls = true;
  audio.loop = false;
  audio.autoplay = false;
  // audio.volume = 1;
  audio.load();
  audio.addEventListener('loadedmetadata', function() {
    console.log("AUDIO 1 LOADMETADATA");
    $('#debug4').html("Audio 1 LOADED");
  });

  audio2.src = './src/audio/karanokokoro-ng.mp3'; //'audio/' + playlist[currentPlaylistIndex] + extension;
  audio2.controls = true;
  audio2.loop = false;
  audio2.autoplay = false;
  // audio2.volume = 0;
  audio2.load();
  audio2.addEventListener('loadedmetadata', function() {
    console.log("AUDIO 2 LOADMETADATA");
    $('#debug5').html("Audio 2 LOADED");
  });

  $('#button-2a').on('click' , function(){
    
    $('#debug3').html("Button 2 v2.0 PLAY");


    if(audio.paused && audio2.paused){
      $('#button-2a').html("STOP");
      audio.play();
    } else{
      $('#button-2a').html("PLAY");
      audio.pause();
      audio2.pause();
    }

    //audio2.play();
    console.log("BUTTON 2 Version 2.0 PLAY");
  });

  $('#button-2b').on('click' , function(){
    
    console.log("BUTTON 2 Version 2.0 PLAY");

    console.log("FLIP: audio1 = " + audio.currentTime + " | audio2 = " + audio2.currentTime);

    if( audio2.paused ){//audio.volume > 0){
      $('#button-2b').html("FLIP - AUDIO 2");
      $('#debug3').html("AUDIO 2 PLAYING");
      // audio.volume = 0;
      // audio2.volume = 1;


      audio.pause();
      audio2.currentTime = audio.currentTime;
      audio2.play();

    }
    else{
      $('#debug3').html("AUDIO 1 PLAYING");
      $('#button-2b').html("FLIP - AUDIO 1");
      // audio.volume = 1;
      // audio2.volume = 0;
      audio2.pause();
      audio.currentTime = audio2.currentTime;
      audio.play();
    }
    console.log("AFTER FLIP: audio1 = " + audio.currentTime + " | audio2 = " + audio2.currentTime);
  });

});
