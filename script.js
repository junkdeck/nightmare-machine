//Sound class for playing sounds and retriggering oscillators
class Sound{
    constructor(context){
        this.context = context;
    }

    init(){
        this.osc = this.context.createOscillator();
        this.vel = this.context.createGain();
        this.lpf = this.context.createBiquadFilter();

        this.lpf.frequency.value = 880;
        this.lpf.Q.value = 4;
        this.osc.type = 'sawtooth';

        this.osc.connect(this.lpf);
        this.lpf.connect(this.vel);
        // this.osc.connect(this.vel);
        this.vel.connect(this.context.destination);
    }

    play(freq){
        this.init();

        this.osc.frequency.value = freq;
        this.vel.gain.setValueAtTime(0,this.context.currentTime);
        this.vel.gain.linearRampToValueAtTime(0.25,this.context.currentTime+0.5);

        // this.lpf.frequency.setValueAtTime(0,this.context.currentTime);
        // this.lpf.frequency.linearRampToValueAtTime(1200,this.context.currentTime+0.15);

        this.osc.start(this.context.currentTime);
        this.stop();
    }

    stop(){
        this.vel.gain.exponentialRampToValueAtTime(0.001,this.context.currentTime+1.5);
        // this.lpf.frequency.linearRampToValueAtTime(0.001,this.context.currentTime+.5);
        this.osc.stop(this.context.currentTime+1.5);
    }
}

var context = new (window.AudioContext || window.webkitAudioContext)();

function playSound(freq){
    let sound = new Sound(context);
    sound.play(freq);
}

//refresh rate and bpm setup
const UPDATE_INTERVAL = 1000 / 60      //1000 milliseconds divided by 50 frames per second = 20ms per frame
var bpm = 120;      //tempo in beats per minute
var beat = 60/bpm;     //length of one beat, in seconds
//initialize new audio context. safari requires webkit prefix
// var now = context.currentTime;
//delta time setup
var lastDelta = context.currentTime;
var timer = 0;
var a = 1;
//sequence step setup
var step = 0;
var steps = [
    392/1,
    392/2,
    329.63/1,
    261.63/2
];

var bar = 1;

var running = false;

setInterval(function(){
    var time = context.currentTime;
    var delta = time - lastDelta
    lastDelta = time;
    // console.log("delta: "+delta);

    if(running){
        timer += delta;
    }
    //increase step counter, reset if all steps are played
    if(timer>=beat){
        if(step>=steps.length){
            step = 0;
            bar+=1;
            if(bar>4){
                bar=1;
            }
        }
        // playSound(steps[step]*(bar));
        playSound(Math.random()*440);
        playSound(Math.random()*440);
        playSound(Math.random()*440);
        playSound(Math.random()*220);
        $('.wrapper').css({'background':'rgb('+Math.floor(Math.random()*880)+','+Math.floor(Math.random()*440)+','+Math.floor(Math.random()*220)+')'})
        // $('.wrapper').css({'background':'rgb(127,'+Math.floor((steps[step]/2)*bar)+',50)'})
        console.log(steps[step]);
        console.log(bar);
        step++;

        timer = 0;
    }
},UPDATE_INTERVAL)

$('.restart').on('click',function(){
    timer = beat;
    step = 0;
});
$('.stop').on('click',function(){
    running = false;
    step = 0;
});
$('.start').on('click',function(){
    running = true;
    timer = beat;
});
