import { GUILDMETRICS_API_URL } from "astro:env/server";
import type { HandlersCoursesHandlerResponse } from "../myApi";

export const getCourses = async () => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/courses`);
    const { courses, users }: HandlersCoursesHandlerResponse = await response.json();

    return {
        courses: courses || [],
        users: users || [],
    };
  } catch (error) {
    return {
        courses: [],
        users: [],
    }
  }
};
