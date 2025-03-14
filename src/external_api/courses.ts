import { GUILDMETRICS_API_URL } from "astro:env/server";
import type { HandlersCoursesHandlerResponse } from "../myApi";

export const getCourses = async () => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/courses`);
    const { courses }: HandlersCoursesHandlerResponse = await response.json();

    return {
        courses: courses || [],
    };
  } catch (error) {
    return {
        courses: [],
    }
  }
};
