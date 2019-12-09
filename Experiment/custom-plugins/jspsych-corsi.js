/**
 * jspsych-corsi
 * Josh de Leeuw
 *
 * plugin for a Corsi block span task
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["corsi"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'corsi',
    description: '',
    parameters: {
    }
  }

  plugin.trial = function(display_element, trial) {

    var css = '<style id="jspsych-corsi-css">';
    css += '#jspsych-corsi-stimulus { position: relative; width: '+trial.arena_width+'px; height: '+trial.arena_height+'px; }';
    css += '.jspsych-corsi-block { background-color: #555; position: absolute; width: '+trial.block_size+'px; height: '+trial.block_size+'px; }';
    css += '</style>';

    // display stimulus
    var html = css;
    html += '<div id="jspsych-corsi-stimulus">';

    for(var i=0; i<trial.blocks.length; i++){
      html += '<div class="jspsych-corsi-block" data-id="'+i+'" style="position: absolute; top:calc('+trial.blocks[i].y+'% - '+trial.block_size/2+'px); left:calc('+trial.blocks[i].x+'% - '+trial.block_size/2+'px);"></div>';
    }
    
    html += '</div>';

    display_element.innerHTML = html;

    if(trial.mode == 'display'){
      var start = performance.now();
      var sequence_location = 0;
      var display_phase = 'pre-stim';

      var update_display = function(){
        var now = performance.now();
        var elapsed = now - start;
        if(display_phase == 'pre-stim'){
          wait(update_display, trial.pre_stim_duration);
          if(elapsed >= trial.pre_stim_duration){
            display_phase = 'sequence'
            document.querySelector('.jspsych-corsi-block[data-id="'+trial.sequence[sequence_location]+'"]').style.backgroundColor = 'red';
            wait(update_display, trial.sequence_duration);
          }
        } else if(display_phase == 'sequence'){
          document.querySelector('.jspsych-corsi-block[data-id="'+trial.sequence[sequence_location]+'"]').style.backgroundColor = '#555';
          sequence_location++;
          if(sequence_location < trial.sequence.length){
            document.querySelector('.jspsych-corsi-block[data-id="'+trial.sequence[sequence_location]+'"]').style.backgroundColor = 'red';
            wait(update_display, trial.sequence_duration)
          }
        }
      }

      var wait = function(fn, t){
        var start = performance.now();

        var _wait_help = function(fn, t, s){
          var duration = performance.now() - s;
          if(duration >= t){
            fn();
          } else {
            window.requestAnimationFrame(function(){_wait_help(fn, t, start)});
          }
        }
        window.requestAnimationFrame(function(){_wait_help(fn, t, start)});
      }

      window.requestAnimationFrame(update_display);
    }

    if(trial.mode == 'input'){

    }

    
  };

  return plugin;
})();
