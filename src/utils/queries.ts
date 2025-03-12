type User = {
  handle: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
  level: number;
  xp: number;
  xp_for_level: number;
  xp_total_for_level: number;
  lessons_solved: number;
  gems: number;
  achievements: any[];
  courses: any[];
};

import {
  ASTRO_GUILDMETRICS_BASE_URL,
  ASTRO_GUILDMETRICS_USER,
  ASTRO_GUILDMETRICS_PASS,
} from "astro:env/server";

export const getUsers = async (): Promise<User[]> => {
  const username = ASTRO_GUILDMETRICS_USER;
  const password = ASTRO_GUILDMETRICS_PASS;

  const headers: HeadersInit = {};
  if (username && password) {
    headers.Authorization = "Basic " + btoa(`${username}:${password}`);
  }
  const response = await fetch(`${ASTRO_GUILDMETRICS_BASE_URL}/users`, {
    headers,
  });
  let users: User[] = await response.json();

  users = users || [];
  users = users.sort((a, b) => {
    if (a.level > b.level) return -1;
    if (a.level < b.level) return 1;
    if (a.xp > b.xp) return -1;
    if (a.xp < b.xp) return 1;

    return 0;
  });

  return users;
};

export const getUnlockedAchievements = (achievements: any = []) => {
  const unlockedAchievements = achievements
    .filter((achievement: any) => achievement.UnlockedAt !== "")
    .reduce((acc: any, achievement: any) => {
      if (
        !acc[achievement.Category] ||
        acc[achievement.Category].Order < achievement.Order
      ) {
        acc[achievement.Category] = achievement;
      }
      return acc;
    }, {});

  return Object.values(unlockedAchievements);
};

export const getCompletedCourses = (courses: any = []) => {
  return courses.filter((course: any) => course.CompletedAt !== "");
};
