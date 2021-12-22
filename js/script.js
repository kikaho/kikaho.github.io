/* 
	YOOOOO WHY MUST YOU PEEK INTO MY GARBAGE CODE 👀

	This was modified from one of my college projects from years ago.
	There's bunch of unused code and weird decision making
	but ain't nobody got time to refactor everything so judge all you want lmfao
*/


/* To identify current page type and prevent typo */
var currentPageIndex = 0;

/* 
  We will have differnt way of playing/flipping the audio here:

  Tablet:
    - Only one audio will be play at a time. 
    - Flip audio by pausing current playing audio, sync both audio's time and play the other one
  Desktop: 
    - Both audio will be play at the same time.
    - Flip audio by altering both audio's volume (mute one and unmute the other one).

  The Why:
  Ideally I'd want to flip the audio by changing the volume since it produce a much smoother transition than pause/play.
  But due to iOS prevents website from altering audio volume, flipping by volume won't work. Thus the pause/play approach.
*/
var isTablet = false;

// 0 = Guitar / 1 = No-Guitar
var activeAudioTrack = 0;

// Fade in/out timing for switching tracks within the audio player
const playerInfoFadeInTime = 150;
const playerInfoFadeOutTime = 200;

// General animation timing
const fadeOutTime = 220;
const fadeInTime = 400;


/* Initialize some items, called on page load */
function init(){

	// Initialize the main slick which holds most of the site's content
	$(".slick").slick({
		infinite: true,
		speed: 0,
		fade: true,
		arrows: false,
		cssEase: 'ease-out',
		swipe: false
	});

	removeHoverEffectIfTouchEnabled();

	for(var i = 0; i < playlist.length; i++){
		$('#player-tracklist-desktop').append(
			`<button track-id="` + i + `" class="col-12 py-1 player-track-button-desktop text-left d-flex align-items-center">
			<img src="./images/track-logo-square/` + playlist[i] + `.png">
			<div class="desktop-playlist-title">` + trackTitle[i] + `<br/><p>` + trackArtist[i] + `</p></div>
			<span>` + trackDuration[i]  + `</span>
		</button>`
		);

		$('#player-tracklist-mobile').append(
			`<button track-id="` + i + `" class="col-12 py-1 player-track-button text-left d-flex align-items-center">
			<img src="./images/track-logo-square/` + playlist[i] + `.png">
			<div class="mobile-playlist-title">` + trackTitle[i] + `<br/><p>` + trackArtist[i] + `</p></div>
			<span>` + trackDuration[i]  + `</span>
		</button>`
		);
	}

	var currentYear = new Date();
	currentYear = currentYear.getFullYear();

  // Populate #about-experience with updated year value
	$('#about-experience').append(`
		Electric guitar - over ` + (currentYear - 2008) + ` years<br/>
		Music composing - over ` + (currentYear - 2010) + ` years<br/>
		Guitar solo arrangement - over ` + (currentYear - 2010) + ` years<br/>
		Guitar cover made - over 70
	`);

	// Initialize title and buttons
	$('#title').text("");
	$('#back-button').css( "opacity", "0" );
	$('#back-button').css( "display", "none" );

	preloadAudioTracks();
	reInitTrack(false);

	/*// Fade out initial white screen
	setTimeout(function(){
		$('#initial-screen').hide(1500);
	}, 300);*/

	// Change things according to screen size
	$(window).on('resize', _.debounce(function() {
		//console.log("Debouncing");
		$('#volume-slider').val(audio.volume * 100).change();
		$('#seek-slider').rangeslider('update', true);
	}, 100));


	/*
		======================================================================
			Page Navigation
		======================================================================
	*/

	// Button: BACK | X
	// $('#back-button-container').on("click",function(){
	$('#back-button').on("click",function(){
      	switchPage(0);
	});

	$('#back-button-midi').on("click",function(){
    	switchPage(0);
	});

	// Button: Bottom - PROGRAMMING
	$(".root-demo").on("click",function(){
		switchPage(1);
	});

	// Button: Bottom - RESUME
	$(".root-contact").on("click",function(){
		switchPage(2);
	});



	/*
		======================================================================
			MIDI Player
		======================================================================
	*/
	audio.addEventListener("timeupdate", function(){seekTimeUpdate();});
  	audio.addEventListener("ended", function(){switchTrack("next");})
  
  	audio2.addEventListener("timeupdate", function(){seekTimeUpdate();});
  	audio2.addEventListener("ended", function(){switchTrack("next");})

	playerButtonInit();
	playerSliderInit();


} // End init()

