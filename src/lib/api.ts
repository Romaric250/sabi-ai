"use client";

export const roadMapApi = {
  getUserRoadmaps: async (userId: string) => {
    const response = await fetch(`/api/roadmap/${userId}`);
    return response.json();
  },
};
