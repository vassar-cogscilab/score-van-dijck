/**
 * jspsych-echo-response
 * Josh de Leeuw
 *
 * plugin for a echo-response block span task
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["echo-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'echo-response',
    description: '',
    parameters: {
      sequence: {
        type: jsPsych.plugins.parameterType.STRING,
        array: true,
        default: undefined
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // display stimulus
    var html = '';
    html += '<div id="jspsych-echo-response">';
    html += trial.prompt
    html += '<div id="jspsych-echo-response-box" style="text-align: center; font-size:'+trial.echo_font_size+'px; height:'+trial.echo_font_size+'px; margin:0.5em;"></div>';
    html += '</div>';

    display_element.innerHTML = html;

    var trial_data = {
      response: [],
      sequence: JSON.stringify(trial.sequence)
    }

    var on_response = function(info){
      var character = jsPsych.pluginAPI.convertKeyCodeToKeyCharacter(info.key);
      trial_data.response.push(character);

      var correct = character == trial.sequence[trial_data.response.length - 1];
      var to_insert = '<span class="response-echo" style="padding: 0 .25em;">'+character+'</span>';

      display_element.querySelector('#jspsych-echo-response-box').insertAdjacentHTML('beforeend', to_insert);

      var correct_animation = [
        { color: '#555' },
        { color: '#0f0', offset: 0.2 },
        { color: '#555' }
      ];

      var incorrect_animation = [
        { color: '#555' },
        { color: '#f00', offset: 0.2 },
        { color: '#555' }
      ];

      var animation_timing = {
        duration: 500,
        iterations: 1
      }

      if(correct){
        document.querySelector(".response-echo:last-of-type").animate(correct_animation, animation_timing)
      } else {
        document.querySelector(".response-echo:last-of-type").animate(incorrect_animation, animation_timing);
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        trial_data.correct = false;
        setTimeout(end_trial, 500);
      }

      if(trial_data.response.length == trial.sequence.length){
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
        trial_data.correct = true;
        setTimeout(end_trial, 500);
      }
    }

    var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
      callback_function: on_response,
      valid_responses: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
      rt_method: 'performance',
      persist: true,
      allow_held_key: false
    });

    var end_trial = function(){
      trial_data.response = JSON.stringify(trial_data.response);

      jsPsych.pluginAPI.cancelAllKeyboardResponses();

      display_element.innerHTML = "";

      jsPsych.finishTrial(trial_data);
    }
    
  };

  return plugin;
})();
