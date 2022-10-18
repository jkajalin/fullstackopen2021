// My old CoursePartEntry type
export interface CoursePartEntry{
  name: string
  exerciseCount: number
}

// new types defined by exercise 9.15
export interface CoursePartBase {
  name: string;
  exerciseCount: number;
  type: string;
}

export interface DescriptionField{
  description: string;
}

export interface CourseNormalPart extends CoursePartBase, DescriptionField {
  type: "normal";
  //description: string;
}

export interface CourseProjectPart extends CoursePartBase {
  type: "groupProject";
  groupProjectCount: number;
}

export interface CourseSubmissionPart extends CoursePartBase, DescriptionField {
  type: "submission";
  //description: string;
  exerciseSubmissionLink: string;
}

export type CoursePart = CourseNormalPart | CourseProjectPart | CourseSubmissionPart;