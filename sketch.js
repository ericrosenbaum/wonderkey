function preload() {

	// audio data
	//trackNames = ['1- Bass Drum','2- Snare Drum and Cymbals','3- Bass','4- Guitar','5- Vocals','6- Keys'];
	trackNames = ['MusicDelta_ModalJazz_STEM_01', 'MusicDelta_ModalJazz_STEM_02',
    'MusicDelta_ModalJazz_STEM_03', 'MusicDelta_ModalJazz_STEM_04',
    'MusicDelta_ModalJazz_STEM_05'];

	//trackNames = ['1- Bass Drum','2- Snare Drum and Cymbals'];
	
	function removeSpaces(element) {
		return encodeURIComponent(element);
	}
	trackNames.filter(removeSpaces);
	
	sounds = [];
	for (var i=0; i<trackNames.length; i++) {
		sounds.push(loadSound('sounds/'+trackNames[i] + '.ogg'));
	}

	// keys
	keyControls = ['Q','W','E','R','T','Y','U','I','O','P','[',']','\\','A','S','D','F'];
//	keyControls = ['Q','W','E','R','T','Y','U','I','O','P'];
	numberKeys = ['1','2','3','4','5','6','7','8','9'];
	
	currentTrack = 2;

	// drawing
	w = 1200;
	h = 600;
	canvas = createCanvas(w,h);	
	highlight = createElement('div');
	highlight.style('background', 'rgba(100, 100, 100, 0.3)');
	highlight.style('position', 'absolute');
	highlight.style('top', '0');
	highlight.style('width', '0');
	highlight.style('height', h);
}

function loadedData(data, trackNum) {
	function aboveThreshold(element) {
		return ((element[3] > 0) && (element[1] > 0.05));
	}
	var newData = data.filter(aboveThreshold);
	var keydict = {};
	
	//for (var sample in newData) {
	for (var i = 0; i<newData.length; i++) {
		sample = newData[i];
		if (! (sample[2] in keydict)) {
			keydict[sample[2]] = [];
		}
		keydict[sample[2]].push(sample);
	}
	
	console.log(keydict);
	
	trackData.push(keydict);
	
	//console.log(trackData);
}

function setup() {

	// json data
	trackData = [];
	for (var i=0; i<trackNames.length; i++) {
		loadJSON('sounds/'+trackNames[i] + '.json', function(data){loadedData(data,i)});	
	}
	
	// buffers
	soundBuffers = [];
	for (var i=0; i<sounds.length; i++) {
		soundBuffers.push(new p5.SoundFile());
		soundBuffers[i].buffer = sounds[i].buffer;
	}  
	
	allTracksPlaying = false;
	
	// play all tracks
	for (var i=0; i<sounds.length; i++) {
		sounds[i].setVolume(0.5);
		//sounds[i].play();	
	}	

	for (var i=0; i<sounds.length; i++) {
		numPeaks = w;
		peaks = sounds[i].getPeaks(numPeaks);
		colorMode(HSB, 100);
		hue = i * 20;
		for (var i=0; i<numPeaks; i++) {
			val = peaks[i] * h/2;
			stroke(hue,100,80);
			line(i, h/2 + val, i, h/2 - val);
		}
	}
	
}

function draw() {
  // put drawing code here
}

function keyPressed() {

	var index = numberKeys.indexOf(key);
	if (index != -1){
		for (var i=0; i<sounds.length; i++) {
			sounds[i].setVolume(0.5);
		}
		if (index < sounds.length) {
			sounds[index].setVolume(0);
			currentTrack = index;
		}
	}
	
	var sample_map = trackData[currentTrack];
			
	var keymap = Object.keys(sample_map);
	
	for (var i=0; i<keyControls.length; i++) {
		if (key == keyControls[i]) {
			//console.log(trackData);
			if (i < keymap.length) {
				sample_list = sample_map[keymap[i]];
				d = sample_list[Math.floor(Math.random()*sample_list.length)];
				start = d[0];
				duration = d[1];
				//console.log(start, duration);
				//console.log(currentTrack);
				soundBuffers[currentTrack].play(0,1,1,start,duration);	
			}
		}
	}

	if (key == ' ') {
		if (allTracksPlaying) {
			allTracksPlaying = false;
			for (var i=0; i<sounds.length; i++) {
				sounds[i].stop();	
			}
		} else {
			allTracksPlaying = true;
			for (var i=0; i<sounds.length; i++) {
				sounds[i].play(0,1,0.5,4.0);	
			}
		}			
	}
}
