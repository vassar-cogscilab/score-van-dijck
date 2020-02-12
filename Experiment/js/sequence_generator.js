function generate_consonant_sequence(length){
  var groups = [
    ['B','D','G','V'],
    ['P','C','T'],
    ['F','S'],
    ['J','K'],
    ['M','N'],
    ['H'],
    ['R'],
    ['L'],
    ['Q'],
    ['W'],
    ['X'],
    ['Z']
  ];

  var random_order_groups = jsPsych.randomization.shuffle(groups);
  var sequence = [];
  for(var i = 0; i< length; i++){
    sequence.push(jsPsych.randomization.sampleWithoutReplacement(random_order_groups[i], 1)[0])
  }

  return sequence;
}