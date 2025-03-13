export type OrganizationType = {
  name: string;
  handle: string;
  numUsedSeats: number;
  numTotalSeats: number;
  createdAt: string;
  expiresAt: string;
}

export type UserType = {
  handle: string;
  firstName: string;
  lastName: string;
  level: number;
  xp: number;
  xpForLevel: number;
  xpTotalForLevel: number;
  lessonsCompleted: number;
  gems: number;
  achievements: any[];
  courses: any[];
  profileImageURL: string;
  userAchievements: any[];
  userCourses: any[];
};

type Response = {
  organizations: OrganizationType[];
  users: UserType[];
  achievements: any[];
  courses: any[];
};

import { GUILDMETRICS_API_URL } from "astro:env/server";

const sortByXP = (users: UserType[] = []) => users.sort((a, b) => b.xp - a.xp);

export const getUsers = async (): Promise<Response> => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/index`);
    const {
        organizations,
        users,
        achievements,
        courses,
    }: Response = await response.json();
  
    return {
      organizations,
      users: sortByXP(users),
      achievements,
      courses,
    }
    
  } catch (error) {
    return {
      organizations: [],
      users: [],
      achievements: [],
      courses: [],
    }
  }
};
