import { GUILDMETRICS_API_URL } from "astro:env/server";
import type { HandlersAchievementsHandlerResponse } from "../myApi";

export const getAchievements = async () => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/achievements`);
    const { achievements }: HandlersAchievementsHandlerResponse = await response.json();

    return {
        achievements: achievements || [],
    };
  } catch (error) {
    return {
        achievements: [],
    }
  }
};
