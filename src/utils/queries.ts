import { GUILDMETRICS_API_URL } from "astro:env/server";
import type { HandlersIndexResponse, HandlersUserResponse } from "../myApi";

const sortByXP = (users: HandlersUserResponse[]) => {
  return users.sort((a, b) => {
    if (a.xp && b.xp) {
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
      users: sortByXP(users || []),
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
