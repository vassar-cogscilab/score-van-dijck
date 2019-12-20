function generate_consonant_sequence(length){
  var groups = [
    ['b','d','p','t'],
    ['c'],
    ['f','s'],
    ['g'],
    ['h','k'],
    ['j'],
    ['l'],
    ['m','n'],
    ['q'],
    ['r'],
    ['v','w'],
    ['x'],
    ['z']
  ];

  var random_order_groups = jsPsych.randomization.shuffle(groups);
  var sequence = [];
  for(var i = 0; i< length; i++){
    sequence.push(jsPsych.randomization.sampleWithoutReplacement(groups[i], 1)[0])
  }

  return sequence;
}