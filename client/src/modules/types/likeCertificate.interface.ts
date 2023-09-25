export enum LearningStatus {
  NotLearnt = 0,
  Learning = 1,
  Learnt = 2,
}

export interface LikeCertificate {
  learningState: LearningStatus;
}