function removeHoverEffectIfTouchEnabled(){
	
	// Removes hover effect if touch is enabled
	var touch = 'ontouchstart' in document.documentElement
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0;

	if (touch) { // remove all :hover stylesheets
    try { // prevent exception on browsers not supporting DOM styleSheets properly
      for (var si in document.styleSheets) {
        var styleSheet = document.styleSheets[si];
        if (!styleSheet.rules) continue;

        for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
          if (!styleSheet.rules[ri].selectorText) continue;

          if (styleSheet.rules[ri].selectorText.match(':hover')) {
            styleSheet.deleteRule(ri);
          }
        }
      }
      // Disable volume control slider in midi player since sound volume can't be changed programmatically in mobile device 
      $('#volume-slider').prop("disabled", true);
      $('#midi-vol-down-icon').css('opacity', '0.5');
      $('#midi-vol-up-icon').css('opacity', '0.5');
    } catch (ex) {}
	}

}

function playerButtonInit(){
	
	/* Midi playlist's song button */
	$('.player-track-button').click(function(){
		var thisTarget = $(this).attr('track-id');
		currentPlaylistIndex = thisTarget;
		activeAudioTrack = 0;
		reInitTrack(true);
	});

	$('.player-track-button-desktop').click(function(){
		var thisTarget = $(this).attr('track-id');
		currentPlaylistIndex = thisTarget;
		activeAudioTrack = 0;
		reInitTrack(true);
	});

	
	/* MIDI Button: << PREV */
	$('#player-prev-button').click(function(){
		// Simulate behavior of music players such as iTune
		// Restart the track if audio.currentTime is greater than 2, else go to previous track
		// This enables replay of the current track, and go to previous via double tap (if audio.currentTime is greater than 2)
		if( (activeAudioTrack === 0 && audio.currentTime > 2) || (activeAudioTrack === 1 && audio2.currentTime > 2) ){
			audio.currentTime = 0;
			audio2.currentTime = 0;
		}
		else{
			//console.log("PREV TRACK");
			switchTrack("prev");
		}
	})

	/* MIDI Button: >> NEXT */
	$('#player-next-button').click(function(){
		//console.log("NEXT TRACK");
		switchTrack("next");
	});

	

	/* MIDI Button: > Play */
	$('#player-play-button').click(function(){
		audio.volume = 1;
		audio2.volume = 1;

		/* if(audio.volume == 0){
			audio.volume = 0.8;
			$('#volume-slider').val(audio.volume * 100).change();
		} */
		if(audio.paused && audio2.paused && audio.readyState === 4 && audio2.readyState === 4){
			/*
				audio.readyState will return a number
				0 - No information is available about the media resource.
				1 - Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
				2 - Data is available for the current playback position, but not enough to actually play more than one frame.
				3 - Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
				4 - Enough data is available—and the download rate is high enough—that the media can be played through to the end without interruption.
			*/
			if(isTablet){
				// Do the audio on and off method
				if(activeAudioTrack === 0){
					// G is playing
					audio.play();
					audio2.pause();
				} else {
					// N is playing
					audio.pause();
					audio2.play();
				}
			}
			else{
				// Do the audio fading method
				if(activeAudioTrack === 0){
					// G is playing
					audio.volume = 1;
					audio2.volume = 0;
					audio.play();
					audio2.play();
				} else{
					// N is playing
					audio.volume = 0;
					audio2.volume = 1;
					audio.play();
					audio2.play();
				}
			}
			$('#player-play-button').html('<i class="fa fa-pause" aria-hidden="true"></i>');
		}
		else{
			audio.pause();
			audio2.pause();
			$('#player-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
		}
	})
	
	$('.audio-flip-button').click(function(){
		if(isTablet){
			// IS TABLET
			if(activeAudioTrack === 0){
				// G is playing
				audio2.currentTime = audio.currentTime;
				audio2.play();
				setTimeout(function(){
					audio.pause();
				}, 100);
				
				activeAudioTrack = 1;

				// console.log("IS TABLET - IF");
				$('.audio-flip-button').animate({
					color: '#4C4C4C',
					border: '1px solid #4C4C4C'
				}, 500);
				$('.audio-flip-button').html('GUITAR OFF');



				///$('.slick').animate({opacity:'0'}, fadeOutTime, 'swing', function(){
			} else {
				// N is playing
				audio.currentTime = audio2.currentTime;
				audio.play();
				setTimeout(function(){
					audio2.pause();
				}, 100);
				activeAudioTrack = 0;

				// console.log("IS TABLET - ELSE");
				$('.audio-flip-button').animate({
					color: '#8fc31f',
					border: '1px solid #8fc31f'
				}, 500);
				$('.audio-flip-button').html('GUITAR ON');
			}
		} else {
			// NOT A TABLET
			if(activeAudioTrack === 0){
				// G is playing
				audio.volume = 0;
				audio2.volume = 1;
				activeAudioTrack = 1;

				// console.log("NOT TABLET - IF");
				$('.audio-flip-button').addClass('audio-flip-button-triggered');
				$('.audio-flip-button').html('GUITAR OFF');

				//:hover
			} else {
				// N is playing
				audio.volume = 1;
				audio2.volume = 0;
				activeAudioTrack = 0;

				// console.log("NOT TABLET - ELSE");
				$('.audio-flip-button').removeClass('audio-flip-button-triggered');
				$('.audio-flip-button').html('GUITAR ON');
			}
		}
	})
}

function playerSliderInit(){
	
	/* MIDI player seeker */
	$('#seek-slider').rangeslider({
		polyfill:false,
		onInit:function(){
			seeking = false;
		},
		onSlide:function(position, value){
			if(isNaN(audio.duration)){
				$('#player-current-time').text(secondToString('0'));
			}
			else{
        if(activeAudioTrack === 0){
          // G is playing
          $('#player-current-time').text(secondToString(audio.duration * (value/100)));
        } else {
          // N is playing
          $('#player-current-time').text(secondToString(audio2.duration * (value/100)));
        }
			}
			//console.log('onSlide SEEK - position: ' + position, 'value: ' + value);
		},
		onSlideEnd:function(position, value){
			//console.log('onSlideEnd SEEK - position: ' + position, 'value: ' + value);
			seeking = false;
      if(isTablet){
        // Is Tablet
        if(activeAudioTrack === 0){
        // G is playing
          audio.currentTime = audio.duration * (value/100);
        } else {
          // N is playing
          audio2.currentTime = audio2.duration * (value/100);
        }
      } else {
        // Desktop
        audio.currentTime = audio.duration * (value/100);
        audio2.currentTime = audio2.duration * (value/100);
      }
		}
	});

	// For other browser
	document.getElementById('seek-slider-container').addEventListener("mousedown", function(){
		seeking = true;
	})

	document.getElementById('seek-slider-container').addEventListener("mouseup", function(){
		if(seeking == true){
			seeking = false;
		}
	})

	// For chrome
	document.getElementById('seek-slider-container').addEventListener("pointerdown", function() {
		seeking = true;
	}, false)

	document.getElementById('seek-slider-container').addEventListener("pointerup", function() {
		if(seeking == true){seeking = false;}
	}, false)

	// Mobile
	document.getElementById('seek-slider-container').addEventListener("touchstart", function() {
		seeking = true;
	})

	document.getElementById('seek-slider-container').addEventListener("touchend", function() {
		if(seeking == true){seeking = false;}
	})
}

// This is a hack for telling whether or not an image loaded
// TODO (maybe): add a CSS backup background for when image fails to load.
// function bgImageOnLoadCallback(param){
// 	// console.log('bgImageOnLoadCallback()', { param, pageLoaded });
// 	pageLoaded = true;
// 	// Fade out initial white screen
// 	$('#initial-screen').animate({opacity:'0'}, 1500, 'swing', function(){
// 		$('#initial-screen').hide();
// 	});
// }

$(document).ready(function(){
	// "Loading" text appears if the background image took more than 1 sec to load
	$('#loading-text').animate({opacity: 1}, 1000);

	//init();
	$.when(init()).then(function() {
		init2(); // NOTE: this is from script2.js
		// Fade out initial white screen, if BG image somehow fails
		setTimeout(function(){
			if(!pageLoaded){
				console.log('BG IMAGE LOAD TIMEOUT', { pageLoaded });
				$('#loading-text').hide();
				$('#initial-screen').animate({opacity:'0'}, 1500, 'swing', function(){
					$('#initial-screen').hide();
				});
			}
		}, 8000);
	});

	// Load background video for landing page
	if(!isMobileDevice()){
		var video = document.getElementById('bg-video');
		var sourceMp4 = document.createElement('source');
		// sourceMp4.setAttribute('src', 'video/grass-3.mp4');
		// sourceMp4.setAttribute('src', 'video/10sec-720p-lqex.mp4');
		sourceMp4.setAttribute('type', 'video/mp4');
		sourceMp4.setAttribute('onerror', 'playerError()');

		video.appendChild(sourceMp4);
		//video.play();

		var playPromise = video.play();

		if (playPromise !== undefined) {
			playPromise.then(_ => {
		      // Automatic playback started!
		      // Show playing UI.
		  })
			.catch(error => {
		    	// Auto-play was prevented
		    	// Run alternative moving background
		    	//playerError();
		  });
		}

		// If somehow the video still can't be played
		if(video.paused === true){
			video.src = "";
			video.load();
			video.remove();
			//playerError();
		}
	}
	else{
		//backgroundAnimation();
	}

	/* ==================== KEEP FOR STUDY PURPOSE ==================== */
	/*	$('.slick').on('beforeChange', function(event, slick, currentSlide, nextSlide){
		console.log($(slick.$slides.get(currentSlide)).attr('page-type'));
		$('#title').text($(slick.$slides.get(nextSlide)).attr('top-title'));

	});*/
});



/*
	======================================================================
		PAGE NAVIGATION
	======================================================================
*/
function switchPage(targetPageIndex){
	
		if(currentPageIndex != targetPageIndex){
			// Stop current animation (eg. if the user switch pages rapidly and the previous animation is still going on)
			$('#title').stop();
			$('#back-button').stop();
			$('#back-button-midi').stop();
			$('.slick').stop();
	
      		$('#title').animate({opacity:'0'}, fadeOutTime);
      
			$('.slick').animate({opacity:'0'}, fadeOutTime, 'swing', function(){
	
				$('.slick').slick('slickGoTo', targetPageIndex, false);
	
				if(targetPageIndex === 1){
					$('#player-tracklist-container-scroller-mobile').nanoScroller();
					$('#player-tracklist-container-scroller-desktop').nanoScroller();
					$('#volume-slider').rangeslider('update', true);
					$('#seek-slider').rangeslider('update', true);
				} else if (targetPageIndex === 2){
					$('#midi-tracklist-container-scroller').nanoScroller();
					$('#volume-slider-midi').rangeslider('update', true);
					$('#seek-slider-midi').rangeslider('update', true);
				}
				$('.slick').animate({opacity:'1'}, fadeInTime, 'swing');
			});
	
			// Destroy nanoscroller plugin
			// Placed outside of animation because currentPageType and targetPageType will already be the same after animation delay
			if(targetPageIndex === 0){
				//console.log("Destroying nanoscroller");
				stopAudio();
	
				// Destroy after 300 miliseconds so that the user won't see it destroying before the slide faded out
				setTimeout(function(){
					$(".nano").nanoScroller({ destroy: true });
				}, 300);
	
			}
	
			if((currentPageIndex != 0) && (targetPageIndex == 0)){
				//Back to landing page
				changeTextColor(targetPageIndex);
			}
			else if((currentPageIndex == 0) && (targetPageIndex != 0)){
				// From landing page to somewhere else
				changeTextColor(targetPageIndex);
			}
			currentPageIndex = targetPageIndex;
		}
	}

/* Change buttons font color to black when user navigate from landing page to other page */
function changeTextColor(targetPageIndex){
	$('#navigation-bottom button').toggleClass('black');
	$("#navigation-bottom .row .bottom-vertical-divider").toggleClass('black');

	if(targetPageIndex === 0){
		$('#background-video-container').animate({opacity:'1'}, fadeOutTime, 'swing');
		$('#landing-button-container-desktop').show();
		$('#landing-button-container-desktop').animate({opacity:'1'}, fadeInTime);
		$('#back-button').animate({opacity:'0'}, fadeOutTime);
		$('#back-button').hide(fadeOutTime);
		$('#root-buttons').show();
		$('#root-buttons').animate({opacity:'1'}, fadeOutTime, 'swing');
	}
	else{
		$('#background-video-container').animate({opacity:'0'}, fadeInTime, 'swing');
		
		$('#landing-button-container-desktop').animate({opacity:'0'}, fadeOutTime);
		$('#landing-button-container-desktop').hide();
		$('#back-button').show();
		$('#back-button').animate({opacity:'1'}, fadeInTime);
		$('#root-buttons').animate({opacity:'0'}, fadeInTime, 'swing');
		$('#root-buttons').hide();
	}
}

/*
	======================================================================
		MIDI PLAYER CONTROL
	======================================================================
*/

// Default extension = mp3
var extension = ".mp3";

/* File name of the tracks */
var playlist = [
	"01towerofgod", "02homura", "03gurenge", 
	"04dejavu", "05rezero", "06stb", 
	"07steinsgate", "08kaguyasama", "09kemono", "10rezeros2",
	"11kakumei-1", "12kakumei-2", "13mahouka",
	"14fma", "15shield",
	"16sdfs", "17thereason"
];

/* Track title */
var trackTitle = [
  "TOP", "炎", "紅蓮華", 
  "Deja Vu", "Paradisus-Paradoxum", "ストライク・ザ・ブラッド", 
  "Fatima", "DADDY ! DADDY ! DO !", "ようこそジャパリパークへ", "Long Shot",
  "Preserved Roses", "革命デュアリズム", "Rising Hope", 
  "Again", "RISE",
  "帅到分手", "The Reason"
];

var trackArtist = [
	"Stray Kids", "LiSA", "LiSA", 
	"Dave Rodgers", "MYTH&ROID", "岸田教団&THE明星ロケッツ", 
	"いとう かなこ", "鈴木雅之 feat. 鈴木愛理", "どうぶつビスケッツ×PPP", "前島麻由",
	"T.M.Revolution×水樹奈々", "T.M.Revolution×水樹奈々", "LiSA", 
	"Yui", "MADKID",
	"周湯豪", "Hoobastank"
];

// I think...this is more efficient than to load each audio track just to look for its duration?
var trackDuration = [
	"0:29", "0:51", "0:31", 
	"0:23", "0:29", "0:45",
	"0:47", "0:23", "0:32", "0:25",
	"0:34", "0:26", "0:28",
	"0:48", "0:18",
	"0:57", "0:53"
];

/* Track compose date */
var trackDate = [
  "May 29, 2020", "Oct 23, 2020", "Feb 14, 2020", 
  "Dec 10, 2021", "Sep 3, 2016", "Jan 19, 2014",
  "Jul 6, 2018", "May 15, 2020", "Mar 30, 2019", "Mar 19, 2021",
  "May 18, 2013", "Dec 20, 2014", "Jun 15, 2014",
  "Jul 27, 2018", "Mar 9, 2019",
  "Feb 15, 2018", "July 1, 2012"
];

var trackLink = [
	"https://youtu.be/6OreK_WtEHI", // TOP
	"https://youtu.be/sStZAwr2Q7o", // Homura
	"https://youtu.be/9h5GHaNo8f4", // Gurenge
	"https://youtu.be/qkEci10XMAY", // Deja Vu
	"https://youtu.be/RJ7suUyk1IM", // Paradisus-Paradoxum
	"https://youtu.be/nzbUJTxUnts", // Strike the Blood
	"https://youtu.be/8zD5eKzskIQ", // Fatima 
	"https://youtu.be/vW4thoxk1a8", // DADDY! DADDY! DO! 
	"https://youtu.be/Lv7J1AjKnRE", // ようこそジャパリパークへ
	"https://youtu.be/9pDlffp5Q0w", // Long Shot
	"https://youtu.be/fNoKj4hHhFQ", // Preserved Roses
	"https://youtu.be/wZFiF0PQsmE", // 革命デュアリズム
	"https://youtu.be/RJncd8CVo_0", // Rising Hope
	"https://youtu.be/DhJPiJ5soy4", // Again
	"https://youtu.be/RTvCk_bJMIM", // RISE
	"", ""
];

/* Track description */
var trackDescription = [
	"Stray Kids / Tower of God",
	"Lisa / 劇場版 鬼滅の刃 無限列車編",
	"Lisa / 鬼滅の刃",
	"Dave Rodgers / 頭文字 D",
	"MYTH&ROID / Re：ゼロから始める異世界生活",
	"岸田教団&THE明星ロケッツ / ストライク・ザ・ブラッド",
	"いとう かなこ / Steins;Gate 0",
	"鈴木雅之 feat. 鈴木愛理 / かぐや様は告らせたい？～天才たちの恋愛頭脳戦～",
	"どうぶつビスケッツ×PPP / けものフレンズ",
	"前島麻由 / Re：ゼロから始める異世界生活\n⚠ Whammy Pedal Effect was used starting from 0:09, it was quite an experiment for me.",
	"T.M.Revolution×水樹奈々 / 革命機ヴァルヴレイヴ",
	"T.M.Revolution×水樹奈々 / 革命機ヴァルヴレイヴ",
	"LiSA / 魔法科高校の劣等生",
	"Yui / 鋼の錬金術師",
	"MADKID / 盾の勇者の成り上がり",
	"周湯豪\nA friend casually asked me to play this song, I casually added a guitar solo, and it ends up become one of my favorites.",
	"Hoobastank"
];

var audio = new Audio();
var audio2 = new Audio();

var currentPlaylistIndex = 0;
var seeking = false; // Determine if user is pressing the player seeking bar

audio.src = 'audio/' + playlist[currentPlaylistIndex] + extension;
audio.controls = true;
audio.loop = false;
audio.autoplay = false;
audio.preload = "auto";
audio.load();
audio.addEventListener('loadedmetadata', function() {
    $('#player-end-time').text(secondToString(audio.duration));
    $('#seek-slider').val('0').change();
});

audio.addEventListener('loadeddata', function() {
//   console.log("audio1 loadeddata - " + audio.readyState, { audio });
  audioReadyStateUpdate();
});

audio2.addEventListener('loadeddata', function() {
//   console.log("audio2 loadeddata - " + audio2.readyState, { audio2 });
  audioReadyStateUpdate();
});

audio2.src = 'audio/' + playlist[currentPlaylistIndex] + '-n' + extension;
audio2.controls = true;
audio2.loop = false;
audio2.autoplay = false;
audio2.preload = "auto";
audio2.load();

if(isTablet){
  audio.volume = 1;
  audio2.volume = 1;
} else {
  audio.volume = 1;
  audio2.volume = 0;
}

function switchTrack(direction){
	if(direction == "next"){
		if(currentPlaylistIndex == playlist.length - 1){
			currentPlaylistIndex = 0
		}
		else{
			currentPlaylistIndex++;
		}
	}
	else{
		if(currentPlaylistIndex == 0){
			currentPlaylistIndex = playlist.length - 1
		}
		else{
			currentPlaylistIndex--;
		}
	}
	//console.log("SWITCHING TO " + playlist[currentPlaylistIndex]);
	reInitTrack(true);
}

function seekTimeUpdate(){
  if(activeAudioTrack === 0){
    var activeTrack = audio;
  } else {
    var activeTrack = audio2;
  }

	// Update seek-slider if user isn't pressing seeking bar
	if(seeking === false){
    var time = (activeTrack.currentTime / activeTrack.duration) * 100;
		// time will be NaN when the media is still loading and #seek-slider will not behave properly 
		if(isNaN(time)){
			$('#seek-slider').val('0').change();
		}
		else{
			$('#seek-slider').val(time).change();
			$('#player-current-time').text(secondToString(activeTrack.currentTime));
		}
	}
}



function audioReadyStateUpdate(){
	if(audio.readyState === 4 && audio2.readyState === 4 && shouldAutoPlay && audio.paused && audio2.paused){
		if(isTablet){
			audio.play();
		}
		else {
			audio.play();
			audio2.play();
		}
	}
}

var shouldAutoPlay = false;

// $('.youtube-button').click(function(){
// 	console.log("YouTube CLICK", {
// 		'href?': $('.youtube-button').attr("href")
// 	});
// 	if(trackLink[currentPlaylistIndex] != 'none'){
// 		console.log("NOT NONE, LINK = " + trackLink[currentPlaylistIndex]);
// 	}
// 	$('.youtube-button').attr("href", trackLink[currentPlaylistIndex]); //.replace(trackLink[currentPlaylistIndex]);
// });


// REFERENCE: https://stackoverflow.com/questions/31060642/preload-multiple-audio-files
var pPlaylist = [
	"01towerofgod", "02homura", "03gurenge", 
	"04dejavu", "05rezero", "06stb", 
	"07steinsgate", "08kaguyasama", "09kemono", "10rezeros2",
	"11kakumei-1", "12kakumei-2", "13mahouka",
	"14fma", "15shield",
	"16sdfs", "17thereason",

	"01towerofgod-n", "02homura-n", "03gurenge-n", 
	"04dejavu-n", "05rezero-n", "06stb-n", 
	"07steinsgate-n", "08kaguyasama-n", "09kemono-n", "10rezeros2-n",
	"11kakumei-1-n", "12kakumei-2-n", "13mahouka-n",
	"14fma-n", "15shield-n",
	"16sdfs-n", "17thereason-n",

	// Skip these: lower priority compared to the above
	// "midi/01", "midi/02", "midi/03", "midi/04", "midi/05", "midi/06", "midi/07", "midi/08", "midi/09", "midi/10", "midi/11"
];
function preloadAudioTracks(){
	// we start preloading all the audio files
	for (var i in pPlaylist) {
		preloadAudio(pPlaylist[i]);
	}

	playlist.forEach(track => {
		// Preload track images while we're at it, for smoother transition
		document.getElementById("image-preloader").innerHTML += "<img src='images/" + track + ".png'></img>";
	});
}
function preloadAudio(track) {
	// var audio = new Audio();
	let pAudio = new Audio();
	// once this file loads, it will call loadedAudio()
	// the file will be kept by the browser as cache
	pAudio.addEventListener('canplaythrough', loadedAudio, false);
	pAudio.src = 'audio/' + track + '.mp3';
	pAudio.load();
}
var pLoaded = 0;
function loadedAudio() {
	// this will be called every time an audio file is loaded
	// we keep track of the loaded files vs the requested files
	pLoaded++;
	if (pLoaded == pPlaylist.length){
		console.log('ALL AUDIO FILE LOADED', { pLoaded });
	}
}

function reInitTrack(autoPlay){
	audio.pause();
	audio2.pause();
	audio.src = 'audio/' + playlist[currentPlaylistIndex] + extension;
	audio2.src = 'audio/' + playlist[currentPlaylistIndex] + '-n' + extension;

	//trackLink
	if(trackLink[currentPlaylistIndex]){
		$('.youtube-button').css('opacity', '1');
		$('.youtube-button').css('cursor', 'pointer');
		$('.youtube-button').css('pointer-events', 'all');
	} else {
		// EMPTY LINK
		// pointer-events: none
		$('.youtube-button').css('pointer-events', 'none');
		$('.youtube-button').css('opacity', '0.38');
		$('.youtube-button').css('cursor', 'default');
	}

	activeAudioTrack = 0;
		$('.audio-flip-button').removeClass('audio-flip-button-triggered');
		$('.audio-flip-button').html('GUITAR ON');

	if(!isTablet){
		audio.volume = 1;
		audio2.volume = 0;
	}

	$('#seek-slider').val(0).change();

	if(autoPlay === false){
    	shouldAutoPlay = false;
		$('#player-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
	}
	else if(autoPlay === true){
    	shouldAutoPlay = true;
		$('#player-play-button').html('<i class="fa fa-pause" aria-hidden="true"></i>');
  	}
  
	audio.load();
	audio2.load();
	$('.youtube-button').attr("href", trackLink[currentPlaylistIndex]);

	// Fade in/out effect while changing below element's content
	$('#player-title-text').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('#player-title-text').html(trackTitle[currentPlaylistIndex]);
		$('#player-title-text').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});
	$('#player-date-text').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('#player-date-text').text(trackDate[currentPlaylistIndex]);
		$('#player-date-text').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});
	$('#player-description-text').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('#player-description-text').text(trackDescription[currentPlaylistIndex]);
		$('#player-description-text').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});
	$('.player-thumbnail').animate({opacity:'0'}, playerInfoFadeInTime, 'swing', function(){
		$('.player-thumbnail').attr('src', 'images/' + playlist[currentPlaylistIndex] + '.png');
		$('.player-thumbnail').animate({opacity:'1'}, playerInfoFadeOutTime, 'swing');
	});

	$('#player-current-time').text(secondToString(audio.currentTime));
	refreshTrackList();
}

