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
      sequence: {
        type: jsPsych.plugins.parameterType.INT,
        default: undefined,
        array: true
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var css = '<style id="jspsych-corsi-css">';
    css += '#jspsych-corsi-stimulus { position: relative; width: '+trial.arena_width+'px; height: '+trial.arena_height+'px; }';
    css += '.jspsych-corsi-block { background-color: #555; position: absolute; width: '+trial.block_size+'px; height: '+trial.block_size+'px; }';
    if(trial.mode == 'input'){
      css += '.jspsych-corsi-block { cursor: pointer; }';
    }
    css += '#jspsych-corsi-prompt { position: absolute; text-align: center; width: '+trial.arena_width+'px; top: 100%; }';
    css += '#jspsych-corsi-prompt p { font-size: 18px; }';
    css += '</style>';

    // display stimulus
    var html = css;
    html += '<div id="jspsych-corsi-stimulus">';

    for(var i=0; i<trial.blocks.length; i++){
      html += '<div class="jspsych-corsi-block" data-id="'+i+'" style="position: absolute; top:calc('+trial.blocks[i].y+'% - '+trial.block_size/2+'px); left:calc('+trial.blocks[i].x+'% - '+trial.block_size/2+'px);"></div>';
    }
    
    if(trial.prompt != null){
      html += '<div id="jspsych-corsi-prompt"><p>'+trial.prompt+'</p></div>';
    }
    html += '</div>';

    display_element.innerHTML = html;

    var trial_data = {
      sequence: JSON.stringify(trial.sequence),
      response: [],
      blocks: JSON.stringify(trial.blocks)
    }

    if(trial.mode == 'display'){
      var sequence_location = 0;
      var display_phase = 'pre-stim';

      var update_display = function(){
        if(display_phase == 'pre-stim'){
          wait(update_display, trial.pre_stim_duration);
          display_phase = 'sequence';
        } else if(display_phase == 'sequence'){
          if(sequence_location < trial.sequence.length){
            document.querySelector('.jspsych-corsi-block[data-id="'+trial.sequence[sequence_location]+'"]').style.backgroundColor = 'red';
            wait(update_display, trial.sequence_duration)
            display_phase = 'iti';
          }
          if(sequence_location == trial.sequence.length){
            end_trial();
          }
        } else if(display_phase == 'iti'){
          document.querySelector('.jspsych-corsi-block[data-id="'+trial.sequence[sequence_location]+'"]').style.backgroundColor = '#555';
          sequence_location++;
          wait(update_display, trial.sequence_iti)
          display_phase = 'sequence';
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

      var correct_animation = [
        { backgroundColor: '#555' },
        { backgroundColor: '#0f0', offset: 0.2 },
        { backgroundColor: '#555' }
      ];

      var incorrect_animation = [
        { backgroundColor: '#555' },
        { backgroundColor: '#f00', offset: 0.2 },
        { backgroundColor: '#555' }
      ];

      var animation_timing = {
        duration: 500,
        iterations: 1
      }

      var register_click = function(id){
        if(typeof trial.data.correct != 'undefined'){
          return; // extra click during timeout, do nothing
        }
        trial_data.response.push(id);
        var correct = id == trial.sequence[trial_data.response.length-1];
        if(correct){
          document.querySelector('.jspsych-corsi-block[data-id="'+id+'"]').animate(correct_animation, animation_timing)
        } else {
          document.querySelector('.jspsych-corsi-block[data-id="'+id+'"]').animate(incorrect_animation, animation_timing);
          trial_data.correct = false;
          setTimeout(end_trial, 500);
        }
        if(trial_data.response.length == trial.sequence.length){
          trial_data.correct = true;
          setTimeout(end_trial, 500); // allows animation to finish?
        }
      }

      var blocks = display_element.querySelectorAll('.jspsych-corsi-block');
      for(var i = 0; i<blocks.length; i++){
        blocks[i].addEventListener('click', function(e){
          register_click(e.target.getAttribute('data-id'));
        })
      }
    }

    var end_trial = function(){
      display_element.innerHTML = "";

      jsPsych.finishTrial(trial_data);
    }
    
  };

  return plugin;
})();
