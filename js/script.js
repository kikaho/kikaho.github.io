$(document).ready(function() {
  var snd1 = new Audio();
  var src1 = document.createElement('source');
  src1.type = 'audio/mpeg';
  src1.src = './src/audio/karanokokoro-g.mp3';
  src1.preload = 'auto';
  snd1.oncanplay = function() {
    canPlayLiao('src1');
  };

  snd1.appendChild(src1);

  var snd2 = new Audio();
  var src2 = document.createElement('source');
  src2.type = 'audio/mpeg';
  src2.src = './src/audio/karanokokoro-ng.mp3';
  src2.preload = 'auto';
  snd2.oncanplay = function() {
    canPlayLiao('src2');
  };
  snd2.appendChild(src2);

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


  $('#debug3').html("JS LOADED");

  $('#play-button').click(function() {
    //console.log(snd1);

    $('#debug2').html("PLAY PRESSED");

    if (bothReady) {
      console.log('if both ready');
      if (snd1.duration > 0 && !snd1.paused) {
        $('#play-button').html('PLAY');
        snd1.load();
        snd2.load();
        $('#debug2').html("PLAY PRESSED - PLAY");
      } else {
        $('#play-button').html('STOP');
        $('#debug2').html("PLAY PRESSED - STOP");
        snd1.play();
        snd2.play();
      }
    }
  });

  $('#switch-button').html('SWITCH - WITH GUITAR');
  $('#switch-button').on('click', function() {
    if (playWithGuitar === true) {
      playWithGuitar = false;
      snd1.volume = 0;
      snd2.volume = 0.9;
      $('#switch-button').html('SWITCH - NO GUITAR');
    } else {
      playWithGuitar = true;
      snd1.volume = 1;
      snd2.volume = 0;
      $('#switch-button').html('SWITCH - WITH GUITAR');
    }
  });
});