/* Update playlist item's highlight */
function refreshTrackList(){
	var playlistChildrenMobile = $('#player-tracklist-mobile').children().toArray();
	var playlistChildrenDesktop = $('#player-tracklist-desktop').children().toArray();

	for(var i = 0; i <= playlist.length - 1; i++){
		if($(playlistChildrenMobile[i]).attr('track-id') == currentPlaylistIndex){
			//console.log("EQUAL TO PLAYLIST = " +  i);
			//$(playlistChildren[i]).addClass('hovered');
			$(playlistChildrenMobile[i]).css("background-color", "rgba(143,195,31, 0.5)");

			$(playlistChildrenMobile[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			});


			// Repeat the same process for desktop playlist
			$(playlistChildrenDesktop[i]).css("background-color", "rgba(143,195,31, 0.5)");

			$(playlistChildrenDesktop[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			});
		}
		else{
			//console.log("NOT EQUAL = " + i);
			//$(playlistChildrenMobile[i]).removeClass('hovered');
			$(playlistChildrenMobile[i]).css("background-color", "rgba(143,195,31, 0.1)");
			$(playlistChildrenMobile[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
				$(this).css("transition", "background-color 0s");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.1)");
				$(this).css("transition", " background-color 0.15s ease-out");
			});


			// Repeat the same process for desktop playlist
			$(playlistChildrenDesktop[i]).css("background-color", "rgba(143,195,31, 0.1)");
			$(playlistChildrenDesktop[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
				$(this).css("transition", "background-color 0s");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.1)");
				$(this).css("transition", " background-color 0.15s ease-out");
			});
		}
	}
}

