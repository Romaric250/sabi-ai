"use client";

export const roadMapApi = {
  getUserRoadmaps: async (userId: string) => {
    const response = await fetch(`/api/user-roadmap`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    return data;
  },
};
