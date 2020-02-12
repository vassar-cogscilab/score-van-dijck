library(retimes)
library(readr)
library(dplyr)

set.seed(12604)

n.subjects <- 185

all.data <- NA

for(i in 1:n.subjects){
  baseline.data <- expand.grid(subject=i, phase="baseline", digit=c(1:4,6:9), rep=1:16, odd=c("left", "right"))
  baseline.data$correct <- sample(c(T,F), 256, replace=T, prob=c(0.95,0.05))
  baseline.data$rt <- round(retimes::rexgauss(256, 300, 100, 200, positive = T))
  baseline.data$mem.correct <- NA
  baseline.data$block <- NA
  
  dual.data <- expand.grid(subject=i, phase="dual", digit=c(1:4,6:9), rep=1:2, block=1:12, odd=c("left","right"))
  dual.data$correct <- sample(c(T,F), nrow(dual.data), replace=T, prob=c(0.95,0.05))
  dual.data$rt <- round(retimes::rexgauss(nrow(dual.data), 300, 100, 200, positive=T))
  dual.data <- dual.data %>%
    group_by(block, odd) %>%
    mutate(mem.correct = sample(c(T,F), 1, prob=c(0.85, 0.15))) %>%
    ungroup()
    
  
  subject.data <- rbind(baseline.data, dual.data)

  if(i %% 2 == 0){
    subject.data$wmtask <- "verbal"
  } else {
    subject.data$wmtask <- "spatial"
  }
  
  if(all(is.na(all.data))){
    all.data <- subject.data
  } else {
    all.data <- rbind(all.data, subject.data)
  }
}

all.data <- all.data %>%
  mutate(parity = if_else(digit %% 2 == 0,"even", "odd")) %>%
  mutate(targetkey = if_else(odd == "left",
                             if_else(parity == "odd", "left", "right"),
                             if_else(parity == "even", "left", "right")))


write_csv(all.data, path="data/fake/testing_data.csv")

