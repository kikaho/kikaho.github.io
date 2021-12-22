

/* Midi stuff */
function init2(){

	// Removes hover effect if votouchMidi is enabled
	var votouchMidi = 'ontouchstart' in document.documentElement
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0;

	if (votouchMidi) { // remove all :hover stylesheets
	    try {
	        // Disable volume control slider in midi player since sound volume can't be changed programmatically in mobile device 
	        $('#volume-slider-midi').prop("disabled", true);
			$('#midi-vol-down-icon').css('opacity', '0.5');
			$('#midi-vol-up-icon').css('opacity', '0.5');
	    } catch (ex) {}
	}

	reInitTrackMidi(false);

	/*// Fade out initial white screen
	setTimeout(function(){
		$('#initial-screen').hide(1500);
	}, 300);*/

	/*
		======================================================================
			MIDI Player
		======================================================================
	*/
	midiAudio.addEventListener("timeupdate", function(){seekTimeUpdateMidi();});
	midiAudio.addEventListener("ended", function(){midiSwitchTrack("next");})

	/* Midi midiPlaylist's song button */
	$('.midi-track-button').click(function(){
		/* To solve a problem where the audio volume would suddenly turned into 0 */
		if(midiAudio.volume == 0){
			//console.log("audio = " + midiAudio.volume);
			midiAudio.volume = 0.8;
			$('#volume-slider-midi').val(midiAudio.volume * 100).change();
		}

		var thisTarget = $(this).attr('track-id');
		midiCurrentPlaylistIndex = thisTarget;
		reInitTrackMidi(true);
	});

	/* MIDI player seeker */
	$('#seek-slider-midi').rangeslider({
		polyfill:false,
		onInit:function(){
			midiSeeking = false;
		},
		onSlide:function(position, value){

			if(isNaN(midiAudio.duration)){
				$('#midi-current-time').text(secondToStringMidi('0'));
			}
			else{
				$('#midi-current-time').text(secondToStringMidi(midiAudio.duration * (value/100)));
			}
			//console.log('onSlide SEEK - position: ' + position, 'value: ' + value);
		},
		onSlideEnd:function(position, value){
			//console.log('onSlideEnd SEEK - position: ' + position, 'value: ' + value);
			midiSeeking = false;
			midiAudio.currentTime = midiAudio.duration * (value/100);
		}
	});

	/* MIDI player volume changer. Doesn't work in mobile */
	$('#volume-slider-midi').rangeslider({
		polyfill:false,
		onInit:function(){
			midiAudio.volume = 0.8;
		},
		onSlide:function(position, value){
			//console.log('onSlide VOL - position: ' + position, 'value: ' + value);
			midiAudio.volume = value / 100;
		},
		onSlideEnd:function(position, value){
			//console.log('onSlideEnd VOL - position: ' + position, 'value: ' + value);
			midiAudio.volume = value / 100;
		}
	});



	/* MIDI Button: << PREV */
	$('#midi-prev-button').click(function(){
		// Simulate behavior of music players such as iTune
		// Restart the track if midiAudio.currentTime is greater than 2, else go to previous track
		// This enables replay of the current track, and go to previous via double tap (if midiAudio.currentTime is greater than 2)
		if(midiAudio.currentTime > 2){
			midiAudio.currentTime = 0;
		}
		else{
			//console.log("PREV TRACK");
			midiSwitchTrack("prev");
		}
	})

	/* MIDI Button: >> NEXT */
	$('#midi-next-button').click(function(){
		//console.log("NEXT TRACK");
		midiSwitchTrack("next");
	})


	// For other browser
	document.getElementById('seek-slider-container-midi').addEventListener("mousedown", function(){
		midiSeeking = true;
	})

	document.getElementById('seek-slider-container-midi').addEventListener("mouseup", function(){
		if(midiSeeking == true){
			midiSeeking = false;
		}
	})

	// For chrome
	document.getElementById('seek-slider-container-midi').addEventListener("pointerdown", function() {
		midiSeeking = true;
	}, false)

	document.getElementById('seek-slider-container-midi').addEventListener("pointerup", function() {
		if(midiSeeking == true){midiSeeking = false;}
	}, false)

	// Mobile
	document.getElementById('seek-slider-container-midi').addEventListener("touchstart", function() {
		midiSeeking = true;
	})

	document.getElementById('seek-slider-container-midi').addEventListener("touchend", function() {
		if(midiSeeking == true){midiSeeking = false;}
	})


	/* MIDI Button: > Play */
	$('#midi-play-button').click(function(){
		//console.log("MIDI PLAY");
		if(midiAudio.volume == 0){
			midiAudio.volume = 0.8;
			$('#volume-slider-midi').val(midiAudio.volume * 100).change();
		}
		if(midiAudio.paused && midiAudio.readyState > 0){
			/*
				midiAudio.readyState will return a number
				0 - No information is available about the media resource.
				1 - Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
				2 - Data is available for the current playback position, but not enough to actually play more than one frame.
				3 - Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
				4 - Enough data is available—and the download rate is high enough—that the media can be played through to the end without interruption.
			*/
			midiAudio.play();
			$('#midi-play-button').html('<i class="fa fa-pause" aria-hidden="true"></i>');
		}
		else{
			midiAudio.pause();
			$('#midi-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
		}
	})


} // End init()



/*
	======================================================================
		MIDI PLAYER CONTROL
	======================================================================
*/

// Default midiExtension = mp3
var midiExtension = ".mp3";
var midiAgent = navigator.userAgent.toLowerCase();


//Rumor said that firefox & opera won't support mp3, but mp3 seem to work fine for my firefox browser. still haven't tested on Opera though 
if(midiAgent.indexOf('opera') != -1){
	//console.log("using .ogg");
	midiExtension = ".ogg";
}

/* File name of the tracks */
var midiPlaylist = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];

