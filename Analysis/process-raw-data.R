raw.data <- jsonlite::fromJSON('data/pilot/score-data-trial-run.json')


## the parity task data

parity.data <- raw.data %>%
  select(subject_id, trial_type, phase, digit, correct, rt, wm_type, parity, task, key_press, value) %>%
  rename(subject=subject_id, wmtask=wm_type) %>%
  filter(task=='parity') %>%
  filter(! phase %in% c('baseline-practice', 'load-practice')) %>%
  mutate(targetkey = if_else(correct==1,
                             if_else(key_press==65, 'left', 'right'),
                             if_else(key_press==76, 'left', 'right')))

write_csv(parity.data, path="data/pilot/parity-data.csv")

wm.data <- raw.data %>%
  rename(subject=subject_id, wmtask=wm_type) %>%
  filter(phase=='load' & (trial_type=='corsi' | trial_type == 'echo-response') & !is.na(correct)) %>%
  select(subject, phase, wmtask, correct, response) %>%
  group_by(subject)

write_csv(wm.data, path="data/pilot/wm-data.csv")

## post-task self-include data

post.task.q <- raw.data %>%
  filter(phase == 'self-attention-report') %>%
  select(subject=subject_id, button_pressed) %>%
  mutate(response = if_else(button_pressed==0, "Yes", "No")) %>%
  select(-button_pressed)

write_csv(post.task.q, path="data/pilot/self-include-data.csv")

