set.seed(12604)

max.n <- 500

assigned.condition <- as.vector(replicate(max.n/2, sample(1:2)))

subject.id <- 1:500

output = data.frame(subject_id=subject.id, assigned_condition=assigned.condition)

write.csv(output, file="conditions/assignment.csv", row.names = F)
