# this script counts the number of included subjects without performing any meaningful analysis
# it will be used to determine whether we have met the necessary sample size

library(readr)
library(dplyr)

all.parity.data <- read_csv('data/fake/testing_data.csv')

group.rt <- all.parity.data %>%
  group_by(subject) %>%
  filter(correct==TRUE) %>%
  summarize(median = median(rt)) %>%
  ungroup() %>%
  summarize(group.median = median(median), group.sd= sd(median))

rt.inclusion <- all.parity.data %>%
  group_by(subject) %>%
  filter(correct==TRUE) %>%
  summarize(median = median(rt)) %>%
  mutate(rt.include = median < (group.rt$group.median + 4*group.rt$group.sd) && median > 250)

mem.inclusion <- all.parity.data %>%
  filter(phase=="dual") %>%
  group_by(subject, block, odd) %>%
  summarize(mem.correct = all(mem.correct)) %>%
  group_by(subject) %>%
  summarize(n.correct = sum(mem.correct)) %>%
  mutate(mem.include = n.correct >= 6)

final.include <- rt.inclusion %>%
  left_join(mem.inclusion, by="subject") %>%
  mutate(include = rt.include && mem.include)

good.subjects <- final.include %>%
  filter(include == TRUE) %>%
  pull(subject)

length(good.subjects)