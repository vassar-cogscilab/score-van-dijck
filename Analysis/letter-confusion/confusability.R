library(readr)
library(tidyr)

confusion <- read_csv('letter-confusion/conrad1964.csv')

confusion.long <- confusion %>% gather(key="Stimulus", value="Frequency", 2:ncol(confusion))

confusion.wide <- confusion.long %>% spread(Response, Frequency)

rownames(confusion.wide) <- confusion.wide$Stimulus
confusion.wide$Stimulus <- NULL

scaled <- scale(confusion.wide)

kmeans(confusion.wide, centers=12, nstart=25)
