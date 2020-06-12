# this script counts the number of included subjects without performing any meaningful analysis
# it will be used to determine whether we have met the necessary sample size

library(readr)
library(dplyr)

all.parity.data <- read_csv('data/fake/testing_data.csv')
post.task.q.data <- read_csv('data/fake/self_include_data.csv')

all.parity.data <- all.parity.data %>%
  group_by(subject) %>%
  mutate(include.trial = (rt <= mean(rt) + 4 * sd(rt)) & (rt >= 250)) %>%
  ungroup()

filtered.parity.data <- all.parity.data %>%
  filter(include.trial == TRUE)

seventy.percent.inclusion <- all.parity.data %>%
  group_by(subject, phase) %>%
  summarize(p.include = sum(include.trial==TRUE) / n()) %>%
  group_by(subject) %>%
  summarize(seventy.percent.include = all(p.include >= 0.7)) # 640 total trials, 640 * 0.7 = 448

parity.acc.inclusion <- all.parity.data %>%
  group_by(phase, subject) %>%
  summarize(n.corr = sum(correct)) %>%
  mutate(include = if_else(phase=="dual", n.corr > 208, n.corr > 141)) %>%
  group_by(subject) %>%
  summarize(parity.include = all(include))

self.inclusion <- post.task.q.data %>%
  mutate(self.include = response == "Yes")

group.rt <- filtered.parity.data %>%
  group_by(subject) %>%
  filter(correct==TRUE) %>%
  summarize(median = median(rt)) %>%
  ungroup() %>%
  summarize(group.median = median(median), group.sd= sd(median))

rt.inclusion <- all.parity.data %>%
  group_by(subject) %>%
  filter(correct==TRUE) %>%
  summarize(median = median(rt)) %>%
  mutate(rt.include = median < (group.rt$group.median + 4*group.rt$group.sd))

mem.inclusion <- all.parity.data %>%
  filter(phase=="dual") %>%
  group_by(subject, block, odd) %>%
  summarize(mem.correct = all(mem.correct)) %>%
  group_by(subject) %>%
  summarize(n.correct = sum(mem.correct)) %>%
  mutate(mem.include = n.correct >= 6)

final.include <- rt.inclusion %>%
  select(subject, rt.include) %>%
  left_join(seventy.percent.inclusion %>% select(subject, seventy.percent.include), by="subject") %>%
  left_join(self.inclusion %>% select(subject, self.include), by="subject") %>%
  left_join(mem.inclusion %>% select(subject, mem.include), by="subject") %>%
  left_join(parity.acc.inclusion %>% select(subject, parity.include), by="subject") %>%
  mutate(include = rt.include & mem.include & parity.include & self.include & seventy.percent.include)

good.subjects <- final.include %>%
  filter(include == TRUE) %>%
  pull(subject)

length(good.subjects)