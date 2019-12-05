library(retimes)

n.subjects <- 40

all.data <- NA

for(i in 1:n.subjects){
  baseline.data <- expand.grid(subject=i, phase="baseline", digit=c(1:4,6:9), rep=1:16, odd=c("left", "right"))
  baseline.data$correct <- sample(c(T,F), 256, replace=T, prob=c(0.95,0.5))
  baseline.data$rt <- round(retimes::rexgauss(256, 300, 100, 200, positive = T))
  
  dual.data <- expand.grid(subject=i, phase=dual, digit=c(1:4,6:9), rep=1:12, odd=c("left","right"))
  if(i %% 2 == 0){
    dual.data$wmtask <- "verbal"
  } else {
    dual.data$wmtask <- "spatial"
  }
  
  if(any(is.na(all.data))){
    all.data <- baseline.data
  } else {
    all.data <- rbind(all.data, baseline.data)
  }
}