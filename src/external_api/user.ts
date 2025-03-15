import { GUILDMETRICS_API_URL } from "astro:env/server";
import type { HandlersUserHandlerResponse } from "../myApi";

export const getUser = async (slug: string) => {
  try {
    const response = await fetch(`${GUILDMETRICS_API_URL}/user/${slug}`);
    const { user }: HandlersUserHandlerResponse = await response.json();

    return {
      user,
    };
  } catch (error) {
    return {
      user: null,
    };
  }
};