/* Track title */
var midiTrackTitle = [
"Welcome Back", "Night Season", "Air Forest", "Bar Fight", 
"Punk", "Sherd Master", "Gear Up", "RAWR", "Panic", "Insomnia", "See Ya"];

/* Track compose date */
var midiTrackDate = ["September 4, 2015", "March 5th, 2017", "April 15, 2010", "December 4, 2012", "May 19, 2015",
 "Unknown", "Febuary 29, 2016", "September 27, 2014", "January 27, 2012", "July 17, 2015", "October 3, 2012"];

/* Track description */
var midiTrackDescription = [
"Welcome back, you did great.", 
"This is an ongoing draft that I've been working on since March of 2017.", 
"Instrumental solo part of one of my oldest piece.", 
"Hold my beer.", 
" ", 
"When I first started learning guitar, this is what I imagined how being a guitar sherd master would feel like.", 
" ", 
" ", 
" ", 
"Zzz", 
"Okay bye."];

var midiAudio = new Audio();
var midiCurrentPlaylistIndex = 0;
var midiSeeking = false; // Determine if user is pressing the player midiSeeking bar

midiAudio.src = 'audio/midi/' + midiPlaylist[midiCurrentPlaylistIndex] + midiExtension;
midiAudio.controls = true;
midiAudio.loop = false;
midiAudio.autoplay = false;
midiAudio.volume = 0.8;
midiAudio.load();
midiAudio.addEventListener('loadedmetadata', function() {
    $('#midi-end-time').text(secondToStringMidi(midiAudio.duration));
    $('#seek-slider-midi').val('0').change();
});

function midiSwitchTrack(direction){
	if(direction == "next"){
		if(midiCurrentPlaylistIndex == midiPlaylist.length - 1){
			midiCurrentPlaylistIndex = 0
		}
		else{
			midiCurrentPlaylistIndex++;
		}
	}
	else{
		if(midiCurrentPlaylistIndex == 0){
			midiCurrentPlaylistIndex = midiPlaylist.length - 1
		}
		else{
			midiCurrentPlaylistIndex--;
		}
	}
	//console.log("SWITCHING TO " + midiPlaylist[midiCurrentPlaylistIndex]);
	reInitTrackMidi(true);
}

function seekTimeUpdateMidi(){
	var midiTime = (midiAudio.currentTime / midiAudio.duration) * 100;

	// Update seek-slider if user isn't pressing midiSeeking bar
	if(midiSeeking === false){
		// time will be NaN when the media is still loading and #seek-slider-midi will not behave properly 
		if(isNaN(midiTime)){
			$('#seek-slider-midi').val('0').change();
		}
		else{
			$('#seek-slider-midi').val(midiTime).change();
			$('#midi-current-time').text(secondToStringMidi(midiAudio.currentTime));
		}
		
	}
}

function reInitTrackMidi(autoPlay){
	midiAudio.pause();
	midiAudio.src = 'audio/midi/' + midiPlaylist[midiCurrentPlaylistIndex] + midiExtension;
	midiAudio.load();
	$('#seek-slider-midi').val(0).change();

	if(autoPlay === false){
		$('#midi-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
	}
	else if(autoPlay === true){
		midiAudio.play();
		/*midiAudio.onloadedmetadata = function() {
		    midiAudio.play();
		};*/
		$('#midi-play-button').html('<i class="fa fa-pause" aria-hidden="true"></i>');
	}

	$('#midi-current-time').text(secondToStringMidi(midiAudio.currentTime));
	$('#midi-title-text').html(midiTrackTitle[midiCurrentPlaylistIndex]);
	$('#midi-date-text').text(midiTrackDate[midiCurrentPlaylistIndex]);
	$('#midi-description-text').text(midiTrackDescription[midiCurrentPlaylistIndex]);
	refreshMidiTrackList();
}

/* Update midiPlaylist item's highlight */
function refreshMidiTrackList(){
	var midiPlaylistChildren = $('#midi-tracklist').children().toArray();

	for(var i = 0; i <= midiPlaylist.length - 1; i++){
		if($(midiPlaylistChildren[i]).attr('track-id') == midiCurrentPlaylistIndex){
			//console.log("EQUAL TO PLAYLIST = " +  i);
			//$(midiPlaylistChildren[i]).addClass('hovered');
			$(midiPlaylistChildren[i]).css("background-color", "rgba(143,195,31, 0.5)");

			$(midiPlaylistChildren[i]).hover(function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			}, function(){
				$(this).css("background-color", "rgba(143,195,31, 0.5)");
			});
		}
		else{
			//console.log("NOT EQUAL = " + i);
			//$(midiPlaylistChildren[i]).removeClass('hovered');
			$(midiPlaylistChildren[i]).css("background-color", "rgba(143,195,31, 0.1)");
			$(midiPlaylistChildren[i]).hover(function(){
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
function secondToStringMidi(input){
	var min = Math.floor(input / 60);
	var sec = Math.floor(input - min * 60);
	if(sec < 10){sec = "0" + sec;}

	return (min + " : " + sec);
}

/* Stop the audio and reset the current play time */
function stopAudioMidi(){
	midiAudio.pause();
	midiAudio.currentTime = 0;
	$('#midi-play-button').html('<i class="fa fa-play" aria-hidden="true"></i>');
}
