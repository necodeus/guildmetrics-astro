import { GUILDMETRICS_API_URL } from "astro:env/server";
import type { HandlersCombinedCalendarResponse, HandlersIndexResponse, HandlersUserUserResponse } from "../myApi";

const sortByXP = (users: HandlersUserUserResponse[]) => {
  return users.sort((a, b) => {
    if (a.xp !== undefined && b.xp !== undefined) {
      return b.xp - a.xp;
    }

    return 0;
  });
};

export const getUsers = async () => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/index`);
    const {
      organizations,
      users,
      achievements,
      courses,
    }: HandlersIndexResponse = await response.json();

    return {
      organizations,
      users: users ? sortByXP(users) : [],
      achievements,
      courses,
    };
  } catch (error) {
    return {
      organizations: [],
      users: [],
      achievements: [],
      courses: [],
    };
  }
};

export const getCalendar = async () => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/calendar`);
    const data: HandlersCombinedCalendarResponse = await response.json();

    return data;
  } catch (error) {
    return {
      calendar: {},
      github_calendar: {},
      handlers: {},
    } as HandlersCombinedCalendarResponse;
  }
};
