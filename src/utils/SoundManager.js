class SoundManager {
    static playTick() {
      // Simple Oscillator 'Tick'
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
  
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
  
        osc.connect(gain);
        gain.connect(ctx.destination);
  
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {
        console.warn("Audio Context Error", e);
      }
    }
  
    static vibrate() {
      if (navigator.vibrate) {
        navigator.vibrate(5); // Ultra short tick
      }
    }
}
  
export default SoundManager;