/* Convert second into MM:SS format */
function secondToString(input){
	var min = Math.floor(input / 60);
	var sec = Math.floor(input - min * 60);
	if(sec < 10){sec = "0" + sec;}

	return (min + ' : ' + sec);
}

/* Stop the audio and reset the current play time */
function stopAudio(){
	audio.pause();
	audio.currentTime = 0;
	audio2.pause();
	audio2.currentTime = 0;
	activeAudioTrack = 0;
	$('.audio-flip-button').removeClass('audio-flip-button-triggered');
	$('.audio-flip-button').html('GUITAR ON');
	$('#player-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');

	if(midiAudio){
		midiAudio.pause();
		midiAudio.currentTime = 0;
	}
}

/*
	======================================================================
		BACKGROUND VIDEO /IMAGE
	======================================================================
*/

// Detect if the website is running on a mobile device
function isMobileDevice() {
	return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

// If somehow the video still can't be played
function playerError(){
	backgroundAnimation();
}

function backgroundAnimation(){
	// Substitute by moving the background around 
	// $('#background-video-container').css("animation", "background-animationX 12s infinite, background-animationY 8s infinite");
	// $('#background-video-container').css("animation-timing-function", "ease-in-out");
	//$('#background-video-container').css("animation-iteration-count", "infinite");
}

// var lFollowX = 0,
// lFollowY = 0,
// x = 0,
// y = 0,
// step = 500,
// elapsedStep = 0,
// friction = 1 / 30;//30;


// function moveBackground() {
// 	console.log("moveBG called x = " + x + " | lFollowX = " + lFollowX);
// 	x += (lFollowX - x) * friction;
// 	y += (lFollowY - y) * friction;

// 	translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

// 	$('#background-image').css({
// 	'-webit-transform': translate,
// 	'-moz-transform': translate,
// 	'transform': translate
// 	});

// 	if(elapsedStep < 200){
// 		window.requestAnimationFrame(moveBackground);
// 		elapsedStep++;
// 	} else {
// 		elapsedStep = 0;
// 		console.log("Difference < 0.5 | x = " + x + " | lFollowX = " + lFollowX);
// 	}

	
// }

// $(window).on('mousemove click', function(e) {

// var lMouseX = Math.max(-100, Math.min(100, $(window).width() / 2 - e.clientX));
// var lMouseY = Math.max(-100, Math.min(100, $(window).height() / 2 - e.clientY));
// lFollowX = (20 * lMouseX) / 100; // 100 : 12 = lMouxeX : lFollow
// lFollowY = (10 * lMouseY) / 100;
// // window.requestAnimationFrame(moveBackground);
// // moveBackground();
// });

// moveBackground();

/* $('#background-image').css({
		'-webit-transform': 'scale(1.1)',
		'-moz-transform': 'scale(1.1)',
		'transform': 'scale(1.1)',
}); */

var scene = document.getElementById('bg-img-container');
var parallaxInstance = new Parallax(scene, {
	relativeInput: true,
	clipRelativeInput: true
  });
parallaxInstance.friction(0.01, 0.01);


parallaxInstance.clipRelativeInput = true;


// var lFollowX = 0,
// lFollowY = 0,
// x = 0,
// y = 0,
// friction = 1 / 3;//30;

// $('body').mousemove(function(e){
// 	console.log("BG MOVE");
// 	/* console.log("BG MOVE");
//     var x = -(e.pageX + this.offsetLeft) / 20;
//     var y = -(e.pageY + this.offsetTop) / 20;
// 	$('#background-image').css('background-position', x + 'px ' + y + 'px'); */
	
// 	x += (lFollowX - x) * friction;
// 	y += (lFollowY - y) * friction;


// 	translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';

// 	$('#background-image').css('transform', translate);

// 	// $('#background-image').css({
// 	// '-webit-transform': translate,
// 	// '-moz-transform': translate,
// 	// 'transform': translate
// 	// });

// 	window.requestAnimationFrame(500);
//   });   



// To set resume expandable detail's height, will change accroding to page width
var resumeDetailExpandHeight = 10; //rem
// Set text according to screen size
// if($(window).width() < 840){
// 	document.getElementById("back-button").innerHTML = '<span><b>✕</b></span>';
// 	// document.getElementById("programming-button").innerHTML = 'PROGM';
// }else{
// 	document.getElementById("back-button").innerHTML = '<span>BACK | <b>✕</b></span>';
// 	// document.getElementById("programming-button").innerHTML = 'PROGRAMMING';
// }


var previousExpandedDetailID = "";

function toggleDetail(id) {
	if(previousExpandedDetailID != id && previousExpandedDetailID != ""){
		//console.log("PREVIOUS DETAIL");
		document.getElementById(previousExpandedDetailID+"-toggle").innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>' + " " + document.getElementById(previousExpandedDetailID+"-toggle").getAttribute("value");
		document.getElementById(previousExpandedDetailID).style.height = '0px';
		previousExpandedDetailID = id;
	}

	if (document.getElementById(id).style.height == '0px') {
		document.getElementById(id+"-toggle").innerHTML = '<i class="fa fa-angle-down" aria-hidden="true"></i>' + " " + document.getElementById(id+"-toggle").getAttribute("value");
		document.getElementById(id).style.height = resumeDetailExpandHeight + 'rem';
		previousExpandedDetailID = id;
	}
	else {
		document.getElementById(id+"-toggle").innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>' + " " + document.getElementById(id+"-toggle").getAttribute("value");
		document.getElementById(id).style.height = '0px';
		previousExpandedDetailID = id;
	}
}