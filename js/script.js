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


  $('#debug3').html("JS LOADED - 0.96");

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

  $('#switch-button').html('SWITCH - WITH GUITAR');
  $('#switch-button').on('click', function() {
    if (playWithGuitar === true) {
      playWithGuitar = false;
      // snd1.volume = 0;
      // snd2.volume = 0.9;
      hcAudio.volume = 0;
      hcAudio2.volume = 0.9;
      $('#switch-button').html('SWITCH - NO GUITAR');
    } else {
      playWithGuitar = true;
      // snd1.volume = 1;
      // snd2.volume = 0;
      hcAudio.volume = 1;
      hcAudio2.volume = 0;
      $('#switch-button').html('SWITCH - WITH GUITAR');
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


  $('#button-3').on('click', function(){
    console.log("BUTTON 3");
    $('#debug3').html("HC AUDIO PLAY");
    hcAudio.trigger('play');
    if( hcAudio.paused == true ){
      hcAudio.play();
      hcAudio2.play();
    }
    else{
      hcAudio.pause();
      hcAudio2.pause();
    }
    //$('#hc-audio').trigger('play');
  });

  // $('#button-4').on('click' , function(){
  //   //yokai.mp3
  //   hcAudio.pause();
  //   hcAudio2.pause();
  //   sauce1.src = './src/audio/yokai.mp3'

  //   hcAudio.load();
  //   hcAudio2.load();





  // })



  var audio = new Audio();
  var currentPlaylistIndex = 0;
  var seeking = false; // Determine if user is pressing the player seeking bar
  
  audio.src = './src/audio/yokai.mp3'; //'audio/' + playlist[currentPlaylistIndex] + extension;
  audio.controls = true;
  audio.loop = false;
  audio.autoplay = false;
  audio.volume = 0.8;
  audio.load();
  audio.addEventListener('loadedmetadata', function() {
    console.log("AUDIO LOADMETADATA");
      // $('#midi-end-time').text(secondToString(audio.duration));
      // $('#seek-slider').val('0').change();
  });

  $('#button-4').on('click' , function(){
    $('#debug3').html("Button 2 v2.0 PLAY");
    audio.play();
    console.log("BUTTON 2 Version 2.0 PLAY");
  });

});
